/* =====================================================================
   Microphone analysis. One analysis core (noise-floor tracking, onset
   detection, decimated YIN pitch with confidence, Goertzel check for an
   expected chord) runs inside an AudioWorklet; where AudioWorklet is
   missing the same core runs on a ScriptProcessor. The main thread only
   assembles note events from analysis frames.
   Honesty rules: pitch correctness is reported separately from string
   certainty; low-confidence reads are reported as "unsure".
   ===================================================================== */
PD.detector = (() => {
  /* ---- the analysis core, shared verbatim by the worklet and the fallback ---- */
  const CORE = `
class PDCore {
  constructor(sr, post) {
    this.sr = sr; this.post = post; this.N = 8192; this.buf = new Float32Array(this.N); this.w = 0; this.filled = 0;
    this.dec = sr >= 44100 ? 2 : 1; this.fs = sr / this.dec;
    this.W = Math.round(512 * this.fs / 24000); this.tauMin = Math.floor(this.fs / 1150); this.tauMax = Math.ceil(this.fs / 95);
    this.x = new Float32Array(this.W + this.tauMax + 4); this.d = new Float32Array(this.tauMax + 2);
    this.hop = 0; this.acc = 0; this.env = 0; this.floor = 0.003; this.gate = 0.004; this.k = 3.2; this.lastOn = -9; this.fc = 0; this.lv = 0;
    this.prev = 0; this.hf = 0; this.hfEnv = 0; this.peak = 0; this.pend = null; this.sounding = false; this.lowN = 0; this.hfK = 2.4;
    this.expect = null; this.chordAt = -1; this.g = new Float32Array(4096);
  }
  cfg(m) { if (m.hfK != null) this.hfK = m.hfK; if (m.gate != null) this.gate = m.gate; if (m.k != null) this.k = m.k; if (m.expect !== undefined) this.expect = m.expect; if (m.floor != null) this.floor = m.floor; }
  push(ch, t) {
    const N = this.N; let s = 0;
    let h = 0, pk = this.peak;
    for (let i = 0; i < ch.length; i++) { const v = ch[i]; this.buf[this.w] = v; this.w = (this.w + 1) % N; s += v * v; const dv = v - this.prev; this.prev = v; h += dv * dv; const a = v < 0 ? -v : v; if (a > pk) pk = a; }
    this.filled = Math.min(N, this.filled + ch.length); this.hop += ch.length; this.acc += s; this.hf += h; this.peak = pk;
    if (this.hop >= 256) { const r = Math.sqrt(this.acc / this.hop), hr = Math.sqrt(this.hf / this.hop); this.hop = 0; this.acc = 0; this.hf = 0; this.frame(r, t, hr); }
  }
  frame(r, t, hr) {
    if (r < this.floor) this.floor = this.floor * 0.85 + r * 0.15; else this.floor += (r - this.floor) * 0.0012;
    const thr = Math.max(this.gate, this.floor * this.k);
    // onset: a level rise OR a broadband transient (a new strum on a still-ringing instrument)
    const rise = r > this.env * 1.6, trans = hr > this.hfEnv * this.hfK && hr > thr * 0.35;
    if (r > thr && (rise || trans) && t - this.lastOn > 0.07) {
      if (this.pend) this.flushOnset();
      this.lastOn = t; this.pend = { t: t, pre: this.env, peak: r, n: 0 }; this.sounding = true; this.lowN = 0;
      if (this.expect) this.chordAt = t + 0.06;
    }
    // onset strength = peak level over the first ~48 ms above what was already sounding (accent measure)
    if (this.pend) { if (r > this.pend.peak) this.pend.peak = r; if (++this.pend.n >= 9) this.flushOnset(); }
    // release: the note has decayed into the noise
    if (this.sounding) { if (r < thr * 0.7) { if (++this.lowN >= 4) { this.sounding = false; this.post({ type: 'release', t: t }); } } else this.lowN = 0; }
    this.env = this.env * 0.75 + r * 0.25; this.hfEnv = this.hfEnv * 0.8 + hr * 0.2;
    this.fc = (this.fc + 1) % 2;
    if (this.fc === 0 && r > thr * 0.6 && this.filled > (this.W + this.tauMax) * this.dec + 8) { const p = this.yin(); this.post({ type: 'pitch', t: t, f: p.f, conf: p.c, rms: r }); }
    if (this.chordAt > 0 && t >= this.chordAt) { this.chordAt = -1; this.post(Object.assign({ type: 'chord', t: t }, this.goertzel())); }
    if ((this.lv = (this.lv + 1) % 3) === 0) { this.post({ type: 'level', t: t, rms: r, floor: this.floor, thr: thr, peak: this.peak }); this.peak = 0; }
  }
  flushOnset() { const p = this.pend; this.pend = null; this.post({ type: 'onset', t: p.t, rms: p.peak, strength: Math.max(0, p.peak - p.pre * 0.85) }); }
  read(len, dec) {
    const N = this.N, x = this.x; let p = (this.w - len * dec + N * 4) % N;
    for (let i = 0; i < len; i++) { let v = 0; for (let k = 0; k < dec; k++) { v += this.buf[p]; p = (p + 1) % N; } x[i] = v / dec; }
    return x;
  }
  yin() {
    const W = this.W, tm = this.tauMax, d = this.d, x = this.read(W + tm + 2, this.dec);
    for (let tau = 1; tau <= tm; tau++) { let s = 0; for (let i = 0; i < W; i++) { const q = x[i] - x[i + tau]; s += q * q; } d[tau] = s; }
    d[0] = 1; let run = 0;
    for (let tau = 1; tau <= tm; tau++) { run += d[tau]; d[tau] = run > 0 ? d[tau] * tau / run : 1; }
    let tau = -1;
    for (let k = this.tauMin; k < tm; k++) if (d[k] < 0.13) { while (k + 1 < tm && d[k + 1] < d[k]) k++; tau = k; break; }
    if (tau < 0) { let mn = 9; for (let k = this.tauMin; k < tm; k++) if (d[k] < mn) { mn = d[k]; tau = k; } if (mn > 0.4) return { f: 0, c: 0 }; }
    const a = d[tau - 1], b = d[tau], c = d[tau + 1], den = a - 2 * b + c, sh = den ? 0.5 * (a - c) / den : 0;
    return { f: this.fs / (tau + sh), c: Math.max(0, Math.min(1, 1 - b)) };
  }
  goertzel() {
    const ex = this.expect, n = 4096, N = this.N, g = this.g; let p = (this.w - n + N) % N;
    for (let i = 0; i < n; i++) { g[i] = this.buf[p] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (n - 1))); p = (p + 1) % N; }
    const pw = f => { const w = 2 * Math.PI * f / this.sr, cw = 2 * Math.cos(w); let s1 = 0, s2 = 0; for (let i = 0; i < n; i++) { const s0 = g[i] + cw * s1 - s2; s2 = s1; s1 = s0; } return s1 * s1 + s2 * s2 - cw * s1 * s2; };
    const db = ex.map(f => { const sig = pw(f) + 0.5 * pw(2 * f), noise = (pw(f * 0.943) + pw(f * 1.06)) / 2 + 1e-9; return 10 * Math.log10(sig / noise); });
    return { db: db, present: db.map(v => v > 7) };
  }
}`;
  const WORKLET = CORE + `
class PDAnalyzer extends AudioWorkletProcessor {
  constructor() { super(); this.c = new PDCore(sampleRate, m => this.port.postMessage(m)); this.port.onmessage = e => this.c.cfg(e.data); }
  process(inputs) { const ch = inputs[0] && inputs[0][0]; if (ch) this.c.push(ch, currentTime); return true; }
}
registerProcessor('pd-analyzer', PDAnalyzer);`;

  const st = {
    on: false, stream: null, src: null, node: null, sink: null, sp: null, core: null, mode: '', settings: null,
    level: 0, floor: 0, err: '', win: null, guards: [], guardOn: true, recent: [], selfPlay: [], lastOnsetT: -9, proc: [], peaks: [], lastClip: 0
  };
  const deviceKey = () => 'calib.' + PD.device.key;
  let calib = PD.store.get(deviceKey(), { noise: 0, sens: 60, latencyMs: 0, openCents: null, date: 0, room: 'normal' });
  const listeners = { note: [], pitch: [], onset: [], level: [], chord: [], state: [], release: [], input: [] };
  const emit = (k, v) => listeners[k].forEach(f => { try { f(v); } catch (e) { console.error(e); } });

  /** room presets shift the gate; the sensitivity slider fine-tunes it (users never see these numbers) */
  const ROOM = { quiet: { g: .8, k: -.4, hf: 2.1 }, normal: { g: 1, k: 0, hf: 2.4 }, noisy: { g: 1.9, k: .9, hf: 3.1 } };
  function gateFor() {
    const sens = calib.sens == null ? 60 : calib.sens, base = Math.max(0.0015, (calib.noise || 0.002)), R = ROOM[calib.room] || ROOM.normal;
    return { gate: base * (1.8 + (100 - sens) * 0.05) * R.g, k: 2.4 + (100 - sens) * 0.025 + R.k, hfK: R.hf };
  }
  function cfg(m) { if (st.node) st.node.port.postMessage(m); else if (st.core) st.core.cfg(m); }

  function onMsg(m) {
    if (m.type === 'level') {
      st.level = m.rms; st.floor = m.floor;
      if (m.peak > .97) { st.lastClip = m.t; emit('input', { kind: 'clip' }); }
      emit('level', m); return;
    }
    if (m.type === 'pitch') {
      emit('pitch', m);
      st.recent.push(m); while (st.recent.length && st.recent[0].t < m.t - .4) st.recent.shift();
      if (st.win && m.t >= st.win.t0 + 0.022 && m.t <= st.win.t0 + 0.2 && m.f > 0) st.win.frames.push(m);
      if (st.win && m.t >= st.win.t0 + 0.13) finish(); return;
    }
    if (m.type === 'release') { if (st.lastOnsetT > 0) emit('release', { t: m.t - calib.latencyMs / 1000, dur: m.t - st.lastOnsetT }); return; }
    if (m.type === 'onset') {
      // an onset on top of our own metronome click is held, not dropped: it counts only if pitched instrument sound follows
      const guarded = st.guardOn && st.guards.some(g => Math.abs(g - m.t) < 0.04);
      const ctx = PD.audio.ctx; if (ctx) { st.proc.push(ctx.currentTime - m.t); if (st.proc.length > 30) st.proc.shift(); }
      if (st.win) finish();
      st.lastOnsetT = m.t;
      // pitch frames that arrived before this (slightly delayed) onset message still belong to the note
      st.win = { t0: m.t, rms: m.rms, strength: m.strength, guarded, frames: st.recent.filter(f => f.t >= m.t + 0.022 && f.t <= m.t + 0.2 && f.f > 0) };
      st.peaks.push(m.rms); if (st.peaks.length > 8) st.peaks.shift();
      if (st.peaks.length >= 4 && Math.max(...st.peaks.slice(-4)) < gateFor().gate * 3.2) emit('input', { kind: 'quiet' });
      if (!guarded) emit('onset', { t: m.t - calib.latencyMs / 1000, rms: m.rms, strength: m.strength || m.rms });
      if (st.win.frames.length && st.win.frames[st.win.frames.length - 1].t >= m.t + 0.13) finish();
      return;
    }
    if (m.type === 'chord') { emit('chord', { t: m.t, db: m.db, present: m.present }); }
  }
  function finish() {
    const w = st.win; st.win = null; if (!w) return;
    if (w.guarded) {   // was it the click, or a stroke played exactly on the beat?
      const pitched = w.frames.filter(f => f.conf >= 0.5 && f.f >= 95 && f.f <= 1150).length;
      if (pitched < 2) return;
      emit('onset', { t: w.t0 - calib.latencyMs / 1000, rms: w.rms, strength: w.strength || w.rms });
    }
    const good = w.frames.filter(f => f.conf >= 0.62);
    if (!good.length) { emit('note', { t: w.t0 - calib.latencyMs / 1000, conf: 0, unsure: true, rms: w.rms }); return; }
    const fs = good.map(f => f.f).sort((a, b) => a - b), med = fs[Math.floor(fs.length / 2)];
    const agree = good.filter(f => Math.abs(1200 * Math.log2(f.f / med)) < 40).length / good.length;
    const yc = good.reduce((a, f) => a + f.conf, 0) / good.length;
    const conf = Math.max(0, Math.min(1, yc * agree * Math.min(1, good.length / 3)));
    const midi = PD.theory.midiOf(med);
    // our own playback (demonstrations) is not the learner's panduri
    const now = PD.audio.now(); st.selfPlay = st.selfPlay.filter(x => x.t1 > now - .5);
    if (st.selfPlay.some(x => w.t0 >= x.t0 - .03 && w.t0 <= x.t1 && x.midis.some(q => Math.abs(q - midi) < .4))) return;
    emit('note', { t: w.t0 - calib.latencyMs / 1000, f: med, midi, cents: (midi - Math.round(midi)) * 100, conf, unsure: conf < 0.55, rms: w.rms });
  }

  async function start() {
    if (st.on) return { ok: true };
    const ctx = PD.audio.ensure(); if (!ctx) return fail('noaudio');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return fail(window.isSecureContext ? 'nomedia' : 'insecure');
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !!st.aec, noiseSuppression: false, autoGainControl: false, channelCount: 1 } }); }
    catch (e) {
      if (e && (e.name === 'OverconstrainedError' || e.name === 'TypeError')) { try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e2) { return fail(errName(e2)); } }
      else return fail(errName(e));
    }
    st.stream = stream; const tr = stream.getAudioTracks()[0];
    st.settings = tr && tr.getSettings ? tr.getSettings() : {};
    if (tr) tr.onended = () => { stop(); st.err = 'ended'; emit('state', status()); };
    st.src = ctx.createMediaStreamSource(stream);
    st.sink = ctx.createGain(); st.sink.gain.value = 0; st.sink.connect(ctx.destination);
    try {
      if (!ctx.audioWorklet) throw new Error('no worklet');
      const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
      await ctx.audioWorklet.addModule(url); URL.revokeObjectURL(url);
      st.node = new AudioWorkletNode(ctx, 'pd-analyzer', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1 });
      st.node.port.onmessage = e => onMsg(e.data);
      st.src.connect(st.node); st.node.connect(st.sink); st.mode = 'worklet';
    } catch (_) {
      // Fallback: same core on a ScriptProcessor (still off the render loop)
      const Core = new Function(CORE + '; return PDCore;')();
      st.core = new Core(ctx.sampleRate, onMsg);
      st.sp = ctx.createScriptProcessor(1024, 1, 1);
      st.sp.onaudioprocess = ev => st.core.push(ev.inputBuffer.getChannelData(0), ctx.currentTime);
      st.src.connect(st.sp); st.sp.connect(st.sink); st.mode = 'script';
    }
    st.on = true; st.err = ''; cfg(Object.assign(gateFor(), calib.noise ? { floor: calib.noise } : {}));
    emit('state', status()); return { ok: true };
  }
  function errName(e) { const n = e && e.name; return n === 'NotAllowedError' || n === 'SecurityError' ? 'denied' : n === 'NotFoundError' ? 'notfound' : n === 'NotReadableError' ? 'busy' : 'failed'; }
  function fail(code) { st.err = code; emit('state', status()); return { ok: false, err: code }; }
  /** fully release the microphone */
  function stop() {
    try { if (st.src) st.src.disconnect(); } catch (_) {}
    try { if (st.node) { st.node.port.onmessage = null; st.node.disconnect(); } } catch (_) {}
    try { if (st.sp) { st.sp.onaudioprocess = null; st.sp.disconnect(); } } catch (_) {}
    try { if (st.sink) st.sink.disconnect(); } catch (_) {}
    if (st.stream) st.stream.getTracks().forEach(tr => tr.stop());
    Object.assign(st, { on: false, stream: null, src: null, node: null, sp: null, core: null, sink: null, win: null, level: 0 });
    if (!st.swapping) emit('state', status());
  }
  function status() {
    const s = st.settings || {};
    return { on: st.on, mode: st.mode, err: st.err, raw: s.echoCancellation === false && s.noiseSuppression === false && s.autoGainControl === false, settings: s, label: st.stream && st.stream.getAudioTracks()[0] ? st.stream.getAudioTracks()[0].label : '' };
  }

  return {
    start, stop, status,
    on(k, f) { listeners[k].push(f); return () => { listeners[k] = listeners[k].filter(x => x !== f); }; },
    get active() { return st.on; },
    /** echo cancellation: on while a backing track plays through the speaker, so the microphone hears the panduri, not the recording */
    async setAEC(v, noRestart) { v = !!v; if (!!st.aec === v) return; st.aec = v; if (st.on && !noRestart) { st.swapping = true; stop(); try { await start(); } finally { st.swapping = false; } } },
    get aec() { return !!st.aec; },
    get level() { return st.level; },
    get floor() { return st.floor; },
    /** expected chord frequencies (Hz) for the Goertzel check, or null */
    expect(freqs) { cfg({ expect: freqs && freqs.length ? freqs : null }); },
    /** audio times of our own metronome clicks so they are not mistaken for plucks */
    guard(times) { const n = PD.audio.now(); st.guards = st.guards.filter(x => x > n - 0.2).concat(times || []); },
    set guardOn(v) { st.guardOn = !!v; },
    get calib() { return calib; },
    /** the app is about to play these pitches itself (demo / show me): do not mistake them for the learner */
    selfPlay(midis, t0, dur) { st.selfPlay.push({ midis, t0, t1: t0 + (dur || 1.2) }); },
    /** median time from the sound reaching the input to the app knowing about it (ms) */
    get procLatencyMs() { if (!st.proc.length) return null; const a = st.proc.slice().sort((x, y) => x - y); return Math.round(a[a.length >> 1] * 1000); },
    ROOMS: Object.keys(ROOM),
    setCalib(p) { calib = Object.assign({}, calib, p, { date: Date.now() }); PD.store.set(deviceKey(), calib); cfg(gateFor()); PD.bus.emit('calib', calib); },
    /** measure the room for `sec` seconds and store the noise floor */
    measureNoise(sec) {
      return new Promise(res => {
        const vals = [], off = this.on('level', m => vals.push(m.rms));
        setTimeout(() => { off(); vals.sort((a, b) => a - b); const n = vals.length ? vals[Math.floor(vals.length * 0.6)] : 0.002; this.setCalib({ noise: Math.max(0.0008, n) }); cfg({ floor: n }); res(n); }, sec * 1000);
      });
    }
  };
})();
