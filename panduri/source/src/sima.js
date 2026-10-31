/* =====================================================================
   სიმა — the helper who answers in Georgian.

   She does not invent anything. Every answer is built from what is
   already in this app: the teacher's lessons and tips, the chord
   library, his four rhythms, the theory chapters, the scales, and the
   learner's own measured results. When she has nothing, she says so and
   points at Author Studio instead of making something up.

   She writes always; she speaks where the device has a Georgian voice;
   and she can be called by name where the browser can listen.
   ===================================================================== */
PD.sima = (() => {
  const h = PD.h, S = PD.store;
  const L = a => PD.i18n.pick(Array.isArray(a) ? { ka: a[0], en: a[1] } : a);
  const NAME = 'სიმა';

  /* ---------------- what she knows ---------------- */
  const norm = s => String(s || '').toLowerCase().replace(/[«»„“”"'`.,!?()\[\]:;]/g, ' ').replace(/\s+/g, ' ').trim();
  /* Words that carry no subject of their own — in a question they only add noise, and without
     dropping them "რა არის ბლუზი" scores every card that happens to say "არის". */
  const STOP = ['არის', 'არაა', 'როგორ', 'რატომ', 'რომელი', 'რომ', 'უნდა', 'მინდა', 'გინდა', 'მითხარი', 'ამიხსენი', 'ახსენი', 'ვიცი', 'იყო', 'არა', 'კიდევ', 'ასევე', 'what', 'how', 'why', 'the', 'and', 'for'];
  /* Georgian puts its endings on the back of the word, so a query word and the word in the text
     rarely match letter for letter (სტანდარტი / სტანდარტები). Cutting the last two letters off a
     long word is crude, but it finds the stem both of them share. */
  const stem = w => w.length >= 6 ? w.slice(0, w.length - 2) : w;
  const words = s => norm(s).split(' ').filter(w => w.length > 2 && !STOP.includes(w));

  /** one searchable card per thing the app already teaches */
  function index() {
    if (api._ix) return api._ix;
    const ix = [];
    (PD.tips.all() || []).forEach(c => ix.push({
      kind: 'tip', id: c.id, src: c.src, title: L(c.title),
      body: [L(c.short)].concat((c.steps || []).map(L)).concat(c.why ? [L(c.why)] : []),
      go: ['tips', c.id],
      text: norm([L(c.title), L(c.short), (c.steps || []).map(L).join(' '), c.why ? L(c.why) : ''].join(' '))
    }));
    // the theory book keeps a chapter's title in `t` as [ka, en] — not in `title`
    ((PD.theoryBook && PD.theoryBook.CHAPTERS) || []).forEach(c => {
      const ti = L(c.t || c.title || {}), S = PD.theorySimple && PD.theorySimple.get(c.id);
      const lead = S && S.easy && S.easy[0] ? L(S.easy[0]).replace(/<[^>]+>/g, '') : '';
      ix.push({ kind: 'chapter', id: c.id, src: 'fact', title: ti, body: lead ? [lead] : [], go: ['theory', c.id], text: norm(ti + ' ' + lead) });
    });
    // where music comes from — general music history and the blues/jazz forms
    ((PD.genres && PD.genres.CHAPTERS) || []).forEach(c => {
      const ti = PD.i18n.t(c.t), lead = c.lead ? L(c.lead) : '';
      ix.push({ kind: 'chapter', id: c.id, src: 'general', title: ti, body: lead ? [lead] : [], go: ['music', c.id], text: norm(ti + ' ' + lead + ' ' + (c.kw || '')) });
    });
    (PD.curriculum.rhythms() || []).forEach(r => ix.push({
      kind: 'rhythm', id: r.id, src: r.source, title: L(r.name),
      body: [], go: ['rhythms', r.id], text: norm(L(r.name))
    }));
    return (api._ix = ix);
  }

  /* ---------------- the things she can work out herself ---------------- */
  const TH = () => PD.theory;
  /* the fret labels belong to shapes.js: sh.openF / sh.fret (sh.open / sh.fretN never existed) */
  const fLab = f => f === 0 ? t('sh.openF') : t('sh.fret', { n: f });

  /** a chord by name, written out and drawn */
  function chordAnswer(q) {
    const all = (PD.curriculum.chords() || []).filter(c => !c.none);
    const n = norm(q).replace(/\s/g, '');
    let best = null;
    all.forEach(c => {
      const nm = norm(c.name).replace(/\s/g, ''), ka = norm(c.ka || '').replace(/\s/g, '');
      if (!nm) return;
      if (n.includes(nm) && (!best || nm.length > norm(best.name).length)) best = c;
      else if (ka && n.includes(ka) && !best) best = c;
    });
    if (!best) return null;
    const v = (best.voicings && best.voicings[0]) || best;
    const FN = { 1: 'საჩვენებელი', 2: 'შუა', 3: 'არათითი', 4: 'ნეკი', T: 'ცერა' };
    const rows = v.frets.map((f, k) => {
      const fi = (v.fingers || [])[k];
      return TH().stringName(k + 1) + ' — ' + (f === 0 ? t('sm.open') : t('sm.fret', { n: f })) +
        (fi ? ' · ' + (fi === 'T' ? t('sm.thumb') : t('sm.finger', { n: fi, name: FN[fi] || '' })) : '');
    });
    return { title: best.name, lines: [t('sm.chordIs', { n: best.name })].concat(rows),
      src: best.src === 'teacher' ? 'teacher' : 'fact',
      acts: [[t('sm.openChord'), ['chords', best.id]], [t('sm.howTaken'), ['chordhow', best.id]]] };
  }

  /** which note sits on a string and fret */
  function noteAnswer(q) {
    const m = norm(q).match(/(\d+)\s*(?:-?ლ[იე]?\s*)?ლად/);
    const sm = norm(q).match(/(\d+)\s*(?:-?ლ[იე]?\s*)?სიმ/);
    if (!m) return null;
    const f = +m[1], s = sm ? +sm[1] : null;
    if (f < 0 || f > TH().FRETS) return null;
    const list = (s ? [s] : [1, 2, 3]).filter(x => x >= 1 && x <= 3).map(x => {
      const mi = TH().midi(x, f);
      return TH().stringName(x) + ' · ' + t('sm.fret', { n: f }) + ' — ' + TH().pcName(mi) + ' (' + TH().nameKa(mi) + ')';
    });
    return { title: t('sm.noteOn'), lines: list, src: 'fact', acts: [[t('sm.openFret'), ['fretboard']]] };
  }

  /** one rhythm, stroke by stroke */
  function rhythmAnswer(q) {
    const n = norm(q);
    const r = (PD.curriculum.rhythms() || []).find(x => n.includes(norm(L(x.name))));
    if (!r) return null;
    const lines = r.strokes.map((s2, i) => (i + 1) + '. ' + (s2.direction === 'down' ? '↓ ' + t('w.down') : '↑ ' + t('w.up')) + (s2.accent ? ' · ' + t('rh.accent') : ''));
    if (r.meter) lines.push(t('sm.meter', { b: r.meter.beats, u: r.meter.unit, g: r.meter.groups.join('+') }));
    return { title: L(r.name), lines: [t('sm.rhythmIs', { n: L(r.name), c: r.strokes.length })].concat(lines),
      src: r.source, acts: [[t('sm.openRhythm'), ['rhythms', r.id]], [t('sm.metro'), ['metronome']]] };
  }

  /** what to practise, from the learner's own history */
  function practiceAnswer() {
    const sug = PD.coach && PD.coach.today && PD.coach.today();
    if (sug) return { title: t('co.today'), lines: [t(sug.key), t('co.where', { l: L(sug.lesson.title), a: sug.barA, b: sug.barB })],
      src: 'fact', acts: [[t('co.go'), null, () => PD.coach.start(sug)]] };
    const st = nextStep();
    if (st) return { title: t('sm.next'), lines: [st.label], src: 'fact', acts: [[t('home.start'), null, st.go]] };
    return { title: t('sm.next'), lines: [t('sm.noHistory')], src: 'fact', acts: [[t('nav.learn'), ['learn']]] };
  }

  /** where the learner stands on the path */
  function nextStep() {
    try {
      const paths = (PD.lessons && PD.lessons.PATHS) || PD.curriculum.paths() || [];
      for (const p of paths) for (const s2 of p.steps || []) {
        if (!PD.app.stepDone || !PD.app.stepDone(s2)) return { label: L(p.title) + ' · ' + (PD.app.stepTitle ? PD.app.stepTitle(s2) : ''), go: () => PD.app.stepGo(s2) };
      }
    } catch (_) {}
    return null;
  }

  /** is an exam waiting */
  function examAnswer() {
    const due = PD.exam && PD.exam.waiting && PD.exam.waiting();
    if (due) return { title: t('ex.title'), lines: [t('sm.examDue')], src: 'fact', acts: [[t('sm.examGo'), null, () => PD.exam.open(due)]] };
    return { title: t('ex.title'), lines: [t('sm.examNone')], src: 'fact', acts: [[t('ex.title'), ['exams']]] };
  }

  /* ---------------- putting a question to her ---------------- */
  const HAS = (q, ws) => ws.some(w => norm(q).includes(w));
  function answer(q) {
    const Q = norm(q);
    if (!Q) return { title: NAME, lines: [t('sm.hello', { n: NAME })], src: 'fact', acts: [] };
    if (HAS(Q, ['გამოცდ'])) return examAnswer();
    if (HAS(Q, ['რა ვივარჯიშ', 'რას ვივარჯიშ', 'რა ვქნა', 'რა ვაკეთო', 'სად შევჩერდი', 'შემდეგ', 'დღეს რა'])) return practiceAnswer();
    const r = rhythmAnswer(Q); if (r) return r;
    const c = chordAnswer(Q); if (c) return c;
    const n = noteAnswer(Q); if (n) return n;
    // otherwise: the closest thing the teacher has written
    const ws = words(Q); if (!ws.length) return miss();
    /* A word in the title means far more than the same word somewhere in the body: asking about
       "ჯაზი" should open the jazz chapter, not every chapter that happens to mention it. On a tie
       the shorter, more exact title wins. */
    const scored = index().map(x => {
      const ti = norm(x.title); let s2 = 0;
      ws.forEach(w => { const st = stem(w); if (x.text.includes(st)) s2 += Math.min(3, 1 + w.length / 4); if (ti.includes(st)) s2 += 2; });
      if (ti === Q) s2 += 5; else if (ti.includes(Q)) s2 += 3;
      return { x, s: s2 - Math.min(1, ti.length / 200) };
    }).sort((a, b) => b.s - a.s);
    const top = scored[0];
    if (!top || top.s < 2) return miss();
    const x = top.x;
    return { title: x.title, lines: x.body.length ? x.body : [t('sm.seeLesson')], src: x.src, acts: [[t('sm.open'), x.go]],
      more: scored.slice(1, 4).filter(y => y.s >= 2).map(y => y.x) };
  }
  const miss = () => ({ title: NAME, lines: [t('sm.dontKnow')], src: 'fact',
    acts: [[t('nav.learn'), ['learn']], [t('tp.title'), ['tips']]] });

  /* ---------------- her voice ---------------- */
  function kaVoice() {
    try { const vs = speechSynthesis.getVoices() || []; return vs.find(v => /^ka/i.test(v.lang)) || null; } catch (_) { return null; }
  }
  function say(text) {
    if (!S.get('sima.voice', true)) return false;
    try {
      const v = kaVoice(); if (!v || !window.speechSynthesis) return false;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = .96;
      speechSynthesis.speak(u); return true;
    } catch (_) { return false; }
  }

  /* ---------------- being called by name, and talked to ----------------
     One recogniser, two modes. In 'wake' it listens for her name wherever the
     learner is; in 'talk' it takes the next thing said as a question, so the
     conversation can carry on without touching the screen. It stands aside
     while a lesson or the tuner is using the microphone, and picks up again
     when they are done. ------------------------------------------------- */
  const canHear = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const W = { rec: null, mode: null, want: false, tries: 0, timer: 0, heard: 0 };
  // "სიმა" as it comes back from a recogniser: on its own, or with a case ending
  const CALLED = /(^|\s)სიმ(ა|ას|ავ|აა|ა,)?(\s|$)|(^|\s)sima(\s|$)/;
  const micBusy = () => !!((PD.detector && PD.detector.active) || (PD.practice && PD.practice.active));

  function fab() { return document.querySelector('.sm-fab'); }
  function mark(on) { const f = fab(); if (f) f.classList.toggle('listening', !!on); }

  function stopRec() {
    if (!W.rec) return;
    const r = W.rec; W.rec = null; W.mode = null;
    try { r.onend = null; r.onerror = null; r.onresult = null; r.stop(); } catch (_) {}
    mark(false);
  }
  function startRec(mode) {
    if (!canHear() || micBusy()) return false;
    if (W.rec && W.mode === mode) return true;
    stopRec();
    const R = window.SpeechRecognition || window.webkitSpeechRecognition, r = new R();
    r.lang = 'ka-GE'; r.interimResults = false; r.continuous = mode === 'wake';
    r.onresult = e => {
      W.tries = 0;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const raw = e.results[i][0].transcript, said = norm(raw);
        if (mode === 'talk') { W.heard = Date.now(); put(raw.trim()); return; }
        if (CALLED.test(said)) {
          W.heard = Date.now();
          const at = said.search(CALLED), after = said.slice(at).replace(CALLED, ' ').trim();
          stopRec(); open(after || '');
        }
      }
    };
    r.onerror = ev => { if (ev && (ev.error === 'not-allowed' || ev.error === 'service-not-allowed')) { W.want = false; S.set('sima.wake', false); PD.ui.toast(t('sm.micNo'), 4000); stopRec(); } };
    r.onend = () => { if (W.rec === r) { W.rec = null; W.mode = null; mark(false); schedule(); } };
    try { r.start(); } catch (_) { return false; }
    W.rec = r; W.mode = mode; mark(mode === 'wake' || mode === 'talk');
    return true;
  }
  /** keep her ear open: restart after a pause, back off if the browser keeps refusing */
  function schedule() {
    clearTimeout(W.timer);
    if (!W.want || !canHear()) return;
    const wait = Math.min(8000, 400 * Math.pow(1.7, Math.min(6, W.tries++)));
    W.timer = setTimeout(() => {
      if (!W.want) return;
      if (micBusy()) { W.tries = 0; return schedule(); }
      startRec(box ? 'talk' : 'wake');
    }, wait);
  }
  function listen(on) {
    W.want = !!on && canHear();
    clearTimeout(W.timer);
    if (!W.want) { stopRec(); return canHear(); }
    W.tries = 0;
    if (!startRec(box ? 'talk' : 'wake')) schedule();
    return true;
  }
  // a lesson or the tuner takes the microphone; she waits and comes back
  setInterval(() => {
    if (!W.want) return;
    if (micBusy()) { if (W.rec) stopRec(); return; }
    if (!W.rec) schedule();
  }, 2500);

  /* ---------------- the panel ---------------- */
  let box = null, noted = false;
  function close() {
    if (box) { box.remove(); box = null; }
    try { speechSynthesis.cancel(); } catch (_) {}
    if (W.want) { stopRec(); schedule(); }
  }
  function open(q) {
    close();
    const log = h('div', { class: 'sm-log' });
    const input = h('input', { class: 'input sm-in', type: 'text', placeholder: t('sm.ask'), 'aria-label': t('sm.ask') });
    const send = () => { const v = input.value.trim(); if (!v) return; input.value = ''; put(v); };
    const mic = canHear() ? h('button', { class: 'btn small', text: '🎤', 'aria-label': t('sm.once'), onclick: once }) : null;
    const head = h('div', { class: 'sm-head' }, [
      h('div', { class: 'sm-av', text: 'ს' }),
      h('div', { class: 'grow' }, [h('b', { text: NAME }), h('small', { class: 'muted', text: t('sm.sub') })]),
      h('button', { class: 'btn icon quiet', 'aria-label': t('close'), html: PD.ic.close || '✕', onclick: close })]);
    box = h('div', { class: 'sm-wrap', role: 'dialog', 'aria-label': NAME }, [
      h('div', { class: 'sm-card' }, [head, log,
        h('div', { class: 'sm-chips' }, [
          [t('sm.q1'), 'რა ვივარჯიშო დღეს'], [t('sm.q2'), 'გამოცდა'], [t('sm.q3'), 'როგორ ავიღო Bm'], [t('sm.q4'), 'აჭარული']
        ].map(([lab, q2]) => h('button', { class: 'chip', text: lab, onclick: () => put(q2) }))),
        h('div', { class: 'sm-row' }, [input, mic, h('button', { class: 'btn primary', text: t('sm.send'), onclick: send })].filter(Boolean)),
        canHear() && !S.get('sima.wake', false)
          ? h('button', { class: 'btn small sm-wake', text: t('sm.wakeAsk', { n: NAME }), onclick: async e2 => { if (await wakeOn()) e2.currentTarget.remove(); } })
          : canHear() ? h('small', { class: 'muted sm-note', text: t('sm.wakeLive', { n: NAME }) }) : null])]);
    document.body.appendChild(box);
    input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); send(); } };
    PD.i18n.apply(box);
    if (q) put(q); else { bubble(t('sm.hello', { n: NAME }), null); if (W.want) { stopRec(); setTimeout(() => { if (W.want && box) startRec('talk'); }, 250); } }
    setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (_) {} }, 60);
  }
  /* The listening is done by the browser's own recogniser, and that recogniser sends the sound
     to its vendor's service (Google / Apple). It is the one place in this app where sound leaves
     the device, so it is said plainly and agreed to before the microphone is ever opened. The
     toggle in Settings shows the same words beside it (sm.wakeD); this is the path taken from her
     own panel and from the one-shot 🎤, which until now opened the recogniser with no warning. */
  function wakeConsent() {
    if (S.get('sima.wakeOK', false)) return Promise.resolve(true);
    return new Promise(res => {
      let agreed = false;
      PD.ui.sheet((b, close) => {
        b.append(h('h2', { text: t('sm.wakeWarnT') }), h('p', { class: 'fg2', text: t('sm.wakeD') }),
          h('div', { class: 'row' }, [
            h('button', { class: 'btn primary', text: t('sm.wakeYes'), onclick: () => { agreed = true; S.set('sima.wakeOK', true); close(); res(true); } }),
            h('button', { class: 'btn', text: t('cancel'), onclick: close })]));
      }, { onClose: () => { if (!agreed) res(false); } });
    });
  }
  function once() {
    if (!canHear()) return;
    if (micBusy()) return PD.ui.toast(t('sm.micBusy'), 3000);
    wakeConsent().then(ok => {
      if (!ok) return;
      stopRec();
      if (startRec('talk')) PD.ui.toast(t('sm.listening'), 2200);
    });
  }
  /** ask for the microphone and keep her ear open from then on */
  async function wakeOn() {
    if (!canHear()) { PD.ui.toast(t('sm.wakeNo'), 4000); return false; }
    if (!(await wakeConsent())) return false;
    try { const st = await navigator.mediaDevices.getUserMedia({ audio: true }); st.getTracks().forEach(x => x.stop()); }
    catch (_) { PD.ui.toast(t('sm.micNo'), 4000); return false; }
    S.set('sima.wake', true); listen(true); PD.ui.toast(t('sm.wakeOn', { n: NAME }), 3400); return true;
  }
  const SRC = { teacher: 'tp.src.teacher', draft: 'tp.src.draft', general: 'tp.src.general', fact: 'tp.src.fact' };
  function bubble(text, a, who) {
    if (!box) return;
    const el = h('div', { class: 'sm-b ' + (who === 'me' ? 'me' : 'her') },
      a && a.title ? [h('b', { class: 'sm-t', text: a.title }), h('p', { text })] : [h('p', { text })]);
    if (a) {
      if (a.src && SRC[a.src]) el.append(h('span', { class: 'tp-src ' + a.src, text: t(SRC[a.src]) }));
      if (a.acts && a.acts.length) el.append(h('div', { class: 'sm-acts' }, a.acts.map(([lab, go, fn]) =>
        h('button', { class: 'btn small', text: lab, onclick: () => { close(); if (fn) fn(); else if (go) PD.app.go(go[0], go[1] || null); } }))));
      if (a.more && a.more.length) el.append(h('div', { class: 'sm-more' }, a.more.map(x =>
        h('button', { class: 'chip', text: x.title, onclick: () => put(x.title) }))));
    }
    const lg = box.querySelector('.sm-log'); if (lg) { lg.append(el); lg.scrollTop = lg.scrollHeight; }
  }
  function put(q) {
    if (!box) open();
    bubble(q, null, 'me');
    const a = answer(q);
    const text = a.lines.join('\n');
    bubble(text, a);
    const spoke = say(a.title + '. ' + a.lines.join('. '));
    if (W.want && box) { stopRec(); setTimeout(() => { if (W.want && box) startRec('talk'); }, spoke ? 1600 : 350); }
    if (!spoke && !noted && S.get('sima.voice', true)) {
      noted = true;
      const lg = box && box.querySelector('.sm-log');
      if (lg) lg.append(h('small', { class: 'muted sm-note', text: t('sm.noVoice') }));
    }
  }

  /* ---------------- the button that is always there ---------------- */
  function mount() {
    if (document.querySelector('.sm-fab') || !S.get('sima.on', true)) return;
    const b = h('button', { class: 'sm-fab', 'aria-label': NAME, onclick: () => open('') }, [h('span', { text: 'ს' })]);
    document.body.appendChild(b);
  }
  function refresh() { const b = fab(); if (b) b.remove(); mount(); listen(S.get('sima.wake', false)); }
  // she starts listening as soon as the app does, if the learner has allowed it
  PD.bus.on('ready', () => { if (S.get('sima.wake', false)) listen(true); });
  setTimeout(() => { if (S.get('sima.wake', false)) listen(true); }, 1500);

  /* ---------------- she speaks first, when it helps ---------------- */
  function nudge() {
    if (!S.get('sima.nudge', true) || box) return;
    const last = S.get('sima.lastNudge', 0); if (Date.now() - last < 6 * 3600e3) return;
    let a = null;
    const due = PD.exam && PD.exam.waiting && PD.exam.waiting();
    if (due) a = { q: t('sm.q2') };
    else { const sug = PD.coach && PD.coach.today && PD.coach.today(); if (sug) a = { q: t('sm.q1') }; }
    if (!a) return;
    S.set('sima.lastNudge', Date.now());
    const tip = h('button', { class: 'sm-tip', onclick: () => { tip.remove(); open(a.q); } },
      [h('span', { class: 'sm-av', text: 'ს' }), h('span', { text: t('sm.nudge', { n: NAME }) })]);
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 12000);
  }

  const api = { NAME, open, close, answer, say, listen, wakeOn, once, canHear, kaVoice, mount, refresh, nudge, index, get hearing() { return !!W.rec; } };
  return api;
})();

