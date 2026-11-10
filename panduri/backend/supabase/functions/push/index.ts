// Sima's notifications, delivered. The database calls this function (pg_net, with a secret only the database and
// this function can read) whenever it writes a notification; it sends each one to every device of that account:
// browsers and the installed PWA by Web Push, the native app by FCM once the owner has configured it.
// GET ?vapid=1 returns the public half of the Web Push key, which the app needs to subscribe. The key pair is made
// here on first use and kept in server_config: the private half never leaves the server.
import { vapidKeys, send as webSend } from '../_shared/webpush.js';
import { send as fcmSend } from '../_shared/fcm.js';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' };
const reply = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra } });

const URL0 = Deno.env.get('SUPABASE_URL') || '';
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const APP = Deno.env.get('APP_URL') || '';
const SUBJECT = Deno.env.get('PUSH_SUBJECT') || (APP ? new URL(APP).origin : URL0);
const rest = (path: string, init: RequestInit = {}) => fetch(URL0 + '/rest/v1/' + path, {
  ...init, signal: AbortSignal.timeout(10000),
  headers: { apikey: SERVICE, Authorization: 'Bearer ' + SERVICE, 'Content-Type': 'application/json', ...(init.headers || {}) },
});
const json = async (r: Response) => { if (!r.ok) throw new Error(r.status + ' ' + await r.text()); return r.json(); };

let keys: { publicKey: string; privateJwk: JsonWebKey } | null = null;
async function loadKeys() {
  if (keys) return keys;
  const read = async () => {
    const rows = await json(await rest('server_config?key=in.(vapid_public,vapid_private)&select=key,value'));
    const m = Object.fromEntries(rows.map((r: { key: string; value: string }) => [r.key, r.value]));
    return m.vapid_public && m.vapid_private ? { publicKey: m.vapid_public, privateJwk: JSON.parse(m.vapid_private) } : null;
  };
  keys = await read();
  if (!keys) {
    const k = await vapidKeys();
    await rest('server_config', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify([{ key: 'vapid_public', value: k.publicKey }, { key: 'vapid_private', value: JSON.stringify(k.privateJwk) }]) });
    keys = await read();   // two first calls at once: both keep the pair that was saved first
  }
  return keys;
}

