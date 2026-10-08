/* =====================================================================
   PD core: namespace, event bus, i18n, persistence, account adapter,
   music theory (tunings as data, 17-fret math, chords).
   ===================================================================== */
'use strict';
const PD = window.PD = window.PD || {};

/* ---------- tiny event bus ---------- */
PD.bus = (() => {
  const map = {};
  return {
    on(ev, fn) { (map[ev] = map[ev] || []).push(fn); return () => { map[ev] = map[ev].filter(f => f !== fn); }; },
    emit(ev, data) { (map[ev] || []).slice().forEach(fn => { try { fn(data); } catch (e) { console.error(ev, e); } }); }
  };
})();

/* ---------- persistence (local adapter; remote adapter is an interface) ---------- */
PD.store = (() => {
  const NS = 'pd2:', mem = {};
  let ok = true;
  try { localStorage.setItem(NS + 't', '1'); localStorage.removeItem(NS + 't'); } catch (_) { ok = false; }
  return {
    persistent: ok,
    get(k, d) { try { const v = ok ? localStorage.getItem(NS + k) : mem[k]; return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { const s = JSON.stringify(v); if (ok) { try { localStorage.setItem(NS + k, s); return; } catch (_) {} } mem[k] = s; },
    del(k) { try { if (ok) localStorage.removeItem(NS + k); } catch (_) {} delete mem[k]; },
    keys() { const out = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(NS)) out.push(k.slice(NS.length)); } } catch (_) { return Object.keys(mem); } return out; },
    /** sign-in tokens, the server address and the cached account record never go into a data file, and never come from one */
    exportAll() { const o = {}; this.keys().filter(k => !/^(cloud\.|auth\.|stash\.)/.test(k)).forEach(k => { o[k] = this.get(k); }); return o; },
    importAll(o) { Object.keys(o || {}).filter(k => !/^(cloud\.|auth\.|stash\.)/.test(k) && k !== 'progress.owner').forEach(k => this.set(k, o[k])); }
  };
})();

/* Binary assets (reference audio) in IndexedDB; null-safe when unavailable. */
PD.blobs = (() => {
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      try { const r = indexedDB.open('pd2-blobs', 1); r.onupgradeneeded = () => r.result.createObjectStore('b'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }
      catch (e) { rej(e); }
    });
    return dbp;
  }
  const tx = (mode, fn) => db().then(d => new Promise((res, rej) => { const t = d.transaction('b', mode), s = t.objectStore('b'), r = fn(s); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); }));
  return {
    put: (id, blob) => tx('readwrite', s => s.put(blob, id)).catch(() => null),
    get: id => tx('readonly', s => s.get(id)).catch(() => null),
    del: id => tx('readwrite', s => s.delete(id)).catch(() => null)
  };
})();

/* Account: guest is real and local. Account mode needs a server adapter; none is configured here. */
PD.account = (() => {
  const LocalAdapter = {
    name: 'local',
    async load() { return PD.store.exportAll(); },
    async save() { return true; }
  };
  /* Contract for a real cloud backend (not configured in this build — no fake login exists):
       auth:          signUpEmail(email, pw) · signInEmail(email, pw) · signOut() · resetPassword(email) · session()
       sync:          pull(since) → { progress, sessions, favorites, userLessons, settings, rev }
                      push(changes, baseRev) → { rev } — last-writer-wins per record, sessions are append-only
       backup:        snapshot() / restore(id) of the learner's progress
       entitlements:  entitlements() → { lessons:[ids], packs:[ids] } for purchased / private teacher lessons
       teacher:       publishLesson(lesson) · listMyLessons() — for teacher-created content
     Until a server is connected the app stays in guest mode; data lives on this device and moves via JSON export/import. */
  let RemoteAdapter = {
    name: 'remote', configured: false,
    async signUpEmail() { throw new Error('no-backend'); }, async signInEmail() { throw new Error('no-backend'); }, async signOut() { throw new Error('no-backend'); },
    async signInProvider(/* 'google' | 'facebook' | 'apple' */) { throw new Error('no-backend'); },
    async resetPassword() { throw new Error('no-backend'); }, async resendVerification() { throw new Error('no-backend'); }, async session() { return null; },
    async pull() { throw new Error('no-backend'); }, async push() { throw new Error('no-backend'); },
    async entitlements() { return { lessons: [], packs: [] }; }
  };
  return {
    get adapters() { return { local: LocalAdapter, remote: RemoteAdapter }; },
    get remote() { return RemoteAdapter; },
    /** plug in a real backend (Supabase, Firebase, own API…) implementing the contract above */
    configure(adapter) { RemoteAdapter = Object.assign({ name: 'remote' }, adapter, { configured: true }); PD.bus.emit('account', null); },
    get session() { return PD.store.get('account.session', null); },
    get mode() { return PD.store.get('account.mode', 'guest'); },
    get profile() { return PD.store.get('profile', { name: '', avatar: '' }); },
    setProfile(p) { PD.store.set('profile', Object.assign(this.profile, p)); }
  };
})();

