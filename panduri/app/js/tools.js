/* =====================================================================
   Tools: premium tuner, chord explorer, fretboard explorer (+ "find
   this note"), 3D instrument explorer with clickable parts and a guided
   tour. Every tool that opens the microphone closes it when you leave.
   ===================================================================== */
PD.i18n.add({
  'tu.title': ['ტიუნერი', 'Tuner'], 'tu.auto': ['ავტო', 'Auto'], 'tu.manual': ['სიმის არჩევა', 'Pick string'],
  'tu.start': ['მიკროფონის ჩართვა', 'Turn on microphone'], 'tu.stop': ['გამორთვა', 'Turn off'],
  'tu.idle': ['დაუკარი ერთი სიმი', 'Pluck one string'], 'tu.inTune': ['✓ აწყობილია', '✓ In tune'], 'tu.up': ['↑ ოდნავ მოუჭირე (ბგერა დაბალია)', '↑ Tighten a little (flat)'],
  'tu.down': ['↓ ოდნავ მოუშვი (ბგერა მაღალია)', '↓ Loosen a little (sharp)'], 'tu.far': ['შორსაა — შეამოწმე, სწორ სიმს უკრავ თუ არა', 'Far off — check you are plucking the right string'],
  'tu.unsure': ['სიგნალი არასტაბილურია — დაუკარი ხმამაღლა, სხვა სიმები დაადუმე', 'Signal unstable — pluck firmly and mute the other strings'],
  'tu.ref': ['საცნობარო ბგერა', 'Reference tone'], 'tu.hist': ['ისტორია (ცენტი)', 'History (cents)'], 'tu.a4': ['A4 = {f} Hz', 'A4 = {f} Hz'],
  'tu.sens': ['მგრძნობელობა', 'Sensitivity'], 'tu.preset': ['აწყობა', 'Tuning'], 'tu.custom': ['საკუთარი აწყობა', 'Custom tuning'], 'tu.addCustom': ['დამატება', 'Add'],
  'tu.customWarn': ['გაკვეთილები სტანდარტულ A · C♯ · E აწყობაზეა დაწერილი. სხვა აწყობით ლადები იგივე დარჩება, ბგერები კი შეიცვლება.', 'Lessons are written for standard A · C♯ · E. In another tuning the frets stay the same but the pitches change.'],
  'tu.name': ['სახელი', 'Name'], 'tu.level': ['შემავალი სიგნალი', 'Input level'], 'tu.locked': ['დაფიქსირდა', 'Locked'],
  'ce.title': ['აკორდები', 'Chords'], 'ce.search': ['მოძებნე აკორდი (A, Bm, …)', 'Search chord (A, Bm, …)'], 'ce.maj': ['მაჟორი', 'Major'], 'ce.min': ['მინორი', 'Minor'],
  'ce.play': ['▶ ჩამოკვრა', '▶ Strum'], 'ce.string': ['▶ {s} სიმი', '▶ {s} string'], 'ce.trans': ['გადასვლის სავარჯიშო', 'Transition exercise'],
  'ce.to': ['მეორე აკორდი', 'Second chord'], 'ce.notes': ['ბგერები', 'Notes'], 'ce.fingers': ['თითები', 'Fingers'],
  'ce.majD': ['A · C♯ · E აწყობა თავად მაჟორული სამხმოვანებაა: ყველა სიმი ერთ ლადზე (ბარე) მაჟორს იძლევა.', 'A · C♯ · E is itself a major triad: all strings on one fret (barre) give a major chord.'],
  'ce.minD': ['მინორი: შუა (C♯) სიმი ერთი ლადით დაბლა — მესამე საფეხური ნახევარი ტონით ეცემა.', 'Minor: the middle (C♯) string one fret lower — the third drops a semitone.'],
  'ce.demo': ['ბგერები ინსტრუმენტის აწყობიდან არის გამოთვლილი. თითების ნომრები სადემონსტრაციოა — მასწავლებლის მიერ არ არის დამოწმებული.', 'Pitches are computed from the instrument tuning. Finger numbers are demo — not verified by the teacher.'],
  'ce.openD': ['ღია სიმები — A მაჟორი.', 'Open strings — A major.'], 'ce.none': ['ვერ მოიძებნა', 'Nothing found'],
  'fx.title': ['ტარის მკვლევარი', 'Fretboard explorer'], 'fx.names': ['სახელები', 'Names'], 'fx.ka': ['ქართ.', 'Georgian'], 'fx.oct': ['ოქტავა', 'Octave'], 'fx.none': ['არაფერი', 'None'],
  'fx.scale': ['გამა', 'Scale'], 'fx.root': ['ტონიკა', 'Root'], 'sc.none': ['არა', 'None'], 'sc.major': ['მაჟორი', 'Major'], 'sc.minor': ['ნატურალური მინორი', 'Natural minor'], 'sc.penta': ['მაჟორული პენტატონიკა', 'Major pentatonic'], 'sc.mpenta': ['მინორული პენტატონიკა', 'Minor pentatonic'],
  'fx.same': ['იგივე ბგერა: {p}', 'Same pitch: {p}'], 'fx.find': ['იპოვე ეს ნოტი', 'Find this note'], 'fx.findGo': ['თამაშის დაწყება', 'Start game'], 'fx.findStop': ['დასრულება', 'Stop'],
  'fx.target': ['იპოვე: {n}', 'Find: {n}'], 'fx.exact': ['ზუსტი ოქტავა', 'Exact octave'], 'fx.any': ['ნებისმიერი ოქტავა', 'Any octave'], 'fx.score': ['{a}/{b} · სერია {s}', '{a}/{b} · streak {s}'],
  'fx.right': ['✓ სწორია', '✓ Correct'], 'fx.wrong': ['× ეს არის {n}', '× That is {n}'], 'fx.micHint': ['შეგიძლია ფანდურზეც დაუკრა — მიკროფონი ბგერას შეამოწმებს (სიმს ვერ განსაზღვრავს).', 'You can also play it on the panduri — the mic checks the pitch (it cannot tell which string).'],
  'x3.title': ['ფანდური 3D-ში', 'Panduri in 3D'], 'x3.reset': ['თავდაპირველი ხედი', 'Reset view'], 'x3.rotate': ['ბრუნვა', 'Rotate'], 'x3.labels': ['წარწერები', 'Labels'], 'x3.tour': ['როგორ მუშაობს ფანდური?', 'How does the panduri work?'],
  'x3.tap': ['შეეხე ტარს — ნოტი დაიკვრება. გადაატრიალე თითით/მაუსით, გაადიდე ორი თითით/ბორბლით.', 'Tap the neck to play a note. Drag to rotate, pinch or wheel to zoom.'],
  'x3.note': ['{n} · {s} სიმი · ლადი {f}', '{n} · {s} string · fret {f}'], 'x3.step': ['{a} / {b}', '{a} / {b}'],
  'x3.t0': ['სიმი ირხევა — ის, სადაც თითი აჭერს, ვიბრაციის საწყისი წერტილია. რაც მოკლეა რხევადი ნაწილი, მით მაღალია ბგერა.', 'The string vibrates from where the finger presses it. The shorter the vibrating part, the higher the pitch.'],
  'x3.t9': ['ასე: სიმი → ხიდი → დეკა → ჰაერი ტანში → ხვრელი. ახლა სცადე: შეეხე ნებისმიერ ლადს.', 'So: string → bridge → soundboard → air in the body → sound hole. Now try it: tap any fret.']
});

