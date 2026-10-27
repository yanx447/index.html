/* =====================================================================
   Notifications · შეტყობინებები
   One place that decides what the learner is told, and the best way the
   device can tell them:
     · the installed app (Capacitor)  → real scheduled notifications,
       which arrive even when the app is closed;
     · the browser / installed PWA    → the service worker shows them
       while it is alive, and push messages from the server arrive even
       when the app is closed (the server part is set up separately);
     · always                         → the app's own inbox with its
       unread badge, which needs no permission at all.
   Nothing is invented: if the device cannot wake a closed app, the
   settings page says so plainly instead of promising a reminder.
   ===================================================================== */
PD.i18n.add({
  'nt.title': ['შეტყობინებები', 'Notifications'],
  'nt.lead': ['რას გაცნობებს აპი და როგორ.', 'What the app tells you, and how.'],
  'nt.on': ['შეტყობინებები ჩართულია', 'Notifications are on'],
  'nt.ask': ['შეტყობინებების ჩართვა', 'Turn notifications on'],
  'nt.denied': ['ბრაუზერმა/ტელეფონმა შეტყობინებები აკრძალა. ჩართე ტელეფონის პარამეტრებში ამ აპისთვის.', 'The browser or phone has blocked notifications. Turn them on for this app in the phone\'s settings.'],
  'nt.unsupported': ['ამ მოწყობილობაზე სისტემური შეტყობინება არ არის ხელმისაწვდომი — შეტყობინებები აპის შიგნით მოგივა.', 'System notifications are not available on this device — you will get them inside the app.'],
  'nt.webNote': ['ბრაუზერს დახურულ აპზე გაღვიძება არ შეუძლია: დროზე მიბმული შეხსენებები მაშინ მოვა, როცა აპი გახსნილია ან დაყენებულია მთავარ ეკრანზე. დაყენებულ (ინსტალირებულ) აპში შეხსენებები სრულად მუშაობს.', 'A browser cannot wake a closed app: timed reminders arrive while the app is open or installed on the home screen. In the installed app they work in full.'],
  'nt.kinds': ['რაზე გსურს შეტყობინება', 'What to be told about'],
  'nt.k.practice': ['ყოველდღიური ვარჯიში', 'Daily practice'],
  'nt.k.practiceD': ['შეგახსენებს, თუ იმ დღეს ჯერ არ გივარჯიშია', 'Reminds you if you have not played yet that day'],
  'nt.k.idle': ['დაბრუნების შეხსენება', 'Come-back reminder'],
  'nt.k.idleD': ['თუ რამდენიმე დღე არ შეხვალ აპში', 'If you do not open the app for a few days'],
  'nt.k.exam': ['გამოცდა', 'Exam'],
  'nt.k.examD': ['როცა გამოცდა გელოდება ან ჩაბარებული არ არის', 'When an exam is waiting or not passed yet'],
  'nt.k.premium': ['პრემიუმი და გადახდა', 'Premium and payments'],
  'nt.k.premiumD': ['როცა პრემიუმს ვადა უახლოვდება ან გასულია', 'When Premium is about to run out, or has'],
  'nt.k.social': ['მეგობრები და მიმოწერა', 'Friends and messages'],
  'nt.k.socialD': ['მეგობრობის თხოვნა, თანხმობა, ახალი წერილი და პასუხი', 'Friend requests, acceptances, new messages and replies'],
  'nt.k.news': ['ახალი აპში', 'What is new in the app'],
  'nt.k.newsD': ['ახალი სიმღერები, გაკვეთილები და შესაძლებლობები', 'New songs, lessons and features'],
  'nt.hour': ['ვარჯიშის შეხსენების დრო', 'Time of the practice reminder'],
  'nt.quiet': ['ღამით არ შემაწუხო', 'Do not disturb at night'],
  'nt.quietD': ['23:00 – 08:00 შეტყობინება არ მოვა', 'Nothing arrives between 23:00 and 08:00'],
  'nt.test': ['სატესტო შეტყობინება', 'Send a test notification'],
  'nt.inbox': ['შეტყობინებების ისტორია', 'Notification history'],
  'nt.none': ['ჯერ არაფერია', 'Nothing yet'],
  'nt.clear': ['გასუფთავება', 'Clear'],
  'nt.readAll': ['ყველას წაკითხვა', 'Mark all read'],
  /* the notifications themselves */
  'nt.practiceT': ['დროა ფანდური აიღო 🪕', 'Time for the panduri 🪕'],
  'nt.practiceB': ['{m} წუთი დღეს — და სერია გრძელდება.', '{m} minutes today — and your streak goes on.'],
  'nt.idleT': ['ფანდური გელოდება', 'Your panduri is waiting'],
  'nt.idleB': ['{n} დღეა არ გივარჯიშია. 10 წუთიც კი საკმარისია.', 'You have not played for {n} days. Even 10 minutes is enough.'],
  'nt.streakT': ['სერიას ნუ გაწყვეტ 🔥', 'Keep your streak 🔥'],
  'nt.streakB': ['{n} დღეა ვარჯიშობ — დღეს ჯერ არ გიკრავს.', '{n} days in a row — you have not played today.'],
  'nt.examT': ['გამოცდა გელოდება', 'An exam is waiting'],
  'nt.examB': ['„{s}“ — სანამ არ ჩააბარებ, შემდეგი ბლოკი არ იხსნება.', '“{s}” — the next unit opens once you pass it.'],
  'nt.premSoonT': ['პრემიუმს ვადა გასდის', 'Premium is running out'],
  'nt.premSoonB': ['დარჩა {n} დღე. გაგრძელება {p}.', '{n} days left. Renew for {p}.'],
  'nt.premEndT': ['პრემიუმის ვადა გავიდა', 'Premium has run out'],
  'nt.premEndB': ['გაკვეთილები და AI სტუდიის შესაძლებლობები ისევ დაიბრუნე.', 'Get the lessons and the AI studio features back.'],
  'nt.frReqT': ['მეგობრობის თხოვნა', 'Friend request'],
  'nt.frReqB': ['{n} მეგობრობას გთხოვს.', '{n} wants to be your friend.'],
  'nt.frOkT': ['მეგობრობა დადასტურდა', 'Friend request accepted'],
  'nt.frOkB': ['{n} შენი მეგობარია.', '{n} is your friend now.'],
  'nt.msgT': ['ახალი წერილი', 'New message'],
  'nt.msgB': ['{n}: {s}', '{n}: {s}'],
  'nt.helpT': ['პასუხი შენს კითხვაზე', 'An answer to your question'],
  'nt.testT': ['შეტყობინებები მუშაობს ✓', 'Notifications work ✓'],
  'nt.testB': ['ასე მოგივა შეხსენება.', 'This is how a reminder will look.'],
  'nt.openApp': ['გახსნა', 'Open']
});

