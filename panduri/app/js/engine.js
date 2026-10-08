/* =====================================================================
   Lesson engine: musical transport (beats, anchored to audio time),
   WAIT / step / auto-pause, judging, scoring, practice drills,
   adaptive assistance and recording. Ticks on a timer, never on the
   render loop, so a slow GPU cannot change timing or recognition.
   ===================================================================== */
PD.i18n.add({
  'h.waitNote': ['ველოდები შენს ნოტას', 'Waiting for your note'],
  'h.waitChord': ['ველოდები აკორდს', 'Waiting for the chord'],
  'h.waitStroke': ['ველოდები დარტყმას', 'Waiting for your stroke'],
  'h.pressPlay': ['დააჭირე ▶ — გაკვეთილი დაიწყება და დაგელოდება', 'Press ▶ — the lesson starts and waits for you'],
  'h.early': ['ჯერ ადრეა — დაელოდე ნოტას ხაზთან', 'Too early — wait for the note to reach the line'],
  'h.sharp': ['ბგერა ოდნავ მაღალია ({c}¢).', 'The pitch is slightly high ({c}¢).'],
  'h.flat': ['ბგერა ოდნავ დაბალია ({c}¢).', 'The pitch is slightly low ({c}¢).'],
  'h.oneUp': ['ერთი ლადით დაბლა — ლადი {f}', 'One fret lower — fret {f}'],
  'h.oneDown': ['ერთი ლადით მაღლა — ლადი {f}', 'One fret higher — fret {f}'],
  'h.octUp': ['ოქტავით მაღლა ჟღერს — შეამოწმე ლადი.', 'An octave too high — check the fret.'],
  'h.octDown': ['ოქტავით დაბლა ჟღერს — შეამოწმე ლადი.', 'An octave too low — check the fret.'],
  'h.wrong': ['მოვისმინე {p} — გვჭირდება {e}', 'I heard {p} — we need {e}'],
  'h.otherString': ['სწორი ბგერაა, მაგრამ სხვა სიმზე — {s} სიმი, ლადი {f}', 'Right pitch on another string — {s} string, fret {f}'],
  'h.unsure': ['კარგად ვერ გავიგონე. კიდევ ერთხელ დაუკარი.', 'I didn’t hear that clearly. Play it once more.'],
  'h.sameString': ['სწორი სიმია, მაგრამ ლადი სხვაა — საჭიროა ლადი {f}.', 'Right string, different fret — fret {f} is needed.'],
  'h.rhythmOnly': ['რიტმი სწორია — ბგერა ვერ ამოვიცანი.', 'Rhythm is right — I could not identify the pitch.'],
  'h.ladderHold': ['ტემპი იგივე რჩება — {b} BPM', 'Holding the tempo — {b} BPM'], 'h.ladderDown': ['ცოტა შევანელოთ — {b} BPM', 'A little slower — {b} BPM'], 'h.ladderUp': ['სუფთაა — ახლა {b} BPM', 'Clean — now {b} BPM'],
  'h.okEarly': ['სწორი ნოტია — ოდნავ ადრე დაუკარი.', 'Right note — a little early.'],
  'h.okLate': ['{n} სწორია, ცოტა გვიან დაუკარი.', '{n} is right, a little late.'],
  'h.chordPart': ['აკორდში {n}/3 ბგერა დადასტურდა — შეამოწმე {s} სიმი.', '{n}/3 chord tones confirmed — check the {s} string.'],
  'h.chordCheck': ['შეამოწმე აკორდი — {c}', 'Check the chord — {c}'],
  'h.chordNo': ['აკორდი ვერ დადასტურდა — შეამოწმე თითები და ჩამოკარი სამივე სიმი.', 'Chord not confirmed — check your fingers and strum all three strings.'],
  'h.dir': ['დრო სწორია, მიმართულება: {d}', 'Timing is right; direction should be {d}'],
  'h.chordTouch': ['აკორდისთვის გამოიყენე ↓ / ↑ ღილაკი', 'Use the ↓ / ↑ buttons for chords'],
  'h.missed': ['გაჩერდა — დაუკარი {e}, რომ გავაგრძელოთ', 'Paused — play {e} to continue'],
  'h.tune': ['რამდენიმე ნოტი ერთნაირად აცდენილია — იქნებ ფანდური აწყობას საჭიროებს?', 'Several notes are off in the same direction — the panduri may need tuning'],
  'h.suggest': ['ვივარჯიშოთ ეს მონაკვეთი? {r} · {p}% ტემპით', 'Practice this section? {r} · {p}% tempo'],
  'h.drillUp': ['სტაბილურია — ტემპი {p}%', 'Stable — tempo up to {p}%'],
  'h.drillDone': ['მზად ხარ — ვუბრუნდებით სრულ გაკვეთილს', 'Ready — back to the full lesson'],
  'h.yourTurn': ['შენი ჯერია', 'Your turn'],
  'h.pitchCtx': ['ბგერა სწორია · სიმი გაკვეთილიდან', 'Pitch correct · string from lesson'],
  'h.recStart': ['ათვლის შემდეგ დაუკარი — მეტრონომი გეხმარება', 'Play after the count-in — the metronome guides you'],
  'h.perfect': ['ზუსტია', 'Perfect'], 'h.okEarlyMs': ['სწორი ნოტი — ცოტა ადრე დაუკარი', 'Right note — a little early'], 'h.okLateMs': ['სწორი ნოტი — ცოტა გვიან დაუკარი', 'Right note — a little late'],
  'h.shiftLate': ['ლადი {a} → {b} გადასვლა დაგაგვიანდა', 'The move from fret {a} to {b} came late'], 'h.accWeak': ['რიტმი სწორია — აქცენტი სუსტია', 'Rhythm right — the accent is weak'], 'h.accExtra': ['ეს დარტყმა აქცენტის გარეშეა — ჩვეულებრივად დაუკარი', 'This stroke has no accent — play it normally'],
  'h.extra': ['ზედმეტი დარტყმა', 'Extra stroke'], 'h.tempoUp': ['კარგია — სცადე ახლა {b} BPM', 'Good — now try {b} BPM'], 'h.tempoDown': ['ცოტა შევანელოთ — {b} BPM', 'Let’s slow down a little — {b} BPM'],
  'h.quiet': ['ძალიან ჩუმად ისმის — დაუკარი ოდნავ ძლიერად ან მიუახლოვდი', 'Very quiet — play a little stronger or move closer'], 'h.clip': ['მიკროფონი იტვირთება — ოდნავ მოშორდი', 'The microphone is overloading — move back a little'],
  'w.down': ['ჩაკვრა', 'down'], 'w.up': ['ამოკვრა', 'up'], 'w.bars': ['ტაქტები {a}–{b}', 'Bars {a}–{b}']
});

