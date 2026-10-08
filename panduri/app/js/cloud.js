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
  let recovery = false, booted = false;
  const back = () => native() ? REDIRECT_NATIVE : location.origin + location.pathname;   // where the e-mail / provider sends the member back

  function emit() { listeners.forEach(f => { try { f(S, profile); } catch (_) {} }); PD.bus.emit('cloud', { session: S, profile }); }
  function setSession(s) {
    if (s && s.access_token) S = { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at || (Math.floor(Date.now() / 1000) + (s.expires_in || 3600)), user: s.user || (S && S.user) || null };
    else S = null;
    PD.store.set(KEY, S); if (!S) { profile = null; PD.store.set('cloud.profile', null); }
    emit();
  }
  const configured = () => { const c = conf(); return !!(c.url && c.key && (/^https:\/\//.test(c.url) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(c.url))); };

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
    try { r = await fetch(c.url + path, { method: opt.method || 'GET', headers, body: opt.body != null ? JSON.stringify(opt.body) : undefined }); }
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
      let r; try { r = await fetch(c.url + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: c.key, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: used }) }); } catch (_) { throw err('offline'); }
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
    async signOut() { try { await http('/auth/v1/logout', { method: 'POST' }); } catch (_) {} setSession(null); PD.store.set('account.mode', 'local'); },
    /** delete the account and everything stored with it on the server (progress on this device stays) */
    async deleteAccount() { await http('/rest/v1/rpc/delete_my_account', { method: 'POST', body: {} }); setSession(null); PD.store.set('account.mode', 'local'); }
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
    if (S && configured()) { loadProfile().then(() => syncProgress()).catch(() => {}); }
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
    if (profile && profile.display_name && profile.display_name !== PD.account.profile.name) PD.account.setProfile({ name: profile.display_name });
    PD.store.set('cloud.profile', profile); emit();
    return profile;
  }
  async function afterSignIn(name) {
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
  const PKEYS = k => /^(prog\.|sessions$|favorites$|xp$|goalMin$|lefty$|selfLevel$|goals$|daily\.|trainer\.srs$|lessons\.user$|theory\.done$)/.test(k);
  function snapshot() { const o = {}; PD.store.keys().filter(PKEYS).forEach(k => { o[k] = PD.store.get(k, null); }); o.__mt = PD.store.get('progress.mt', {}); return o; }
  // when each synced value last changed on this device (so a newer change wins, and a removal stays removed)
  let applying = false;
  const stamp = k => { if (applying || !PKEYS(k)) return; const mt = PD.store.get('progress.mt', {}); mt[k] = Date.now(); set0('progress.mt', mt); };
  const set0 = PD.store.set.bind(PD.store), del0 = PD.store.del.bind(PD.store);
  PD.store.set = (k, v) => { set0(k, v); stamp(k); };
  PD.store.del = k => { del0(k); stamp(k); };
  /** values where the newest change wins as a whole (settings, favourites, the learner's own lessons) */
  const LWW = k => /^(favorites|goalMin|lefty|selfLevel|goals|lessons\.user)$/.test(k);
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
    setRole: (id, role) => db.rpc('admin_set_role', { target: id, new_role: role })
  };

  /* ---------- community ---------- */
  const people = term => db.rpc('people', { term: term || '' });
  const chat = {
    open: other => db.rpc('open_conversation', { other }),
    list: () => db.rpc('my_conversations', {}),
    /** first load: the newest 200 (oldest first on screen); afterwards everything newer than the last one shown */
    messages: async (conv, after) => after ? db.select('messages', { conversation_id: 'eq.' + conv, select: 'id,sender,body,created_at', order: 'id.asc', limit: '200', id: 'gt.' + after })
      : ((await db.select('messages', { conversation_id: 'eq.' + conv, select: 'id,sender,body,created_at', order: 'id.desc', limit: '200' })) || []).reverse(),
    send: (conv, body) => db.insert('messages', [{ conversation_id: conv, body }])
  };
  const board = {
    list: () => db.select('posts', { select: 'id,author,author_name,title,body,created_at,replies:replies(count)', order: 'created_at.desc', limit: '50' }),
    post: (title, body) => db.insert('posts', [{ title, body }]),
    replies: id => db.select('replies', { post_id: 'eq.' + id, select: 'id,author,author_name,body,created_at', order: 'created_at.asc' }),
    reply: (id, body) => db.insert('replies', [{ post_id: id, body }]),
    remove: id => db.remove('posts', { id: 'eq.' + id })
  };
  const signal = {
    send: (conv, kind, payload) => db.insert('call_signals', [{ conversation_id: conv, kind, payload }], false),
    since: (conv, after) => db.select('call_signals', { conversation_id: 'eq.' + conv, id: 'gt.' + (after || 0), select: 'id,sender,kind,payload,created_at', order: 'id.asc' })
  };

  return {
    boot, auth, db, admin, people, chat, board, signal, syncProgress, pushProgress, loadProfile,
    get configured() { return configured(); },
    get session() { return S; },
    get user() { return S && S.user; },
    get uid() { return uid(); },
    get profile() { return profile; },
    get isAdmin() { return !!(profile && profile.role === 'admin'); },
    get native() { return native(); },
    /** true once after arriving from a password-reset link */
    takeRecovery() { const r = recovery; recovery = false; return r; },
    /** which sign-in methods are switched on in the server (cached; last known value first) */
    async providers() {
      const j = await http('/auth/v1/settings', { auth: false });
      const ex = (j && j.external) || {}; const v = { email: ex.email !== false, phone: !!ex.phone, google: !!ex.google, facebook: !!ex.facebook };
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
