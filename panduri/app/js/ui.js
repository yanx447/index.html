/* =====================================================================
   UI strings (every visible string lives here or next to its module),
   icons and small UI helpers: toast, sheet, confirm.
   ===================================================================== */
PD.i18n.add({
  'app.name': ['ფანდური', 'Panduri'],
  'nav.home': ['მთავარი', 'Home'], 'nav.learn': ['სწავლა', 'Learn'], 'nav.tools': ['ხელსაწყოები', 'Tools'], 'nav.progress': ['პროგრესი', 'Progress'], 'nav.settings': ['პარამეტრები', 'Settings'],
  'cat.song': ['სიმღერები', 'Songs'], 'cat.melody': ['მელოდიები', 'Melodies'], 'cat.solo': ['სოლოები', 'Solos'], 'cat.exercise': ['სავარჯიშოები', 'Exercises'],
  'type.song': ['სიმღერა', 'Song'], 'type.melody': ['მელოდია', 'Melody'], 'type.solo': ['სოლო', 'Solo'], 'type.exercise': ['სავარჯიშო', 'Exercise'],
  'lvl.1': ['დამწყები', 'Beginner'], 'lvl.2': ['საშუალო', 'Intermediate'], 'lvl.3': ['რთული', 'Hard'], 'lvl.4': ['ოსტატი', 'Master'],
  'home.continue': ['განაგრძე სწავლა', 'Continue learning'], 'home.go': ['გაგრძელება', 'Continue'], 'home.start': ['დაწყება', 'Start'], 'home.firstTime': ['დაიწყე პირველი გაკვეთილით', 'Start with the first lesson'],
  'home.recommended': ['რეკომენდებული', 'Recommended'], 'home.recent': ['ბოლოს ნავარჯიშები', 'Recently practiced'], 'home.library': ['ბიბლიოთეკა', 'Library'],
  'home.search': ['ძიება: სიმღერა, მელოდია, ტექნიკა…', 'Search: song, melody, technique…'],
  'home.practiceTime': ['ვარჯიში', 'Practice'], 'home.comfortTempo': ['კომფორტული ტემპი', 'Comfortable tempo'], 'home.streak': ['დღე ზედიზედ', 'days in a row'], 'home.lessonsDone': ['დასრულებული', 'Completed'],
  'f.all': ['ყველა', 'All'], 'f.inprog': ['მიმდინარე', 'In progress'], 'f.done': ['დასრულებული', 'Completed'], 'f.fav': ['რჩეულები', 'Favorites'], 'f.new': ['ახალი', 'Not started'],
  'f.level': ['სირთულე', 'Difficulty'], 'f.tempo': ['ტემპი', 'Tempo'], 'f.sort': ['დალაგება', 'Sort'], 'f.anyLevel': ['ნებისმიერი სირთულე', 'Any difficulty'], 'f.anyTempo': ['ნებისმიერი ტემპი', 'Any tempo'],
  's.rec': ['რეკომენდებული', 'Recommended'], 's.recent': ['ბოლოს ნავარჯიში', 'Recently practiced'], 's.title': ['სახელით', 'By title'], 's.tempo': ['ტემპით', 'By tempo'], 's.level': ['სირთულით', 'By difficulty'],
  'l.notes': ['{n} ნოტა', '{n} notes'], 'l.empty': ['ჯერ არ ჩაწერილა', 'Not recorded yet'], 'l.last': ['ბოლოს: {d}', 'Last: {d}'], 'l.never': ['ჯერ არ გივარჯიშია', 'Not practiced yet'], 'l.mastery': ['ათვისება', 'Mastery'],
  'l.today': ['დღეს', 'today'], 'l.daysAgo': ['{n} დღის წინ', '{n} days ago'], 'l.min': ['{n} წთ', '{n} min'],
  'lib.none': ['ამ ფილტრით არაფერი მოიძებნა.', 'Nothing matches these filters.'], 'lib.noSolos': ['სოლოები ჯერ არ არის. შექმენი საკუთარი სტუდიაში — დაუკარი და პროგრამა ჩაიწერს.', 'No solos yet. Create one in the Studio — play it and the app records it.'],
  'lib.new': ['ახალი გაკვეთილი', 'New lesson'],
  'learn.title': ['სწავლის გზა', 'Learning paths'], 'learn.lead': ['ნაბიჯ-ნაბიჯ: ყოველ გაკვეთილს ერთი ახალი რამ მოაქვს.', 'Step by step: each lesson adds one new thing.'],
  'learn.steps': ['{d}/{n} ნაბიჯი', '{d}/{n} steps'], 'learn.needs': ['საჭიროა მასწავლებლის ვიდეო — ჯერ არ დამატებულა', 'Needs a teacher video — not added yet'],
  'learn.tour': ['ინტერაქტიული ტური 3D-ში', 'Interactive 3D tour'], 'learn.tuner': ['ტიუნერი', 'Tuner'], 'learn.open': ['გახსნა', 'Open'],
  'st.listen': ['მოსმენა', 'Preview / listen'], 'st.rhythm': ['რიტმის სწავლა', 'Learn the rhythm'], 'st.notes': ['ნოტები და თითები', 'Notes and fingering'], 'st.wait': ['WAIT ვარჯიში', 'WAIT practice'],
  'st.slow': ['ნელი ვარჯიში', 'Slow practice'], 'st.phrase': ['ფრაზების ვარჯიში', 'Phrase practice'], 'st.perform': ['სრული შესრულება', 'Full performance'], 'st.result': ['შედეგი', 'Result'], 'st.next': ['შემდეგი ნაბიჯი', 'Suggested next'],
  'std.listen': ['მოუსმინე: პროგრამა სრულ ტემპზე დაუკრავს, ხელები აჩვენებენ მოძრაობას.', 'Listen: the app plays it at full tempo and the hands show the motion.'],
  'std.listenRef': ['ჩანაწერი: ', 'Recording: '],
  'std.rhythm': ['მხოლოდ დარტყმები: ↓ / ↑ ღილაკებით ან მიკროფონით, ნოტების გარეშე.', 'Strokes only: ↓ / ↑ buttons or microphone, without the notes.'],
  'std.notes': ['ნაბიჯ-ნაბიჯ: „მაჩვენე“ → „შენი ჯერი“. თითები და ლადები ჩანს.', 'Note by note: “Show me” → “Your turn”. Fingers and frets are shown.'],
  'std.wait': ['გაკვეთილი ყოველ ნოტაზე ჩერდება, სანამ სწორად არ დაუკრავ.', 'The lesson stops at every note until you play it right.'],
  'std.slow': ['60% ტემპით, ლოდინის გარეშე — დრო ფასდება.', '60% tempo, no waiting — timing is scored.'],
  'std.phrase': ['ყველაზე სუსტი მონაკვეთი ციკლში, ტემპი ეტაპობრივად იზრდება.', 'Your weakest section on a loop; tempo rises step by step.'],
  'std.perform': ['სრული ტემპი, მინიმალური დახმარება, ბოლოს — ანალიზი.', 'Full tempo, minimal help, then an analysis.'],
  'les.record': ['ჩაწერა დაკვრით', 'Record by playing'], 'les.edit': ['სტუდიაში რედაქტირება', 'Edit in Studio'], 'les.ref': ['ჩანაწერი ↗', 'Recording ↗'], 'les.noNotes': ['ამ სიმღერას ნოტები ჯერ არ აქვს. ჩაწერე დაკვრით ან სტუდიაში შეიყვანე — ნოტებს პროგრამა არ იგონებს.', 'This song has no notes yet. Record it by playing or enter it in the Studio — the app never invents notes.'],
  'les.resume': ['გაგრძელება: {s}', 'Resume: {s}'], 'les.best': ['საუკეთესო: {p}%', 'Best: {p}%'], 'les.maxTempo': ['მაქს. ტემპი: {p}%', 'Max tempo: {p}%'],
  'back': ['უკან', 'Back'], 'close': ['დახურვა', 'Close'], 'save': ['შენახვა', 'Save'], 'cancel': ['გაუქმება', 'Cancel'], 'delete': ['წაშლა', 'Delete'], 'confirm': ['დადასტურება', 'Confirm'], 'done': ['მზადაა', 'Done'], 'next': ['შემდეგი', 'Next'], 'prev': ['წინა', 'Previous'], 'skip': ['გამოტოვება', 'Skip'], 'yes': ['დიახ', 'Yes'], 'later': ['მოგვიანებით', 'Later'], 'on': ['ჩართ.', 'On'], 'off': ['გამორთ.', 'Off'], 'sure': ['დარწმუნებული ხარ?', 'Are you sure?'],
  'tools.title': ['ხელსაწყოები', 'Tools'], 'tools.tuner': ['ტიუნერი', 'Tuner'], 'tools.chords': ['აკორდები', 'Chords'], 'tools.fret': ['ტარის რუკა', 'Fretboard'], 'tools.3d': ['3D ფანდური', '3D panduri'], 'tools.studio': ['სტუდია', 'Studio'],
  'tools.tunerD': ['A · C♯ · E — ავტომატური ან სიმ-სიმ.', 'A · C♯ · E — auto or string by string.'], 'tools.chordsD': ['ყველა აკორდი 3-სიმიან დიაგრამაზე, ხელით და ხმით.', 'Every chord on a 3-string diagram, with hand and sound.'], 'tools.fretD': ['17 ლადი × 3 სიმი: ნოტები, ოქტავები, „იპოვე ნოტა“.', '17 frets × 3 strings: notes, octaves, “find the note”.'], 'tools.3dD': ['შენი ინსტრუმენტი 3D-ში, ნაწილები და ტური.', 'Your instrument in 3D, its parts and a tour.'], 'tools.studioD': ['გაკვეთილის რედაქტორი მასწავლებლისთვის.', 'The lesson editor for teachers.'],
  'mic.on': ['მიკრ. ჩართულია', 'Mic on'], 'mic.off': ['მიკრ. გამორთულია', 'Mic off'], 'mic.why': ['მიკროფონი გჭირდება, რომ პროგრამამ შენი დაკვრა მოისმინოს. ხმა მხოლოდ ამ მოწყობილობაზე მუშავდება და არსად იგზავნება ან იწერება.', 'The microphone lets the app hear your playing. Audio is analysed only on this device; it is never sent or recorded.'],
  'mic.denied': ['მიკროფონზე წვდომა უარყოფილია. ჩართე ბრაუზერის პარამეტრებში, ან ივარჯიშე შეხებით.', 'Microphone access was denied. Allow it in the browser settings, or practice by touch.'],
  'mic.blocked': ['ამ ჩაშენებულ ხედში (claude.ai-ის გვერდი) ბრაუზერი მიკროფონს ბლოკავს. მიკროფონით სავარჯიშოდ აპი ცალკე გახსენი — ჩამოტვირთული ფაილიდან ან საკუთარი მისამართიდან.', 'This embedded view (the claude.ai page) blocks the microphone. To practise with the microphone, open the app on its own — from the downloaded file or its own address.'],
  'mic.notfound': ['მიკროფონი ვერ მოიძებნა.', 'No microphone found.'], 'mic.busy': ['მიკროფონს სხვა პროგრამა იყენებს.', 'Another app is using the microphone.'], 'mic.insecure': ['მიკროფონს უსაფრთხო (https) გვერდი სჭირდება.', 'The microphone needs a secure (https) page.'],
  'mic.ended': ['მიკროფონი გაითიშა.', 'The microphone was disconnected.'], 'mic.failed': ['მიკროფონი ვერ ჩაირთო.', 'The microphone could not start.'],
  'mic.processed': ['ბრაუზერი ხმას ამუშავებს (ხმაურის ჩახშობა) — ამოცნობა შეიძლება ნაკლებად ზუსტი იყოს.', 'The browser is processing audio (noise suppression) — recognition may be less accurate.'],
  'mic.bt': ['Bluetooth ყურსასმენებს დიდი დაყოვნება აქვს — ჩაატარე დაყოვნების ტესტი.', 'Bluetooth headphones add latency — run the latency test.'],
  'acct.guest': ['სტუმარი', 'Guest'], 'acct.guestD': ['პროგრესი ინახება ამ მოწყობილობაზე.', 'Progress is saved on this device.'], 'acct.account': ['ანგარიში', 'Account'],
  'acct.noBackend': ['სინქრონიზაციის სერვერი ჯერ არ არის მიერთებული, ამიტომ შესვლის ფორმა გამორთულია. ყველაფერი ამ მოწყობილობაზე ინახება; მონაცემები ფაილით გადაიტანე.', 'No sync server is connected yet. We will not show a fake login — everything is stored on this device; you can move your data as a file.'],
  'acct.export': ['მონაცემების ექსპორტი', 'Export my data'], 'acct.import': ['მონაცემების იმპორტი', 'Import data'], 'acct.name': ['სახელი', 'Name'],
  'toast.saved': ['შენახულია', 'Saved'], 'toast.imported': ['იმპორტი დასრულდა', 'Import complete'], 'toast.copied': ['დაკოპირდა', 'Copied'], 'toast.offline': ['ოფლაინ რეჟიმი: შენახული გაკვეთილები მუშაობს', 'Offline: saved lessons still work'],
  'kbd.help': ['კლავიშები: Space — დაკვრა/პაუზა · R — თავიდან · L — ციკლი · M — მეტრონომი · W — WAIT · ← → — ტაქტი · Esc — დახურვა', 'Keys: Space — play/pause · R — restart · L — loop · M — metronome · W — WAIT · ← → — bar · Esc — close']
});

