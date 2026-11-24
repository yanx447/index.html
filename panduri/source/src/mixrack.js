'use strict';
PD.i18n.add({
  'mx.plugins': ['პლაგინები', 'Plugins'], 'mx.original': ['ორიგინალი', 'Original'],
  'mx.processed': ['მიქსი', 'Mix'], 'mx.play': ['დაკვრა', 'Play'], 'mx.pause': ['პაუზა', 'Pause'],
  'mx.on': ['ჩართულია', 'On'], 'mx.off': ['გამორთულია', 'Off'],
  'mx.title': ['მიქსი', 'Mix'], 'mx.eq': ['ეკვალაიზერი', 'Equalizer'], 'mx.comp': ['კომპრესორი', 'Compressor'],
  'mx.rev': ['რევერბი', 'Reverb'], 'mx.delay': ['დაყოვნება', 'Delay'], 'mx.master': ['გამომავალი', 'Output'],
  'mx.character': ['ტემბრი', 'Tone tools'], 'mx.deess': ['დე-ესერი', 'De-esser'],
  'mx.deFreq': ['დე-ესერის სიხშირე', 'Sibilance frequency'], 'mx.deThreshold': ['დე-ესერის ზღურბლი', 'De-esser threshold'],
  'mx.tape': ['ფირის სატურაცია', 'Tape saturation'], 'mx.tapeDrive': ['სატურაციის გაძლიერება', 'Saturation drive'],
  'mx.curve': ['სატურაციის გადაცემის მრუდი', 'Saturation transfer curve'],
  'mx.lp': ['მაღალი სიხშირეების მოჭრა', 'Low-pass'], 'mx.bandOff': ['ზოლის გამორთვა', 'Bypass this band'],
  'mx.inputPeak': ['შემავალი პიკი', 'Input peak'], 'mx.outputPeak': ['გამომავალი პიკი', 'Output peak'],
  'mx.clean': ['გასუფთავება', 'Cleanup'], 'mx.in': ['შემავალი', 'Input'], 'mx.out': ['გამომავალი', 'Output'],
  'mx.analyzer': ['შემავალი და გამომავალი სპექტრი, ეკვალაიზერის მრუდი', 'Input and output spectra and EQ curve'],
  'mx.transfer': ['კომპრესორის გადაცემის მრუდი', 'Compressor transfer curve'],
  'mx.tail': ['რევერბის დაშლის მრუდი', 'Reverb decay curve'],
  'mx.freq': ['სიხშირე', 'Frequency'], 'mx.gain': ['გაძლიერება', 'Gain'], 'mx.q': ['ზოლის სიგანე · Q', 'Bandwidth · Q'],
  'mx.hp': ['დაბალი სიხშირეების მოჭრა', 'High-pass'], 'mx.hum': ['ზუზუნის მოცილება', 'Hum removal'],
  'mx.low': ['დაბლები', 'Low shelf'], 'mx.lowMid': ['დაბალი შუა', 'Low mid'], 'mx.mid': ['შუა', 'Mid'],
  'mx.highMid': ['მაღალი შუა', 'High mid'], 'mx.high': ['მაღლები', 'High shelf'], 'mx.reset': ['საწყისი პარამეტრები', 'Reset controls'],
  'mx.bypass': ['ეფექტის გამორთვა', 'Bypass effect'], 'mx.wet': ['ეფექტის წილი', 'Mix'], 'mx.knee': ['გადასვლის რბილობა', 'Knee'],
  'mx.makeup': ['გაძლიერება შეკუმშვის შემდეგ', 'Makeup gain'], 'mx.decay': ['დაშლის დრო', 'Decay'],
  'mx.pre': ['საწყისი დაყოვნება', 'Pre-delay'], 'mx.damp': ['მაღლების ჩახშობა', 'Damping'],
  'mx.room': ['ოთახი', 'Room'], 'mx.plate': ['ფირფიტა', 'Plate'], 'mx.hall': ['დარბაზი', 'Hall'],
  'mx.space': ['სივრცე', 'Space'], 'mx.feedback': ['გამეორება', 'Feedback'], 'mx.tone': ['ტონი', 'Tone'],
  'mx.limiter': ['პიკის ლიმიტერი', 'Peak limiter'], 'mx.ceiling': ['ზღვარი', 'Ceiling'], 'mx.drive': ['ლიმიტერის შემავალი დონე', 'Limiter input'],
  'mx.gr': ['დონის შემცირება', 'Gain reduction'], 'mx.peak': ['პიკი', 'Peak'],
  'mx.empty': ['გასუფთავებას დეკოდირებული აუდიო სჭირდება.', 'Cleanup requires decoded audio.'],
  'mx.audioExport': ['დამუშავებული ფაილი · WAV 24 ბიტი', 'Edited file · 24-bit WAV'],
  'mx.audioEdit': ['აუდიოს რედაქტორი', 'Audio editor'], 'mx.videoEdit': ['ვიდეოს რედაქტორი', 'Video editor'],
  'mx.renderSound': ['WAV მზადდება… {p}%', 'Rendering WAV… {p}%'],
  'mx.saveAudio': ['მიქსის შენახვა WAV-ად', 'Save mix as WAV'],
  'mx.trimToFit': ['ამ ხანგრძლივობის WAV {n} MB-ს აჭარბებს. შეამოკლე ან შეინახე მოწყობილობაზე.', 'The WAV at this length exceeds {n} MB. Trim it or save it to your device.']
});

