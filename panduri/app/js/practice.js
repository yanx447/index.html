/* =====================================================================
   Practice screen — the real panduri is the controller.
   The microphone decides whether a note was played; touch is used for
   navigation and (only in an explicit demo mode) as a stand-in input.
   Visual priority: 1 the next note/stroke · 2 where on the neck · 3 which
   finger · 4 when · 5 whether the app heard you. Everything else is
   secondary (control bar, settings sheet).
   ===================================================================== */
PD.i18n.add({
  'ws.learn': ['სწავლა', 'Learn'], 'ws.practice': ['ვარჯიში', 'Practice'], 'ws.perform': ['შესრულება', 'Perform'],
  'ws.wait': ['ლოდინი', 'WAIT'], 'ws.step': ['ნაბიჯით', 'Step'], 'ws.autoPause': ['ავტოპაუზა', 'Auto-pause'],
  'ws.touch': ['შეხება', 'Touch'], 'ws.mic': ['მიკროფონი', 'Mic'],
  'ws.insp': ['ინფორმაცია', 'Inspector'], 'ws.more': ['მეტი', 'More'], 'ws.full': ['სრული ეკრანი', 'Fullscreen'],
  'ws.showMe': ['მაჩვენე', 'Show me'], 'ws.clearLoop': ['წრის გასუფთავება', 'Clear loop'], 'ws.fsExit': ['გასვლა', 'Exit'], 'ws.down': ['↓ ჩაკვრა', '↓ Down'], 'ws.up': ['↑ ამოკვრა', '↑ Up'],
  'ws.tempo': ['ტემპი', 'Tempo'], 'ws.loop': ['წრე', 'Loop'], 'ws.metro': ['მეტრონომი', 'Metronome'], 'ws.restart': ['თავიდან', 'Restart'],
  'ws.play': ['დაკვრა', 'Play'], 'ws.pause': ['პაუზა', 'Pause'], 'ws.close': ['დახურვა', 'Close'],
  'ws.repMeasure': ['ტაქტის გამეორება', 'Repeat measure'], 'ws.repPhrase': ['ფრაზის გამეორება', 'Repeat phrase'], 'ws.repMistake': ['შეცდომის გამეორება', 'Repeat mistake'],
  'ws.noMistake': ['შეცდომა ჯერ არ ყოფილა', 'No mistake yet'],
  'ws.assist': ['დახმარება', 'Assistance'], 'as.auto': ['ავტომატური', 'Automatic'], 'as.beginner': ['დამწყები', 'Beginner'], 'as.intermediate': ['საშუალო', 'Intermediate'], 'as.advanced': ['მოწინავე', 'Advanced'], 'as.performance': ['შესრულება', 'Performance'],
  'ws.countIn': ['ათვლა', 'Count-in'], 'ws.autoDemo': ['ავტო-ჩვენება', 'Auto show-me'],
  'ws.muteRef': ['ჩანაწერის დადუმება', 'Mute reference'], 'ws.vol.inst': ['ფანდური', 'Panduri'], 'ws.vol.metro': ['მეტრონომი', 'Metronome'], 'ws.vol.ref': ['ჩანაწერი', 'Reference'],
  'ws.mirror': ['მარცხენა ხელისთვის', 'Left-handed'], 'ws.keys': ['კლავიშები', 'Keys'], 'ws.latency': ['დაყოვნება', 'Latency'],
  'ws.drill': ['ვარჯიში: {r}', 'Drill: {r}'], 'ws.exitDrill': ['გასვლა', 'Exit'], 'ws.yes': ['დიახ', 'Yes'], 'ws.later': ['მოგვიანებით', 'Later'],
  'ws.passes': ['წრეები', 'Passes'], 'ws.bar': ['ტაქტი {b} · დარტყმა {k}', 'Bar {b} · beat {k}'],
  'ws.now': ['ახლა', 'Now'], 'ws.string': ['სიმი', 'String'], 'ws.fret': ['ლადი', 'Fret'], 'ws.finger': ['თითი', 'Finger'], 'ws.stroke': ['დარტყმა', 'Stroke'], 'ws.chord': ['აკორდი', 'Chord'],
  'ws.section': ['მონაკვეთი', 'Section'], 'ws.input': ['შეყვანა', 'Input'], 'ws.pass': ['ამ წრეში', 'This pass'],
  'ws.autopause': ['აპი ფონზე გადავიდა — პაუზა', 'App went to the background — paused'],
  'ws.noRef': ['ამ გაკვეთილს საცნობარო ჩანაწერი არ აქვს', 'This lesson has no reference recording'],
  'ws.micFirst': ['მიკროფონი რატომ?', 'Why the microphone?'], 'ws.micAllow': ['ჩართვა', 'Turn on'],
  'ws.micLocal': ['ხმა მხოლოდ ამ მოწყობილობაზე მუშავდება. არაფერი იწერება და არსად იგზავნება. გამორთვისას მიკროფონი სრულად თავისუფლდება.', 'Audio is analysed only on this device. Nothing is recorded or sent anywhere. Turning it off fully releases the microphone.'],
  'ws.micTips': ['მოათავსე ტელეფონი ფანდურიდან 30–60 სმ-ზე. ყურსასმენი აჯობებს — დინამიკის ხმა შეიძლება მიკროფონმა გაიგოს.', 'Place the phone 30–60 cm from the panduri. Headphones help — speaker sound can leak into the mic.'],
  'ws.no3d': ['3D ამ მოწყობილობაზე მიუწვდომელია — 2D ხედი რჩება.', '3D is not available on this device — staying in 2D.'],
  'ws.method': ['მეთოდი', 'Method'], 'ws.video': ['ვიდეო', 'Video'], 'ws.next': ['შემდეგ', 'Next'], 'ws.nowLbl': ['ახლა', 'Now'], 'ws.inBeats': ['{n} დარტყმაში', 'in {n} beats'], 'ws.atLine': ['ახლა', 'now'], 'ws.open': ['ღია', 'open'],
  'ws.cam.player': ['მოთამაშე', 'Player'], 'ws.cam.teacher': ['მასწავლებელი', 'Teacher'], 'ws.cam.left': ['მარცხენა ხელი', 'Left hand'], 'ws.cam.right': ['მარჯვენა ხელი', 'Right hand'], 'ws.cam.fretboard': ['ტარი', 'Fretboard'], 'ws.cam.full': ['მთლიანი', 'Full instrument'],
  'r.unsure': ['ვერ გავიგონე', 'Not heard clearly'], 'r.unsureD': ['{n} ნოტი კარგად ვერ გავიგონე — შეცდომად არ ჩაითვალა.', '{n} notes were not heard clearly — not counted as mistakes.'], 'r.pitchSpread': ['ბგერის სტაბილურობა', 'Pitch stability'],
  'ws.listenDone': ['მოსმენა დასრულდა', 'Listening finished'],
  'rec.title': ['ჩაწერა დაკვრით', 'Record by playing'], 'rec.notes': ['{n} ნოტი', '{n} notes'], 'rec.start': ['● დაწყება', '● Start'], 'rec.save': ['შენახვა', 'Save'], 'rec.undo': ['ბოლოს წაშლა', 'Undo last'],
  'rec.grid': ['ბადე', 'Grid'], 'rec.help': ['დაუკარი მიკროფონთან ან შეეხე ტარს. ნოტები ბადეზე სწორდება; სიმი და ლადი სტუდიოში შეგიძლია შეასწორო.', 'Play into the mic or tap the neck. Notes snap to the grid; you can correct string and fret in the Studio.'],
  'rec.empty': ['ჯერ ნოტი არ ჩაწერილა', 'No notes recorded yet'],
  'r.title': ['შედეგი', 'Result'], 'r.first': ['პირველივე ცდით', 'First try'], 'r.pitch': ['ბგერის სიზუსტე', 'Pitch accuracy'], 'r.timing': ['დრო', 'Timing'], 'r.rhythm': ['რიტმი', 'Rhythm'],
  'r.consist': ['სტაბილურობა', 'Consistency'], 'r.median': ['საშ. გადახრა', 'Median offset'], 'r.earlyLate': ['ადრე / გვიან', 'Early / late'], 'r.missed': ['გამოტოვებული', 'Missed'],
  'r.repeated': ['3+ ცდა', '3+ tries'], 'r.chord': ['აკორდის სისრულე', 'Chord completeness'], 'r.dir': ['დარტყმის მიმართულება', 'Stroke direction'], 'r.tempo': ['ტემპი', 'Tempo'],
  'r.noMic': ['მიკროფონი არ იყო ჩართული', 'Microphone was off'], 'r.waited': ['WAIT რეჟიმში დრო არ ფასდება', 'Timing is not scored in WAIT mode'], 'r.dirMic': ['მიკროფონით ვერ იზომება', 'Not measurable by mic'],
  'r.best': ['საუკეთესო: {s}', 'Best: {s}'], 'r.worst': ['სავარჯიშო: {s}', 'Needs work: {s}'], 'r.drill': ['ამ მონაკვეთის ვარჯიში', 'Drill this section'], 'r.again': ['კიდევ ერთხელ', 'Again'],
  'r.toLesson': ['გაკვეთილზე', 'Back to lesson'], 'r.bars': ['ტაქტები', 'Bars'],
  'r.h2': ['ათვისებული', 'Mastered'], 'r.h1': ['არასტაბილური', 'Inconsistent'], 'r.h0': ['სავარჯიშო', 'Needs practice'], 'r.hn': ['არ დაკრულა', 'Not played'],
  'r.sum': ['პირველივე ცდით {f}% · ტემპი {t}%', 'First try {f}% · tempo {t}%'], 'r.sumT': [' · დრო {p}%', ' · timing {p}%'],
  'kbd.list': ['Space — დაკვრა/პაუზა · R — თავიდან · L — წრე · M — მეტრონომი · W — ლოდინი · ← → — ტაქტი · ↑ ↓ — ტემპი · S — მაჩვენე · D/U — ↓/↑ · Esc — დახურვა', 'Space — play/pause · R — restart · L — loop · M — metronome · W — wait · ← → — bar · ↑ ↓ — tempo · S — show me · D/U — ↓/↑ · Esc — close']
});