PD.ic = (() => {
  const s = (d, extra) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>';
  return {
    home: s('<path d="M4 11l8-7 8 7v9H4z"/>'), learn: s('<path d="M4 6h10M4 10h10M4 14h7"/><path d="M17 17.5V5l3 1.5"/><circle cx="15.5" cy="17.5" r="1.8"/>'),
    tools: s('<path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l3-5"/>'), progress: s('<path d="M5 19V11M12 19V5M19 19v-6"/>'), settings: s('<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>'),
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>', pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
    restart: s('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>'), back: s('<path d="M15 5l-7 7 7 7"/>').replace('<svg', '<svg class="flip-rtl"'), close: s('<path d="M6 6l12 12M18 6L6 18"/>'),
    hand: s('<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8c0 4-2.5 7-6 7s-5-2-6.5-5L3 13a1.5 1.5 0 0 1 2.5-1.5L8 14"/>'),
    metro: s('<path d="M8 21h8l-3-17h-2z"/><path d="M12 15l5-8"/>'), loop: s('<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>'),
    mic: s('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    camera: s('<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h2l1.5-2h6l1.5 2h2A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.8"/>'),
    chat: s('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-5 4v-4.2A2.5 2.5 0 0 1 4 13.5z"/>'),
    video: s('<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3"/>'),
    hangup: s('<path d="M3 15.5c5-5 13-5 18 0l-2.5 2.5-3-2v-2.5c-2.3-.8-4.7-.8-7 0V16l-3 2z"/>'),
    send: s('<path d="M4 12l16-8-6 16-2.5-6.5z"/>'),
    lock: s('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    flip: s('<path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2M20 4v4h-4M4 20v-4h4"/>'), more: s('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'),
    star: s('<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'), starF: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/></svg>',
    search: s('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'), cube: s('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>'),
    edit: s('<path d="M4 20h4L19 9l-4-4L4 16z"/>'), panel: s('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'), full: s('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    eye: s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'), plus: s('<path d="M12 5v14M5 12h14"/>'), dl: s('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'), ul: s('<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>'),
    tune: s('<path d="M4 16a8 8 0 0 1 16 0"/><path d="M12 16l3-5"/>'), chord: s('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18M14 3v18"/><circle cx="10" cy="12" r="1.4" fill="currentColor"/>'),
    video: s('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>'),
frets: s('<path d="M3 7h18M3 12h18M3 17h18M7 5v14M12 5v14M16 5v14"/>'),
    song: s('<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'),
    pulse: s('<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>'),
    user: s('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5"/>'),
    daily: s('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M9 15l2 2 4-4"/>'),
    target: s('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    ear: s('<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 9.5a2 2 0 0 1 4 0"/>'),
    check: s('<path d="M5 12.5l4 4L19 7"/>'), chevron: s('<path d="M9 5l7 7-7 7"/>').replace('<svg', '<svg class="flip-rtl"')
  };
})();

/* ---------- finger identity: one colour + one shape per finger, the same everywhere ---------- */
PD.i18n.add({ 'fg.1': ['საჩვენებელი', 'Index'], 'fg.2': ['შუა', 'Middle'], 'fg.3': ['არათითი', 'Ring'], 'fg.4': ['ნეკი', 'Little'], 'fg.T': ['ცერა', 'Thumb'] });
PD.fingers = (() => {
  const COL = { 1: '#e5534b', 2: '#3fbf7a', 3: '#7584e3', 4: '#4c8eea', T: '#ededef' }, INK = { 1: '#ffffff', 2: '#06140c', 3: '#08090b', 4: '#ffffff', T: '#0c0d10' };
  const SYM = { 1: '●', 2: '▲', 3: '■', 4: '◆', T: '○' };
  return {
    get on() { return PD.store.get('fingerColors', true); },
    get symbols() { return PD.store.get('fingerSymbols', false); },
    /** colour for finger i (1–4, 'T'); neutral when finger colours are off */
    color(i) { return this.on && COL[i] ? COL[i] : '#dedee1'; },
    ink(i) { return this.on && INK[i] ? INK[i] : '#0c0d10'; },
    symbol(i) { return SYM[i] || ''; },
    /** label shown with a finger: its number, plus a shape when colour-blind symbols are on */
    label(i) { return String(i) + (this.symbols && SYM[i] ? ' ' + SYM[i] : ''); },
    name(i) { return t('fg.' + i); },
    COL, SYM
  };
})();

/* ---------- Back closes the top layer ----------
   Every overlay (sheet, practice screen, studio, sign-in, call) adds one history entry. The browser's or
   Android's Back then closes the overlay instead of changing the page behind it. An overlay closed by its
   own button leaves its entry behind; that entry is reused by the next overlay or page, or stepped over. */
PD.layers = (() => {
  const stack = []; let seq = 0, skip = 0;
  const here = () => history.state && history.state.layer;
  const dangling = () => { const c = here(); return !!c && !stack.some(x => x.id === c); };
  function push(close) {
    const id = seq = Math.max(seq + 1, Date.now()), st = Object.assign({}, history.state || {}, { layer: id });
    try { (dangling() ? history.replaceState : history.pushState).call(history, st, ''); } catch (_) {}
    stack.push({ id, close }); return id;
  }
  function done(id) {
    const i = stack.findIndex(x => x.id === id); if (i >= 0) stack.splice(i, 1);
    // closed by its own button: take its entry back out — unless the next overlay or page has already reused it
    if (here() === id) setTimeout(() => { if (here() === id && dangling()) { skip++; history.back(); } }, 0);
  }
  /** popstate: close the overlays above the entry we arrived at. true = handled (the page stays) */
  function onPop(e) {
    const to = (e.state && e.state.layer) || 0;
    if (skip) { skip--; if (to && dangling()) { skip++; history.back(); } return true; }   // our own clean-up step
    let n = 0;
    for (let i = stack.length - 1; i >= 0; i--) if (stack[i].id > to) { const L = stack.splice(i, 1)[0]; n++; try { L.close(true); } catch (err) { console.error(err); } }
    if (to && dangling()) { if (n) skip++; history.back(); return true; }   // a left-over overlay entry: step over it
    return n > 0;
  }
  /** a hardware Back (TV remote, Android): the top overlay first, then the page history */
  function back() { if (stack.length || dangling() || history.length > 1) { history.back(); return true; } return false; }
  return { push, done, onPop, back, dangling, get depth() { return stack.length; } };
})();

PD.i18n.add({
  'lg.ai': ['ამ ენაზე ტექსტი ხელოვნურმა ინტელექტმა თარგმნა. მასწავლებელმა ის არ შეუმოწმებია: მისი მასალის დედანი ქართულია, ხოლო ვიდეოებსა და ჩანაწერებში ისევ ქართულად საუბრობს.', 'This language was translated by AI and the teacher has not checked it. His material is written in Georgian, and he still speaks Georgian in the videos and recordings.'],
  'lg.aiShort': ['AI თარგმანი', 'AI translation'],
  'lg.choose': ['აირჩიე ენა', 'Choose your language']
});
/* A drawing's captions were sized for Georgian and English. Translated text can be longer, so while a translation is on
   screen any caption that would leave its picture is scaled down until it fits. */
(function fitDrawings() {
  const fit = svg => {
    const vb = svg.viewBox && svg.viewBox.baseVal; if (!vb || !vb.width) return;
    svg.querySelectorAll('text').forEach(el => {
      if (el.dataset.fit || !el.textContent.trim()) return;
      let b; try { b = el.getBBox(); } catch (_) { return; } if (!b.width) return;
      const over = b.x < vb.x || b.x + b.width > vb.x + vb.width; if (!over) return;
      const anchor = getComputedStyle(el).textAnchor, at = anchor === 'middle' ? b.x + b.width / 2 : anchor === 'end' ? b.x + b.width : b.x;
      const room = anchor === 'middle' ? 2 * Math.min(at - vb.x, vb.x + vb.width - at) : anchor === 'end' ? at - vb.x : vb.x + vb.width - at;
      if (room <= 0) return;
      el.dataset.fit = '1'; el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * Math.max(.55, (room - 2) / b.width)).toFixed(2) + 'px';
    });
  };
  let pending = new Set(), raf = 0;
  const flush = () => { raf = 0; const list = [...pending]; pending = new Set(); if (!PD.i18n.translated || (PD.practice && PD.practice.active)) return; list.forEach(fit); };
  const start = () => new MutationObserver(ms => {
    if (!PD.i18n.translated) return;
    ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.tagName === 'svg') pending.add(n); else if (n.querySelectorAll) n.querySelectorAll('svg').forEach(x => pending.add(x)); }));
    if (pending.size && !raf) raf = requestAnimationFrame(flush);
  }).observe(document.body, { childList: true, subtree: true });
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
/* Right-to-left text would put the sharp of a C♯ on the wrong side of its letter. An invisible left-to-right mark keeps
   every note name on screen in its own order, however the line was built. Only runs in a right-to-left language. */
