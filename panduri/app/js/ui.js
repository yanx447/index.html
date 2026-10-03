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
    restart: s('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>'), back: s('<path d="M15 5l-7 7 7 7"/>'), close: s('<path d="M6 6l12 12M18 6L6 18"/>'),
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
    check: s('<path d="M5 12.5l4 4L19 7"/>'), chevron: s('<path d="M9 5l7 7-7 7"/>')
  };
})();

/* ---------- finger identity: one colour + one shape per finger, the same everywhere ---------- */
PD.i18n.add({ 'fg.1': ['საჩვენებელი', 'Index'], 'fg.2': ['შუა', 'Middle'], 'fg.3': ['არათითი', 'Ring'], 'fg.4': ['ნეკა', 'Little'], 'fg.T': ['ცერა', 'Thumb'] });
PD.fingers = (() => {
  const COL = { 1: '#E5534B', 2: '#3FBF7A', 3: '#E8C547', 4: '#4C8EEA', T: '#F2EFEA' }, INK = { 1: '#fff', 2: '#06140C', 3: '#191200', 4: '#fff', T: '#14110E' };
  const SYM = { 1: '●', 2: '▲', 3: '■', 4: '◆', T: '○' };
  return {
    get on() { return PD.store.get('fingerColors', true); },
    get symbols() { return PD.store.get('fingerSymbols', false); },
    /** colour for finger i (1–4, 'T'); neutral when finger colours are off */
    color(i) { return this.on && COL[i] ? COL[i] : '#E9E2D6'; },
    ink(i) { return this.on && INK[i] ? INK[i] : '#14110E'; },
    symbol(i) { return SYM[i] || ''; },
    /** label shown with a finger: its number, plus a shape when colour-blind symbols are on */
    label(i) { return String(i) + (this.symbols && SYM[i] ? ' ' + SYM[i] : ''); },
    name(i) { return t('fg.' + i); },
    COL, SYM
  };
})();

PD.ui = (() => {
  const $ = PD.$;
  let toastT = 0;
  function toast(msg, ms) {
    let el = $('toast'); if (!el) { el = PD.h('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, ms || 2200);
  }
  /** bottom sheet / dialog; returns close() */
  function sheet(build, opts) {
    const back = PD.h('div', { class: 'sheet-back', role: 'presentation' }), box = PD.h('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true' });
    back.appendChild(box); document.body.appendChild(back);
    const prev = document.activeElement;
    let cleanup = null;
    const close = () => { back.remove(); document.removeEventListener('keydown', esc, true); if (typeof cleanup === 'function') try { cleanup(); } catch (_) {} if (opts && opts.onClose) opts.onClose(); if (prev && prev.focus) prev.focus(); };
    const esc = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    document.addEventListener('keydown', esc, true);
    back.addEventListener('click', e => { if (e.target === back) close(); });
    cleanup = build(box, close); PD.i18n.apply(box);
    const f = box.querySelector('button, input, select, [tabindex]'); if (f) f.focus();
    return close;
  }
  function confirm(msg, onYes) {
    sheet((box, close) => {
      box.append(PD.h('h2', { text: t('sure') }), PD.h('p', { class: 'fg2', text: msg }),
        PD.h('div', { class: 'row' }, [PD.h('button', { class: 'btn primary', text: t('confirm'), onclick: () => { close(); onYes(); } }), PD.h('button', { class: 'btn', text: t('cancel'), onclick: close })]));
    });
  }
  function daysAgo(ts) { if (!ts) return t('l.never'); const d = Math.floor((Date.now() - ts) / 864e5); return d <= 0 ? t('l.today') : t('l.daysAgo', { n: d }); }
  function download(name, text, type) { const b = new Blob([text], { type: type || 'application/json' }), u = URL.createObjectURL(b), a = PD.h('a', { href: u, download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); }
  function pickFile(accept) { return new Promise(res => { const i = PD.h('input', { type: 'file', accept }); i.onchange = () => res(i.files[0] || null); i.click(); }); }
  function micBlocked() { try { const pp = document.permissionsPolicy || document.featurePolicy; if (pp && pp.allowsFeature && !pp.allowsFeature('microphone')) return true; } catch (_) {} return false; }
  function micError(code) { return t('mic.' + (code === 'blocked' || (code === 'denied' && window.top !== window) ? 'blocked' : code === 'denied' ? 'denied' : code || 'failed')); }
  return { toast, sheet, confirm, daysAgo, download, pickFile, micError, micBlocked };
})();
