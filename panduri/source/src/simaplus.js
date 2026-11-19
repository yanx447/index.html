/* =====================================================================
   სიმა — what she plays, and what she writes on her own (the installable app)
   · ▶ buttons under her answers: a chord on the shape the app computes, a
     scale or an interval note by note on the panduri, a rhythm at its page's
     tempo, the song's own recording — on the app's own sound, nothing sent;
   · once a day she writes first: a tip from the app's tips (its source badge
     kept), where you stand, and one piece of theory worked out by the app;
     after the day's first practice she says well done;
   · the songs she has, and a song looked for: YouTube opens only when tapped.
   Kept apart from sima.js because the single-file build is at its size limit:
   there she answers without these.
   ===================================================================== */
PD.simaPlus = (() => {
  const I = PD.sima._in;
  const { h, S, L, name, norm, KW, canon, chordsIn, songs, songInfo, nextStep, libShape, keep, pack, bubble, open, setUnread, unreadN, popTip, TH } = I;

  // what a question asks for: „დამიკარი", „მოვუსმინო", „ჩამირთე" — she plays it, not only writes it
  Object.assign(KW, {
    listen: 'მოსმენ|მოვუსმინ|მოუსმინ|მომასმენ|ჩამირთ|დამიკარ|დაუკარ|გავიგონ|მოვისმინ|listen|hear it|play it|play me|play the|let me hear|послуша|прослуша|сыграй|включи|anhören|vorspielen|escuchar|écouter|ascolta|ouvir|dinle|posłuchaj|zagraj|استمع|اعزف|सुनाओ|सुनना|बजाओ|听|播放|聴か|再生|들려|틀어'.split('|'),
    songs: 'რა სიმღერ|რომელი სიმღერ|სიმღერები გაქვს|სიმღერების სია|ყველა სიმღერ|which songs|what songs|song list|list of songs|all songs|какие песни|список песен'.split('|'),
    tip: 'დღის რჩევ|რჩევა მომეც|რამე მირჩიე|მირჩიე რამე|რჩევა მინდა|tip of the day|give me a tip|any advice|daily tip|совет дня|дай совет'.split('|')
  });


  /** a rhythm as data she can keep and play again: its strokes, their lengths in beats, its tempo */
  const rhythmPlay = (r, frets, label) => r && r.strokes && r.strokes.length ? { k: 'rhythm', rid: r.id, label: label || t('sm.pRhythm'), frets: frets || [0, 0, 0],
    strokes: r.strokes.map(x => ({ d: x.direction, a: !!x.accent })), bpm: (r.timing && r.timing.bpm) || 72,
    durs: r.timing && r.timing.durations && r.timing.durations.length === r.strokes.length ? r.timing.durations : r.strokes.map(() => 1) } : null;
  const songMedia = l => { const k = l && l.stems && (l.stems.full || l.stems.music); if (!k || /^blob:/.test(k)) return null; return (PD.assets && PD.assets.media && PD.assets.media[k.split('#')[0]]) || null; };
  const ytSearch = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  const songRec = l => { const P = PD.songbook && (PD.songbook.PENDING || []).find(x => x.id === l.id); return (P && P.rec) || null; };

  /** what can be played for an answer: the song's recording, its rhythm and chords; a rhythm; a chord (theory answers bring their own) */
  const anyR = id => PD.curriculum.anyRhythm ? PD.curriculum.anyRhythm(id) : (PD.curriculum.rhythms() || []).find(x => x.id === id);
  function decorate(a) {
    if (!a || a.play) return a;
    const play = [];
    if (a.song) {
      const l = songs().find(x => x.id === a.song); if (!l) return a;
      const s = songInfo(l), url = songMedia(l), first = s.cyc ? s.cyc[0] : s.chords[0], fsh = first && (s.shapes[first] || libShape(first));
      if (url) play.push({ k: 'rec', url, label: t('sm.pSong') });
      if (s.R && s.strokes.length) { const rp = rhythmPlay(Object.assign({}, s.R, { strokes: s.strokes }), fsh && fsh.frets, t('sm.pRhythmOn', { r: s.Rname, c: first || '' })); if (rp) play.push(rp); }
      if (s.chords.length) play.push({ k: 'prog', names: (s.cyc || s.chords).slice(0, 8), label: t('sm.pChords') });
      const rec = songRec(l); a.ext = [{ url: rec || ytSearch(s.title), label: t(rec ? 'sm.ytRec' : 'sm.ytFind') }];
    } else if (a.rhythm) {
      // the teacher's own recording of it when there is one; the app's panduri at the page's tempo always
      const r = anyR(a.rhythm); if (!r) return a;
      if (PD.rhythmsUI && PD.rhythmsUI.hasRecording && PD.rhythmsUI.hasRecording(r.id)) play.push({ k: 'teacherRec', rid: r.id });
      const rp = rhythmPlay(r); if (rp) play.push(rp);
      if (r.timing && r.timing.src === 'default') a.lines = a.lines.concat(t('sm.pDefault'));
    } else if (a.rhythms) a.rhythms.forEach(id => { const r = anyR(id), rp = r && rhythmPlay(r, null, L(r.name)); if (rp) play.push(Object.assign(rp, { small: true })); });
    else if (a.chord) play.push({ k: 'chord', name: a.chord, label: t('sm.pChord') }, { k: 'arp', frets: a.frets, label: t('sm.pArp') });
    else if (a.chords) play.push({ k: 'prog', names: a.chords.map(c => c[0]), label: t('sm.pAll') }, ...a.chords.slice(0, 6).map(c => ({ k: 'chord', name: c[0], label: c[1], small: true })));
    if (play.length) a.play = play;
    return a;
  }

  /** every song she has, or the ones with the chords asked for („რა სიმღერებია Am-ით") */
  function songsAnswer(q) {
    const want = chordsIn(q, true).filter(f => /^[A-G]/.test(f.as)).map(f => f.c.name);
    const all = songs().filter(l => !l.ai).map(songInfo).filter(x => !want.length || want.every(w => x.chords.some(c => canon(c) === canon(w))));
    if (!all.length) return { title: t('nav.songs'), lines: [t('sm.sgListNone')], src: 'fact', acts: [[t('nav.songs'), ['songs']]] };
    return { title: t('nav.songs'), src: 'fact', acts: [[t('nav.songs'), ['songs']]],
      lines: [t(want.length ? 'sm.sgListWith' : 'sm.sgList', { n: all.length, c: want.join(', ') })].concat(all.slice(0, 16).map(x => '• ' + x.title +
        (x.chords.length ? ' — ' + (x.cyc || x.chords).slice(0, 6).join(' · ') : x.l.pending ? ' — ' + t('sb.pendTag') : ''))),
      more: all.slice(0, 8).map(x => ({ title: x.title })) };
  }
  /** a song the app does not hold: what is left of the question is its name — YouTube to listen, the internet for its chords */
  function songSearch(q) {
    const drop = w => { const x = norm(w); return !x || x.length < 2 || ['search', 'listen', 'song'].some(k => KW[k].some(kw => kw.trim().length >= 3 && x.includes(kw.trim()))) ||
      /^(მინდა|გთხოვ|მომიძებნე|მოიძიე|მოძებნე|მომისმინე|ჩამირთე|ჩართე|მაჩვენე|ნახე|სადმე|სიმა|please|find|search|look|for|me|a|the|song|play|listen|to|can|you|could|i|want|up|on|youtube|იუთუბზე|იუთუბი)$/u.test(x); };
    const nm2 = String(q).replace(/[?!.,„“”"«»:;()]/g, ' ').split(/\s+/).filter(w => !drop(w)).join(' ').trim();
    if (!nm2) return { title: name(), lines: [t('sm.whichSong')], src: 'fact', acts: [[t('nav.songs'), ['songs']]] };
    return { title: '„' + nm2 + '“', lines: [t('sm.sgFind', { s: nm2 })], src: 'fact', web: true,
      ext: [{ url: ytSearch(nm2), label: t('sm.ytFind') }], acts: [[t('ai.title'), ['ai']], [t('nav.songs'), ['songs']]] };
  }

  /* ---------------- what she plays: the app's own panduri sound, on the audio clock ---------------- */
  const PL = { iv: 0, end: 0, btn: null, stops: [], audio: null };
  function stopPlay() {
    clearInterval(PL.iv); clearTimeout(PL.end); PL.iv = 0;
    PL.stops.forEach(x => { try { x.stop(); } catch (_) {} }); PL.stops = [];
    if (PL.audio) { try { PL.audio.pause(); } catch (_) {} PL.audio = null; }
    if (PL.btn) { PL.btn.classList.remove('on'); PL.btn.setAttribute('aria-pressed', 'false'); PL.btn.textContent = PL.btn._label; PL.btn = null; }
  }
  /** one note on the panduri where it lies (lowest fret), else the app's piano; moved by octaves into the neck's range unless exact */
  function pluck(m, when, dur, exact) {
    let x = Math.round(m); const lo = TH().midi(1, 0), hi = TH().midi(3, TH().FRETS);
    if (!exact) { while (x < lo) x += 12; while (x > hi) x -= 12; }
    const pos = (TH().positions(x) || []).sort((a, b) => a.f - b.f)[0];
    const src = pos ? PD.audio.note(pos.s, pos.f, { when, dur: dur || 1, vel: .7 }) : PD.audio.piano(x, { when, dur: dur || 1 });
    if (src && src.stop) PL.stops.push(src);
  }
  /** a chord: the shape the app computes for it, strummed; without one, its notes together */
  function chordSound(nm, when, midis, vel) {
    const v = libShape(nm);
    if (v && v.frets) return PD.audio.strum(v.frets, 'down', { when, vel: vel || .8 });
    const ms = midis || (PD.simaTheory && PD.simaTheory.chordMidis(nm)) || [];
    ms.forEach((m, i) => pluck(m, when + i * .02, 1.8));
  }
  function eventsOf(p) {
    const E = [], A = PD.audio;
    if (p.k === 'seq') (p.midis || []).forEach((m, i) => E.push([i * (p.gap || .5), w => pluck(m, w, Math.max(.6, (p.gap || .5) * 1.6), p.exact)]));
    else if (p.k === 'together') (p.midis || []).forEach((m, i) => E.push([i * .02, w => pluck(m, w, 2.2)]));
    else if (p.k === 'scale') { const ms = (p.midis || []).concat((p.midis || []).slice(0, -1).reverse()); ms.forEach((m, i) => E.push([i * .4, w => pluck(m, w, .75)])); }
    else if (p.k === 'chord') E.push([0, w => chordSound(p.name, w, p.midis)]);
    else if (p.k === 'arp') (p.frets || []).forEach((f, i) => { if (f != null) E.push([i * .45, w => { const x = A.note(i + 1, f, { when: w, dur: 1.4 }); if (x && x.stop) PL.stops.push(x); }]); });
    else if (p.k === 'prog') (p.names || []).forEach((n, i) => E.push([i * 1.4, w => chordSound(n, w)]));
    else if (p.k === 'rhythm' && p.strokes && p.durs) {
      const spb = 60 / (p.bpm || 72); let tt = 0;
      for (let c = 0; c < 4; c++) p.strokes.forEach((x, i) => { E.push([tt, w => A.strum(p.frets || [0, 0, 0], x.d === 'up' ? 'up' : 'down', { when: w, vel: x.a ? 1 : .55, gap: x.a ? .011 : .02 })]); tt += (p.durs[i] || 1) * spb; });
    }
    return E.sort((a, b) => a[0] - b[0]);
  }
  function mark(btn) { if (!btn) return; PL.btn = btn; btn.classList.add('on'); btn.setAttribute('aria-pressed', 'true'); btn.textContent = '■ ' + btn._raw; }
  function runPlay(p, btn) {
    if (btn && PL.btn === btn) return stopPlay();
    stopPlay();
    if (p.k === 'rec') {
      const au = new Audio(p.url); PL.audio = au; mark(btn);
      au.onended = () => { if (PL.audio === au) stopPlay(); };
      const pr = au.play(); if (pr && pr.catch) pr.catch(() => { if (PL.audio === au) { stopPlay(); if (PD.ui && PD.ui.toast) PD.ui.toast(t('rh.recErr')); } });
      return;
    }
    if (!PD.audio || !PD.audio.ensure()) return;
    const E = eventsOf(p); if (!E.length) return;
    const t0 = PD.audio.now() + .12; let i = 0;
    const pump = () => { const now = PD.audio.now(); while (i < E.length && t0 + E[i][0] < now + .25) { try { E[i][1](t0 + E[i][0]); } catch (_) {} i++; } if (i >= E.length) { clearInterval(PL.iv); PL.iv = 0; } };
    pump(); PL.iv = setInterval(pump, 30);
    PL.end = setTimeout(stopPlay, (E[E.length - 1][0] + 2.2) * 1000);
    mark(btn);
  }
  function playBtn(p) {
    if (p.k === 'teacherRec') return PD.rhythmsUI && PD.rhythmsUI.preview ? PD.rhythmsUI.preview(p.rid, { label: true }) : null;
    const raw = String(p.label || '').replace(/^▶\s*/u, '');
    const b = h('button', { class: 'btn small sm-pl' + (p.small ? ' mini' : ''), 'aria-pressed': 'false', type: 'button' });
    b._raw = raw; b._label = '▶ ' + raw; b.textContent = b._label;
    b.onclick = () => runPlay(p, b);
    return b;
  }


  /* ---------------- once a day she writes first ----------------
     A tip from the app's own tips (its source badge kept: the teacher's, general, or a draft he has not confirmed),
     where you stand (your streak, what is waiting), and one piece of theory the app works out itself. */
  const dayKey = d => { const x = d || new Date(); return x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate(); };
  const dayNo = d => { const x = d || new Date(); return Math.floor((x.getTime() - x.getTimezoneOffset() * 6e4) / 864e5); };
  function tipOf(n) {
    const all = ((PD.tips && PD.tips.all()) || []).filter(c => c && c.title && c.short);
    const pool = all.filter(c => c.src !== 'draft').concat(all.filter(c => c.src === 'draft'));
    return pool.length ? pool[((n % pool.length) + pool.length) % pool.length] : null;
  }
  function streakInfo() {
    const ss = (PD.lessons && PD.lessons.progress && PD.lessons.progress.sessions()) || [];
    const days = {}; ss.forEach(x => { if (x.date) days[new Date(x.date).toDateString()] = 1; });
    let streak = 0; for (let i = days[new Date().toDateString()] ? 0 : 1; i < 400; i++) { if (days[new Date(Date.now() - i * 864e5).toDateString()]) streak++; else break; }
    const last = ss.reduce((a, x) => Math.max(a, x.date || 0), 0);
    const today = Math.round(ss.filter(x => new Date(x.date).toDateString() === new Date().toDateString()).reduce((a, x) => a + (x.dur || 0), 0) / 60);
    return { streak, today, idle: last ? Math.floor((Date.now() - last) / 864e5) : null };
  }
  function dayMessage(d) {
    const n = dayNo(d), hr = (d || new Date()).getHours(), tip = tipOf(n), st = streakInfo(), out = [];
    const lines = [t(hr < 12 ? 'sm.dMorning' : hr < 18 ? 'sm.dDay' : 'sm.dEvening')];
    if (tip) { lines.push(t('sm.dTip', { t: L(tip.title) }), L(tip.short)); if (tip.steps && tip.steps[0]) lines.push('→ ' + L(tip.steps[0])); }
    if (st.streak >= 2) lines.push(t('sm.dStreak', { n: st.streak }));
    else if (st.idle != null && st.idle >= 2) lines.push(t('sm.dIdle', { n: st.idle }));
    let sug = null, nx = null, due = null;
    try { due = PD.exam && PD.exam.waiting && PD.exam.waiting(); sug = !due && PD.coach && PD.coach.today && PD.coach.today(); nx = !due && !sug && nextStep(); } catch (_) {}
    if (due) lines.push(t('sm.examDue')); else if (sug) lines.push(t('sm.dFocus', { s: t(sug.key) })); else if (nx) lines.push(t('sm.yourNext', { s: nx.label }));
    const acts = []; if (tip) acts.push([t('sm.dOpenTip'), ['tips', tip.id]]); acts.push([t('nav.learn'), ['learn']]);
    out.push({ title: t('sm.dTitle'), lines, src: tip ? tip.src : 'fact', acts });
    const th = PD.simaTheory && PD.simaTheory.daily(n);
    if (th) out.push(Object.assign({}, th, { title: t('sm.dTheory', { t: th.title }), lines: th.lines.slice(0, 5) }));
    return out;
  }
  /** today's message, once: into the conversation, the inbox, and a small card. inPanel: the panel is open and shows it itself */
  function daily(inPanel) {
    if (!S.get('sima.on', true) || !S.get('sima.daily', true)) return false;
    const k = dayKey(); if (S.get('sima.day', '') === k || new Date().getHours() < 6) return false;
    let msgs; try { msgs = dayMessage(); } catch (_) { return false; }
    if (!msgs.length) return false;
    S.set('sima.day', k);
    msgs.forEach(a => keep({ who: 'her', text: a.lines.join('\n'), meta: pack(a), day: k }));
    if (inPanel && I.box) { msgs.forEach(a => bubble(a.lines.join('\n'), a, 'her', k)); return true; }
    setUnread(unreadN() + msgs.length);
    const tip = tipOf(dayNo());
    try { if (PD.notify && PD.notify.note) PD.notify.note('sima', t('sm.dNote', { n: name() }), tip ? L(tip.title) : msgs[0].lines[1] || '', 'sima', 'sima:' + k); } catch (_) {}
    popTip(t('sm.dPop', { n: name() }), () => open(''));
    return true;
  }
  /** what the reminder on the lock screen says for a day (the notifications module schedules it) */
  function dayTip(d) { const tip = tipOf(dayNo(d)); return tip ? { title: t('sm.dNote', { n: name() }), body: L(tip.title) + ' — ' + L(tip.short) } : null; }
  /* after the first practice of the day she says well done — once a day, never during the lesson itself */
  PD.bus.on('session', () => {
    if (!S.get('sima.on', true) || !S.get('sima.daily', true)) return;
    const k = dayKey(); if (S.get('sima.cheer', '') === k) return;
    S.set('sima.cheer', k);
    const st = streakInfo(), lines = [t(st.streak >= 2 ? 'sm.cStreak' : 'sm.cDone', { n: st.streak, m: Math.max(1, st.today) })];
    if ([3, 7, 14, 30, 50, 100, 365].includes(st.streak)) lines.push(t('sm.cMile', { n: st.streak }));
    const nx = nextStep(); if (nx) lines.push(t('sm.yourNext', { s: nx.label }));
    const a = { title: name(), lines, src: 'fact' };
    keep({ who: 'her', text: lines.join('\n'), meta: pack(a) });
    if (I.box) bubble(lines.join('\n'), a); else setUnread(unreadN() + 1);
  });


  const api = { decorate, playBtn, stopPlay, daily, dayMessage, dayTip, songsAnswer, songSearch, chips: ['sm.q8', 'sm.q1', 'sm.q5', 'sm.q6', 'sm.q7', 'sm.q3', 'sm.q9', 'sm.q2'] };
  PD.sima.use(api);
  return api;
})();

PD.i18n.add({
  'sm.pRhythm': ['რითმი — აპის ფანდური', 'The rhythm — the app’s fanduri'], 'sm.pRhythmOn': ['{r} — {c}-ზე', '{r} on {c}'],
  'sm.pDefault': ['ხანგრძლივობა ჯერ მასწავლებლის მითითებული არ არის — აპი დარტყმებს თანაბრად უკრავს.', 'The teacher has not given the timing yet — the app plays the strokes evenly.'],
  'sm.pChord': ['აკორდი', 'The chord'], 'sm.pArp': ['სიმ-სიმ', 'String by string'], 'sm.pAll': ['ყველა ერთად, რიგით', 'All of them, in order'],
  'sm.pSong': ['სიმღერის ჩანაწერი', 'The recording'], 'sm.pChords': ['აკორდები რიგით', 'The chords in order'],
  'sm.ytFind': ['YouTube-ზე მოძებნა', 'Find it on YouTube'], 'sm.ytRec': ['ჩანაწერი YouTube-ზე', 'The recording on YouTube'],
  /* songs */
  'sm.sgList': ['აპში {n} სიმღერაა — აირჩიე და გეტყვი აკორდებს, რითმს და მოგასმენ:', 'The app holds {n} songs — pick one and I will give you its chords and rhythm, and play it:'],
  'sm.sgListWith': ['{c}-ით {n} სიმღერაა:', '{n} songs use {c}:'],
  'sm.sgListNone': ['ასეთი სიმღერა აპში ჯერ არ არის.', 'There is no such song in the app yet.'],
  'sm.whichSong': ['რომელი სიმღერა? დამიწერე სახელი — მაგ. „მოძებნე სიმღერა სულიკო".', 'Which song? Write its name — e.g. “find the song Suliko”.'],
  'sm.sgFind': ['„{s}" აპში ჯერ არ არის. მოსასმენად გახსენი YouTube-ზე; აკორდებისთვის შედი ანგარიშში და ინტერნეტში მოვძებნი, ან ჩანაწერი ატვირთე AI სტუდიაში — იქ აკორდებს შენს მოწყობილობაზე ამოიცნობს.', '“{s}” is not in the app yet. To listen, open it on YouTube; for its chords sign in and I will search the internet, or load a recording into the AI studio — it finds the chords on your device.'],
  'sm.dMorning': ['დილა მშვიდობისა! 🌅', 'Good morning! 🌅'], 'sm.dDay': ['გამარჯობა! ☀️', 'Hello! ☀️'], 'sm.dEvening': ['საღამო მშვიდობისა! 🌙', 'Good evening! 🌙'],
  'sm.dTitle': ['დღის რჩევა', 'Tip of the day'], 'sm.dTip': ['დღევანდელი რჩევა — „{t}":', 'Today’s tip — “{t}”:'],
  'sm.dStreak': ['{n} დღეა ზედიზედ ვარჯიშობ — ყოჩაღ, ასე გააგრძელე! 🔥', '{n} days of practice in a row — well done, keep going! 🔥'],
  'sm.dIdle': ['{n} დღეა არ გივარჯიშია. დღეს 10 წუთიც საკმარისია.', 'You have not practised for {n} days. Even 10 minutes today is enough.'],
  'sm.dFocus': ['დღეს ყურადღება: {s}', 'Today’s focus: {s}'], 'sm.dOpenTip': ['რჩევა სრულად', 'The whole tip'],
  'sm.dTheory': ['დღის თეორია · {t}', 'Theory of the day · {t}'],
  'sm.dNote': ['{n} · დღის რჩევა', '{n} · Tip of the day'], 'sm.dPop': ['{n}-მ მოგწერა — დღის რჩევა', '{n} wrote to you — tip of the day'],
  'sm.cDone': ['ყოჩაღ! დღეს უკვე {m} წუთი ივარჯიშე. 👏', 'Well done! {m} minutes of practice today already. 👏'],
  'sm.cStreak': ['ყოჩაღ! დღეს {m} წუთი — და {n} დღეა ზედიზედ ვარჯიშობ. 🔥', 'Well done! {m} minutes today — and {n} days in a row. 🔥'],
  'sm.cMile': ['{n} დღე ზედიზედ — ეს უკვე ჩვევაა. ამაყი ვარ შენით!', '{n} days in a row — that is a habit now. I am proud of you!'],
  'sm.dailyOn': ['დღეში ერთხელ თვითონ მწერს', 'Writes to me once a day'],
  'sm.dailyD': ['რჩევა, თეორიის ერთი ფაქტი და რა გელოდება — და ვარჯიშის შემდეგ შექება', 'A tip, one piece of theory and what is waiting — and praise after practice'],
  'sm.q5': ['დამიკარი აჭარული', 'Play me acharuli'], 'sm.q6': ['რა აკორდებია ლა მინორში?', 'What chords are in A minor?'],
  'sm.q7': ['რა სიმღერები გაქვს?', 'Which songs do you have?'], 'sm.q8': ['დღის რჩევა', 'Tip of the day'],
  'sm.q9': ['Am F C G ტრანსპოზიცია +2', 'Transpose Am F C G +2']
});
