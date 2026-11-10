/* =====================================================================
   Notifications · შეტყობინებები — სიმა გიგზავნის
   Sima tells the learner what happened and what is waiting:
     · the server writes every notification (a friend wrote, reacted,
       posted; a request, an acceptance; a record; the daily reminder at
       the learner's own hour; a new version) and sends it to every device
       the account is signed in on: browsers and the installed PWA by Web
       Push, which arrives even when the app is closed;
     · the app reads the same notifications into its inbox, and while it is
       open it shows each new one itself — that is how the desktop app and
       devices without push receive them;
     · without a server (or before the account's first sync) the app still
       makes its own local reminders, as before.
   Nothing is invented: the settings page says which of these this device
   can do, and what it cannot.
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
  'nt.k.practiceD': ['შენს დროზე: რა დაგრჩა — გამოცდა, სიმღერა, თეორიის გამეორება; სერია და კვირის შეჯამება', 'At your hour: what is left — an exam, a song, a theory review; streaks and your week'],
  'nt.k.idle': ['დაბრუნების შეხსენება', 'Come-back reminder'],
  'nt.k.idleD': ['თუ რამდენიმე დღე არ შეხვალ აპში', 'If you do not open the app for a few days'],
  'nt.k.exam': ['გამოცდა', 'Exam'],
  'nt.k.examD': ['როცა გამოცდა გელოდება ან ჩაბარებული არ არის', 'When an exam is waiting or not passed yet'],
  'nt.k.premium': ['პრემიუმი და გადახდა', 'Premium and payments'],
  'nt.k.premiumD': ['როცა პრემიუმს ვადა უახლოვდება ან გასულია', 'When Premium is about to run out, or has'],
  'nt.k.social': ['მეგობრები და მიმოწერა', 'Friends and messages'],
  'nt.k.socialD': ['მეგობრობის თხოვნა და თანხმობა, ახალი წერილი, რეაქცია ჩატში', 'Friend requests and acceptances, new messages, reactions in chats'],
  'nt.k.feed': ['მეგობრების პოსტები და რეაქციები', 'Friends’ posts and reactions'],
  'nt.k.feedD': ['მეგობრის ახალი ფოტო, ვიდეო ან მუსიკა; რეაქცია და კომენტარი შენს პოსტზე', 'A friend’s new photo, video or music; reactions and comments on your posts'],
  'nt.k.records': ['რეკორდები', 'Records'],
  'nt.k.recordsD': ['როცა შენი პოსტი რეკორდს ხსნის ან დღის საუკეთესოა', 'When your post sets a record or is the day’s best'],
  'nt.k.news': ['ახალი აპში', 'What is new in the app'],
  'nt.k.newsD': ['ახალი ვერსია და სიახლეები', 'A new version, and what is new'],
  'nt.hour': ['ვარჯიშის შეხსენების დრო', 'Time of the practice reminder'],
  'nt.quiet': ['ღამით არ შემაწუხო', 'Do not disturb at night'],
  'nt.quietD': ['23:00 – 08:00 შეტყობინება არ მოვა', 'Nothing arrives between 23:00 and 08:00'],
  'nt.test': ['სატესტო შეტყობინება', 'Send a test notification'],
  'nt.inbox': ['შეტყობინებების ისტორია', 'Notification history'],
  'nt.none': ['ჯერ არაფერია', 'Nothing yet'],
  'nt.clear': ['გასუფთავება', 'Clear'],
  'nt.readAll': ['ყველას წაკითხვა', 'Mark all read'],
  'nt.fromSima': ['შეტყობინებებს სიმა გიგზავნის — ყველა მოწყობილობაზე, სადაც შენი ანგარიშით ხარ შესული.', 'Sima sends your notifications — to every device you are signed in on.'],
  'nt.devPush': ['ეს მოწყობილობა: შეტყობინებები მოვა აპის დახურვის შემდეგაც.', 'This device: notifications arrive even when the app is closed.'],
  'nt.devOpen': ['ეს მოწყობილობა: შეტყობინებები მოვა, როცა აპი გახსნილია. დახურულ აპზე მისაღებად გახსენი აპი ბრაუზერში (Chrome, Edge, Firefox, Safari) ან დააყენე მთავარ ეკრანზე.', 'This device: notifications arrive while the app is open. To receive them with the app closed, open it in a browser (Chrome, Edge, Firefox, Safari) or install it on the home screen.'],
  'nt.devNative': ['ტელეფონის აპი: დახურულ აპზე შეტყობინებისთვის Firebase-ის დაყენებაა საჭირო (ჯერ არ არის) — მანამდე შეტყობინებები აპის გახსნისას მოვა.', 'The phone app: notifications to a closed app need Firebase to be set up (not yet) — until then they arrive when you open the app.'],
  'nt.devCount': ['{n} მოწყობილობა იღებს შეტყობინებებს', '{n} devices receive notifications'],
  'nt.sentAll': ['გაიგზავნა — მოვა ყველა შენს მოწყობილობაზე.', 'Sent — it will arrive on all your devices.'],
  /* the notifications the app makes itself */
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
  'nt.openApp': ['გახსნა', 'Open'],
  'set.app': ['აპლიკაცია', 'The app'],
  'set.version': ['ვერსია', 'Version'],
  'set.update': ['განახლების შემოწმება', 'Check for an update'],
  'set.updating': ['მოწმდება…', 'Checking…'],
  'set.upToDate': ['უახლესი ვერსია გაქვს.', 'You have the newest version.'],
  /* the owner: one new version, told to everyone */
  'up.title': ['განახლების შეტყობინება ყველას', 'Tell everyone about an update'],
  'up.lead': ['სიმა ყველა მომხმარებელს გაუგზავნის „აპი განახლდა“ — ერთხელ ერთ ვერსიაზე.', 'Sima sends every member “The app has been updated” — once per version.'],
  'up.version': ['ვერსია', 'Version'], 'up.noteKa': ['რა შეიცვალა — ქართულად', 'What changed — in Georgian'], 'up.noteEn': ['რა შეიცვალა — ინგლისურად', 'What changed — in English'],
  'up.send': ['გაგზავნა ყველასთან', 'Send to everyone'], 'up.sent': ['გაიგზავნა {n} მომხმარებელთან.', 'Sent to {n} members.'], 'up.dup': ['ეს ვერსია უკვე გამოცხადებულია.', 'This version has already been announced.']
});
/* what Sima says. The server writes the same words for the lock screen (backend …_social.sql, sima_text): keep the two alike. */
PD.i18n.add({
  'sn.sima': ['სიმა', 'Sima'],
  'sn.message.t': ['სიმა · ახალი წერილი', 'Sima · New message'], 'sn.message': ['{n} გწერს: „{s}“', '{n} writes: “{s}”'],
  'sn.chat_reaction.t': ['სიმა · რეაქცია', 'Sima · Reaction'], 'sn.chat_reaction': ['{n} რეაგირებს შენს {w}: {e}', '{n} reacted {e} to your {w}'],
  'sn.post_reaction.t': ['სიმა · რეაქცია', 'Sima · Reaction'], 'sn.post_reaction': ['{n} რეაგირებს შენს {w}: {e}', '{n} reacted {e} to your {w}'],
  'sn.post_reactions': ['{n} და კიდევ {k} რეაგირებენ შენს {w} {e}', '{n} and {k} others reacted to your {w} {e}'],
  'sn.comment.t': ['სიმა · ახალი კომენტარი', 'Sima · New comment'], 'sn.comment': ['{n} წერს შენს {w}: „{s}“', '{n} commented on your {w}: “{s}”'],
  'sn.friend_post.t': ['სიმა · მეგობრის ახალი პოსტი', 'Sima · A friend posted'], 'sn.friend_post': ['{n} ახალ {w} აზიარებს — ნახე!', '{n} shared a new {w} — take a look!'], 'sn.friend_postS': ['{n} ახალ {w} აზიარებს: „{s}“', '{n} shared a new {w}: “{s}”'],
  'sn.friend_request.t': ['სიმა · მეგობრობის თხოვნა', 'Sima · Friend request'], 'sn.friend_request': ['{n} მეგობრობას გთხოვს.', '{n} wants to be your friend.'],
  'sn.friend_accept.t': ['სიმა · ახალი მეგობარი', 'Sima · New friend'], 'sn.friend_accept': ['{n} უკვე შენი მეგობარია — მიწერე!', '{n} is your friend now — say hello!'],
  'sn.record.t': ['სიმა · ახალი რეკორდი 🏆', 'Sima · New record 🏆'], 'sn.record': ['შენმა {w} {num} {m} მიაღწია!', 'Your {w} just reached {num} {m}!'],
  'sn.record_app.t': ['სიმა · აპის რეკორდი 🏆', 'Sima · App record 🏆'], 'sn.record_app': ['შენს {w} ახლა მთელ აპში ყველაზე მეტი რეაქცია აქვს!', 'Your {w} now has the most reactions in the whole app!'],
  'sn.record_top.t': ['სიმა · დღის საუკეთესო ⭐', 'Sima · Top of the day ⭐'], 'sn.record_top': ['შენი {w} დღეს გლობალურ ფიდში ყველაზე პოპულარულია — ახალი მომხმარებლები მას პირველს ნახულობენ!', 'Your {w} is the most popular in the global feed today — new members see it first!'],
  'sn.reminder.t': ['სიმა · დღის საქმე', 'Sima · Today’s practice'], 'sn.reminder': ['დღეს ჯერ არ გივარჯიშია — {m} წუთიც საკმარისია.', 'You have not played yet today — even {m} minutes counts.'], 'sn.reminderS': ['{n} დღეა ზედიზედ ვარჯიშობ — დღეს ჯერ არ გიკრავს.', '{n} days in a row — today is still open.'],
  'sn.idle.t': ['სიმა · მომენატრე', 'Sima · I miss you'], 'sn.idle': ['{num} დღეა არ გივარჯიშია. დღეს 10 წუთიც კი საკმარისია.', 'You have not practised for {num} days. Even 10 minutes today is enough.'],
  'sn.streak.t': ['სიმა · {num} დღე ზედიზედ 🔥', 'Sima · {num} days in a row 🔥'], 'sn.streak': ['ყოჩაღ! {num} დღეა ზედიზედ ვარჯიშობ. ასე გააგრძელე!', 'Well done! {num} days of practice in a row. Keep it going!'],
  'sn.weekly.t': ['სიმა · კვირის შეჯამება', 'Sima · Your week'], 'sn.weekly': ['ამ კვირაში {m} წუთი ივარჯიშე. ხვალ ახალი კვირა იწყება.', 'This week you practised {m} minutes. A new week starts tomorrow.'], 'sn.weekly0': ['ამ კვირაში არ გივარჯიშია — ახალი კვირა ახალი დასაწყისია.', 'No practice this week — a new week is a fresh start.'],
  'sn.update.t': ['სიმა · აპი განახლდა ✨', 'Sima · The app has been updated ✨'], 'sn.update': ['ვერსია {v}: {s}', 'Version {v}: {s}'], 'sn.update0': ['ვერსია {v}: გახსენი და ნახე, რა შეიცვალა.', 'Version {v}: open it to see what is new.'],
  'sn.test.t': ['სიმა · შეტყობინებები მუშაობს ✓', 'Sima · Notifications work ✓'], 'sn.test': ['ასე მოგივა ჩემი შეტყობინებები ყველა მოწყობილობაზე, სადაც შესული ხარ.', 'This is how my notifications reach every device you are signed in on.'],
  'sn.waiting': ['გელოდება: {s}', 'Waiting for you: {s}'],
  'sn.todo.exam': ['გამოცდა „{s}“', 'exam “{s}”'], 'sn.todo.song': ['სიმღერა „{s}“', 'song “{s}”'], 'sn.todo.theory': ['თეორიის გამეორება: „{s}“', 'theory review: “{s}”'], 'sn.todo.chapter': ['თეორია „{s}“', 'theory “{s}”'], 'sn.todo.lesson': ['გაკვეთილი „{s}“', 'lesson “{s}”'],
  'sn.on.photo': ['ფოტოზე', 'photo'], 'sn.on.video': ['ვიდეოზე', 'video'], 'sn.on.audio': ['მუსიკაზე', 'music'], 'sn.on.audioC': ['აუდიოზე', 'audio'], 'sn.on.text': ['პოსტზე', 'post'], 'sn.on.message': ['შეტყობინებაზე', 'message'],
  'sn.dat.photo': ['ფოტოს', 'photo'], 'sn.dat.video': ['ვიდეოს', 'video'], 'sn.dat.audio': ['მუსიკას', 'music'], 'sn.dat.text': ['პოსტს', 'post'],
  'sn.erg.photo': ['ფოტომ', 'photo'], 'sn.erg.video': ['ვიდეომ', 'video'], 'sn.erg.audio': ['მუსიკამ', 'music'], 'sn.erg.text': ['პოსტმა', 'post'],
  'sn.nom.photo': ['ფოტო', 'photo'], 'sn.nom.video': ['ვიდეო', 'video'], 'sn.nom.audio': ['მუსიკა', 'music'], 'sn.nom.text': ['პოსტი', 'post'],
  'sn.m.reactions': ['რეაქციას', 'reactions'], 'sn.m.views': ['ნახვას', 'views'], 'sn.m.comments': ['კომენტარს', 'comments'], 'sn.someone': ['ვიღაც', 'Someone']
});