PD.i18n.add({
  'sm.sub': ['შენი დამხმარე — ვპასუხობ მხოლოდ იმით, რაც ამ აპშია', 'Your helper — I answer only from what is in this app'],
  'sm.hello': ['გამარჯობა, მე {n} ვარ. მკითხე: რა ვივარჯიშო, როგორ ავიღო აკორდი, რომელი ნოტია რომელ ლადზე, ან რითმებზე.', 'Hello, I am {n}. Ask me what to practise, how to take a chord, which note is on which fret, or about the rhythms.'],
  'sm.ask': ['დამიწერე კითხვა…', 'Type your question…'], 'sm.send': ['კითხვა', 'Ask'], 'sm.once': ['ერთხელ მკითხე ხმით', 'Ask once by voice'],
  'sm.listening': ['გისმენ…', 'Listening…'],
  'sm.q1': ['რა ვივარჯიშო დღეს?', 'What should I practise today?'], 'sm.q2': ['გამოცდა მელოდება?', 'Is an exam waiting?'],
  'sm.q3': ['როგორ ავიღო Bm?', 'How do I take Bm?'], 'sm.q4': ['აჭარულის რითმი', 'The acharuli rhythm'],
  'sm.chordIs': ['{n} ასე იჭერა:', '{n} is held like this:'],
  'sm.open': ['ღია', 'open'], 'sm.fret': ['{n} ლადი', 'fret {n}'], 'sm.thumb': ['ცერა თითი (T)', 'the thumb (T)'],
  'sm.finger': ['{n} — {name} თითი', 'finger {n} — {name}'],
  'sm.openChord': ['აკორდი ტარზე', 'The chord on the neck'], 'sm.howTaken': ['როგორ აიღო', 'How to take it'],
  'sm.noteOn': ['ნოტი ლადზე', 'The note on that fret'], 'sm.openFret': ['ლადების რუკა', 'The fret map'],
  'sm.rhythmIs': ['{n} — {c} დარტყმა:', '{n} — {c} strokes:'],
  'sm.meter': ['ზომა {b}/{u}, დაჯგუფება {g}.', 'Time signature {b}/{u}, grouped {g}.'],
  'sm.openRhythm': ['რითმის გვერდი', 'The rhythm page'], 'sm.metro': ['მეტრონომი', 'Metronome'],
  'sm.next': ['შემდეგი ნაბიჯი', 'Your next step'],
  'sm.noHistory': ['ჯერ საკმარისი ვარჯიში არ გაქვს, რომ სუსტი ადგილი დავინახო. გაიარე ერთი გაკვეთილი და მერე მკითხე.', 'You have not practised enough yet for me to see a weak spot. Do one lesson and ask me again.'],
  'sm.examDue': ['დიახ — გამოცდა გელოდება. სანამ არ ჩააბარებ, შემდეგი ბლოკი დაკეტილია.', 'Yes — an exam is waiting. The next block stays locked until you pass it.'],
  'sm.examNone': ['ახლა გამოცდა არ გელოდება.', 'No exam is waiting right now.'], 'sm.examGo': ['გამოცდაზე გადასვლა', 'Go to the exam'],
  'sm.seeLesson': ['ეს გაკვეთილი ამას ხსნის — გახსენი და ნახე.', 'This lesson explains it — open it and see.'],
  'sm.dontKnow': ['ამაზე პასუხი ამ აპში ჯერ არ არის. არ მინდა მოგიგონო — ჰკითხე მასწავლებელს, და როგორც კი დაამატებს, გეტყვი.', 'There is no answer for that in this app yet. I will not make one up — ask the teacher, and once it is added I will tell you.'],
  'sm.noVoice': ['ამ მოწყობილობას ქართული ხმა არ აქვს — ვწერ, ხმით ვერ ვკითხულობ.', 'This device has no Georgian voice — I write, but cannot read aloud.'],
  'sm.nudge': ['{n}-ს რჩევა აქვს', '{n} has a suggestion'],
  'sm.title': ['სიმა — დამხმარე', 'Sima — the helper'],
  'sm.on': ['სიმა ჩართულია', 'Sima is on'], 'sm.voice': ['ხმით კითხულობს', 'Reads aloud'],
  'sm.nudgeOn': ['თვითონ იწყებს რჩევას', 'Offers advice on her own'],
  'sm.wake': ['სახელით გამოძახება', 'Call her by name'],
  'sm.wakeD': ['ჩართვის შემდეგ მიკროფონი ღიად რჩება და სიტყვა „სიმა“ გახსნის მას. ყურადღება: ამ ფუნქციისთვის ბრაუზერი ხმას თავის სერვისს უგზავნის (Google/Apple) — ეს ერთადერთი ადგილია აპში, სადაც ხმა მოწყობილობიდან გადის. ნაგულისხმევად გამორთულია.', 'With this on the microphone stays open and the word “Sima” opens her. Note: for this the browser sends the audio to its own service (Google/Apple) — the one place in this app where sound leaves the device. Off by default.'],
  'sm.wakeAsk': ['🎤 სახელით გამომიძახე — თქვი „{n}“', '🎤 Call me by name — say “{n}”'],
  'sm.wakeLive': ['ყურს გიგდებ: სადაც არ უნდა იყო, თქვი „{n}“ და გამოვჩნდები.', 'I am listening: wherever you are, say “{n}” and I will come.'],
  'sm.wakeOn': ['მზად ვარ — თქვი „{n}“ და გამოვჩნდები. გაკვეთილისა და ტიუნერის დროს ყურს ვიღებ, რომ მიკროფონი არ წაგართვა.', 'Ready — say “{n}” and I will come. During a lesson or the tuner I step aside so the microphone stays yours.'],
  'sm.micNo': ['მიკროფონზე უფლება ვერ მივიღე — ბრაუზერის პარამეტრებში დაამატე.', 'I could not get the microphone — allow it in the browser settings.'],
  'sm.micBusy': ['ახლა მიკროფონი გაკვეთილს უჭირავს — ჯერ დაასრულე.', 'The lesson is using the microphone right now — finish it first.'],
  'sm.wakeNo': ['ამ ბრაუზერს ხმის ამოცნობა არ აქვს — ღილაკით გამოიძახე.', 'This browser cannot listen — use the button instead.'],
  'sm.wakeWarnT': ['სანამ ყურს დავუგდებ', 'Before I start listening'],
  'sm.wakeYes': ['მესმის, ჩართე', 'I understand — switch it on']
});