PD.mixrack = (() => {
  const bands = [
    { id: 'low', type: 'lowshelf', f: 'loFreq', g: 'lo', color: '#c5a9ff' },
    { id: 'lowMid', type: 'peaking', f: 'lmHz', g: 'lm', q: 'lmQ', color: '#58c4bb' },
    { id: 'mid', type: 'peaking', f: 'midHz', g: 'mid', q: 'midQ', color: '#f1ad78' },
    { id: 'highMid', type: 'peaking', f: 'hmHz', g: 'hm', q: 'hmQ', color: '#e182a3' },
    { id: 'high', type: 'highshelf', f: 'hiFreq', g: 'hi', color: '#88aef2' }
  ];
  const defaults = Object.freeze({
    vol: 100, lo: 0, loFreq: 140, lm: 0, lmHz: 380, lmQ: 1,
    mid: 0, midHz: 1100, midQ: .8, hm: 0, hmHz: 3300, hmQ: 1, hi: 0, hiFreq: 6500, hp: 0, lp: 20000, hum: 0, eqOff: false, eqMask: 0,
    comp: 0, compOff: false, threshold: -28, ratio: 4, attack: 10, release: 180, knee: 8, makeup: 0,
    deess: 0, deFreq: 6100, deThreshold: -26, tape: 0, tapeDrive: 6,
    rev: 0, revOff: false, space: 'room', decay: 1.3, predelay: 20, damp: 7400,
    del: 0, delOff: false, dtime: 320, feedback: 38, tone: 4800,
    limiter: false, ceiling: -1, drive: 0, dn: false, dnAmt: 60
  });
  const presets = {
    rock: { hp: 45, lo: 2, mid: 2, midHz: 1800, hi: 2, comp: 68, ratio: 4, attack: 12, limiter: true },
    pop: { hp: 65, lm: -2, hi: 3, comp: 60, ratio: 3, attack: 8, limiter: true },
    jazz: { hp: 35, lo: 1, mid: 1, midHz: 790, comp: 30, ratio: 2, attack: 28 },
    folk: { hp: 60, lm: -2, lmHz: 270, hi: 2, comp: 34, ratio: 2.3 },
    vocals: { hp: 80, mid: 2, midHz: 2300, hi: 2, comp: 62, ratio: 3, attack: 8, release: 120, deess: 35, rev: 12, space: 'plate' }
  };
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const gain = db => 10 ** (db / 20);
  const decibels = x => Math.max(-72, 20 * Math.log10(Math.max(1e-8, x)));
  const compressorDelay = .006;
  const latency = compressorDelay * 3;
  const saturate = (sample, drive) => Math.tanh(sample * gain(drive)) / Math.tanh(gain(drive));
  const wetMix = (a, plugin) => a[plugin + 'Off'] ? 0 : a[plugin] / 100;
  const tailSeconds = a => Math.max(wetMix(a, 'rev') ? a.decay + a.predelay / 1000 : 0,
    wetMix(a, 'del') ? Math.min(4, a.dtime / 1000 * (a.feedback ? 2 + Math.log(.01) / Math.log(a.feedback / 100) : 1)) : 0);
  const changed = a => a.vol !== 100 || a.dn || a.limiter || a.deess > 0 || a.tape > 0 ||
    wetMix(a, 'comp') > 0 || wetMix(a, 'rev') > 0 || wetMix(a, 'del') > 0 ||
    (!a.eqOff && (a.hp > 0 || a.lp !== defaults.lp || a.hum > 0 ||
      bands.some((b, i) => !(a.eqMask & (1 << i)) && a[b.g] !== 0)));
  function transfer(db, threshold, ratio, knee) {
    const x = db - threshold;
    if (!knee || Math.abs(x) >= knee / 2) return db - Math.max(0, x) * (1 - 1 / ratio);
    return db - (1 - 1 / ratio) * (x + knee / 2) ** 2 / (2 * knee);
  }

  function impulse(ac, duration, space) {
    const n = Math.round(ac.sampleRate * duration), b = ac.createBuffer(2, n, ac.sampleRate);
    const shape = space === 'hall' ? .033 : space === 'plate' ? .009 : .015;
    let seed = 174913;
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < n; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const time = i / ac.sampleRate;
        d[i] = (seed / 2147483648 - 1) * Math.exp(-6.908 * i / n) * Math.min(1, time / shape);
      }
    }
    return b;
  }

  function chain(ac) {
    const inp = ac.createGain(), out = ac.createGain(), pre = ac.createAnalyser(), meter = ac.createAnalyser();
    const eqWet = ac.createGain(), eqDry = ac.createGain(), eq = ac.createGain();
    const filter = type => { const node = ac.createBiquadFilter(); node.type = type; return node; };
    const hp = filter('highpass'), lp = filter('lowpass'), notch = filter('peaking');
    hp.Q.value = lp.Q.value = -3; notch.Q.value = 22;
    const bandNodes = bands.map(b => filter(b.type)), filters = [hp, notch, ...bandNodes, lp];
    inp.connect(pre).connect(filters[0]);
    filters.slice(1).reduce((last, node) => last.connect(node), filters[0]).connect(eqWet).connect(eq);
    pre.connect(eqDry).connect(eq);

    // Matched fourth-order low/high crossovers keep the two bands in phase at the split.
    const aligned = () => { const node = ac.createDelay(.03); node.delayTime.value = compressorDelay; return node; };
    const crossover = type => [filter(type), filter(type)];
    const deLow = crossover('lowpass'), deHigh = crossover('highpass');
    const deFilters = [...deLow, ...deHigh];
    for (const node of deFilters) node.Q.value = -3.0103;
    const deComp = ac.createDynamicsCompressor(), deWide = ac.createGain(), deMixed = ac.createGain();
    const deDry = ac.createGain(), deWet = ac.createGain(), deOut = ac.createGain();
    deComp.ratio.value = 8; deComp.knee.value = 6; deComp.attack.value = .001; deComp.release.value = .065;
    eq.connect(aligned()).connect(deWide).connect(deOut);
    eq.connect(deLow[0]).connect(deLow[1]).connect(aligned()).connect(deMixed);
    eq.connect(deHigh[0]).connect(deHigh[1]).connect(aligned()).connect(deDry).connect(deMixed);
    deHigh[1].connect(deComp).connect(deWet).connect(deMixed);
    deMixed.connect(deOut);

    const tape = ac.createWaveShaper(), tapeDry = ac.createGain(), tapeWet = ac.createGain(), toneOut = ac.createGain();
    tape.oversample = '4x';
    deOut.connect(tapeDry).connect(toneOut);
    deOut.connect(tape).connect(tapeWet).connect(toneOut);

    const comp = ac.createDynamicsCompressor(), makeup = ac.createGain(), compDry = ac.createGain(), compSum = ac.createGain();
    const dryAlign = aligned();
    toneOut.connect(comp).connect(makeup).connect(compSum);
    toneOut.connect(dryAlign).connect(compDry).connect(compSum);

    const mix = ac.createGain(), dry = ac.createGain();
    compSum.connect(dry).connect(mix);
    const revPre = ac.createDelay(.25), convolver = ac.createConvolver(), damp = filter('lowpass'), revWet = ac.createGain();
    revWet.gain.value = 0;
    compSum.connect(revPre).connect(convolver).connect(damp).connect(revWet).connect(mix);
    const delay = ac.createDelay(2), tone = filter('lowpass'), feedback = ac.createGain(), delayWet = ac.createGain();
    delayWet.gain.value = 0;
    compSum.connect(delay).connect(tone).connect(delayWet).connect(mix);
    tone.connect(feedback).connect(delay);

    const master = ac.createGain(), drive = ac.createGain(), lim = ac.createDynamicsCompressor();
    lim.ratio.value = 20; lim.knee.value = 0; lim.attack.value = 0; lim.release.value = .08;
    const hard = ac.createWaveShaper();
    hard.curve = Float32Array.of(-1, 0, 1);
    const toUnit = ac.createGain(), ceiling = ac.createGain(), capped = ac.createGain(), unlim = ac.createGain();
    const masterDelay = aligned();
    mix.connect(master).connect(drive).connect(lim).connect(toUnit).connect(hard).connect(ceiling).connect(capped);
    master.connect(masterDelay).connect(unlim);

    const processed = ac.createGain(), rendered = ac.createGain(), original = ac.createGain();
    const abAlign = ac.createDelay(.03); abAlign.delayTime.value = latency;
    pre.connect(abAlign).connect(original).connect(meter);
    capped.connect(processed); unlim.connect(processed); processed.connect(rendered).connect(meter);
    meter.connect(out);
    pre.fftSize = meter.fftSize = 4096;
    pre.smoothingTimeConstant = meter.smoothingTimeConstant = .74;
    original.gain.value = 0;
    let spaceKey = '', tapeDrive = -1, initial = true;
    const set = (param, value) => {
      if (initial) param.value = value;
      else param.setTargetAtTime(value, ac.currentTime, .017);
    };
    function update(a, refreshSpace = true) {
      set(eqWet.gain, a.eqOff ? 0 : 1); set(eqDry.gain, a.eqOff ? 1 : 0);
      set(hp.frequency, a.hp); set(notch.frequency, a.hum || 50); set(notch.gain, a.hum ? -24 : 0);
      const nyquist = ac.sampleRate / 2;
      set(lp.frequency, a.lp === defaults.lp ? nyquist : Math.min(nyquist, a.lp));
      bands.forEach((b, i) => {
        set(bandNodes[i].frequency, Math.min(ac.sampleRate * .48, a[b.f]));
        set(bandNodes[i].gain, a.eqMask & (1 << i) ? 0 : a[b.g]);
        if (b.q) set(bandNodes[i].Q, a[b.q]);
      });
      const deMix = a.deess / 100, saturation = a.tape / 100;
      const compression = wetMix(a, 'comp'), reverb = wetMix(a, 'rev'), echo = wetMix(a, 'del');
      for (const node of deFilters) set(node.frequency, Math.min(a.deFreq, nyquist * .96));
      deComp.threshold.value = a.deThreshold;
      set(deWide.gain, deMix ? 0 : 1); set(deMixed.gain, deMix ? 1 : 0);
      set(deDry.gain, 1 - deMix); set(deWet.gain, deMix);
      if (saturation && a.tapeDrive !== tapeDrive) {
        tape.curve = Float32Array.from({ length: 4097 }, (_, i) => saturate(i / 2048 - 1, a.tapeDrive));
        tapeDrive = a.tapeDrive;
      }
      set(tapeDry.gain, 1 - saturation); set(tapeWet.gain, saturation);
      comp.threshold.value = a.threshold; comp.ratio.value = a.ratio; comp.knee.value = a.knee;
      comp.attack.value = a.attack / 1000; comp.release.value = a.release / 1000;
      set(compDry.gain, 1 - compression); set(makeup.gain, compression * gain(a.makeup));
      const key = a.space + ':' + a.decay;
      if (reverb && key !== spaceKey && (refreshSpace || !spaceKey)) {
        convolver.buffer = impulse(ac, a.decay, a.space); spaceKey = key;
      }
      set(revPre.delayTime, a.predelay / 1000); set(damp.frequency, Math.min(a.damp, ac.sampleRate * .48));
      set(revWet.gain, reverb); set(dry.gain, 1 - reverb);
      set(delay.delayTime, a.dtime / 1000); set(tone.frequency, Math.min(a.tone, ac.sampleRate * .48));
      set(delayWet.gain, echo); set(feedback.gain, a.feedback / 100);
      set(master.gain, a.vol / 100); set(drive.gain, gain(a.drive));
      lim.threshold.value = a.ceiling; set(toUnit.gain, 1 / gain(a.ceiling)); set(ceiling.gain, gain(a.ceiling));
      set(capped.gain, a.limiter ? 1 : 0); set(unlim.gain, a.limiter ? 0 : 1);
      initial = false;
    }
    return {
      inp, out, pre, meter, comp, lim, deComp, filters,
      compare(on) { set(original.gain, on ? 1 : 0); set(rendered.gain, on ? 0 : 1); },
      cut(level) { set(out.gain, level); },
      set: update
    };
  }

  const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14m6-14v14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
  let nextPanel = 0;
  function panel(o) {
    const { h, ic } = PD, t = o.t, graph = o.chain;
    let tab = o.tab || 'eq', selected = 'mid', last = 0, paint = () => {};
    const sliders = new Map();
    const id = 'mx-panel-' + ++nextPanel;
    const work = h('div', { class: 'mx-work', role: 'tabpanel', id });
    const nav = h('div', { class: 'mx-tabs', role: 'tablist', 'aria-label': t('mx.plugins') });
    const keys = ['eq', 'comp', 'character', 'rev', 'delay', 'master', 'clean'];
    const title = key => t('mx.' + key);
    const button = (text, action, cls = 'btn small') => h('button', { type: 'button', class: cls, text, onclick: action });
    const ref = (key, value, refresh = true) => { o.set(key, value, refresh); preset.value = 'custom'; };
    const fmt = {
      hz: n => n ? n >= 1000 ? (n / 1000).toFixed(2).replace(/0+$/, '').replace(/\.$/, '') + ' kHz' : n + ' Hz' : '—',
      db: n => (n > 0 ? '+' : '') + Number(n.toFixed(1)) + ' dB',
      pct: n => n + '%', ms: n => n + ' ms', ratio: n => Number(n.toFixed(1)) + ':1'
    };
    const preset = h('select', { class: 'input mx-preset', 'aria-label': t('ve.mixPreset') }, [
      h('option', { value: 'custom', text: t('ve.mixPreset') }), h('option', { value: 'neutral', text: t('mx.reset') }),
      ...Object.keys(presets).map(id => h('option', { value: id, text: t(id === 'vocals' ? 'mc.instrument.vocals' : 'mc.genre.' + id) }))
    ]);
    preset.value = o.preset || 'custom';
    preset.onchange = () => { if (preset.value !== 'custom') { o.choosePreset(preset.value); drawTab(); } };
    function chooseSignal(original) {
      if (o.compared() !== original) o.compare();
      paintComparison(); paint();
    }
    const dry = button(t('mx.original'), () => chooseSignal(true), 'mx-compare-option');
    const processed = button(t('mx.processed'), () => chooseSignal(false), 'mx-compare-option');
    function paintComparison() {
      dry.setAttribute('aria-pressed', String(o.compared()));
      processed.setAttribute('aria-pressed', String(!o.compared()));
    }
    const ab = h('div', { class: 'mx-compare', role: 'group', 'aria-label': t('ve.ab') }, [dry, processed]);
    paintComparison();
    const transport = h('button', { class: 'mx-transport', type: 'button', onclick: o.play });
    const position = h('span', { class: 'mx-position' });
    let wasPlaying;
    function paintTransport() {
      const playing = o.playing(), time = o.time();
      if (playing !== wasPlaying) {
        const label = t(playing ? 'mx.pause' : 'mx.play');
        transport.innerHTML = playing ? pauseIcon : ic.play;
        transport.setAttribute('aria-label', label); transport.title = label; wasPlaying = playing;
      }
      if (position.textContent !== time) position.textContent = time;
    }
    const input = h('meter', { min: -72, max: 0, value: -72, 'aria-label': title('in') });
    const output = h('meter', { min: -72, max: 0, value: -72, 'aria-label': title('out') });
    const levelIn = graph ? new Float32Array(graph.pre.fftSize) : null;
    const levelOut = graph ? new Float32Array(graph.meter.fftSize) : null;
    const inputPeak = h('output', { 'aria-label': t('mx.inputPeak'), text: '—' });
    const outputPeak = h('output', { 'aria-label': t('mx.outputPeak'), text: '—' });
    function meterLine(label, meter, value) {
      const fill = h('i');
      const track = h('div', { class: 'mx-meter-track', 'aria-hidden': 'true' }, [fill]);
      return { fill, el: h('div', { class: 'mx-level' }, [h('span', { text: label }), value, meter, track]) };
    }
    const inputLine = meterLine(title('in'), input, inputPeak), outputLine = meterLine(title('out'), output, outputPeak);
    const head = h('div', { class: 'mx-head' }, [
      h('div', { class: 'mx-transport-row' }, [transport, position, ab, preset]),
      o.timeline,
      h('div', { class: 'mx-levels' }, [inputLine.el, outputLine.el])
    ].filter(Boolean));
    const section = (...controls) => h('div', { class: 'mx-controls' }, controls);
    function control(key, label, min, max, step = 1, format = String, nonlinear = false, commit = false) {
      const read = value => nonlinear ? 20 * (max / 20) ** (value / 1000) : value;
      const map = value => nonlinear ? Math.log(Math.max(20, value) / 20) / Math.log(max / 20) * 1000 : value;
      const dial = h('input', { type: 'range', min: nonlinear ? 0 : min, max: nonlinear ? 1000 : max, step: nonlinear ? 1 : step, 'aria-label': label });
      const face = h('i', { class: 'mx-dial', 'aria-hidden': 'true' }), val = h('output');
      const update = () => {
        dial.value = map(o.get()[key]);
        const v = o.get()[key], angle = (Number(dial.value) - Number(dial.min)) / (Number(dial.max) - Number(dial.min)) * 270;
        const value = format(v); face.style.setProperty('--turn', (angle - 135) + 'deg');
        face.style.setProperty('--arc', angle + 'deg'); val.textContent = value; dial.setAttribute('aria-valuetext', value);
      };
      const apply = refresh => { ref(key, nonlinear ? Math.round(read(+dial.value)) : +dial.value, refresh); update(); };
      dial.oninput = () => apply(!commit);
      if (commit) dial.onchange = () => apply(true);
      const knob = h('span', { class: 'mx-knob' }, [face, dial]);
      let drag;
      knob.onpointerdown = event => {
        if (event.button !== 0) return;
        event.preventDefault(); dial.focus({ preventScroll: true });
        knob.setPointerCapture(event.pointerId);
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, start: +dial.value, moved: false };
      };
      knob.onpointermove = event => {
        if (!drag || drag.id !== event.pointerId) return;
        const min = +dial.min, max = +dial.max, step = +dial.step;
        const delta = event.clientX - drag.x + drag.y - event.clientY;
        if (Math.abs(delta) < 3 && !drag.moved) return;
        drag.moved = true;
        const raw = drag.start + delta / (event.shiftKey ? 560 : 200) * (max - min);
        const next = clamp(min + Math.round((raw - min) / step) * step, min, max);
        dial.value = next.toFixed(6);
        apply(!commit);
      };
      knob.onlostpointercapture = () => {
        if (drag?.moved && commit) apply(true);
        drag = null;
      };
      knob.ondblclick = () => { ref(key, defaults[key]); update(); };
      update(); sliders.set(key, update);
      return h('label', { class: 'mx-control' }, [knob, val, h('span', { text: label })]);
    }
    function toggle(key, label, invert = false) {
      const b = button(label, () => { ref(key, !o.get()[key]); b.setAttribute('aria-pressed', String(invert ? !o.get()[key] : !!o.get()[key])); });
      b.setAttribute('aria-pressed', String(invert ? !o.get()[key] : !!o.get()[key]));
      return b;
    }
    const canvas = (label, kind) => h('canvas', { class: 'mx-plot mx-plot-' + kind, width: 820, height: 265, role: 'img', 'aria-label': label });
    function surface(cv) {
      const ctx = cv.getContext('2d'), w = cv.width, h = cv.height;
      ctx.clearRect(0, 0, w, h);
      ctx.font = '13px system-ui'; ctx.fillStyle = '#a2a3a1'; ctx.lineWidth = 1;
      return { ctx, w, h };
    }
    function line(ctx, x, y, X, Y, color = '#ffffff18') {
      ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(X, Y); ctx.stroke();
    }
    function equalizer() {
      const cv = canvas(t('mx.analyzer'), 'eq'), layer = h('div', { class: 'mx-nodes' });
      const controls = h('div', { class: 'mx-eq-controls' }), markers = new Map();
      const max = Math.min(20000, graph.meter.context.sampleRate * .47), log = Math.log(max / 20);
      const x = hz => Math.log(clamp(hz, 20, max) / 20) / log;
      const y = db => .5 - clamp(db, -18, 18) / 40;
      const freqs = Float32Array.from({ length: 210 }, (_, i) => 20 * Math.exp(log * i / 209));
      const amounts = new Float32Array(freqs.length), magnitude = new Float32Array(freqs.length), phase = new Float32Array(freqs.length);
      const before = new Float32Array(graph.pre.frequencyBinCount), after = new Float32Array(graph.meter.frequencyBinCount);
      function bandControls() {
        const i = bands.findIndex(band => band.id === selected), b = bands[i], flag = 1 << i;
        const bypass = button(t('mx.bandOff'), () => {
          ref('eqMask', o.get().eqMask ^ flag); bandControls(); draw();
          controls.querySelector('button')?.focus();
        });
        bypass.setAttribute('aria-pressed', String(Boolean(o.get().eqMask & flag)));
        controls.replaceChildren(h('div', { class: 'mx-band-title', text: title(b.id) }),
          section(control(b.f, t('mx.freq'), 20, max, 1, fmt.hz, true), control(b.g, t('mx.gain'), -18, 18, .5, fmt.db),
            ...(b.q ? [control(b.q, t('mx.q'), .25, 12, .05, n => n.toFixed(2))] : [])), bypass);
        for (const [id, marker] of markers) marker.setAttribute('aria-pressed', String(id === selected));
      }
      for (const b of bands) {
        const marker = button(title(b.id), () => { if (selected !== b.id) { selected = b.id; bandControls(); } }, 'mx-node');
        marker.style.setProperty('--node', b.color);
        marker.setAttribute('aria-label', title(b.id)); marker.textContent = String(markers.size + 1);
        marker.addEventListener('pointerdown', event => {
          if (event.button !== 0) return;
          selected = b.id; bandControls(); marker.setPointerCapture(event.pointerId);
        });
        marker.addEventListener('pointermove', event => {
          if (!marker.hasPointerCapture(event.pointerId)) return;
          const r = layer.getBoundingClientRect();
          ref(b.f, Math.round(20 * Math.exp(log * clamp((event.clientX - r.left) / r.width, 0, 1))));
          ref(b.g, Math.round(clamp((.5 - (event.clientY - r.top) / r.height) * 40, -18, 18) * 2) / 2);
          sliders.get(b.f)?.(); sliders.get(b.g)?.(); draw();
        });
        marker.onkeydown = event => {
          const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 1, ArrowDown: -1 }[event.key];
          if (!delta) return;
          event.preventDefault(); selected = b.id; bandControls();
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') ref(b.f, Math.round(clamp(o.get()[b.f] * 2 ** (delta / 12), 20, max)));
          else ref(b.g, clamp(o.get()[b.g] + delta * .5, -18, 18));
          bandControls(); draw();
        };
        markers.set(b.id, marker); layer.append(marker);
      }
      bandControls();
      function spectrum(ctx, w, h, data, color) {
        ctx.beginPath(); ctx.moveTo(0, h);
        for (let i = 0; i < freqs.length; i++) {
          const j = Math.min(data.length - 1, Math.round(freqs[i] * graph.meter.fftSize / graph.meter.context.sampleRate));
          ctx.lineTo(i / 209 * w, h * (1 - clamp((data[j] + 95) / 82, 0, 1)));
        }
        ctx.lineTo(w, h); ctx.fillStyle = color; ctx.fill();
      }
      function draw() {
        const { ctx, w, h } = surface(cv), a = o.get();
        [50, 100, 200, 500, 1000, 2000, 5000, 10000].filter(f => f < max).forEach(f => {
          const pos = x(f) * w;
          line(ctx, pos, 0, pos, h); ctx.fillText(f >= 1000 ? f / 1000 + 'k' : f, pos + 5, h - 8);
        });
        [-12, -6, 0, 6, 12].forEach(db => {
          const pos = y(db) * h; line(ctx, 0, pos, w, pos, db ? undefined : '#ffffff48');
          ctx.fillText((db > 0 ? '+' : '') + db, w - 32, pos - 4);
        });
        graph.pre.getFloatFrequencyData(before); graph.meter.getFloatFrequencyData(after);
        spectrum(ctx, w, h, before, '#a898bd27'); spectrum(ctx, w, h, after, '#dc906f39');
        amounts.fill(0);
        if (!a.eqOff && !o.compared()) for (const filter of graph.filters) {
          filter.getFrequencyResponse(freqs, magnitude, phase);
          for (let i = 0; i < amounts.length; i++) amounts[i] += 20 * Math.log10(Math.max(1e-8, magnitude[i]));
        }
        ctx.beginPath(); amounts.forEach((db, i) => ctx[i ? 'lineTo' : 'moveTo'](i / 209 * w, y(db) * h));
        ctx.strokeStyle = '#ffbb96'; ctx.lineWidth = 3; ctx.stroke();
        bands.forEach((b, i) => {
          const marker = markers.get(b.id);
          marker.classList.toggle('mx-band-off', Boolean(a.eqMask & (1 << i)));
          marker.style.left = clamp(x(a[b.f]) * 100, 2, 98) + '%'; marker.style.top = y(a[b.g]) * 100 + '%';
        });
      }
      paint = draw;
      const hum = h('select', { class: 'input', 'aria-label': t('mx.hum') }, [0, 50, 60].map(value => h('option', { value, text: fmt.hz(value) })));
      hum.value = o.get().hum; hum.onchange = () => ref('hum', +hum.value);
      return [h('div', { class: 'mx-eq-chart' }, [cv, layer]), controls,
        h('div', { class: 'mx-quick' }, [control('hp', t('mx.hp'), 0, 240, 5, fmt.hz),
          h('label', { class: 'mx-field' }, [h('span', { text: t('mx.hum') }), hum]),
          control('lp', t('mx.lp'), 200, 20000, 50, n => n === 20000 ? '—' : fmt.hz(n)),
          toggle('eqOff', t('mx.bypass'))])];
    }
    function compression() {
      const cv = canvas(t('mx.transfer'), 'comp'), gr = h('meter', { min: 0, max: 24, value: 0, 'aria-label': t('mx.gr') }), readout = h('b');
      paint = () => {
        const { ctx, w, h } = surface(cv), a = o.get();
        const at = db => (db + 60) / 60, left = 38, width = w - 58, height = h - 25;
        for (let db = -60; db <= 0; db += 10) {
          const x = left + at(db) * width, y = (1 - at(db)) * height;
          line(ctx, x, 0, x, height); line(ctx, left, y, w - 20, y);
          ctx.fillText(db, x - 7, h - 6); ctx.fillText(db, 3, y + 12);
        }
        line(ctx, left, height, w - 20, 0, '#ffffff55');
        ctx.beginPath();
        for (let db = -60; db <= 0; db++) {
          const wet = o.compared() ? 0 : wetMix(a, 'comp');
          const result = wet ? decibels(gain(db) * (1 - wet) + gain(transfer(db, a.threshold, a.ratio, a.knee) + a.makeup) * wet) : db;
          ctx[db === -60 ? 'moveTo' : 'lineTo'](left + at(db) * width, (1 - clamp(at(result), 0, 1)) * height);
        }
        ctx.strokeStyle = '#78c9b6'; ctx.lineWidth = 3; ctx.stroke();
        gr.value = !o.compared() && wetMix(a, 'comp') ? Math.max(0, -graph.comp.reduction) : 0;
        readout.textContent = fmt.db(-gr.value);
      };
      return [cv, h('div', { class: 'mx-quick' }, [toggle('compOff', t('mx.bypass')),
        h('div', { class: 'mx-gr' }, [h('span', { text: t('mx.gr') }), gr, readout])]),
        section(control('threshold', t('ve.thresh'), -60, 0, 1, fmt.db), control('ratio', t('ve.ratio'), 1, 20, .1, fmt.ratio),
          control('attack', t('ve.attack'), 1, 100, 1, fmt.ms), control('release', t('ve.release'), 30, 1000, 5, fmt.ms),
          control('knee', t('mx.knee'), 0, 40, 1, fmt.db), control('makeup', t('mx.makeup'), -12, 18, .5, fmt.db),
          control('comp', t('mx.wet'), 0, 100, 1, fmt.pct))];
    }
    function character() {
      const cv = canvas(t('mx.curve'), 'character'), gr = h('meter', { min: 0, max: 24, value: 0, 'aria-label': t('mx.gr') }),
        reduction = h('b');
      paint = () => {
        const { ctx, w, h } = surface(cv), a = o.get(), wet = o.compared() ? 0 : a.tape / 100;
        line(ctx, 0, h / 2, w, h / 2); line(ctx, w / 2, 0, w / 2, h);
        line(ctx, 0, h, w, 0, '#ffffff50');
        ctx.beginPath();
        for (let i = 0; i <= 128; i++) {
          const x = i / 64 - 1, y = x * (1 - wet) + saturate(x, a.tapeDrive) * wet;
          ctx[i ? 'lineTo' : 'moveTo'](w * i / 128, (1 - y) * h / 2);
        }
        ctx.strokeStyle = '#f1ad78'; ctx.lineWidth = 3; ctx.stroke();
        gr.value = o.compared() ? 0 : Math.min(24, Math.max(0, -graph.deComp.reduction) * a.deess / 100);
        reduction.textContent = fmt.db(-gr.value);
      };
      return [h('div', { class: 'mx-character' }, [
        h('div', { class: 'mx-effect-group' }, [h('h4', { text: t('mx.deess') }),
          h('div', { class: 'mx-gr' }, [h('span', { text: t('mx.gr') }), gr, reduction]),
          section(control('deess', t('mx.wet'), 0, 100, 1, fmt.pct),
            control('deFreq', t('mx.deFreq'), 2500, 12500, 50, fmt.hz),
            control('deThreshold', t('mx.deThreshold'), -60, 0, 1, fmt.db))]),
        h('div', { class: 'mx-effect-group' }, [h('h4', { text: t('mx.tape') }), cv,
          section(control('tape', t('mx.wet'), 0, 100, 1, fmt.pct),
            control('tapeDrive', t('mx.tapeDrive'), 0, 24, .5, fmt.db))])
      ])];
    }
    function reverb() {
      const cv = canvas(t('mx.tail'), 'rev');
      paint = () => {
        const { ctx, w, h } = surface(cv), a = o.get();
        const end = a.decay + a.predelay / 1000;
        for (let i = 1; i <= 5; i++) {
          const x = w * i / 6; line(ctx, x, 0, x, h);
          ctx.fillText((end * i / 6).toFixed(2) + ' s', x + 4, h - 7);
        }
        const lead = w * a.predelay / (end * 1000);
        ctx.beginPath(); ctx.moveTo(0, h - 24); ctx.lineTo(lead, h - 24);
        for (let i = 0; i <= 100; i++) ctx.lineTo(lead + (w - lead) * i / 100, (h - 25) * (1 - Math.exp(-6.908 * i / 100)));
        ctx.lineTo(w, h - 24); ctx.fillStyle = '#ac84de42'; ctx.fill(); ctx.strokeStyle = '#c5a9ff'; ctx.lineWidth = 2; ctx.stroke();
      };
      const modes = ['room', 'plate', 'hall'].map(key => {
        const b = button(title(key), () => { ref('space', key); drawTab(); });
        b.setAttribute('aria-pressed', String(o.get().space === key)); return b;
      });
      return [cv, h('div', { class: 'mx-modes', 'aria-label': t('mx.space') }, [...modes, toggle('revOff', t('mx.bypass'))]),
        section(control('rev', t('mx.wet'), 0, 100, 1, fmt.pct), control('decay', t('mx.decay'), .3, 5, .1, n => n.toFixed(1) + ' s', false, true),
          control('predelay', t('mx.pre'), 0, 200, 1, fmt.ms), control('damp', t('mx.damp'), 20, 18000, 1, fmt.hz, true))];
    }
    function master() {
      const gr = h('meter', { min: 0, max: 24, value: 0, 'aria-label': t('mx.gr') }), reduction = h('b');
      const lamp = h('i', { 'aria-hidden': 'true' });
      const powerLabel = h('span');
      const power = h('button', { type: 'button', class: 'mx-power', 'aria-label': t('mx.limiter'),
        onclick: () => { ref('limiter', !o.get().limiter); paint(); } }, [lamp, powerLabel]);
      const status = h('div', { class: 'mx-module-head' }, [h('h4', { text: t('mx.limiter') }), power]);
      paint = () => {
        const enabled = o.get().limiter;
        power.setAttribute('aria-pressed', String(enabled));
        powerLabel.textContent = t(enabled ? 'mx.on' : 'mx.off');
        gr.value = enabled && !o.compared() ? Math.max(0, -graph.lim.reduction) : 0;
        reduction.textContent = fmt.db(-gr.value);
      };
      const display = h('div', { class: 'mx-gr mx-master-gr' }, [h('span', { text: t('mx.gr') }), reduction, gr]);
      return [status, h('div', { class: 'mx-master-body' }, [display,
        section(control('vol', t('ve.vol'), 0, 200, 1, fmt.pct),
          control('ceiling', t('mx.ceiling'), -12, 0, .1, fmt.db), control('drive', t('mx.drive'), -12, 18, .5, fmt.db))])];
    }
    const designs = { eq: equalizer, comp: compression, character, rev: reverb, master, clean: o.cleanup,
      delay: () => [h('div', { class: 'mx-quick' }, [toggle('delOff', t('mx.bypass'))]), section(control('del', t('mx.wet'), 0, 100, 1, fmt.pct), control('dtime', t('ve.dtime'), 40, 1200, 5, fmt.ms),
        control('feedback', t('mx.feedback'), 0, 88, 1, fmt.pct), control('tone', t('mx.tone'), 20, 15000, 1, fmt.hz, true))] };
    function select(key) {
      if (tab === key) return;
      tab = key; o.select(key); drawTab();
    }
    const buttons = new Map(keys.map(key => [key, h('button', {
      type: 'button', class: 'mx-tab', id: id + '-' + key, role: 'tab', 'aria-controls': id, onclick: () => select(key)
    }, [h('span', { text: title(key) })])]));
    nav.append(...buttons.values());
    nav.onkeydown = event => {
      const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      let key;
      if (direction) key = keys[(keys.indexOf(tab) + direction + keys.length) % keys.length];
      else if (event.key === 'Home') key = keys[0];
      else if (event.key === 'End') key = keys.at(-1);
      else return;
      event.preventDefault(); select(key); buttons.get(key).focus();
    };
    function drawTab() {
      sliders.clear(); paint = () => {};
      for (const [key, b] of buttons) { b.tabIndex = key === tab ? 0 : -1; b.setAttribute('aria-selected', String(key === tab)); }
      work.setAttribute('aria-labelledby', id + '-' + tab);
      work.dataset.plugin = tab;
      work.replaceChildren(...designs[tab]());
      PD.i18n.apply(work);
      paint();
    }
    function peak(node, data) {
      node.getFloatTimeDomainData(data);
      let max = 0; for (const v of data) max = Math.max(max, Math.abs(v));
      return decibels(max);
    }
    drawTab(); paintTransport();
    return { el: h('div', { class: 'mx-rack' }, [head, nav, work]), meter() {
      if (performance.now() - last < 48) return;
      last = performance.now();
      const inDb = peak(graph.pre, levelIn), outDb = peak(graph.meter, levelOut);
      input.value = inDb; output.value = outDb;
      inputPeak.textContent = inDb <= -72 ? '—' : fmt.db(inDb);
      outputPeak.textContent = outDb <= -72 ? '—' : fmt.db(outDb);
      outputPeak.classList.toggle('mx-clipping', outDb >= 0);
      const meterMask = db => 'inset(0 ' + (100 * (1 - clamp((db + 60) / 60, 0, 1))) + '% 0 0)';
      inputLine.fill.style.clipPath = meterMask(inDb);
      outputLine.fill.style.clipPath = meterMask(outDb);
      paintTransport(); paint();
    } };
  }
  return { defaults, presets, chain, panel, transfer, tailSeconds, latency, changed };
})();