PD.engine = (() => {
  const TH = PD.theory, LS = PD.lessons;
  const EARLY = 0.32, LATE = 0.3, GOOD = 0.09, PERFECT = 0.04;
  const grade = off => off == null ? 'ok' : Math.abs(off) <= PERFECT ? 'perfect' : Math.abs(off) <= GOOD ? 'good' : off < 0 ? 'early' : 'late';
  const listeners = {};
  const emit = (k, v) => (listeners[k] || []).forEach(f => { try { f(v); } catch (e) { console.error(k, e); } });
  const S = {
    lesson: null, steps: [], cur: 0, now: 0, playing: false, waiting: false, ci: null, finished: false,
    mode: 'learn', wait: true, stepMode: false, autoPause: false, autoDemo: PD.store.get('autoDemo', false),
    tempo: .7, bpmOverride: 0, loop: { a: null, b: null, on: false }, metro: PD.store.get('metro', true), countIn: PD.store.get('countIn', true),
    input: 'touch', res: [], pass: null, passes: [], drill: null, lastWrong: -1, almostDir: [], suggestedBars: {}, rec: null,
    anchorBeat: 0, anchorTime: 0, nextClick: null, demo: null, startedAt: 0, assistOverride: PD.store.get('assist', 'auto'), lastHit: null
  };
  const clock = () => PD.audio.now();
  const bpm = () => S.bpmOverride || Math.round(S.lesson.bpm * S.tempo);
  const bps = () => bpm() / 60;
  const bpb = () => S.lesson ? LS.bpb(S.lesson) : 4;
  const waitEff = () => (S.wait || S.stepMode) && S.mode !== 'perform' && !S.rec && !S.autoplay;
  const endBeat = () => S.rec ? 1e9 : (S.steps.length ? Math.max(...S.steps.map(s => s.t + s.d)) : bpb());
  const reanchor = () => { S.anchorBeat = S.now; S.anchorTime = clock(); S.nextClick = Math.ceil(S.now - 1e-6); };
  /* ---------- time ↔ beats ----------
     A song carries a beat map (the moment every beat sounds in its recording; live music drifts a little).
     W(b) = song seconds (at 100 %) of beat b; without a map it is a straight line (steady tempo).
     The transport moves through song seconds at speed rf(), so clicks, visuals, judging and the recording
     all follow the same musical time. */
  function W(b) {
    const l = S.lesson, m = l && l.beatMap;
    if (m && m.length > 1) { const n = m.length; if (b <= 0) return m[0] + b * (m[1] - m[0]); if (b >= n - 1) return m[n - 1] + (b - n + 1) * (m[n - 1] - m[n - 2]); const k = Math.floor(b); return m[k] + (b - k) * (m[k + 1] - m[k]); }
    return (l && l.refOffset || 0) + b * 60 / (l ? l.bpm : 60);
  }
  function Wi(x) {
    const l = S.lesson, m = l && l.beatMap;
    if (m && m.length > 1) { const n = m.length; if (x <= m[0]) return (x - m[0]) / (m[1] - m[0]); if (x >= m[n - 1]) return n - 1 + (x - m[n - 1]) / (m[n - 1] - m[n - 2]); let lo = 0, hi = n - 1; while (hi - lo > 1) { const md = (lo + hi) >> 1; if (m[md] <= x) lo = md; else hi = md; } return lo + (x - m[lo]) / (m[lo + 1] - m[lo]); }
    return (x - (l && l.refOffset || 0)) * (l ? l.bpm : 60) / 60;
  }
  /** speed: 1 = the lesson's own tempo (a song plays at exactly the chosen percentage) */
  const rf = () => S.lesson && S.lesson.beatMap && !S.bpmOverride ? S.tempo : bpm() / S.lesson.bpm;
  const beatOf = (t, sp) => Wi(W(S.anchorBeat) + (t - S.anchorTime) * rf() * (sp || 1));
  const timeOf = (b, sp) => S.anchorTime + (W(b) - W(S.anchorBeat)) / (rf() * (sp || 1));
  /** seconds between two beats at the current speed */
  const secs = (b1, b2) => (W(b2) - W(b1)) / rf();
  const beatAt = audioT => S.waiting ? S.anchorBeat : beatOf(audioT);
  const MISS_GRACE = .22;   // a note is reported ~0.13 s after it starts; give the detector that time before calling it missed

  function hint(key, vars, cls, ms) { emit('hint', { key, vars, cls: cls || 'info', ms: ms || 0 }); }

  /* ---------- assistance level ---------- */
  function assist() {
    if (S.mode === 'perform') return 'performance';
    if (S.assistOverride !== 'auto') return S.assistOverride;
    const m = S.lesson ? LS.progress.lesson(S.lesson.id).mastery : 0;
    return m < .6 ? 'beginner' : m < .8 ? 'intermediate' : 'advanced';
  }
  const ASSIST = {
    beginner: { names: true, frets: true, fingers: true, hand: true, glow: 1, info: true, ghost: true },
    intermediate: { names: false, frets: true, fingers: true, hand: true, glow: .8, info: true, ghost: true },
    advanced: { names: false, frets: true, fingers: false, hand: false, glow: .45, info: false, ghost: false },
    performance: { names: false, frets: false, fingers: false, hand: false, glow: 0, info: false, ghost: false }
  };

  /** the assistance level's flags with the learner's explicit display settings applied on top */
  function flags() {
    const A = Object.assign({}, ASSIST[assist()]), o = k => PD.store.get(k, null);
    if (o('showNames') === false) A.names = false; else if (o('showNames') === true && S.mode !== 'perform') A.names = true;
    if (o('showFrets') === false) A.frets = false;
    return A;
  }

  /* ---------- lesson lifecycle ---------- */
  function load(lesson, opts) {
    stop(); S.rec = null;
    S.lesson = lesson; S.steps = LS.steps(lesson);
    S.res = S.steps.map(() => ({ attempts: 0, ok: false, first: false, pitchOk: false, partial: 0, off: null, missed: false, dir: null, heard: [] }));
    S.loop = { a: null, b: null, on: false }; S.passes = []; S.pass = null; S.drill = null; S.suggestedBars = {}; S.bpmOverride = 0; S.lastWrong = -1; S.almostDir = [];
    S.finished = false; S.now = 0; S.cur = 0; S.waiting = false; S.ci = null; S.autoplay = false; S.startedAt = 0; S.loadingRef = 0; S.stepMode = false; S.heatBars = {}; S.streak = 0; S.bestStreak = 0; S.extra = 0; S.onStr = [];
    if (opts) configure(opts);
    reanchor(); PD.audio.ref.unload(); PD.media.load(lesson); PD.samples.preload(lesson); S.tempoDowns = {};
    if (lesson.stems) PD.audio.ref.loadStems(lesson.stems); else if (lesson.refAudio) PD.audio.ref.load(lesson.refAudio);
    emit('load', lesson); emit('state');
  }
  function configure(o) {
    if (o.mode) S.mode = o.mode;
    if (o.wait != null) S.wait = !!o.wait;
    if (o.tempo) { S.tempo = o.tempo; S.bpmOverride = 0; }
    if (o.stepMode != null) S.stepMode = !!o.stepMode;
    if (o.autoPause != null) S.autoPause = !!o.autoPause;
    if (o.loop) S.loop = Object.assign({}, o.loop);
    if (o.autoplay != null) S.autoplay = !!o.autoplay;
    reanchor(); emit('state');
  }
  function seek(b) {
    S.now = Math.max(0, Math.min(b, endBeat())); S.waiting = false; S.ci = null; S.demo = null;
    S.steps.forEach((s, i) => { if (s.t >= S.now - 1e-6) S.res[i] = { attempts: 0, ok: false, first: false, pitchOk: false, partial: 0, off: null, missed: false, dir: null, heard: [] }; });
    S.cur = S.steps.findIndex(s => s.t >= S.now - 1e-6); if (S.cur < 0) S.cur = S.steps.length;
    reanchor(); expectFor(S.steps[S.cur]); emit('seek', S.now); emit('state');
  }
  function play() {
    if (!S.lesson) return;
    if (S.mayPlay && !S.autoplay && !S.mayPlay()) { emit('state'); return; }   // the screen says no (e.g. the microphone is not on yet): nothing starts, not even the count-in
    PD.audio.ensure();
    // a song recording must be decoded (and, for another tempo, stretched) before the music can start in step
    const L = S.lesson, hasRec = (L.stems || L.refAudio) && !S.rec && !S.stepMode;
    if (hasRec && !PD.audio.ref.ready(rf())) {
      if (S.loadingRef) return;
      const tok = S.loadingRef = Date.now(); emit('loadingRef', true);
      PD.audio.ref.whenReady(rf()).then(() => { if (S.loadingRef !== tok) return; S.loadingRef = 0; emit('loadingRef', false); if (S.lesson === L && !S.playing) play(); });
      return;
    }
    if (S.finished || (!S.rec && S.now >= endBeat())) { seek(S.loop.on ? S.loop.a : 0); S.finished = false; }
    S.playing = true; if (!S.startedAt) S.startedAt = Date.now();
    if (S.countIn && !S.stepMode || S.rec) startCountIn(); else reanchor();
    expectFor(S.steps[S.cur]);
    if (!S.pass) S.pass = { first: 0, total: 0, wrong: 0 };
    emit('state');
  }
  function startCountIn() {
    let n = S.lesson.countIn || bpb(); if (!(n >= 2 && n <= 6 && Number.isInteger(n))) n = 4;   // a whole bar, but never an odd or very long count
    const sp = Math.max(.15, secs(S.now, S.now + 1)), t0 = clock() + .12;
    S.ci = { t0, n, sp, shown: -1 };
    const times = []; for (let i = 0; i < n; i++) { const tt = t0 + i * sp; if (S.metro || S.rec) PD.audio.click(tt, i === 0); times.push(tt); }
    PD.detector.guard(times);
  }
  function stop() { S.playing = false; S.ci = null; if (S.loadingRef) { S.loadingRef = 0; emit('loadingRef', false); } emit('state'); }
  function endCountIn() { if (!S.ci) return; S.anchorTime = S.ci.t0 + S.ci.n * S.ci.sp; S.anchorBeat = S.now; S.nextClick = Math.ceil(S.now - 1e-6); S.ci = null; emit('count', 0); }
  function toggle() { S.playing ? stop() : play(); }
  function restart() { seek(S.loop.on ? S.loop.a : 0); S.passes = []; S.pass = { first: 0, total: 0, wrong: 0 }; S.extra = 0; S.streak = 0; S.bestStreak = 0; S.heatBars = {}; S.onStr = []; S.startedAt = 0; if (!S.playing) play(); }

  /* ---------- transport tick (timer-driven) ---------- */
  function tick() {
    if (!S.lesson) return;
    const now = clock();
    if (S.ci) {
      const k = Math.floor((now - S.ci.t0) / S.ci.sp);
      if (k !== S.ci.shown && k >= 0 && k < S.ci.n) { S.ci.shown = k; emit('count', k + 1); }
      const end = S.ci.t0 + S.ci.n * S.ci.sp;
      // the recording is scheduled to begin exactly where the count-in ends
      PD.audio.ref.sync(W(S.now), end, rf(), !S.stepMode);
      if (now >= end) endCountIn();
      return;
    }
    if (!S.playing) { PD.audio.ref.sync(0, 0, 1, false); PD.media.sync(S.now / (S.lesson.bpm / 60), 1, false); return; }
    if (!S.waiting) {
      const speed = S.stepMode && !S.waiting ? 2.5 : 1;
      let next = beatOf(now, speed);
      const st = S.steps[S.cur];
      if (st && waitEff() && st.wait !== false && next >= st.t) { next = st.t; S.now = next; enterWait(st); }
      else S.now = next;
      scheduleClicks();
      if (S.autoplay) autoPass(); else if (!waitEff() || (S.steps[S.cur] && S.steps[S.cur].wait === false)) missPass();
      if (S.loop.on && S.loop.b != null && S.now >= S.loop.b) { endPass(); seek(S.loop.a); S.pass = { first: 0, total: 0, wrong: 0 }; }
      else if (!S.rec && S.now >= endBeat() && S.cur >= S.steps.length) finish();
    }
    const live = S.playing && !S.waiting && !S.ci && !S.stepMode;
    PD.audio.ref.sync(W(S.now), now, rf(), live);
    PD.media.sync(S.now / (S.lesson.bpm / 60), bpm() / S.lesson.bpm, live);
  }
  function scheduleClicks() {
    if (!S.metro && !S.rec) return;
    const sp = S.stepMode ? 2.5 : 1, ahead = .12, limit = beatOf(clock() + ahead, sp);
    const st = S.steps[S.cur], stop = waitEff() && st ? st.t + 1e-6 : 1e9, times = [];
    while (S.nextClick != null && S.nextClick <= limit && S.nextClick <= stop) {
      const at = timeOf(S.nextClick, sp);
      if (at >= clock() - .01) { PD.audio.click(at, S.nextClick % bpb() === 0); times.push(at); }
      S.nextClick++;
    }
    if (times.length) PD.detector.guard(times);
  }
  function enterWait(st) {
    S.waiting = true; S.anchorBeat = S.now; S.anchorTime = clock();
    expectFor(st);
    const key = st.kind === 'note' ? 'h.waitNote' : st.kind === 'chord' ? 'h.waitChord' : 'h.waitStroke';
    emit('wait', st); hint(key, null, 'info');
    if (S.autoDemo || S.stepMode && S.autoDemo) showMe();
  }
  function expectFor(st) {
    if (!st || st.kind === 'note') { PD.detector.expect(null); return; }
    PD.detector.expect(st.notes.map(n => TH.freq(TH.midi(n.s, n.f))));
  }
  function release() {
    S.waiting = false; S.cur++; S.anchorBeat = S.now; S.anchorTime = clock(); S.nextClick = Math.ceil(S.now + 1e-6);
    const nx = S.steps[S.cur]; expectFor(nx);
  }
  function missPass() {
    let st = S.steps[S.cur];
    while (st && secs(st.t, S.now) > LATE + MISS_GRACE) {
      if (S.autoPause) { S.now = st.t; S.waiting = true; S.anchorBeat = S.now; S.anchorTime = clock(); hint('h.missed', { e: label(st) }, 'fix', 4000); return; }
      missOne(st); st = S.steps[S.cur];
    }
  }
  function missOne(st) {
    const r = S.res[st.i]; r.missed = true; r.attempts++; S.cur++; S.streak = 0; if (S.pass) { S.pass.total++; S.pass.wrong++; }
    markWrong(st); emit('miss', st); expectFor(S.steps[S.cur]);
  }
  /** listen mode: the app plays every step itself; nothing is scored */
  function autoPass() {
    let st = S.steps[S.cur];
    while (st && S.now >= st.t) {
      const rec = (S.lesson.stems || S.lesson.refAudio) && PD.audio.ref.key && !PD.audio.ref.error;   // a song with its recording: the recording is the sound
      if (rec) {} else if (st.kind === 'note') PD.audio.note(st.notes[0].s, st.notes[0].f, { vel: st.acc ? .85 : .65 });
      else PD.audio.strum(st.frets, st.st, { vel: st.acc ? 1 : .55, gap: st.acc ? .011 : .02 });   // accent: stronger attack
      S.res[st.i].ok = true; emit('hit', { st, r: { res: 'ok', auto: true } }); S.cur++; st = S.steps[S.cur];
    }
  }
  function label(st) { return st.kind === 'note' ? TH.name(TH.midi(st.notes[0].s, st.notes[0].f)) + ' (' + TH.stringName(st.notes[0].s) + ' · ' + st.notes[0].f + ')' : (st.name || 'A') + ' ' + (st.st === 'up' ? '↑' : '↓'); }

  /* ---------- input + judging ---------- */
  function target(inp) {
    const st = S.steps[S.cur]; if (!st) return null;
    if (S.waiting) return st;
    // WAIT: the right note played a little ahead of the line is accepted (the timeline steps forward to it)
    if (waitEff() && st.wait !== false) { const dt = secs(S.now, st.t); return dt <= Math.min(1.2, Math.max(EARLY, secs(st.t - 1, st.t))) ? st : null; }
    // continuous: judge by when the sound happened (events arrive a little after the sound), nearest step wins
    const tb = inp && inp.t ? beatOf(inp.t) : S.now;
    let best = -1, bd = 1e9;
    for (let i = S.cur; i < S.steps.length; i++) {
      const dt = secs(tb, S.steps[i].t);           // > 0: the step is still ahead of the sound
      if (dt > EARLY) break;
      if (dt >= -LATE && Math.abs(dt) < bd) { bd = Math.abs(dt); best = i; }
    }
    if (best < 0) return null;
    while (S.cur < best) missOne(S.steps[S.cur]);   // steps skipped over were not played
    return S.steps[best];
  }
  /** inp: {kind:'note'|'chord'|'strum'|'onset', src:'mic'|'touch', midi?, cents?, conf?, s?, f?, dir?, present?, t (audio time)} */
  function input(inp) {
    // the real panduri (microphone) is the only learner input; touch exists only in the developer test mode
    if (inp.src === 'touch' && !PD.store.get('devTouch', false)) return;
    emit('raw', inp);
    if (S.rec) { recordInput(inp); return; }
    if (!S.lesson || !S.playing) { if (inp.src === 'touch') hint('h.pressPlay', null, 'info', 1800); return; }
    if (S.ci) { if (inp.t && inp.t >= S.ci.t0 + S.ci.n * S.ci.sp - EARLY) endCountIn(); else return; }   // a stroke just before the first beat counts
    if (S.demo && inp.src === 'mic') return;   // the app is playing an example — that is not the learner
    // playing along with a recording: the chord check belongs to the stroke it was measured on (that stroke has usually been counted already)
    if (S.lesson.song && !waitEff() && inp.src === 'mic' && inp.kind === 'chord') { songChord(inp); return; }
    const st = target(inp);
    if (!st) {
      if (inp.src === 'touch' && inp.kind !== 'onset') hint('h.early', null, 'info', 1200);
      // continuous strum lessons: a stroke between written strokes is an extra stroke (counted, briefly noted)
      if (inp.src === 'mic' && inp.kind === 'onset' && !waitEff() && (S.lesson.song || S.steps.some(x => x.kind === 'strum'))) { S.extra = (S.extra || 0) + 1; emit('extra', inp); if (!S.lastExtraHint || performance.now() - S.lastExtraHint > 2500) { S.lastExtraHint = performance.now(); hint('h.extra', null, 'almost', 1200); } }
      return;
    }
    const songFlow = S.lesson.song && !waitEff() && st.kind === 'chord';   // playing along with a recording: strokes are timed by onset, the chord is checked alongside
    if (inp.src === 'mic' && inp.kind === 'note' && st.kind !== 'note') return;   // chords are judged by the chord detector
    if (inp.src === 'mic' && inp.kind === 'chord' && (st.kind !== 'chord' || (inp.t - (S.lastAcceptT || -9)) < .14)) return;
    if (inp.src === 'mic' && inp.kind === 'onset' && st.kind !== 'strum' && !songFlow) return;
    const r = judge(st, inp), res = S.res[st.i];
    if (r.res === 'unsure') {
      // a low-confidence read is never a mistake. In continuous play the onset still tells us the timing.
      if (!waitEff() && inp.src === 'mic' && inp.kind === 'note' && st.kind === 'note' && inp.t && (inp.conf || 0) > .2) {
        res.unsure = true; res.off = secs(st.t, beatAt(inp.t)); S.cur = st.i + 1; expectFor(S.steps[S.cur]);
        hint('h.rhythmOnly', null, 'unsure', 1800); emit('unsure', { st }); return;
      }
      hint('h.unsure', null, 'unsure', 2200); emit('unsure', { st }); return;
    }
    res.attempts++; res.heard.push(r.heard || null);
    if (r.res === 'ok' || r.res === 'partial') {
      const beat = beatAt(inp.t || clock());
      if (waitEff() && st.wait !== false && !S.waiting && S.now < st.t) { S.now = st.t; reanchor(); }
      S.lastAcceptT = inp.t || clock(); res.ok = true; res.pitchOk = r.pitchOk !== false; res.first = res.attempts === 1; res.partial = r.partial || 0;
      res.dir = r.dir == null ? null : r.dir;
      const timed = !waitEff() || st.wait === false;
      res.off = timed ? secs(st.t, beat) : null; res.grade = grade(res.off); if (r.accOk != null) res.accOk = r.accOk;
      S.streak = res.first ? (S.streak || 0) + 1 : 0; S.bestStreak = Math.max(S.bestStreak || 0, S.streak || 0);
      if (S.pass) { S.pass.total++; if (res.first) S.pass.first++; }
      const prevSt = S.steps[st.i - 1], pf = prevSt && prevSt.kind === 'note' ? prevSt.notes[0].f : null, cf = st.kind === 'note' ? st.notes[0].f : null;
      if (timed && res.off != null && res.off > GOOD && r.res === 'ok' && pf != null && cf != null && pf !== cf && pf > 0 && cf > 0) hint('h.shiftLate', { a: pf, b: cf }, 'almost', 1800);
      else if (timed && res.off != null && Math.abs(res.off) > GOOD && r.res === 'ok') hint(res.off < 0 ? 'h.okEarlyMs' : 'h.okLateMs', { ms: Math.round(Math.abs(res.off) * 1000) }, 'almost', 1600);
      else if (r.accOk === false) hint(st.acc ? 'h.accWeak' : 'h.accExtra', null, 'almost', 1700);
      else if (r.res === 'partial') hint('h.chordPart', r.vars, 'almost', 2200);
      else if (r.ctx) hint('h.pitchCtx', null, 'ok', 1100);
      else emit('clearHint');
      S.almostDir = [];
      S.lastHit = { i: st.i, at: performance.now() };
      emit('hit', { st, r });
      if (S.waiting) { release(); if (PD.store.get('autoAdvance', true) === false && S.cur < S.steps.length) stop(); } else { S.cur = st.i + 1; expectFor(S.steps[S.cur]); }
      return;
    }
    // wrong / almost
    S.lastWrong = st.i;
    if (!waitEff() && r.res === 'almost' && r.advance) { res.ok = false; S.cur = st.i + 1; expectFor(S.steps[S.cur]); if (S.pass) { S.pass.total++; S.pass.wrong++; } }
    if (S.pass) S.pass.wrong++;
    S.streak = 0;
    markWrong(st);
    if (r.dirC) { S.almostDir.push(r.dirC); if (S.almostDir.length >= 3 && S.almostDir.slice(-3).every(x => x === r.dirC)) { hint('h.tune', null, 'almost', 4000); S.almostDir = []; emit('wrong', { st, r }); return; } }
    hint(r.key, r.vars, r.res === 'almost' ? 'almost' : 'fix', 2600);
    emit('wrong', { st, r });
  }
  function songChord(inp) {
    const tb = inp.t ? beatOf(inp.t) : S.now; let st = null, bd = 1e9;
    for (let i = Math.max(0, S.cur - 4); i < Math.min(S.steps.length, S.cur + 2); i++) { const d = Math.abs(secs(tb, S.steps[i].t)); if (d < bd) { bd = d; st = S.steps[i]; } }
    if (!st || st.kind !== 'chord' || bd > LATE + .08) return;
    // the detector measured against the chord expected at the moment of the stroke; skip if that was another chord
    const want = st.notes.map(n => Math.round(TH.freq(TH.midi(n.s, n.f)))).join(','), got = (inp.exp || []).map(Math.round).join(',');
    if (inp.exp && want !== got) return;
    const n = (inp.present || []).filter(Boolean).length; S.chordSeen = { i: st.i, n };
    if (n < 2 && (!S.lastChordHint || performance.now() - S.lastChordHint > 2600)) { S.lastChordHint = performance.now(); hint('h.chordCheck', { c: st.name }, 'almost', 1800); }
  }
  function judge(st, inp) {
    const n0 = st.notes[0];
    if (st.kind === 'note') {
      const exp = TH.midi(n0.s, n0.f);
      if (inp.kind !== 'note') return inp.src === 'touch' ? { res: 'wrong', key: 'h.wrong', vars: { p: '—', e: TH.name(exp), s: TH.stringName(n0.s), f: n0.f } } : { res: 'unsure' };
      if (inp.src === 'mic' && (inp.unsure || inp.conf < .55)) return { res: 'unsure' };
      const diff = inp.midi - exp, c = diff * 100, tol = st.tol || PD.store.get('tolCents', 35);
      const heard = { midi: inp.midi, conf: inp.conf, s: inp.s, f: inp.f };
      if (Math.abs(c) <= tol) {
        if (inp.src === 'touch' && inp.s !== n0.s) return { res: 'almost', key: 'h.otherString', vars: { s: TH.stringName(n0.s), f: n0.f }, heard, pitchOk: true };
        const ambiguous = TH.positions(exp).length > 1;
        return { res: 'ok', pitchOk: true, ctx: inp.src === 'mic' && ambiguous, heard };
      }
      if (Math.abs(c) <= 70) return { res: 'almost', key: c > 0 ? 'h.sharp' : 'h.flat', vars: { c: (c > 0 ? '+' : '') + Math.round(c) }, heard, dirC: c > 0 ? 1 : -1, advance: true };
      if (Math.abs(Math.abs(diff) - 1) < .35) return { res: 'almost', key: diff > 0 ? 'h.oneUp' : 'h.oneDown', vars: { f: n0.f, e: TH.name(exp) }, heard };
      if (inp.src === 'touch' && inp.s === n0.s) return { res: 'wrong', key: 'h.sameString', vars: { f: n0.f }, heard };
      if (Math.abs(Math.abs(diff) - 12) < .35) return inp.src === 'mic' && inp.conf < .8 ? { res: 'unsure' } : { res: 'wrong', key: diff > 0 ? 'h.octUp' : 'h.octDown', heard };
      if (inp.src === 'mic' && inp.conf < .75) return { res: 'unsure' };
      return { res: 'wrong', key: 'h.wrong', vars: { p: TH.name(inp.midi), e: TH.name(exp), s: TH.stringName(n0.s), f: n0.f }, heard };
    }
    // chord / strum steps
    if (inp.kind === 'note') return inp.src === 'touch' ? { res: 'almost', key: 'h.chordTouch' } : { res: 'unsure' };
    if (inp.kind === 'strum') {   // touch: direction is known; fingering is not
      if (inp.dir && inp.dir !== st.st) return { res: 'almost', key: 'h.dir', vars: { d: (st.st === 'down' ? '↓ ' : '↑ ') + t(st.st === 'down' ? 'w.down' : 'w.up') }, dir: false };
      return { res: 'ok', dir: true, pitchOk: true };
    }
    if (inp.kind === 'onset') {
      // mic: timing from the onset; accent from its strength relative to this player's recent strokes; direction is not measurable from sound
      const hist = S.onStr || (S.onStr = []), str = inp.strength || 0;
      let accOk = null;
      if (hist.length >= 3 && str) { const m = hist.slice().sort((a, b) => a - b)[hist.length >> 1], heard = str > m * 1.35; accOk = heard === !!st.acc; }
      if (str) { hist.push(str); if (hist.length > 10) hist.shift(); }
      return { res: 'ok', pitchOk: null, dir: null, accOk };
    }
    if (inp.kind === 'chord') {
      const pres = inp.present || [], n = pres.filter(Boolean).length, need = st.notes.length || 3;
      if (n >= need) return { res: 'ok', pitchOk: true, partial: 1 };
      if (need >= 3 && n === need - 1) { const miss = pres.findIndex(p => !p); return { res: 'partial', pitchOk: true, partial: n / need, vars: { n, s: TH.stringName(st.notes[miss] ? st.notes[miss].s : miss + 1) } }; }
      return { res: 'wrong', key: 'h.chordNo' };
    }
    return { res: 'unsure' };
  }
  function markWrong(st) {
    const bar = Math.floor(st.t / bpb()), heat = S.heatBars || (S.heatBars = {});
    heat[bar] = (heat[bar] || 0) + 1;
    maybeSuggest(bar);
  }
  function maybeSuggest(bar) {
    if (S.drill || S.loop.on || S.mode === 'perform' || S.suggestedBars[bar] || (S.lesson && S.lesson.song)) return;
    const h = S.heatBars, n = (h[bar] || 0) + (h[bar - 1] || 0);
    if (n >= 3) {
      S.suggestedBars[bar] = 1;
      const a = Math.max(0, bar - (h[bar - 1] ? 1 : 0)) * bpb(), b = Math.min(Math.ceil(endBeat() / bpb()), bar + 1) * bpb();
      const tp = Math.max(.4, Math.round((S.tempo - .2) * 10) / 10);
      emit('suggest', { a, b, tempo: tp, label: t('w.bars', { a: a / bpb() + 1, b: b / bpb() }) });
    }
  }

  /** remember where the learner lowered the tempo (a difficulty signal for smart practice) */
  function noteTempo(b0) { if (!S.lesson || S.drill || !b0 || bpm() >= b0) return; const bar = Math.floor(S.now / bpb()); S.tempoDowns = S.tempoDowns || {}; S.tempoDowns[bar] = (S.tempoDowns[bar] || 0) + 1; }

  /* ---------- show me / demos ---------- */
  function showMe(st) {
    st = st || S.steps[S.cur]; if (!st) return;
    S.demo = { i: st.i, t0: performance.now(), dur: 1400 };
    const when = PD.audio.now() + .9;
    if (st.kind === 'note') PD.audio.note(st.notes[0].s, st.notes[0].f, { when, vel: .7 });
    else PD.audio.strum(st.frets, st.st, { when, gap: st.acc ? .04 : .055, vel: st.acc ? 1 : .55 });
    emit('demo', st);
    setTimeout(() => { if (S.demo && S.demo.i === st.i) { S.demo = null; hint('h.yourTurn', null, 'info', 1600); emit('state'); } }, 2300);
  }

  /* ---------- passes, drills, results ---------- */
  function endPass() {
    if (!S.pass || !S.pass.total) return;
    const p = Math.round(100 * S.pass.first / S.pass.total);
    S.passes.push(p); S.passes = S.passes.slice(-8); emit('pass', p);
    if (S.drill && S.drill.ladder) {
      const L = S.drill.ladder, n = S.passes.length;
      if (n >= 2 && S.passes[n - 1] >= L.thr && S.passes[n - 2] >= L.thr) {
        if (L.bpm < L.to) { L.bpm = Math.min(L.to, L.bpm + L.step); S.bpmOverride = L.bpm; reanchor(); S.passes = []; hint('h.ladderUp', { b: L.bpm }, 'ok', 2600); emit('ladder', L); emit('state'); }
        else endDrill(true);
      } else if (p < L.low) {
        const nb = Math.max(L.from, L.bpm - L.step);
        if (nb < L.bpm) { L.bpm = nb; S.bpmOverride = nb; reanchor(); S.passes = []; hint('h.ladderDown', { b: nb }, 'info', 2600); emit('ladder', L); emit('state'); }
        else hint('h.ladderHold', { b: L.bpm }, 'info', 1800);
      } else hint('h.ladderHold', { b: L.bpm }, 'info', 1600);
      return;
    }
    // smart tempo while looping a section: three clean passes → +5 BPM; two weak ones → −5 BPM
    if (!S.drill && S.loop.on && S.smartTempo !== false && S.mode !== 'perform') {
      const n = S.passes.length, max = Math.round(S.lesson.bpm * 1.25);
      if (n >= 3 && S.passes.slice(-3).every(x => x >= 90) && bpm() + 5 <= max) { S.bpmOverride = bpm() + 5; reanchor(); S.passes = []; hint('h.tempoUp', { b: S.bpmOverride }, 'ok', 2600); emit('state'); }
      else if (n >= 2 && S.passes.slice(-2).every(x => x < 60) && bpm() - 5 >= 30) { S.bpmOverride = bpm() - 5; reanchor(); S.passes = []; hint('h.tempoDown', { b: S.bpmOverride }, 'info', 2600); emit('state'); }
    }
    if (S.drill) {
      const n = S.passes.length;
      if (n >= 2 && S.passes[n - 1] >= 90 && S.passes[n - 2] >= 90) {
        if (S.tempo + 1e-6 < S.drill.goalTempo) { S.tempo = Math.min(S.drill.goalTempo, Math.round((S.tempo + .1) * 10) / 10); S.passes = []; hint('h.drillUp', { p: Math.round(S.tempo * 100) }, 'ok', 2600); emit('state'); }
        else endDrill(true);
      }
    }
  }
  function drill(a, b, opts) {
    S.drill = { prev: { tempo: S.tempo, wait: S.wait, mode: S.mode, loop: Object.assign({}, S.loop), bpmOverride: S.bpmOverride }, goalTempo: S.tempo, a, b };
    if (S.mode === 'perform') S.mode = opts && opts.wait ? 'learn' : 'practice';   // a drill is practice: waiting, help and a count-in
    if (opts && opts.ladder) { const L = opts.ladder; S.drill.ladder = { from: L.from, bpm: L.from, step: L.step || 6, to: L.to, thr: L.thr || 90, low: L.low || 70 }; S.bpmOverride = L.from; }
    else { S.tempo = opts && opts.tempo || Math.max(.4, S.tempo - .2); }
    if (opts && opts.wait) S.wait = true;
    S.loop = { a, b, on: true }; S.passes = []; seek(a); S.pass = { first: 0, total: 0, wrong: 0 };
    emit('drill', S.drill); if (!S.playing && !(opts && opts.noPlay)) play();
  }
  function endDrill(done) {
    const d = S.drill; if (!d) return; S.drill = null;
    S.tempo = d.prev.tempo; S.wait = d.prev.wait; if (d.prev.mode) S.mode = d.prev.mode; S.loop = d.prev.loop; S.bpmOverride = d.prev.bpmOverride || 0; if (!S.loop.on) S.loop = { a: null, b: null, on: false };
    if (done) hint('h.drillDone', null, 'ok', 3000);
    seek(0); emit('drill', null); emit('state');
  }
  function loopBars(a, b) { S.loop = { a, b, on: true }; S.passes = []; seek(a); S.pass = { first: 0, total: 0, wrong: 0 }; emit('state'); if (!S.playing) play(); }
  function repeatMeasure() { const b = Math.floor(S.now / bpb()); loopBars(b * bpb(), (b + 1) * bpb()); }
  function repeatPhrase() { const s = sectionAt(S.now); loopBars(s.from, s.to); }
  function repeatMistake() { if (S.lastWrong < 0) return false; const b = Math.floor(S.steps[S.lastWrong].t / bpb()); loopBars(b * bpb(), (b + 1) * bpb()); return true; }
  function sectionAt(b) { const ss = S.lesson.sections; return ss.find(x => b >= x.from && b < x.to) || ss[ss.length - 1] || { from: 0, to: endBeat(), name: { ka: '', en: '' } }; }

  function results() {
    const steps = S.steps, res = S.res, n = Math.max(1, res.filter(r => r.attempts > 0 || r.missed || r.ok).length);   // only steps that were reached
    const judged = res.filter(r => r.attempts > 0 || r.missed);
    const firstTry = res.filter(r => r.first).length / n;
    const attempts = res.reduce((a, r) => a + r.attempts, 0) || 1;
    const heardN = res.reduce((a, r) => a + r.heard.filter(h => h).length, 0);
    const heardOk = res.filter(r => r.ok && r.pitchOk && r.heard.length && r.heard[r.heard.length - 1]).length;
    const pitchAcc = heardN ? heardOk / heardN : null;
    const offs = res.filter(r => r.off != null).map(r => r.off);
    let timing = null, rhythm = null, consistency = null, median = null, early = 0, late = 0;
    if (offs.length >= 2) {
      timing = offs.filter(o => Math.abs(o) <= GOOD).length / offs.length;
      const s = offs.slice().sort((a, b) => a - b); median = s[Math.floor(s.length / 2)];
      early = offs.filter(o => o < -GOOD).length; late = offs.filter(o => o > GOOD).length;
      const mean = offs.reduce((a, b) => a + b, 0) / offs.length; consistency = Math.sqrt(offs.reduce((a, o) => a + (o - mean) * (o - mean), 0) / offs.length);
      // rhythm: inter-onset intervals vs written intervals
      let ok = 0, tot = 0;
      for (let i = 1; i < steps.length; i++) { const a = res[i - 1], b = res[i]; if (a.off == null || b.off == null) continue; const written = secs(steps[i - 1].t, steps[i].t); const played = written + (b.off - a.off); tot++; if (Math.abs(played - written) <= Math.max(.06, written * .15)) ok++; }
      rhythm = tot ? ok / tot : null;
    }
    const missed = res.filter(r => r.missed).length, repeated = res.filter(r => r.attempts >= 3).length;
    const chordSteps = steps.filter(s => s.kind !== 'note').map(s => res[s.i]).filter(r => r.ok);
    const chordComp = chordSteps.length && chordSteps.some(r => r.partial) ? chordSteps.reduce((a, r) => a + (r.partial || 1), 0) / chordSteps.length : null;
    const dirs = res.filter(r => r.dir != null); const dirAcc = dirs.length ? dirs.filter(r => r.dir).length / dirs.length : null;
    // heat per bar: 2 = mastered, 1 = inconsistent, 0 = needs practice, -1 = not played
    const nb = Math.max(1, Math.ceil(endBeat() / bpb())), heat = [];
    for (let b = 0; b < nb; b++) {
      const idx = steps.filter(s => s.t >= b * bpb() && s.t < (b + 1) * bpb()).map(s => s.i);
      const rr = idx.map(i => res[i]).filter(r => r.attempts > 0 || r.missed);
      if (!rr.length) { heat.push(-1); continue; }
      const f = rr.filter(r => r.first).length / rr.length;
      heat.push(f >= .9 ? 2 : f >= .6 ? 1 : 0);
    }
    const secAcc = S.lesson.sections.map(sc => { const rr = steps.filter(s => s.t >= sc.from && s.t < sc.to).map(s => res[s.i]); return { sc, acc: rr.length ? rr.filter(r => r.first).length / rr.length : 1 }; });   // (not "secs": that is the beat→seconds function)
    const best = secAcc.slice().sort((a, b) => b.acc - a.acc)[0], worst = secAcc.slice().sort((a, b) => a.acc - b.acc)[0];
    const unsure = res.filter(r => r.unsure).length;
    // pitch stability: spread (cents) of correctly identified mic notes around their target
    const devs = []; steps.forEach(s => { const r = res[s.i]; if (s.kind !== 'note' || !r.ok) return; const h = r.heard[r.heard.length - 1]; if (h && h.midi != null && h.conf != null && h.conf < 1) devs.push((h.midi - TH.midi(s.notes[0].s, s.notes[0].f)) * 100); });
    const pitchSpread = devs.length >= 3 ? Math.sqrt(devs.reduce((a, d) => a + d * d, 0) / devs.length) : null;
    const grades = { perfect: 0, good: 0, early: 0, late: 0 }; res.forEach(r => { if (r.grade && grades[r.grade] != null) grades[r.grade]++; });
    const correct = res.filter(r => r.ok).length, accs = res.filter(r => r.accOk != null), accAcc = accs.length ? accs.filter(r => r.accOk).length / accs.length : null;
    const errors = steps.filter(s => res[s.i].missed || res[s.i].attempts > 1 || (res[s.i].ok && !res[s.i].first)).map(s => ({ t: s.t, i: s.i, missed: !!res[s.i].missed }));
    // areas to improve: concrete, from this run only
    const areas = [];
    if (worst && worst.acc < .85) areas.push({ key: 'r.aSection', vars: { s: PD.i18n.pick(worst.sc.name) }, sc: worst.sc });
    if (late > early && late >= 2) areas.push({ key: 'r.aLate' }); else if (early > late && early >= 2) areas.push({ key: 'r.aEarly' });
    if (accAcc != null && accAcc < .8) areas.push({ key: 'r.aAccent' });
    if ((S.extra || 0) >= 2) areas.push({ key: 'r.aExtra', vars: { n: S.extra } });
    const shifts = []; for (let i = 1; i < steps.length; i++) { const a = steps[i - 1], b = steps[i], rb = res[i]; if (a.kind === 'note' && b.kind === 'note' && a.notes[0].f !== b.notes[0].f && (rb.missed || rb.attempts > 1 || (rb.off != null && rb.off > GOOD))) shifts.push(a.notes[0].f + '→' + b.notes[0].f); }
    if (shifts.length) { const c = {}; shifts.forEach(x => c[x] = (c[x] || 0) + 1); const top = Object.keys(c).sort((x, y) => c[y] - c[x])[0]; areas.push({ key: 'r.aShift', vars: { t: top } }); }
    const offsets = steps.map(s => ({ t: s.t, off: res[s.i].off, missed: !!res[s.i].missed }));
    return { offsets, grades, correct, bestStreak: S.bestStreak || 0, accAcc, extra: S.extra || 0, errors, areas, unsure, pitchSpread, firstTry, pitchAcc, timing, rhythm, consistency, median, early, late, missed, repeated, chordComp, dirAcc, heat, best, worst, tempo: bpm(), tempoPct: Math.round(bpm() / S.lesson.bpm * 100), waited: waitEff() && offs.length < 2, notes: steps.length, attempts, input: S.input };
  }
  function finish() {
    stop(); S.finished = true;
    if (S.autoplay) { emit('end', null); return; }
    endPass();
    const r = results(), id = S.lesson.id, p = LS.progress.lesson(id), sid = S.lesson.derived || id;
    p.plays++; p.last = Date.now();
    const wasM = (p.mastery || 0) >= .9;
    p.mastery = p.mastery ? p.mastery * .6 + r.firstTry * .4 : r.firstTry;
    if (!wasM && p.mastery >= .9 && S.input === 'mic') setTimeout(() => PD.bus.emit('mastered', S.lesson.id), 0);
    if (!r.waited && r.firstTry >= .85) p.maxTempo = Math.max(p.maxTempo || 0, r.tempoPct);
    if (!p.best || r.firstTry > p.best.firstTry) p.best = { firstTry: r.firstTry, timing: r.timing, date: Date.now() };
    p.heat = r.heat; p.stages = p.stages || {};
    // per-bar history for smart practice: second attempts, misses, timing spread, tempo reductions
    const bars = p.bars || {}, bb = bpb();
    S.steps.forEach(s => { const rr = S.res[s.i], k = Math.floor(s.t / bb), o = bars[k] || (bars[k] = { n: 0, second: 0, miss: 0, offs: [], down: 0 }); if (!(rr.attempts || rr.missed || rr.ok)) return; o.n++; if (rr.attempts > 1 || (rr.ok && !rr.first)) o.second++; if (rr.missed) o.miss++; if (rr.off != null) { o.offs.push(+rr.off.toFixed(3)); if (o.offs.length > 40) o.offs.shift(); } });
    Object.keys(S.tempoDowns || {}).forEach(k => { const o = bars[k] || (bars[k] = { n: 0, second: 0, miss: 0, offs: [], down: 0 }); o.down += S.tempoDowns[k]; });
    p.bars = bars;
    const stage = S.mode === 'perform' ? 'perform' : S.stepMode ? 'guided' : r.waited ? 'wait' : S.drill || S.loop.on ? 'phrase' : 'slow';
    p.stages[stage] = Math.max(p.stages[stage] || 0, Math.round(r.firstTry * 100));
    LS.progress.saveLesson(id, p);
    // problem frets: wrong attempts by (string, fret)
    const probs = {}; S.steps.forEach(s => { const rr = S.res[s.i]; if (rr.attempts > 1 || rr.missed) s.notes.forEach(nn => { const k = nn.s + ':' + nn.f; probs[k] = (probs[k] || 0) + 1; }); });
    LS.progress.addSession({ id: sid, date: Date.now(), dur: S.startedAt ? Math.round((Date.now() - S.startedAt) / 1000) : 0, firstTry: r.firstTry, pitch: r.input === 'mic' ? r.pitchAcc : null, pitchSpread: r.pitchSpread, timing: r.timing, consistency: r.consistency, bpm: r.tempo, tempo: r.tempoPct, mode: S.mode, waited: r.waited, probs, correct: r.correct, notes: r.notes, accAcc: r.accAcc, input: r.input, rhythm: !!S.lesson.rhythm || S.steps.every(x => x.kind === 'strum'), type: S.lesson.type });
    S.startedAt = 0;
    emit('end', r);
  }

  /** leaving before the end (loops, sections, drills): keep the practice time and what was played, without touching mastery */
  function saveRun() {
    if (!S.lesson || S.finished || S.autoplay || S.rec || !S.startedAt) return;
    const judged = S.res.filter(r => r.attempts > 0 || r.missed).length; if (judged < 4) { S.startedAt = 0; return; }
    const r = results(), id = S.lesson.derived || S.lesson.id;
    LS.progress.addSession({ id, date: Date.now(), dur: Math.round((Date.now() - S.startedAt) / 1000), firstTry: r.firstTry, pitch: r.input === 'mic' ? r.pitchAcc : null, timing: r.timing, consistency: r.consistency, bpm: r.tempo, tempo: r.tempoPct, mode: S.mode, waited: r.waited, correct: r.correct, notes: judged, accAcc: r.accAcc, input: r.input, rhythm: !!S.lesson.rhythm || S.steps.every(x => x.kind === 'strum'), type: S.lesson.type, partial: true });
    S.startedAt = 0;
  }

  /* ---------- recording a lesson from playing ---------- */
  function record(lesson, opt) {
    stop(); S.lesson = lesson; S.steps = []; S.res = []; S.rec = { notes: [], grid: opt && opt.grid || .5 };
    S.tempo = opt && opt.tempo || .7; S.bpmOverride = 0; S.now = 0; S.cur = 0; S.loop = { a: null, b: null, on: false }; S.mode = 'learn';
    reanchor(); emit('load', lesson); hint('h.recStart', null, 'info', 3000); play();
  }
  function recordInput(inp) {
    if (!S.rec || S.ci || !S.playing || inp.kind !== 'note') return;
    if (inp.src === 'mic' && (inp.unsure || inp.conf < .6)) return;
    const beat = Math.max(0, beatAt(inp.t || clock()));
    let s = inp.s, f = inp.f;
    if (s == null) {   // mic: choose the lowest position; the author can correct it in the studio
      let m = Math.round(inp.midi); const lo = TH.tuning.strings[0];
      while (m < lo) m += 12; while (m > lo + 24) m -= 12;
      const ps = TH.positions(m).sort((a, b) => a.f - b.f); if (!ps.length) return; s = ps[0].s; f = ps[0].f;
    }
    S.rec.notes.push({ t: beat, s, f });
    const g = S.rec.grid, q = Math.round(beat / g) * g;
    S.steps.push({ t: q, d: g, kind: 'note', notes: [{ s, f, fi: 0, st: 'down' }], st: 'down', frets: [1, 2, 3].map(k => k === s ? f : null), fingers: [0, 0, 0], i: S.steps.length });
    S.res.push({ attempts: 1, ok: true, first: true, heard: [] }); S.cur = S.steps.length;
    emit('recNote', S.rec.notes.length);
  }
  function undoRecord() { if (!S.rec || !S.rec.notes.length) return; S.rec.notes.pop(); S.steps.pop(); S.res.pop(); S.cur = S.steps.length; emit('recNote', S.rec.notes.length); }
  function stopRecord(save) {
    stop(); const L0 = S.lesson, rec = S.rec; S.rec = null;
    if (!save || !rec || !rec.notes.length) { if (L0) load(L0); return null; }
    L0.events = quantize(rec.notes, LS.bpb(L0), rec.grid); L0.grid = rec.grid; L0.sections = LS.autoSections(L0); L0.recorded = new Date().toISOString().slice(0, 10);
    if (L0.user) LS.update(L0); else LS.add(L0);
    load(L0); return L0;
  }
  function quantize(raw, bb, g) {
    const ev = [];
    raw.forEach(n => { const q = Math.round(n.t / g) * g, prev = ev.find(e => Math.abs(e.t - q) < 1e-6 && e.s === n.s); if (prev) prev.f = n.f; else ev.push({ t: q, s: n.s, f: n.f }); });
    ev.sort((a, b) => a.t - b.t); if (!ev.length) return [];
    const t0 = Math.floor(ev[0].t / bb) * bb; let anchor = 1;
    return ev.map((e, i) => {
      const tt = +(e.t - t0).toFixed(4), nx = ev.find((x, j) => j > i && x.t > e.t), d = nx ? Math.min(2 * bb, Math.max(g, nx.t - e.t)) : Math.max(g, 1);
      let fi = 0; if (e.f > 0) { if (e.f < anchor || e.f > anchor + 3) anchor = Math.max(1, e.f > anchor + 3 ? e.f - 3 : e.f); fi = Math.min(4, Math.max(1, e.f - anchor + 1)); }
      return { id: LS.newId(), t: tt, d: +d.toFixed(4), s: e.s, f: e.f, fi, st: Math.abs(tt - Math.round(tt)) < 1e-6 ? 'down' : 'up', acc: Math.abs(tt % bb) < 1e-6, technique: 'pluck' };
    });
  }

  /* ---------- wiring to the detector ---------- */
  PD.detector.on('note', m => { if (S.input === 'mic') input(Object.assign({ kind: 'note', src: 'mic' }, m)); });
  PD.detector.on('chord', m => { if (S.input === 'mic') input({ kind: 'chord', src: 'mic', present: m.present, t: m.t, exp: m.exp }); });
  PD.detector.on('onset', m => { if (S.input === 'mic') input({ kind: 'onset', src: 'mic', t: m.t, strength: m.strength }); });
  setInterval(tick, 8);
  document.addEventListener('visibilitychange', () => { if (document.hidden && S.playing && !S.rec) { stop(); emit('autopause'); } });

  return {
    S, ASSIST, flags, load, configure, play, stop, toggle, restart, seek, input, showMe, drill, endDrill, repeatMeasure, repeatPhrase, repeatMistake, loopBars,
    results, record, undoRecord, stopRecord, quantize, sectionAt, label, assist, bpm, bps, bpb, endBeat, waitEff, tick,
    beatAt, clock, W, Wi, rf, secs, saveRun,
    /** leave the lesson completely: nothing keeps running in the background */
    unload() { stop(); S.lesson = null; S.steps = []; S.res = []; S.drill = null; S.demo = null; PD.audio.ref.unload(); PD.detector.expect(null); emit('state'); },
    on(k, f) { (listeners[k] = listeners[k] || []).push(f); return () => { listeners[k] = listeners[k].filter(x => x !== f); }; },
    /** frame-exact beat position derived from the same audio-clock anchor as the transport (visuals never drift from audio) */
    visualNow() {
      if (!S.lesson) return 0;
      if (!S.playing || S.waiting || S.ci) return S.now;
      let b = beatOf(clock(), S.stepMode ? 2.5 : 1);
      const st = S.steps[S.cur]; if (st && waitEff() && b > st.t) b = st.t;
      if (S.loop.on && S.loop.b != null) b = Math.min(b, S.loop.b);
      return Math.max(S.now, Math.min(b, S.now + .25));
    },
    setTempo(p) { const b0 = S.lesson ? bpm() : 0; S.tempo = p; S.bpmOverride = 0; noteTempo(b0); reanchor(); emit('state'); },
    setBpm(b) { const b0 = S.lesson ? bpm() : 0; S.bpmOverride = Math.max(20, Math.min(260, b)); noteTempo(b0); reanchor(); emit('state'); },
    setMetro(v) { S.metro = v; PD.store.set('metro', v); emit('state'); },
    setCountIn(v) { S.countIn = v; PD.store.set('countIn', v); },
    setAssist(v) { S.assistOverride = v; PD.store.set('assist', v); emit('state'); },
    setAutoDemo(v) { S.autoDemo = v; PD.store.set('autoDemo', v); },
    setLoopA() { S.loop.a = Math.floor(S.now); if (S.loop.b != null && S.loop.b <= S.loop.a) S.loop.b = null; emit('state'); },
    setLoopB() { S.loop.b = Math.ceil(S.now + .01); if (S.loop.a == null || S.loop.a >= S.loop.b) S.loop.a = Math.max(0, S.loop.b - bpb()); emit('state'); },
    clearLoop() { S.loop = { a: null, b: null, on: false }; emit('state'); },
    toggleLoop() { if (S.loop.a == null || S.loop.b == null) { const s = sectionAt(S.now); S.loop.a = s.from; S.loop.b = s.to; } S.loop.on = !S.loop.on; if (S.loop.on) { S.passes = []; seek(S.loop.a); } emit('state'); }
  };
})();
