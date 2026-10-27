/* =====================================================================
   Rhythms (teacher-supplied data): list + rhythm page.
   Shows at the same time: stroke direction, stroke order, which strokes
   are accented (red + thicker/larger arrow + "აქცენტი" label; normal =
   blue), right-hand animation, current stroke and next stroke.
   Pitch is never required in rhythm practice — only the right hand,
   direction, accent and time.
   Hand schematic is drawn as the instrument is held: string A towards
   the ceiling, E towards the floor, so ↓ ჩაკვრა moves A → E downwards.
   ===================================================================== */
PD.i18n.add({
  'nav.rhythms': ['რიტმები', 'Rhythms'], 'rh.lead': ['მარჯვენა ხელის რიტმები — მასწავლებლის მიერ მოწოდებული.', 'Right-hand rhythms — supplied by the teacher.'],
  'rh.teacherSec': ['ფანდურის რითმები (მასწავლებლისგან)', 'Panduri rhythms (from the teacher)'], 'rh.commonSec': ['ცნობილი რითმები', 'Famous rhythms'],
  'rh.commonD': ['ზოგადი რითმები, რომლებიც გიტარიდან და პოპულარული მუსიკიდანაა ცნობილი. დალაგებულია მარტივიდან რთულისკენ. ციფრი = დათვლა (1 2 3 4), „&“ = „და“ ორ დათვლას შორის.', 'General strumming patterns known from the guitar and popular music, easy to hard. A number = the count (1 2 3 4), “&” = “and” between two counts.'],
  'rh.gen': ['ზოგადი · გიტარიდან ცნობილი', 'General · known from guitar'], 'rh.genNote': ['ეს არ არის მასწავლებლის რითმი — ზოგადი, ცნობილი ნიმუშია. ისრის ზემოთ წერია, სად ეცემა დარტყმა თვლაში. სადაც თვლა გამოტოვებულია, ხელი მაინც მოძრაობს ჰაერში, სიმს არ ეხება.', 'This is not the teacher\'s rhythm — it is a general, well-known pattern. Above each arrow is where the stroke falls in the count. Where a count is skipped the hand still moves in the air without touching the strings.'],
  'rh.teacher': ['მასწავლებლის მონაცემი', "Teacher's data"], 'rh.usage': ['გამოიყენება: {u}', 'Used in: {u}'], 'rh.strokes': ['{n} დარტყმა', '{n} strokes'],
  'rh.accent': ['აქცენტი', 'Accent'], 'rh.stroke': ['დარტყმა {a} / {b}', 'Stroke {a} / {b}'], 'rh.normal': ['ჩვეულებრივი', 'Normal'], 'rh.now': ['ახლა', 'Now'], 'rh.next': ['შემდეგი', 'Next'],
  'rh.listen': ['▶ მოსმენა', '▶ Listen'], 'rh.stop': ['■ გაჩერება', '■ Stop'], 'rh.tempo': ['ტემპი', 'Tempo'], 'rh.hold': ['როგორც ხელში გიჭირავს: A ზემოთ, E ქვემოთ', 'As you hold it: A on top, E below'],
  'rh.timingDefault': ['დარტყმების ხანგრძლივობა მასწავლებელს ჯერ არ მიუთითებია — ახლა ყველა დარტყმა თანაბარია (60 BPM). მასწავლებელი ამას სტუდიაში შეცვლის.', 'Stroke durations have not been given by the teacher yet — all strokes are equal for now (60 BPM). The teacher can set them in the Studio.'],
  'rh.meter': ['თვლა (მუსიკალური ზომა)', 'The count (time signature)'],
  'rh.meterD': ['{b}/{u} — ითვლება {g} დაჯგუფებით: {c}. შებრუნებითაც ითვლება: {c2}.', '{b}/{u} — counted in groups of {g}: {c}. It is also counted the other way round: {c2}.'],
  'rh.meterPlay': ['მოუსმინე თვლას', 'Hear the count'],
  'rh.meterStop': ['გაჩერება', 'Stop'],
  'rh.meterNote': ['თვლა მასწავლებლის მონაცემია. რომელი დარტყმა ზუსტად რომელ თვლაზე მოდის, ჯერ არ არის მითითებული — ამას მასწავლებელი სტუდიაში დააყენებს.', 'The count is the teacher\'s own. Exactly which stroke falls on which number has not been given yet — the teacher sets that in the Studio.'],
  'rh.practice': ['ვარჯიში', 'Practice'], 'rh.noPitch': ['აქ ნოტის სიზუსტე არ მოწმდება — მხოლოდ მარჯვენა ხელი. მიკროფონი ზომავს დროს და აქცენტის სიძლიერეს; მიმართულებას (↓/↑) ხმიდან ვერ ვიგებთ — ისრებს მიჰყევი.', 'Pitch is not checked here — only the right hand. The microphone measures timing and accent strength; the direction (↓/↑) cannot be heard — follow the arrows.'],
  'rh.timing': ['დრო (ავტორი)', 'Timing (author)'], 'rh.bpm': ['BPM', 'BPM'], 'rh.dur': ['ხანგრძლივობა (დარტყმა)', 'Duration (beats)'], 'rh.saveTiming': ['შენახვა', 'Save'], 'rh.orderLocked': ['დარტყმების რიგი და აქცენტები მასწავლებლის მონაცემია და აქ არ იცვლება.', 'Stroke order and accents are teacher data and are not edited here.'],
  'st.watch': ['ხელის მოძრაობის ნახვა', 'Watch the hand'], 'std.watch': ['ნელა: აპი თავად უკრავს, ისარი აჩვენებს მარჯვენა ხელის მოძრაობას და აქცენტს ყოველ დარტყმაზე.', 'Slowly: the app plays it, and the arrow shows the right-hand motion and the accent on every stroke.'],
  'st.metro': ['მეტრონომთან ვარჯიში', 'With the metronome'], 'std.metro': ['უწყვეტად, მეტრონომით — დრო ფასდება.', 'Continuous, with the metronome — timing is scored.'],
  'rh.micT': ['ვარჯიში ფანდურით', 'Practise on your panduri'], 'rh.micD': ['1-2-3-4 ათვლა, მეტრონომი, წრეზე. მიკროფონი ზომავს თითოეული დარტყმის დროს, აქცენტის სიძლიერეს, გამოტოვებულ და ზედმეტ დარტყმებს. ↓/↑ მიმართულებას ხმიდან ვერ ვიგებთ — ისრებს მიჰყევი.', 'Count-in 1-2-3-4, metronome, looped. The microphone measures each stroke’s timing, accent strength, missed and extra strokes. ↓/↑ direction cannot be heard — follow the arrows.'],
  'rh.loopBars': ['წრის სიგრძე', 'Loop length'], 'rh.bars': ['{n} ტაქტი', '{n} bar(s)'], 'rh.micGo': ['დაწყება მიკროფონით', 'Start with microphone'],
  'st.loop': ['წრეზე (Loop)', 'Loop'], 'std.loop': ['ერთი ციკლი განუწყვეტლივ; ტემპი შეცვალე ↑ ↓ ან ტემპის ღილაკით.', 'One cycle over and over; change the tempo with ↑ ↓ or the tempo button.']
});

