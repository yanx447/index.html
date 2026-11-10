/* Sima: text-only AI tutor with explicit local lesson fallback. */
PD.sima = (() => {
  const h = PD.h, S = PD.store;
  const L = a => PD.i18n.pick(Array.isArray(a) ? { ka: a[0], en: a[1] } : a);
  const name = () => PD.i18n.pick({ ka: 'სიმა', en: 'Sima' });

  /* ---------------- what she knows ---------------- */
  const norm = s => String(s || '').toLowerCase().replace(/[«»„“”"'`.,!?()\[\]:;]/g, ' ').replace(/\s+/g, ' ').trim();
  /* Words that carry no subject of their own — in a question they only add noise, and without
     dropping them "რა არის ბლუზი" scores every card that happens to say "არის". */
  const STOP = ['არის', 'არაა', 'როგორ', 'რატომ', 'რომელი', 'რომ', 'უნდა', 'მინდა', 'გინდა', 'მითხარი', 'ამიხსენი', 'ახსენი', 'ვიცი', 'იყო', 'არა', 'კიდევ', 'ასევე', 'what', 'how', 'why', 'the', 'and', 'for'];
  /* Georgian puts its endings on the back of the word, so a query word and the word in the text
     rarely match letter for letter (სტანდარტი / სტანდარტები). Cutting the last two letters off a
     long word is crude, but it finds the stem both of them share. */
  const stem = w => w.length >= 6 ? w.slice(0, w.length - 2) : w;
  /* Chinese and Japanese write without spaces, so the browser's own word breaker cuts the question up */
  const seg = () => { const c = PD.i18n.lang; return (c === 'zh' || c === 'ja') && window.Intl && Intl.Segmenter ? new Intl.Segmenter(c, { granularity: 'word' }) : null; };
  const words = s => { const g = seg(); return g ? [...g.segment(norm(s))].filter(x => x.isWordLike && x.segment.length > 1).map(x => x.segment) : norm(s).split(' ').filter(w => w.length > 2 && !STOP.includes(w)); };

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
    // the app itself: friends, the feed, notifications (facts about the app, not about playing)
    [['friends', 'community:friends', 'მეგობარი დამატება nickname ნიკნეიმი მეგობრობა თხოვნა friend add request'],
     ['feed', 'community', 'ფიდი პოსტი ვიდეო რილი ატვირთვა გადაღება დადება გაზიარება მოწონება შენახვა კომენტარი გლობალური feed post upload film share like save comment video reel'],
     ['notify', 'settings', 'შეტყობინება შეხსენება push ნოტიფიკაცია განახლება notification reminder update']].forEach(([id, go, kw]) => {
      const [r, ...p] = go.split(':'), ti = t('sm.app.' + id), body = [t('sm.app.' + id + 'B')];
      ix.push({ kind: 'app', id, src: 'fact', title: ti, body, go: [r, p.join(':') || null], text: norm(ti + ' ' + body[0] + ' ' + kw) });
    });
    // who made the app — the author's own words; no page to open, so no button
    ix.push({ kind: 'app', id: 'creator', src: 'fact', title: t('sm.creatorT'), body: [t('sm.creator')], go: null,
      text: norm(t('sm.creatorT') + ' ' + t('sm.creator') + ' ნუკრი ბერიძე nukri beridze ავტორი შემქმნელი შექმნა გააკეთა author creator developer made created') });
    return (api._ix = ix);
  }

  /* ---------------- the things she can work out herself ---------------- */
  const TH = () => PD.theory;
  const fLab = f => f === 0 ? t('sm.open') : t('sm.fret', { n: f });

  /** a chord by name, written out and drawn */
  function chordAnswer(q) {
    const all = (PD.curriculum.chords() || []).filter(c => !c.none);
    const query = norm(q), n = query.replace(/\s/g, '');
    const chordQuestion = /აკორდ|chord|როგორ ავიღო|how.*(?:play|hold|take)/u.test(query);
    let best = null;
    all.forEach(c => {
      const nm = norm(c.name).replace(/\s/g, ''), ka = norm(c.ka || '').replace(/\s/g, '');
      if (!nm) return;
      // A chord name inside ordinary speech ("I am learning") is not a chord request.
      const token = query.split(/[^a-z0-9#♯♭]+/u).includes(nm);
      if ((n === nm || (chordQuestion && token)) && (!best || nm.length > norm(best.name).length)) best = c;
      else if (ka && (n === ka || (chordQuestion && n.includes(ka))) && !best) best = c;
    });
    if (!best) return null;
    const v = (best.voicings && best.voicings[0]) || best;
    const rows = v.frets.map((f, k) => {
      const fi = (v.fingers || [])[k];
      return TH().stringName(k + 1) + ' — ' + (f === 0 ? t('sm.open') : t('sm.fret', { n: f })) +
        (fi ? ' · ' + (fi === 'T' ? t('sm.thumb') : t('sm.finger', { n: fi, name: (PD.i18n.has && PD.i18n.has('fg.' + fi)) ? t('fg.' + fi) : '' })) : '');
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
    // the learner counts as the teacher does: „1-ლი სიმი" is the thin E (internal 3), „მე-3 სიმი" the bass A (internal 1)
    const list = (s ? [4 - s] : [1, 2, 3]).filter(x => x >= 1 && x <= 3).map(x => {
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
  // Social messages are conversation, not lesson-search queries.
  function conversation(q) {
    const Q = norm(q).replace(/[—–-]/g, ' ').replace(/\s+/g, ' ').trim();
    // who made the app, and her: the author told it himself — „ეს აპლიკაცია შევქმენი მე, ნუკრი ბერიძემ"
    if (/ნუკრი|ბერიძე|nukri|beridze/u.test(Q)) return { title: name(), lines: [t('sm.nukri')], src: 'fact', acts: [], conversational: true };
    if ((/(^| )(ვინ|who)( |$)/u.test(Q) && /შექმნ|შეგქმნ|გააკეთ|ააწყ|დაწერ|დააპროგრამ|ავტორ|შემქმნ|მფლობ|made|creat|built|develop|author|wrote|owner/u.test(Q)) || /^(ავტორი|შემქმნელი|author|creator|developer)$/u.test(Q))
      return { title: name(), lines: [t(/შეგქმნ|შენ ვინ შექმნ|created you|made you/u.test(Q) ? 'sm.madeMe' : 'sm.creator')], src: 'fact', acts: [], conversational: true };
    const rules = [
      [/^(გამარჯობა|გამარჯობათ|გაგიმარჯოს|სალამი|ჰეი|hello|hi|hey)( სიმა| sima)?$/u, 'sm.greeting'],
      [/^(სიმა |sima )?(როგორ ხარ|როგორ ხართ|როგორ მიდის საქმე|how are you)$/u, 'sm.howAreYou'],
      [/^(მადლობა|დიდი მადლობა|გმადლობ|გმადლობთ|thanks|thank you)( სიმა| sima)?$/u, 'sm.thanks'],
      [/^(ნახვამდის|კარგად იყავი|დროებით|bye|goodbye)( სიმა| sima)?$/u, 'sm.goodbye'],
      [/^(ვინ ხარ|ვინ ხარ შენ|რა გქვია|შენ რა გქვია|who are you|what is your name)$/u, 'sm.who'],
      [/^(კარგად ვარ|მეც კარგად ვარ|კარგად|i am fine|i'm fine|fine)$/u, 'sm.fine']
    ];
    const match = rules.find(([pattern]) => pattern.test(Q));
    return match ? { title: name(), lines: [t(match[1], { n: name() })], acts: [], conversational: true } : null;
  }
  function answer(q) {
    const Q = norm(q);
    const social = conversation(q); if (social) return social;
    if (!Q) return { title: name(), lines: [t('sm.hello', { n: name() })], src: 'fact', acts: [] };
    if (Q === norm(t('sm.q2')) || HAS(Q, ['გამოცდ', 'exam', 'экзамен', 'examen', 'prüfung', 'prufung', 'esame', 'exame', 'sınav', 'іспит', 'egzamin', 'امتحان', 'परीक्षा', '考试', '試験', '시험'])) return examAnswer();
    if (Q === norm(t('sm.q1')) || HAS(Q, ['რა ვივარჯიშ', 'რას ვივარჯიშ', 'რა ვქნა', 'რა ვაკეთო', 'სად შევჩერდი', 'შემდეგ', 'დღეს რა'])) return practiceAnswer();
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
    return { title: x.title, lines: x.body.length ? x.body : [t('sm.seeLesson')], src: x.src, acts: x.go ? [[t('sm.go'), x.go]] : [],
      more: scored.slice(1, 4).filter(y => y.s >= 2).map(y => y.x) };
  }
  const miss = () => ({ title: name(), lines: [t('sm.dontKnow')], src: 'fact',
    acts: [[t('nav.learn'), ['learn']], [t('tp.title'), ['tips']]] });

  // Text-only compatibility API: no speech or microphone access.
  const say = () => false, canHear = () => false, kaVoice = () => null;
  const W = { want: false, rec: null };
  const fab = () => document.querySelector('.sm-fab');
  const listen = () => false, stopRec = () => {}, schedule = () => {}, startRec = () => false;
  let history = [], pending = false, generation = 0;

  /* ---------------- the panel ---------------- */
  let box = null;
  function close() {
    generation++; pending = false; history = [];
    if (box) { box.remove(); box = null; }

    if (W.want) { stopRec(); schedule(); }
  }
  function open(q) {
    close();
    const log = h('div', { class: 'sm-log', role: 'log', 'aria-live': 'polite' });
    const input = h('input', { class: 'input sm-in', type: 'text', placeholder: t('sm.ask'), maxlength: '2000', 'aria-label': t('sm.ask') });
    const send = () => { if (pending) return; const v = input.value.trim(); if (!v) return; input.value = ''; put(v); };
    const mic = canHear() ? h('button', { class: 'btn small', text: '🎤', 'aria-label': t('sm.once'), onclick: once }) : null;
    const head = h('div', { class: 'sm-head' }, [
      h('div', { class: 'sm-av', text: name()[0] }),
      h('div', { class: 'grow' }, [h('b', { text: name() }), h('small', { class: 'muted', text: t('sm.sub') })]),
      h('button', { class: 'btn icon quiet', 'aria-label': t('close'), html: PD.ic.close || '✕', onclick: close })]);
    box = h('div', { class: 'sm-wrap', role: 'dialog', 'aria-label': name() }, [
      h('div', { class: 'sm-card' }, [head, h('small', { class: 'muted sm-note', text: t('sm.privacy') }), log,
        h('div', { class: 'sm-chips' }, [
          t('sm.q1'), t('sm.q2'), t('sm.q3'), t('sm.q4')
        ].map(lab => h('button', { class: 'chip', text: lab, onclick: () => put(lab) }))),
        h('div', { class: 'sm-row' }, [input, mic, h('button', { class: 'btn primary', text: t('sm.send'), onclick: send })].filter(Boolean)),
        canHear() && !S.get('sima.wake', false)
          ? h('button', { class: 'btn small sm-wake', text: t('sm.wakeAsk', { n: name() }), onclick: async e2 => { if (await wakeOn()) e2.currentTarget.remove(); } })
          : canHear() ? h('small', { class: 'muted sm-note', text: t('sm.wakeLive', { n: name() }) }) : null])]);
    document.body.appendChild(box);
    input.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); send(); } };
    PD.i18n.apply(box);
    if (q) put(q); else { bubble(t('sm.hello', { n: name() }), null); if (W.want) { stopRec(); setTimeout(() => { if (W.want && box) startRec('talk'); }, 250); } }
    setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (_) {} }, 60);
  }
  const once = () => false, wakeOn = async () => false;
  const SRC = { teacher: 'tp.src.teacher', draft: 'tp.src.draft', general: 'tp.src.general', fact: 'tp.src.fact' };
  function bubble(text, a, who) {
    if (!box) return;
    const el = h('div', { class: 'sm-b ' + (who === 'me' ? 'me' : 'her') },
      a && a.title ? [h('b', { class: 'sm-t', text: a.title }), h('p', { text })] : [h('p', { text })]);
    if (a) {
      if (a.ai) el.append(h('span', { class: 'tp-src draft', text: t('sm.aiLabel') }));
      if (a.src && SRC[a.src]) el.append(h('span', { class: 'tp-src ' + a.src, text: (PD.ui.srcLabel ? PD.ui.srcLabel(SRC[a.src]) : t(SRC[a.src])) }));
      if (a.acts && a.acts.length) el.append(h('div', { class: 'sm-acts' }, a.acts.map(([lab, go, fn]) =>
        h('button', { class: 'btn small', text: lab, onclick: () => { close(); if (fn) fn(); else if (go) PD.app.go(go[0], go[1] || null); } }))));
      if (a.more && a.more.length) el.append(h('div', { class: 'sm-more' }, a.more.map(x =>
        h('button', { class: 'chip', text: x.title, onclick: () => put(x.title) }))));
    }
    const lg = box.querySelector('.sm-log'); if (lg) { lg.append(el); lg.scrollTop = lg.scrollHeight; }
  }
  async function put(q) {
    if (!box) open();
    if (pending) return;
    q = String(q).trim().slice(0, 2000); if (!q) return;
    bubble(q, null, 'me');
    const local = answer(q);
    if (local.conversational && (!PD.cloud || !PD.cloud.configured || !PD.cloud.user)) {
      bubble(local.lines.join('\n'), local);
      history = history.concat({ role: 'user', content: q }, { role: 'assistant', content: local.lines.join('\n') }).slice(-10);
      return;
    }
    if (!PD.cloud || !PD.cloud.configured || !PD.cloud.user) {
      bubble(t(PD.cloud && PD.cloud.configured ? 'sm.signIn' : 'sm.notConnected'), null);
      bubble(local.lines.join('\n'), local);
      return;
    }
    pending = true;
    const current = generation, panel = box;
    panel.querySelectorAll('.sm-row button, .sm-chips button').forEach(b => b.disabled = true);
    const status = h('small', { class: 'muted sm-note', text: t('sm.thinking'), role: 'status' });
    panel.querySelector('.sm-log').append(status);
    try {
      const result = await PD.cloud.sima({
        messages: history.concat({ role: 'user', content: q }).slice(-12), language: PD.i18n.lang,
        context: { title: local.title, lines: local.lines, source: local.src,
          related: index().filter(x => words(q).some(w => x.text.includes(stem(w)))).slice(0, 5)
            .map(x => ({ title: x.title, lines: x.body, source: x.src })) }
      });
      if (current !== generation || panel !== box) return;
      if (!result || typeof result.text !== 'string' || !result.text.trim()) throw new Error('empty');
      history = history.concat({ role: 'user', content: q }, { role: 'assistant', content: result.text }).slice(-10);
      bubble(result.text, { title: name(), ai: true });
    } catch (_) {
      if (current !== generation || panel !== box) return;
      bubble(t('sm.unavailable'), null);
      bubble(local.lines.join('\n'), local);
    } finally {
      status.remove();
      if (current === generation && panel === box) {
        pending = false;
        panel.querySelectorAll('.sm-row button, .sm-chips button').forEach(b => b.disabled = false);
      }
    }
  }

  /* ---------------- the button that is always there ---------------- */
  function mount() {
    if (document.querySelector('.sm-fab') || !S.get('sima.on', true)) return;
    const b = h('button', { class: 'sm-fab', 'aria-label': name(), onclick: () => open('') }, [h('span', { text: name()[0] })]);
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
      [h('span', { class: 'sm-av', text: name()[0] }), h('span', { text: t('sm.nudge', { n: name() }) })]);
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 12000);
  }

  PD.bus.on('lang', () => { api._ix = null; });   // what she searches is the text in the chosen language
  const api = { get NAME() { return name(); }, open, close, answer, say, listen, wakeOn, once, canHear, kaVoice, mount, refresh, nudge, index, get hearing() { return !!W.rec; } };
  return api;
})();

PD.i18n.add({
  'sm.greeting': ['გამარჯობა! მიხარია, რომ მომწერე. როგორ ხარ?', 'Hello! Glad to hear from you. How are you?'],
  'sm.howAreYou': ['მადლობა მოკითხვისთვის! მზად ვარ, გესაუბრო და სწავლაში დაგეხმარო. შენ როგორ ხარ?', 'Thanks for asking! I am ready to chat and help you learn. How are you?'],
  'sm.thanks': ['არაფრის! თუ კიდევ რამე დაგაინტერესებს, მომწერე.', 'You are welcome! If you have another question, just ask.'],
  'sm.goodbye': ['დროებით! როცა მოგინდება, ისევ მომწერე.', 'Bye! Come back whenever you like.'],
  'sm.creatorT': ['ვინ შექმნა აპლიკაცია', 'Who made the app'],
  'sm.creator': ['ეს აპლიკაცია — „ფანდური" — შექმნა ნუკრი ბერიძემ. სასწავლო მასალა, რასაც აქ ხედავ (აკორდები, რითმები, თითები), მასწავლებლისაა; აპი კი ნუკრის ნამუშევარია.', 'This app — “Panduri” — was created by Nukri Beridze. The teaching material you see here (chords, rhythms, fingerings) is the teacher\'s; the app itself is Nukri\'s work.'],
  'sm.madeMe': ['მე და მთელი ეს აპლიკაცია ნუკრი ბერიძემ შექმნა. მე აქ ვარ, რომ ფანდურის სწავლაში დაგეხმარო.', 'Nukri Beridze created me and this whole app. I am here to help you learn the panduri.'],
  'sm.nukri': ['ნუკრი ბერიძე ამ აპლიკაციის შემქმნელია. „ფანდური" ქართულ სამსიმიან ფანდურზე დაკვრას ასწავლის ნამდვილ ინსტრუმენტზე: მიკროფონით გისმენს, გელოდება და მასწავლებლის მასალას გაჩვენებს. თუ ნუკრიზე მეტის გაგება გინდა, ჯერ მხოლოდ ეს ვიცი.', 'Nukri Beridze is the creator of this app. “Panduri” teaches the Georgian three-string panduri on a real instrument: it listens through the microphone, waits for you and shows the teacher\'s material. That is all I know about Nukri for now.'],
  'sm.who': ['მე {n} ვარ, შენი AI სასწავლო დამხმარე. შეგიძლია ჩვეულებრივად მომწერო — კითხვები დამისვა და მითხრა, რისი გაგება გინდა.', 'I am {n}, your AI learning helper. You can write naturally, ask questions and tell me what you want to understand.'],
  'sm.fine': ['მიხარია! რაზე გინდა ვისაუბროთ?', 'Glad to hear it! What would you like to talk about?'],
  'sm.aiLabel': ['AI პასუხი • შეიძლება შეცდეს', 'AI response • may make mistakes'],
  'sm.thinking': ['სიმა პასუხს ამზადებს…', 'Sima is preparing an answer…'],
  'sm.notConnected': ['AI სერვერი ჯერ არ არის დაკავშირებული. ქვემოთ აპის სასწავლო მასალაა.', 'The AI server is not connected yet. Below is material from the app.'],
  'sm.signIn': ['AI საუბრისთვის შედი ანგარიშში. ქვემოთ აპის სასწავლო მასალაა.', 'Sign in for AI conversation. Below is material from the app.'],
  'sm.unavailable': ['AI პასუხი ახლა ვერ მივიღე. სცადე ხელახლა; ქვემოთ აპის სასწავლო მასალაა.', 'The AI could not reply. Try again; below is material from the app.'],
  'sm.sub': ['შენი სასწავლო თანამოსაუბრე • მხოლოდ ტექსტით', 'Your learning companion • text only'],
  'sm.hello': ['გამარჯობა! მე {n} ვარ. როგორ ხარ? შეგიძლია ჩვეულებრივად მომწერო და მკითხო, რაც გაინტერესებს.', 'Hello! I am {n}. How are you? You can chat naturally and ask me what you would like to know.'],
  'sm.privacy': ['AI ჩატის ტექსტი მუშავდება AI სერვისში. პირადი მონაცემები არ ჩაწერო.', 'AI chat text is processed by an AI service. Avoid personal details.'],
  'sm.ask': ['დამიწერე კითხვა…', 'Type your question…'], 'sm.send': ['კითხვა', 'Ask'], 'sm.once': ['ერთხელ მკითხე ხმით', 'Ask once by voice'],
  'sm.listening': ['გისმენ…', 'Listening…'],
  'sm.q1': ['რა ვივარჯიშო დღეს?', 'What should I practise today?'], 'sm.q2': ['გამოცდა მელოდება?', 'Is an exam waiting?'],
  'sm.q3': ['როგორ ავიღო Bm?', 'How do I take Bm?'], 'sm.q4': ['აჭარულის რითმი', 'The acharuli rhythm'],
  'sm.chordIs': ['{n} ასე იჭერა:', '{n} is held like this:'],
  'sm.open': ['ღია', 'open'], 'sm.fret': ['{n} ლადი', 'fret {n}'], 'sm.thumb': ['ცერა თითი (T)', 'the thumb (T)'],
  'sm.finger': ['{n} — {name} თითი', 'finger {n} — {name}'],
  'sm.go': ['გახსნა', 'Open'],
  'sm.app.friends': ['მეგობრის დამატება', 'Adding a friend'], 'sm.app.friendsB': ['საზოგადოება → ზედა მარცხენა ხატულა (მეგობრები და ძებნა): ჩაწერე მეგობრის ზუსტი nickname და გაუგზავნე თხოვნა. როცა დაგეთანხმება, შეგატყობინებ — და მერე შეგიძლიათ ერთმანეთს მიწეროთ.', 'Community → the icon at the top left (friends and search): type your friend\u2019s exact nickname and send a request. I will tell you when they accept — then you can write to each other.'],
  'sm.app.feed': ['ვიდეოს გამოქვეყნება', 'Posting a video'], 'sm.app.feedB': ['საზოგადოება → ზედა მარჯვენა „+": გადაიღე ან აირჩიე ვიდეო გალერეიდან (მაქს. 60 წამი, 720p-დან 4K-მდე), დაწერე აღწერა და სიმღერის ან რიტმის სახელი და აირჩიე, ვინ ნახავს — ყველა (გლობალური) ან მხოლოდ მეგობრები. ვიდეო იტვირთება ისე, როგორც გადაღებულია. ორჯერ შეხება ვიდეოზე მოწონებაა.', 'Community → the “+” at the top right: film a video or choose one from the gallery (up to 60 seconds, 720p to 4K), write a caption and the name of the song or rhythm, and pick who sees it — everyone (global) or friends only. The video is uploaded exactly as it was filmed. A double tap on a video likes it.'],
  'sm.app.notify': ['შეტყობინებები', 'Notifications'], 'sm.app.notifyB': ['პარამეტრები → შეტყობინებები: ჩართე და აირჩიე, რაზე გინდა ჩემგან შეტყობინება და რომელ საათზე შეგახსენო ვარჯიში. მოვა ყველა მოწყობილობაზე, სადაც შესული ხარ.', 'Settings → Notifications: switch them on, choose what I should tell you about and when to remind you to practise. They reach every device you are signed in on.'],
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
  'sm.noVoice': ['ამ მოწყობილობას ქართული ხმა არ აქვს — ვწერ, ხმით ვერ ვკითხულობ.', 'This device has no voice for this language — I write, but cannot read aloud.'],
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
  'sm.wakeNo': ['ამ ბრაუზერს ხმის ამოცნობა არ აქვს — ღილაკით გამოიძახე.', 'This browser cannot listen — use the button instead.']
});
