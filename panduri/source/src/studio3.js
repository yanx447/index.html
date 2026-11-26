/* =====================================================================
   STUDIO 3.0 — one Studio for the AI studio and Panduri Studio.

   Route 'studio3' is the Studio's home: import a song, start a project,
   open a MIDI or .panduri file, a template, every recent project.
   The two studios keep their routes, so every old link still works, and
   both now open inside one workspace:
     'ai'      a song      — the AI studio's page (PD.ai.page), unchanged
     'pstudio' an arrangement — Panduri Studio's page (PD.pstudio.page)
   The workspace draws ONE header, ONE transport and ONE set of view tabs
   (desktop: a flat list; phone: Learn · Sounds · Notes · Edit). The
   studios' own transports and tab bars are not shown inside it; their
   engines are driven through PD.transport (s3core.js), which never lets
   two of them sound at once. Nothing is re-implemented: every view is
   the studio's own pane.
   What a result is, and where it came from, is said beside it (the side
   panel): confirmed · corrected · AI estimate · not available.
   In the app only (APP_ONLY). See docs/studio3/ARCHITECTURE.md.
   ===================================================================== */
'use strict';
PD.i18n.add({
  's3.title': ['სტუდია', 'Studio'], 's3.tile': ['სიმღერები, ნოტები, რითმები, ტრეკები, MIDI', 'Songs, notes, rhythms, tracks, MIDI'],
  's3.lead': ['ატვირთე სიმღერა ან დაიწყე პროექტი — ერთი სტუდია, ერთი დამკვრელი, ერთი დროის ხაზი.', 'Import a song or start a project — one studio, one player, one timeline.'],
  's3.flow': ['როგორ მუშაობს', 'How it works'],
  's3.f1': ['ატვირთვა', 'Import'], 's3.f1d': ['აუდიო ან ვიდეო ფაილი — იკითხება ამ მოწყობილობაზე', 'An audio or video file — read on this device'],
  's3.f2': ['ხმების გაყოფა', 'Separate'], 's3.f2d': ['ვოკალი · დრამი · ბასი · დანარჩენი — ამ მოწყობილობაზე', 'Vocals · drums · bass · other — on this device'],
  's3.f3': ['ამოცნობა', 'Transcribe'], 's3.f3d': ['აკორდები, ტონალობა, ტემპი, რითმი; მელოდიის ნოტები Premium-შია', 'Chords, key, tempo, rhythm; the melody notes are Premium'],
  's3.f4': ['ფანდურზე გადაწყობა', 'Adapt to fanduri'], 's3.f4d': ['ნოტი იღებს სიმს და ლადს; ნოტი, რომელიც ფანდურს არ აქვს, მოინიშნება და ჩუმად არ გადაინაცვლებს', 'Each note gets a string and a fret; a note the fanduri lacks is marked, never moved silently'],
  's3.f5': ['სწავლა · შექმნა', 'Learn · Create'], 's3.f5d': ['სიმღერა გაკვეთილად (Premium); ნოტები, რითმები, ტრეკები, MIDI', 'The song as a lesson (Premium); notes, rhythms, tracks, MIDI'],
  's3.ok': ['მუშაობს', 'Works'], 's3.part': ['ნაწილობრივ', 'Partly'], 's3.pm': ['Premium', 'Premium'],
  's3.geo': ['ქართული საკრავების (ფანდური, დოლი, გარმონი) ცალკე გაყოფა ჯერ კვლევაა: ღია მოდელები მათ არ იცნობს. დღეს ფანდური „დანარჩენში“ ხვდება (6 ხმაზე ნაწილობრივ „გიტარაშიც“).', 'Separating Georgian instruments (fanduri, doli, garmoni) on their own is still research: the open models do not know them. Today the fanduri lands in “other” (with six stems partly in “guitar” too).'],
  's3.import': ['სიმღერის ატვირთვა', 'Import a song'], 's3.importD': ['MP3, WAV, M4A, FLAC, ვიდეო… ან ჩააგდე ფაილი აქ', 'MP3, WAV, M4A, FLAC, video… or drop a file here'],
  's3.blank': ['ახალი ცარიელი პროექტი', 'New blank project'], 's3.blankD': ['ერთი მელოდიის ტრეკი: ნოტები ტარიდან ან piano roll-იდან', 'One melody track: notes from the neck or the piano roll'],
  's3.file': ['MIDI / .panduri ფაილის გახსნა', 'Open MIDI / .panduri'], 's3.fileD': ['MIDI-ის ტრეკები მელოდიის ტრეკებად; .panduri — მთელი პროექტი', 'MIDI tracks become melody tracks; a .panduri file is a whole project'],
  's3.more': ['მიკროფონით ჩაწერა და შენი სიმღერები — სიმღერების ბიბლიოთეკაში.', 'Recording with the microphone, and all your songs — in the song library.'],
  's3.lib': ['სიმღერების ბიბლიოთეკა', 'Song library'], 's3.libD': ['ატვირთვა, ჩაწერა ან შენახული სიმღერის გახსნა', 'Import, record, or open a saved song'],
  's3.tpl': ['შაბლონები', 'Templates'],
  's3.trad': ['ტრადიციული რითმი და სოლო', 'Traditional rhythm & solo'], 's3.tradD': ['მასწავლებლის რითმი — მისი დარტყმები და აქცენტები — და სოლოს ტრეკი', "The teacher's rhythm — his strokes and accents — and a solo track"],
  's3.tradT': ['დარტყმების ხანგრძლივობა მასწავლებელს ჯერ არ მოუცია: პროექტში თანაბარია და შეგიძლია შეცვალო.', 'The teacher has not given the stroke lengths yet: in the project they are even, and you can change them.'],
  's3.learnS': ['ისწავლე სიმღერიდან', 'Learn from a song'], 's3.learnSD': ['ატვირთე სიმღერა — AI იპოვის აკორდებს და რითმს და გაკვეთილად აქცევს (Premium)', 'Import a song — the AI finds its chords and rhythm and makes it a lesson (Premium)'],
  's3.recordD': ['ცოცხალი ანალიზი და 5 წუთამდე ჩაწერა', 'Live analysis and up to five minutes of recording'],
  's3.recent': ['ბოლო პროექტები', 'Recent projects'], 's3.none': ['ჯერ პროექტი არ გაქვს. ატვირთე სიმღერა ან დაიწყე ახალი.', 'No projects yet. Import a song or start a new one.'],
  's3.all': ['ყველა ({n})', 'All ({n})'], 's3.kSong': ['სიმღერა', 'Song'], 's3.kArr': ['არანჟირება', 'Arrangement'],
  's3.notStored': ['ფაილი შენახული არ არის', 'File not saved'], 's3.tracks': ['{n} ტრეკი', '{n} tracks'], 's3.notes': ['{n} ნოტი', '{n} notes'], 's3.track1': ['1 ტრეკი', '1 track'], 's3.note1': ['1 ნოტი', '1 note'],
  's3.savedDev': ['შენახულია ამ მოწყობილობაზე', 'Saved on this device'], 's3.unsaved': ['ფაილი შენახული არ არის — აირჩიე თავიდან', 'The file is not saved — pick it again'],
  's3.name': ['სახელი', 'Name'], 's3.menu': ['მოქმედებები', 'Actions'], 's3.info': ['პროექტის შესახებ', 'About this project'], 's3.panel': ['გვერდითი პანელი', 'Side panel'], 's3.resize': ['პანელის სიგანე', 'Panel width'],
  's3.libT': ['სიმღერები', 'Songs'], 's3.add': ['აუდიოს დამატება / ჩაწერა', 'Add audio / record'], 's3.dl': ['ორიგინალი ფაილის შენახვა', 'Save the original file'], 's3.full': ['სრული ეკრანი', 'Full screen'],
  's3.transport': ['დამკვრელი', 'Player'], 's3.play': ['დაკვრა', 'Play'], 's3.pause': ['პაუზა', 'Pause'], 's3.stop': ['გაჩერება და თავში', 'Stop and back to the start'],
  's3.back5': ['5 წამით უკან', 'Back 5 seconds'], 's3.fwd5': ['5 წამით წინ', 'Forward 5 seconds'], 's3.backBar': ['ერთი ტაქტით უკან', 'Back one bar'], 's3.fwdBar': ['ერთი ტაქტით წინ', 'Forward one bar'],
  's3.seek': ['ადგილი', 'Position'], 's3.loop': ['ციკლი', 'Loop'], 's3.loopBar': ['ციკლი: ეს ტაქტი', 'Loop this bar'], 's3.metro': ['მეტრონომი', 'Metronome'], 's3.count': ['ათვლა', 'Count-in'],
  's3.speed': ['სიჩქარე (ტონი არ იცვლება)', 'Speed (the pitch stays)'], 's3.prep': ['მზადდება…', 'Preparing…'], 's3.bpm': ['ტემპი (BPM)', 'Tempo (BPM)'], 's3.meter': ['ზომა', 'Metre'], 's3.pos': ['ტაქტი.დარტყმა', 'Bar.beat'],
  's3.m.learn': ['სწავლა', 'Learn'], 's3.m.sounds': ['ხმები', 'Sounds'], 's3.m.notes': ['ნოტები', 'Notes'], 's3.m.edit': ['რედაქტირება', 'Edit'], 's3.views': ['ხედები', 'Views'],
  's3.v.player': ['დამკვრელი და ტარი', 'Player & neck'], 's3.v.lesson': ['გაკვეთილი', 'Lesson'], 's3.v.tab': ['TAB', 'TAB'], 's3.v.stems': ['ხმები და მიქშერი', 'Stems & mixer'], 's3.v.chords': ['აკორდები', 'Chords'],
  's3.v.roll': ['Piano roll', 'Piano roll'], 's3.v.score': ['სანოტო', 'Score'], 's3.v.melody': ['მელოდია', 'Melody'], 's3.v.rhythm': ['რითმი', 'Rhythm'], 's3.v.fret': ['ტარი', 'Fretboard'], 's3.v.arrange': ['ტრეკები', 'Arrange'], 's3.v.mixer': ['მიქშერი', 'Mixer'],
  's3.src': ['წყარო', 'Source'], 's3.an': ['ანალიზი', 'Analysis'], 's3.stems': ['ხმები (stems)', 'Stems'], 's3.inst': ['ინსტრუმენტი', 'Instrument'], 's3.trk': ['ტრეკები', 'Tracks'],
  's3.tempo': ['ტემპი', 'Tempo'], 's3.key': ['ტონალობა', 'Key'], 's3.keyD': ['უახლოესი მაჟორი/მინორი', 'nearest major/minor'], 's3.chords': ['აკორდები', 'Chords'], 's3.melody': ['მელოდიის ნოტები', 'Melody notes'], 's3.lesson': ['გაკვეთილი', 'Lesson'],
  's3.dur': ['ხანგრძლივობა', 'Length'], 's3.file2': ['ფაილი', 'File'], 's3.video': ['ვიდეო', 'video'], 's3.audio': ['აუდიო', 'audio'], 's3.yes': ['შექმნილია', 'made'], 's3.notYet': ['ჯერ არა', 'not yet'],
  's3.noStems': ['ჯერ არ არის გაყოფილი („ხმები და მიქშერი“)', 'Not separated yet (“Stems & mixer”)'], 's3.memStems': ['მეხსიერებაშია: სიმღერის დახურვისას იკარგება', 'Kept in memory: lost when the song closes'],
  's3.noTr': ['ჯერ არ არის ამოცნობილი', 'Not transcribed yet'], 's3.unplay': ['{n} ნოტი ფანდურს არ აქვს', '{n} notes the fanduri lacks'],
  's3.strokes': ['დარტყმები და აქცენტები', 'Strokes and accents'], 's3.timing': ['დარტყმების ხანგრძლივობა', 'Stroke lengths'], 's3.byBar': ['აკორდები ტაქტებზე', 'Chords by bar'],
  's3.tuning': ['წყობა', 'Tuning'], 's3.frets': ['ლადები', 'Frets'], 's3.pitchMap': ['ბგერის რუკა', 'Pitch map'], 's3.et': ['თანაბარი ტემპერაცია', 'equal temperament'], 's3.measured': ['გაზომილი', 'measured'],
  's3.time': ['დრო', 'Time'], 's3.meterR': ['ზომა', 'Metre'], 's3.lenR': ['სიგრძე', 'Length'],
  's3.st.confirmed': ['დადასტურებული', 'confirmed'], 's3.st.corrected': ['შესწორებული', 'corrected'], 's3.st.estimate': ['შეფასება', 'estimate'], 's3.st.unavailable': ['არ არის მოცემული', 'not given'],
  's3.sr.teacher': ['მასწავლებელი', 'teacher'], 's3.sr.ai': ['AI', 'AI'], 's3.sr.manual': ['შენ', 'you'], 's3.sr.general': ['ზოგადი', 'general'], 's3.sr.computed': ['გამოთვლილი', 'computed'], 's3.sr.default': ['ნაგულისხმევი', 'default'],
  's3.newMidi': ['MIDI-დან შეიქმნა პროექტი: {n} ტრეკი; {u} ნოტი ფანდურს არ აქვს (ნაჩვენებია, არ ჟღერს).', 'A project from MIDI: {n} track(s); {u} note(s) the fanduri does not have (shown, not played).'],
  's3.noNotes': ['ამ MIDI ფაილში ნოტი არ არის.', 'This MIDI file has no notes.']
});