PD.tools = (() => {
  const TH = PD.theory, LS = PD.lessons, h = PD.h, ic = PD.ic;
  const SCOL = ['', '#D9783F', '#78B7DE', '#EFE0B8'];
  /** run fn(off) and release resources when the route changes */
  function scope() { const offs = []; const un = PD.bus.on('route', () => { offs.forEach(f => { try { f(); } catch (_) {} }); un(); }); return f => offs.push(f); }
  const header = (w, k) => w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="back"></span>', onclick: () => PD.app.go('tools') }), h('h1', { 'data-t': k, style: 'margin:0' })]));

  /* =================== TUNER =================== */
  function tuner(w) {
    const own = scope();
    header(w, 'tu.title');
    let mode = 'auto', sel = 1, hist = [], frames = [], lockT = 0, locked = false, lastP = 0, wasOn = PD.detector.active;
    const box = h('div', { class: 'tuner' });
    const card = h('div', { class: 'card gauge' });
    const svg = h('div', { html: gaugeSVG() });
    const nn = h('div', { class: 'tnote', text: '—', 'aria-live': 'polite' }), rd = h('div', { class: 'tread', text: '— Hz · — ¢' }), msg = h('div', { class: 'tmsg', role: 'status', 'aria-live': 'polite', 'data-t': 'tu.idle' });
    const strs = h('div', { class: 'tstr', role: 'group', 'aria-label': t('tu.manual') });
    const modeSeg = h('div', { class: 'seg', role: 'group' }, [['auto', 'tu.auto'], ['manual', 'tu.manual']].map(([m, k]) => h('button', { 'aria-pressed': String(m === mode), 'data-t': k, onclick: e => { mode = m; modeSeg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); drawStr(); } })));
    const micBtn = h('button', { class: 'btn primary', html: ic.mic + '<span></span>', onclick: () => { if (PD.detector.active) { PD.detector.stop(); } else PD.practice.micOn(() => upd()); } });
    const lvl = h('div', { class: 'bar', style: 'width:140px', title: t('tu.level') }, [h('i', { style: 'width:0;background:var(--ok)' })]);
    const spark = h('div', { role: 'img', 'aria-label': t('tu.hist') });
    card.append(h('div', { class: 'row', style: 'justify-content:space-between;width:100%' }, [modeSeg, h('div', { class: 'row' }, [h('span', { class: 'muted', style: 'font-size:12px', 'data-t': 'tu.level' }), lvl])]), svg, nn, rd, msg, strs, h('div', { class: 'row' }, [micBtn]),
      h('div', { style: 'width:100%' }, [h('span', { class: 'kicker', 'data-t': 'tu.hist' }), spark]));
    // side panel: reference tones, A4, sensitivity, tunings
    const side = h('div', { style: 'display:flex;flex-direction:column;gap:16px' });
    const refs = h('div', { class: 'row' });
    const a4in = h('input', { type: 'number', min: '415', max: '466', step: '1', value: String(TH.a4()), class: 'input', style: 'width:110px', 'aria-label': 'A4', onchange: e => { const v = Math.max(415, Math.min(466, +e.target.value || 440)); PD.store.set('a4', v); e.target.value = v; drawStr(); } });
    const sens = h('input', { type: 'range', min: '0', max: '100', value: String(PD.detector.calib.sens == null ? 60 : PD.detector.calib.sens), 'aria-label': t('tu.sens'), oninput: e => PD.detector.setCalib({ sens: +e.target.value }) });
    const tsel = h('select', { class: 'input', 'aria-label': t('tu.preset'), onchange: e => { TH.setTuning(e.target.value); drawStr(); } }, TH.TUNINGS.map(x => h('option', { value: x.id, text: PD.i18n.pick(x.name), selected: x.id === TH.tuning.id })));
    side.append(h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, [h('b', { 'data-t': 'tu.ref' }), refs]),
      h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, [h('b', { 'data-t': 'tu.preset' }), tsel, h('p', { class: 'muted', style: 'font-size:12px', 'data-t': 'tu.customWarn' }), h('button', { class: 'btn small', 'data-t': 'tu.custom', onclick: customSheet })]),
      h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, [h('label', { class: 'field' }, [h('span', { text: 'A4 (Hz)' }), a4in]), h('label', { class: 'field' }, [h('span', { 'data-t': 'tu.sens' }), sens])]));
    box.append(card, side); w.append(box);

    function drawStr() {
      strs.innerHTML = ''; refs.innerHTML = '';
      [1, 2, 3].forEach(s => {
        const m = TH.open(s);
        const b = h('button', { 'aria-pressed': String(mode === 'manual' && sel === s), style: 'color:' + SCOL[s] + ';position:relative', html: '<b>' + TH.pcName(m) + '</b><small>' + TH.name(m) + ' · ' + TH.freq(m).toFixed(1) + ' Hz</small>', onclick: () => { mode = 'manual'; sel = s; modeSeg.querySelectorAll('button').forEach((x, i) => x.setAttribute('aria-pressed', String(i === 1))); drawStr(); } });
        strs.appendChild(b);
        refs.appendChild(h('button', { class: 'btn small', text: '▶ ' + TH.pcName(m), onclick: () => { PD.audio.ensure(); PD.audio.tone(m, 2.2); } }));
      });
    }
    function customSheet() {
      PD.ui.sheet((b, close) => {
        const opts = []; for (let m = 50; m <= 72; m++) opts.push(m);
        const sels = [57, 61, 64].map((d, i) => h('select', { class: 'input', 'aria-label': String(i + 1) }, opts.map(m => h('option', { value: String(m), text: TH.name(m), selected: m === TH.tuning.strings[i] }))));
        const nm = h('input', { class: 'input', placeholder: t('tu.name') });
        b.append(h('h2', { 'data-t': 'tu.custom' }), h('p', { class: 'muted', 'data-t': 'tu.customWarn' }), h('div', { class: 'row' }, sels), nm,
          h('div', { class: 'row' }, [h('button', { class: 'btn primary', 'data-t': 'tu.addCustom', onclick: () => {
            const strings = sels.map(s => +s.value), name = nm.value.trim() || strings.map(m => TH.pcName(m)).join(' '), id = 'c' + Date.now().toString(36);
            const tu = { id, name: { ka: name, en: name }, strings }; const all = PD.store.get('tunings.custom', []); all.push(tu); PD.store.set('tunings.custom', all); TH.TUNINGS.push(tu); TH.setTuning(id);
            tsel.appendChild(h('option', { value: id, text: name, selected: true })); drawStr(); close();
          } }), h('button', { class: 'btn', 'data-t': 'cancel', onclick: close })]));
      });
    }
    function gaugeSVG() {
      let ticks = '';
      for (let c = -50; c <= 50; c += 5) { const a = c / 50 * 60 * Math.PI / 180, r1 = c % 25 === 0 ? 118 : 126, x1 = 160 + Math.sin(a) * r1, y1 = 150 - Math.cos(a) * r1, x2 = 160 + Math.sin(a) * 136, y2 = 150 - Math.cos(a) * 136; ticks += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + (c === 0 ? '#9AD7AE' : 'rgba(242,232,218,.35)') + '" stroke-width="' + (c % 25 === 0 ? 2 : 1) + '"/>'; }
      const lab = [-50, -25, 0, 25, 50].map(c => { const a = c / 50 * 60 * Math.PI / 180; return '<text x="' + (160 + Math.sin(a) * 104).toFixed(1) + '" y="' + (154 - Math.cos(a) * 104).toFixed(1) + '" fill="rgba(242,232,218,.5)" font-size="10" text-anchor="middle" font-family="IBM Plex Mono">' + (c > 0 ? '+' : '') + c + '</text>'; }).join('');
      return '<svg viewBox="0 0 320 170" role="img" aria-label="cents"><path d="M' + (160 - Math.sin(Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(Math.PI / 3) * 136).toFixed(1) + ' A136 136 0 0 1 ' + (160 + Math.sin(Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(Math.PI / 3) * 136).toFixed(1) + '" fill="none" stroke="rgba(242,232,218,.12)" stroke-width="10"/><path id="tuOk" d="M' + (160 - Math.sin(5 / 50 * Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(5 / 50 * Math.PI / 3) * 136).toFixed(1) + ' A136 136 0 0 1 ' + (160 + Math.sin(5 / 50 * Math.PI / 3) * 136).toFixed(1) + ' ' + (150 - Math.cos(5 / 50 * Math.PI / 3) * 136).toFixed(1) + '" fill="none" stroke="#3F6B4C" stroke-width="10"/>' + ticks + lab +
        '<g id="tuNeedle" style="transition:transform .12s linear;transform-origin:160px 150px"><line x1="160" y1="150" x2="160" y2="22" stroke="#F2E8DA" stroke-width="2.5" stroke-linecap="round"/></g><circle cx="160" cy="150" r="6" fill="#F2E8DA"/></svg>';
    }
    const needle = () => svg.querySelector('#tuNeedle');
    function setNeedle(c) { const n = needle(); if (n) n.style.transform = 'rotate(' + (Math.max(-50, Math.min(50, c)) / 50 * 60) + 'deg)'; }
    function upd() {
      const on = PD.detector.active;
      micBtn.lastChild.textContent = t(on ? 'tu.stop' : 'tu.start'); micBtn.classList.toggle('primary', !on);
    }
    function onPitch(m) {
      if (!(m.f > 0) || m.conf < .8) return;
      lastP = performance.now();
      frames.push(m.f); if (frames.length > 5) frames.shift();
      const f = frames.slice().sort((a, b) => a - b)[Math.floor(frames.length / 2)], mm = TH.midiOf(f);
      let target;
      if (mode === 'manual') target = TH.open(sel);
      else { target = TH.open(1); let best = 99; [1, 2, 3].forEach(s => { const d = Math.abs(mm - TH.open(s)); if (d < best) { best = d; target = TH.open(s); } }); if (best > 2.5) target = Math.round(mm); }
      const c = (mm - target) * 100;
      nn.textContent = TH.pcName(target); nn.style.color = Math.abs(c) <= 5 ? 'var(--ok)' : Math.abs(c) <= 20 ? 'var(--almost)' : 'var(--fix)';
      rd.textContent = f.toFixed(1) + ' Hz · ' + (c >= 0 ? '+' : '') + c.toFixed(0) + ' ¢ · ' + TH.freq(target).toFixed(1) + ' Hz';
      setNeedle(c);
      const ac = Math.abs(c);
      if (ac <= 5) { if (!lockT) lockT = performance.now(); if (performance.now() - lockT > 600 && !locked) { locked = true; PD.audio.ok && PD.audio.ok(); } }
      else { lockT = 0; locked = false; }
      msg.textContent = locked || ac <= 5 ? t('tu.inTune') + (locked ? ' · ' + t('tu.locked') : '') : ac > 300 ? t('tu.far') : c < 0 ? t('tu.up') : t('tu.down');
      msg.style.color = ac <= 5 ? 'var(--ok)' : ac <= 20 ? 'var(--almost)' : 'var(--fix)';
      strs.querySelectorAll('button').forEach((b, i) => b.classList.toggle('intune', TH.open(i + 1) === target && ac <= 5));
      hist.push(Math.max(-50, Math.min(50, c))); if (hist.length > 120) hist.shift();
      spark.innerHTML = '<svg class="spark" viewBox="0 0 240 46" preserveAspectRatio="none"><line x1="0" x2="240" y1="23" y2="23" stroke="#3F6B4C" stroke-width="1"/><polyline fill="none" stroke="#D6A15A" stroke-width="1.5" points="' + hist.map((v, i) => (i * 2).toFixed(0) + ',' + (23 - v * .44).toFixed(1)).join(' ') + '"/></svg>';
    }
    own(PD.detector.on('pitch', onPitch));
    own(PD.detector.on('note', m => { if (m.unsure && performance.now() - lastP > 700) { msg.textContent = t('tu.unsure'); msg.style.color = 'var(--almost)'; } }));
    own(PD.detector.on('level', m => { lvl.firstChild.style.width = Math.min(100, Math.sqrt(m.rms) * 260) + '%'; }));
    own(PD.detector.on('state', upd));
    own(() => { if (PD.detector.active && !wasOn) PD.detector.stop(); });   // leaving the tuner releases the mic it opened
    drawStr(); upd();
  }

  /* =================== CHORD EXPLORER =================== */
  function chordDiagram(c) {
    // player view: E on top, A at the bottom; frets left → right
    const lo = Math.max(1, Math.min(...c.frets.filter(f => f > 0), 99) === 99 ? 1 : Math.min(...c.frets.filter(f => f > 0))), span = 4, first = lo <= 2 ? 1 : lo;
    const W = 380, H = 170, x0 = 50, x1 = 360, y = s => 140 - (s - 1) * 50, fx = n => x0 + (n - first + 1) * (x1 - x0) / span;
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + PD.esc(c.name + ' ' + c.frets.join('-')) + '">';
    s += '<rect x="' + x0 + '" y="' + (y(3) - 14) + '" width="' + (x1 - x0) + '" height="' + (y(1) - y(3) + 28) + '" rx="6" fill="#2A1D14"/>';
    if (first === 1) s += '<rect x="' + (x0 - 4) + '" y="' + (y(3) - 14) + '" width="6" height="' + (y(1) - y(3) + 28) + '" fill="#EFE0B8"/>';
    for (let n = first; n < first + span; n++) s += '<line x1="' + fx(n) + '" x2="' + fx(n) + '" y1="' + (y(3) - 14) + '" y2="' + (y(1) + 14) + '" stroke="#B9B2A6" stroke-width="2"/><text x="' + ((fx(n) + fx(n - 1)) / 2) + '" y="' + (H - 2) + '" fill="rgba(242,232,218,.5)" font-size="11" text-anchor="middle" font-family="IBM Plex Mono">' + n + '</text>';
    [1, 2, 3].forEach(k => { s += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y(k) + '" y2="' + y(k) + '" stroke="' + SCOL[k] + '" stroke-width="' + (4 - k * .6) + '"/><text x="' + (x0 - 20) + '" y="' + (y(k) + 4) + '" fill="' + SCOL[k] + '" font-size="13" text-anchor="middle" font-family="IBM Plex Mono">' + TH.stringName(k) + '</text>'; });
    if (c.barre && c.frets[0] > 0) { const cx = (fx(c.frets[0]) + fx(c.frets[0] - 1)) / 2 + 8; s += '<rect x="' + (cx - 13) + '" y="' + (y(3) - 13) + '" width="26" height="' + (y(1) - y(3) + 26) + '" rx="13" fill="#E3C2A6"/><text x="' + cx + '" y="' + (y(2) + 5) + '" fill="#140D08" font-size="15" font-weight="700" text-anchor="middle" font-family="IBM Plex Mono">1</text>'; }
    else c.frets.forEach((f, i) => { const k = i + 1; if (f > 0) { const cx = (fx(f) + fx(f - 1)) / 2 + 8; s += '<circle cx="' + cx + '" cy="' + y(k) + '" r="14" fill="' + SCOL[k] + '"/><text x="' + cx + '" y="' + (y(k) + 5) + '" fill="#140D08" font-size="14" font-weight="700" text-anchor="middle" font-family="IBM Plex Mono">' + (c.fingers[i] || '') + '</text>'; } else s += '<circle cx="' + (x0 - 2) + '" cy="' + y(k) + '" r="7" fill="none" stroke="' + SCOL[k] + '" stroke-width="2"/>'; });
    return s + '</svg>';
  }
  function chords(w, param) {
    const own = scope();
    header(w, 'ce.title');
    const all = PD.curriculum.chords(); let cur = all.find(c => c.id === param) || all[0], q = '';
    const search = h('input', { class: 'input', type: 'search', 'data-t-ph': 'ce.search', 'aria-label': t('ce.search'), oninput: e => { q = e.target.value.trim().toLowerCase(); grid(); } });
    const g = h('div', { class: 'cgrid', role: 'listbox', 'aria-label': t('ce.title') });
    const detail = h('div', { style: 'display:flex;flex-direction:column;gap:14px' });
    // the same neck and finger markers as the lessons, showing one still chord
    const nv = h('div', { class: 'neckview' }), ncv = h('canvas', { 'aria-label': t('ce.title') }); nv.appendChild(ncv);
    const view = PD.Neck(ncv, { frets: 7 }); view.mirror = PD.store.get('lefty', false);
    let raf = 0; const loop = () => { raf = requestAnimationFrame(loop); if (!document.hidden && !PD.practice.active) view.draw(); };
    requestAnimationFrame(() => { view.layout(); raf = requestAnimationFrame(loop); }); own(() => { cancelAnimationFrame(raf); view.destroy(); });
    const ro = new ResizeObserver(() => { view.layout(); show && preview(cur); }); ro.observe(nv); own(() => ro.disconnect());
    const preview = c => view.setTarget(c.frets.map((f, k) => ({ s: k + 1, f, fi: c.fingers[k] || 0 })), []);
    const layout = h('div', { style: 'display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:24px', class: 'ce-l' }, [h('div', { style: 'display:flex;flex-direction:column;gap:12px' }, [search, g]), h('div', { style: 'display:flex;flex-direction:column;gap:14px' }, [detail])]);
    w.append(nv, layout);
    const mq = matchMedia('(max-width:900px)'); const fit = () => { layout.style.gridTemplateColumns = mq.matches ? '1fr' : 'minmax(0,1fr) minmax(0,1.3fr)'; }; fit(); mq.addEventListener('change', fit); own(() => mq.removeEventListener('change', fit));
    function grid() {
      g.innerHTML = '';
      const list = all.filter(c => !q || c.name.toLowerCase().includes(q) || c.name.toLowerCase().replace('♯', '#').includes(q));
      if (!list.length) g.appendChild(h('span', { class: 'muted', 'data-t': 'ce.none', text: t('ce.none') }));
      list.forEach(c => g.appendChild(h('button', { role: 'option', 'aria-selected': String(c === cur), 'aria-pressed': String(c === cur), text: c.name + (c.frets[0] >= 12 ? ' ·12' : ''), onclick: () => { cur = c; grid(); show(); } })));
    }
    function show() {
      detail.innerHTML = '';
      const ms = c => c.frets.map((f, i) => TH.midi(i + 1, f));
      const i = all.indexOf(cur), other = h('select', { class: 'input', 'aria-label': t('ce.to') }, all.filter(c => c !== cur).map(c => h('option', { value: c.id, text: c.name })));
      const desc = cur.frets.every(f => f === 0) ? t('ce.openD') : cur.kind === 'maj' ? t('ce.majD') : t('ce.minD');
      detail.append(
        h('div', { class: 'row' }, [h('button', { class: 'btn icon small', 'aria-label': t('prev'), text: '‹', onclick: () => { cur = all[(i - 1 + all.length) % all.length]; grid(); show(); } }), h('h2', { text: cur.name, style: 'margin:0;min-width:70px;text-align:center' }), h('button', { class: 'btn icon small', 'aria-label': t('next'), text: '›', onclick: () => { cur = all[(i + 1) % all.length]; grid(); show(); } }), h('span', { class: 'tag', text: t(cur.kind === 'maj' ? 'ce.maj' : 'ce.min') }), h('span', { class: 'mono muted', text: cur.frets.join('-') })]),
        h('p', { class: 'fg2', text: desc }),
        ...(cur.demo ? [h('p', { class: 'notice', text: t('ce.demo') })] : []),
        h('div', { class: 'kv' }, [h('span', { 'data-t': 'ce.notes', text: t('ce.notes') }), h('b', { text: ms(cur).map(m => TH.name(m) + ' (' + TH.nameKa(m) + ')').join(' · ') }), h('span', { text: t('ce.fingers') }), h('b', { text: cur.fingers.map(f => f || '0').join(' · ') })]),
        h('div', { class: 'row' }, [h('button', { class: 'btn primary', text: t('ce.play'), onclick: () => { PD.audio.ensure(); PD.audio.strum(cur.frets, 'down', { gap: .03 }); cur.frets.forEach((f, k) => view.pluck(k + 1, f)); } }),
          ...[1, 2, 3].map(s => h('button', { class: 'btn small', style: 'color:' + SCOL[s], text: t('ce.string', { s: TH.stringName(s) }), onclick: () => { PD.audio.ensure(); PD.audio.note(s, cur.frets[s - 1]); view.pluck(s, cur.frets[s - 1]); } }))]),
        h('div', { class: 'row' }, [other, h('button', { class: 'btn', text: t('ce.trans'), onclick: () => { const b = all.find(c => c.id === other.value); PD.practice.open(LS.transition(cur, b, 60), { wait: true, tempo: 1, mode: 'learn' }, null, null); } })]));
      preview(cur);
    }
    grid(); show();
  }

  /* =================== FRETBOARD EXPLORER =================== */
  const SCALES = { none: [], major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], penta: [0, 2, 4, 7, 9], mpenta: [0, 3, 5, 7, 10] };
  function fretboard(w) {
    const own = scope();
    header(w, 'fx.title');
    let label = 'names', scale = 'none', root = 9, sel = null, game = null, wasOn = PD.detector.active;
    const seg = (items, get, set) => { const s = h('div', { class: 'seg', role: 'group' }, items.map(([v, k]) => h('button', { 'aria-pressed': String(get() === v), 'data-t': k, onclick: e => { set(v); s.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); draw(); } }))); return s; };
    const rootSel = h('select', { class: 'input', 'aria-label': t('fx.root'), onchange: e => { root = +e.target.value; draw(); } }, TH.NN.map((n, i) => h('option', { value: String(i), text: n + ' · ' + TH.NN_KA[i], selected: i === root })));
    const scSel = h('select', { class: 'input', 'aria-label': t('fx.scale'), onchange: e => { scale = e.target.value; draw(); } }, Object.keys(SCALES).map(k => h('option', { value: k, 'data-t': 'sc.' + k, text: t('sc.' + k) })));
    const fb = h('div', { class: 'fb card', style: 'padding:10px' });
    const info = h('p', { class: 'fg2', role: 'status', 'aria-live': 'polite' });
    const gameBox = h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' });
    w.append(h('div', { class: 'row' }, [seg([['names', 'fx.names'], ['ka', 'fx.ka'], ['oct', 'fx.oct'], ['none', 'fx.none']], () => label, v => label = v), h('label', { class: 'field', style: 'flex-direction:row;align-items:center' }, [h('span', { 'data-t': 'fx.scale' }), scSel]), h('label', { class: 'field', style: 'flex-direction:row;align-items:center' }, [h('span', { 'data-t': 'fx.root' }), rootSel])]), fb, info, gameBox);

    function draw() {
      const W = 980, H = 190, x0 = 46, x1 = 960, k = (x1 - x0) / TH.fretFrac(TH.FRETS), fx = n => x0 + k * TH.fretFrac(n), yS = s => 150 - (s - 1) * 55;
      const cx = n => n === 0 ? x0 - 22 : (fx(n) + fx(n - 1)) / 2;
      let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="grid" aria-label="' + PD.esc(t('fx.title')) + '"><rect x="' + x0 + '" y="' + (yS(3) - 22) + '" width="' + (x1 - x0) + '" height="' + (yS(1) - yS(3) + 44) + '" rx="6" fill="#2A1D14"/>';
      PD.instrument.profile.markers.single.forEach(n => { s += '<circle cx="' + cx(n) + '" cy="' + ((yS(1) + yS(3)) / 2) + '" r="5" fill="rgba(239,224,184,.25)"/>'; });
      PD.instrument.profile.markers.double.forEach(n => { s += '<circle cx="' + cx(n) + '" cy="' + (yS(2) - 27) + '" r="5" fill="rgba(239,224,184,.25)"/><circle cx="' + cx(n) + '" cy="' + (yS(2) + 27) + '" r="5" fill="rgba(239,224,184,.25)"/>'; });
      s += '<rect x="' + (x0 - 4) + '" y="' + (yS(3) - 22) + '" width="6" height="' + (yS(1) - yS(3) + 44) + '" fill="#EFE0B8"/>';
      for (let n = 1; n <= TH.FRETS; n++) s += '<line x1="' + fx(n) + '" x2="' + fx(n) + '" y1="' + (yS(3) - 22) + '" y2="' + (yS(1) + 22) + '" stroke="#B9B2A6" stroke-width="2"/><text x="' + cx(n) + '" y="' + (H - 4) + '" fill="rgba(242,232,218,.45)" font-size="11" text-anchor="middle" font-family="IBM Plex Mono">' + n + '</text>';
      [1, 2, 3].forEach(st => { s += '<line x1="' + (x0 - 30) + '" x2="' + x1 + '" y1="' + yS(st) + '" y2="' + yS(st) + '" stroke="' + SCOL[st] + '" stroke-width="' + (3.4 - st * .5) + '" opacity=".85"/>'; });
      const scl = SCALES[scale], selM = sel ? TH.midi(sel.s, sel.f) : null;
      [1, 2, 3].forEach(st => { for (let f = 0; f <= TH.FRETS; f++) {
        const m = TH.midi(st, f), pc = TH.pc(m), inScale = scl.length && scl.includes((pc - root + 12) % 12), isRoot = scl.length && pc === root;
        const same = selM != null && m === selM, isSel = sel && sel.s === st && sel.f === f;
        const fill = isSel ? SCOL[st] : same ? 'rgba(214,161,90,.85)' : isRoot ? '#D6A15A' : inScale ? 'rgba(242,232,218,.85)' : 'rgba(20,14,10,.75)';
        const txt = label === 'names' ? TH.pcName(m) : label === 'ka' ? TH.nameKa(m) : label === 'oct' ? TH.name(m) : '';
        const show = label !== 'none' || inScale || same || isSel;
        if (show) s += '<g class="cell" data-s="' + st + '" data-f="' + f + '" role="gridcell" tabindex="-1" aria-label="' + PD.esc(TH.name(m) + ' ' + TH.stringName(st) + ' ' + f) + '"><circle cx="' + cx(f) + '" cy="' + yS(st) + '" r="15" fill="' + fill + '" stroke="' + (inScale || isSel || same ? 'none' : 'rgba(242,232,218,.2)') + '"/>' + (txt ? '<text x="' + cx(f) + '" y="' + (yS(st) + 4) + '" fill="' + (inScale || isRoot || isSel || same ? '#140D08' : '#F2E8DA') + '" font-size="' + (txt.length > 3 ? 9 : 11) + '" text-anchor="middle" font-family="IBM Plex Mono" pointer-events="none">' + PD.esc(txt) + '</text>' : '') + (isRoot ? '<circle cx="' + cx(f) + '" cy="' + yS(st) + '" r="18" fill="none" stroke="#D6A15A" stroke-width="1.5"/>' : '') + '</g>';
        else s += '<g class="cell" data-s="' + st + '" data-f="' + f + '"><rect x="' + (cx(f) - 15) + '" y="' + (yS(st) - 15) + '" width="30" height="30" fill="transparent"/></g>';
      } });
      fb.innerHTML = s + '</svg>';
    }
    fb.addEventListener('click', e => {
      const c = e.target.closest('.cell'); if (!c) return;
      const s = +c.dataset.s, f = +c.dataset.f, m = TH.midi(s, f);
      PD.audio.ensure(); PD.audio.note(s, f, { vel: .7 });
      if (game) return guess(m, s, f);
      sel = { s, f }; draw();
      info.textContent = TH.name(m) + ' · ' + TH.nameKa(m) + ' · ' + TH.freq(m).toFixed(1) + ' Hz — ' + t('fx.same', { p: TH.positions(m).map(p => TH.stringName(p.s) + ' ' + p.f).join(', ') });
    });
    /* ---- Find this note ---- */
    let exact = false;
    function gameUI() {
      gameBox.innerHTML = '';
      gameBox.append(h('b', { 'data-t': 'fx.find', text: t('fx.find') }));
      if (!game) {
        const ex = h('div', { class: 'seg', role: 'group' }, [[false, 'fx.any'], [true, 'fx.exact']].map(([v, k]) => h('button', { 'aria-pressed': String(exact === v), text: t(k), onclick: e => { exact = v; ex.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } })));
        gameBox.append(ex, h('p', { class: 'muted', style: 'font-size:13px', text: t('fx.micHint') }), h('div', { class: 'row' }, [h('button', { class: 'btn primary', text: t('fx.findGo'), onclick: () => { game = { ok: 0, n: 0, streak: 0 }; nextTarget(); gameUI(); } }), h('button', { class: 'btn', html: ic.mic + '<span>' + PD.esc(t(PD.detector.active ? 'mic.on' : 'mic.off')) + '</span>', onclick: () => { if (PD.detector.active) PD.detector.stop(); else PD.practice.micOn(() => gameUI()); gameUI(); } })]));
        return;
      }
      gameBox.append(h('div', { class: 'tnote', style: 'font-size:48px', text: exact ? TH.name(game.target) : TH.pcName(game.target) + ' · ' + TH.nameKa(game.target) }),
        h('div', { class: 'tmsg', role: 'status', 'aria-live': 'polite', id: 'fxMsg' }), h('div', { class: 'mono muted', text: t('fx.score', { a: game.ok, b: game.n, s: game.streak }) }),
        h('div', { class: 'row' }, [h('button', { class: 'btn small', text: '▶', 'aria-label': t('tu.ref'), onclick: () => PD.audio.tone(game.target, 1.2) }), h('button', { class: 'btn small', text: t('skip'), onclick: () => { nextTarget(); gameUI(); } }), h('button', { class: 'btn small', text: t('fx.findStop'), onclick: () => { game = null; gameUI(); draw(); } })]));
    }
    function nextTarget() { let m; do { m = TH.midi(1 + (Math.random() * 3 | 0), Math.random() * 18 | 0); } while (game.target === m); game.target = m; sel = null; draw(); }
    function guess(m, s, f, fromMic) {
      const ok = exact ? Math.round(m) === game.target : TH.pc(m) === TH.pc(game.target);
      game.n++; if (ok) { game.ok++; game.streak++; } else game.streak = 0;
      const msgText = ok ? t('fx.right') : t('fx.wrong', { n: exact ? TH.name(m) : TH.pcName(m) });
      sel = s ? { s, f } : null; draw();
      if (ok) { setTimeout(() => { if (game) { nextTarget(); gameUI(); } }, 700); }
      gameUI(); const el = document.getElementById('fxMsg'); if (el) { el.textContent = msgText; el.style.color = ok ? 'var(--ok)' : 'var(--fix)'; }
    }
    own(PD.detector.on('note', m => { if (!game) return; const el = document.getElementById('fxMsg'); if (m.unsure || m.conf < .7) { if (el) { el.textContent = t('h.unsure'); el.style.color = 'var(--almost)'; } return; } guess(m.midi, null, null, true); }));
    own(() => { if (PD.detector.active && !wasOn) PD.detector.stop(); });
    draw(); gameUI();
  }

  /* =================== 3D EXPLORER + TOUR =================== */
  function explore(w, param) {
    const own = scope(), R = PD.R3D;
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="back"></span>', onclick: () => PD.app.go('tools') }), h('h1', { 'data-t': 'x3.title', style: 'margin:0' }), h('span', { class: 'spacer' }), h('button', { class: 'btn small primary', 'data-t': 'x3.tour', onclick: () => tour(0) })]));
    const host = h('div', { class: 'x3d' });
    const tags = h('div', { class: 'tags' }), views = h('div', { class: 'views' }), infoEl = h('div', { class: 'info', hidden: true, role: 'status', 'aria-live': 'polite' });
    host.append(tags, views, infoEl); tags.hidden = true;
    w.append(host, h('p', { class: 'muted', 'data-t': 'x3.tap' }));
    let showLabels = false, active = null;   // hotspots on demand: the default view stays clean
    const ok = R.mount(host);
    if (!ok) { host.appendChild(h('div', { class: 'msg', text: t('r3.nogl') })); return; }
    host.insertBefore(R.canvas, tags);
    R.setView(param === 'tour' ? 'front' : 'free'); R.autoRot = false; R.clearNote(); R.setGhost(null);
    views.appendChild(h('button', { class: 'chip', html: PD.ic.restart + '<span data-t="x3.reset"></span>', title: t('x3.reset'), onclick: () => { R.setView('front'); } }));
    ['front', 'player', 'head', 'sound', 'side', 'back', 'free'].forEach(v => views.appendChild(h('button', { class: 'chip', 'data-v': v, text: t('v.' + v), onclick: () => R.setView(v) })));
    const tgl = (k, get, set) => { const b = h('button', { class: 'chip', 'aria-pressed': String(get()), html: '<span class="dot"></span>' + PD.esc(t(k)), onclick: () => { set(!get()); b.setAttribute('aria-pressed', String(get())); } }); return b; };
    let rot = false;
    views.append(tgl('x3.rotate', () => rot, v => { rot = v; R.autoRot = v; }), tgl('x3.labels', () => showLabels, v => { showLabels = v; tags.hidden = !v; }));
    const syncViews = v => views.querySelectorAll('[data-v]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    syncViews(R.view); own(PD.bus.on('r3d.view', syncViews));
    const tagEls = R.PARTS.map(p => { const el = h('button', { class: 'ptag', 'aria-pressed': 'false', text: t('p.' + p.id), onclick: () => pick(p.id) }); tags.appendChild(el); return el; });
    own(PD.bus.on('r3d.frame', ({ project }) => {
      if (!showLabels || !host.isConnected) return;
      R.PARTS.forEach((p, i) => { const q = project(p.p), el = tagEls[i]; const vis = q[2] < 1 && q[0] > 0 && q[1] > 0 && q[0] < host.clientWidth && q[1] < host.clientHeight; el.style.display = vis ? '' : 'none'; if (vis) el.style.transform = 'translate(' + Math.round(q[0] + 8) + 'px,' + Math.round(q[1] - 14) + 'px)'; });
    }));
    function pick(id, keepView) {
      active = id; tagEls.forEach((el, i) => el.setAttribute('aria-pressed', String(R.PARTS[i].id === id)));
      if (!keepView) R.focusPart(id);
      infoEl.hidden = false; infoEl.innerHTML = ''; infoEl.append(h('b', { text: t('p.' + id) }), h('p', { text: t('pi.' + id), style: 'margin-top:4px' }), h('button', { class: 'btn small quiet', style: 'margin-top:8px', 'data-t': 'close', text: t('close'), onclick: () => { infoEl.hidden = true; active = null; tagEls.forEach(el => el.setAttribute('aria-pressed', 'false')); } }));
    }
    own(PD.bus.on('r3d.tapEmpty', part => { if (part) pick(part, true); }));
    own(PD.bus.on('r3d.tap', p => { PD.audio.ensure(); PD.audio.note(p.s, p.f, { vel: .7 }); R.showNote(p.s, p.f); const m = TH.midi(p.s, p.f); infoEl.hidden = false; infoEl.innerHTML = ''; infoEl.append(h('b', { text: t('x3.note', { n: TH.name(m) + ' · ' + TH.nameKa(m), s: TH.stringName(p.s), f: p.f }) })); }));
    own(() => { R.autoRot = false; R.clearNote(); });

    /* guided tour: only facts stated in the part descriptions */
    const TOUR = [{ k: 'x3.t0', part: 'string', act: () => { PD.audio.ensure(); R.showNote(2, 5); PD.audio.note(2, 5); } }, { part: 'nut' }, { part: 'fret' }, { part: 'neck' }, { part: 'bridge' }, { part: 'top' }, { part: 'hole' }, { part: 'body' }, { part: 'head' }, { part: 'tuners' }, { k: 'x3.t9', view: 'front' }];
    function tour(i) {
      const st = TOUR[i]; if (!st) { infoEl.hidden = true; return; }
      if (st.part) R.focusPart(st.part); else if (st.view) R.setView(st.view);
      if (st.act) st.act();
      tagEls.forEach((el, j) => el.setAttribute('aria-pressed', String(R.PARTS[j].id === st.part)));
      infoEl.hidden = false; infoEl.innerHTML = '';
      infoEl.append(...[h('span', { class: 'kicker', text: t('x3.tour') + ' · ' + t('x3.step', { a: i + 1, b: TOUR.length }) }), st.part ? h('b', { text: t('p.' + st.part), style: 'display:block;margin-top:4px' }) : null,
        h('p', { text: st.k ? t(st.k) : t('pi.' + st.part), style: 'margin-top:4px' }),
        h('div', { class: 'row', style: 'margin-top:8px' }, [i ? h('button', { class: 'btn small', text: t('prev'), onclick: () => tour(i - 1) }) : null, i < TOUR.length - 1 ? h('button', { class: 'btn small primary', text: t('next'), onclick: () => tour(i + 1) }) : h('button', { class: 'btn small primary', text: t('done'), onclick: () => { infoEl.hidden = true; PD.store.set('seen.tour', true); } })])].filter(Boolean));
    }
    if (param === 'tour') setTimeout(() => tour(0), 300);
  }

  return { tuner, chords, fretboard, explore, chordDiagram };
})();
