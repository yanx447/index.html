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
/** author mode: only the owner's account (the server's is_owner()) with the switch on.
    The stored switch alone is never enough — another account on this device, or a switch
    left on from before, must not open the authoring tools or the premium doors. */
PD.author = () => !!(PD.cloud && PD.cloud.isOwner) && !!PD.store.get('author', false);

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
/* Georgian and English are the source and live beside the code as ['ka', 'en']. Every other language
   is a pack of translations keyed by the English text (panduri/source/i18n/<code>.json): a string with
   no translation yet shows in English, never as a raw key. A pack is read only when its language is chosen. */
PD.LANGS = [
  { id: 'ka', name: 'ქართული', locale: 'ka-GE' }, { id: 'en', name: 'English', locale: 'en-GB' },
  { id: 'ru', name: 'Русский', locale: 'ru-RU' }, { id: 'es', name: 'Español', locale: 'es-ES' },
  { id: 'fr', name: 'Français', locale: 'fr-FR' }, { id: 'de', name: 'Deutsch', locale: 'de-DE' },
  { id: 'it', name: 'Italiano', locale: 'it-IT' }, { id: 'pt', name: 'Português', locale: 'pt-PT' },
  { id: 'tr', name: 'Türkçe', locale: 'tr-TR' }, { id: 'uk', name: 'Українська', locale: 'uk-UA' },
  { id: 'pl', name: 'Polski', locale: 'pl-PL' }, { id: 'ar', name: 'العربية', locale: 'ar-u-nu-latn', rtl: true },
  { id: 'hi', name: 'हिन्दी', locale: 'hi-IN' }, { id: 'zh', name: '中文', locale: 'zh-CN' },
  { id: 'ja', name: '日本語', locale: 'ja-JP' }, { id: 'ko', name: '한국어', locale: 'ko-KR' }
];
/* only the languages whose pack this build carries (the build writes the list); Georgian and English are always here */
if (window.PD_LANG_READY) PD.LANGS = PD.LANGS.filter(l => l.id === 'ka' || l.id === 'en' || window.PD_LANG_READY.includes(l.id));
PD.i18n = (() => {
  const D = {};
  const info = c => PD.LANGS.find(l => l.id === c);
  const fromDevice = () => { for (const tag of (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'])) { const c = String(tag).toLowerCase().split(/[-_]/)[0]; if (info(c)) return c; } return 'en'; };
  const savedLang = PD.store.get('lang', null);
  let lang = info(savedLang) ? savedLang : fromDevice();
  /* the chosen language's translations: exact strings, and templates for text built by concatenation */
  let pack = null, patterns = [];
  const seen = new Map();
  /* A pack arrives one of two ways: the installable app loads js/lang/<code>.js as an ordinary script (never a blocking
     request: a slow network must not freeze the app), the single-file build carries every pack inside the page. */
  const packOf = c => {
    const loaded = window.PD_LANG && window.PD_LANG[c];
    if (loaded) return loaded;
    const el = document.getElementById('lang-' + c), src = document.getElementById('lang-_src');
    if (!el || !src) return null;
    const s = JSON.parse(src.textContent), a = JSON.parse(el.textContent), map = {};
    s.keys.forEach((k, i) => { if (a[i] != null) map[k] = a[i]; });
    return { map, templates: s.templates };
  };
  const usePack = c => {
    pack = null; patterns = []; seen.clear();
    if (c === 'ka' || c === 'en') return true;
    const p = packOf(c); if (!p) return false;
    const m = new Map(Object.entries(p.map));
    pack = m;
    patterns = p.templates.filter(k => m.has(k)).map(k => ({ re: new RegExp('^' + k.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\d+\}/g, '([\\s\\S]+?)') + '$'), holes: (k.match(/\{\d+\}/g) || []).map(x => +x.slice(1, -1)), to: m.get(k) }));
    return true;
  };
  const fetchPack = c => new Promise(ok => {
    const s = document.createElement('script'); s.src = 'js/lang/' + c + '.js'; s.onload = () => ok(true); s.onerror = () => ok(false); document.head.appendChild(s);
  });
  /* English → the chosen language. Whatever has no translation stays in English. */
  const tr = en => {
    if (!pack || en == null || en === '') return en;
    if (Array.isArray(en)) return en.map(tr);   // a {ka:[…], en:[…]} list of lines
    if (typeof en !== 'string') return en;
    const s = en, hit = pack.get(s);
    if (hit != null) return hit;
    if (seen.has(s)) return seen.get(s);
    const lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0], core = s.trim();
    let out = pack.get(core);
    if (out == null) for (const p of patterns) {
      const m = p.re.exec(core); if (!m) continue;
      out = p.to; p.holes.forEach((n, i) => { out = out.split('{' + n + '}').join(tr(m[i + 1])); }); break;
    }
    out = out == null ? s : lead + out + tail;
    if (seen.size > 4000) seen.clear();
    seen.set(s, out);
    return out;
  };
  const stamp = () => { const r = document.documentElement; r.lang = lang; r.dir = info(lang).rtl ? 'rtl' : 'ltr'; };
  usePack(lang);
  stamp();
  const api = {
    get lang() { return lang; },
    /** the languages on offer, for a picker */
    get list() { return PD.LANGS; },
    /** the locale for dates and sorting */
    get locale() { return info(lang).locale; },
    /** true when the text on screen is a translation nobody has checked against the Georgian original */
    get translated() { return lang !== 'ka' && lang !== 'en'; },
    add(dict) { Object.assign(D, dict); },
    has: k => !!D[k],
    t(k, v) {
      const e = D[k]; let s = e ? (lang === 'ka' ? e[0] : tr(e[1])) : k;
      if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]);
      return s;
    },
    /** translate a line whose English is known (from a {ka,en} pair or built from one) */
    tr,
    /** pick a {ka,en} object or a plain string */
    pick(o) {
      if (o == null) return ''; if (typeof o === 'string') return o;
      if (lang === 'ka' || lang === 'en') return o[lang] || o.ka || o.en || '';
      return o[lang] || (o.en ? tr(o.en) : o.ka || '');
    },
    /** switch language; resolves once the text on screen has changed (at once where the pack is already here) */
    set(l) {
      const c = info(l) ? l : 'en';
      const done = () => { lang = c; PD.store.set('lang', lang); PD.store.set('language.chosen', true); stamp(); api.apply(document); PD.bus.emit('lang', lang); return true; };
      if (usePack(c)) return Promise.resolve(done());
      return fetchPack(c).then(got => { if (got && usePack(c)) return done(); usePack(lang); PD.bus.emit('lang.fail', c); return false; });
    },
    apply(root) {
      root.querySelectorAll('[data-t]').forEach(el => { el.textContent = api.t(el.dataset.t); });
      // data-th is the same thing for a line that carries its own markup (a bold word inside a step);
      // the strings are the app's own, never anything a person typed
      root.querySelectorAll('[data-th]').forEach(el => { el.innerHTML = api.t(el.dataset.th); });
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
