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
  function setVol(k, v) { vol[k] = v; PD.store.set('vol', vol); if (!ctx) return; if (k === 'master') master.gain.value = v; else if (bus[k]) bus[k].gain.value = v; }

  /* ---------- the song recording ----------
     Played by Web Audio from a decoded buffer — on the same clock and through the same output as the
     metronome, so music and clicks can never drift apart on any phone, tablet, computer or TV
     (an <audio> element adds its own device-dependent delay that the app cannot measure).
     The engine says where the song must be (song seconds at 100 %) and how fast; positions are exact.
     Other tempos use a pitch-keeping time-stretch (WSOLA), prepared once per tempo in a background worker.
     Stems are kept mono at 32 kHz, which keeps a 4–5 minute song light on phones. */
  const SR = 32000;
  const WSOLA = "/** WSOLA time-stretch (pitch kept). x: mono Float32Array, rate < 1 = slower. Returns Float32Array of length x.length / rate. */\nfunction wsola(x, sr, rate, onProgress) {\n  const N = Math.max(512, Math.round(sr * 0.05) & ~1), Hs = N >> 1, Ha = Hs * rate, tol = Math.round(sr * 0.012), D = 8;\n  const w = new Float32Array(N); for (let i = 0; i < N; i++) w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);\n  const outLen = Math.ceil(x.length / rate), y = new Float32Array(outLen + N);\n  const nd = Math.floor(x.length / D), xd = new Float32Array(nd);\n  for (let i = 0; i < nd; i++) { let s = 0; const o = i * D; for (let j = 0; j < D; j++) s += x[o + j]; xd[i] = s; }\n  const L = Hs, Ld = Math.floor(L / D), tolD = Math.ceil(tol / D);\n  const frames = Math.floor((x.length - N - tol - Hs) / Ha);\n  let prev = 0;\n  for (let k = 0; k < frames; k++) {\n    const ideal = Math.round(k * Ha); let pos = ideal;\n    if (k > 0) {\n      const nat = prev + Hs, natD = Math.floor(nat / D), idD = Math.floor(ideal / D);\n      let best = -Infinity, bd = 0;\n      for (let d = -tolD; d <= tolD; d++) {\n        const c0 = idD + d; if (c0 < 0 || c0 + Ld >= nd || natD + Ld >= nd) continue;\n        let s = 0; for (let i = 0; i < Ld; i++) s += xd[c0 + i] * xd[natD + i];\n        if (s > best) { best = s; bd = d; }\n      }\n      const c = (idD + bd) * D; let bestF = -Infinity, bp = c;\n      for (let d = -D; d <= D; d++) { const p = c + d; if (p < 0 || p + N >= x.length) continue; let s = 0; for (let i = 0; i < L; i += 2) s += x[p + i] * x[nat + i]; if (s > bestF) { bestF = s; bp = p; } }\n      pos = bp;\n    }\n    const o = k * Hs; for (let i = 0; i < N; i++) y[o + i] += x[pos + i] * w[i];\n    prev = pos;\n    if (onProgress && (k & 511) === 0) onProgress(k / frames);\n  }\n  return y.subarray(0, outLen);\n}\n";
  const ref = {
    stems: null, blobId: null, mix: PD.store.get('songMix', 'full'), muted: false,
    buf: {}, str: {}, job: {}, cur: null, used: [], state: 'idle', progress: 0, error: null,
    get hasStems() { return !!ref.stems; },
    get available() { return !!(ref.blobId || (ref.stems && PD.assets && PD.assets.media && PD.assets.media[ref.stems.full || ref.stems.music])); },
    get playing() { return !!ref.cur; },
    /** cache key of what should sound now: the stem's file, or a teacher recording */
    get key() { return ref.blobId ? 'blob:' + ref.blobId : ref.stems && ref.mix !== 'off' ? ref.stems[ref.mix] || null : null; },
    loadStems(stems) { ref.unload(); ref.stems = stems; prepare(ref.key); return ref.available; },
    load(blobId) { ref.unload(); ref.blobId = blobId || null; prepare(ref.key); return !!blobId; },
    /** start decoding a song's recording early (e.g. when its page opens), so the first play starts at once */
    preload(stems, mix) { if (!stems) return; const k = stems[mix || ref.mix] || stems.full; if (k && !ref.buf[k] && !ref.job[k]) { const keep = ref.stems; ref.stems = stems; prepare(k); ref.stems = keep; } },
    /** switch the audible mix ('full' | 'music' | 'vocals' | 'off'); playback continues at the same place once the new mix is ready */
    use(mix, quiet) { ref.mix = mix; if (!quiet) PD.store.set('songMix', mix); if (mix === 'off') stopCur(); else prepare(ref.key); },
    /** leave the song: playback stops; decoded recordings stay cached (two at most) so the next stage starts at once */
    unload() { stopCur(true); Object.keys(ref.job).forEach(x => { if (x.indexOf('@') > 0) { ref.job[x].cancel(); delete ref.job[x]; } }); ref.stems = null; ref.blobId = null; setState('idle'); },
    /** is the recording ready to play at this speed? (true also when there is nothing to play) */
    ready(rate) { const k = ref.key; if (!k) return true; if (ref.error) return true; const b = ref.buf[k]; if (!b) return false; return near1(rate) || !!ref.str[k + '@' + rkey(rate)]; },
    /** resolves when ready(rate), starting whatever loading or stretching is needed */
    whenReady(rate) {
      return new Promise(res => { const k = ref.key; if (ref.ready(rate)) return res(true);
        const tick = () => { if (ref.key !== k) return res(false); if (ref.ready(rate)) return res(!ref.error); if (ref.buf[k] && !near1(rate)) stretched(k, rate); setTimeout(tick, 120); };
        prepare(k); tick(); });
    },
    /** keep the recording at song time songT (valid at audio time `at`), moving at `rate` × the recording's speed */
    sync(songT, at, rate, live) {
      if (!live || !ref.key) { stopCur(); return; }
      const c = ensure(); if (!c) return;
      const k = ref.key, r = near1(rate) ? 1 : rate, b = r === 1 ? ref.buf[k] : stretched(k, r);
      const now = c.currentTime;
      if (!b) {
        prepare(k);
        // the new mix (or tempo) is still being prepared: the music that is playing keeps going meanwhile
        if (ref.cur && near1(ref.cur.r / (r || 1)) && now >= ref.cur.when) { const pos = (ref.cur.off + (now - ref.cur.when)) * ref.cur.r, want = songT + (now - at) * rate; if (Math.abs(pos - want) < .012) return; }
        stopCur(); return;
      }
      if (ref.cur && ref.cur.buf === b && !ref.cur.ending) {
        if (now < ref.cur.when) return;                              // scheduled, not started yet
        const pos = (ref.cur.off + (now - ref.cur.when)) * r, want = songT + (now - at) * rate;
        if (Math.abs(pos - want) < .012) return;                     // in step
      }
      const when = Math.max(now + .03, at);
      startCur(b, r, when, songT + (when - at) * rate);
    }
  };
  const near1 = r => Math.abs(r - 1) < .004;
  const rkey = r => (Math.round(r * 1000) / 1000).toFixed(3);
  function setState(st, p) { ref.state = st; ref.progress = p || 0; PD.bus.emit('refstate', { state: st, progress: ref.progress }); }
  function stopCur(now) {
    const cu = ref.cur; if (!cu) return; ref.cur = null;
    try { const t = ctx.currentTime; cu.g.gain.cancelScheduledValues(t); cu.g.gain.setValueAtTime(cu.g.gain.value, t); cu.g.gain.linearRampToValueAtTime(0, t + (now ? .005 : .025)); cu.src.stop(t + (now ? .01 : .03)); } catch (_) {}
  }
  function startCur(b, r, when, songAt) {
    stopCur();
    let off = songAt / r, w = when;
    if (off < 0) { w = when - off; off = 0; }                       // the song starts a moment later
    if (off >= b.duration - .01) return;
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b; src.connect(g); g.connect(bus.ref);
    g.gain.setValueAtTime(0, w); g.gain.linearRampToValueAtTime(ref.muted ? 0 : 1, w + .015);
    src.start(w, off);
    const cu = { src, g, when: w, off, buf: b, r }; ref.starts = (ref.starts || 0) + 1;
    src.onended = () => { if (ref.cur === cu) ref.cur = null; };
    ref.cur = cu;
  }
  /** load + decode one stem (mono, 32 kHz); one job per stem; at most two stems are kept in memory */
  function prepare(k) {
    if (!k || ref.buf[k] || ref.job[k]) return;
    ref.error = null; setState('loading');
    const job = { cancelled: false, cancel() { job.cancelled = true; } }; ref.job[k] = job;
    let src;
    if (k.indexOf('blob:') === 0) src = PD.blobs.get(k.slice(5)).then(b => b ? b.arrayBuffer() : Promise.reject(new Error('missing')));
    else { const u = PD.assets && PD.assets.media && PD.assets.media[k]; src = u ? fetch(u).then(r => r.arrayBuffer()) : Promise.reject(new Error('missing')); }
    src.then(decodeMono).then(b => {
      if (job.cancelled) return;
      delete ref.job[k]; ref.buf[k] = b; ref.used = ref.used.filter(x => x !== k).concat(k);
      while (ref.used.length > 2) { const old = ref.used.shift(); if (old !== ref.key) { delete ref.buf[old]; Object.keys(ref.str).forEach(x => { if (x.indexOf(old + '@') === 0) delete ref.str[x]; }); } else ref.used.push(old); if (ref.used.length > 2 && ref.used.every(x => x === ref.key)) break; }
      setState('ready');
    }).catch(e => { if (job.cancelled) return; delete ref.job[k]; ref.error = e; setState('error'); });
  }
  function decodeMono(ab) {
    return new Promise((res, rej) => {
      const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      let c = null; try { c = OAC ? new OAC(1, 1, SR) : ensure(); } catch (_) { c = ensure(); }
      if (!c) return rej(new Error('no audio'));
      let done = false;
      const ok = b => { if (done) return; done = true; try { res(toMono(b)); } catch (e) { rej(e); } }, bad = e => { if (done) return; done = true; rej(e || new Error('decode')); };
      try { const p = c.decodeAudioData(ab, ok, bad); if (p && p.then) p.then(ok, bad); } catch (e) { bad(e); }
    });
  }
  function toMono(b) {
    if (b.numberOfChannels === 1) return b;
    const c = ensure(), n = b.length, out = c.createBuffer(1, n, b.sampleRate), d = out.getChannelData(0), L = b.getChannelData(0), R = b.getChannelData(1);
    for (let i = 0; i < n; i++) d[i] = (L[i] + R[i]) * .5;
    return out;
  }
  /** the stretched version of a stem for one tempo (null while it is being prepared) */
  function stretched(k, rate) {
    const sk = k + '@' + rkey(rate); if (ref.str[sk]) return ref.str[sk];
    const b = ref.buf[k]; if (!b) return null;
    if (ref.job[sk]) return null;
    // a new tempo replaces the previous preparation (the learner may be moving the tempo slider)
    Object.keys(ref.job).forEach(x => { if (x.indexOf('@') > 0 && x !== sk) { ref.job[x].cancel(); delete ref.job[x]; } });
    const job = { cancelled: false, w: null, cancel() { job.cancelled = true; if (job.w) try { job.w.terminate(); } catch (_) {} } }; ref.job[sk] = job;
    setState('stretching', 0);
    const finish = y => {
      if (job.cancelled) return; delete ref.job[sk];
      const c = ensure(), out = c.createBuffer(1, y.length, b.sampleRate); out.getChannelData(0).set(y);
      Object.keys(ref.str).forEach(x => { if (x.indexOf(k + '@') === 0) delete ref.str[x]; });   // keep one tempo per stem
      ref.str[sk] = out; setState('ready');
    };
    const x = b.getChannelData(0).slice(0);
    let worker = null;
    try { worker = new Worker(URL.createObjectURL(new Blob([WSOLA + '\nonmessage=function(e){var d=e.data;var y=wsola(d.x,d.sr,d.rate,function(p){postMessage({p:p});});postMessage({y:y},[y.buffer]);};'], { type: 'text/javascript' }))); } catch (_) { worker = null; }
    if (worker) {
      job.w = worker;
      worker.onmessage = e => { if (e.data.p != null) { if (!job.cancelled) setState('stretching', e.data.p); return; } worker.terminate(); finish(e.data.y.slice ? new Float32Array(e.data.y) : e.data.y); };
      worker.onerror = () => { worker.terminate(); if (!job.cancelled) setTimeout(() => finish(wsolaFn(x, b.sampleRate, rate)), 30); };
      worker.postMessage({ x, sr: b.sampleRate, rate }, [x.buffer]);
    } else setTimeout(() => { if (!job.cancelled) finish(wsolaFn(x, b.sampleRate, rate)); }, 30);
    return null;
  }
  const wsolaFn = (() => { /* same algorithm, for browsers without workers */ return new Function(WSOLA + '\nreturn wsola;')(); })();

  return {
    ensure, now, note, strum, click, ok, blip, tone, setVol, vol, ref,
    get ctx() { return ctx; },
    get outLatency() { return ctx ? (ctx.outputLatency || 0) + (ctx.baseLatency || 0) : 0; },
  };
})();