PD.notify = (() => {
  const h = PD.h, t = PD.i18n.t, ic = PD.ic;
  const KINDS = ['practice', 'idle', 'exam', 'premium', 'social', 'news'];
  const K = 'notify', LOG = 'notify.log';
  const prefs = () => Object.assign({ on: false, hour: 19, quiet: true, kinds: {} }, PD.store.get(K, {}));
  const save = p => { PD.store.set(K, p); PD.bus.emit('notify', p); };
  const wants = kind => { const p = prefs(); return p.on && p.kinds[kind] !== false; };
  const native = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const LN = () => { const P = window.Capacitor && window.Capacitor.Plugins; return P && P.LocalNotifications ? P.LocalNotifications : null; };
  const PN = () => { const P = window.Capacitor && window.Capacitor.Plugins; return P && P.PushNotifications ? P.PushNotifications : null; };
  const canSystem = () => !!LN() || ('Notification' in window && 'serviceWorker' in navigator);
  const perm = () => { try { return LN() ? 'native' : (window.Notification ? Notification.permission : 'unsupported'); } catch (_) { return 'unsupported'; } };
  const quietNow = () => { const p = prefs(); if (!p.quiet) return false; const hh = new Date().getHours(); return hh >= 23 || hh < 8; };

  /* ---------------- the app's own inbox ---------------- */
  const log = () => PD.store.get(LOG, []);
  const unread = () => log().filter(x => !x.read).length;
  function note(kind, title, body, go, key) {
    const all = log();
    if (key && all.some(x => x.key === key)) return null;           // the same reminder is not repeated
    const row = { id: 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), kind, title, body: body || '', go: go || null, at: Date.now(), read: false, key: key || null };
    PD.store.set(LOG, [row].concat(all).slice(0, 60));
    PD.bus.emit('notify.new', row);
    return row;
  }
  const markRead = id => { const all = log(); all.forEach(x => { if (!id || x.id === id) x.read = true; }); PD.store.set(LOG, all); PD.bus.emit('notify.read', id || null); };
  const clear = () => { PD.store.set(LOG, []); PD.bus.emit('notify.read', null); };

  /* ---------------- showing one now ---------------- */
  async function show(kind, title, body, go, key) {
    const row = note(kind, title, body, go, key);
    if (!row || !wants(kind) || quietNow()) return row;
    const data = { go: go || null, kind };
    try {
      const ln = LN();
      if (ln) { await ln.schedule({ notifications: [{ id: Math.floor(Math.random() * 1e6), title, body: body || '', extra: data }] }); return row; }
      if ('serviceWorker' in navigator && window.Notification && Notification.permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, { body: body || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: key || kind, data, lang: PD.i18n.lang });
        return row;
      }
    } catch (_) {}
    if (document.visibilityState === 'visible' && PD.ui && PD.ui.toast) PD.ui.toast(title, 4000);
    return row;
  }

  /* ---------------- permission ---------------- */
  async function ask() {
    const p = prefs();
    try {
      const ln = LN();
      if (ln) { const r = await ln.requestPermissions(); p.on = r && /granted/i.test(r.display || r.receive || ''); }
      else if (window.Notification) { const r = await Notification.requestPermission(); p.on = r === 'granted'; }
      else p.on = false;
    } catch (_) { p.on = false; }
    if (p.on) { KINDS.forEach(k => { if (p.kinds[k] == null) p.kinds[k] = true; }); }
    save(p);
    if (p.on) { schedule(); subscribePush(); }
    return p.on;
  }

  /* ---------------- scheduled reminders ----------------
     On the installed app these are real alarms, set by the system.
     In a browser the schedule is written where the service worker can
     read it, and what is due is also shown the next time the app opens. */
  function plan() {
    const out = [], p = prefs(), now = Date.now();
    const at = (d, hh, mm) => { const x = new Date(d); x.setHours(hh, mm || 0, 0, 0); return x.getTime(); };
    const goal = PD.store.get('goalMin', 15);
    if (wants('practice')) {
      for (let i = 0; i < 7; i++) {
        const when = at(now + i * 864e5, p.hour || 19);
        if (when > now + 60000) out.push({ id: 1000 + i, kind: 'practice', at: when, title: t('nt.practiceT'), body: t('nt.practiceB', { m: goal }), go: 'daily' });
      }
    }
    if (wants('idle')) out.push({ id: 1100, kind: 'idle', at: now + 3 * 864e5, title: t('nt.idleT'), body: t('nt.idleB', { n: 3 }), go: 'home' });
    if (wants('exam')) { const ex = PD.exam && (PD.exam.active() || (PD.exam.dueExam && PD.exam.dueExam()));
      const id = ex && ex.id ? ex.id : ex;
      if (id && PD.exam.get(id)) out.push({ id: 1200, kind: 'exam', at: now + 864e5, title: t('nt.examT'), body: t('nt.examB', { s: t(PD.exam.get(id).name) }), go: 'home' }); }
    if (wants('premium')) { const u = PD.premium && PD.premium.until;
      if (u) { const end = u.getTime(), price = (PD.premium.PRICE && PD.premium.PRICE.monthly) || '';
        if (end - 3 * 864e5 > now) out.push({ id: 1300, kind: 'premium', at: end - 3 * 864e5, title: t('nt.premSoonT'), body: t('nt.premSoonB', { n: 3, p: price }), go: 'profile' });
        if (end > now && end < now + 400 * 864e5) out.push({ id: 1301, kind: 'premium', at: end + 3600e3, title: t('nt.premEndT'), body: t('nt.premEndB'), go: 'profile' }); } }
    return out;
  }
  async function schedule() {
    const list = plan();
    try {
      const ln = LN();
      if (ln) {
        const cur = await ln.getPending(); const ids = ((cur && cur.notifications) || []).map(x => x.id).filter(x => x >= 1000 && x < 2000);
        if (ids.length) await ln.cancel({ notifications: ids.map(id => ({ id })) });
        if (list.length) await ln.schedule({ notifications: list.map(x => ({ id: x.id, title: x.title, body: x.body, schedule: { at: new Date(x.at) }, extra: { go: x.go, kind: x.kind } })) });
        return 'native';
      }
    } catch (_) {}
    // the browser: leave the plan where the service worker can find it, and ask for periodic checks if the browser allows them
    try {
      if (window.caches) { const c = await caches.open('pd-notify'); await c.put('/__plan', new Response(JSON.stringify({ at: Date.now(), quiet: prefs().quiet, list }), { headers: { 'content-type': 'application/json' } })); }
      const reg = await navigator.serviceWorker.ready;
      if (reg.periodicSync && navigator.permissions) {
        const st = await navigator.permissions.query({ name: 'periodic-background-sync' }).catch(() => null);
        if (st && st.state === 'granted') await reg.periodicSync.register('pd-check', { minInterval: 12 * 3600e3 }).catch(() => {});
      }
    } catch (_) {}
    return 'web';
  }

  /* ---------------- what is due, checked when the app opens ---------------- */
  function catchUp() {
    const p = prefs(), today = new Date().toDateString();
    const last = PD.store.get('notify.lastOpen', 0), days = last ? Math.floor((Date.now() - last) / 864e5) : 0;
    PD.store.set('notify.lastOpen', Date.now());
    const LS = PD.lessons, ss = LS ? LS.progress.sessions() : [];
    const minsToday = ss.filter(s => new Date(s.date).toDateString() === today).reduce((a, s) => a + (s.dur || 0), 0) / 60;
    if (days >= 3 && wants('idle')) show('idle', t('nt.idleT'), t('nt.idleB', { n: days }), 'home', 'idle:' + today);
    // a streak that is about to break
    if (wants('practice') && !minsToday && new Date().getHours() >= (p.hour || 19)) {
      const days2 = {}; ss.forEach(s => { days2[new Date(s.date).toDateString()] = 1; });
      let n = 0; for (let i = 1; i <= 60; i++) { if (days2[new Date(Date.now() - i * 864e5).toDateString()]) n++; else break; }
      if (n >= 3) show('practice', t('nt.streakT'), t('nt.streakB', { n }), 'daily', 'streak:' + today);
      else show('practice', t('nt.practiceT'), t('nt.practiceB', { m: PD.store.get('goalMin', 15) }), 'daily', 'practice:' + today);
    }
    // an exam that is waiting
    if (wants('exam') && PD.exam) { const a = PD.exam.active(); const id = a ? a.id : (PD.exam.dueExam ? PD.exam.dueExam() : null); const e = id && PD.exam.get(id);
      if (e) show('exam', t('nt.examT'), t('nt.examB', { s: t(e.name) }), 'home', 'exam:' + e.id + ':' + today); }
    // premium that is ending or over
    if (wants('premium') && PD.premium) { const u = PD.premium.until;
      if (u) { const left = Math.ceil((u.getTime() - Date.now()) / 864e5);
        if (left <= 3 && left > 0) show('premium', t('nt.premSoonT'), t('nt.premSoonB', { n: left, p: (PD.premium.PRICE && PD.premium.PRICE.monthly) || '' }), 'profile', 'prem:' + u.toDateString());
        if (left <= 0) show('premium', t('nt.premEndT'), t('nt.premEndB'), 'profile', 'premEnd:' + u.toDateString()); } }
    schedule();
  }

  /* ---------------- new messages, while the account is signed in ----------------
     The server tells the app about a new message as soon as it is asked; with
     the push sender set up the same message also arrives at a closed app. */
  async function pollSocial() {
    const C = PD.cloud;
    if (!wants('social') || !C || !C.session || !C.configured) return;
    try {
      const rows = await C.chat.list(); if (!rows) return;
      const seen = PD.store.get('notify.chat', {}), next = {};
      let first = !Object.keys(seen).length;
      rows.forEach(r => { const at = r.last_at ? new Date(r.last_at).getTime() : 0; next[r.id] = at;
        if (!first && at && at > (seen[r.id] || 0) && r.last_sender !== C.uid)
          show('social', t('nt.msgT'), t('nt.msgB', { n: r.other_name || '', s: (r.last_body || '').slice(0, 80) }), 'community:c:' + r.id + ':' + (r.other_name || ''), 'msg:' + r.id + ':' + at);
      });
      PD.store.set('notify.chat', next);
    } catch (_) {}
  }
  let pollT = 0;
  function watch(on) { clearInterval(pollT); if (on === false) return; pollT = setInterval(pollSocial, 60000); pollSocial(); }

  /* ---------------- push (the server sends; set up separately) ---------------- */
  const b64 = s => { const pad = '='.repeat((4 - s.length % 4) % 4), raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from([...raw].map(c => c.charCodeAt(0))); };
  async function subscribePush() {
    const key = PD.CONFIG && PD.CONFIG.vapidKey;
    try {
      if (native()) { const pn = PN(); if (!pn) return null; await pn.register(); return 'native'; }
      if (!key || !('serviceWorker' in navigator) || !('PushManager' in window) || Notification.permission !== 'granted') return null;
      const reg = await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) });
      const j = sub.toJSON();
      if (PD.cloud && PD.cloud.session && PD.cloud.push && PD.cloud.push.save) await PD.cloud.push.save({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, lang: PD.i18n.lang });
      return 'web';
    } catch (_) { return null; }
  }

  /* ---------------- a notification that was tapped ---------------- */
  function openFrom(go) {
    if (!go || !PD.app) return;
    const [r, p] = String(go).split(':');
    try { PD.app.go(r, p || null); } catch (_) {}
  }
  try {
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'notification' && e.data.go) openFrom(e.data.go); });
    const q = new URLSearchParams(location.search).get('go'); if (q) setTimeout(() => openFrom(q), 600);
  } catch (_) {}

  /* ---------------- the settings section ---------------- */
  function settingsSection(mk) {
    const { sect, row, toggle } = mk, p = prefs();
    const rows = [];
    if (!p.on) rows.push(h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'nt.title' }), h('small', { 'data-t': 'nt.lead' })]),
      h('button', { class: 'btn small primary', 'data-t': 'nt.ask', onclick: async e => { const ok = await ask(); if (!ok) PD.ui.toast(t(canSystem() ? 'nt.denied' : 'nt.unsupported'), 5000); PD.app.render(); } })]));
    else {
      rows.push(row('nt.on', null, (() => { const c = h('input', { type: 'checkbox', 'aria-label': t('nt.on') }); c.checked = true; c.onchange = () => { const q2 = prefs(); q2.on = false; save(q2); PD.app.render(); }; return c; })()));
      KINDS.forEach(k => rows.push(row('nt.k.' + k, t('nt.k.' + k + 'D'), (() => {
        const c = h('input', { type: 'checkbox', 'aria-label': t('nt.k.' + k) }); c.checked = p.kinds[k] !== false;
        c.onchange = () => { const q2 = prefs(); q2.kinds[k] = c.checked; save(q2); schedule(); }; return c; })())));
      const hour = h('input', { type: 'time', class: 'input', value: String(p.hour || 19).padStart(2, '0') + ':00', style: 'max-width:120px' });
      hour.onchange = () => { const q2 = prefs(); q2.hour = Math.max(0, Math.min(23, parseInt(hour.value, 10) || 19)); save(q2); schedule(); };
      rows.push(row('nt.hour', null, hour));
      rows.push(row('nt.quiet', t('nt.quietD'), (() => { const c = h('input', { type: 'checkbox', 'aria-label': t('nt.quiet') }); c.checked = p.quiet !== false; c.onchange = () => { const q2 = prefs(); q2.quiet = c.checked; save(q2); }; return c; })()));
      rows.push(h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'nt.inbox' })]),
        h('span', { class: 'row', style: 'gap:6px' }, [h('button', { class: 'btn small', 'data-t': 'nt.test', onclick: () => show('news', t('nt.testT'), t('nt.testB'), 'home') }),
          h('button', { class: 'btn small', 'data-t': 'nt.inbox', onclick: () => PD.app.go('inbox') })])]));
      if (!native()) rows.push(h('p', { class: 'notice', 'data-t': 'nt.webNote' }));
    }
    return sect('nt.title', rows);
  }

  /* ---------------- the inbox page ---------------- */
  function page(w) {
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('profile') }), h('h1', { 'data-t': 'nt.title', style: 'margin:0' })]));
    const all = log();
    if (!all.length) { w.append(h('p', { class: 'muted', 'data-t': 'nt.none' })); PD.i18n.apply(w); return; }
    w.append(h('div', { class: 'row', style: 'gap:8px' }, [h('button', { class: 'btn small', 'data-t': 'nt.readAll', onclick: () => { markRead(); PD.app.render(); } }),
      h('button', { class: 'btn small ghost', 'data-t': 'nt.clear', onclick: () => { clear(); PD.app.render(); } })]));
    const list = h('div', { class: 'nt-list' });
    all.forEach(x => list.append(h('button', { class: 'nt-row' + (x.read ? '' : ' new'), onclick: () => { markRead(x.id); if (x.go) openFrom(x.go); else PD.app.render(); } }, [
      h('span', { class: 'nt-dot', 'aria-hidden': 'true' }),
      h('span', { class: 'grow' }, [h('b', { text: x.title }), x.body ? h('small', { text: x.body }) : null, h('small', { class: 'muted', text: PD.ui.daysAgo(x.at) })].filter(Boolean))])));
    w.append(list);
    markRead();
    PD.i18n.apply(w);
  }

  return { ask, show, note, log, unread, markRead, clear, schedule, catchUp, plan, prefs, save, wants, settingsSection, page, subscribePush, pollSocial, watch, openFrom, KINDS, canSystem, perm, native };
})();
