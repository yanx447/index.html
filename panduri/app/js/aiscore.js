/* Transcription score and constrained three-string arrangement. No audio is uploaded.
   Pitch and geometry come exclusively from the existing instrument/theory profile.
   Computed arrangements are suggestions, never teacher-authored technique. */
PD.aiScore = (() => {
  const T = PD.theory;
  function normalise(n, i = 0) {
    const m = Number(n.m ?? n.pitch), t0 = Number(n.t0 ?? n.onset), t1 = Number(n.t1 ?? (t0 + n.duration));
    if (!Number.isFinite(m) || m < 21 || m > 108 || !Number.isFinite(t0) || t0 < 0 || !Number.isFinite(t1) || t1 <= t0) throw Error('Invalid note');
    const conf = Math.max(0, Math.min(1, Number(n.conf ?? n.confidence ?? n.amp ?? 0)));
    return { ...n, id: n.id || 'note-' + i, m, pitch: m, octave: Math.floor(m / 12) - 1, t0, t1, onset: t0, duration: t1 - t0,
      velocity: Math.max(1, Math.min(127, Math.round(n.velocity ?? ((n.amp ?? .7) * 127)))), conf, confidence: conf };
  }
  const places = m => T.positions(m).map(p => ({ ...p, cents: (T.midi(p.s, p.f) - m) * 100 }));
  function shape(active, maxSpan = 3) {
    if (active.length > 3 || new Set(active.map(n => n.s)).size !== active.length) return null;
    const fr = [0, 0, 0]; active.forEach(n => { fr[n.s - 1] = n.f; });
    const fretted = fr.filter(f => f > 0);
    if (fretted.length && Math.max(...fretted) - Math.min(...fretted) > maxSpan) return null;
    const tf = T.teacherFingers(fr); if (!tf) return null;
    // A held fingertip must not change identity when a new voice enters.
    if (active.some(n => n.fi != null && n.f > 0 && n.fi !== tf.fingers[n.s - 1])) return null;
    return { fingers: tf.fingers, position: fretted.length ? Math.min(...fretted) : 0 };
  }
  /** Bounded beam search. Sustains reserve their strings until release. Unassignable
      notes remain in the original score with a reason, never transposed or deleted. */
  function map(input, opt = {}) {
    const ns = input.map(normalise).sort((a, b) => a.t0 - b.t0 || b.m - a.m);
    let states = [{ cost: 0, active: [], position: 0, tail: null }];
    for (const n of ns) {
      const candidates = places(n.m).filter(p => !n.lockPosition || (p.s === n.s && p.f === n.f));
      const next = [];
      for (const state of states) {
        const held = state.active.filter(a => a.t1 > n.t0);
        for (const p of candidates) {
          const v = { ...n, ...p, fi: undefined };
          const sh = shape([...held, v], opt.easy ? 2 : 3); if (!sh) continue;
          if (opt.easy && p.f > 7) continue;
          v.fi = sh.fingers[p.s - 1]; v.reach = true; v.reason = null;
          v.string = p.s; v.fret = p.f; v.finger = v.fi; v.position = sh.position;
          v.shift = sh.position - state.position; v.alt = places(n.m).filter(q => q.s !== p.s || q.f !== p.f);
          next.push({ cost: state.cost + Math.abs(v.shift) * 1.2 + p.f * .12 + (p.f ? .2 : 0), active: [...held, v], position: sh.position, tail: { note: v, prev: state.tail } });
        }
        const bad = { ...n, reach: false, s: 0, f: -1, fi: 0, string: null, fret: null, finger: null, alt: places(n.m), reason: candidates.length ? 'conflict' : 'range' };
        next.push({ ...state, active: held, cost: state.cost + 1000 + n.conf * 20, tail: { note: bad, prev: state.tail } });
      }
      next.sort((a, b) => a.cost - b.cost);
      const seen = new Set(); states = next.filter(s => { const key = s.position + ':' + s.active.map(n => n.id + '/' + n.s + '/' + n.f + '/' + n.fi).join(','); if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 24);
    }
    const out = []; for (let p = states[0]?.tail; p; p = p.prev) out.push(p.note);
    return out.reverse();
  }
  function melody(input) {
    const ns = input.map(normalise).sort((a, b) => a.t0 - b.t0 || b.m - a.m), out = [];
    for (const n of ns) { const last = out.at(-1); if (last && n.t0 < last.t1) { if (n.m <= last.m) continue; last.t1 = n.t0; } out.push({ ...n }); }
    return out.filter(n => n.t1 - n.t0 >= .04).map(normalise);
  }
  function arrange(input, mode, chords = []) {
    let base = mode === 'advanced' ? input.map(normalise) : melody(input);
    if (mode === 'fingerstyle') {
      const additions = [];
      base.forEach((n, i) => {
        const chord = chords.find(c => c.root >= 0 && c.t0 <= n.t0 && c.t1 > n.t0);
        const type = chord && T.CHORD_TYPES.find(x => x.k === chord.q);
        if (!type) return;
        const end = Math.min(n.t1, base[i + 1]?.t0 ?? n.t1, chord.t1);
        const trial = [n];
        // Candidate bass/harmony tones are explicitly generated from measured chords.
        for (const s of [1, 2]) {
          const opts = []; for (let f = 0; f <= 7; f++) { const m = T.midi(s, f); if (m < n.m && type.iv.some(iv => T.pc(m) === (chord.root + iv) % 12)) opts.push(m); }
          for (const m of opts) {
            if (trial.some(x => x.m === m)) continue;
            const v = normalise({ m, t0: n.t0, t1: end, id: n.id + '-h' + s, conf: 0, velocity: 65, generated: true, source: 'computed-arrangement' });
            const mapped = map([...trial, v]);
            if (mapped.every(x => x.reach)) { additions.push(v); trial.push(v); break; }
          }
        }
      });
      base = base.concat(additions);
    }
    const mapped = map(base, { easy: mode === 'easy' });
    return { notes: mode === 'advanced' || mode === 'original' ? mapped : mapped.filter(n => n.reach), omitted: mapped.filter(n => !n.reach), mode };
  }
  function beatAt(t, beats, bpm) {
    if (!beats || beats.length < 2) return t * (bpm || 100) / 60;
    let lo = 0, hi = beats.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (beats[mid] <= t) lo = mid; else hi = mid; }
    return lo + (t - beats[lo]) / (beats[lo + 1] - beats[lo]);
  }
  function secondsAt(b, beats, bpm) {
    if (!beats || beats.length < 2) return b * 60 / (bpm || 100);
    const k = Math.max(0, Math.min(beats.length - 2, Math.floor(b)));
    return beats[k] + (b - k) * (beats[k + 1] - beats[k]);
  }
  /** Complete metric voices on a sixteenth grid, split/tied at bars. Preserves
      every polyphonic voice and inserts rests, including silent bars. */
  function score(M) {
    const mt = M.metre || { num: 4, den: 4 }, perBar = mt.num * 4 / mt.den;
    const factor = mt.compound ? 1.5 : 1;
    const origin = Math.min(0, Math.round(beatAt(0, M.beats, M.bpm) * factor * 4) / 4);
    const qb = t => Math.max(0, Math.round((beatAt(t, M.beats, M.bpm) * factor - origin) * 4) / 4);
    const voices = [], timed = M.notes.map((n, i) => ({ n, i, start: qb(n.t0), end: Math.max(qb(n.t0) + .25, qb(n.t1)) })).sort((a, b) => a.start - b.start || b.n.m - a.n.m);
    for (const n of timed) { let v = voices.find(x => x.at(-1).end <= n.start); if (!v) voices.push(v = []); v.push(n); }
    if (!voices.length) voices.push([]);
    const length = Math.max(perBar, qb(M.dur || 0), ...timed.map(n => n.end)), bars = Math.ceil(length / perBar), out = [];
    const values = [[4, 'w'], [3, 'h.'], [2, 'h'], [1.5, 'q.'], [1, 'q'], [.75, 'e.'], [.5, 'e'], [.25, 's']];
    voices.forEach((voice, vi) => {
      let cursor = 0;
      function emit(start, end, note) {
        while (start < end - .001) {
          const bar = Math.floor((start + .001) / perBar), left = Math.min(end - start, (bar + 1) * perBar - start);
          const [len, val] = values.find(([v]) => v <= left + .001) || values.at(-1);
          out.push({ bar, voice: vi + 1, start, len, val, i: note?.i, n: note?.n, tieIn: !!note && start > note.start, tieOut: !!note && start + len < note.end - .001,
            time: secondsAt((start + origin) / factor, M.beats, M.bpm) });
          start = +(start + len).toFixed(5);
        }
      }
      voice.forEach(n => { emit(cursor, n.start); emit(n.start, n.end, n); cursor = n.end; }); emit(cursor, bars * perBar);
    });
    return { events: out, bars, perBar, voices: voices.length, at: t => (beatAt(t, M.beats, M.bpm) * factor - origin) };
  }
  function musicXML(M, title) {
    const S = score(M), esc = x => String(x).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
    let xml = '<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0"><work><work-title>' + esc(title || 'Fanduri') + '</work-title></work><part-list><score-part id="P1"><part-name>Fanduri</part-name></score-part></part-list><part id="P1">';
    for (let b = 0; b < S.bars; b++) {
      xml += '<measure number="' + (b + 1) + '">';
      if (!b) xml += '<attributes><divisions>4</divisions><time><beats>' + M.metre.num + '</beats><beat-type>' + M.metre.den + '</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes><direction><sound tempo="' + (M.bpm * (M.metre.compound ? 1.5 : 1)) + '"/></direction>';
      for (let v = 1; v <= S.voices; v++) {
        if (v > 1) xml += '<backup><duration>' + S.perBar * 4 + '</duration></backup>';
        S.events.filter(e => e.bar === b && e.voice === v).forEach(e => {
          const sp = e.n && PD.aimus.spell(e.n.m, M.key);
          xml += '<note>' + (sp ? '<pitch><step>' + sp.l + '</step>' + (sp.acc ? '<alter>' + (sp.acc === '♯' ? 1 : -1) + '</alter>' : '') + '<octave>' + sp.o + '</octave></pitch>' : '<rest/>') + '<duration>' + e.len * 4 + '</duration>';
          if (e.tieIn) xml += '<tie type="stop"/>'; if (e.tieOut) xml += '<tie type="start"/>';
          xml += '<voice>' + v + '</voice><type>' + ({ w: 'whole', h: 'half', q: 'quarter', e: 'eighth', s: '16th' }[e.val[0]]) + '</type>' + (e.val.includes('.') ? '<dot/>' : '');
          if (e.tieIn || e.tieOut || e.n?.reach) xml += '<notations>' + (e.tieIn ? '<tied type="stop"/>' : '') + (e.tieOut ? '<tied type="start"/>' : '') + (e.n?.reach ? '<technical><string>' + (4 - e.n.s) + '</string><fret>' + e.n.f + '</fret></technical>' : '') + '</notations>';
          xml += '</note>';
        });
      }
      xml += '</measure>';
    }
    return new Blob([xml + '</part></score-partwise>'], { type: 'application/vnd.recordare.musicxml+xml' });
  }
  return { normalise, places, shape, map, melody, arrange, score, musicXML, beatAt, secondsAt };
})();