/* ---------- i18n ---------- */
PD.i18n = (() => {
  const D = {};
  let lang = PD.store.get('lang', 'ka');
  const api = {
    get lang() { return lang; },
    add(dict) { Object.assign(D, dict); },
    has: k => !!D[k],
    t(k, v) {
      const e = D[k]; let s = e ? (lang === 'en' ? e[1] : e[0]) : k;
      if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]);
      return s;
    },
    /** pick a {ka,en} object or a plain string */
    pick(o) { return o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.ka || o.en || ''); },
    set(l) { lang = l === 'en' ? 'en' : 'ka'; PD.store.set('lang', lang); document.documentElement.lang = lang; api.apply(document); PD.bus.emit('lang', lang); },
    apply(root) {
      root.querySelectorAll('[data-t]').forEach(el => { el.textContent = api.t(el.dataset.t); });
      root.querySelectorAll('[data-t-aria]').forEach(el => { el.setAttribute('aria-label', api.t(el.dataset.tAria)); });
      root.querySelectorAll('[data-t-ph]').forEach(el => { el.setAttribute('placeholder', api.t(el.dataset.tPh)); });
      root.querySelectorAll('[data-t-title]').forEach(el => { el.setAttribute('title', api.t(el.dataset.tTitle)); });
    }
  };
  return api;
})();
const t = (k, v) => PD.i18n.t(k, v);

/* ---------- small DOM helpers ---------- */
PD.$ = id => document.getElementById(id);
PD.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
PD.h = (tag, attrs, kids) => {
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k]; if (v == null || v === false) continue;
    if (k === 'class') el.className = v; else if (k === 'text') el.textContent = v; else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v);
  }
  (kids || []).forEach(c => { if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
  return el;
};
PD.fmtTime = s => { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
PD.isTouch = () => matchMedia('(pointer: coarse)').matches;
PD.device = (() => {
  const ua = navigator.userAgent, mobile = /iPhone|Android.+Mobile|iPod/.test(ua), tablet = /iPad|Android(?!.+Mobile)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
  const low = cores <= 4 && mem <= 3;
  return { mobile, tablet, low, key: (mobile ? 'm' : tablet ? 't' : 'd') + ':' + (ua.match(/(iPhone|iPad|Android|Mac|Windows|Linux)/) || ['x'])[0] };
})();

/* ---------- lazy 3D: the renderer's code is only parsed the first time 3D is used ---------- */
PD.has3D = () => !!PD._R3D;
Object.defineProperty(PD, 'R3D', {
  configurable: true,
  get() {
    if (!PD._R3D) { const src = document.getElementById('mod-three3d'); if (src) { const s = document.createElement('script'); s.textContent = src.textContent; document.head.appendChild(s); } }
    return PD._R3D;
  }
});