PD.rhythmsUI = (() => {
  const h = PD.h, C = PD.curriculum, LS = PD.lessons;
  const RED = '#E2574C', BLUE = '#5B9BD5';
  /** one stroke card: colour + size + thickness + label (never colour alone) */
  function arrowSVG(dir, acc, size) {
    const s = size || 56, w = acc ? 7 : 3.2, col = acc ? RED : BLUE, L = acc ? s * .42 : s * .3, cx = s / 2, cy = s / 2, d = dir === 'down' ? 1 : -1;
    return '<svg viewBox="0 0 ' + s + ' ' + s + '" width="' + s + '" height="' + s + '" aria-hidden="true"><path d="M' + cx + ' ' + (cy - d * L) + 'L' + cx + ' ' + (cy + d * L) + 'M' + (cx - L * .55) + ' ' + (cy + d * L * .35) + 'L' + cx + ' ' + (cy + d * L) + 'L' + (cx + L * .55) + ' ' + (cy + d * L * .35) + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  /** where each stroke falls in the count: 1 · & · 2 … (only for rhythms whose timing is part of the pattern) */
  function counts(r) {
    if (!r.timing || r.timing.src !== 'general') return null;
    if (r.eighths) { let at = 0; return r.timing.durations.map(d => { const n = Math.round(at * 2) + 1; at += d; return String(n); }); }
    const sub = r.timing.durations.some(d => Math.abs(d * 4 - Math.round(d * 4)) > 1e-3) ? 3 : r.timing.durations.some(d => Math.abs(d * 2 - Math.round(d * 2)) > 1e-3) ? 4 : 2;
    const SYL = { 2: ['', '&'], 3: ['', '&', 'a'], 4: ['', 'e', '&', 'a'] }[sub];
    let at = 0; return r.timing.durations.map(d => { const b = Math.floor(at + 1e-6), k = Math.round((at - b) * sub); at += d; return k ? SYL[k] : String(b + 1); });
  }
  function patternRow(r, big) {
    const cn = counts(r);
    return h('div', { class: 'rh-row' + (big ? ' big' : '') + (cn ? ' counted' : ''), role: 'list' }, r.strokes.map((s, i) => h('div', { class: 'rh-card' + (s.accent ? ' acc' : '') + (cn && cn[i] && /\d/.test(cn[i]) ? ' onbeat' : ''), role: 'listitem', 'data-i': String(i), 'aria-label': (i + 1) + ': ' + t(s.direction === 'down' ? 'w.down' : 'w.up') + ' · ' + t(s.accent ? 'rh.accent' : 'rh.normal') }, [
      h('span', { class: 'mono rh-n', text: cn ? cn[i] : String(i + 1) }), h('span', { class: 'rh-ar', html: arrowSVG(s.direction, s.accent, big ? 64 : 40) }),
      h('b', { text: (s.direction === 'down' ? '↓ ' : '↑ ') + t(s.direction === 'down' ? 'w.down' : 'w.up') }), h('small', { text: t(s.accent ? 'rh.accent' : 'rh.normal') })])));
  }

  function list(w) {
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('practice') }), h('div', { class: 'grow' }, [h('h1', { 'data-t': 'nav.rhythms' }), h('p', { class: 'muted', style: 'margin-top:6px', 'data-t': 'rh.lead' })])]));
    const item = (r, tag) => { const p = LS.progress.lesson('rhythm-' + r.id);
      return h('button', { class: 'card path', onclick: () => PD.app.go('rhythm', r.id) }, [
        h('div', { class: 'row', style: 'justify-content:space-between' }, [h('h2', { text: PD.i18n.pick(r.name) }), h('span', { class: 'tag' + (r.source === 'general' ? ' gen' : ''), text: tag })]),
        h('span', { class: 'muted', text: t('rh.usage', { u: PD.i18n.pick(r.usage).join(' · ') }) }), patternRow(r),
        p.plays ? h('div', { class: 'bar' }, [h('i', { style: 'width:' + Math.round((p.mastery || 0) * 100) + '%' })]) : null]); };
    const box = h('div', { class: 'paths' });
    C.rhythms().forEach(r => box.append(item(r, t('rh.teacher'))));
    w.append(h('h2', { class: 'rh-sec', 'data-t': 'rh.teacherSec' }), box);
    const box2 = h('div', { class: 'paths' });
    (C.commonRhythms ? C.commonRhythms() : []).slice().sort((a, b) => a.level - b.level).forEach(r => box2.append(item(r, t('rh.gen') + ' · ' + t('lvl.' + Math.min(4, r.level)))));
    w.append(h('h2', { class: 'rh-sec', 'data-t': 'rh.commonSec' }), h('p', { class: 'muted', style: 'margin-top:-4px', 'data-t': 'rh.commonD' }), box2);
  }

  function detail(w, id) {
    const r = C.anyRhythm ? C.anyRhythm(id) : C.rhythms().find(x => x.id === id); if (!r) return list(w); const gen = r.source === 'general';
    const L = LS.fromRhythm(r);
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('rhythms') })]),
      h('div', { style: 'display:flex;flex-direction:column;gap:6px' }, [h('span', { class: 'kicker', text: t('nav.rhythms') + ' · ' + t('rh.strokes', { n: r.strokes.length }) }), h('h1', { text: PD.i18n.pick(r.name) }),
        h('div', { class: 'row' }, [h('span', { class: 'tag' + (gen ? ' gen' : ''), text: t(gen ? 'rh.gen' : 'rh.teacher') }), h('span', { class: 'muted', text: t('rh.usage', { u: PD.i18n.pick(r.usage).join(' · ') }) })])]));
    if (gen) w.append(h('p', { class: 'muted', style: 'font-size:13px;line-height:1.5', 'data-t': 'rh.genNote' }));
    if (r.timing.src === 'default') w.append(h('p', { class: 'tag warn', style: 'display:block;padding:10px 12px;line-height:1.5', text: t('rh.timingDefault') }));
    /* live preview: pattern + current/next + right-hand animation */
    const row = patternRow(r, true);
    const now = h('div', { class: 'rh-now' }, [h('div', {}, [h('small', { 'data-t': 'rh.now' }), h('b', { class: 'rn' })]), h('div', {}, [h('small', { 'data-t': 'rh.next' }), h('b', { class: 'rx' })])]);
    const cv = h('div', { class: 'rh-guide', 'aria-hidden': 'true' });
    const tempo = h('input', { type: 'range', min: '30', max: '160', step: '1', value: String(r.timing.bpm), 'aria-label': t('rh.tempo'), style: 'max-width:240px' });
    const bpmOut = h('span', { class: 'mono', text: r.timing.bpm + ' BPM' });
    const play = h('button', { class: 'btn primary', text: t('rh.listen') });
    const metro = h('input', { type: 'checkbox' }); metro.checked = true;
    w.append(h('section', { class: 'card', style: 'padding:16px;display:flex;flex-direction:column;gap:14px' }, [row,
      h('div', { class: 'rh-live' }, [h('div', { style: 'display:flex;flex-direction:column;gap:10px;min-width:0' }, [now, h('div', { class: 'row' }, [play, h('label', { class: 'row', style: 'gap:6px' }, [h('span', { 'data-t': 'rh.tempo' }), tempo, bpmOut]), h('label', { class: 'row', style: 'gap:6px' }, [metro, h('span', { 'data-t': 'ws.metro' })])])]), cv])]));
    /* practice with the microphone: speed, custom BPM, loop length; count-in and metronome come from the practice screen */
    const pr = PD.store.get('rh.prefs', { pct: 70, bars: 2 });
    const bpb = LS.bpb(L), endB = LS.end(L);
    const bpmTxt = h('span', { class: 'mono muted' });
    const custom = h('input', { type: 'number', class: 'input', min: '20', max: '240', style: 'width:92px', 'aria-label': t('ws.customBpm'), placeholder: 'BPM', value: pr.bpm ? String(pr.bpm) : '' });
    const updT = () => { bpmTxt.textContent = Math.round(pr.bpm || L.bpm * pr.pct / 100) + ' BPM'; PD.store.set('rh.prefs', pr); };
    const speed = h('div', { class: 'seg', role: 'group', 'aria-label': t('ws.speed') }, [40, 50, 60, 70, 80, 90, 100].map(v => h('button', { 'aria-pressed': String(!pr.bpm && pr.pct === v), text: v + '%', onclick: e => { pr.pct = v; pr.bpm = 0; custom.value = ''; speed.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); updT(); } })));
    custom.oninput = () => { const v = +custom.value; pr.bpm = v >= 20 && v <= 240 ? v : 0; speed.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(!pr.bpm && b.textContent === pr.pct + '%'))); updT(); };
    const bars = h('div', { class: 'seg', role: 'group', 'aria-label': t('rh.loopBars') }, [1, 2, 4].map(v => h('button', { 'aria-pressed': String(pr.bars === v), text: t('rh.bars', { n: v }), onclick: e => { pr.bars = v; bars.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); updT(); } })));
    const goMic = () => { stop(); const tempo = pr.bpm ? pr.bpm / L.bpm : pr.pct / 100; PD.practice.open(L, { wait: false, tempo, mode: 'practice', metro: true, loop: { a: 0, b: Math.min(endB, pr.bars * bpb), on: true } }, L.id, 'loop'); };
    updT();
    w.append(h('section', { class: 'card rh-mic' }, [h('div', { class: 'row', style: 'justify-content:space-between' }, [h('b', { 'data-t': 'rh.micT' }), bpmTxt]),
      h('p', { class: 'muted', style: 'font-size:12.5px', 'data-t': 'rh.micD' }),
      h('div', { class: 'rh-opts' }, [h('small', { 'data-t': 'ws.speed' }), h('div', { class: 'row', style: 'gap:8px' }, [speed, custom])]),
      h('div', { class: 'rh-opts' }, [h('small', { 'data-t': 'rh.loopBars' }), bars]),
      h('div', { class: 'row' }, [h('button', { class: 'btn primary', html: PD.ic.mic + '<span data-t="rh.micGo"></span>', onclick: goMic })])]));
    /* the dance's own count, when the teacher has given it */
    const meterStops = [];
    /** the dance's own count: 5/8 as 3+2 — numbers you can see and hear, with the first of each group heavy */
    function meterCard(r) {
      const M = r.meter, nums = [];
      M.groups.forEach((g, gi) => { for (let k = 1; k <= g; k++) nums.push({ n: k, first: k === 1, g: gi }); });
      const say = gs => gs.map(g => Array.from({ length: g }, (_, k) => k + 1).join('-')).join(', ');
      const row = h('div', { class: 'rh-count', role: 'list' });
      nums.forEach((x, i) => {
        if (x.first && i) row.append(h('span', { class: 'rh-bar', 'aria-hidden': 'true' }));
        row.append(h('span', { class: 'rh-cn' + (x.first ? ' acc' : ''), role: 'listitem', 'data-i': String(i), text: String(x.n) }));
      });
      let tid = 0, step = 0;
      const btn = h('button', { class: 'btn small', 'data-t': 'rh.meterPlay' });
      const paint = k => row.querySelectorAll('.rh-cn').forEach((c, j) => c.classList.toggle('on', j === k));
      const stopC = () => { if (!tid) return; clearInterval(tid); tid = 0; paint(-1); btn.textContent = t('rh.meterPlay'); };
      btn.onclick = () => {
        if (tid) return stopC();
        if (!PD.audio.ensure()) return;
        btn.textContent = t('rh.meterStop'); step = 0;
        const tick = () => { const k = step % nums.length; PD.audio.click(PD.audio.now() + .02, nums[k].first); paint(k); step++; };
        tick(); tid = setInterval(tick, 60000 / (+tempo.value || 60) / 2);   // one count = an eighth at the page's tempo
      };
      meterStops.push(stopC);
      return h('section', { class: 'card', style: 'padding:16px;display:flex;flex-direction:column;gap:10px' }, [
        h('b', { 'data-t': 'rh.meter' }),
        h('p', { class: 'muted', style: 'font-size:13px;line-height:1.5', text: t('rh.meterD', { b: M.beats, u: M.unit, g: M.groups.join('+'), c: say(M.groups), c2: say(M.groups.slice().reverse()) }) }),
        row, h('div', { class: 'row' }, [btn]),
        h('small', { class: 'muted', style: 'line-height:1.5', 'data-t': 'rh.meterNote' })]);
    }
    if (r.meter) w.append(meterCard(r));
    /* practice stages */
    const p = LS.progress.lesson(L.id), list = h('div', { class: 'list' });
    L.stages.forEach((s, i) => {
      const pct = p.stages && p.stages[s];
      list.append(h('div', { class: 'step' }, [h('span', { class: 'num' + (pct >= 80 ? ' done' : ''), text: pct >= 80 ? '✓' : String(i + 1) }), h('div', { class: 'body' }, [h('b', { 'data-t': 'st.' + s }), h('p', { 'data-t': 'std.' + s })]),
        h('button', { class: 'btn small', 'data-t': 'home.start', onclick: () => { stop(); PD.app.startStage(L, s); } })]));
    });
    w.append(h('h2', { 'data-t': 'rh.practice' }), h('p', { class: 'muted', style: 'font-size:13px', 'data-t': 'rh.noPitch' }), list);
    /* author: timing only (order and accents are locked teacher data) */
    if (PD.store.get('author', false) && !gen) {
      const durs = r.timing.durations.slice(); let bpm = r.timing.bpm;
      const ed = h('div', { class: 'row' }, r.strokes.map((s, i) => h('label', { class: 'field', style: 'width:84px' }, [h('span', { text: (i + 1) + ' ' + (s.direction === 'down' ? '↓' : '↑') + (s.accent ? ' ●' : '') }), h('input', { type: 'number', step: '.25', min: '.25', value: String(durs[i]), class: 'input', oninput: e => { durs[i] = Math.max(.125, +e.target.value || 1); } })])));
      w.append(h('section', { class: 'card', style: 'padding:16px;display:flex;flex-direction:column;gap:10px' }, [h('b', { 'data-t': 'rh.timing' }), h('p', { class: 'muted', style: 'font-size:12px', 'data-t': 'rh.orderLocked' }),
        h('label', { class: 'field', style: 'width:120px' }, [h('span', { 'data-t': 'rh.bpm' }), h('input', { type: 'number', class: 'input', value: String(bpm), oninput: e => { bpm = Math.max(20, Math.min(300, +e.target.value || 60)); } })]),
        h('span', { class: 'muted', 'data-t': 'rh.dur' }), ed, h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'rh.saveTiming', onclick: () => { C.setRhythmTiming(r.id, { bpm, durations: durs }); PD.ui.toast(t('toast.saved')); PD.app.render(); } })])]));
    }

    /* ---- preview engine: look-ahead scheduler on the audio clock; visuals only read the clock ---- */
    let run = null, raf = 0;
    const per = r.timing.durations.reduce((a, b) => a + b, 0);
    const starts = []; r.timing.durations.reduce((a, d, i) => { starts[i] = a; return a + d; }, 0);
    function stroke(i, when) { const s = r.strokes[i]; PD.audio.strum([0, 0, 0], s.direction, { when, vel: s.accent ? 1 : .55, gap: s.accent ? .011 : .02 }); }
    function start() {
      if (!PD.audio.ensure()) return; const bps = +tempo.value / 60, t0 = PD.audio.now() + .15;
      run = { t0, bps, n: 0, b: 0 };
      run.iv = setInterval(() => {
        const nowT = PD.audio.now();
        while (true) { const c = Math.floor(run.n / r.strokes.length), i = run.n % r.strokes.length, when = run.t0 + (c * per + starts[i]) / run.bps; if (when > nowT + .2) break; stroke(i, when); run.n++; }
        while (true) { const when = run.t0 + run.b / run.bps; if (when > nowT + .2) break; if (metro.checked) PD.audio.click(when, Math.abs(run.b % per) < 1e-6); run.b++; }
      }, 25);
      play.textContent = t('rh.stop'); loop();
    }
    function stop() { meterStops.forEach(f => f()); if (!run) return; clearInterval(run.iv); run = null; cancelAnimationFrame(raf); play.textContent = t('rh.listen'); draw(-1); mark(-1); }
    play.onclick = () => run ? stop() : start();
    tempo.oninput = () => { bpmOut.textContent = tempo.value + ' BPM'; if (run) { stop(); start(); } };
    function mark(i) {
      row.querySelectorAll('.rh-card').forEach((c, k) => { c.classList.toggle('cur', k === i); c.classList.toggle('nx', i >= 0 && k === (i + 1) % r.strokes.length); });
      const lab = k => k < 0 ? '—' : (r.strokes[k].direction === 'down' ? '↓ ' : '↑ ') + t(r.strokes[k].direction === 'down' ? 'w.down' : 'w.up') + (r.strokes[k].accent ? ' · ' + t('rh.accent') : '');
      now.querySelector('.rn').textContent = lab(i); now.querySelector('.rn').style.color = i < 0 ? '' : r.strokes[i].accent ? RED : BLUE;
      now.querySelector('.rx').textContent = i < 0 ? lab(0) : lab((i + 1) % r.strokes.length);
    }
    /* stroke guide: the current stroke's direction as a moving path (no drawn hand) */
    function draw(i) {
      if (i < 0) { cv.className = 'rh-guide'; cv.innerHTML = ''; return; }
      const s = r.strokes[i], up = s.direction === 'up';
      cv.className = 'rh-guide pz-stroke ' + (up ? 'up' : 'down') + (s.accent ? ' acc' : '');
      cv.innerHTML = PD.practice.strokeSVG(up) + '<span class="pz-sa">' + (up ? '↑' : '↓') + '</span>';
    }
    function loop() {
      if (!run || !cv.isConnected) { if (run && !cv.isConnected) stop(); return; }
      raf = requestAnimationFrame(loop);
      const bt = (PD.audio.now() - run.t0) * run.bps; if (bt < 0) return;
      const inC = ((bt % per) + per) % per; let i = 0; for (let k = 0; k < starts.length; k++) if (inC >= starts[k] - 1e-6) i = k;
      if (row._i !== i) { row._i = i; mark(i); draw(i); }
    }
    requestAnimationFrame(() => { draw(-1); mark(-1); });
    const un = PD.bus.on('route', () => { stop(); un(); });
  }
  return { list, detail, patternRow, arrowSVG };
})();