PD.i18n.add({
  'as.workspace': ['სანოტო და TAB', 'Sheet & TAB'],
  'as.convert': ['ფანდურის TAB-ად გადაყვანა', 'Convert to Fanduri Tabs'],
  'as.fingers': ['აპლიკატურის შექმნა', 'Generate Fingering'],
  'as.fingerstyle': ['Fingerstyle არანჟირება', 'Make it Fingerstyle'],
  'as.original': ['საწყისი მელოდია', 'Original Melody'],
  'as.easy': ['დამწყები / მარტივი', 'Beginner / Easy'],
  'aisc.advanced': ['სრული პოლიფონია / რთული', 'Advanced'],   // not as.advanced: that key is the assistance level in app.js
  'as.arrangement': ['Fingerstyle არანჟირება', 'Fingerstyle Arrangement'],
  'as.variant': ['ვერსია', 'Version'],
  'as.draft': ['გამოთვლილი შეთავაზება — მასწავლებლის მიერ დაუდასტურებელი. დამატებული ჰარმონია ამოცნობილ აკორდებს ეყრდნობა; ორიგინალი აუდიო უცვლელია.', 'Computed suggestion — not teacher verified. Added harmony uses estimated chords; the source audio is unchanged.'],
  'as.limits': ['Basic Pitch · მოწყობილობაზე. სიზუსტის გარანტია არ არის: ხმაური, ვოკალი და რამდენიმე ინსტრუმენტი ზრდის შეცდომებს. Confidence მოდელის შეფასებაა და არა სიზუსტის პროცენტი. ზომა და რიტმი მიახლოებითია; შეამოწმე ნოტები.', 'Basic Pitch · on device. Noise, vocals and mixed instruments increase errors. Confidence is a model score, not an accuracy percentage. Metre and rhythm are estimates; review the notes.'],
  'as.failed': ['ML ტრანსკრიფცია ვერ შესრულდა. შეამოწმე მოდელის ხელმისაწვდომობა და სცადე ხელახლა. სპექტრული შედეგი მის ნაცვლად არ შექმნილა.', 'ML transcription failed. Check model availability and retry. No spectral result has been substituted.'],
  'as.omitted': ['გამოტოვებული ნოტები: {n}. ორიგინალი შენარჩუნებულია.', 'Omitted notes: {n}. The original is retained.'],
  'as.conflict': ['× — დიაპაზონის ან ერთდროული დაკვრის შეზღუდვა; ? — დაბალი confidence; + — დამატებული ჰარმონია.', '× — range or simultaneous fingering conflict; ? — low confidence; + — added harmony.'],
  'as.record': ['მიკროფონით ჩაწერა', 'Record microphone'],
  'as.recordStop': ['ჩაწერის დასრულება და ანალიზი', 'Stop recording & analyse'],
  'as.live': ['ცოცხალი ML წინასწარი ანალიზი · 4-წამიანი ფანჯარა, რამდენიმე წამის დაყოვნება', 'Live ML preview · 4-second windows, several seconds of latency'],
  'as.liveWaiting': ['ველოდები დაკვრას…', 'Waiting for playing…'],
  'as.recordHint': ['ცოცხალი ფანდური: წინასწარი ML ანალიზი 4-წამიან ფანჯრებზე. ჩაწერა მაქსიმუმ 5 წუთი; სრული ტრანსკრიფცია დასრულების შემდეგ. აუდიო მოწყობილობაზე რჩება.', 'Live fanduri: ML preview uses 4-second windows. Record up to 5 minutes, then transcribe the complete take. Audio stays on this device.'],
  'as.recordError': ['ჩაწერა ვერ მოხერხდა. შეამოწმე მიკროფონის ნებართვა და ბრაუზერის მხარდაჭერა.', 'Recording failed. Check microphone permission and browser support.'],
  'as.recording': ['იწერება · {n} / {max}', 'Recording · {n} / {max}'],
  'as.onset': ['დასაწყისი (წმ)', 'Onset (seconds)'],
  'as.duration': ['ხანგრძლივობა (წმ)', 'Duration (seconds)'],
  'as.apply': ['შენახვა', 'Apply'],
  'as.timingError': ['დრო უნდა იყოს აუდიოს ფარგლებში; ხანგრძლივობა — დადებითი.', 'Timing must be within the audio; duration must be positive.'],
  'as.shift': ['ხელის პოზიცია {p} · გადასვლა {s} ლადით', 'Hand position {p} · shift {s} frets'],
  'as.rest': ['პაუზა', 'Rest'],
  'as.pitchWarning': ['აუდიოს ტრანსპოზიცია ჩართულია. სანოტო და TAB საწყის სიმაღლეებს აჩვენებს.', 'Audio transposition is active. Sheet and TAB show original pitches.'],
  'as.tooLong': ['ტრანსკრიფციის ზღვარი: 5 წუთი. აირჩიე მოკლე ჩანაწერი ან დაყოფილი მონაკვეთი.', 'Transcription limit: 5 minutes. Choose a shorter recording or separated excerpt.'],
  'as.follow': ['ავტომატური გადახვევა', 'Auto-scroll'],
  'as.add': ['ნოტის დამატება კურსორთან', 'Add note at cursor'],
  'as.preview': ['მოსმენა: ფანდურის ვერსია', 'Listen: fanduri version'],
  'as.source': ['მოსმენა: ორიგინალი', 'Listen: source audio']
});