(function keepNoteOrder() {
  const NOTE = /[A-G][♯♭#](?![\w♯♭#\u200E])/g, SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/;
  const rtl = () => document.documentElement.dir === 'rtl';
  const fix = n => { if (SKIP.test(n.parentNode && n.parentNode.nodeName)) return; const v = n.nodeValue; if (v.length < 2) return; const w = v.replace(NOTE, '$&\u200E'); if (w !== v) n.nodeValue = w; };
  const walk = root => { const t = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); for (let n = t.nextNode(); n; n = t.nextNode()) fix(n); };
  const start = () => {
    new MutationObserver(ms => {
      if (!rtl()) return;
      ms.forEach(m => { if (m.type === 'characterData') fix(m.target); else m.addedNodes.forEach(n => { if (n.nodeType === 3) fix(n); else if (n.nodeType === 1) walk(n); }); });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
    if (rtl()) walk(document.body);
    PD.bus.on('lang', () => { if (rtl()) walk(document.body); });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
PD.ui = (() => {
  const $ = PD.$;
  let toastT = 0;
  /** motion is welcome unless the learner (or the system) asked for less */
  const motion = () => !document.documentElement.classList.contains('rm') && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function toast(msg, ms) {
    let el = $('toast'); if (!el) { el = PD.h('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(el); }
    el.textContent = msg; el.classList.remove('out'); el.hidden = false; clearTimeout(toastT);
    toastT = setTimeout(() => { if (!motion()) { el.hidden = true; return; } el.classList.add('out'); toastT = setTimeout(() => { el.hidden = true; el.classList.remove('out'); }, 200); }, ms || 2200);
  }
  /** numbers in an element count up to their value (results, progress): "83%" → 0…83 % */
  function countUp(el, ms) {
    if (!el || !motion()) return;
    const txt = el.textContent, re = /\d+(?:[.,]\d+)?/g, nums = txt.match(re); if (!nums) return;
    const t0 = performance.now(), dur = ms || 700, ease = k => 1 - Math.pow(1 - k, 3);
    const step = tm => { if (!el.isConnected) return; if (!motion()) { el.textContent = txt; return; } const k = Math.min(1, (tm - t0) / dur); let i = 0; el.textContent = txt.replace(re, m => { const v = parseFloat(m.replace(',', '.')), d = (m.split(/[.,]/)[1] || '').length; i++; return (v * ease(k)).toFixed(d); }); if (k < 1) requestAnimationFrame(step); else el.textContent = txt; };
    requestAnimationFrame(step);
  }
  /** bottom sheet / dialog; returns close() */
  function sheet(build, opts) {
    const back = PD.h('div', { class: 'sheet-back', role: 'presentation' }), box = PD.h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true' });
    back.appendChild(box); document.body.appendChild(back);
    const prev = document.activeElement;
    let cleanup = null, closed = false, lid = 0;
    const close = fromBack => { if (closed) return; closed = true; if (fromBack !== true) PD.layers.done(lid);
      back.inert = true; if (motion()) { back.classList.add('out'); setTimeout(() => back.remove(), 230); } else back.remove();   /* the sheet slides back down */ document.removeEventListener('keydown', esc, true); if (typeof cleanup === 'function') try { cleanup(); } catch (_) {} if (opts && opts.onClose) opts.onClose(); if (prev && prev.focus && prev.isConnected) prev.focus(); };
    lid = PD.layers.push(close);
    const esc = e => {
      // Only the top sheet handles keyboard input; outer sheets stay open.
      const open = document.querySelectorAll('.sheet-back:not(.out)');
      if (open[open.length - 1] !== back) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
      else if (e.key === 'Tab') {
        const focusable = [...box.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
          .filter(el => !el.disabled && el.tabIndex >= 0 && !el.closest('[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (!first) { e.preventDefault(); box.focus(); }
        else if (!box.contains(document.activeElement) || (e.shiftKey ? document.activeElement === first || document.activeElement === box : document.activeElement === last)) {
          e.preventDefault(); (e.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener('keydown', esc, true);
    back.addEventListener('click', e => { if (e.target === back) close(); });
    dragToClose(box, () => { box.style.visibility = 'hidden'; close(); });
    cleanup = build(box, close); PD.i18n.apply(box);
    box.tabIndex = -1;
    const title = box.querySelector('h1,h2,h3');
    if (title) { if (!title.id) title.id = 'sheet-title-' + lid; box.setAttribute('aria-labelledby', title.id); }
    const f = [...box.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].find(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
    (f || box).focus();
    return close;
  }
  /** a phone sheet follows the finger down from its top and closes past a third of its height or on a quick
      flick; short of that it springs back. Only from the top of its content, so scrolling inside still scrolls. */
  function dragToClose(box, dismiss) {
    if (!(window.matchMedia && matchMedia('(max-width: 820px)').matches)) return;
    let g = null;
    box.addEventListener('touchstart', e => {
      if (e.touches.length !== 1 || box.scrollTop > 0 || e.target.closest('input, textarea, select, [type=range], .no-drag')) return;
      g = { y0: e.touches[0].clientY, y: 0, v: 0, t: performance.now(), on: false };
    }, { passive: true });
    box.addEventListener('touchmove', e => {
      if (!g) return; const dy = e.touches[0].clientY - g.y0, now = performance.now();
      if (!g.on) { if (dy < 6) { if (dy < -4) g = null; return; } g.on = true; box.classList.add('drag'); }
      e.preventDefault();
      g.v = (dy - g.y) / Math.max(1, now - g.t); g.y = dy; g.t = now;
      box.style.transform = 'translateY(' + (dy > 0 ? dy : dy / 4) + 'px)';
    }, { passive: false });
    const end = () => {
      if (!g) return; const G = g; g = null; if (!G.on) return;
      box.classList.remove('drag');
      if (G.y > box.offsetHeight / 3 || G.v > .55) {
        if (!motion()) return dismiss();
        const a = box.animate([{ transform: 'translateY(' + G.y + 'px)' }, { transform: 'translateY(100%)' }], { duration: Math.max(140, Math.min(260, (box.offsetHeight - G.y) / Math.max(.8, G.v))), easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
        a.finished.then(dismiss, dismiss);
      } else { box.classList.add('settle'); box.style.transform = ''; setTimeout(() => box.classList.remove('settle'), 420); }
    };
    box.addEventListener('touchend', end); box.addEventListener('touchcancel', end);
  }
  function confirm(msg, onYes) {
    sheet((box, close) => {
      box.append(PD.h('h2', { text: t('sure') }), PD.h('p', { class: 'fg2', text: msg }),
        PD.h('div', { class: 'row' }, [PD.h('button', { class: 'btn primary', text: t('confirm'), onclick: () => { close(); onYes(); } }), PD.h('button', { class: 'btn', text: t('cancel'), onclick: close })]));
    });
  }
  function daysAgo(ts) { if (!ts) return t('l.never'); const d = Math.floor((Date.now() - ts) / 864e5); return d <= 0 ? t('l.today') : t('l.daysAgo', { n: d }); }
  function download(name, text, type) { const b = new Blob([text], { type: type || 'application/json' }), u = URL.createObjectURL(b), a = PD.h('a', { href: u, download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
  function pickFile(accept) {
    return new Promise(res => {
      const i = PD.h('input', { type: 'file', accept, hidden: true });
      const finish = file => { i.onchange = i.oncancel = null; i.remove(); res(file); };
      i.onchange = () => finish(i.files[0] || null);
      i.oncancel = () => finish(null);
      document.body.appendChild(i); i.click();
    });
  }
  function micBlocked() { try { const pp = document.permissionsPolicy || document.featurePolicy; if (pp && pp.allowsFeature && !pp.allowsFeature('microphone')) return true; } catch (_) {} return false; }
  function micError(code) { return t('mic.' + (code === 'blocked' || (code === 'denied' && window.top !== window) ? 'blocked' : code === 'denied' ? 'denied' : code || 'failed')); }
  /** the language picker: a native list, because sixteen names do not fit a row of buttons on a phone */
  function langSelect(onpick, cls) {
    const sel = PD.h('select', { class: cls || 'input lang-sel', 'aria-label': t('set.lang'), onchange: e => onpick(e.target.value) });
    PD.bus.on('lang.fail', () => { sel.value = PD.i18n.lang; });
    PD.i18n.list.forEach(l => sel.appendChild(PD.h('option', { value: l.id, lang: l.id, text: l.name })));
    sel.value = PD.i18n.lang;
    return sel;
  }
  /** the first screen on a new device: every language under its own name, the device's language first */
  function langFirst(done) {
    const cur = PD.i18n.lang, list = [PD.i18n.list.find(l => l.id === cur)].concat(PD.i18n.list.filter(l => l.id !== cur));
    const root = PD.h('div', { class: 'lf', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('set.lang') }, [
      PD.h('div', { class: 'lf-in' }, [
        PD.h('h1', { class: 'lf-name', text: t('app.name') }),
        PD.h('p', { class: 'lf-q', text: t('lg.choose') }),
        PD.h('div', { class: 'lf-list' }, list.map(l => PD.h('button', { class: 'lf-b' + (l.id === cur ? ' on' : ''), lang: l.id, dir: l.rtl ? 'rtl' : 'ltr', text: l.name, onclick: () => PD.i18n.set(l.id).then(ok => { if (ok) { root.remove(); done(); } }) })))
      ])]);
    document.body.appendChild(root);
  }
  /** a source badge, marked when the words on it are an unchecked translation */
  const srcLabel = key => t(key) + (PD.i18n.translated ? ' · ' + t('lg.aiShort') : '');
  /** the note shown wherever a translated language is chosen or in use */
  const aiNote = () => PD.i18n.translated ? PD.h('p', { class: 'muted lang-note', text: t('lg.ai') }) : null;
  return { toast, sheet, confirm, daysAgo, download, pickFile, micError, micBlocked, countUp, motion, langSelect, langFirst, srcLabel, aiNote };
})();
