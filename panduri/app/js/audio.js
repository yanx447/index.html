/* =====================================================================
   Audio engine: one AudioContext, buses (instrument, metronome, ui,
   reference), sample map with a physically modelled fallback, a
   look-ahead metronome scheduler and reference-audio playback.
   Nothing here depends on the render loop.
   ===================================================================== */
PD.audio = (() => {
  let ctx = null, master, bus = {}, body = null;
  const vol = PD.store.get('vol', { inst: .8, metro: .6, ui: .4, ref: .8, master: .9 });
  const ksCache = new Map();
  /* Real panduri recordings live in PD.samples (multi-articulation, dynamics, round-robin).
     The Karplus–Strong model below is only the fallback when no recording covers a note. */
  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC({ latencyHint: 'interactive' });
    master = ctx.createGain(); master.gain.value = vol.master; master.connect(ctx.destination);
    ['inst', 'metro', 'ui', 'ref'].forEach(k => { const g = ctx.createGain(); g.gain.value = vol[k]; g.connect(master); bus[k] = g; });
    // Body resonance: two broad peaks + gentle high cut, approximating a small carved resonating body.
    const p1 = ctx.createBiquadFilter(); p1.type = 'peaking'; p1.frequency.value = 230; p1.Q.value = 1.4; p1.gain.value = 4;
    const p2 = ctx.createBiquadFilter(); p2.type = 'peaking'; p2.frequency.value = 520; p2.Q.value = 1.1; p2.gain.value = 3;
    const hc = ctx.createBiquadFilter(); hc.type = 'highshelf'; hc.frequency.value = 4200; hc.gain.value = -6;
    p1.connect(p2); p2.connect(hc); hc.connect(bus.inst); body = p1;
    document.addEventListener('visibilitychange', () => { if (!document.hidden && ctx.state === 'suspended') ctx.resume().catch(() => {}); });
    return ctx;
  }
  const now = () => ctx ? ctx.currentTime : performance.now() / 1000;

  /* Karplus–Strong with pick-position comb and frequency-dependent loss.
     vel 0..1 controls brightness (initial noise filtering) and level. */
  function ks(midi, vel) {
    const key = midi + ':' + Math.round(vel * 4);
    if (ksCache.has(key)) return ksCache.get(key);
    const sr = ctx.sampleRate, f = PD.theory.freq(midi), len = Math.floor(sr * 2.2), n = Math.max(2, Math.round(sr / f));
    const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0), ring = new Float32Array(n);
    let lp = 0; const bright = .35 + .5 * vel;
    for (let i = 0; i < n; i++) { lp = lp * (1 - bright) + (Math.random() * 2 - 1) * bright; ring[i] = lp; }
    const pick = Math.max(1, Math.round(n * .14)); // pluck near the bridge: comb notch
    for (let i = n - 1; i >= pick; i--) ring[i] -= .6 * ring[i - pick];
    const decay = .9968 - Math.max(0, midi - 57) * .00011;
    let idx = 0, prev = 0;
    for (let i = 0; i < len; i++) { const v = ring[idx], nx = ring[(idx + 1) % n]; d[i] = v; const y = decay * .5 * (v + nx); ring[idx] = y * .98 + prev * .02; prev = y; idx = (idx + 1) % n; }
    for (let i = 0; i < 48; i++) d[i] *= i / 48;
    let peak = 0; for (let i = 0; i < 4000; i++) peak = Math.max(peak, Math.abs(d[i]));
    if (peak > 0) for (let i = 0; i < len; i++) d[i] /= peak;
    ksCache.set(key, buf); return buf;
  }
  /** play one string at fret; when: audio time (0 = now) */
  function note(s, f, opt) {
    if (!ensure()) return;
    opt = opt || {}; const vel = opt.vel == null ? .7 : opt.vel, when = Math.max(ctx.currentTime, opt.when || 0);
    const midi = PD.theory.midi(s, f);
    const smp = PD.samples && PD.samples.pick(s, f, opt.art || 'pluck', vel);
    const src = ctx.createBufferSource(), g = ctx.createGain();
    if (smp) { src.buffer = smp.buf; src.playbackRate.value = smp.rate; g.gain.value = smp.gain; src.connect(g); g.connect(bus.inst); }   // recordings bypass the synthetic body EQ
    else { src.buffer = ks(midi, vel); g.gain.value = .32 + .22 * vel; src.connect(g); g.connect(body); }
    src.start(when, smp ? smp.offset || 0 : 0);
    if (PD.detector && PD.detector.active) PD.detector.selfPlay([midi], when, (opt.dur || 1.2) + .1);   // never judge our own sound
    if (opt.dur) { g.gain.setValueAtTime(g.gain.value, when + opt.dur); g.gain.exponentialRampToValueAtTime(.0005, when + opt.dur + .25); src.stop(when + opt.dur + .3); }
    return src;
  }
  /** strum frets[3] (null = not played); dir 'down' plays A→C♯→E, 'up' the reverse */
  function strum(frets, dir, opt) {
    if (!ensure()) return;
    opt = opt || {}; const gap = opt.gap == null ? .018 : opt.gap, when = Math.max(ctx.currentTime, opt.when || 0), vel = opt.vel == null ? .75 : opt.vel;
    // a recorded whole-chord stroke wins when the teacher supplied one for exactly this shape and direction
    const ch = PD.samples && PD.samples.pickChord(frets, dir, vel);
    if (ch) { const src = ctx.createBufferSource(), g = ctx.createGain(); src.buffer = ch.buf; g.gain.value = ch.gain; src.connect(g); g.connect(bus.inst); src.start(when, ch.offset || 0); if (PD.detector && PD.detector.active) PD.detector.selfPlay(frets.map((f, i) => f == null ? null : PD.theory.midi(i + 1, f)).filter(x => x != null), when, 1.3); return; }
    const order = dir === 'up' ? [3, 2, 1] : [1, 2, 3];
    order.filter(s => frets[s - 1] != null).forEach((s, k) => note(s, frets[s - 1], { vel, when: when + k * gap, art: opt.mute ? 'mute' : dir === 'up' ? 'up' : 'down' }));
  }
  function blip(freq, dur, gain, type, when, dest) {
    if (!ensure()) return 0;
    const o = ctx.createOscillator(), g = ctx.createGain(), t0 = Math.max(ctx.currentTime, when || 0);
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(gain, t0 + .004); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
    o.connect(g); g.connect(dest || bus.ui); o.start(t0); o.stop(t0 + dur + .02); return t0;
  }
  /** metronome click; the sound is the learner's choice (shared by the metronome page and every lesson) */
  const CLICKS = { click: [2000, 1400, 'square', .04], wood: [1250, 900, 'triangle', .05], beep: [1760, 880, 'sine', .07], soft: [880, 660, 'sine', .09] };
  const click = (when, accent, sub) => { const c = CLICKS[PD.store.get('metroSound', 'click')] || CLICKS.click; return blip(sub ? c[1] * .8 : accent ? c[0] : c[1], c[3] * (sub ? .7 : 1), sub ? .14 : accent ? .5 : .32, c[2], when, bus.metro); };
  const ok = () => blip(1320, .12, .12, 'sine');
  /** sustained reference tone for the tuner */
  function tone(midi, dur) {
    if (!ensure()) return null;
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime;
    o.frequency.value = PD.theory.freq(midi); o2.frequency.value = PD.theory.freq(midi) * 2; o2.type = 'sine';
    const g2 = ctx.createGain(); g2.gain.value = .25; o2.connect(g2); g2.connect(g);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(.18, t0 + .05); g.gain.setValueAtTime(.18, t0 + dur - .2); g.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(g); g.connect(bus.ui); o.start(t0); o2.start(t0); o.stop(t0 + dur); o2.stop(t0 + dur);
    return { stop() { try { g.gain.cancelScheduledValues(0); g.gain.setTargetAtTime(0, ctx.currentTime, .03); o.stop(ctx.currentTime + .15); o2.stop(ctx.currentTime + .15); } catch (_) {} } };
  }
  function setVol(k, v) { vol[k] = v; PD.store.set('vol', vol); if (!ctx) return; if (k === 'master') master.gain.value = v; else if (bus[k]) bus[k].gain.value = v; if (k === 'ref' && ref.el) ref.el.volume = Math.min(1, v); }

  /* ---------- reference audio: <audio> with preservesPitch so tempo changes keep pitch.
     A song may carry stems (full mix · music only · vocals only); one plays at a time, all share one timeline. ---------- */
  const mk = src => { const el = new Audio(src); el.preload = 'auto'; el.preservesPitch = true; el.mozPreservesPitch = true; el.webkitPreservesPitch = true; el.volume = Math.min(1, vol.ref); return el; };
  const ref = {
    el: null, url: null, offset: 0, muted: false, stems: null, els: {}, blobs: {}, mix: PD.store.get('songMix', 'full'),
    async load(blobId, offset) {
      ref.unload(); if (!blobId) return false;
      const b = await PD.blobs.get(blobId); if (!b) return false;
      ref.url = URL.createObjectURL(b); ref.el = mk(ref.url); ref.offset = offset || 0;
      return true;
    },
    loadStems(stems, offset) { ref.unload(); ref.stems = stems; ref.offset = offset || 0; ref.use(ref.mix, true); return !!ref.el; },
    /** switch the audible mix ('full' | 'music' | 'vocals' | 'off') without losing the position.
        Files are read into memory (blob URLs) so seeking works on any server (no HTTP range requests needed). */
    use(mix, quiet) {
      if (!ref.stems) return;
      const was = ref.el, t = was ? was.currentTime : 0, playing = was && !was.paused;
      ref.mix = mix; if (!quiet) PD.store.set('songMix', mix);
      if (was) was.pause();
      const key = ref.stems[mix], src = key && PD.assets && PD.assets.media && PD.assets.media[key];
      if (mix === 'off' || !src) { ref.el = null; return; }
      const stems = ref.stems, attach = el => { if (ref.stems !== stems || ref.mix !== mix) return; ref.el = el; try { el.currentTime = t; } catch (_) {} if (playing) el.play().catch(() => {}); };
      if (ref.els[mix]) return attach(ref.els[mix]);
      ref.el = null;
      if (/^(data|blob):/.test(src)) return attach(ref.els[mix] = mk(src));
      (ref.blobs[src] ? Promise.resolve(ref.blobs[src]) : fetch(src).then(r => r.blob()).then(b => (ref.blobs[src] = URL.createObjectURL(b))))
        .then(u => { if (!ref.els[mix]) ref.els[mix] = mk(u); attach(ref.els[mix]); }).catch(() => {});
    },
    get hasStems() { return !!ref.stems; },
    get available() { return !!(ref.stems && PD.assets && PD.assets.media && PD.assets.media[ref.stems.full || ref.stems.music]); },
    unload() { Object.values(ref.els).forEach(e => { try { e.pause(); } catch (_) {} }); ref.els = {}; if (ref.el) { ref.el.pause(); ref.el = null; } if (ref.url) URL.revokeObjectURL(ref.url); ref.url = null; ref.stems = null; },
    /** keep the media element aligned to the lesson transport (seconds of lesson time at 100%) */
    sync(lessonSec, rate, playing) {
      const el = ref.el; if (!el) return;
      el.muted = ref.muted; el.volume = Math.min(1, vol.ref);
      if (!playing) { if (!el.paused) el.pause(); return; }
      el.playbackRate = Math.max(.25, Math.min(4, rate));
      const target = lessonSec + ref.offset;
      if (target < 0) { if (!el.paused) el.pause(); return; }
      if (Math.abs(el.currentTime - target) > .12) { try { el.currentTime = target; } catch (_) {} }
      if (el.paused) el.play().catch(() => {});
    }
  };

  return {
    ensure, now, note, strum, click, ok, blip, tone, setVol, vol, ref,
    get ctx() { return ctx; },
    get outLatency() { return ctx ? (ctx.outputLatency || 0) + (ctx.baseLatency || 0) : 0; },
  };
})();