/** The existing neck renderer, with a metric SVG score and TAB on the same clock. */
PD.aiScore.workspace = function (M, o) {
  const h = PD.h, t = PD.i18n.t, A = PD.aiScore, S = A.score(M), dk = o.transport;
  const el = h('div', { class: 'as-workspace as-mode-' + (o.mode || 'tab') }), rows = [], svgNS = 'http://www.w3.org/2000/svg';
  const info = h('p', { class: 'as-finger-info', 'aria-live': 'polite' });
  const neckWrap = h('div', { class: 'neckview as-neck' }), canvas = h('canvas'); neckWrap.append(canvas);
  const neck = PD.Neck(canvas, { sticky: true }); neck.mirror = PD.store.get('lefty', false);
  const ro = new ResizeObserver(() => { if (!neckWrap.clientWidth) return; neckWrap.style.height = neck.natH(neckWrap.clientWidth) + 'px'; neck.layout(); }); ro.observe(neckWrap);
  let follow = true, last = '', lastBar = -1;
  const controls = h('div', { class: 'as-controls' });
  if (dk) {
    controls.append(h('button', { class: 'btn primary', text: '▶ / Ⅱ', 'aria-label': t('ws.play'), onclick: () => dk.toggle() }),
      h('button', { class: 'btn', text: '■', 'aria-label': t('ai.stop'), onclick: () => { dk.pause(); dk.seek(0); } }));
    [.5, .75, 1].forEach(v => controls.append(h('button', { class: 'chip', text: v + '×', onclick: () => dk.setSpeed(v) })));
    const met = h('button', { class: 'chip', text: t('ai.metro'), 'aria-pressed': String(dk.D.click.on), onclick: () => { dk.setClick(!dk.D.click.on); met.setAttribute('aria-pressed', String(dk.D.click.on)); } });
    let start = 0;
    controls.append(met, h('button', { class: 'chip', text: 'A', 'aria-label': t('ai.loopA'), onclick: () => { start = dk.pos(); } }),
      h('button', { class: 'chip', text: 'B', 'aria-label': t('ai.loopB'), onclick: () => { if (dk.pos() > start + .1) dk.setLoop(start, dk.pos()); } }),
      h('button', { class: 'chip', text: 'A–B ×', 'aria-label': t('ai.loopOff'), onclick: () => dk.clearLoop() }));
  }
  if (o.preview) {
    const preview = h('button', { class: 'chip', text: t('as.preview'), onclick: async () => { preview.disabled = true; try { await o.preview(M); } finally { preview.disabled = false; } } });
    controls.append(preview, h('button', { class: 'chip', text: t('as.source'), onclick: () => o.source() }));
  }
  const auto = h('button', { class: 'chip', text: t('as.follow'), 'aria-pressed': 'true', onclick: () => { follow = !follow; auto.setAttribute('aria-pressed', String(follow)); } }); controls.append(auto);
  const warning = h('p', { class: 'notice', text: t('as.pitchWarning'), hidden: true });
  el.append(warning);
  const sheets = h('div', { class: 'as-sheets' });
  for (let b = 0; b < S.bars; b++) {
    const width = Math.max(480, S.perBar * 120 + 100), x = beat => 78 + (beat - b * S.perBar) / S.perBar * (width - 104);
    const events = S.events.filter(e => e.bar === b), notes = events.filter(e => e.n || e.voice === 1).map(e => {
      const sp = e.n && PD.aimus.spell(e.n.m, M.key);
      return { ...(sp || {}), acc: sp ? (sp.acc || '♮') : '', x: x(e.start), d: e.val[0], dot: e.val.includes('.'), rest: !e.n ? e.val[0] : null,
        idx: e.i, dir: e.voice > 1 ? 'down' : 'up', tieIn: e.tieIn, tieOut: e.tieOut,
        label: e.n ? (e.n.generated ? '+' : e.n.conf < .5 ? '?' : '') : '', col: e.n && !e.n.reach ? '#df8c7d' : '#e6d8c5' };
    });
    const steps = notes.filter(n => !n.rest).map(n => PD.notesArt.step(n.l, n.o));
    const top = Math.max(65, Math.max(0, ...steps) * 5), height = Math.max(190, top + 40 - Math.min(0, ...steps) * 5 + 45);
    const row = h('div', { class: 'as-system' }, [h('small', { text: t('tr.bar', { n: b + 1 }) })]);
    const content = h('div', { class: 'as-system-content', style: 'width:' + width + 'px', html: PD.notesArt.staff(notes, { width, height, top, time: [M.metre.num, M.metre.den], end: true, label: t('tr.vStaff') }) });
    const tab = document.createElementNS(svgNS, 'svg'); tab.setAttribute('viewBox', '0 0 ' + width + ' 112'); tab.classList.add('as-tab');
    function node(tag, attrs, text) { const n = document.createElementNS(svgNS, tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); if (text != null) n.textContent = text; tab.append(n); return n; }
    [3, 2, 1].forEach((s, i) => { const y = 24 + i * 30; node('line', { x1: 60, x2: width - 20, y1: y, y2: y, stroke: '#706258' }); node('text', { x: 8, y: y + 5, fill: PD.theory.color(s) }, PD.theory.stringName(s)); });
    events.filter(e => e.n).forEach(e => {
      const y = e.n.reach ? 24 + (3 - e.n.s) * 30 : 100;
      const g = node('g', { 'data-i': e.i, role: 'button', tabindex: 0, 'aria-label': PD.theory.name(e.n.m) + ' · ' + (e.n.reach ? e.n.s + '/' + e.n.f : t('tr.unplay')) });
      const bg = document.createElementNS(svgNS, 'rect'); Object.entries({ x: x(e.start) - 12, y: y - 15, width: 26, height: 27, rx: 5, fill: '#201a17' }).forEach(([k, v]) => bg.setAttribute(k, v)); g.append(bg);
      const text = document.createElementNS(svgNS, 'text'); text.setAttribute('x', x(e.start)); text.setAttribute('y', y + 5); text.setAttribute('text-anchor', 'middle'); text.setAttribute('fill', '#e6d8c5'); text.textContent = e.n.reach ? e.n.f : '×'; g.append(text);
    });
    content.append(tab);
    content.querySelectorAll('[data-i]').forEach(n => { const act = () => o.select(Number(n.dataset.i)); n.onclick = act; n.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } }; });
    const cursor = h('i', { class: 'as-cursor' }); content.append(cursor); row.append(content); sheets.append(row); rows.push({ row, cursor, x });
  }
  el.append(sheets);
  if (o.mode !== 'staff') el.append(PD.aiUI.fold('apr.neck', [neckWrap, info], true));
  el.append(PD.aiUI.fold('apr.controls', [controls, h('p', { class: 'muted', text: t('as.conflict') })]));
  function tick(p) {
    const beat = Math.max(0, S.at(p)), bar = Math.min(rows.length - 1, Math.floor(beat / S.perBar));
    rows.forEach((r, i) => { r.cursor.hidden = i !== bar; if (i === bar) { r.cursor.style.left = r.x(beat) + 'px'; if (follow && (r.x(beat) < r.row.scrollLeft || r.x(beat) > r.row.scrollLeft + r.row.clientWidth - 45)) r.row.scrollLeft = Math.max(0, r.x(beat) - r.row.clientWidth / 3); } });
    if (bar !== lastBar && el.isConnected && follow) { if (lastBar >= 0) rows[bar]?.row.scrollIntoView({ block: 'nearest' }); lastBar = bar; }
    const active = M.notes.map((n, i) => ({ n, i })).filter(({ n }) => n.t0 <= p && n.t1 > p), key = active.map(x => x.i).join(',');
    if (key !== last) {
      last = key; el.querySelectorAll('.now').forEach(x => x.classList.remove('now'));
      active.forEach(({ i }) => el.querySelectorAll('[data-i="' + i + '"]').forEach(x => x.classList.add('now')));
      const playable = active.map(x => x.n).filter(n => n.reach);
      const next = M.notes.filter(n => n.reach && n.t0 > p).slice(0, 1);
      neck.setTarget(playable.map(n => ({ s: n.s, f: n.f, fi: n.fi })), next.map(n => ({ s: n.s, f: n.f, fi: n.fi })));
      info.textContent = playable.length ? playable.map(n => PD.theory.name(n.m) + ' · ' + n.s + '/' + n.f + ' · ' + (n.fi || '0')).join('  |  ') + ' · ' + t('as.shift', { p: playable.at(-1).position || 0, s: playable.at(-1).shift || 0 }) : t('as.rest');
    }
    warning.hidden = !dk?.D.semis; neck.draw();
  }
  return { el, tick, draw() {}, stop() { ro.disconnect(); neck.destroy(); } };
};

