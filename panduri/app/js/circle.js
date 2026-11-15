/* =====================================================================
   Circle of fifths — a theory toolkit page.
   A wheel of the twelve keys you turn with a finger (major keys outside,
   their relative minors in the middle, the diminished chord of each key
   inside). The key at the top lights its three neighbours: the chords
   I · IV · V, ii · iii · vi and vii° of that key. Below it: the key's
   signature, relative and parallel keys, its scale on the staff and on a
   keyboard (played note by note), its seven chords and common
   progressions — every chord sounded on the panduri in a position
   computed from the tuning (PD.theory / PD.curriculum.chords()).
   Everything here is ordinary music theory or computed by the app; the
   teacher's own progressions keep his badge and the key he named.
   ===================================================================== */
PD.i18n.add({
  'cf.title': ['კვინტების წრე', 'Circle of fifths'],
  'cf.toolD': ['ტონალობები, ნიშნები, აკორდები და მიმდევრობები — დაატრიალე წრე და მოისმინე ფანდურზე.', 'Keys, signatures, chords and progressions — turn the wheel and hear them on the panduri.'],
  'cf.kit': ['თეორიის ხელსაწყოები', 'Theory toolkit'],
  'cf.tab.chords': ['აკორდები', 'Chords'], 'cf.tab.scales': ['გამები', 'Scales'], 'cf.tab.prog': ['მიმდევრობები', 'Progressions'],
  'cf.major': ['მაჟორი', 'Major'], 'cf.minor': ['მინორი', 'Minor'],
  'cf.majW': ['მაჟორი', 'major'], 'cf.minW': ['მინორი', 'minor'],
  'cf.keyMaj': ['{n} მაჟორი', '{n} major'], 'cf.keyMin': ['{n} მინორი', '{n} minor'],
  'cf.hint': ['დაატრიალე წრე · შეეხე აკორდს, რომ მოისმინო', 'Turn the wheel · tap a chord to hear it'],
  'cf.wheel': ['კვინტების წრე: ისრებით დაატრიალე, Enter-ით მოისმინე ტონიკა', 'Circle of fifths: turn with the arrow keys, Enter plays the tonic'],
  'cf.sig0': ['არც დიეზი, არც ბემოლი', 'No sharps or flats'],
  'cf.sigS1': ['1 დიეზი: {l}', '1 sharp: {l}'], 'cf.sigSn': ['{n} დიეზი: {l}', '{n} sharps: {l}'],
  'cf.sigF1': ['1 ბემოლი: {l}', '1 flat: {l}'], 'cf.sigFn': ['{n} ბემოლი: {l}', '{n} flats: {l}'],
  'cf.rel': ['პარალელური: {k}', 'Relative {k}'], 'cf.par': ['ერთსახელა: {k}', 'Parallel {k}'],
  'cf.relD': ['იგივე ნიშნები, სხვა ტონიკა', 'Same signature, another tonic'], 'cf.parD': ['იგივე ტონიკა, სხვა კილო', 'Same tonic, the other mode'],
  'cf.scaleMaj': ['მაჟორული გამა', 'Major scale'], 'cf.scaleMin': ['ნატურალური მინორული გამა', 'Natural minor scale'],
  'cf.play': ['დაკვრა', 'Play'], 'cf.stop': ['გაჩერება', 'Stop'],
  'cf.chords': ['აკორდები', 'Chords'], 'cf.progs': ['მიმდევრობები', 'Progressions'],
  'cf.onPan': ['ფანდურზე', 'On the panduri'], 'cf.onPanD': ['შეეხე აკორდს — აქ გამოჩნდება მისი პოზიცია.', 'Tap a chord — its position shows here.'],
  'cf.posFact': ['პოზიცია გამოთვლილია ფანდურის აწყობიდან.', 'Position computed from the panduri\'s tuning.'],
  'cf.noPos': ['ამ აკორდს სამ სიმზე დასაკრავი ფორმა არ აქვს — ისმის ცალკეული ბგერებით.', 'This chord has no three-string form — you hear its notes one by one.'],
  'cf.openCh': ['აკორდების გვერდზე', 'Open in Chords'],
  'cf.srcGen': ['ზოგადი მუსიკის თეორია · ფანდურზე გამოთვლილი', 'General music theory · computed for the panduri'],
  'cf.teacherP': ['მასწავლებლის მიმდევრობები', 'The teacher\'s progressions'],
  'cf.teacherD': ['მისი მიმდევრობები ამ ტონალობაში გადატანილი. მან ისინი დაასახელა: {k}.', 'His progressions, moved into this key. He named them in: {k}.'],
  'cf.p.pop': ['პოპი', 'Pop'], 'cf.p.fifties': ['50-იანების', 'Fifties'], 'cf.p.jazz': ['ჯაზური ii–V–I', 'Jazz ii–V–I'], 'cf.p.primary': ['მთავარი აკორდები', 'Primary chords'],
  'cf.p.minor': ['მინორული', 'Minor'], 'cf.p.minorPop': ['მინორული პოპი', 'Minor pop'], 'cf.p.harm': ['ჰარმონიული მინორი', 'Harmonic minor'], 'cf.p.andal': ['ანდალუსიური კადანსი', 'Andalusian cadence'],
  'cf.playP': ['მოსმენა: {n}', 'Play: {n}'], 'cf.stopP': ['გაჩერება: {n}', 'Stop: {n}'],
  'cf.keyb': ['კლავიატურა: {n}', 'Keyboard: {n}']
});
PD.circle = (() => {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, ic = PD.ic;
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], LPC = [0, 2, 4, 5, 7, 9, 11], SOL = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'];
  /* ---------- the twelve positions, clockwise from the top: tonic names, signature, enharmonic twins ---------- */
  const KEYS = [['C', 'A', 0], ['G', 'E', 1], ['D', 'B', 2], ['A', 'F♯', 3], ['E', 'C♯', 4], ['B', 'G♯', 5, 'C♭', 'A♭'], ['F♯', 'D♯', 6, 'G♭', 'E♭'],
    ['D♭', 'B♭', -5, 'C♯', 'A♯'], ['A♭', 'F', -4], ['E♭', 'C', -3], ['B♭', 'G', -2], ['F', 'D', -1]]
    .map(([maj, min, sig, maj2, min2]) => ({ maj, min, sig, maj2: maj2 || null, min2: min2 || null }));
  const SHARPS = ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯'], FLATS = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭'];
  const STEPS = { maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 10] };
  const QUAL = { maj: ['', 'm', 'm', '', '', 'm', 'dim'], min: ['m', 'dim', '', 'm', 'm', '', ''] };
  const NUM = { maj: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'], min: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'] };
  /* progressions in scale-degree semitones from the tonic; the four of the video's major list, four common minor ones */
  const PROGS = {
    maj: [['pop', [[0, ''], [7, ''], [9, 'm'], [5, '']]], ['fifties', [[0, ''], [9, 'm'], [5, ''], [7, '']]], ['jazz', [[2, 'm7'], [7, '7'], [0, 'maj7']]], ['primary', [[0, ''], [5, ''], [7, ''], [0, '']]]],
    min: [['minor', [[0, 'm'], [5, 'm'], [7, 'm'], [0, 'm']]], ['minorPop', [[0, 'm'], [8, ''], [3, ''], [10, '']]], ['harm', [[0, 'm'], [5, 'm'], [7, '7'], [0, 'm']]], ['andal', [[0, 'm'], [10, ''], [8, ''], [7, '']]]]
  };
  const pcOf = n => (LPC[LET.indexOf(n[0])] + (n.includes('♯') ? 1 : n.includes('♭') ? -1 : 0) + 12) % 12;
  const mod = (a, n) => ((a % n) + n) % n;
  const motionOK = () => !document.documentElement.classList.contains('rm') && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  /** a note name in the language on screen: Georgian solfège (დო დიეზ), otherwise the letter (C♯) */
  const local = n => {
    if (PD.i18n.lang !== 'ka') return n;
    return SOL[LET.indexOf(n[0])] + (n.includes('♯') ? ' დიეზ' : n.includes('♭') ? ' ბემოლ' : '');
  };
  const keyName = (n, mode) => t(mode === 'min' ? 'cf.keyMin' : 'cf.keyMaj', { n: local(n) });

  /** the key at position i in a mode: its tonic, its seven spelled scale notes, its chords */
  function keyAt(i, mode) {
    const K = KEYS[mod(i, 12)], tonic = mode === 'min' ? K.min : K.maj, tpc = pcOf(tonic), L0 = LET.indexOf(tonic[0]);
    const notes = STEPS[mode].map((st, k) => {
      const li = (L0 + k) % 7, pc = (tpc + st) % 12, acc = mod(pc - LPC[li] + 6, 12) - 6;
      return { pc, name: LET[li] + (acc === 1 ? '♯' : acc === -1 ? '♭' : acc === 2 ? '𝄪' : acc === -2 ? '𝄫' : ''), letter: LET[li], acc };
    });
    const chords = notes.map((n, k) => ({ deg: k, num: NUM[mode][k], root: n.pc, rootName: n.name, q: QUAL[mode][k] }));
    return { i: mod(i, 12), mode, K, tonic, tpc, notes, chords, sig: K.sig };
  }
  /** a pitch class spelled for this key: the scale's own spelling, otherwise sharps in sharp keys and flats in flat keys */
  function spellPc(key, pc) {
    const n = key.notes.find(x => x.pc === pc); if (n) return n.name;
    return (key.sig < 0 ? TH.NN_FLAT : TH.ROOT_NAMES)[pc];
  }
  const chordLabel = (rootName, q) => rootName + (q === 'dim' ? '°' : q);
  /** Roman numeral of a chord a given number of semitones above the tonic */
  function roman(semi, q, mode) {
    const T = mode === 'min' ? ['I', '♭II', 'II', 'III', '♯III', 'IV', '♯IV', 'V', 'VI', '♯VI', 'VII', '♯VII'] : ['I', '♭II', 'II', '♭III', 'III', 'IV', '♯IV', 'V', '♭VI', 'VI', '♭VII', 'VII'];
    let r = T[mod(semi, 12)]; const low = /^m(?!aj)|dim|♭5/.test(q || '');
    if (low) r = r.toLowerCase();
    return r + (q === 'dim' ? '°' : q === 'm7♭5' ? 'ø7' : q === 'm' ? '' : q && q.startsWith('m') && !q.startsWith('maj') ? q.slice(1) : q || '');
  }

  /* ---------- sound: chords and notes on the panduri ---------- */
  function chordOf(root, q) {
    const all = PD.curriculum.chords();
    return all.find(c => c.root === root && c.q === q && !c.none) || null;
  }
  const voicing = c => c && ((c.voicings && c.voicings[0]) || c);
  function playMidi(m, when) {
    const pos = TH.positions(m).sort((a, b) => a.f - b.f)[0];
    if (PD.audio.theory) return PD.audio.theory.midi(m, { when, vel: .75, dur: 1.4 });
    if (pos) PD.audio.note(pos.s, pos.f, { when, vel: .75 }); else PD.audio.tone(m, .9);
  }
  /** strum a chord; without a three-string form its tones are sounded one after another (said on the page) */
  function soundChord(root, q) {
    if (!PD.audio.ensure()) return null;
    const c = chordOf(root, q), v = voicing(c);
    if (v && v.frets) { PD.audio.theory.strum(v.frets, 'down', { gap: .03 }); return c; }
    const T = TH.CHORD_TYPES.find(x => x.k === q); if (!T) return null;
    const base = 57 + mod(root - 9, 12), ctx = PD.audio.ctx, t0 = ctx ? ctx.currentTime + .04 : 0;
    T.iv.slice(0, 3).forEach((iv, k) => playMidi(base + iv, t0 + k * .09));
    return null;
  }

  /* ---------- drawing: the wheel ---------- */
  const R = { out: 194, maj: 132, min: 88, dim: 52 };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const pt = (r, deg) => { const a = (deg - 90) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)]; };
  function sector(r0, r1, a0, a1) {
    const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0);
    return 'M' + x0.toFixed(2) + ' ' + y0.toFixed(2) + 'A' + r1 + ' ' + r1 + ' 0 0 1 ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + 'L' + x2.toFixed(2) + ' ' + y2.toFixed(2) + 'A' + r0 + ' ' + r0 + ' 0 0 0 ' + x3.toFixed(2) + ' ' + y3.toFixed(2) + 'Z';
  }
  const esc = PD.esc;

  function page(w) {
    const offs = [], own = f => offs.push(f);
    const un = PD.bus.on('route', () => { offs.forEach(f => { try { f(); } catch (_) {} }); un(); });
    let sel = mod(PD.store.get('cf.key', 0), 12), mode = PD.store.get('cf.mode', 'maj') === 'min' ? 'min' : 'maj';
    let rot = -sel * 30, key = keyAt(sel, mode);

    /* ---- player: one thing sounds at a time; Stop cancels what is still to come ---- */
    const player = { timers: [], id: null, onStop: null };
    function stopAll() { player.timers.forEach(clearTimeout); player.timers = []; const f = player.onStop; player.onStop = null; player.id = null; if (f) f(); }
    own(stopAll);
    function run(id, steps, gapMs, onStep, onStop) {
      stopAll(); if (!PD.audio.ensure()) return;
      player.id = id; player.onStop = onStop;
      steps.forEach((s, k) => player.timers.push(setTimeout(() => onStep(s, k), k * gapMs)));
      player.timers.push(setTimeout(stopAll, steps.length * gapMs + 250));
    }

    /* ---- header + toolkit tabs ---- */
    w.classList.add('cf-page');
    w.append(h('div', { class: 'pg-top cf-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('theory') }), h('div', { class: 'cf-ht' }, [h('small', { class: 'cf-kicker', 'data-t': 'cf.kit' }), h('h1', { 'data-t': 'cf.title' })])]));
    const tabs = h('nav', { class: 'cf-tabs', 'aria-label': t('cf.kit') }, [
      h('button', { class: 'cf-tab', 'data-t': 'cf.tab.chords', onclick: () => PD.app.go('chords') }),
      h('button', { class: 'cf-tab', 'data-t': 'cf.tab.scales', onclick: () => PD.app.go('scales') }),
      h('button', { class: 'cf-tab', 'data-t': 'cf.tab.prog', onclick: () => { PD.store.set('ce.sec', 'prog'); PD.app.go('chords'); } }),
      h('button', { class: 'cf-tab on', 'aria-current': 'page', 'data-t': 'cf.title' })]);
    w.append(tabs);
    // on a narrow phone the strip scrolls: the tab of this page is brought into view
    requestAnimationFrame(() => { const on = tabs.querySelector('.cf-tab.on'); if (on && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = on.offsetLeft - tabs.offsetLeft - (tabs.clientWidth - on.offsetWidth) / 2; });

    /* ---- major / minor ---- */
    const seg = h('div', { class: 'seg cf-mode', role: 'group', 'aria-label': t('cf.title') }, ['maj', 'min'].map(m => h('button', { 'aria-pressed': String(m === mode), 'data-m': m, 'data-t': m === 'maj' ? 'cf.major' : 'cf.minor', onclick: () => setMode(m) })));

    /* ---- the wheel ---- */
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '-222 -222 444 444'); svg.setAttribute('class', 'cf-svg'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-hidden', 'true');
    let fills = '', labels = '', sigs = '';
    KEYS.forEach((K, i) => {
      const a = i * 30, a0 = a - 15, a1 = a + 15;
      fills += '<path class="cf-s cf-s-maj" data-ring="maj" data-i="' + i + '" d="' + sector(R.maj, R.out, a0, a1) + '"/>';
      fills += '<path class="cf-s cf-s-min" data-ring="min" data-i="' + i + '" d="' + sector(R.min, R.maj, a0, a1) + '"/>';
      fills += '<path class="cf-s cf-s-dim" data-ring="dim" data-i="' + i + '" d="' + sector(R.dim, R.min, a0, a1) + '"/>';
      const kM = keyAt(i, 'maj'), dimName = chordLabel(kM.notes[6].name, 'dim');
      const lab = (r, cls, main, sub) => { const [x, y] = pt(r, a); return '<g class="cf-l ' + cls + '" data-i="' + i + '" data-x="' + x.toFixed(2) + '" data-y="' + y.toFixed(2) + '" transform="translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ')"><text class="cf-lm" y="' + (sub ? 0 : 5) + '">' + esc(main) + '</text>' + (sub ? '<text class="cf-ls" y="15">' + esc(sub) + '</text>' : '') + '</g>'; };
      labels += lab(160, 'cf-l-maj', K.maj, K.maj2);
      labels += lab(110, 'cf-l-min', K.min + 'm', K.min2 ? K.min2 + 'm' : null);
      labels += lab(66, 'cf-l-dim', dimName, null);
      const sg = K.sig === 0 ? '0' : Math.abs(K.sig) + (K.sig > 0 ? '♯' : '♭');
      const [sx, sy] = pt(209, a);
      sigs += '<g class="cf-l cf-sig" data-i="' + i + '" data-x="' + sx.toFixed(2) + '" data-y="' + sy.toFixed(2) + '" transform="translate(' + sx.toFixed(2) + ' ' + sy.toFixed(2) + ')"><text y="4">' + esc(sg) + '</text></g>';
    });
    // the lit wedge stays at the top while the keys turn under it
    const hi = '<path class="cf-hi" d="' + sector(R.maj, R.out, -45, 45) + '"/><path class="cf-hi" d="' + sector(R.min, R.maj, -45, 45) + '"/><path class="cf-hi" d="' + sector(R.dim, R.min, -15, 15) + '"/>' +
      '<path class="cf-hi-edge" d="' + sector(R.dim, R.out, -45, 45) + '"/>';
    const numsAt = [[183, -30, 'o0'], [183, 0, 'o1'], [183, 30, 'o2'], [123, -30, 'm0'], [123, 0, 'm1'], [123, 30, 'm2'], [81, 0, 'd1']].map(([r, a, k]) => { const [x, y] = pt(r, a); return '<text class="cf-num" data-k="' + k + '" x="' + x.toFixed(2) + '" y="' + (y + 3).toFixed(2) + '"></text>'; }).join('');
    svg.innerHTML = '<defs><radialGradient id="cfHi" cx="0" cy="0" r="200" gradientUnits="userSpaceOnUse"><stop offset=".25" style="stop-color:var(--cf-hi2)"/><stop offset="1" style="stop-color:var(--cf-hi1)"/></radialGradient></defs>' +
      '<circle class="cf-rim" r="' + (R.out + 1) + '"/>' +
      '<g class="cf-rot cf-fills">' + fills + '</g><g class="cf-static">' + hi + '</g><g class="cf-rot cf-labels">' + labels + sigs + '</g><g class="cf-static">' + numsAt + '</g>' +
      '<circle class="cf-core" r="' + (R.dim - 1) + '"/><text class="cf-c-n" y="4"></text><text class="cf-c-m" y="26"></text>';
    const rotG = Array.from(svg.querySelectorAll('.cf-rot')), labG = Array.from(svg.querySelectorAll('.cf-l')), cN = svg.querySelector('.cf-c-n'), cM = svg.querySelector('.cf-c-m');
    const wheel = h('div', { class: 'cf-wheel', tabindex: '0', role: 'slider', 'aria-label': t('cf.wheel'), 'aria-valuemin': '0', 'aria-valuemax': '11' }, [svg]);
    const hint = h('p', { class: 'cf-hint', 'data-t': 'cf.hint' });

    function paint() {
      const r = rot.toFixed(3);
      rotG.forEach(g => g.setAttribute('transform', 'rotate(' + r + ')'));
      labG.forEach(g => g.setAttribute('transform', 'translate(' + g.dataset.x + ' ' + g.dataset.y + ') rotate(' + (-rot).toFixed(3) + ')'));
      const live = mod(Math.round(-rot / 30), 12), K = KEYS[live];
      const name = mode === 'min' ? K.min : K.maj;
      if (cN.textContent !== name) { cN.textContent = name; cM.textContent = t(mode === 'min' ? 'cf.minW' : 'cf.majW'); }
      svg.querySelectorAll('.cf-s.on, .cf-l.on').forEach(e => e.classList.remove('on'));
      [-1, 0, 1].forEach(d => { const j = mod(live + d, 12); svg.querySelectorAll('[data-i="' + j + '"].cf-s-maj, [data-i="' + j + '"].cf-s-min, [data-i="' + j + '"].cf-l-maj, [data-i="' + j + '"].cf-l-min').forEach(e => e.classList.add('on')); });
      svg.querySelectorAll('[data-i="' + live + '"].cf-s-dim, [data-i="' + live + '"].cf-l-dim, [data-i="' + live + '"].cf-sig').forEach(e => e.classList.add('on'));
    }
    function paintNums() {
      const N = mode === 'min' ? { o0: 'VI', o1: 'III', o2: 'VII', m0: 'iv', m1: 'i', m2: 'v', d1: 'ii°' } : { o0: 'IV', o1: 'I', o2: 'V', m0: 'ii', m1: 'vi', m2: 'iii', d1: 'vii°' };
      svg.querySelectorAll('.cf-num').forEach(e => { e.textContent = N[e.dataset.k]; });
      svg.classList.toggle('cf-minor', mode === 'min');
    }

    /* ---- turning: drag with the finger (or mouse), let go and it settles on the nearest key ---- */
    let anim = 0;
    function settleTo(target, dur) {
      cancelAnimationFrame(anim);
      const from = rot, d = target - from;
      if (!motionOK() || Math.abs(d) < .01) { rot = target; paint(); return done(); }
      const T = dur || Math.min(620, 260 + Math.abs(d) * 4), t0 = performance.now();
      const ease = x => { const c = 1.18, y = x - 1; return 1 + (c + 1) * y * y * y + c * y * y; };   // a soft overshoot, then rest
      const step = now => { const x = Math.min(1, (now - t0) / T); rot = from + d * ease(x); paint(); if (x < 1) anim = requestAnimationFrame(step); else { rot = target; paint(); done(); } };
      anim = requestAnimationFrame(step);
    }
    own(() => cancelAnimationFrame(anim));
    function done() {
      const ns = mod(Math.round(-rot / 30), 12);
      if (ns !== sel || key.mode !== mode) { sel = ns; PD.store.set('cf.key', sel); key = keyAt(sel, mode); refresh(true); }
      wheel.setAttribute('aria-valuenow', String(sel)); wheel.setAttribute('aria-valuetext', keyName(key.tonic, mode));
    }
    const angleAt = e => { const b = svg.getBoundingClientRect(), x = e.clientX - (b.left + b.width / 2), y = e.clientY - (b.top + b.height / 2); return { a: Math.atan2(x, -y) * 180 / Math.PI, r: Math.hypot(x, y) / (b.width / 2) * 222 }; };
    let drag = null;
    svg.addEventListener('pointerdown', e => {
      if (e.button != null && e.button > 0) return;
      const p = angleAt(e); if (p.r > R.out + 18 || p.r < R.dim) return;   // the core and the corners leave the page free to scroll
      cancelAnimationFrame(anim);
      const tgt = e.target.closest && e.target.closest('[data-ring]');
      drag = { id: e.pointerId, a: p.a, x: e.clientX, y: e.clientY, moved: false, tgt, hist: [[performance.now(), rot]] };
      try { svg.setPointerCapture(e.pointerId); } catch (_) {}
    });
    svg.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const p = angleAt(e); let d = p.a - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360; drag.a = p.a;
      if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 7) { drag.moved = true; wheel.classList.add('turning'); }
      if (!drag.moved) return;
      rot += d; paint();
      const now = performance.now(); drag.hist.push([now, rot]); while (drag.hist.length > 2 && now - drag.hist[0][0] > 90) drag.hist.shift();
      e.preventDefault();
    });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dr = drag; drag = null; wheel.classList.remove('turning');
      try { svg.releasePointerCapture(e.pointerId); } catch (_) {}
      if (!dr.moved) { if (e.type === 'pointerup' && dr.tgt) tapSector(dr.tgt); return; }
      const [t0, r0] = dr.hist[0], dt = performance.now() - t0, v = dt > 0 ? (rot - r0) / dt : 0;   // degrees per ms: a flick carries on a little
      // a real flick (faster than ~0.3°/ms) carries on a little; a slow turn settles on the nearest key
      const aim = rot + (Math.abs(v) > .3 ? Math.max(-60, Math.min(60, v * 70)) : 0);
      settleTo(Math.round(aim / 30) * 30);
    };
    svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
    wheel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); settleTo(Math.round(rot / 30) * 30 - 30); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); settleTo(Math.round(rot / 30) * 30 + 30); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hear(key.chords[0].root, key.chords[0].q, chordLabel(key.chords[0].rootName, key.chords[0].q)); }
    });
    function tapSector(el) {
      const i = +el.dataset.i, ring = el.dataset.ring, kM = keyAt(i, 'maj');
      const root = ring === 'maj' ? pcOf(KEYS[i].maj) : ring === 'min' ? pcOf(KEYS[i].min) : kM.notes[6].pc;
      const q = ring === 'maj' ? '' : ring === 'min' ? 'm' : 'dim';
      const name = ring === 'maj' ? KEYS[i].maj : ring === 'min' ? KEYS[i].min + 'm' : chordLabel(kM.notes[6].name, 'dim');
      el.classList.remove('tap'); void el.getBBox(); el.classList.add('tap'); setTimeout(() => el.classList.remove('tap'), 420);
      hear(root, q, name);
    }

    /* ---- the key card ---- */
    const kTitle = h('h2', { class: 'cf-kt', 'aria-live': 'polite' }), kSig = h('p', { class: 'cf-ksig' });
    const kRel = h('button', { class: 'cf-klink' }), kPar = h('button', { class: 'cf-klink' });
    const keyCard = h('section', { class: 'cf-key' }, [kTitle, kSig, h('div', { class: 'cf-klinks' }, [kRel, kPar]),
      h('span', { class: 'tp-src general cf-src', text: PD.ui.srcLabel('cf.srcGen') })]);

    /* ---- the scale: staff + keyboard, played note by note ---- */
    const scH = h('h3', { class: 'cf-sh' }), scBtn = h('button', { class: 'cf-play' });
    const staffBox = h('div', { class: 'cf-staff' }), kbBox = h('div', { class: 'cf-kb' });
    const scaleSec = h('section', { class: 'cf-sec cf-scale' }, [h('div', { class: 'cf-sec-h' }, [scH, scBtn]), staffBox, kbBox]);
    let scaleNow = -1;
    const scaleMidis = () => { const start = 57 + mod(key.tpc - 9, 12); return key.notes.map(n => start + mod(n.pc - key.tpc, 12)).concat([start + 12]); };
    function drawStaff() {
      const ms = scaleMidis(), names = key.notes.map(n => n.name).concat([key.notes[0].name]);
      const notes = ms.map((m, k) => { const nm = names[k], acc = nm.slice(1), off = acc === '♯' ? 1 : acc === '♭' ? -1 : acc === '𝄪' ? 2 : acc === '𝄫' ? -2 : 0, o = Math.floor((m - off) / 12) - 1;
        return { l: nm[0], o, acc: acc || null, d: 'w', col: k === scaleNow ? 'var(--acc)' : null, label: PD.i18n.lang === 'ka' ? SOL[LET.indexOf(nm[0])] + acc : nm }; });
      staffBox.innerHTML = PD.notesArt.staff(notes, { width: 400, gap: 40, end: true, height: 140, label: t(mode === 'min' ? 'cf.scaleMin' : 'cf.scaleMaj') });
    }
    function drawKeyboard() {
      const ms = scaleMidis(), lo = Math.floor(ms[0] / 12) * 12, inScale = new Set(ms), now = scaleNow >= 0 ? ms[scaleNow] : -1;
      const WH = [0, 2, 4, 5, 7, 9, 11], BL = [1, 3, 6, 8, 10], ww = 26, W = ww * 15, H = 96;
      let s = '<svg viewBox="0 0 ' + W + ' ' + (H + 2) + '" role="img" aria-label="' + esc(t('cf.keyb', { n: keyName(key.tonic, mode) })) + '">';
      for (let k = 0; k < 15; k++) { const m = lo + Math.floor(k / 7) * 12 + WH[k % 7], cls = m === now ? 'cf-now' : inScale.has(m) ? 'in' : ''; s += '<rect class="cf-wk ' + cls + '" data-m="' + m + '" x="' + (k * ww + .5) + '" y=".5" width="' + (ww - 1) + '" height="' + H + '" rx="4"/><text class="cf-kl ' + cls + '" x="' + (k * ww + ww / 2) + '" y="' + (H - 7) + '">' + LET[k % 7] + '</text>'; }
      for (let o = 0; o < 2; o++) BL.forEach(pc => { const m = lo + o * 12 + pc, wi = WH.indexOf(pc - 1) + o * 7, cls = m === now ? 'cf-now' : inScale.has(m) ? 'in' : ''; s += '<rect class="cf-bk ' + cls + '" data-m="' + m + '" x="' + ((wi + 1) * ww - 8) + '" y=".5" width="16" height="58" rx="3"/>'; });
      kbBox.innerHTML = s + '</svg>';
    }
    kbBox.addEventListener('pointerdown', e => { const k = e.target.closest && e.target.closest('[data-m]'); if (!k || !PD.audio.ensure()) return; const m = +k.dataset.m, ctx = PD.audio.ctx; playMidi(m, ctx ? ctx.currentTime + .02 : 0); k.classList.add('press'); setTimeout(() => k.classList.remove('press'), 260); });
    function setScaleBtn(on) { scBtn.classList.toggle('on', on); scBtn.innerHTML = '<span class="cf-pi" aria-hidden="true"></span>' + esc(t(on ? 'cf.stop' : 'cf.play')); scBtn.setAttribute('aria-pressed', String(on)); }
    scBtn.onclick = () => {
      if (player.id === 'scale') return stopAll();
      const ms = scaleMidis(); setScaleBtn(true);
      run('scale', ms, 430, (m, k) => { const ctx = PD.audio.ctx; playMidi(m, ctx ? ctx.currentTime + .01 : 0); scaleNow = k; drawStaff(); drawKeyboard(); },
        () => { scaleNow = -1; drawStaff(); drawKeyboard(); setScaleBtn(false); });
    };

    /* ---- the seven chords of the key ---- */
    const chRow = h('div', { class: 'cf-chords', role: 'group' });
    const panBox = h('div', { class: 'cf-pan' });
    const chordSec = h('section', { class: 'cf-sec' }, [h('h3', { class: 'cf-sh', 'data-t': 'cf.chords' }), chRow, panBox]);
    function drawChords() {
      chRow.innerHTML = '';
      key.chords.forEach(c => chRow.append(h('button', { class: 'cf-ch', 'data-root': String(c.root), 'data-q': c.q, 'aria-label': c.num + ' ' + chordLabel(c.rootName, c.q), onclick: () => hear(c.root, c.q, chordLabel(c.rootName, c.q)) }, [h('small', { text: c.num }), h('b', { text: chordLabel(c.rootName, c.q) })])));
    }
    /** light the chord in the row: by its root and quality, or (a seventh chord) by its root alone */
    function lightChord(root, q) {
      chRow.querySelectorAll('.cf-ch').forEach(b => b.classList.remove('on'));
      if (root == null) return;
      const bs = Array.from(chRow.querySelectorAll('.cf-ch')), b = bs.find(x => +x.dataset.root === root && x.dataset.q === q) || bs.find(x => +x.dataset.root === root);
      if (b) { b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); }
    }
    let lastPan = null;
    function showPan(root, q, name) {
      const c = chordOf(root, q), v = voicing(c); lastPan = { root, q, name };
      panBox.innerHTML = '';
      if (!v || !v.frets) { panBox.append(h('p', { class: 'cf-pan-e', text: name + ' — ' + t('cf.noPos') })); return; }
      panBox.append(h('div', { class: 'cf-pan-c' }, [
        h('div', { class: 'cf-pan-t' }, [h('small', { 'data-t': 'cf.onPan' }), h('b', { text: name }), h('span', { class: 'cf-pan-f mono', text: v.frets.map((f, k) => TH.stringName(k + 1) + ' ' + f).join(' · ') })]),
        h('div', { class: 'cf-pan-d', html: PD.tools.chordDiagram({ name, frets: v.frets, fingers: v.fingers || [0, 0, 0] }) }),
        h('div', { class: 'cf-pan-a' }, [h('small', { class: 'muted', 'data-t': 'cf.posFact' }), h('button', { class: 'btn small', 'data-t': 'cf.openCh', onclick: () => PD.app.go('chords', c.id + '|' + v.frets.join('-')) })])]));
      PD.i18n.apply(panBox);
    }
    function hear(root, q, name) {
      if (player.id) stopAll();
      soundChord(root, q); lightChord(root, q); showPan(root, q, name);
    }

    /* ---- progressions ---- */
    const progList = h('div', { class: 'cf-progs' }), tProg = h('div', { class: 'cf-progs' });
    const tHead = h('div', { class: 'cf-thead' });
    const progSec = h('section', { class: 'cf-sec' }, [h('h3', { class: 'cf-sh', 'data-t': 'cf.progs' }), progList, tHead, tProg]);
    function progCard(id, title, nums, items, badge) {
      const names = items.map(x => x.name);
      const btn = h('button', { class: 'cf-pbtn', 'aria-label': t('cf.playP', { n: title }) }, [h('span', { class: 'cf-pi', 'aria-hidden': 'true' })]);
      const chordsEl = h('div', { class: 'cf-pch' }, names.map(n => h('span', { text: n })));
      const card = h('div', { class: 'cf-prog' }, [h('div', { class: 'cf-ptx' }, [h('div', { class: 'cf-pt' }, [h('b', { text: title }), h('small', { text: nums }), badge || null]), chordsEl]), btn]);
      const setOn = on => { card.classList.toggle('on', on); btn.classList.toggle('on', on); btn.setAttribute('aria-label', t(on ? 'cf.stopP' : 'cf.playP', { n: title })); if (!on) chordsEl.querySelectorAll('span').forEach(s => s.classList.remove('cf-now')); };
      btn.onclick = () => {
        if (player.id === id) return stopAll();
        setOn(true);
        run(id, items, 1050, (x, k) => { soundChord(x.root, x.q); chordsEl.querySelectorAll('span').forEach((s, j) => s.classList.toggle('cf-now', j === k)); lightChord(x.root, x.q); showPan(x.root, x.q, x.name); },
          () => { setOn(false); lightChord(null); });
      };
      return card;
    }
    function drawProgs() {
      progList.innerHTML = ''; tProg.innerHTML = ''; tHead.innerHTML = '';
      PROGS[mode].forEach(([id, deg]) => {
        const items = deg.map(([d, q]) => { const r = (key.tpc + d) % 12; return { root: r, q, name: chordLabel(spellPc(key, r), q) }; });
        progList.append(progCard('p:' + id, t('cf.p.' + id), deg.map(([d, q]) => roman(d, q, mode)).join(' – '), items));
      });
      // the teacher's own progressions are all in minor: in a minor key they are shown moved into it, with the key he named
      const TP = mode === 'min' ? (PD.tools.PROGRESSIONS || []).filter(P => P.src === 'teacher' && P.deg[0] && P.deg[0][0] === 0 && P.deg[0][1] === 'm') : [];
      if (TP.length) {
        const named = Array.from(new Set(TP.map(P => keyName(KEYS.find(K => pcOf(K.min) === P.key) ? KEYS.find(K => pcOf(K.min) === P.key).min : TH.ROOT_NAMES[P.key], 'min')))).join(', ');
        tHead.append(h('h4', { class: 'cf-sh2', 'data-t': 'cf.teacherP' }), h('p', { class: 'cf-tnote', text: t('cf.teacherD', { k: named }) }));
        TP.forEach(P => {
          const items = P.deg.map(([d, q]) => { const r = (key.tpc + d) % 12; return { root: r, q, name: chordLabel(spellPc(key, r), q) }; });
          tProg.append(progCard('t:' + P.id, PD.i18n.pick({ ka: P.ka, en: P.en }), P.deg.map(([d, q]) => roman(d, q, 'min')).join(' – '), items, h('span', { class: 'tp-src teacher', text: PD.ui.srcLabel('tp.src.teacher') })));
        });
      }
    }

    /* ---- key card text ---- */
    function drawKey() {
      kTitle.textContent = keyName(key.tonic, mode);
      const n = Math.abs(key.sig), list = (key.sig > 0 ? SHARPS : FLATS).slice(0, n).join(' ');
      kSig.textContent = n === 0 ? t('cf.sig0') : t((key.sig > 0 ? 'cf.sigS' : 'cf.sigF') + (n === 1 ? '1' : 'n'), { n, l: list });
      const relName = mode === 'min' ? key.K.maj : key.K.min, relMode = mode === 'min' ? 'maj' : 'min';
      kRel.innerHTML = '<b>' + esc(t('cf.rel', { k: keyName(relName, relMode) })) + '</b><small>' + esc(t('cf.relD')) + '</small>';
      kRel.onclick = () => setMode(relMode);
      // parallel: the same tonic in the other mode sits three steps round the circle
      const parI = mod(sel + (mode === 'maj' ? -3 : 3), 12), parK = keyAt(parI, relMode);
      kPar.innerHTML = '<b>' + esc(t('cf.par', { k: keyName(parK.tonic, relMode) })) + '</b><small>' + esc(t('cf.parD')) + '</small>';
      kPar.onclick = () => { stopAll(); mode = relMode; PD.store.set('cf.mode', mode); seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === mode))); paintNums(); const cur = Math.round(rot / 30) * 30, delta = mod(-parI * 30 - cur + 180, 360) - 180; key = keyAt(sel, mode); settleTo(cur + delta); };
      scH.textContent = t(mode === 'min' ? 'cf.scaleMin' : 'cf.scaleMaj');
    }
    function refresh(animate) {
      stopAll(); scaleNow = -1;
      drawKey(); drawStaff(); drawKeyboard(); drawChords(); drawProgs(); setScaleBtn(false);
      if (lastPan) panBox.innerHTML = '';
      lastPan = null; panBox.append(h('p', { class: 'cf-pan-e', 'data-t': 'cf.onPanD' }));
      PD.i18n.apply(details);
      if (animate && motionOK()) { details.classList.remove('cf-swap'); void details.offsetWidth; details.classList.add('cf-swap'); }
    }
    function setMode(m) {
      if (m === mode) return;
      stopAll(); mode = m; PD.store.set('cf.mode', m);
      seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
      key = keyAt(sel, mode); paintNums(); paint(); refresh(true); done();
    }

    /* ---- layout: wheel and key card side by side with the rest on a wide screen, one column on a phone ---- */
    const details = h('div', { class: 'cf-details' }, [scaleSec, chordSec, progSec]);
    w.append(h('div', { class: 'cf-grid' }, [h('div', { class: 'cf-left' }, [seg, wheel, hint, keyCard]), details]));
    paintNums(); paint(); refresh(false); done();   // a change of language renders the whole page again (app.js)
  }
  /** the circle's icon for lists of tools: a wheel of twelve with its lit top */
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.2"/><path d="M12 3.4v4.4M7.7 4.6l2.2 3.8M16.3 4.6l-2.2 3.8"/><path d="M3.4 12h4.4M16.2 12h4.4M12 16.2v4.4"/></svg>';
  return { page, keyAt, roman, KEYS, ICON };
})();