let secret: string | null = null;
async function hookSecret() {
  if (secret) return secret;
  secret = await json(await rest('rpc/push_hook_secret', { method: 'POST', body: '{}' }));
  return secret;
}
function same(a: string, b: string) { if (!a || !b || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

// which switch in Settings › Notifications each kind belongs to
const CAT: Record<string, string> = { message: 'social', chat_reaction: 'social', friend_request: 'social', friend_accept: 'social',
  friend_post: 'feed', post_reaction: 'feed', comment: 'feed', record: 'records', record_app: 'records', record_top: 'records',
  reminder: 'practice', streak: 'practice', weekly: 'practice', idle: 'idle', update: 'news', test: '' };
const URGENT = new Set(['message', 'chat_reaction', 'friend_request', 'friend_accept', 'test']);
function quiet(tz: string) {
  try { const h = +new Intl.DateTimeFormat('en-US', { timeZone: tz || 'Asia/Tbilisi', hour: 'numeric', hourCycle: 'h23' }).format(new Date()); return h >= 23 || h < 8; }
  catch { return false; }
}
const fcmAccount = (() => { try { const s = Deno.env.get('FCM_SERVICE_ACCOUNT'); return s ? JSON.parse(s) : null; } catch { return null; } })();

type Note = { id: number; user_id: string; kind: string; title: string; body: string; go: string | null; tag: string | null };
type Device = { id: number; user_id: string; kind: string; endpoint: string; p256dh: string; auth: string };
type Pref = { user_id: string; enabled: boolean; kinds: Record<string, boolean>; quiet: boolean; tz: string };

async function deliver(ids: number[]) {
  const list = ids.filter(n => Number.isInteger(n)).slice(0, 500);
  if (!list.length) return { sent: 0 };
  const notes: Note[] = await json(await rest('notifications?pushed_at=is.null&id=in.(' + list.join(',') + ')&select=id,user_id,kind,title,body,go,tag'));
  if (!notes.length) return { sent: 0 };
  const users = [...new Set(notes.map(n => n.user_id))].join(',');
  const [prefs, devices]: [Pref[], Device[]] = await Promise.all([
    json(await rest('notify_settings?user_id=in.(' + users + ')&select=user_id,enabled,kinds,quiet,tz')),
    json(await rest('push_devices?user_id=in.(' + users + ')&select=id,user_id,kind,endpoint,p256dh,auth')),
  ]);
  const pref = new Map(prefs.map(p => [p.user_id, p]));
  const k = devices.some(d => d.kind === 'web') ? await loadKeys() : null;
  const ok = new Set<number>(), gone = new Set<number>();
  let sent = 0;
  const jobs: (() => Promise<void>)[] = [];
  for (const n of notes) {
    const p = pref.get(n.user_id), cat = CAT[n.kind] ?? 'news';
    if (p && n.kind !== 'test' && (!p.enabled || (cat && p.kinds && p.kinds[cat] === false) || (p.quiet && quiet(p.tz)))) continue;
    const payload = { id: n.id, title: n.title, body: n.body, go: n.go, tag: n.tag || n.kind, kind: n.kind };
    for (const d of devices.filter(x => x.user_id === n.user_id)) {
      jobs.push(async () => {
        let status = 0;
        try {
          if (d.kind === 'web' && k) status = await webSend(d, payload, k, SUBJECT, { urgency: URGENT.has(n.kind) ? 'high' : 'normal', topic: n.tag || undefined });
          else if (d.kind === 'fcm' && fcmAccount) status = await fcmSend(fcmAccount, d.endpoint, payload);
          else return;   // apns, or fcm without the owner's Firebase project: the app shows it when opened
        } catch (e) { console.warn('push', d.kind, String(e)); return; }
        if (status === 404 || status === 410) gone.add(d.id);
        else if (status >= 200 && status < 300) { ok.add(d.id); sent++; }
        else console.warn('push', d.kind, status);
      });
    }
  }
  for (let i = 0; i < jobs.length; i += 20) await Promise.all(jobs.slice(i, i + 20).map(f => f()));
  const now = new Date().toISOString();
  await rest('notifications?id=in.(' + notes.map(n => n.id).join(',') + ')', { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ pushed_at: now }) });
  if (gone.size) await rest('push_devices?id=in.(' + [...gone].join(',') + ')', { method: 'DELETE' });
  if (ok.size) await rest('push_devices?id=in.(' + [...ok].join(',') + ')', { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ last_ok: now, fails: 0 }) });
  return { sent, gone: gone.size };
}

/** once a day: files that no post, message or question uses any more are deleted (the database cannot delete storage files itself) */
async function cleanup() {
  const names: string[] = await json(await rest('rpc/orphan_media', { method: 'POST', body: JSON.stringify({ lim: 500 }) }));
  for (let i = 0; i < names.length; i += 100) {
    await fetch(URL0 + '/storage/v1/object/social', { method: 'DELETE', signal: AbortSignal.timeout(20000),
      headers: { apikey: SERVICE, Authorization: 'Bearer ' + SERVICE, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: names.slice(i, i + 100) }) });
  }
  return { removed: names.length };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (!URL0 || !SERVICE) return reply(503, { error: 'not-configured' });
  try {
    const u = new URL(req.url);
    if (req.method === 'GET' && u.searchParams.has('vapid')) {
      const kp = await loadKeys();
      return reply(200, { key: kp!.publicKey, fcm: !!fcmAccount }, { 'Cache-Control': 'public, max-age=3600' });
    }
    if (req.method !== 'POST') return reply(405, { error: 'method' });
    if (!same(req.headers.get('x-push-secret') || '', await hookSecret() || '')) return reply(401, { error: 'unauthorized' });
    const body = await req.json().catch(() => ({}));
    if (body.cleanup) return reply(200, await cleanup());
    return reply(200, await deliver(Array.isArray(body.ids) ? body.ids.map(Number) : []));
  } catch (e) {
    console.error('push', e);
    return reply(500, { error: 'failed' });
  }
});