/** Four-second rolling ML windows, one inference in flight. UI never runs the model.
    Preview intentionally has several seconds of latency; full recording is reanalysed
    afterwards to resolve window-boundary notes. No preview notes replace the source. */
PD.aiScore.liveMonitor = async function (stream, base, onNotes, onError) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 22050 });
  let model, job = null, ended = false, node = null, source = null;
  const code = `class PanduriCapture extends AudioWorkletProcessor {
    constructor() { super(); this.size=Math.round(sampleRate*4); this.hop=Math.round(sampleRate*3); this.data=new Float32Array(this.size); this.used=0; this.total=0; }
    process(inputs) { const x=inputs[0]?.[0]; if(!x)return true;
      for(let i=0;i<x.length;i++){this.data[this.used++]=x[i];this.total++;
        if(this.used===this.size){const copy=this.data.slice();this.port.postMessage({audio:copy,rate:sampleRate,offset:(this.total-this.size)/sampleRate},[copy.buffer]);this.data.copyWithin(0,this.hop);this.used=this.size-this.hop;}}
      return true; }
  } registerProcessor('panduri-live-capture',PanduriCapture);`;
  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  const stop = () => { if (ended) return; ended = true; model?.close(); if (node) { node.port.onmessage = null; node.disconnect(); } source?.disconnect(); ctx.close().catch(() => {}); };
  try {
    await ctx.audioWorklet.addModule(url); source = ctx.createMediaStreamSource(stream);
    node = new AudioWorkletNode(ctx, 'panduri-live-capture'); const silent = ctx.createGain(); silent.gain.value = 0;
    source.connect(node); node.connect(silent); silent.connect(ctx.destination);
    node.port.onmessage = async e => {
      if (ended || job) return;
      const { audio, rate, offset } = e.data;
      const mono = rate === 22050 ? audio : Float32Array.from({ length: Math.floor(audio.length * 22050 / rate) }, (_, i) => {
        const at = i * rate / 22050, first = Math.floor(at), second = Math.min(audio.length - 1, first + 1);
        return audio[first] + (audio[second] - audio[first]) * (at - first);
      });
      try {
        model ||= PD.aimus.pitchWorker(base);
        job = model.run(mono);
        const result = await job;
        if (!ended) onNotes(result.notes.map((n, i) => PD.aiScore.normalise({ ...n, t0: n.t0 + offset, t1: n.t1 + offset }, i)));
      } catch (err) {
        if (!ended) { stop(); onError(err); }
      } finally { job = null; }
    };
    await ctx.resume(); return { stop };
  } catch (err) { stop(); throw err; } finally { URL.revokeObjectURL(url); }
};

/** Audible practice version. Offline Web Audio render uses the current tuning and
    exact note onsets; source audio is retained separately by the owning deck. */
PD.aiScore.renderAudio = async function (M) {
  const sr = 22050, ctx = new OfflineAudioContext(1, Math.max(1, Math.ceil(M.dur * sr)), sr);
  M.notes.filter(n => n.reach).forEach(n => {
    const start = n.t0, end = Math.min(M.dur, n.t1); if (end <= start) return;
    const gain = ctx.createGain(), osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = PD.theory.freq(PD.theory.midi(n.s, n.f));
    const level = Math.min(.18, (n.velocity || 90) / 127 * .15);
    gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(level, Math.min(end, start + .005));
    gain.gain.exponentialRampToValueAtTime(.001, end); osc.connect(gain); gain.connect(ctx.destination); osc.start(start); osc.stop(end);
  });
  return (await ctx.startRendering()).getChannelData(0);
};
