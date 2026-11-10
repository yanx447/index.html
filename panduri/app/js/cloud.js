/* =====================================================================
   Cloud: Supabase over plain HTTPS (Auth + REST), no SDK needed.
   - Auth: email + password, phone (SMS code), Google, Facebook, recovery
   - Profiles (name, level/XP, VIP, role), progress backup, admin tools
   - Community: people, 1:1 messages, help board, call signalling
   Configuration comes from PD.CONFIG (build) or, for setup and testing,
   Settings › Developer › Server (stored on this device only).
   Nothing here pretends: without a configured server every call fails
   with 'no-backend' and the UI says so.
   ===================================================================== */
PD.cloud = (() => {
  const KEY = 'cloud.session', CFG = 'cloud.config';
  const listeners = new Set();
  const conf = () => { const o = PD.store.get(CFG, null) || {}; const b = PD.CONFIG || {}; return { url: (o.url || b.supabaseUrl || '').replace(/\/+$/, ''), key: o.key || b.supabaseKey || '' }; };
  let S = PD.store.get(KEY, null);   // { access_token, refresh_token, expires_at, user }
  let profile = PD.store.get('cloud.profile', null);
  const native = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const REDIRECT_NATIVE = 'com.yanx.panduri://auth';
  let recovery = false, booted = false, arriving = null;   // arriving: the work right after a sign-in (profile + progress sync)
  let checked = null;   // the account whose copy on the server has been read during this launch
  const back = () => native() ? REDIRECT_NATIVE : location.origin + location.pathname;   // where the e-mail / provider sends the member back

  function emit() { listeners.forEach(f => { try { f(S, profile); } catch (_) {} }); PD.bus.emit('cloud', { session: S, profile }); }
  function setSession(s) {
    if (s && s.access_token) S = { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at || (Math.floor(Date.now() / 1000) + (s.expires_in || 3600)), user: s.user || (S && S.user) || null };
    else S = null;
    PD.store.set(KEY, S); if (!S) { profile = null; PD.store.set('cloud.profile', null); }
    emit();
  }
  const configured = () => { const c = conf(); return !!(c.url && c.key && (/^https:\/\//.test(c.url) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(c.url))); };

  /** fetch with a time limit: a slow or silent server can never freeze sign-in, sign-out or sync */
  function tfetch(url, init, ms) {
    const ac = window.AbortController ? new AbortController() : null, tm = ac ? setTimeout(() => ac.abort(), ms || 15000) : 0;
    return fetch(url, Object.assign({}, init, ac ? { signal: ac.signal } : {})).finally(() => clearTimeout(tm));
  }
  /* ---------- low-level HTTP ---------- */
  async function http(path, opt) {
    opt = opt || {};
    const c = conf(); if (!c.url || !c.key) throw err('no-backend');
    if (opt.auth !== false && S && S.expires_at && S.expires_at - 60 < Date.now() / 1000) await refresh().catch(() => {});
    const headers = Object.assign({ apikey: c.key, 'Content-Type': 'application/json' }, opt.headers || {});
    // signed in: the member's token. Not signed in: the legacy anon key is a JWT and goes here too; the newer
    // "publishable" key (sb_publishable_…) is not a JWT and travels only in the apikey header.
    if (opt.auth !== false && S) headers.Authorization = 'Bearer ' + S.access_token;
    else if (/^eyJ/.test(c.key)) headers.Authorization = 'Bearer ' + c.key;
    let r;
    try { r = await tfetch(c.url + path, { method: opt.method || 'GET', headers, body: opt.body != null ? JSON.stringify(opt.body) : undefined }, opt.timeout); }
    catch (e) { throw err('offline'); }
    if (r.status === 401 && opt.auth !== false && S && !opt.retried) { await refresh().catch(() => {}); if (S) return http(path, Object.assign({}, opt, { retried: true })); }
    const txt = await r.text(); let j = null; try { j = txt ? JSON.parse(txt) : null; } catch (_) { j = txt; }
    if (!r.ok) throw err((j && (j.error_code || j.code || j.error)) || 'http-' + r.status, (j && (j.msg || j.message || j.error_description || j.error)) || txt);
    return j;
  }
  function err(code, msg) { const e = new Error(msg || code); e.code = code; return e; }

  /* ---------- auth ---------- */
  /** one refresh at a time; another tab or window may already have refreshed (refresh tokens are single-use) */
  let refreshing = null;
  function refresh() {
    if (refreshing) return refreshing;
    refreshing = (async () => {
      const stored = PD.store.get(KEY, null);
      if (stored && S && stored.refresh_token && stored.refresh_token !== S.refresh_token) { S = stored; if (S.expires_at - 60 > Date.now() / 1000) return; }
      if (!S || !S.refresh_token) throw err('no-session');
      const c = conf(), used = S.refresh_token;
      let r; try { r = await tfetch(c.url + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: c.key, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: used }) }); } catch (_) { throw err('offline'); }
      if (!r.ok) {
        const now = PD.store.get(KEY, null); if (now && now.refresh_token && now.refresh_token !== used) { S = now; return; }   // the other tab won the race: use its session
        if (r.status === 400 || r.status === 401) setSession(null); throw err('refresh');
      }
      setSession(await r.json());
    })().finally(() => { refreshing = null; });
    return refreshing;
  }
  // the same account in another tab or window: follow its sign-in, sign-out and token changes
  window.addEventListener('storage', e => {
    if (e.key !== 'pd2:' + KEY) return;
    const v = PD.store.get(KEY, null), before = S && S.user && S.user.id, after = v && v.user && v.user.id;
    S = v; if (before !== after) { profile = PD.store.get('cloud.profile', null); emit(); }
  });
  const auth = {
    async signUp(email, password, name) {
      const j = await http('/auth/v1/signup', { method: 'POST', auth: false, body: { email, password, data: { display_name: name || '' } } });
      if (j && j.access_token) { setSession(j); await afterSignIn(name); return { session: true }; }
      const u = j && (j.user || j); if (u && Array.isArray(u.identities) && u.identities.length === 0) throw err('user_already_exists');   // the address is taken: no e-mail was sent
      return { verify: true };   // the server asks to confirm the e-mail first
    },
    async signIn(email, password) { setSession(await http('/auth/v1/token?grant_type=password', { method: 'POST', auth: false, body: { email, password } })); await afterSignIn(); return true; },
    async phoneStart(phone) { await http('/auth/v1/otp', { method: 'POST', auth: false, body: { phone, create_user: true } }); return true; },
    async phoneVerify(phone, token) { setSession(await http('/auth/v1/verify', { method: 'POST', auth: false, body: { type: 'sms', phone, token } })); await afterSignIn(); return true; },
    async recover(email) { await http('/auth/v1/recover' + (location.protocol === 'file:' && !native() ? '' : '?redirect_to=' + encodeURIComponent(back())), { method: 'POST', auth: false, body: { email } }); return true; },
    async resend(email) { await http('/auth/v1/resend', { method: 'POST', auth: false, body: { type: 'signup', email } }); return true; },
    async setPassword(password) { await http('/auth/v1/user', { method: 'PUT', body: { password } }); return true; },
    /** Google / Facebook: the provider's own page, then back here with the session in the URL fragment */
    async oauth(provider) {
      const c = conf(); if (!configured()) throw err('no-backend');
      const redirect = back();
      const url = c.url + '/auth/v1/authorize?provider=' + encodeURIComponent(provider) + '&redirect_to=' + encodeURIComponent(redirect);
      const P = window.Capacitor && window.Capacitor.Plugins;
      if (native() && P && P.Browser) { await P.Browser.open({ url }); return 'pending'; }
      location.assign(url); return 'pending';
    },
    /** sign out on this device at once; the server is told in the background (a slow network can't keep you signed in) */
    async signOut() {
      const tok = S && S.access_token, c = conf(), ep = PD.store.get('push.endpoint', null);
      setSession(null); PD.store.set('account.mode', 'local'); refreshing = null; PD.store.del('push.endpoint');
      if (tok && c.url && c.key) {
        // first this device leaves the account's notification list, then the session ends (the token is still good for that one call)
        const H = { apikey: c.key, Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
        const off = ep ? tfetch(c.url + '/rest/v1/rpc/push_unregister', { method: 'POST', headers: H, body: JSON.stringify({ device_endpoint: ep }) }, 6000).catch(() => {}) : Promise.resolve();
        off.finally(() => tfetch(c.url + '/auth/v1/logout', { method: 'POST', headers: { apikey: c.key, Authorization: 'Bearer ' + tok } }, 6000).catch(() => {}));
      }
      return true;
    },
    /** delete the account and everything stored with it on the server (progress on this device stays) */
    async deleteAccount() { await storage.removeMine().catch(() => {}); await http('/rest/v1/rpc/delete_my_account', { method: 'POST', body: {} }); setSession(null); PD.store.set('account.mode', 'local'); PD.store.del('push.endpoint'); }
  };
  /** returning from Google/Facebook (web: URL fragment; app: deep link) */
  function consumeRedirect(href) {
    const i = href.indexOf('#'); if (i < 0) return false;
    const q = new URLSearchParams(href.slice(i + 1));
    if (q.get('error_description')) { PD.ui && PD.ui.toast(q.get('error_description'), 6000); return true; }
    if (!q.get('access_token')) return false;
    setSession({ access_token: q.get('access_token'), refresh_token: q.get('refresh_token'), expires_in: +q.get('expires_in') || 3600 });
    afterSignIn().catch(() => {});
    if (q.get('type') === 'recovery') { if (booted) setTimeout(() => PD.bus.emit('recovery'), 0); else recovery = true; }   // the reset link: ask for the new password
    return true;
  }
  function boot() {
    if (consumeRedirect(location.href)) history.replaceState(null, '', location.pathname + location.search);
    window.addEventListener('hashchange', () => {   // a sign-in / reset link opened in this same tab: the tokens never stay in the address or in the history
      if (!/access_token=|error_description=/.test(location.hash)) return;
      const href = location.href; history.replaceState({ r: (PD.app && PD.app.route) || 'home', p: PD.app ? PD.app.param : null }, '', location.pathname + location.search); consumeRedirect(href);
    });
    const P = window.Capacitor && window.Capacitor.Plugins;
    if (native() && P && P.App) P.App.addListener('appUrlOpen', ev => { if (ev && ev.url && ev.url.indexOf(REDIRECT_NATIVE) === 0) { consumeRedirect(ev.url); try { P.Browser && P.Browser.close(); } catch (_) {} } });
    if (S && configured()) {
      const first = loadProfile().then(() => syncProgress()).catch(() => {});
      // this device does not know whether the account has seen the first-run pages: the server is asked before anything opens
      if (!arriving && !(PD.store.get('onboarded', false) && PD.store.get('intro.done', false))) arriving = first;
    }
    // back to the app after a while (another device may have practised meanwhile)
    document.addEventListener('visibilitychange', () => { if (!document.hidden && S && configured() && Date.now() - lastSync > 60e3) syncProgress().catch(() => {}); });
    booted = true;
  }

  /* ---------- REST helpers ---------- */
  const q = o => Object.keys(o).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(o[k])).join('&');
  const db = {
    select: (t, params) => http('/rest/v1/' + t + '?' + q(params || {})),
    insert: (t, rows, ret) => http('/rest/v1/' + t, { method: 'POST', body: rows, headers: { Prefer: ret === false ? 'return=minimal' : 'return=representation' } }),
    upsert: (t, rows) => http('/rest/v1/' + t, { method: 'POST', body: rows, headers: { Prefer: 'resolution=merge-duplicates,return=representation' } }),
    update: (t, match, patch) => http('/rest/v1/' + t + '?' + q(match), { method: 'PATCH', body: patch, headers: { Prefer: 'return=representation' } }),
    remove: (t, match) => http('/rest/v1/' + t + '?' + q(match), { method: 'DELETE' }),
    rpc: (fn, args) => http('/rest/v1/rpc/' + fn, { method: 'POST', body: args || {} })
  };

  /* ---------- profile, progress, entitlements ---------- */
  const uid = () => S && S.user && S.user.id;
  async function loadProfile() {
    if (!S) return null;
    if (!S.user) { S.user = await http('/auth/v1/user'); PD.store.set(KEY, S); }
    const rows = await db.select('profiles', { id: 'eq.' + uid(), select: '*' });
    profile = rows && rows[0] || null;
    if (profile) { try { profile.owner = !!(await db.rpc('is_owner', {})); } catch (_) { profile.owner = false; } }   // the server decides who the owner is
    if (profile && profile.display_name && profile.display_name !== PD.account.profile.name) PD.account.setProfile({ name: profile.display_name });
    PD.store.set('cloud.profile', profile); emit();
    return profile;
  }
  function afterSignIn(name) { return (arriving = afterSignIn0(name)); }
  async function afterSignIn0(name) {
    await loadProfile().catch(() => null);
    const local = PD.account.profile;
    const patch = {};
    if (profile && !profile.display_name && (name || local.name)) patch.display_name = name || local.name;
    if (profile && local.name && !name && !profile.display_name) patch.display_name = local.name;
    if (Object.keys(patch).length) { const r = await db.update('profiles', { id: 'eq.' + uid() }, patch).catch(() => null); if (r && r[0]) profile = r[0]; }
    if (profile && profile.display_name) PD.account.setProfile({ name: profile.display_name });
    await syncProgress().catch(() => {});
    PD.store.set('account.mode', 'cloud');
    emit();
  }
  /** progress backup. Every record is merged (nothing played on either device is lost); settings take the newer copy.
      The progress on a device belongs to one account: signing in with another account puts it aside, not into the new one. */
  const PKEYS = k => /^(prog\.|sessions$|favorites$|xp$|goalMin$|lefty$|selfLevel$|goals$|daily\.|trainer\.srs$|lessons\.user$|theory\.done$|onboarded$|intro\.done$|ob\.noPanduri$)/.test(k);
  // The first-run pages are once per account, and the record of them travels with the progress. Before this date it stayed
  // on one device only, so an older account with no record on the server has not skipped them: it simply was never asked.
  const FIRST_RUN_RECORDED_SINCE = Date.parse('2026-11-05T19:30:00Z');
  function snapshot() { const o = {}; PD.store.keys().filter(PKEYS).forEach(k => { o[k] = PD.store.get(k, null); }); o.__mt = PD.store.get('progress.mt', {}); return o; }
  // when each synced value last changed on this device (so a newer change wins, and a removal stays removed)
  let applying = false;
  const stamp = k => { if (applying || !PKEYS(k)) return; const mt = PD.store.get('progress.mt', {}); mt[k] = Date.now(); set0('progress.mt', mt); };
  const set0 = PD.store.set.bind(PD.store), del0 = PD.store.del.bind(PD.store);
  PD.store.set = (k, v) => { set0(k, v); stamp(k); if (!applying && (k === 'onboarded' || k === 'intro.done')) schedulePush(); };   // another device must know at once
  PD.store.del = k => { del0(k); stamp(k); };
  /** values where the newest change wins as a whole (settings, favourites, the learner's own lessons) */
  const LWW = k => /^(favorites|goalMin|lefty|selfLevel|goals|lessons\.user|ob\.noPanduri)$/.test(k);
  const union = (a, b, key) => { const m = new Map(); b.concat(a).forEach(x => { if (x != null) m.set(key(x), x); }); return [...m.values()]; };   // local wins on the same key
  function merge(k, a, b, localNewer) {
    if (a == null) return b; if (b == null) return a;
    if (/^prog\./.test(k)) {
      const o = Object.assign({}, (b.last || 0) > (a.last || 0) ? b : a);
      ['plays', 'mastery', 'maxTempo', 'last'].forEach(f => { o[f] = Math.max(a[f] || 0, b[f] || 0); });
      o.stages = Object.assign({}, b.stages || {}); Object.keys(a.stages || {}).forEach(s => { o.stages[s] = Math.max(o.stages[s] || 0, a.stages[s] || 0); });
      o.best = [a.best, b.best].filter(Boolean).sort((x, y) => (y.firstTry || 0) - (x.firstTry || 0))[0] || null;
      return o;
    }
    if (k === 'sessions') return union(a, b, x => x.date + ':' + x.id).sort((x, y) => x.date - y.date).slice(-400);
    if (k === 'xp') return Math.max(+a || 0, +b || 0);
    if (/^daily\./.test(k) || k === 'theory.done') return Object.assign({}, b, a);
    if (k === 'trainer.srs') { const o = Object.assign({}, b); Object.keys(a).forEach(x => { if (!o[x] || (a[x].n || 0) >= (o[x].n || 0)) o[x] = a[x]; }); return o; }
    return localNewer ? a : b;
  }
  let lastSync = 0, syncing = null;
  function syncProgress() { if (!syncing) syncing = sync0().finally(() => { syncing = null; }); return syncing; }
  async function sync0() {
    const me = uid(); if (!S || !me || !configured()) return;
    const owner = PD.store.get('progress.owner', null);
    let switched = false;
    if (owner && owner !== me) {   // the progress here belongs to another account: put it aside, bring this account's back if it was here before
      applying = true;
      try {
        set0('stash.' + owner, snapshot());
        PD.store.keys().filter(PKEYS).forEach(k => del0(k)); del0('progress.at'); del0('progress.mt');
        const back = PD.store.get('stash.' + me, null); if (back) { Object.keys(back).forEach(k => { if (PKEYS(k)) set0(k, back[k]); }); if (back.__mt) set0('progress.mt', back.__mt); del0('stash.' + me); }
      } finally { applying = false; }
      switched = true;
    }
    set0('progress.owner', me);
    const rows = await db.select('progress', { user_id: 'eq.' + me, select: 'data,updated_at' });
    const remote = rows && rows[0];
    let changed = switched, userLessons = switched;
    if (remote && remote.data) {
      const remoteAt = new Date(remote.updated_at).getTime(), localNewer = PD.store.get('progress.at', 0) >= remoteAt;
      const mtL = PD.store.get('progress.mt', {}), mtR = remote.data.__mt || null, mt = Object.assign({}, mtR || {});
      Object.keys(mtL).forEach(k => { mt[k] = Math.max(mt[k] || 0, mtL[k]); });
      applying = true;
      try {
        new Set(Object.keys(remote.data).concat(PD.store.keys()).filter(PKEYS)).forEach(k => {
          const a = PD.store.get(k, null), b = remote.data[k] === undefined ? null : remote.data[k];
          let m;
          if (LWW(k)) { const lt = mtL[k] || 0, rt = mtR ? mtR[k] || 0 : remoteAt; m = lt >= rt ? a : b; }   // the newer change wins — also a removal
          else m = merge(k, a, b, localNewer);
          if (JSON.stringify(m) === JSON.stringify(a)) return;
          if (m == null) del0(k); else set0(k, m);
          changed = true; if (k === 'lessons.user') userLessons = true;
        });
        set0('progress.mt', mt);
      } finally { applying = false; }
    }
    checked = me;
    if (Date.parse(S.user.created_at) < FIRST_RUN_RECORDED_SINCE) ['onboarded', 'intro.done'].forEach(k => { if (!PD.store.get(k, false)) set0(k, true); });
    if (userLessons && PD.lessons.reload) PD.lessons.reload(); else if (changed) PD.bus.emit('lessons');
    lastSync = Date.now();
    await pushProgress();
  }
  let pushT = 0;
  async function pushProgress() {
    if (!S || !configured()) return;
    const at = Date.now(); PD.store.set('progress.at', at);
    const xp = PD.levels ? PD.levels.xp : 0, lv = PD.levels ? PD.levels.level : 0;
    await db.upsert('progress', [{ user_id: uid(), data: snapshot(), updated_at: new Date(at).toISOString() }]);
    await db.update('profiles', { id: 'eq.' + uid() }, { xp, level: lv, last_seen: new Date().toISOString() }).catch(() => {});
  }
  function schedulePush() { clearTimeout(pushT); pushT = setTimeout(() => syncProgress().catch(() => {}), 4000); }   // merge with the server copy first, then upload
  PD.bus.on('session', schedulePush);

  /* ---------- admin (server checks the role; the UI only shows what the server allows) ---------- */
  const admin = {
    users: (term) => db.rpc('admin_list_users', { term: term || '' }),
    setVip: (id, until, plan) => db.rpc('admin_set_vip', { target: id, until, plan: plan || 'vip' }),
    setRole: (id, role) => db.rpc('admin_set_role', { target: id, new_role: role }),
    premium: (id, action) => db.rpc('admin_premium', { target: id, action })
  };

  /* ---------- community ---------- */
  const people = term => db.rpc('people', { term: term || '' });
  // a server without the community upgrade has none of the newer columns: the chat then keeps working with text only
  let MSG = 'id,sender,body,created_at,media_path,thumb_path,media_kind,media_meta,post_ref,sticker,gif';
  const LEGACY = 'id,sender,body,created_at';
  const old = e => e && (e.code === '42703' || e.code === 'PGRST204' || /does not exist|column/i.test(e.message || ''));
  const sel = async q => { try { return await db.select('messages', Object.assign({}, q, { select: MSG })); } catch (e) { if (MSG !== LEGACY && old(e)) { MSG = LEGACY; return db.select('messages', Object.assign({}, q, { select: MSG })); } throw e; } };
  const chat = {
    open: other => db.rpc('open_conversation', { other }),
    list: () => db.rpc('my_conversations', {}),
    /** first load: the newest 200 (oldest first on screen); afterwards everything newer than the last one shown */
    messages: async (conv, after) => after ? sel({ conversation_id: 'eq.' + conv, order: 'id.asc', limit: '200', id: 'gt.' + after })
      : ((await sel({ conversation_id: 'eq.' + conv, order: 'id.desc', limit: '200' })) || []).reverse(),
    /** false: the server has not been upgraded yet (text-only chat) */
    get rich() { return MSG !== LEGACY; },
    /** extra: { media_path, thumb_path, media_kind, media_meta } · { post_ref } · { sticker } · { gif, media_meta } */
    send: (conv, body, extra) => db.insert('messages', [Object.assign({ conversation_id: conv, body: body || '' }, extra || {})]),
    react: (msg, emoji) => db.rpc('react_message', { msg, emoji: emoji || null }),
    reactions: conv => db.select('message_reactions', { conversation_id: 'eq.' + conv, select: 'message_id,user_id,emoji' }),
    read: conv => db.rpc('chat_mark_read', { conv }),
    other: async conv => { const r = (await db.select('conversations', { id: 'eq.' + conv, select: 'a,b' }))[0]; return r.a === uid() ? r.b : r.a; }
  };
  const moderation = {
    report: (kind, id, why) => db.rpc('report_content', { item_kind: kind, item_ref: String(id), why }),
    blocks: () => db.rpc('my_blocks', {}),
    block: other => db.insert('blocks', [{ blocked: other }], false),
    unblock: other => db.remove('blocks', { blocked: 'eq.' + other }),
    reports: () => db.rpc('admin_open_reports', {}),
    resolve: (id, decision) => db.rpc('admin_resolve_report', { report_id: id, decision })
  };
  const board = {
    list: () => db.select('posts', { select: 'id,author,author_name,title,body,created_at,media_path,thumb_path,media_kind,media_meta,replies:replies(count)', order: 'created_at.desc', limit: '50' }),
    post: (title, body, media) => db.insert('posts', [Object.assign({ title, body }, media || {})]),
    replies: id => db.select('replies', { post_id: 'eq.' + id, select: 'id,author,author_name,body,created_at', order: 'created_at.asc' }),
    reply: (id, body) => db.insert('replies', [{ post_id: id, body }]),
    remove: id => db.remove('posts', { id: 'eq.' + id })
  };
  /* ---------- friends by nickname, the feed ---------- */
  const social = {
    setNick: nick => db.rpc('set_nickname', { nick }),
    find: nick => db.rpc('find_nickname', { nick }),
    friends: () => db.rpc('my_friends', {}),
    request: nick => db.rpc('friend_request', { nick }),
    respond: (other, yes) => db.rpc('friend_respond', { other, accept: !!yes }),
    unfriend: other => db.rpc('friend_remove', { other }),
    /** tab: 'foryou' · 'friends' · 'user' · 'one' */
    feed: (tab, o) => { o = o || {}; return db.rpc('feed', { tab, lim: o.lim || 8, before_id: o.before || null, target: o.target || null, skip_ids: o.skip && o.skip.length ? o.skip.slice(-300) : null }); },
    /** a server that has not learned the song's name yet still takes the video */
    post: async row => { try { return (await db.insert('feed_posts', [row]))[0]; } catch (e) { if (!('song' in row) || !old(e)) throw e; const r = Object.assign({}, row); delete r.song; return (await db.insert('feed_posts', [r]))[0]; } },
    save: (post, keep) => db.rpc('save_post', { post, keep: !!keep }),
    remove: id => db.remove('feed_posts', { id: 'eq.' + id }),
    react: (post, emoji) => db.rpc('react_post', { post, emoji: emoji || null }),
    seen: ids => db.rpc('feed_seen', { ids }),
    comments: post => db.select('feed_comments', { post_id: 'eq.' + post, select: 'id,author,author_name,body,created_at', order: 'id.asc', limit: '300' }),
    comment: (post, body) => db.insert('feed_comments', [{ post_id: post, body }]),
    uncomment: id => db.remove('feed_comments', { id: 'eq.' + id })
  };
  /* ---------- the members' photos, videos and audio (the private 'social' bucket; the server decides who may read each file) ---------- */
  const BUCKET = 'social', signed = new Map();   // path → { url, until }
  const storage = {
    /** upload with progress; resolves with the stored path */
    async upload(path, blob, onProgress) {
      const c = conf(); if (!c.url || !c.key) throw err('no-backend'); if (!S) throw err('no-session');
      if (S.expires_at && S.expires_at - 120 < Date.now() / 1000) await refresh().catch(() => {});
      return new Promise((res, rej) => {
        const x = new XMLHttpRequest();
        x.open('POST', c.url + '/storage/v1/object/' + BUCKET + '/' + path.split('/').map(encodeURIComponent).join('/'));
        x.setRequestHeader('apikey', c.key); x.setRequestHeader('Authorization', 'Bearer ' + S.access_token);
        x.setRequestHeader('Content-Type', blob.type || 'application/octet-stream'); x.setRequestHeader('x-upsert', 'false'); x.setRequestHeader('cache-control', '31536000');
        if (onProgress) x.upload.onprogress = e => { if (e.lengthComputable) onProgress(e.loaded / e.total); };
        x.onload = () => { if (x.status >= 200 && x.status < 300) res(path); else { let j = null; try { j = JSON.parse(x.responseText); } catch (_) {} rej(err(x.status === 413 || /too large|exceeded/i.test(x.responseText) ? 'too-large' : (j && (j.error || j.statusCode)) || 'http-' + x.status, j && j.message)); } };
        x.onerror = () => rej(err('offline'));
        x.send(blob);
      });
    },
    /** short-lived addresses for files the server lets this account read (cached until shortly before they expire) */
    async urls(paths) {
      const now = Date.now(), want = [...new Set((paths || []).filter(Boolean))].filter(p => !(signed.get(p) && signed.get(p).until > now + 60e3));
      for (let i = 0; i < want.length; i += 100) {
        const rows = await http('/storage/v1/object/sign/' + BUCKET, { method: 'POST', body: { expiresIn: 3 * 3600, paths: want.slice(i, i + 100) } });
        (rows || []).forEach(r => { if (r && r.signedURL && !r.error) signed.set(r.path, { url: conf().url + '/storage/v1' + r.signedURL, until: now + 3 * 3600e3 }); });
      }
      const o = {}; (paths || []).forEach(p => { const v = p && signed.get(p); if (v) o[p] = v.url; }); return o;
    },
    url: p => { const v = signed.get(p); return v ? v.url : null; },
    remove: paths => paths && paths.length ? http('/storage/v1/object/' + BUCKET, { method: 'DELETE', body: { prefixes: paths } }) : Promise.resolve(),
    /** every file of this account (before the account itself is deleted) */
    async removeMine() {
      const me = uid(); if (!me) return;
      for (const dir of ['p', 'c', 'h']) {
        const rows = await http('/storage/v1/object/list/' + BUCKET, { method: 'POST', body: { prefix: me + '/' + dir + '/', limit: 1000 } }).catch(() => []);
        const names = (rows || []).filter(r => r && r.id).map(r => me + '/' + dir + '/' + r.name);
        if (names.length) await storage.remove(names);
      }
    }
  };
  /* ---------- Sima's notifications: the server writes them, every signed-in device reads and receives them ---------- */
  const notes = {
    since: after => db.select('notifications', Object.assign({ select: 'id,kind,actor,params,title,body,go,tag,created_at,read_at', order: 'id.desc', limit: '60' }, after ? { id: 'gt.' + after } : {})),
    /** ids: the server ids read; none: all */
    read: ids => db.rpc('notifications_read', { ids: ids && ids.length ? ids : null }),
    status: ids => db.select('notifications', { id: 'in.(' + ids.join(',') + ')', read_at: 'not.is.null', select: 'id' }),
    clear: () => db.rpc('notifications_clear', {}),
    settings: s => db.rpc('save_notify_settings', { s }),
    test: () => db.rpc('sima_test', {}),
    announce: (version, ka, en) => db.rpc('announce_release', { version, note_ka: ka || '', note_en: en || '' }),
    register: (kind, endpoint, p256dh, auth, lang, label) => db.rpc('push_register', { device_kind: kind, device_endpoint: endpoint, key_p256dh: p256dh || null, key_auth: auth || null, device_lang: lang || null, device_label: label || null }),
    unregister: endpoint => db.rpc('push_unregister', { device_endpoint: endpoint }),
    devices: () => db.select('push_devices', { select: 'id,kind,label,created_at,last_ok', order: 'created_at.desc' }),
    /** the public half of the server's Web Push key */
    vapid: () => http('/functions/v1/push?vapid=1', { auth: false, timeout: 12000 })
  };
  /* ---------- GIFs: through the server's gifs function (it keeps the GIPHY key) ---------- */
  const gifs = {
    probe: () => http('/functions/v1/gifs?probe=1', { auth: false, timeout: 8000 }),
    search: (q, lang) => http('/functions/v1/gifs?q=' + encodeURIComponent(q || '') + '&lang=' + encodeURIComponent(lang || 'en'), { timeout: 12000 })
  };
  const signal = {
    send: (conv, kind, payload) => db.insert('call_signals', [{ conversation_id: conv, kind, payload }], false),
    since: (conv, after) => db.select('call_signals', { conversation_id: 'eq.' + conv, id: 'gt.' + (after || 0), select: 'id,sender,kind,payload,created_at', order: 'id.asc' })
  };

  return {
    boot, auth, db, admin, people, chat, board, moderation, signal, social, storage, notes, gifs, syncProgress, pushProgress, loadProfile,
    sima: body => http('/functions/v1/sima', { method: 'POST', body, timeout: 45000 }),
    billing: body => http('/functions/v1/billing', { method: 'POST', body, timeout: 65000 }),
    get configured() { return configured(); },
    get session() { return S; },
    get user() { return S && S.user; },
    get uid() { return uid(); },
    get profile() { return profile; },
    get isAdmin() { return !!(profile && profile.role === 'admin'); },
    /** the app's owner: the only account that manages premium (checked again by the server on every change) */
    get isOwner() { return !!(profile && profile.owner); },
    get native() { return native(); },
    /** true once after arriving from a password-reset link */
    takeRecovery() { const r = recovery; recovery = false; return r; },
    /** the sign-in that just happened: resolves when the profile and progress have arrived (null when nothing is pending) */
    get arriving() { return arriving; },
    /** this launch has read the signed-in account's copy from the server, so what is stored here is what the account knows */
    get accountChecked() { return !!uid() && checked === uid(); },
    /** which sign-in methods are switched on in the server (cached; last known value first) */
    async providers() {
      const j = await http('/auth/v1/settings', { auth: false });
      const ex = (j && j.external) || {}; const v = { email: ex.email !== false, phone: !!ex.phone, google: !!ex.google, facebook: !!ex.facebook, apple: !!ex.apple };
      PD.store.set('auth.providers', v); return v;
    },
    get knownProviders() { return PD.store.get('auth.providers', null); },
    config: conf,
    setConfig(c) { PD.store.set(CFG, c && (c.url || c.key) ? { url: (c.url || '').trim(), key: (c.key || '').trim() } : null); emit(); },
    on(f) { listeners.add(f); return () => listeners.delete(f); }
  };
})();

/* the account contract (core.js) now has a real implementation when a server is configured */
if (PD.cloud.configured) PD.account.configure({
  signUpEmail: (e, p, n) => PD.cloud.auth.signUp(e, p, n), signInEmail: (e, p) => PD.cloud.auth.signIn(e, p), signOut: () => PD.cloud.auth.signOut(),
  signInProvider: p => PD.cloud.auth.oauth(p), resetPassword: e => PD.cloud.auth.recover(e), session: async () => PD.cloud.session
});