PD.notify = (() => {
  const h = PD.h, t = PD.i18n.t, ic = PD.ic;
  const KINDS = ['practice', 'idle', 'exam', 'premium', 'social', 'feed', 'records', 'news'];
  const K = 'notify', LOG = 'notify.log';
  const prefs = () => Object.assign({ on: false, hour: 19, quiet: true, kinds: {} }, PD.store.get(K, {}));
  const save = p => { PD.store.set(K, p); PD.bus.emit('notify', p); };
  const wants = kind => { const p = prefs(); return p.on && p.kinds[kind] !== false; };
  const native = () => !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const electron = () => !!(window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'electron');
  const LN = () => { const P = window.Capacitor && window.Capacitor.Plugins; return P && P.LocalNotifications ? P.LocalNotifications : null; };
  const PN = () => { const P = window.Capacitor && window.Capacitor.Plugins; return P && P.PushNotifications ? P.PushNotifications : null; };
  const canSystem = () => !!LN() || ('Notification' in window && 'serviceWorker' in navigator);
  const perm = () => { try { return LN() ? 'native' : (window.Notification ? Notification.permission : 'unsupported'); } catch (_) { return 'unsupported'; } };
  const quietNow = () => { const p = prefs(); if (!p.quiet) return false; const hh = new Date().getHours(); return hh >= 23 || hh < 8; };
  const C = () => PD.cloud;
  const uid = () => C() && C().uid;

  /* ---------------- the app's own inbox (local reminders + Sima's notifications from the server) ---------------- */
  const raw = () => PD.store.get(LOG, []);
  const log = () => { const me = uid(); return raw().filter(x => !x.uid || x.uid === me); };   // another account's notifications on this device stay hidden
  const unread = () => log().filter(x => !x.read).length;
  function note(kind, title, body, go, key) {
    const all = raw();
    if (key && all.some(x => x.key === key)) return null;           // the same reminder is not repeated
    const row = { id: 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), kind, title, body: body || '', go: go || null, at: Date.now(), read: false, key: key || null };
    PD.store.set(LOG, [row].concat(all).slice(0, 80));
    PD.bus.emit('notify.new', row);
    return row;
  }
  const serverIds = rows => rows.filter(x => x.srv).map(x => x.srv);
  function markRead(id) {
    const all = raw(), me = uid(), hit = [];
    all.forEach(x => { if ((!id || x.id === id) && !x.read && (!x.uid || x.uid === me)) { x.read = true; hit.push(x); } });
    PD.store.set(LOG, all); PD.bus.emit('notify.read', id || null);
    const ids = serverIds(hit); if (ids.length && C() && C().session) C().notes.read(id ? ids : null).catch(() => {});
  }
  /** a chat that was opened: its notifications are read (the server marks them too) */
  function readTag(tags) {
    const all = raw(), me = uid(); let n = 0;
    all.forEach(x => { if (!x.read && x.uid === me && tags.includes(x.tag)) { x.read = true; n++; } });
    if (n) { PD.store.set(LOG, all); PD.bus.emit('notify.read', null); }
  }
  function clear() {
    const me = uid(); PD.store.set(LOG, raw().filter(x => x.uid && x.uid !== me)); PD.bus.emit('notify.read', null);
    if (C() && C().session && srv.ok) C().notes.clear().catch(() => {});
  }

  /* ---------------- showing one now ---------------- */
  async function system(kind, title, body, go, tag, extra) {
    const data = Object.assign({ go: go || null, kind }, extra || {});
    try {
      const ln = LN();
      if (ln) { await ln.schedule({ notifications: [{ id: Math.floor(Math.random() * 1e6), title, body: body || '', extra: data }] }); return true; }
      if ('serviceWorker' in navigator && window.Notification && Notification.permission === 'granted') {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, { body: body || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: tag || kind, data, lang: PD.i18n.lang });
        return true;
      }
    } catch (_) {}
    return false;
  }
  async function show(kind, title, body, go, key) {
    const row = note(kind, title, body, go, key);
    if (!row || !wants(kind) || quietNow()) return row;
    if (!(await system(kind, title, body, go, key || kind)) && document.visibilityState === 'visible' && PD.ui && PD.ui.toast) PD.ui.toast(title, 4000);
    return row;
  }
  /** Sima, in the app: a small card at the top that opens what it is about */
  function pop(x) {
    document.querySelectorAll('.sn-pop').forEach(e => e.remove());
    const box = h('button', { class: 'sn-pop', role: 'status', 'aria-live': 'polite', onclick: () => { box.remove(); markRead(x.id); openFrom(x.go); } }, [
      h('span', { class: 'sn-av', 'aria-hidden': 'true', text: t('sn.sima')[0] }),
      h('span', { class: 'grow' }, [h('b', { text: x.title }), x.body ? h('small', { text: x.body }) : null].filter(Boolean))]);
    document.body.appendChild(box);
    setTimeout(() => { box.classList.add('out'); setTimeout(() => box.remove(), 300); }, 6000);
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
    if (p.on) { schedule(); subscribePush(); syncServer(true); }
    return p.on;
  }

  /* ---------------- Sima's notifications from the server ---------------- */
  // which switch each server kind belongs to (the push function uses the same map)
  const CAT = { message: 'social', chat_reaction: 'social', friend_request: 'social', friend_accept: 'social', friend_post: 'feed', post_reaction: 'feed', comment: 'feed',
    record: 'records', record_app: 'records', record_top: 'records', reminder: 'practice', streak: 'practice', weekly: 'practice', idle: 'idle', update: 'news', test: 'news' };
  const srv = { ok: false, push: false, tried: false, busy: false };
  let readyRes; const ready = new Promise(r => { readyRes = r; }); setTimeout(() => readyRes(), 9000);
  const lastKey = () => 'notify.srv.' + (uid() || '-');
  /** Sima's words in the app's language (the server's own copy is Georgian or English only) */
  function words(r) {
    const p = r.params || {}, k = r.kind, w = p.what || 'message';
    const n = p.name || t('sn.someone'), e = p.e ? PD.social.glyphText(p.e) : '';
    const on = t(k === 'chat_reaction' && w === 'audio' ? 'sn.on.audioC' : 'sn.on.' + (['photo', 'video', 'audio', 'text'].includes(w) ? w : 'message'));
    const fw = form => t('sn.' + form + '.' + (['photo', 'video', 'audio'].includes(w) ? w : 'text'));
    const todo = Array.isArray(p.todo) && p.todo.length ? ' ' + t('sn.waiting', { s: p.todo.slice(0, 3).map(x => t('sn.todo.' + (['exam', 'song', 'theory', 'chapter'].includes(x.k) ? x.k : 'lesson'), { s: x.s || '' })).join(' · ') }) : '';
    let body;
    switch (k) {
      case 'message': body = t('sn.message', { n, s: p.s || t({ photo: 'cm.mPhoto', video: 'cm.mVideo', audio: 'cm.mAudio', post: 'cm.mPost', sticker: 'cm.mSticker', gif: 'cm.mGif' }[w] || 'cm.mPost') }); break;
      case 'chat_reaction': body = t('sn.chat_reaction', { n, w: on, e }); break;
      case 'post_reaction': body = p.more ? t('sn.post_reactions', { n, k: p.more, w: on, e }) : t('sn.post_reaction', { n, w: on, e }); break;
      case 'comment': body = t('sn.comment', { n, w: on, s: p.s || '' }); break;
      case 'friend_post': body = t(p.s ? 'sn.friend_postS' : 'sn.friend_post', { n, w: fw('dat'), s: p.s || '' }); break;
      case 'friend_request': body = t('sn.friend_request', { n: n + (p.nick ? ' (@' + p.nick + ')' : '') }); break;
      case 'friend_accept': body = t('sn.friend_accept', { n }); break;
      case 'record': body = t('sn.record', { w: fw('erg'), num: p.n, m: t('sn.m.' + (p.metric === 'views' ? 'views' : p.metric === 'comments' ? 'comments' : 'reactions')) }); break;
      case 'record_app': body = t('sn.record_app', { w: fw('dat') }); break;
      case 'record_top': body = t('sn.record_top', { w: fw('nom') }); break;
      case 'reminder': body = ((+p.streak || 0) >= 3 ? t('sn.reminderS', { n: p.streak }) : t('sn.reminder', { m: p.m || 10 })) + todo; break;
      case 'idle': body = t('sn.idle', { num: p.n }) + todo; break;
      case 'streak': body = t('sn.streak', { num: p.n }); break;
      case 'weekly': body = +p.m ? t('sn.weekly', { m: p.m }) : t('sn.weekly0'); break;
      case 'update': body = p.s ? t('sn.update', { v: p.v, s: p.s }) : t('sn.update0', { v: p.v }); break;
      case 'test': body = t('sn.test'); break;
      default: return { title: r.title, body: r.body };
    }
    return { title: t('sn.' + k + '.t', { num: p.n }), body };
  }
  /** the server's new notifications into the inbox; each new one shown once, the way this device can */
  async function pull() {
    const c = C();
    if (!c || !c.session || !c.configured) { readyRes(); return; }
    if (srv.busy) return;
    srv.busy = true;
    try {
      const me = c.uid, last = PD.store.get(lastKey(), 0);
      let rows;
      try { rows = (await c.notes.since(last)) || []; srv.ok = true; }
      catch (e) { if (!srv.tried) srv.ok = false; return; }
      finally { srv.tried = true; readyRes(); }
      // read on another device: read here too
      const open = log().filter(x => x.srv && !x.read).map(x => x.srv).slice(0, 80);
      if (open.length) { try { const done = new Set(((await c.notes.status(open)) || []).map(r => r.id)); if (done.size) { const all = raw(); all.forEach(x => { if (x.srv && done.has(x.srv)) x.read = true; }); PD.store.set(LOG, all); PD.bus.emit('notify.read', null); } } catch (_) {} }
      if (!rows.length) return;
      rows.sort((a, b) => a.id - b.id);
      const first = !last, all = raw(), have = new Set(all.filter(x => x.srv).map(x => x.srv)), add = [];
      rows.forEach(r => { if (have.has(r.id)) return; const w = words(r);
        add.push({ id: 'n' + r.id, srv: r.id, uid: me, kind: CAT[r.kind] || 'news', sk: r.kind, title: w.title, body: w.body, go: r.go, tag: r.tag, at: Date.parse(r.created_at) || Date.now(), read: !!r.read_at }); });
      // a newer one with the same tag replaces the older unread one, as on the server (one row per chat, per post)
      const tags = new Set(); const next = add.slice().reverse().concat(all).filter(x => { if (!x.srv || !x.tag || x.read) return true; const key = x.uid + '|' + x.tag; if (tags.has(key)) return false; tags.add(key); return true; });
      PD.store.set(LOG, next.slice(0, 80));
      PD.store.set(lastKey(), Math.max(last, rows[rows.length - 1].id));
      if (!first) add.filter(x => !x.read).forEach(arrive);
      if (add.length) PD.bus.emit('notify.new', add[add.length - 1]);
    } finally { srv.busy = false; }
  }
  function here(go) { if (!go || !PD.app) return false; const [r, ...rest] = String(go).split(':'); const p = rest.join(':'); return PD.app.route === r && (!p || String(PD.app.param || '').split(':').slice(0, 2).join(':') === p.split(':').slice(0, 2).join(':')); }
  function arrive(x) {
    if (here(x.go) && document.visibilityState === 'visible') { markRead(x.id); return; }   // already looking at it
    if (document.visibilityState === 'visible') { pop(x); return; }
    // the app is in the background: this device shows it itself unless push already did
    if (!srv.push && wants(x.kind) && !quietNow()) system(x.kind, x.title, x.body, x.go, x.tag, { id: x.srv });
  }

  /* ---------------- this device on the account's list (Web Push; FCM in the native app once Firebase is set up) ---------------- */
  const b64 = s => { const pad = '='.repeat((4 - s.length % 4) % 4), r = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from([...r].map(c => c.charCodeAt(0))); };
  const toB64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const deviceLabel = () => { const ua = navigator.userAgent; const os = (ua.match(/(iPhone|iPad|Android|Windows|Mac OS X|Linux|CrOS)/) || ['?'])[0].replace('Mac OS X', 'macOS');
    const br = electron() ? 'Desktop app' : native() ? 'App' : /Edg\//.test(ua) ? 'Edge' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    return br + ' · ' + os + (matchMedia('(display-mode: standalone)').matches ? ' · PWA' : ''); };
  async function subscribePush() {
    const c = C(); srv.push = false;
    if (!c || !c.session || !c.configured || !prefs().on) return null;
    try {
      if (native()) {
        const pn = PN(); if (!pn || electron()) return null;   // the push plugin is part of the native build only once Firebase is configured
        await pn.addListener('registration', tk => { c.notes.register('fcm', tk.value, null, null, PD.i18n.lang, deviceLabel()).then(() => { PD.store.set('push.endpoint', tk.value); srv.push = true; }).catch(() => {}); });
        await pn.addListener('pushNotificationActionPerformed', a => { const d = a && a.notification && a.notification.data; if (d && d.go) openFrom(d.go); });
        await pn.register(); return 'native';
      }
      if (!('serviceWorker' in navigator) || !('PushManager' in window) || !window.Notification || Notification.permission !== 'granted') return null;
      let key = PD.store.get('push.vapid', null);
      if (!key) { const j = await c.notes.vapid(); key = j && j.key; if (!key) return null; PD.store.set('push.vapid', key); }
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      const made = sub && sub.options && sub.options.applicationServerKey ? toB64(sub.options.applicationServerKey) : null;
      if (sub && made && made !== key) { await sub.unsubscribe().catch(() => {}); sub = null; }   // made with an older key: it cannot be used
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) });
      const j = sub.toJSON();
      await c.notes.register('web', j.endpoint, j.keys.p256dh, j.keys.auth, PD.i18n.lang, deviceLabel());
      PD.store.set('push.endpoint', j.endpoint);
      srv.push = true;
      return 'web';
    } catch (e) { console.warn('push:', e && e.message || e); return null; }
  }

  /* ---------------- what the server needs for the reminder at my hour ---------------- */
  function facts() {
    const ss = (PD.lessons && PD.lessons.progress.sessions()) || [];
    const lastAt = ss.reduce((a, s) => Math.max(a, s.date || 0), 0);
    const days = {}; ss.forEach(s => { days[new Date(s.date).toDateString()] = 1; });
    let streak = 0; for (let i = days[new Date().toDateString()] ? 0 : 1; i <= 400; i++) { if (days[new Date(Date.now() - i * 864e5).toDateString()]) streak++; else break; }
    const week = Math.round(ss.filter(s => s.date > Date.now() - 7 * 864e5).reduce((a, s) => a + (s.dur || 0), 0) / 60);
    const todo = [];
    try {
      const ex = PD.exam && PD.exam.waiting && PD.exam.waiting(), e = ex && PD.exam.get(ex);
      if (e && prefs().kinds.exam !== false) todo.push({ k: 'exam', s: t(e.name) });
      const steps = [].concat(...((PD.lessons && PD.lessons.PATHS) || []).map(p => p.steps));
      const song = steps.find(s => s.kind === 'lesson' && !PD.app.stepDone(s));
      if (song) todo.push({ k: 'song', s: PD.app.stepTitle(song) });
      const done = PD.store.get('theory.done', {}), old = Object.keys(done).filter(id => done[id] < Date.now() - 7 * 864e5).sort((a, b) => done[a] - done[b])[0];
      const ch = old && PD.theoryBook.CHAPTERS.find(x => x.id === old);
      if (ch) todo.push({ k: 'theory', s: PD.i18n.pick({ ka: ch.t[0], en: ch.t[1] }) });
      else { const next = steps.find(s => s.kind === 'chapter' && !PD.app.stepDone(s)); if (next) todo.push({ k: 'chapter', s: PD.app.stepTitle(next) }); }
    } catch (_) {}
    let tz = 'Asia/Tbilisi'; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch (_) {}
    return { lang: PD.i18n.lang, tz, goal_min: PD.store.get('goalMin', 15), last_practice: lastAt ? new Date(lastAt).toISOString() : null, streak, week_min: Math.min(20000, week), todo: todo.slice(0, 3).map(x => ({ k: x.k, s: String(x.s || '').slice(0, 60) })) };
  }
  let syncT = 0;
  /** explicit: the learner changed a setting here, so this device's choices go to the account */
  function syncServer(explicit) {
    clearTimeout(syncT);
    syncT = setTimeout(() => {
      const c = C(); if (!c || !c.session || !c.configured) return;
      const p = prefs(), s = facts();
      if (p.on || explicit) Object.assign(s, { enabled: !!p.on, kinds: p.kinds, quiet: p.quiet !== false, hour: p.hour || 19 });
      c.notes.settings(s).catch(() => {});
    }, explicit ? 300 : 3000);
  }
  /** the server sends the reminders for this account: local ones would come twice */
  const serverReminders = () => srv.ok && C() && C().session;

  /* ---------------- local reminders (no server, or before it answered) ----------------
     On the installed app these are real alarms, set by the system.
     In a browser the schedule is written where the service worker can
     read it, and what is due is also shown the next time the app opens. */
  function plan() {
    const out = [], p = prefs(), now = Date.now();
    const at = (d, hh, mm) => { const x = new Date(d); x.setHours(hh, mm || 0, 0, 0); return x.getTime(); };
    const goal = PD.store.get('goalMin', 15), byServer = serverReminders();
    if (wants('practice') && !byServer) {
      for (let i = 0; i < 7; i++) {
        const when = at(now + i * 864e5, p.hour || 19);
        if (when > now + 60000) out.push({ id: 1000 + i, kind: 'practice', at: when, title: t('nt.practiceT'), body: t('nt.practiceB', { m: goal }), go: 'daily' });
      }
    }
    if (wants('idle') && !byServer) out.push({ id: 1100, kind: 'idle', at: now + 3 * 864e5, title: t('nt.idleT'), body: t('nt.idleB', { n: 3 }), go: 'home' });
    if (wants('exam') && !byServer) { const ex = PD.exam && (PD.exam.active() || (PD.exam.dueExam && PD.exam.dueExam()));
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
  async function catchUp() {
    await ready;
    const p = prefs(), today = new Date().toDateString(), byServer = serverReminders();
    const last = PD.store.get('notify.lastOpen', 0), days = last ? Math.floor((Date.now() - last) / 864e5) : 0;
    PD.store.set('notify.lastOpen', Date.now());
    const LS = PD.lessons, ss = LS ? LS.progress.sessions() : [];
    const minsToday = ss.filter(s => new Date(s.date).toDateString() === today).reduce((a, s) => a + (s.dur || 0), 0) / 60;
    if (!byServer) {   // with the server, Sima sends these at the learner's hour to every device
      if (days >= 3 && wants('idle')) show('idle', t('nt.idleT'), t('nt.idleB', { n: days }), 'home', 'idle:' + today);
      if (wants('practice') && !minsToday && new Date().getHours() >= (p.hour || 19)) {
        const days2 = {}; ss.forEach(s => { days2[new Date(s.date).toDateString()] = 1; });
        let n = 0; for (let i = 1; i <= 60; i++) { if (days2[new Date(Date.now() - i * 864e5).toDateString()]) n++; else break; }
        if (n >= 3) show('practice', t('nt.streakT'), t('nt.streakB', { n }), 'daily', 'streak:' + today);
        else show('practice', t('nt.practiceT'), t('nt.practiceB', { m: PD.store.get('goalMin', 15) }), 'daily', 'practice:' + today);
      }
      if (wants('exam') && PD.exam) { const a = PD.exam.active(); const id = a ? a.id : (PD.exam.dueExam ? PD.exam.dueExam() : null); const e = id && PD.exam.get(id);
        if (e) show('exam', t('nt.examT'), t('nt.examB', { s: t(e.name) }), 'home', 'exam:' + e.id + ':' + today); }
    }
    // premium that is ending or over (the app knows this itself)
    if (wants('premium') && PD.premium) { const u = PD.premium.until;
      if (u) { const left = Math.ceil((u.getTime() - Date.now()) / 864e5);
        if (left <= 3 && left > 0) show('premium', t('nt.premSoonT'), t('nt.premSoonB', { n: left, p: (PD.premium.PRICE && PD.premium.PRICE.monthly) || '' }), 'profile', 'prem:' + u.toDateString());
        if (left <= 0) show('premium', t('nt.premEndT'), t('nt.premEndB'), 'profile', 'premEnd:' + u.toDateString()); } }
    schedule();
    syncServer();
  }

  /* ---------------- new messages on a server without Sima's notifications (older backend) ---------------- */
  async function pollSocial() {
    const c = C();
    if (srv.ok || !wants('social') || !c || !c.session || !c.configured) return;
    try {
      const rows = await c.chat.list(); if (!rows) return;
      const seen = PD.store.get('notify.chat', {}), next = {};
      let first = !Object.keys(seen).length;
      rows.forEach(r => { const at = r.last_at ? new Date(r.last_at).getTime() : 0; next[r.id] = at;
        if (!first && at && at > (seen[r.id] || 0) && r.last_sender && r.last_sender !== c.uid)
          show('social', t('nt.msgT'), t('nt.msgB', { n: r.other_name || '', s: (r.last_body || '').slice(0, 80) }), 'community:c:' + r.id + ':' + (r.other_name || ''), 'msg:' + r.id + ':' + at);
      });
      PD.store.set('notify.chat', next);
    } catch (_) {}
  }
  let pollT = 0, account = null;
  function tick() { if (document.visibilityState === 'visible' || !srv.push) { pull(); pollSocial(); } }
  function watch(on) {
    clearInterval(pollT); if (on === false) return;
    pollT = setInterval(tick, document.visibilityState === 'visible' ? 20000 : 60000);
    tick();
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { pull(); watch(); } else watch(); });
  // another account on this device, or a sign-in: its notifications, its device registration
  PD.bus.on('cloud', e => { const id = e && e.session && e.session.user && e.session.user.id; if (id === account) return; account = id || null; if (!id) { srv.ok = false; srv.push = false; return; } pull(); subscribePush(); syncServer(); });
  PD.bus.on('session', () => syncServer());
  PD.bus.on('lang', () => syncServer());

  /* ---------------- a notification that was tapped ---------------- */
  function openFrom(go) {
    if (!go || !PD.app) return;
    const [r, ...rest] = String(go).split(':'), p = rest.join(':');
    try { PD.app.go(r, p || null); } catch (_) {}
  }
  try {
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => {
      const d = e.data || {};
      if (d.type === 'notification') { if (d.id) { const x = raw().find(y => y.srv === d.id); if (x) markRead(x.id); else if (C() && C().session) C().notes.read([d.id]).catch(() => {}); } if (d.go) openFrom(d.go); }
      if (d.type === 'push') pull();   // a push arrived while the app is open: the inbox catches up at once
    });
    const q = new URLSearchParams(location.search), go = q.get('go'), nid = +q.get('nid');
    if (go) setTimeout(() => { openFrom(go); if (nid && C() && C().session) C().notes.read([nid]).catch(() => {}); }, 600);
  } catch (_) {}

  /* ---------------- the settings section ---------------- */
  function settingsSection(mk) {
    const { sect, row } = mk, p = prefs();
    const rows = [];
    rows.push(h('p', { class: 'muted small-note sn-from' }, [h('span', { class: 'sn-av', 'aria-hidden': 'true', text: t('sn.sima')[0] }), h('span', { 'data-t': 'nt.fromSima' })]));
    if (!p.on) rows.push(h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'nt.title' }), h('small', { 'data-t': 'nt.lead' })]),
      h('button', { class: 'btn small primary', 'data-t': 'nt.ask', onclick: async () => { const ok = await ask(); if (!ok) PD.ui.toast(t(canSystem() ? 'nt.denied' : 'nt.unsupported'), 5000); PD.app.render(); } })]));
    else {
      rows.push(row('nt.on', null, (() => { const c = h('input', { type: 'checkbox', 'aria-label': t('nt.on') }); c.checked = true; c.onchange = () => { const q2 = prefs(); q2.on = false; save(q2); syncServer(true); schedule(); PD.app.render(); }; return c; })()));
      KINDS.forEach(k => rows.push(row('nt.k.' + k, t('nt.k.' + k + 'D'), (() => {
        const c = h('input', { type: 'checkbox', 'aria-label': t('nt.k.' + k) }); c.checked = p.kinds[k] !== false;
        c.onchange = () => { const q2 = prefs(); q2.kinds[k] = c.checked; save(q2); schedule(); syncServer(true); }; return c; })())));
      const hour = h('input', { type: 'time', class: 'input', value: String(p.hour || 19).padStart(2, '0') + ':00', style: 'max-width:120px' });
      hour.onchange = () => { const q2 = prefs(); q2.hour = Math.max(0, Math.min(23, parseInt(hour.value, 10) || 19)); save(q2); schedule(); syncServer(true); };
      rows.push(row('nt.hour', null, hour));
      rows.push(row('nt.quiet', t('nt.quietD'), (() => { const c = h('input', { type: 'checkbox', 'aria-label': t('nt.quiet') }); c.checked = p.quiet !== false; c.onchange = () => { const q2 = prefs(); q2.quiet = c.checked; save(q2); syncServer(true); }; return c; })()));
      const status = h('small', { class: 'muted', 'data-t': srv.push ? 'nt.devPush' : native() && !electron() ? 'nt.devNative' : 'nt.devOpen' });
      rows.push(h('div', { class: 'li' }, [h('div', { class: 'grow' }, [status]),
        h('span', { class: 'row', style: 'gap:6px' }, [h('button', { class: 'btn small', 'data-t': 'nt.test', onclick: async () => {
          if (srv.ok) { try { await C().notes.test(); PD.ui.toast(t('nt.sentAll'), 4000); setTimeout(pull, 1500); return; } catch (e) { if (/slow-down/.test(e && e.message)) return; } }
          show('news', t('nt.testT'), t('nt.testB'), 'home'); } }),
          h('button', { class: 'btn small', 'data-t': 'nt.inbox', onclick: () => PD.app.go('inbox') })])]));
      if (!native() && !srv.push) rows.push(h('p', { class: 'notice', 'data-t': 'nt.webNote' }));
    }
    const out = document.createDocumentFragment(); out.appendChild(sect('nt.title', rows));
    if (C() && C().isOwner) out.appendChild(announceSection(sect));
    return out;
  }
  /** the owner: tell every member about a new version, once */
  function announceSection(sect) {
    const v = h('input', { class: 'input', maxlength: '40', value: PD.BUILD || '', 'aria-label': t('up.version'), placeholder: t('up.version') });
    const ka = h('textarea', { class: 'input', rows: '2', maxlength: '240', placeholder: t('up.noteKa'), 'aria-label': t('up.noteKa'), style: 'min-height:56px;padding:8px 12px' });
    const en = h('textarea', { class: 'input', rows: '2', maxlength: '240', placeholder: t('up.noteEn'), 'aria-label': t('up.noteEn'), style: 'min-height:56px;padding:8px 12px' });
    const go = h('button', { class: 'btn primary', 'data-t': 'up.send' });
    go.onclick = () => { if (!v.value.trim()) return v.focus(); PD.ui.confirm(t('up.lead'), async () => {
      go.disabled = true;
      try { const n = await C().notes.announce(v.value.trim(), ka.value.trim(), en.value.trim()); PD.ui.toast(t('up.sent', { n }), 5000); setTimeout(pull, 1500); }
      catch (e) { PD.ui.toast(/duplicate|23505|unique/i.test((e && (e.message + e.code)) || '') ? t('up.dup') : PD.community.util.err(e), 5000); }
      finally { go.disabled = false; } }); };
    return sect('up.title', [h('div', { class: 'li', style: 'flex-direction:column;align-items:stretch;gap:8px' }, [h('small', { class: 'muted', 'data-t': 'up.lead' }), v, ka, en, go])]);
  }

  /* ---------------- the inbox page ---------------- */
  function page(w) {
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('profile') }), h('h1', { 'data-t': 'nt.title', style: 'margin:0' })]));
    pull();
    const all = log();
    if (!all.length) { w.append(h('p', { class: 'muted', 'data-t': 'nt.none' })); PD.i18n.apply(w); return; }
    w.append(h('div', { class: 'row', style: 'gap:8px' }, [h('button', { class: 'btn small', 'data-t': 'nt.readAll', onclick: () => { markRead(); PD.app.render(); } }),
      h('button', { class: 'btn small ghost', 'data-t': 'nt.clear', onclick: () => { clear(); PD.app.render(); } })]));
    const list = h('div', { class: 'nt-list' });
    all.forEach(x => list.append(h('button', { class: 'nt-row' + (x.read ? '' : ' new'), onclick: () => { markRead(x.id); if (x.go) openFrom(x.go); else PD.app.render(); } }, [
      x.srv ? h('span', { class: 'sn-av', 'aria-hidden': 'true', text: t('sn.sima')[0] }) : h('span', { class: 'nt-dot', 'aria-hidden': 'true' }),
      h('span', { class: 'grow' }, [h('b', { text: x.title }), x.body ? h('small', { text: x.body }) : null, h('small', { class: 'muted', text: PD.ui.daysAgo(x.at) })].filter(Boolean))])));
    w.append(list);
    markRead();   // seen: the badge goes, on every device
    PD.i18n.apply(w);
  }

  return { ask, show, note, log, unread, markRead, readTag, clear, schedule, catchUp, plan, prefs, save, wants, settingsSection, page, subscribePush, pollSocial, pull, watch, openFrom, syncServer, words, KINDS, canSystem, perm, native, get server() { return { ok: srv.ok, push: srv.push }; } };
})();