PD.studio3 = (() => {
  const h = PD.h, t = PD.i18n.t, X = () => PD.s3core;
  const ACCEPT_SONG = 'audio/*,video/*,.mp3,.m4a,.wav,.ogg,.oga,.opus,.flac,.aac,.wma,.mp4,.m4v,.mov,.webm,.mkv,.avi,.3gp,.ogv,.ts';
  const ACCEPT_FILE = '.panduri,.json,.mid,.midi,audio/midi';
  const SVG = (d, s) => '<svg viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const FADERS = '<path d="M6 4v16M12 4v16M18 4v16"/><rect x="3.8" y="12.6" width="4.4" height="3.6" rx="1.2"/><rect x="9.8" y="6.8" width="4.4" height="3.6" rx="1.2"/><rect x="15.8" y="10.6" width="4.4" height="3.6" rx="1.2"/>';
  const IC = {
    play: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M8 5.2v13.6L19 12z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>',
    stop: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
    rew: SVG('<path d="M11 7l-6 5 6 5M19 7l-6 5 6 5"/>', 18), ff: SVG('<path d="M13 7l6 5-6 5M5 7l6 5-6 5"/>', 18),
    loop: SVG('<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>', 18),
    metro: SVG('<path d="M8.5 20.5h7l-2.6-16h-1.8z"/><path d="M12 15l4.8-7.5"/>', 18),
    count: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor" font-family="system-ui">4</text><circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    back: SVG('<path d="M15 18l-6-6 6-6"/>', 20), more: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/></svg>',
    info: SVG('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>', 20), panel: SVG('<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M9 4.5v15"/>', 20),
    undo: SVG('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>', 18), redo: SVG('<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>', 18),
    mic: SVG('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M6 11v1a6 6 0 0 0 12 0v-1M12 18v3m-3 0h6"/>', 24),
    song: SVG('<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0"/>', 20), arr: SVG('<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>', 20),
    upload: SVG('<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/>', 26),
    plus: SVG('<path d="M12 5v14M5 12h14"/>', 26), file: SVG('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14h6M9 17h4"/>', 26),
    learn: SVG('<path d="M12 6.6C10.2 5.2 7.8 4.6 4 4.6v13c3.8 0 6.2.6 8 2 1.8-1.4 4.2-2 8-2v-13c-3.8 0-6.2.6-8 2z"/><path d="M12 6.6v13"/>', 26),
    rhythm: SVG('<path d="M7 4v13M7 17l-3-3M7 17l3-3M17 20V7M17 7l-3 3M17 7l3 3"/>', 26), chev: SVG('<path d="M9 6l6 6-6 6"/>', 18)
  };
  const ICON = SVG(FADERS, 22);

  /* ---------- the views: one set of names over both studios ---------- */
  // ai: the AI studio's own tab; pst: Panduri Studio's own view; mode: where it lives on a phone
  const VIEWS = {
    song: [
      { id: 'player', k: 's3.v.player', mode: 'learn', ai: 'overview' }, { id: 'lesson', k: 's3.v.lesson', mode: 'learn', ai: 'learn' },
      { id: 'stems', k: 's3.v.stems', mode: 'sounds', ai: 'instruments' },
      { id: 'chords', k: 's3.v.chords', mode: 'notes', ai: 'chords' }, { id: 'tab', k: 's3.v.tab', mode: 'notes', ai: 'tab' }, { id: 'roll', k: 's3.v.roll', mode: 'notes', ai: 'roll' },
      { id: 'score', k: 's3.v.score', mode: 'notes', ai: 'notation' }, { id: 'melody', k: 's3.v.melody', mode: 'notes', ai: 'solo' },
      { id: 'rhythm', k: 's3.v.rhythm', mode: 'edit', ai: 'rhythm' }],
    arrangement: [
      { id: 'fret', k: 's3.v.fret', mode: 'notes', pst: 'fret' }, { id: 'roll', k: 's3.v.roll', mode: 'notes', pst: 'roll' },
      { id: 'rhythm', k: 's3.v.rhythm', mode: 'edit', pst: 'rhythm' }, { id: 'arrange', k: 's3.v.arrange', mode: 'edit', pst: 'arrange' },
      { id: 'mixer', k: 's3.v.mixer', mode: 'sounds', pst: 'mixer' }]
  };
  const MODES = [['learn', 's3.m.learn'], ['sounds', 's3.m.sounds'], ['notes', 's3.m.notes'], ['edit', 's3.m.edit']];
  const VKEY = { song: 's3.view.song', arrangement: 's3.view.arr' };

  /* ---------- the engines behind the one transport ---------- */
  /** a song: the AI studio's deck (PD.ai.current.transport) — seconds, over the song's measured beats */
  function songEngine() {
    const cur = () => PD.ai && PD.ai.current, deck = () => { const c = cur(); return (c && c.transport) || null; }, res = () => { const c = cur(); return (c && c.res) || null; };
    return {
      kind: 'song', step: 's3.back5', stepF: 's3.fwd5',
      ready: () => !!(deck() && res()), playing: () => !!(deck() && deck().playing), preparing: () => !!(deck() && deck().preparing),
      toggle() { const d = deck(); if (d) d.toggle(); },
      stop() { const d = deck(); if (!d) return; if (d.playing) d.pause(); d.seek(0); },   // as the AI studio's ■
      skip(k) { const d = deck(), r = res(); if (d && r) d.seek(Math.max(0, Math.min(r.dur, d.pos() + k * 5))); },
      frac() { const d = deck(), r = res(); return d && r && r.dur ? Math.min(1, d.pos() / r.dur) : 0; },
      seekFrac(f) { const d = deck(), r = res(); if (d && r) d.seek(f * r.dur); },
      position() { const d = deck(), r = res(); if (!d || !r) return null; const sec = d.pos(), b = d.beatAt(sec); return { sec, dur: r.dur, bar: b ? b.bar : null, beat: b ? b.beat : null }; },
      tempo() { const r = res(); return r ? { bpm: Math.round(r.bpm), source: r.bpmBy === 'hand' ? 'manual' : 'ai', status: r.bpmBy === 'hand' ? 'corrected' : 'estimate' } : null; },
      get loop() { const d = deck(); return !!(d && d.D.loop.on); },
      /** on: the bar under the playhead goes round; off: the loop is cleared (A–B, 1 and 4 bars stay in Player › Controls) */
      toggleLoop() {
        const d = deck(), r = res(); if (!d || !r) return; if (d.D.loop.on) { d.clearLoop(); return; }
        const p = d.pos(), bt = d.beatAt(p), B = r.beats || [], g = d.D.bpb || 4;
        if (!bt) { d.setLoop(p, Math.min(r.dur, p + 8)); return; }
        const ks = bt.k - (((bt.k - (d.D.phase || 0)) % g) + g) % g; d.setLoop(B[Math.max(0, ks)], B[ks + g] || r.dur);
      },
      get metro() { const d = deck(); return !!(d && d.D.click.on); }, toggleMetro() { const d = deck(); if (d) d.setClick(!d.D.click.on); },
      get countIn() { const d = deck(); return !!(d && d.D.countIn); }, toggleCountIn() { const d = deck(); if (d) d.setCountIn(!d.D.countIn); },
      get speed() { const d = deck(); return d ? d.D.speed : 1; }, setSpeed(x) { const d = deck(); if (d) d.setSpeed(x); }
    };
  }
  /** an arrangement: Panduri Studio's scheduler — beats, at one tempo */
  function arrEngine() {
    const E = () => PD.pstudio && PD.pstudio.engine, L = e => Math.max(e.length(), e.bpb());
    return {
      kind: 'arrangement', step: 's3.backBar', stepF: 's3.fwdBar',
      ready: () => !!(E() && PD.pstudio.project), playing: () => !!(E() && E().playing), preparing: () => false,
      toggle: () => E().toggle(), stop: () => E().rewind(),
      skip(k) { const e = E(); e.seek(Math.max(0, e.head + k * e.bpb())); },
      frac() { const e = E(); return Math.min(1, e.head / L(e)); }, seekFrac(f) { const e = E(); e.seek(f * L(e)); },
      position() { const e = E(), spb = 60 / e.bpm, bb = X().barBeat(e.head, e.bpb(), 0); return { sec: e.head * spb, dur: L(e) * spb, bar: bb.bar, beat: bb.beat }; },
      tempo() { return { bpm: E().bpm, source: 'manual', status: 'confirmed', edit: true }; }, setBpm: v => E().setBpm(v),
      meter: () => E().meter.join('/'), setMeter: m => E().setMeter(m), meters: () => E().METERS,
      get loop() { return E().loop; }, toggleLoop: () => E().toggleLoop(),
      get metro() { return E().metro; }, toggleMetro: () => E().toggleMetro(),
      get countIn() { return E().countIn; }, toggleCountIn: () => E().toggleCountIn()
    };
  }

  /* ---------- small parts ---------- */
  const ib = (icon, key, fn, cls) => h('button', { class: 's3-ib' + (cls ? ' ' + cls : ''), type: 'button', 'aria-label': t(key), title: t(key), html: icon, onclick: fn });
  const prov = (source, status) => source ? h('span', { class: 's3-prov s3-' + status, title: t('s3.sr.' + source) + ' · ' + t('s3.st.' + status), text: status === 'confirmed' ? t('s3.sr.' + source) + ' ✓' : t('s3.sr.' + source) + ' · ' + t('s3.st.' + status) }) : null;
  const L = o => o && typeof o === 'object' && !Array.isArray(o) ? PD.i18n.pick(o) : o;
  const arrows = st => st.map(k => (k.dir === 'up' ? '↑' : '↓') + (k.acc ? '!' : '')).join(' ');
  const len = d => { const q = [[.25, '1/16'], [1 / 3, '1/8³'], [.5, '1/8'], [.75, '3/16'], [1, '1/4'], [1.5, '3/8'], [2, '1/2']].find(x => Math.abs(x[0] - d) < 1e-6); return q ? q[1] : String(+d.toFixed(2)); };
  const kv = (label, value, p, note) => h('div', { class: 's3-kv' }, [h('span', { class: 's3-k', text: label }), h('span', { class: 's3-v' }, [h('b', { text: value == null || value === '' ? '—' : String(value) }), note ? h('small', { text: note }) : null]), p ? prov(p.source, p.status) : null]);
  const block = (title, rows) => h('section', { class: 's3-blk' }, [h('h3', { text: title })].concat(rows));
  const strokes = r => (r.strokes || []).map(k => (k.direction === 'up' ? '↑' : '↓') + (k.accent ? '!' : '')).join(' ');
  const mb = b => b == null ? '' : (b / 1048576 >= 1 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
  const nTracks = n => n === 1 ? t('s3.track1') : t('s3.tracks', { n }), nNotes = n => n === 1 ? t('s3.note1') : t('s3.notes', { n });
  const when = ms => ms ? new Date(ms).toLocaleDateString(PD.i18n.locale, { day: 'numeric', month: 'short' }) : '';
  function instBlock() {
    const I = X().instrument(); if (!I) return null;
    return block(t('s3.inst'), [kv(t('s3.tuning'), I.tuning.join(' · ')), kv(t('s3.frets'), I.frets), kv(t('s3.pitchMap'), t(I.pitch.source === 'teacher' ? 's3.measured' : 's3.et'), I.pitch)]);
  }
  function download(name, blob) { const a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }

  /* ---------- the home ---------- */
  function openSong(f, view) { if (view) PD.store.set(VKEY.song, view); PD.ai.take = f; PD.app.go('ai', 'new'); }
  const library = () => PD.studioSync.store;
  const removeIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h16m-10 4v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';
  function home(w) {
    let want = null;
    // the song's file input comes first on the page (the AI studio's tests and its drop target pick the first one)
    const songIn = h('input', { type: 'file', accept: ACCEPT_SONG, hidden: true, onchange: e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; const v = want; want = null; if (f) openSong(f, v); } });
    const fileIn = h('input', { type: 'file', accept: ACCEPT_FILE, hidden: true, onchange: async e => {
      const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f || !PD.pstudio) return;
      try { const r = await PD.pstudio.importAsNew(f); if (/\.(mid|midi)$/i.test(f.name)) PD.ui.toast(t('s3.newMidi', { n: r.tracks, u: r.unplayable }), 5000); PD.app.go('pstudio', 'p:' + r.id); }
      catch (err) { const m = err && err.message; PD.ui.toast(m === 'newer-version' ? t('pst.impNew') : m === 'no-notes' ? t('s3.noNotes') : t('pst.impBad', { e: m || err }), 6000); }
    } });
    const root = h('section', { class: 's3 s3-home' });
    w.append(songIn, root, fileIn);
    // the head and the honest pipeline: what each step does today
    const FLOW = [['s3.f1', 's3.f1d', 'ok'], ['s3.f2', 's3.f2d', 'pm'], ['s3.f3', 's3.f3d', 'ok'], ['s3.f4', 's3.f4d', 'part'], ['s3.f5', 's3.f5d', 'ok']];
    root.append(h('header', { class: 's3-hero' }, [
      h('div', { class: 's3-hero-t' }, [h('h1', { text: t('s3.title') }), h('p', { class: 'muted', text: t('s3.lead') })]),
      h('span', { class: 's3-hero-mark', html: ICON, 'aria-hidden': 'true' })
    ]));
    // the three ways in
    const card = (icon, k, d, fn, cls) => h('button', { class: 's3-card' + (cls ? ' ' + cls : ''), type: 'button', onclick: fn }, [h('span', { class: 's3-card-ic', html: icon }), h('b', { text: t(k) }), h('small', { text: t(d) })]);
    const imp = card(IC.upload, 's3.import', 's3.importD', () => { want = null; songIn.click(); }, 'primary');
    imp.addEventListener('dragover', e => { e.preventDefault(); imp.classList.add('over'); }); imp.addEventListener('dragleave', () => imp.classList.remove('over'));
    imp.addEventListener('drop', e => { e.preventDefault(); imp.classList.remove('over'); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) openSong(f); });
    const acts = [imp, card(IC.mic, 'as.record', 's3.recordD', () => PD.app.go('ai', 'record'))];
    if (PD.pstudio) acts.push(card(IC.plus, 's3.blank', 's3.blankD', () => { const id = PD.pstudio.create('blank'); PD.app.go('pstudio', 'p:' + id); }),
      card(IC.file, 's3.file', 's3.fileD', () => fileIn.click()));
    root.append(h('section', { class: 's3-acts' }, acts),
      h('p', { class: 's3-more' }, [h('button', { class: 'linkbtn', type: 'button', text: t('s3.lib'), onclick: () => PD.app.go('ai', 'lib') })]));
    // templates: the teacher's rhythms as they are; a song made into a lesson
    const tpl = h('section', { class: 's3-tpl' }, [h('h2', { text: t('s3.tpl') })]);
    const grid = h('div', { class: 's3-tpl-grid' }); tpl.append(grid);
    const R = PD.pstudio ? (PD.curriculum.rhythms() || []).filter(r => r.source === 'teacher') : [];
    if (R.length) grid.append(h('div', { class: 's3-tcard' }, [h('span', { class: 's3-card-ic', html: IC.rhythm }), h('b', { text: t('s3.trad') }), h('small', { text: t('s3.tradD') }),
      h('div', { class: 's3-rchips' }, R.map(r => h('button', { class: 's3-rchip', type: 'button', onclick: () => { const id = PD.pstudio.create('rhythm:' + r.id); PD.app.go('pstudio', 'p:' + id + ':rhythm'); } }, [h('b', { text: PD.i18n.pick(r.name) }), h('span', { class: 'mono', 'aria-hidden': 'true', text: strokes(r) }), h('small', { class: 's3-prov s3-confirmed', text: t('s3.sr.teacher') })]))),
      h('small', { class: 's3-tnote', text: t('s3.tradT') })]));
    grid.append(h('button', { class: 's3-tcard', type: 'button', onclick: () => { want = 'lesson'; songIn.click(); } }, [h('span', { class: 's3-card-ic', html: IC.learn }), h('b', { text: t('s3.learnS') }), h('small', { text: t('s3.learnSD') })]));
    root.append(tpl);
    // recent: both studios' projects together, newest first
    const row = x => h('li', { class: 's3-project-row' }, [h('button', { class: 's3-row', type: 'button', 'data-kind': x.kind, onclick: () => x.kind === 'song' ? PD.app.go('ai', x.ref) : PD.app.go('pstudio', 'p:' + x.ref) }, [
      h('span', { class: 's3-row-ic', html: x.kind === 'song' ? IC.song : IC.arr }),
      h('span', { class: 's3-row-t' }, [h('b', { text: x.title || '—' }), h('small', { text: [t(x.kind === 'song' ? 's3.kSong' : 's3.kArr')].concat(x.kind === 'song' ? [x.key, x.bpm ? Math.round(x.bpm) + ' BPM' : null] : [nTracks(x.tracks), nNotes(x.notes), x.bpm ? x.bpm + ' BPM' : null]).filter(Boolean).join(' · ') }),
        x.recorded || x.large || (x.kind === 'song' && !x.stored && !x.remoteAudio)
          ? h('small', { class: 's3-warn', text: t(x.recorded ? 'ssy.take' : x.large ? 'ssy.large' : 's3.notStored') }) : null]),
      h('small', { class: 's3-when', text: when(x.when) }), h('span', { class: 's3-row-go', html: IC.chev })]),
      h('button', { class: 's3-remove', type: 'button', html: removeIcon, title: t('delete'),
        'aria-label': t('delete') + ' · ' + x.title, onclick: () => {
          if (x.kind === 'arrangement') PD.pstudio.deleteProject(x.ref);
          else {
            const r = library().get('ai.recent', []).find(item => item.id === x.ref);
            if (r) PD.ai.deleteSong(r);
          }
        } })]);
    const box = h('ul', { class: 's3-list' }), head = h('div', { class: 's3-sh' });
    const empty = h('p', { class: 'muted s3-empty', text: t('s3.none') });
    const syncState = h('span', { class: 's3-sync-status', role: 'status' });
    const syncButton = h('button', { class: 'btn small ghost', text: t('ssy.retry'), onclick: () => PD.studioSync.sync() });
    const syncLine = h('div', { class: 's3-sync' }, [syncState, syncButton]);
    let expanded = false;
    function paint() {
      const all = X().index();
      box.replaceChildren(...all.slice(0, expanded ? all.length : 8).map(row));
      empty.hidden = !!all.length;
      head.replaceChildren(h('h2', { text: t('s3.recent') }));
      if (!expanded && all.length > 8) head.append(h('button', { class: 'linkbtn', type: 'button', text: t('s3.all', { n: all.length }), onclick: () => { expanded = true; paint(); } }));
    }
    function paintSync() {
      const state = PD.studioSync.status;
      syncState.textContent = t('ssy.' + state);
      syncLine.dataset.status = state;
      syncButton.hidden = !PD.cloud.uid;
      syncButton.disabled = state === 'busy' || state === 'offline';
    }
    paint(); paintSync();
    const section = h('section', { class: 's3-recent' }, [head, syncLine, h('p', { class: 'muted s3-sync-info', text: t('ssy.info') }), box, empty]);
    tpl.before(section);
    root.append(h('details', { class: 's3-guide' }, [h('summary', { text: t('s3.flow') }),
      h('div', { class: 's3-flow' }, [
        h('ol', {}, FLOW.map(([k, d, st], i) => h('li', { class: 's3-step' }, [h('span', { class: 's3-n', text: String(i + 1) }), h('div', {}, [h('b', { text: t(k) }), h('small', { text: t(d) })]), h('span', { class: 's3-st s3-st-' + st, text: t('s3.' + st) })]))),
        h('p', { class: 's3-note', text: t('s3.geo') })
      ])
    ]));
    const offLibrary = PD.bus.on('studio-library', paint), offSync = PD.bus.on('studio-sync-status', paintSync);
    const offRoute = PD.bus.on('route', () => { offLibrary(); offSync(); offRoute(); });
    PD.studioSync.sync();
    PD.i18n.apply(root);
  }

  /* ---------- the workspace: one header, one transport, one set of views ---------- */
  let alive = null;   // the workspace on screen
  function workspace(w, kind, o) {
    const eng = kind === 'song' ? songEngine() : arrEngine(), views = VIEWS[kind];
    let view = views.find(v => v.id === (o.view || PD.store.get(VKEY[kind], views[0].id))) || views[0];
    const root = h('section', { class: 's3 s3-ws', 'data-kind': kind });
    // header
    const title = h('input', { class: 's3-title', type: 'text', maxlength: '120', 'aria-label': t('s3.name'), onchange: e => o.rename && o.rename(e.target.value) });
    const meta = h('small', { class: 's3-meta' }), save = h('small', { class: 's3-save', role: 'status' });
    const undoB = kind === 'arrangement' ? ib(IC.undo, 'pst.undo', () => PD.pstudio.engine.undo()) : null, redoB = kind === 'arrangement' ? ib(IC.redo, 'pst.redo', () => PD.pstudio.engine.redo()) : null;
    let sideOn = PD.store.get('s3.sideOn', true);
    const panelB = ib(IC.panel, 's3.panel', () => { sideOn = !sideOn; PD.store.set('s3.sideOn', sideOn); root.classList.toggle('s3-noside', !sideOn); panelB.setAttribute('aria-pressed', String(sideOn)); }, 's3-only-wide');
    panelB.setAttribute('aria-pressed', String(sideOn));
    const infoB = ib(IC.info, 's3.info', () => PD.ui.sheet(b => { b.append(h('h2', { text: t('s3.info') })); info().forEach(x => x && b.append(x)); }), 's3-only-narrow');
    const menuB = ib(IC.more, 's3.menu', () => o.menu && o.menu());
    const head = h('header', { class: 's3-head' }, [ib(IC.back, 'back', () => PD.app.back('studio3'), 's3-backb'),
      h('span', { class: 's3-kind', html: kind === 'song' ? IC.song : IC.arr, title: t(kind === 'song' ? 's3.kSong' : 's3.kArr') }),
      h('div', { class: 's3-tt' }, [title, h('div', { class: 's3-sub2' }, [meta, save])]), h('span', { class: 'grow' }), undoB, redoB, infoB, panelB, menuB]);
    // the one transport
    const playB = h('button', { class: 's3-ib s3-play', type: 'button', 'aria-label': t('s3.play'), html: IC.play, onclick: () => eng.toggle() });
    const stopB = ib(IC.stop, 's3.stop', () => eng.stop()), rewB = ib(IC.rew, eng.step, () => eng.skip(-1)), ffB = ib(IC.ff, eng.stepF, () => eng.skip(1));
    const bb = h('b', { class: 's3-bb mono', title: t('s3.pos') }), clk = h('small', { class: 's3-clk mono' }), prep = h('small', { class: 's3-prep', hidden: true, text: t('s3.prep') });
    let dragging = false;
    const seek = h('input', { class: 's3-seek', type: 'range', min: 0, max: 1000, step: 1, value: 0, 'aria-label': t('s3.seek'), oninput: e => eng.seekFrac(+e.target.value / 1000), onchange: () => { dragging = false; } });
    seek.addEventListener('pointerdown', () => { dragging = true; });
    ['pointerup', 'pointercancel', 'lostpointercapture', 'blur'].forEach(event => seek.addEventListener(event, () => { dragging = false; }));
    const tg = (icon, key, fn) => { const b = ib(icon, key, fn, 's3-tg'); b.setAttribute('aria-pressed', 'false'); return b; };
    const loopB = tg(IC.loop, kind === 'song' ? 's3.loopBar' : 's3.loop', () => eng.toggleLoop()), metroB = tg(IC.metro, 's3.metro', () => eng.toggleMetro()), countB = tg(IC.count, 's3.count', () => eng.toggleCountIn());
    let tempoEl, bpmIn = null, meterSel = null, speedSel = null;
    if (kind === 'song') {
      tempoEl = h('span', { class: 's3-tempo', title: t('s3.bpm') });
      speedSel = h('select', { class: 's3-sel s3-speed', 'aria-label': t('s3.speed'), title: t('s3.speed'), onchange: e => eng.setSpeed(+e.target.value) }, [50, 60, 70, 75, 80, 90, 100, 110, 125, 150].map(v => h('option', { value: String(v / 100), text: v + '%', selected: v === 100 })));
    } else {
      bpmIn = h('input', { class: 's3-num', type: 'number', min: 20, max: 320, 'aria-label': t('s3.bpm'), title: t('s3.bpm'), onchange: e => eng.setBpm(e.target.value) });
      meterSel = h('select', { class: 's3-sel', 'aria-label': t('s3.meter'), title: t('s3.meter'), onchange: e => eng.setMeter(e.target.value) }, eng.meters().map(m => h('option', { value: m, text: m })));
      tempoEl = h('span', { class: 's3-tempo' }, [bpmIn, h('small', { text: 'BPM' }), meterSel]);
    }
    const tr = h('div', { class: 's3-tr', role: 'group', 'aria-label': t('s3.transport') }, [
      h('div', { class: 's3-tr-a' }, [playB, stopB, rewB, ffB, h('div', { class: 's3-pos' }, [bb, clk]), prep, h('span', { class: 's3-tgs' }, [loopB, metroB, countB])]),
      h('div', { class: 's3-tr-b' }, [seek, tempoEl, speedSel])]);
    // the views: a flat row on a wide screen; four modes with their views on a phone
    const tabs = h('div', { class: 's3-tabs', role: 'tablist', 'aria-label': t('s3.views') });
    const modes = h('div', { class: 's3-modes', role: 'tablist', 'aria-label': t('s3.views') }), sub = h('div', { class: 's3-subv' });
    const hid = 's3-host-' + kind, host = h('div', { class: 's3-host ' + (kind === 'song' ? 's3-ai' : 's3-pst'), id: hid, role: 'tabpanel', 'data-v': view.id });
    const side = h('aside', { class: 's3-side', 'aria-label': t('s3.info') });
    const grip = h('div', { class: 's3-grip', role: 'separator', tabindex: '0', 'aria-orientation': 'vertical', 'aria-label': t('s3.resize') });
    const mainCol = h('div', { class: 's3-maincol' }, [tabs, modes, sub, host]);
    const body = h('div', { class: 's3-body' }, [side, grip, mainCol]);
    root.append(head, tr, body); w.append(root);
    if (!sideOn) root.classList.add('s3-noside');
    // the side panel: drag or arrow keys; the width is remembered
    const setW = px => { px = Math.max(220, Math.min(440, Math.round(px))); root.style.setProperty('--s3-side', px + 'px'); grip.setAttribute('aria-valuenow', String(px)); return px; };
    let sideW = setW(PD.store.get('s3.sideW', 280));
    grip.addEventListener('pointerdown', e => { e.preventDefault(); grip.setPointerCapture(e.pointerId); const x0 = e.clientX, w0 = sideW; grip.classList.add('drag');
      const mv = ev => { sideW = setW(w0 + (ev.clientX - x0) * (document.dir === 'rtl' ? -1 : 1)); }, up = () => { grip.classList.remove('drag'); grip.removeEventListener('pointermove', mv); grip.removeEventListener('pointerup', up); PD.store.set('s3.sideW', sideW); };
      grip.addEventListener('pointermove', mv); grip.addEventListener('pointerup', up); });
    grip.addEventListener('keydown', e => { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; e.preventDefault(); sideW = setW(sideW + (e.key === 'ArrowRight' ? 16 : -16)); PD.store.set('s3.sideW', sideW); });
    function paintTabs() {
      tabs.innerHTML = ''; modes.innerHTML = ''; sub.innerHTML = '';
      const tab = (v, cls) => h('button', { class: cls, type: 'button', role: 'tab', 'data-v': v.id, 'aria-controls': hid, 'aria-selected': String(v === view), tabindex: v === view ? '0' : '-1', text: t(v.k), onclick: () => setView(v.id, true) });
      views.forEach(v => tabs.append(tab(v, 's3-tab')));
      const ms = MODES.filter(([m]) => views.some(v => v.mode === m)); modes.style.setProperty('--n', String(ms.length));
      ms.forEach(([m, k]) => { const first = views.find(v => v.mode === m), on = view.mode === m;
        modes.append(h('button', { class: 's3-mode', type: 'button', role: 'tab', 'data-m': m, 'aria-selected': String(on), tabindex: on ? '0' : '-1', text: t(k), onclick: () => setView(on ? view.id : (views.find(v => v.mode === m && v.id === PD.store.get('s3.m.' + kind + '.' + m)) || first).id, true) })); });
      const inMode = views.filter(v => v.mode === view.mode);
      if (inMode.length > 1) inMode.forEach(v => sub.append(h('button', { class: 'chip s3-chip', type: 'button', 'aria-pressed': String(v === view), text: t(v.k), onclick: () => setView(v.id, true) })));
      sub.hidden = inMode.length < 2;
    }
    // arrow keys move along a row of tabs
    [tabs, modes].forEach(row => row.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; const bs = [...row.querySelectorAll('[role=tab]')], i = bs.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); const n = bs[(i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length]; n.focus(); n.click();
    }));
    function setView(id, user) {
      const v = views.find(x => x.id === id); if (!v) return; view = v;
      if (user) { PD.store.set(VKEY[kind], v.id); PD.store.set('s3.m.' + kind + '.' + v.mode, v.id); }
      host.dataset.v = v.id; paintTabs(); if (o.view2) o.view2(v);
      if (user) { const f = (tabs.offsetParent ? tabs : modes).querySelector('[aria-selected="true"]'); if (f && document.activeElement && document.activeElement.closest && document.activeElement.closest('.s3-tabs,.s3-modes')) f.focus(); }
    }
    // the transport follows the engine on every frame; the header and the side panel when something changes
    let raf = 0, lastSig = '', speedOpts = null;
    function paint() {
      if (!eng.ready()) return;
      const on = eng.playing(); if (playB.classList.contains('on') !== on) { playB.classList.toggle('on', on); playB.innerHTML = on ? IC.pause : IC.play; playB.setAttribute('aria-label', t(on ? 's3.pause' : 's3.play')); }
      const p = eng.position();
      if (p) { const a = p.bar != null ? p.bar + '.' + p.beat : '', c = X().clock(p.sec) + ' / ' + X().clock(p.dur); if (bb.textContent !== a) bb.textContent = a; if (clk.textContent !== c) clk.textContent = c; }
      if (!dragging && document.activeElement !== seek) { const v = Math.round(eng.frac() * 1000); if (+seek.value !== v) seek.value = String(v); }
      [[loopB, eng.loop], [metroB, eng.metro], [countB, eng.countIn]].forEach(([b, x]) => { const s = String(!!x); if (b.getAttribute('aria-pressed') !== s) b.setAttribute('aria-pressed', s); });
      const pr = eng.preparing(); if (prep.hidden === pr) prep.hidden = !pr;
      if (speedSel && document.activeElement !== speedSel) { const v = String(Math.round(eng.speed * 100) / 100); if (!speedOpts) speedOpts = new Set([...speedSel.options].map(x => x.value));
        if (!speedOpts.has(v)) { speedSel.append(h('option', { value: v, text: Math.round(eng.speed * 100) + '%' })); speedOpts.add(v); } if (speedSel.value !== v) speedSel.value = v; }
    }
    function paintTempo() {
      const tp = eng.tempo(); if (!tp) return;
      if (kind === 'song') { tempoEl.innerHTML = ''; tempoEl.append(h('b', { text: String(tp.bpm) }), h('small', { text: 'BPM' }), prov(tp.source, tp.status)); }
      else { if (document.activeElement !== bpmIn) bpmIn.value = String(tp.bpm); if (document.activeElement !== meterSel) meterSel.value = eng.meter(); }
    }
    function refresh() {
      if (!root.isConnected) return;
      const s = o.state();   // { ready, title, meta, save, sig }
      root.classList.toggle('s3-ready', !!s.ready);
      if (document.activeElement !== title && title.value !== (s.title || '')) title.value = s.title || '';
      title.readOnly = !s.editable; meta.textContent = s.meta || ''; save.textContent = s.save || ''; save.classList.toggle('warn', !!s.warn);
      if (undoB) { undoB.disabled = !PD.pstudio.engine.canUndo; redoB.disabled = !PD.pstudio.engine.canRedo; }
      if (s.ready) paintTempo();
      const sig = s.sig || ''; if (sig !== lastSig) { lastSig = sig; side.innerHTML = ''; info().forEach(x => x && side.append(x)); }
    }
    const info = () => (o.info ? o.info() : []).concat([instBlock()]);
    let metaT = 0;
    const loop = () => { raf = requestAnimationFrame(loop); if (document.hidden) return; if (!root.classList.contains('s3-ready') && o.ready && o.ready()) refresh(); paint(); };
    paintTabs(); refresh(); raf = requestAnimationFrame(loop); metaT = setInterval(refresh, 1000);
    const me = { root, host, eng, refresh, setView, get view() { return view; }, gone: false };
    const off = PD.bus.on('route', () => { me.gone = true; cancelAnimationFrame(raf); clearInterval(metaT); if (alive === me) alive = null; off(); });
    alive = me; PD.i18n.apply(root);
    return me;
  }

  /* ---------- a song: the AI studio inside the workspace ---------- */
  function songWS(w, param) {
    const lib = param == null || param === 'lib' || param === 'new' || param === 'record';
    let rec = null, lastId = null, ws = null;   // ws: set once workspace() returns (its first paint asks for the state already)
    const cur = () => PD.ai && PD.ai.current;
    const open = () => { const c = cur(); return !!(c && c.transport && ws && ws.host.querySelector('.ai-body .ai-head')); };
    const recOf = id => ((PD.studioSync?.store || PD.store).get('ai.recent', []) || []).find(r => r.id === id) || null;
    function aiTab(k) { const sel = ws.host.querySelector('.ai-body .apr-navigation select'); if (!sel) return; if (sel.value !== k) { sel.value = k; sel.dispatchEvent(new Event('change')); } }
    ws = workspace(w, 'song', {
      ready: () => open(),
      view2: v => { if (open()) aiTab(v.ai); },
      rename: v => { const id = cur() && cur().id, all = (PD.studioSync?.store || PD.store).get('ai.recent', []), e = all.find(x => x.id === id); v = String(v || '').trim(); if (!e || !v) return; e.title = v; (PD.studioSync?.store || PD.store).set('ai.recent', all); ws.refresh(); },
      state: () => {
        const on = open(), c = cur(), id = on ? c.id : null;
        if (on && id !== lastId) {   // a song has just opened: its view, its place in the history
          lastId = id;
          if (param === 'record') ws.setView('roll');
          else aiTab(ws.view.ai);
          try { const st = history.state; if (id && st && st.r === 'ai' && st.p !== id) history.replaceState({ r: 'ai', p: id }, ''); } catch (_) {}
        }
        if (!on) lastId = null;
        rec = id ? recOf(id) : null; if (ws) ws.host.classList.toggle('s3-on', on);
        if (!on) return { ready: false, title: t('s3.libT'), meta: t('s3.libD'), save: '', sig: 'lib' };
        const r = c.res, stems = c.stems, trd = c.transcription;
        return { ready: true, editable: !!rec, title: rec ? (rec.title || String(rec.name || '').replace(/\.[a-z0-9]{1,5}$/i, '')) : (c.file && c.file.name) || '',
          meta: t('s3.kSong'),
          save: rec && rec.stored ? t('s3.savedDev') : t('s3.unsaved'), warn: !(rec && rec.stored),
          sig: JSON.stringify([id, rec && rec.title, rec && rec.stored, r && r.bpm, r && r.bpmBy, r && r.chords.length, !!(r && r.chords0), stems ? stems.tracks.length : 0, trd && trd.notes ? trd.notes.length : 0]) };
      },
      info: () => {
        const c = cur(); if (!open() || !rec) return [];
        const L = PD.aiLessons, v = X().fromSong(rec, c.res, { transcription: c.transcription, stems: c.stems, lesson: !!(L && L.usesSong && L.usesSong(rec.id)) }), A = v.analyses, tm = v.audioClock.tempoMap;
        return [block(t('s3.src'), [kv(t('s3.file2'), v.source.name, null, [t(v.source.video ? 's3.video' : 's3.audio'), mb(v.source.size)].filter(Boolean).join(' · ')), kv(t('s3.dur'), X().clock(v.audioClock.durationSeconds))]),
          block(t('s3.an'), [kv(t('s3.tempo'), tm ? Math.round(tm.bpm) + ' BPM' : null, tm), kv(t('s3.key'), A.key && A.key.name, A.key, t('s3.keyD')),
            kv(t('s3.chords'), A.chords ? (A.chords.count != null ? A.chords.count : A.chords.names.length) : null, A.chords, A.chords && A.chords.names ? A.chords.names.slice(0, 8).join(' · ') : ''),
            A.notes ? kv(t('s3.melody'), A.notes.count, A.notes) : kv(t('s3.melody'), t('s3.noTr')),
            kv(t('s3.lesson'), v.lessons.length ? t('s3.yes') : t('s3.notYet'), v.lessons.length ? { source: 'ai', status: 'estimate' } : null)]),
          block(t('s3.stems'), v.stems.length ? v.stems.map(s => kv(s.kind, X().clock(s.from) + '–' + X().clock(s.from + (s.seconds || 0)), { source: 'ai', status: 'estimate' })).concat([h('small', { class: 's3-fine', text: t('s3.memStems') })]) : [h('small', { class: 's3-fine', text: t('s3.noStems') })])];
      },
      menu: () => PD.ui.sheet((b, close) => {
        const act = (k, fn) => h('button', { class: 's3-act', type: 'button', text: t(k), onclick: () => { close(); fn(); } });
        b.append(h('h2', { text: t('s3.menu') }), h('div', { class: 's3-acts2' }, [
          // another file, or a take from the microphone: the AI studio's own box, in the Player view
          open() ? act('s3.add', () => { ws.setView('player', true); const f = ws.host.querySelector(':scope > details.apr-fold'); if (f) { f.open = true; f.scrollIntoView({ block: 'center' }); } }) : null,
          act('s3.lib', () => PD.app.go('ai', 'lib')),
          rec && (rec.stored || rec.remoteAudio) ? act('s3.dl', async () => { try { const bl = await PD.studioSync.audio(rec); if (bl) download(rec.name, bl); } catch (_) { PD.ui.toast(t('ssy.fetchError')); } }) : null,
          rec ? act('delete', () => PD.ai.deleteSong(rec, () => PD.app.go('studio3', null, true))) : null,
          open() ? act('s3.full', () => { const f = ws.host.querySelector('.ai-fs'); if (f) f.click(); }) : null].filter(Boolean)));
      })
    });
    PD.ai.page(ws.host, lib && param !== 'record' ? null : param);
    ws.refresh();
  }

  /* ---------- an arrangement: Panduri Studio inside the workspace ---------- */
  function arrWS(w, param) {
    // param: a view (the old 'pstudio' links) · 'p:<id>' · 'p:<id>:<view>'
    let id = null, v0 = null; const s = param == null ? '' : String(param);
    if (s.indexOf('p:') === 0) { const a = s.split(':'); id = a[1] || null; v0 = a[2] || null; } else if (s) v0 = s;
    if (id && !PD.pstudio.load(id)) {
      w.append(h('p', { class: 'muted', text: t('ssy.busy'), role: 'status' }));
      PD.studioSync.sync().then(() => {
        if (!w.isConnected || PD.app.route !== 'pstudio' || document.getElementById('page') !== w.closest('.page')) return;
        if (PD.pstudio.load(id)) PD.app.render(true);
        else PD.app.go('studio3', null, true);
      });
      return;
    }
    const byPst = k => (VIEWS.arrangement.find(v => v.pst === k) || {}).id;
    const E = () => PD.pstudio.engine;
    const ws = workspace(w, 'arrangement', {
      view: byPst(v0) || null, ready: () => !!PD.pstudio.project,
      view2: v => { if (E().view !== v.pst) E().setView(v.pst); },
      rename: v => E().rename(v),
      state: () => {
        const P = PD.pstudio.project; if (!P) return { ready: false };
        const notes = P.tracks.reduce((a, x) => a + (x.kind === 'notes' ? x.notes.length : 0), 0);
        return { ready: true, editable: true, title: P.name, meta: [t('s3.kArr'), nTracks(P.tracks.length), nNotes(notes)].join(' · '),
          save: t(E().saved ? 'pst.saved' : 'pst.saving'), sig: JSON.stringify([P.id, P.modified, P.bpm, P.meter]) };
      },
      info: () => {
        const P = PD.pstudio.project; if (!P) return [];
        const v = X().fromArrangement(P), tm = v.audioClock.tempoMap, A = v.analyses;
        const trk = v.arrangements[0].tracks.map(x => { const T = P.tracks.find(q => q.id === x.id) || {};
          return h('div', { class: 's3-kv s3-trk', style: '--c:' + (T.color || '#888') }, [h('i', { class: 's3-dot' }), h('span', { class: 's3-k', text: x.name || t('pst.track') }), h('span', { class: 's3-v' }, [h('b', { text: x.kind === 'rhythm' ? (L(T.rhythm && T.rhythm.name) || t('pst.kRhythm')) : nNotes(x.notes) }), h('small', { text: [x.mute ? 'M' : null, x.solo ? 'S' : null].filter(Boolean).join(' ') })])]); });
        const rhy = A.rhythms.map(r => block(L(r.name) || t('pst.kRhythm'), [kv(t('s3.strokes'), arrows(r.steps), r.strokes), kv(t('s3.timing'), r.steps.map(x => len(x.dur)).join(' · '), r.timing),
          r.chords.length ? kv(t('s3.byBar'), r.chords.map(c => (c.bar + 1) + ':' + c.name).join(' · '), { source: 'computed', status: 'confirmed' }) : null]));
        return [block(t('s3.time'), [kv(t('s3.tempo'), tm.bpm + ' BPM', tm), kv(t('s3.meterR'), tm.meter.join('/')), kv(t('s3.lenR'), X().clock(v.audioClock.durationSeconds))]), block(t('s3.trk'), trk.concat(A.notes.unplayable ? [h('small', { class: 's3-fine s3-warn', text: t('s3.unplay', { n: A.notes.unplayable }) })] : []))].concat(rhy);
      },
      menu: () => PD.ui.sheet((b, close) => {
        const act = (k, fn) => h('button', { class: 's3-act', type: 'button', text: t(k), onclick: () => { close(); fn(); } });
        const input = h('input', { type: 'file', accept: ACCEPT_FILE, hidden: true, onchange: () => { const f = input.files[0]; if (f) { close(); PD.pstudio.importFile(f); } } });
        b.append(h('h2', { text: t('s3.menu') }), h('div', { class: 's3-acts2' }, [act('pst.projects', () => PD.pstudio.projects()),
          h('button', { class: 's3-act', type: 'button', text: t('pst.imp'), onclick: () => input.click() }), input,
          act('delete', () => PD.pstudio.deleteProject(PD.pstudio.project.id, () => PD.app.go('studio3', null, true))), act('pst.exp', () => PD.pstudio.exportPanduri()), act('pst.midi', () => PD.pstudio.exportMidi()), act('pst.midiT', () => PD.pstudio.exportMidi(true))]));
      })
    });
    PD.pstudio.page(ws.host, ws.view.pst, { embed: true, open: id, onState: () => { if (!ws.gone) ws.refresh(); }, onOpen: nid => PD.app.go('pstudio', 'p:' + nid + ':' + E().view, true) });
    // the project the page opened (the last one, when the link named none) is the one in the history
    try { const P = PD.pstudio.project, st = history.state; if (P && st && st.r === 'pstudio' && st.p !== 'p:' + P.id + ':' + E().view && !id) history.replaceState({ r: 'pstudio', p: 'p:' + P.id + ':' + E().view }, ''); } catch (_) {}
    ws.refresh();
  }

  /** app.js hands the Studio its routes; false = not ours */
  function route(r, w, param) {
    if (r !== 'studio3' && r !== 'ai' && r !== 'pstudio') return false;
    if ((r === 'pstudio' && !PD.pstudio) || (r !== 'studio3' && !PD.s3core)) return false;
    style(); document.documentElement.dataset.col = r === 'studio3' ? 'wide' : 'studio';
    if (r === 'studio3') home(w); else if (r === 'ai') songWS(w, param); else arrWS(w, param);
    return true;
  }

  function style() {
    if (PD.studio3._s) return; PD.studio3._s = true;
    document.head.appendChild(h('style', { text: `
:root[data-col="studio"] .wrap{max-width:1680px}
.s3{display:grid;gap:var(--s6);min-width:0}.s3 .grow{flex:1}.s3 .mono{font-family:var(--f-mono);font-variant-numeric:tabular-nums}
.s3 h1{margin:0;font:700 var(--t-display)/1.1 var(--f-display);letter-spacing:-.01em}.s3 h2{margin:0;font:600 var(--t-title2)/1.2 var(--f-ui)}.s3 h3{margin:0 0 6px;font:600 var(--t-foot)/1.3 var(--f-ui);color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.s3-hero{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:clamp(14px,3vw,30px);border-radius:var(--r-l)}
.s3-hero-mark{color:var(--acc2);display:grid;place-items:center;width:48px;height:48px;flex:none;border:1px solid var(--acc-line);border-radius:14px;background:var(--acc-wash)}
.s3-hero p{margin:6px 0 0;max-width:62ch}
.s3-flow{display:grid;gap:10px}.s3-flow ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.s3-step{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 10px;align-content:start;padding:12px;border-radius:var(--r-s);background:var(--surface);border:1px solid var(--line)}
.s3-step b{font-size:var(--t-callout)}.s3-step small{display:block;color:var(--muted);font-size:var(--t-caption);line-height:1.4;margin-top:2px}
.s3-n{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--surface3);font:600 12px var(--f-ui);color:var(--fg2)}
.s3-st{grid-column:2;justify-self:start;font:600 11px var(--f-ui);padding:2px 8px;border-radius:var(--r-pill);border:1px solid var(--line2);color:var(--fg2)}
.s3-st-ok{color:var(--ok);border-color:rgba(125,211,160,.35)}.s3-st-pm{color:var(--acc);border-color:var(--acc-line)}.s3-st-part{color:var(--almost);border-color:rgba(224,176,114,.4)}
.s3-note{margin:0;font-size:var(--t-caption);color:var(--faint);line-height:1.5;max-width:90ch}
.s3-acts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.s3-guide summary{color:var(--muted);cursor:pointer;padding-block:10px}
.s3-guide .s3-flow{margin-top:6px}
.s3-card,.s3-tcard{display:grid;gap:6px;justify-items:start;align-content:start;text-align:start;min-height:132px;padding:18px;border-radius:var(--r-m);background:var(--surface);border:1px solid var(--line2);color:var(--fg);font:inherit;cursor:pointer;transition:background var(--d-micro) var(--ease),border-color var(--d-micro) var(--ease)}
.s3-card:hover,.s3-tcard:hover{background:var(--surface2)}.s3-card.over{border-color:var(--acc);background:var(--acc-wash)}
.s3-card.primary{background:linear-gradient(160deg,rgba(213,167,120,.16),var(--surface) 62%);border-color:var(--acc-line)}
.s3-card>b,.s3-tcard>b{font-size:var(--t-headline);overflow-wrap:anywhere}.s3-card>small,.s3-tcard>small{color:var(--muted);line-height:1.45}.s3-card-ic{color:var(--acc);margin-bottom:4px}
.s3-more{margin:-8px 0 0;font-size:var(--t-foot)}
.s3-tpl{display:grid;gap:12px}.s3-tpl-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px}
.s3-tcard{cursor:default}button.s3-tcard{cursor:pointer}
.s3-rchips{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.s3-rchip{display:grid;gap:2px;justify-items:start;min-width:120px;padding:10px 12px;border-radius:var(--r-s);background:var(--surface2);border:1px solid var(--line2);color:var(--fg);font:inherit;cursor:pointer}
.s3-rchip:hover{border-color:var(--acc-line)}.s3-rchip b{font-size:var(--t-callout)}.s3-rchip .mono{font-size:15px;color:var(--fg2);letter-spacing:.06em}.s3-tnote{font-size:var(--t-caption)!important;color:var(--faint)!important}
.s3-sh{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.s3-list{display:grid;gap:6px;list-style:none;margin:0;padding:0}.s3-row{display:grid;grid-template-columns:36px minmax(0,1fr) auto 18px;align-items:center;gap:12px;width:100%;min-height:58px;padding:8px 12px;border-radius:var(--r-s);background:var(--surface);border:1px solid var(--line);color:var(--fg);font:inherit;text-align:start;cursor:pointer}
.s3-row:hover{background:var(--surface2)}.s3-row-ic{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:var(--surface2);color:var(--acc)}.s3-row[data-kind=arrangement] .s3-row-ic{color:#8fb7e0}
.s3-row-t{display:grid;min-width:0}.s3-row-t b,.s3-row-t small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.s3-row-t small{color:var(--muted);font-size:var(--t-caption)}
.s3-when{color:var(--faint);font-size:var(--t-caption)}.s3-row-go{color:var(--faint)}.s3-warn{color:var(--almost)!important}.s3-empty{margin:0}
/* the workspace */
.s3-ws{gap:12px}
.s3-head{display:flex;align-items:center;gap:8px;min-width:0}
.s3-ib{display:inline-grid;place-items:center;width:40px;height:40px;flex:0 0 auto;border-radius:12px;border:1px solid var(--line2);background:var(--surface2);color:var(--fg);cursor:pointer;padding:0}
.s3-ib:hover{background:var(--surface3)}.s3-ib:disabled{opacity:.38;cursor:default}.s3-ib[aria-pressed=true]{background:var(--acc-wash);border-color:var(--acc-line);color:var(--acc2)}
.s3-kind{display:grid;place-items:center;width:34px;height:34px;color:var(--acc);flex:0 0 auto}.s3-ws[data-kind=arrangement] .s3-kind{color:#8fb7e0}
.s3-tt{display:grid;min-width:0;flex:1 1 220px}.s3-title{width:100%;min-width:0;background:transparent;border:1px solid transparent;border-radius:10px;color:var(--fg);font:600 var(--t-title2)/1.2 var(--f-ui);padding:4px 8px;margin-inline-start:-8px;text-overflow:ellipsis}
.s3-title:hover:not([readonly]),.s3-title:focus{border-color:var(--line2);background:var(--surface);outline:none}.s3-title[readonly]{cursor:default}
.s3-sub2{display:flex;gap:10px;flex-wrap:wrap;min-width:0}.s3-meta{color:var(--muted)}.s3-save{color:var(--faint)}.s3-save.warn{color:var(--almost)}
.s3-tr{position:sticky;top:0;z-index:8;display:grid;gap:8px;padding:10px 12px;border-radius:var(--r-m);background:rgba(16,17,20,.9);-webkit-backdrop-filter:blur(18px) saturate(1.3);backdrop-filter:blur(18px) saturate(1.3);border:1px solid var(--line2);box-shadow:var(--e2)}
.s3-ws:not(.s3-ready) .s3-tr,.s3-ws:not(.s3-ready) .s3-tabs,.s3-ws:not(.s3-ready) .s3-modes,.s3-ws:not(.s3-ready) .s3-subv,.s3-ws:not(.s3-ready) .s3-side,.s3-ws:not(.s3-ready) .s3-grip,.s3-ws:not(.s3-ready) .s3-head .s3-ib:not(.s3-backb){display:none}
.s3-tr-a,.s3-tr-b{display:flex;align-items:center;gap:6px;min-width:0}.s3-tr-a{flex-wrap:wrap}
.s3-play{width:46px;height:46px;border-radius:50%;background:var(--acc);color:var(--acc-ink);border:0}.s3-play:hover{background:var(--acc2)}.s3-play.on{background:var(--fg);color:#000}
.s3-pos{display:grid;align-content:center;line-height:1.1;margin:0 6px;min-width:88px}.s3-bb{font-size:18px}.s3-bb:empty{display:none}.s3-clk{color:var(--muted);font-size:12px}.s3-prep{color:var(--almost)}
.s3-tgs{display:inline-flex;gap:6px;margin-inline-start:auto}.s3-tg{width:38px;height:38px}
.s3-seek{flex:1 1 auto;min-width:80px;accent-color:var(--acc);height:28px}
.s3-tempo{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}.s3-tempo b{font-variant-numeric:tabular-nums}.s3-tempo small{color:var(--muted)}
.s3-sel,.s3-num{min-height:36px;background:var(--surface);border:1px solid var(--line2);border-radius:10px;color:var(--fg);padding:0 8px;font:inherit}.s3-num{width:72px}
.s3-prov{display:inline-block;font:600 10.5px/1.6 var(--f-ui);padding:0 7px;border-radius:var(--r-pill);border:1px solid var(--line2);color:var(--fg2);white-space:nowrap}
.s3-prov.s3-estimate{color:var(--almost);border-color:rgba(224,176,114,.38)}.s3-prov.s3-corrected{color:#8fb7e0;border-color:rgba(143,183,224,.4)}.s3-prov.s3-confirmed{color:var(--ok);border-color:rgba(125,211,160,.35)}.s3-prov.s3-unavailable{color:var(--faint)}
.s3-body{display:grid;grid-template-columns:var(--s3-side,280px) 12px minmax(0,1fr);gap:0;align-items:start;min-width:0}
.s3-noside .s3-body{grid-template-columns:minmax(0,1fr)}.s3-noside .s3-side,.s3-noside .s3-grip{display:none}
.s3-side{display:grid;gap:14px;align-content:start;position:sticky;top:120px;max-height:calc(100vh - 160px);overflow:auto;padding:14px;border-radius:var(--r-m);background:var(--surface);border:1px solid var(--line);scrollbar-width:thin}
.s3-grip{align-self:stretch;cursor:col-resize;position:relative;touch-action:none}.s3-grip::after{content:'';position:absolute;top:24px;bottom:24px;left:5px;width:2px;border-radius:2px;background:var(--line)}
.s3-grip:hover::after,.s3-grip.drag::after,.s3-grip:focus-visible::after{background:var(--acc-line)}
.s3-blk{display:grid;gap:6px}.s3-kv{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:2px 10px;align-items:baseline;font-size:var(--t-foot)}
.s3-k{color:var(--muted)}.s3-v{display:grid;justify-items:end;text-align:end;min-width:0}.s3-v b{font-weight:600;overflow-wrap:anywhere}.s3-v small{color:var(--faint);font-size:11px}.s3-kv .s3-prov{grid-column:1/-1;justify-self:end}
.s3-trk{grid-template-columns:12px minmax(0,1fr) minmax(0,1fr)}.s3-dot{width:9px;height:9px;border-radius:50%;background:var(--c)}.s3-trk .s3-v{grid-column:3}
.s3-fine{color:var(--faint);font-size:11.5px;line-height:1.45}
.s3-maincol{display:grid;gap:12px;min-width:0}
.s3-tabs{display:flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:14px;background:var(--bg2);border:1px solid var(--line)}
.s3-tab,.s3-mode{flex:0 0 auto;min-height:38px;padding:0 14px;border:0;border-radius:10px;background:none;color:var(--muted);font:600 var(--t-callout) var(--f-ui);cursor:pointer;white-space:nowrap}
.s3-tab[aria-selected=true],.s3-mode[aria-selected=true]{background:var(--surface3);color:var(--fg)}.s3-tab:hover,.s3-mode:hover{color:var(--fg)}
.s3-modes{display:none;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:4px;padding:4px;border-radius:14px;background:var(--bg2);border:1px solid var(--line)}.s3-mode{padding:0 6px}
.s3-subv{display:none;gap:6px;overflow-x:auto;scrollbar-width:none}.s3-chip[aria-pressed=true]{background:var(--acc-wash);color:var(--acc2);box-shadow:inset 0 0 0 1px var(--acc-line)}
.s3-act{display:block;width:100%;min-height:48px;padding:0 14px;margin:0 0 6px;text-align:start;border-radius:12px;border:1px solid var(--line2);background:var(--surface2);color:var(--fg);font:inherit;cursor:pointer}
.s3-only-narrow{display:none}
/* the studios' own pages inside: their header, transport and tabs are the workspace's now */
.s3-ai>.row.pg-head,.s3-ai>p[data-t="ai.lead"]{display:none}
.s3-ai.s3-on:not([data-v="player"])>details.apr-fold{display:none}
.s3-ai .ai-body>.apr-navigation,.s3-ai .ai-body>.ai-deck,.s3-ai .ai-head .ai-name{display:none}
.s3-ai:not([data-v="lesson"]) .ai-body>.ah{display:none}
.s3-ai .ai-head{justify-content:flex-start}
@media (max-width:1099px){.s3-body{grid-template-columns:minmax(0,1fr)}.s3-side,.s3-grip,.s3-only-wide{display:none!important}.s3-only-narrow{display:inline-grid}
  .s3-flow ol{grid-template-columns:repeat(5,minmax(150px,1fr));overflow-x:auto;padding-bottom:4px}}
@media (max-width:1080px){.s3-acts{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){.s3-acts{grid-template-columns:minmax(0,1fr)}.s3-tpl-grid{grid-template-columns:minmax(0,1fr)}.s3-card,.s3-tcard{min-height:0;grid-template-columns:auto minmax(0,1fr);column-gap:14px}.s3-card>.s3-card-ic,.s3-tcard>.s3-card-ic{grid-row:span 2;margin:2px 0 0}.s3-card>small,.s3-tcard>small{grid-column:2}.s3-tcard>.s3-rchips,.s3-tcard>.s3-tnote{grid-column:1/-1}}
@media (max-width:599px){.s3-tabs{display:none}.s3-modes{display:grid}.s3-subv:not([hidden]){display:flex}
  .s3-head{gap:6px}.s3-kind{display:none}.s3-title{font-size:var(--t-headline)}.s3-sub2{font-size:12px;flex-wrap:nowrap;gap:8px}.s3-meta{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.s3-save{white-space:nowrap}
  .s3-tr{padding:8px;border-radius:14px;gap:6px}.s3-tr-a{gap:4px;flex-wrap:nowrap}.s3-ib{width:34px;height:34px;border-radius:10px}.s3-play{width:40px;height:40px}.s3-tg{width:32px;height:32px}.s3-tgs{gap:4px}
  .s3-pos{min-width:0;flex:1 1 auto;margin:0 2px}.s3-bb{font-size:15px}.s3-clk{font-size:11px;white-space:nowrap}
  .s3-tr-b{flex-wrap:nowrap}.s3-speed{width:76px}.s3-num{width:58px}.s3-tempo{gap:4px}.s3-ws[data-kind=song] .s3-tempo{display:none}
  .s3-flow ol{grid-template-columns:repeat(5,minmax(160px,1fr))}.s3-row{grid-template-columns:36px minmax(0,1fr) 18px}.s3-when{display:none}}
@media (prefers-reduced-motion:reduce){.s3-card,.s3-tcard{transition:none}}
:root.rm .s3-card,:root.rm .s3-tcard{transition:none}
` }));
  }

  const NAV_O = FADERS, NAV_F = '<path d="M6 3.5v17M12 3.5v17M18 3.5v17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect fill="currentColor" x="3.2" y="12" width="5.6" height="4.8" rx="1.4"/><rect fill="currentColor" x="9.2" y="6.2" width="5.6" height="4.8" rx="1.4"/><rect fill="currentColor" x="15.2" y="10" width="5.6" height="4.8" rx="1.4"/>';
  return {
    /** the one Studio entry in the navigation (app.js NAV) */
    nav: NI => ['studio3', 's3.title', NI(NAV_O, NAV_F), 'wide'],
    top: { studio3: 'studio3', ai: 'studio3', pstudio: 'studio3' }, dock: { studio3: 'home' },
    hub: ['studio3', ICON, 's3.title', 's3.tile'], tool: [SVG(FADERS, 22), 's3.title'],
    route, VIEWS, MODES, get workspace() { return alive; }
  };
})();