PD.i18n.add({
  'pm.wait': ['ლოდინი', 'Wait'], 'pm.cont': ['უწყვეტი', 'Continuous'], 'pm.practice': ['ვარჯიში', 'Practice'], 'pm.perform': ['შესრულება', 'Performance'],
  'pmd.wait': ['გელოდება, სანამ სწორად არ დაუკრავ.', 'Waits until you play it right.'], 'pmd.cont': ['მუსიკა არ ჩერდება — ბოლოს სიზუსტე.', 'Music keeps going — accuracy at the end.'],
  'pmd.practice': ['მონაკვეთი მეორდება; სუფთა დაკვრისას ტემპი იზრდება.', 'The section repeats; tempo rises when it is clean.'], 'pmd.perform': ['თავიდან ბოლომდე, საბოლოო შეფასებით.', 'Start to finish, with a final score.'],
  'ws.mode': ['რეჟიმი', 'Mode'], 'ws.settings': ['პარამეტრები', 'Settings'], 'ws.heard': ['მოისმა', 'Heard'], 'ws.listening': ['გისმენ', 'Listening'], 'ws.micOff': ['მიკროფონი გამორთულია', 'Microphone off'],
  'ws.demo': ['დემო: შეხებით შეფასება', 'Demo: judged by touch'], 'ws.speed': ['სიჩქარე', 'Speed'], 'ws.customBpm': ['საკუთარი BPM', 'Custom BPM'],
  'gate.title': ['აიღე ფანდური და ჩართე მიკროფონი', 'Pick up your panduri and turn on the microphone'],
  'gate.lead': ['აპი შენს ნამდვილ დაკვრას უსმენს: ნოტს, დროს და რიტმს. ხმა მხოლოდ ამ მოწყობილობაზე მუშავდება.', 'The app listens to your real playing: the note, the timing and the rhythm. Sound is analysed only on this device.'],
  'gate.on': ['მიკროფონის ჩართვა', 'Turn on microphone'], 'gate.watch': ['მხოლოდ ყურება', 'Watch only'], 'gate.demo': ['ფანდურის გარეშე (დემო)', 'Without a panduri (demo)'],
  'gate.calib': ['კალიბრაცია ჯერ არ ჩატარებულა — 1 წუთი, უფრო ზუსტი ამოცნობისთვის.', 'Not calibrated yet — 1 minute, for more reliable listening.'], 'gate.calibGo': ['კალიბრაცია', 'Calibrate'],
  'gate.denied': ['მიკროფონზე წვდომა უარყოფილია.', 'Microphone access was denied.'],
  'gate.how': ['ჩართვა: Safari — Settings › Safari › Microphone › Allow. Chrome — მისამართის ზოლში 🔒 › Microphone › Allow. შემდეგ განაახლე გვერდი.', 'To allow it: Safari — Settings › Safari › Microphone › Allow. Chrome — 🔒 in the address bar › Microphone › Allow. Then reload the page.'],
  'ci.start': ['დაიწყე', 'Start'],
  'g.early': ['ადრე', 'early'], 'g.late': ['გვიან', 'late'], 'g.perfect': ['ზუსტი', 'perfect'], 'g.good': ['კარგი', 'good'],
  'r.accuracy': ['სიზუსტე', 'Accuracy'], 'r.correct': ['სწორი ნოტები', 'Correct notes'], 'r.streak': ['საუკეთესო სერია', 'Best streak'], 'r.areas': ['გასაუმჯობესებელი', 'Areas to improve'],
  'r.errors': ['სად მოხდა შეცდომები', 'Where the mistakes were'], 'gate.lat': ['დაყოვნება მაღალია ({n} მწ) — დრო შეიძლება არაზუსტად შეფასდეს. სცადე ყურსასმენის გარეშე ან გაიმეორე კალიბრაცია (⚙ → მიკროფონი).', 'Latency is high ({n} ms) — timing may be judged inaccurately. Try without Bluetooth headphones or recalibrate (⚙ → Microphone).'], 'r.tgraph': ['დრო ყოველ დარტყმაზე (მწ)', 'Timing on every stroke (ms)'], 'r.retry': ['რთული მონაკვეთის გამეორება', 'Retry difficult section'], 'r.continue': ['გაგრძელება', 'Continue'],
  'r.aSection': ['„{s}“ — ყველაზე სუსტი მონაკვეთი', '“{s}” — the weakest section'], 'r.aLate': ['ხშირად აგვიანებ — ფოკუსი დარტყმის დროზე', 'Often late — focus on the moment of the stroke'], 'r.aEarly': ['ხშირად ასწრებ — დაელოდე ხაზს', 'Often early — wait for the line'],
  'r.aAccent': ['აქცენტები არასტაბილურია', 'Accents are uneven'], 'r.aExtra': ['{n} ზედმეტი დარტყმა', '{n} extra strokes'], 'r.aShift': ['ლადზე გადასვლა {t} — ყველაზე ხშირი შეცდომა', 'The fret change {t} — the most common slip'],
  'r.grades': ['ზუსტი {p} · კარგი {g} · ადრე {e} · გვიან {l}', 'perfect {p} · good {g} · early {e} · late {l}'], 'r.accents': ['აქცენტები', 'Accents'], 'r.extra': ['ზედმეტი', 'Extra'], 'r.none': ['შეცდომა არ ყოფილა', 'No mistakes'],
  'ws.fingerIs': ['თითი {n} · {name}', 'Finger {n} · {name}'], 'ws.openStr': ['ღია სიმი', 'open string'], 'ws.fretN': ['ლადი {f}', 'fret {f}'], 'ws.strN': ['{s} სიმი', '{s} string'],
  'h.watch': ['ყურების რეჟიმი — აპი თავად უკრავს', 'Watch mode — the app plays it for you']
});
PD.i18n.add({
  'p.play': ['დაუკარი', 'Play'], 'p.playOpen': ['დაუკარი {s}', 'Play {s}'], 'p.openStr': ['ღია სიმი', 'open string'], 'p.str': ['{s} სიმი', '{s} string'], 'p.fret': ['ლადი {f}', 'fret {f}'],
  'p.finger': ['{n} · {name}', '{n} · {name}'], 'p.chord': ['აკორდი {n}', 'Chord {n}'], 'p.ready': ['მოემზადე', 'Get ready'], 'p.done': ['დასრულდა', 'Finished'], 'p.paused': ['პაუზა', 'Paused'],
  'p.listening': ['გისმენ…', 'Listening…'], 'p.watching': ['მოუსმინე — აპი თავად უკრავს', 'Listen — the app plays it'], 'p.micOff': ['მიკროფონი გამორთულია', 'Microphone is off'],
  'p.heardOk': ['✓ {p}', '✓ {p}'], 'p.heardWrong': ['მოვისმინე {p} — გვჭირდება {e}', 'I heard {p} — we need {e}'],
  'p.resume': ['გაგრძელება', 'Resume'], 'p.restart': ['თავიდან', 'Start over'], 'p.exit': ['გასვლა', 'Exit'], 'p.yourTurn': ['ახლა შენ დაუკარი', 'Now you play'],
  'p.listenFirst': ['ჯერ მოვუსმენ', 'Listen first'], 'p.more': ['მეტი', 'More'], 'p.speed': ['სიჩქარე', 'Speed'], 'p.mode': ['რეჟიმი', 'Mode'], 'p.loop': ['მონაკვეთის გამეორება', 'Repeat a section'],
  'p.loopPhrase': ['ეს ფრაზა', 'This phrase'], 'p.loopBar': ['ეს ტაქტი', 'This bar'], 'p.loopMistake': ['ბოლო შეცდომა', 'Last mistake'], 'p.loopOff': ['გამეორების გამორთვა', 'Stop repeating'],
  'p.showMe': ['მომასმენინე ეს ნოტი', 'Let me hear this note'], 'p.names': ['ნოტების სახელები', 'Note names'], 'p.mic': ['მიკროფონი და ოთახი', 'Microphone and room'], 'p.video': ['მასწავლებლის ვიდეო', 'Teacher video'],
  'p.lefty': ['მარცხენა ხელისთვის', 'Left-handed'], 'p.sound': ['ხმები', 'Sounds'], 'p.accent': ['აქცენტი', 'accent'], 'p.dev': ['DEV · შეხებით ტესტი', 'DEV · touch test'],
  'p.loopOn': ['მეორდება', 'Repeating'], 'p.drill': ['ვარჯიში', 'Drill']
});
PD.practice = (() => {
  const E = PD.engine, S = E.S, TH = PD.theory, LS = PD.lessons, h = PD.h, ic = PD.ic;
  let W = null;   // current screen
  const pct = v => v == null ? '—' : Math.round(v * 100) + '%';
  function summary(r) {
    if (!r) return '';
    let s = t('r.sum', { f: Math.round((r.firstTry || 0) * 100), t: r.tempoPct || 0 });
    if (r.timing != null) s += t('r.sumT', { p: Math.round(r.timing * 100) });
    return s;
  }
  /** developer-only touch input (Settings › Developer). Never shown to learners. */
  const devTouch = () => PD.store.get('devTouch', false);

  /* ---------- microphone (explained before asking) ---------- */
  function micOn(cb) {
    if (PD.ui.micBlocked()) { cb && cb(false, 'blocked'); return; }
    const go = async () => {
      const r = await PD.detector.start();
      if (!r.ok) { cb && cb(false, r.err); return; }
      const st = PD.detector.status(); if (!st.raw) PD.ui.toast(t('mic.processed'), 4500);
      if (/bluetooth|airpods|hands-?free|headset|buds/i.test(st.label || '') || PD.audio.outLatency > .1) setTimeout(() => PD.ui.toast(t('mic.bt'), 6000), st.raw ? 0 : 4600);
      cb && cb(true);
    };
    if (PD.store.get('micExplained', false)) return go();
    PD.ui.sheet((box, close) => {
      box.append(h('h2', { 'data-t': 'ws.micFirst' }), h('p', { class: 'fg2', 'data-t': 'mic.why' }), h('p', { class: 'fg2', 'data-t': 'ws.micLocal' }), h('p', { class: 'muted', 'data-t': 'ws.micTips' }),
        h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'ws.micAllow', onclick: () => { PD.store.set('micExplained', true); close(); go(); } }), h('button', { class: 'btn', 'data-t': 'cancel', onclick: () => { close(); cb && cb(false); } })]));
    });
  }

  /* ---------- modes ---------- */
  const MODES = ['wait', 'cont', 'practice', 'perform'];
  function modeOf() { return S.mode === 'perform' ? 'perform' : (S.wait || S.stepMode) ? 'wait' : S.loop.on ? 'practice' : 'cont'; }
  function setMode(m) {
    if (m === 'wait') { if (S.loop.on && !S.drill) E.clearLoop(); E.configure({ mode: 'learn', wait: true }); }
    else if (m === 'cont') { if (S.loop.on && !S.drill) E.clearLoop(); E.configure({ mode: 'practice', wait: false }); }
    else if (m === 'practice') { E.configure({ mode: 'practice', wait: false }); if (!S.loop.on) E.repeatPhrase(); S.smartTempo = true; }
    else { if (S.loop.on && !S.drill) E.clearLoop(); E.configure({ mode: 'perform', wait: false }); }
    PD.store.set('pmode', m);
  }

  /* ---------- the screen ---------- */
  function open(lesson, opts, srcId, stage, rec) {
    if (W) close(true);
    opts = Object.assign({}, opts || {});
    const offs = [], prevAutoDemo = S.autoDemo;
    const w = W = { lesson, srcId: srcId || lesson.id, stage, rec: !!rec, prevMetro: S.metro, raf: 0, watch: !!opts.autoplay, sig: '' };
    const steps0 = LS.steps(lesson), RHYTHM = steps0.length > 0 && steps0.every(s => s.kind === 'strum');
    const mirror = PD.store.get('lefty', false);

    const root = h('div', { class: 'pz' + (RHYTHM ? ' rhythm' : ''), role: 'application', 'aria-label': PD.i18n.pick(lesson.title) });
    /* header: back · title · pause · more ; progress */
    const bBack = h('button', { class: 'pz-ic', 'aria-label': t('ws.close'), html: ic.back, onclick: () => close() });
    const bPause = h('button', { class: 'pz-ic', 'aria-label': t('ws.pause'), html: ic.pause, onclick: () => togglePause() });
    const bMore = h('button', { class: 'pz-ic', 'aria-label': t('p.more'), html: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>', onclick: () => more() });
    const progI = h('i'), progN = h('span', { class: 'pz-pn' }), chip = h('span', { class: 'pz-chip', hidden: true });
    const top = h('header', { class: 'pz-top' }, [bBack, h('div', { class: 'pz-title' }, [h('b', { text: PD.i18n.pick(lesson.title) }), chip]), bPause, bMore]);
    const prog = h('div', { class: 'pz-prog' }, [h('div', { class: 'pz-bar' }, [progI]), progN]);
    /* lanes */
    const cvL = h('canvas', { class: 'pz-cv', 'aria-hidden': 'true' });
    const lanesBox = h('div', { class: 'pz-lanes' }, [cvL]);
    /* prompt: what to play · where · finger */
    const pBig = h('div', { class: 'pz-big' }), pSub = h('div', { class: 'pz-sub' });
    const prompt = h('div', { class: 'pz-prompt', role: 'status', 'aria-live': 'polite' }, [pBig, pSub]);
    /* neck */
    const cvN = h('canvas', { class: 'pz-cv', 'aria-label': t('ws.now') });
    const neckBox = h('div', { class: 'pz-neck' + (RHYTHM ? ' slim' : '') }, [cvN]);
    /* stroke guide */
    const stroke = h('div', { class: 'pz-stroke', 'aria-hidden': 'true' });
    /* listening */
    const micBars = h('span', { class: 'pz-bars' }, [h('i'), h('i'), h('i'), h('i')]);
    const micTxt = h('span', { class: 'pz-mt' });
    const micRow = h('button', { class: 'pz-mic', onclick: () => micSheet() }, [h('span', { class: 'pz-mi', html: ic.mic }), micBars, micTxt]);
    const bottom = h('div', { class: 'pz-bot' }, [stroke, micRow]);
    /* overlays */
    const gateEl = h('div', { class: 'pz-over', hidden: true });
    const stage0 = h('div', { class: 'pz-stage' }, [lanesBox, prompt, neckBox, gateEl]);
    const vidEl = h('div', { class: 'pz-vid', hidden: true });
    const recBar = h('div', { class: 'pz-rec', hidden: !w.rec });
    root.append(top, prog, stage0, bottom, recBar, vidEl);
    document.body.appendChild(root); document.body.style.overflow = 'hidden';
    PD.i18n.apply(root); w.root = root;

    /* renderers */
    const lanes = PD.Lanes(cvL, { rhythm: RHYTHM }); lanes.mirror = mirror;
    const neck = PD.Neck(cvN, { onTap: (s, f) => { if (!devTouch()) return; PD.audio.ensure(); PD.audio.note(s, f, { vel: .6 }); E.input({ kind: 'note', src: 'touch', midi: TH.midi(s, f), s, f, conf: 1, t: PD.audio.now() }); } }); neck.mirror = mirror;
    w.neck = neck; w.lanes = lanes;
    const relayout = () => { lanes.layout(); neck.layout(); w.sig = ''; };

    if (!w.rec) {
      E.load(lesson, Object.assign({ mode: 'learn', wait: true, tempo: .7, stepMode: false, autoPause: false, autoplay: false }, opts));
      if (opts.autoDemo != null) S.autoDemo = !!opts.autoDemo;
      if (opts.metro) S.metro = true;
      if (opts.loop) setTimeout(() => { S.loop = Object.assign({}, opts.loop); S.smartTempo = true; E.seek(opts.loop.a || 0); }, 20);
      if (opts.drill) setTimeout(() => E.drill(opts.drill.a, opts.drill.b, opts.drill.ladder ? { ladder: opts.drill.ladder, wait: !!opts.wait } : { tempo: Math.max(.4, (opts.tempo || .7) - .1), wait: true }), 60);
      else if (opts.resumeBeat > 0) setTimeout(() => E.seek(Math.floor(opts.resumeBeat / E.bpb()) * E.bpb()), 30);
    } else { E.load(lesson, { mode: 'learn', wait: false, tempo: .7 }); S.steps = []; S.res = []; }
    S.input = 'mic';

    /* ---------- microphone gate: the real panduri is the input ---------- */
    function gate(err) {
      const need = !w.watch && !PD.detector.active && !devTouch();
      gateEl.hidden = !need; gateEl.innerHTML = '';
      if (!need) return;
      if (S.playing) E.stop();
      const card = h('div', { class: 'pz-card' }, [h('span', { class: 'pz-cic', html: ic.mic }), h('h2', { 'data-t': 'gate.title' }), h('p', { 'data-t': 'gate.lead' })]);
      if (err === 'blocked' || (err === 'denied' && window.top !== window)) card.append(h('p', { class: 'pz-warn', text: PD.ui.micError('blocked') }));
      else if (err === 'denied') card.append(h('p', { class: 'pz-warn', html: '<b>' + PD.esc(t('gate.denied')) + '</b> ' + PD.esc(t('gate.how')) }));
      else if (err) card.append(h('p', { class: 'pz-warn', text: PD.ui.micError(err) }));
      card.append(h('button', { class: 'btn primary big', html: ic.mic + '<span data-t="gate.on"></span>', onclick: () => micOn((ok, e) => { if (ok) { gate(); afterMic(); } else gate(e || 'failed'); }) }),
        h('button', { class: 'btn quiet', 'data-t': 'p.listenFirst', onclick: () => startWatch() }));
      gateEl.appendChild(card); PD.i18n.apply(gateEl);
    }
    function afterMic() {
      if (!PD.detector.calib.date) PD.ui.toast(t('gate.calib'), 5000);
      else { const L = Math.round((PD.detector.calib.latencyMs || 0) + (PD.detector.procLatencyMs || 0)); if (L > 120) PD.ui.toast(t('gate.lat', { n: L }), 6000); }
      if (!w.rec && !S.playing) setTimeout(() => { if (W === w) E.play(); }, 350);
    }
    function startWatch() { w.watch = true; gateEl.hidden = true; E.configure({ autoplay: true, wait: false }); S.autoplay = true; E.seek(0); E.play(); sync(true); }
    function yourTurn() {
      w.watch = false; S.autoplay = false; E.configure({ autoplay: false, wait: opts.wait != null ? !!opts.wait : true }); E.seek(0); lanes.reset();
      if (PD.detector.active || devTouch()) E.play(); else gate();
    }

    /* ---------- pause ---------- */
    function togglePause() {
      if (!gateEl.hidden) return;
      if (S.playing) { E.stop(); pauseCard(); } else { closePause(); E.play(); }
    }
    let pauseEl = null;
    function pauseCard() {
      closePause();
      pauseEl = h('div', { class: 'pz-over' }, [h('div', { class: 'pz-card' }, [h('h2', { 'data-t': 'p.paused' }),
        h('button', { class: 'btn primary big', 'data-t': 'p.resume', onclick: () => { closePause(); E.play(); } }),
        h('button', { class: 'btn', 'data-t': 'p.restart', onclick: () => { closePause(); lanes.reset(); E.restart(); } }),
        h('button', { class: 'btn quiet', 'data-t': 'p.exit', onclick: () => close() })])]);
      stage0.appendChild(pauseEl); PD.i18n.apply(pauseEl);
    }
    function closePause() { if (pauseEl) { pauseEl.remove(); pauseEl = null; } }

    /* ---------- live feedback (no popups) ---------- */
    let hintT = 0, hintOn = false;
    const QUIET = new Set(['h.waitNote', 'h.waitChord', 'h.waitStroke', 'h.pressPlay']);
    function say(text, cls, ms) {
      micTxt.textContent = text; micRow.className = 'pz-mic ' + (cls || ''); hintOn = true;
      clearTimeout(hintT); hintT = setTimeout(() => { hintOn = false; micState(true); }, ms || 2200);
    }
    function micState(force) {
      if (hintOn && !force) return;
      const on = PD.detector.active;
      micRow.className = 'pz-mic' + (on ? ' on' : '') + (w.watch ? ' watch' : '');
      micTxt.textContent = w.watch ? t('p.watching') : on ? t('p.listening') : devTouch() ? t('p.dev') : t('p.micOff');
    }
    offs.push(E.on('hint', m => { if (QUIET.has(m.key)) return; say(t(m.key, m.vars), m.cls, m.ms || 2400); }));
    offs.push(E.on('count', k => { lanes.count(k); }));
    offs.push(E.on('state', () => sync()));
    offs.push(E.on('seek', () => { w.sig = ''; }));
    offs.push(E.on('hit', e => {
      const r = S.res[e.st.i] || {};
      lanes.hit(e.st.i, !E.waitEff() || e.st.wait === false ? r.grade : null);
      neck.confirm();
      if (e.st.kind === 'note') neck.pluck(e.st.notes[0].s, e.st.notes[0].f); else [1, 2, 3].forEach(s => neck.pluck(s, (e.st.frets || [])[s - 1] || 0, .7));
      if (!e.r.auto) {
        const hd = e.r.heard; if (hd && hd.midi != null) say(t('p.heardOk', { p: TH.name(Math.round(hd.midi)) }), 'ok', 900);
        if (PD.store.get('haptics', true) && navigator.vibrate) try { navigator.vibrate(12); } catch (_) {}
      }
    }));
    offs.push(E.on('wrong', e => {
      lanes.wrong(e.st.i); neck.wrong();
      const hd = e.r && e.r.heard;
      if (hd && hd.midi != null && e.st.kind === 'note' && (e.r.key === 'h.wrong' || e.r.key === 'h.octUp' || e.r.key === 'h.octDown')) {
        const n = e.st.notes[0]; say(t('p.heardWrong', { p: TH.name(Math.round(hd.midi)), e: TH.name(TH.midi(n.s, n.f)) }), 'fix', 2600);
      }
    }));
    offs.push(E.on('miss', st => lanes.miss(st.i)));
    offs.push(E.on('unsure', () => {}));
    offs.push(E.on('suggest', s => {
      const b = h('div', { class: 'pz-sug' }, [h('span', { text: t('h.suggest', { r: s.label, p: Math.round(s.tempo * 100) }) }),
        h('button', { class: 'btn small primary', text: t('ws.yes'), onclick: () => { b.remove(); E.drill(s.a, s.b, { tempo: s.tempo, wait: true }); } }),
        h('button', { class: 'btn small quiet', text: t('ws.later'), onclick: () => b.remove() })]);
      stage0.appendChild(b); setTimeout(() => b.remove(), 12000);
    }));
    offs.push(E.on('demo', st => { if (st.kind === 'note') neck.pluck(st.notes[0].s, st.notes[0].f); }));
    offs.push(E.on('end', r => onEnd(r)));
    let lastIn = 0;
    offs.push(PD.detector.on('input', m => { if (performance.now() - lastIn < 6000 || !S.playing) return; lastIn = performance.now(); say(t(m.kind === 'clip' ? 'h.clip' : 'h.quiet'), 'almost', 2600); }));
    let lvl = 0;
    offs.push(PD.detector.on('level', m => { lvl = Math.max(lvl * .6, Math.min(1, Math.sqrt(m.rms) * 3.2)); }));
    offs.push(PD.detector.on('state', () => { gate(); micState(true); }));

    /* ---------- the current step → prompt, neck targets, stroke guide ---------- */
    function stepSig() { const st = S.steps[S.cur]; return (st ? S.cur : 'end') + ':' + PD.i18n.lang + ':' + E.assist() + ':' + PD.fingers.on + PD.fingers.symbols + ':' + (S.playing ? 1 : 0) + (S.ci ? 'c' : ''); }
    function step() {
      const st = S.steps[S.cur], nx = S.steps[S.cur + 1], A = E.flags();
      if (!st) { pBig.textContent = S.steps.length ? t('p.done') : ''; pSub.innerHTML = ''; neck.setTarget([], []); stroke.innerHTML = ''; return; }
      pSub.innerHTML = '';
      const chipEl = (cls, html) => h('span', { class: 'pz-c ' + (cls || ''), html });
      if (st.kind === 'note') {
        const n = st.notes[0], m = TH.midi(n.s, n.f);
        pBig.textContent = n.f === 0 ? t('p.playOpen', { s: TH.stringName(n.s) }) : t('p.play') + ' ' + TH.name(m);
        pSub.append(chipEl('', PD.esc(t('p.str', { s: TH.stringName(n.s) }))));
        pSub.append(chipEl('', PD.esc(n.f === 0 ? t('p.openStr') : t('p.fret', { f: n.f }))));
        if (n.f > 0 && n.fi && A.fingers) pSub.append(chipEl('fing', '<i style="background:' + PD.fingers.color(n.fi) + '"></i>' + PD.esc(t('p.finger', { n: PD.fingers.label(n.fi), name: PD.fingers.name(n.fi) }))));
        if (n.f === 0) pSub.append(chipEl('dim', PD.esc(TH.name(m))));
      } else if (st.kind === 'chord') {
        pBig.textContent = t('p.chord', { n: st.name || '' });
        st.notes.forEach(n => pSub.append(chipEl(n.f > 0 && n.fi ? 'fing' : '', (n.f > 0 && n.fi ? '<i style="background:' + PD.fingers.color(n.fi) + '"></i>' : '') + PD.esc(TH.stringName(n.s) + ' · ' + (n.f > 0 ? n.f : 0)))));
      } else {
        pBig.textContent = (st.st === 'up' ? '↑ ' : '↓ ') + t(st.st === 'up' ? 'w.up' : 'w.down');
        if (st.acc) pSub.append(chipEl('acc', PD.esc(t('p.accent'))));
        if (st.notes.some(n => n.f > 0)) st.notes.forEach(n => pSub.append(chipEl('', PD.esc(TH.stringName(n.s) + ' · ' + n.f))));
      }
      prompt.classList.toggle('acc', !!st.acc);
      // neck: where to press now; the next place is ghosted
      const tgt = A.frets === false ? [] : st.notes.map(n => ({ s: n.s, f: n.f, fi: A.fingers ? n.fi : 0 }));
      const nxt = !nx || !A.ghost ? [] : nx.notes.map(n => ({ s: n.s, f: n.f, fi: A.fingers ? n.fi : 0 }));
      neck.setTarget(st.kind === 'strum' && !st.notes.some(n => n.f > 0) ? [] : tgt, nxt);
      // stroke guide
      const up = st.st === 'up', acc = !!st.acc;
      stroke.className = 'pz-stroke' + (up ? ' up' : ' down') + (acc ? ' acc' : '');
      stroke.innerHTML = PD.practice.strokeSVG(up) + '<span class="pz-sa">' + (up ? '↑' : '↓') + '</span><span class="pz-sl">' + PD.esc(t(up ? 'w.up' : 'w.down')) + (acc ? ' · ' + PD.esc(t('p.accent')) : '') + '</span>';
    }
    function sync(force) {
      if (!W) return;
      bPause.innerHTML = S.playing ? ic.pause : ic.play; bPause.setAttribute('aria-label', t(S.playing ? 'ws.pause' : 'ws.play'));
      const md = modeOf(); chip.hidden = md === 'wait' && !S.loop.on && !S.drill; chip.textContent = S.drill ? t('p.drill') : S.loop.on ? t('p.loopOn') : t('pm.' + md);
      micState();
      if (force) w.sig = '';
    }

    /* ---------- recording (author tool) ---------- */
    if (w.rec) {
      let grid = .5;
      const n = h('span', { class: 'mono' });
      const gridSeg = h('div', { class: 'seg', role: 'group', 'aria-label': t('rec.grid') }, [[1, '♩'], [.5, '♪'], [.25, '♬']].map(([g, l]) => h('button', { 'aria-pressed': String(g === grid), text: l, onclick: e => { grid = g; gridSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
      const bStart = h('button', { class: 'btn primary', 'data-t': 'rec.start', onclick: () => { if (!w.recording) { w.recording = true; bStart.disabled = true; gridSeg.hidden = true; E.record(lesson, { tempo: S.tempo || .7, grid }); } } });
      const upd = () => { n.textContent = t('rec.notes', { n: S.rec ? S.rec.notes.length : 0 }); };
      offs.push(E.on('recNote', e => { upd(); if (e && e.s) neck.pluck(e.s, e.f || 0); })); upd();
      recBar.append(h('span', { class: 'chip', style: 'color:var(--fix)', html: '<span class="dot"></span>REC' }), gridSeg, bStart, n,
        h('button', { class: 'btn small', 'data-t': 'rec.undo', onclick: () => E.undoRecord() }),
        h('button', { class: 'btn small', 'data-t': 'cancel', onclick: () => { E.stopRecord(false); close(); } }),
        h('button', { class: 'btn small primary', 'data-t': 'rec.save', onclick: () => { if (!S.rec || !S.rec.notes.length) { PD.ui.toast(t('rec.empty')); return; } const L = E.stopRecord(true); PD.ui.toast(t('toast.saved')); close(); if (L) PD.app.go('lesson', L.id, true); } }));
      PD.i18n.apply(recBar); prompt.hidden = true; stroke.hidden = true;
    }

    /* ---------- sheets ---------- */
    function micSheet() {
      PD.ui.sheet((box, close) => {
        const on = PD.detector.active, c = PD.detector.calib;
        box.append(h('h2', { 'data-t': 'p.mic' }));
        const meter = h('div', { class: 'bar', style: 'height:4px' }, [h('i', { style: 'width:0;transition:width .06s' })]);
        const off = PD.detector.on('level', m => { meter.firstChild.style.width = Math.min(100, Math.sqrt(m.rms) * 260) + '%'; });
        box.append(meter, h('p', { class: 'muted', style: 'font-size:13px', text: c.date ? t('set.calibLast', { d: PD.ui.daysAgo(c.date), l: Math.round(c.latencyMs) }) : t('set.calibNever') }));
        const room = h('div', { class: 'seg', role: 'group', 'aria-label': t('cb.room') }, ['quiet', 'normal', 'noisy'].map(k => h('button', { 'aria-pressed': String((c.room || 'normal') === k), 'data-t': 'room.' + k, onclick: e => { PD.detector.setCalib({ room: k }); room.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
        box.append(h('span', { class: 'kicker', 'data-t': 'cb.room' }), room,
          h('div', { class: 'row' }, [on ? h('button', { class: 'btn', 'data-t': 'set.micStop', onclick: () => { PD.detector.stop(); close(); } }) : h('button', { class: 'btn primary', html: ic.mic + '<span data-t="gate.on"></span>', onclick: () => { close(); micOn(ok => { gate(ok ? null : 'failed'); if (ok) afterMic(); }); } }),
            h('button', { class: 'btn', 'data-t': 'gate.calibGo', onclick: () => { close(); E.stop(); PD.calib.open(() => gate()); } }), h('button', { class: 'btn quiet', 'data-t': 'done', onclick: close })]));
        return () => off();
      });
    }
    function tempoSheet() {
      PD.ui.sheet((box, close) => {
        const val = h('b', { class: 'mono', style: 'font-size:28px;font-weight:500' });
        const upd = () => { val.textContent = E.bpm() + ' BPM · ' + Math.round(E.bpm() / lesson.bpm * 100) + '%'; rng.value = String(E.bpm()); seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(!S.bpmOverride && Math.abs(S.tempo * 100 - +b.dataset.p) < 1))); };
        const rng = h('input', { type: 'range', min: '20', max: String(Math.max(200, lesson.bpm * 1.3 | 0)), step: '1', 'aria-label': t('ws.customBpm'), oninput: e => { E.setBpm(+e.target.value); upd(); } });
        const seg = h('div', { class: 'seg', role: 'group', 'aria-label': t('ws.speed') }, [50, 60, 70, 80, 90, 100].map(p => h('button', { 'data-p': String(p), text: p + '%', onclick: () => { E.setTempo(p / 100); upd(); } })));
        box.append(h('h2', { 'data-t': 'p.speed' }), val, seg, h('div', { class: 'row', style: 'flex-wrap:nowrap' }, [h('button', { class: 'btn small', text: '−5', onclick: () => { E.setBpm(E.bpm() - 5); upd(); } }), rng, h('button', { class: 'btn small', text: '+5', onclick: () => { E.setBpm(E.bpm() + 5); upd(); } })]),
          h('button', { class: 'btn', 'data-t': 'done', onclick: close }));
        rng.style.flex = '1'; upd();
      });
    }
    function modeSheet() {
      PD.ui.sheet((box, close) => {
        box.append(h('h2', { 'data-t': 'p.mode' }));
        MODES.forEach(m => box.append(h('button', { class: 'opt', 'aria-pressed': String(modeOf() === m), onclick: () => { setMode(m); close(); lanes.reset(); sync(true); }, html: '<span><b data-t="pm.' + m + '"></b><small data-t="pmd.' + m + '"></small></span><span class="mono">' + (modeOf() === m ? '✓' : '') + '</span>' })));
      });
    }
    function loopSheet() {
      PD.ui.sheet((box, close) => {
        const b = (k, fn) => h('button', { class: 'opt', onclick: () => { close(); fn(); sync(true); }, html: '<span><b data-t="' + k + '"></b></span>' });
        box.append(h('h2', { 'data-t': 'p.loop' }), b('p.loopPhrase', () => E.repeatPhrase()), b('p.loopBar', () => E.repeatMeasure()), b('p.loopMistake', () => { if (!E.repeatMistake()) PD.ui.toast(t('ws.noMistake')); }));
        if (S.loop.on || S.loop.a != null) box.append(b('p.loopOff', () => E.clearLoop()));
      });
    }
    function more() {
      PD.ui.sheet((box, close) => {
        const row = (k, val, fn) => h('button', { class: 'li pz-li', onclick: () => { close(); fn(); } }, [h('span', { class: 'grow', 'data-t': k }), val ? h('span', { class: 'muted', text: val }) : null, h('span', { class: 'chev', html: ic.chevron })]);
        const tg = (k, get, set) => { const c = h('input', { type: 'checkbox', 'aria-label': t(k) }); c.checked = !!get(); c.onchange = () => { set(c.checked); w.sig = ''; }; return h('label', { class: 'li pz-li' }, [h('span', { class: 'grow', 'data-t': k }), c]); };
        box.append(h('h2', { text: PD.i18n.pick(lesson.title) }), h('div', { class: 'list' }, [
          row('p.speed', E.bpm() + ' BPM', tempoSheet),
          row('p.mode', t('pm.' + modeOf()), modeSheet),
          row('p.loop', S.loop.on ? t('p.loopOn') : '', loopSheet),
          row('p.showMe', null, () => { PD.audio.ensure(); E.showMe(); }),
          row('p.mic', PD.detector.active ? t('mic.on') : t('mic.off'), micSheet),
          lesson.media && lesson.media.length ? row('p.video', null, () => toggleVideo()) : null,
          tg('ws.metro', () => S.metro, v => E.setMetro(v)),
          tg('ws.countIn', () => S.countIn, v => E.setCountIn(v)),
          tg('p.names', () => PD.store.get('showNames', null) !== false, v => PD.store.set('showNames', v)),
          tg('set.fingerColors', () => PD.fingers.on, v => PD.store.set('fingerColors', v)),
          tg('set.fingerSymbols', () => PD.fingers.symbols, v => PD.store.set('fingerSymbols', v)),
          tg('p.lefty', () => neck.mirror, v => { neck.mirror = lanes.mirror = v; PD.store.set('lefty', v); })].filter(Boolean)),
          h('button', { class: 'btn', 'data-t': 'done', onclick: close }));
      });
    }
    function toggleVideo() {
      vidEl.hidden = !vidEl.hidden;
      if (!vidEl.hidden && !vidEl.dataset.mounted) { vidEl.dataset.mounted = '1'; PD.media.mount(vidEl); }
    }

    /* ---------- results: real data only ---------- */
    function onEnd(r) {
      const id = w.srcId, p = LS.progress.lesson(id);
      if (!r) {
        if (stage === 'demo' || stage === 'listen' || stage === 'watch') { p.stages = p.stages || {}; p.stages[stage] = 100; LS.progress.saveLesson(id, p); }
        if (w.watch) { const b = h('div', { class: 'pz-over' }, [h('div', { class: 'pz-card' }, [h('h2', { 'data-t': 'ws.listenDone' }), h('button', { class: 'btn primary big', 'data-t': 'p.yourTurn', onclick: () => { b.remove(); yourTurn(); } }), h('button', { class: 'btn quiet', 'data-t': 'p.exit', onclick: () => close() })])]); stage0.appendChild(b); PD.i18n.apply(b); }
        return;
      }
      if (stage) { p.stages = p.stages || {}; p.stages[stage] = Math.max(p.stages[stage] || 0, Math.round(r.firstTry * 100)); }
      p.lastResult = { firstTry: r.firstTry, pitchAcc: r.input === 'mic' ? r.pitchAcc : null, timing: r.timing, tempoPct: r.tempoPct, waited: r.waited, date: Date.now() };
      LS.progress.saveLesson(id, p);
      results(r);
    }
    function results(r) {
      PD.ui.sheet((box, close) => {
        const tile = (k, v, note) => h('div', { class: 'stat' }, [h('b', { text: v }), h('span', { text: t(k) + (note ? ' · ' + note : '') })]);
        const tiles = [tile('r.accuracy', pct(r.firstTry)), tile('r.timing', r.waited ? '—' : pct(r.timing), r.waited ? t('r.waited') : ''), tile('r.correct', r.correct + ' / ' + r.notes), tile('r.missed', String(r.missed)),
          tile('r.streak', String(r.bestStreak)), tile('r.tempo', r.tempo + ' BPM · ' + r.tempoPct + '%')];
        if (r.input === 'mic' && r.pitchAcc != null) tiles.push(tile('r.pitch', pct(r.pitchAcc)));
        if (r.accAcc != null) tiles.push(tile('r.accents', pct(r.accAcc)));
        if (r.extra) tiles.push(tile('r.extra', String(r.extra)));
        if (r.unsure) tiles.push(tile('r.unsure', String(r.unsure)));
        const grades = !r.waited && r.timing != null ? h('p', { class: 'muted', style: 'font-size:12.5px', text: t('r.grades', { p: r.grades.perfect, g: r.grades.good, e: r.grades.early, l: r.grades.late }) }) : null;
        // where the mistakes were: positions on the lesson timeline
        const eb = Math.max(1, E.endBeat()), line = h('div', { class: 'errline', role: 'img', 'aria-label': t('r.errors') }, [h('i', { class: 'track' })]);
        (S.lesson.sections || []).forEach(sc => line.appendChild(h('span', { class: 'sec', style: 'left:' + (sc.from / eb * 100) + '%', text: PD.i18n.pick(sc.name) })));
        r.errors.forEach(e => line.appendChild(h('b', { class: e.missed ? 'miss' : '', style: 'left:' + (e.t / eb * 100) + '%' })));
        // timing graph: every note's offset from the beat (ms); bands = PERFECT / GOOD windows
        let tgraph = null;
        if (!r.waited && r.offsets && r.offsets.filter(o => o.off != null).length >= 3) {
          const W = 440, H = 110, M = 200, n = r.offsets.length, x = i => 8 + i * (W - 16) / Math.max(1, n - 1), y = v => H / 2 - Math.max(-M, Math.min(M, v)) / M * (H / 2 - 6);
          let s = '<rect x="0" y="' + y(90) + '" width="' + W + '" height="' + (y(-90) - y(90)) + '" fill="rgba(147,207,166,.07)"/><rect x="0" y="' + y(40) + '" width="' + W + '" height="' + (y(-40) - y(40)) + '" fill="rgba(147,207,166,.10)"/><line x1="0" x2="' + W + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="rgba(240,232,220,.25)"/>';
          s += '<text x="4" y="11" fill="#8B847B" font-size="9" font-family="IBM Plex Mono">' + PD.esc(t('g.late')) + '</text><text x="4" y="' + (H - 3) + '" fill="#8B847B" font-size="9" font-family="IBM Plex Mono">' + PD.esc(t('g.early')) + '</text>';
          r.offsets.forEach((o, i) => { if (o.missed || o.off == null) { s += '<text x="' + x(i) + '" y="' + (H / 2 + 3) + '" fill="#E39D88" font-size="10" text-anchor="middle">×</text>'; return; } const ms = o.off * 1000, a = Math.abs(ms); s += '<circle cx="' + x(i) + '" cy="' + y(ms) + '" r="3.5" fill="' + (a <= 40 ? '#93CFA6' : a <= 90 ? '#E2C06A' : '#E39D88') + '" stroke="#131418" stroke-width="1.5"><title>' + (i + 1) + ': ' + (ms >= 0 ? '+' : '') + Math.round(ms) + ' ms</title></circle>'; });
          tgraph = h('div', { class: 'tgraph', role: 'img', 'aria-label': t('r.tgraph'), html: '<svg viewBox="0 0 ' + W + ' ' + H + '">' + s + '</svg>' });
        }
        const areas = h('div', { class: 'list' }, r.areas.length ? r.areas.map(a => h('div', { class: 'li' }, [h('span', { text: t(a.key, a.vars) })])) : [h('div', { class: 'li muted', 'data-t': 'r.none' })]);
        const btns = h('div', { class: 'row' });
        const worstSc = r.areas.find(a => a.sc);
        if (worstSc) btns.append(h('button', { class: 'btn primary', text: t('r.retry'), onclick: () => { close(); E.drill(worstSc.sc.from, worstSc.sc.to, { tempo: Math.max(.4, S.tempo - .1), wait: true }); } }));
        btns.append(h('button', { class: 'btn' + (worstSc ? '' : ' primary'), text: t('r.continue'), onclick: () => { close(); WClose(); } }), h('button', { class: 'btn quiet', text: t('r.again'), onclick: () => { close(); E.restart(); } }));
        box.append(...[h('h2', { 'data-t': 'r.title' }), h('div', { class: 'res-grid' }, tiles), grades, tgraph ? h('span', { class: 'kicker', 'data-t': 'r.tgraph' }) : null, tgraph, h('span', { class: 'kicker', 'data-t': 'r.errors' }), line, h('span', { class: 'kicker', 'data-t': 'r.areas' }), areas, btns].filter(Boolean));
      });
    }
    const WClose = () => close();



    /* ---------- keyboard: transport only (never note input, except the developer test mode) ---------- */
    function onKey(e) {
      if (W !== w || e.target.closest('input, textarea, select') || document.querySelector('.sheet-back')) return;
      const k = e.key;
      if (k === ' ') { e.preventDefault(); togglePause(); }
      else if (k === 'Escape') close();
      else if (k === 'ArrowUp' || k === 'ArrowDown') { e.preventDefault(); E.setTempo(Math.max(.3, Math.min(1.5, Math.round((S.tempo + (k === 'ArrowUp' ? .05 : -.05)) * 100) / 100))); }
      else if (devTouch() && (k === 'd' || k === 'u')) { PD.audio.ensure(); E.input({ kind: 'strum', src: 'touch', dir: k === 'u' ? 'up' : 'down', t: PD.audio.now() }); }
    }
    document.addEventListener('keydown', onKey);
    const ro = new ResizeObserver(() => relayout()); ro.observe(lanesBox); ro.observe(neckBox);

    /* ---------- frame loop: canvases every frame, DOM only when something changed ---------- */
    let fN = 0;
    const fps30 = PD.store.get('fps', 'auto') === '30';
    function frame(tm) {
      if (W !== w) return;
      w.raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (fps30 && tm - (w.lastDraw || 0) < 30) return; w.lastDraw = tm;
      const sg = stepSig(); if (sg !== w.sig) { w.sig = sg; step(); }
      lanes.draw(); neck.draw();
      if ((fN++ & 1) === 0) {
        const e = Math.max(1, E.endBeat()), x = Math.round(Math.min(1, E.visualNow() / e) * 100);
        if (x !== w.px) { w.px = x; progI.style.width = x + '%'; progN.textContent = x + '%'; }
        if (PD.detector.active) { lvl *= .9; micBars.childNodes.forEach((b, k) => { b.style.transform = 'scaleY(' + (.25 + Math.min(1, lvl * (1.3 - k * .18) + Math.sin(tm / (140 + k * 40)) * .04) * .75).toFixed(2) + ')'; }); }
      }
    }
    w.cleanup = () => {
      cancelAnimationFrame(w.raf); document.removeEventListener('keydown', onKey); ro.disconnect();
      offs.forEach(f => { try { f && f(); } catch (_) {} }); neck.destroy();
      S.autoDemo = prevAutoDemo; S.metro = w.prevMetro;
    };
    requestAnimationFrame(() => { if (W !== w) return; relayout(); gate(); sync(true); w.raf = requestAnimationFrame(frame);
      if (!w.rec && opts.autoplay) startWatch();
      else if (!w.rec && (PD.detector.active || devTouch())) setTimeout(() => { if (W === w && !S.playing) E.play(); }, 450);
    });
    return w;
  }

  function close(silent) {
    const w = W; if (!w) return;
    if (S.rec) E.stopRecord(false);
    if (!w.rec && S.lesson && w.stage) { const p = LS.progress.lesson(w.srcId); if (S.finished || S.now < .01) delete p.resume; else p.resume = { stage: w.stage, beat: S.lesson.id === w.srcId ? S.now : 0, at: Date.now() }; p.lastStage = w.stage; LS.progress.saveLesson(w.srcId, p); }
    E.stop(); if (S.drill) S.drill = null;
    PD.audio.ref.unload && PD.audio.ref.unload(); PD.media.unload();
    if (PD.detector.active && !PD.store.get('micStay', false)) PD.detector.stop();   // leaving practice releases the microphone
    w.cleanup && w.cleanup(); w.root.remove(); document.body.style.overflow = '';
    W = null;
    if (!silent && PD.app && PD.app.route === 'lesson') PD.app.render();
  }
  function record(l) { return open(l, { wait: false }, l.id, null, true); }
  /** the right-hand motion: a curved sweep across the three strings (no drawn hand) */
  function strokeSVG(up) {
    const d = up ? 'M30 54 C66 44 66 16 30 6' : 'M30 6 C66 16 66 44 30 54';
    return '<svg viewBox="0 0 80 60" aria-hidden="true"><g class="str"><line x1="4" x2="76" y1="16" y2="16"/><line x1="4" x2="76" y1="30" y2="30"/><line x1="4" x2="76" y1="44" y2="44"/></g><path class="trk" d="' + d + '"/><path class="flow" d="' + d + '"/></svg>';
  }
  return { open, close, record, summary, micOn, strokeSVG, get active() { return !!W; }, get screen() { return W && { neck: W.neck, lanes: W.lanes }; } };
})();
