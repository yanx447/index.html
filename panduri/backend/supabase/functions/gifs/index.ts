// GIF search through GIPHY for the chats and for profile photos and banners. The key stays here.
// GET ?probe=1                          → { on } — a key is set and GIPHY accepts it (checked at most every 30 min)
// GET ?q=…&lang=ka&use=chat&page=0      → a signed-in member's search (trending when q is empty), rated G
//     use=avatar|banner keeps only GIFs good enough to be a profile photo or a banner
// GET ?config=1&platform=web            → kept for builds that call GIPHY themselves
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};
const reply = (status: number, body: unknown, cache = 'no-store') => new Response(JSON.stringify(body), {
  status,
  headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': cache },
});
const env = (() => { try { return Deno.env.toObject(); } catch { return {} as Record<string, string>; } })();
const clean = (v?: string) => (v || '').trim().replace(/[^A-Za-z0-9]/g, '');
// whichever name the key was saved under in the dashboard
const KEY = clean(['GIPHY_API_KEY', 'GIPHY_WEB_API_KEY', 'GIPHY_KEY', 'GIPHY'].map(n => env[n]).find(Boolean)
  || Object.entries(env).find(([n, v]) => /GIPHY/i.test(n) && clean(v))?.[1]);
const platformKeys: Record<string, string> = {
  web: 'GIPHY_WEB_API_KEY', ios: 'GIPHY_IOS_API_KEY', android: 'GIPHY_ANDROID_API_KEY', electron: 'GIPHY_DESKTOP_API_KEY',
};
const supabaseUrl = env.SUPABASE_URL || '';
const anonKey = env.SUPABASE_ANON_KEY || '';
const PAGE = 36, MB = 1048576;

let checked = 0, works = false;
async function keyWorks() {
  if (!KEY) return false;
  if (Date.now() - checked < 30 * 60e3) return works;
  const r = await fetch('https://api.giphy.com/v1/gifs/trending?limit=1&rating=g&api_key=' + KEY, { signal: AbortSignal.timeout(8000) }).catch(() => null);
  // a rate limit or an outage says nothing about the key: keep the last answer, ask again soon
  if (!r || r.status === 429 || r.status >= 500) { checked = Date.now() - 25 * 60e3; return works || !!r; }
  checked = Date.now(); works = r.ok; return works;
}

type Img = { url?: string; width?: string; height?: string; size?: string; webp?: string; mp4?: string; mp4_size?: string };
type Gif = { id: string; title?: string; user?: { display_name?: string; username?: string }; username?: string; images?: Record<string, Img> };
const num = (v?: string) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };
const https = (u?: string) => u && /^https:\/\/(media[0-9]*|i)\.giphy\.com\//.test(u) ? u.split('?')[0] : '';
const pick = (im: Record<string, Img>, names: string[], max: number) => {
  for (const n of names) { const r = im[n]; const url = https(r?.url); if (url && num(r?.size) && num(r?.size) <= max) return { url, size: num(r?.size), w: num(r?.width), h: num(r?.height) }; }
  return null;
};

function row(g: Gif, use: string) {
  const im = g.images || {}, o = im.original || {}, W = num(o.width), H = num(o.height);
  // quality: nothing tiny or a thin strip; a photo needs a real square middle, a banner a wide picture
  if (!W || !H || Math.max(W, H) < 240 || Math.min(W, H) < 140 || W / H > 3.2 || H / W > 2.4) return null;
  if (use === 'avatar' && Math.min(W, H) < 200) return null;
  if (use === 'banner' && (W < 400 || W / H < 1.15)) return null;
  const tile = im.fixed_width || im.fixed_width_downsampled, tw = num(tile?.width), th = num(tile?.height);
  const preview = https(tile?.webp) || https(tile?.url);
  const chat = pick(im, ['downsized', 'downsized_medium', 'fixed_width'], 2.5 * MB) || pick(im, ['fixed_width'], 8 * MB);
  if (!preview || !chat) return null;
  const gif = pick(im, ['downsized_medium', 'downsized', 'original', 'downsized_large', 'fixed_height', 'fixed_width'], 4 * MB);
  const big = pick(im, ['original', 'downsized_large', 'downsized_medium', 'downsized'], 10 * MB);
  const mp4u = https(o.mp4), mp4 = mp4u && num(o.mp4_size) && num(o.mp4_size) <= 10 * MB ? { url: mp4u, size: num(o.mp4_size), w: W, h: H } : null;
  if (use === 'avatar' && !gif) return null;
  if (use === 'banner' && !mp4 && !big) return null;
  const by = g.user?.display_name || g.user?.username || g.username || '';
  return {
    id: g.id, title: (g.title || '').slice(0, 80), preview, pw: tw || W, ph: th || H,
    url: chat.url, w: chat.w || W, h: chat.h || H, credit: by ? ('GIPHY · ' + by).slice(0, 60) : 'GIPHY',
    gif, big, mp4,
  };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'GET') return reply(405, { error: 'method' });
  const u = new URL(req.url), p = u.searchParams;
  if (p.has('probe')) return reply(200, { on: await keyWorks() }, 'public, max-age=120');

  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return reply(401, { error: 'sign-in-required' });
  const who = await fetch(supabaseUrl + '/auth/v1/user', { headers: { apikey: anonKey, authorization: auth }, signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!who) return reply(503, { error: 'gifs-unavailable' });
  if (!who.ok) return reply(401, { error: 'sign-in-required' });

  if (p.has('config')) {
    const platform = p.get('platform') || 'web';
    if (!Object.hasOwn(platformKeys, platform)) return reply(400, { error: 'platform' });
    const apiKey = clean(env[platformKeys[platform]]) || KEY;
    return reply(200, apiKey ? { on: true, apiKey } : { on: false });
  }

  if (!KEY) return reply(503, { error: 'not-configured' });
  const q = (p.get('q') || '').slice(0, 60).trim(), lang = (p.get('lang') || 'en').slice(0, 5).replace(/[^a-z-]/gi, '') || 'en';
  const use = ['avatar', 'banner'].includes(p.get('use') || '') ? p.get('use')! : 'chat';
  const page = Math.max(0, Math.min(12, Math.floor(Number(p.get('page')) || 0)));
  const api = new URL('https://api.giphy.com/v1/gifs/' + (q ? 'search' : 'trending'));
  api.searchParams.set('api_key', KEY); api.searchParams.set('limit', String(PAGE)); api.searchParams.set('offset', String(page * PAGE));
  api.searchParams.set('rating', 'g');
  if (q) { api.searchParams.set('q', q); api.searchParams.set('lang', lang); }
  const r = await fetch(api, { signal: AbortSignal.timeout(10000) }).catch(() => null);
  if (r?.status === 429) return reply(429, { error: 'gifs-rate-limit' });
  if (r?.status === 401 || r?.status === 403) { checked = Date.now(); works = false; return reply(503, { error: 'not-configured' }); }
  if (!r || !r.ok) return reply(502, { error: 'gifs-unavailable' });
  const j = await r.json().catch(() => null);
  const seen = new Set<string>();
  const rows = (Array.isArray(j?.data) ? j.data as Gif[] : []).map(g => row(g, use)).filter(x => x && !seen.has(x.id) && seen.add(x.id));
  return reply(200, rows, 'private, max-age=120');
});
