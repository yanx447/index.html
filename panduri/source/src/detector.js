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
    this.prev = 0; this.hf = 0; this.hfEnv = 0; this.peak = 0; this.hrPrev = 0; this.hfEnv1 = 0; this.r5 = new Float32Array(5); this.h5 = new Float32Array(5); this.k5 = 0; this.pend = null; this.sounding = false; this.lowN = 0; this.hfK = 2.4;
    this.expect = null; this.gz = null; this.chordAt = -1; this.g = new Float32Array(4096); this.hw = new Float32Array(4096); for (let i = 0; i < 4096; i++) this.hw[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / 4095);
    // level and onsets are read through a 120 Hz high-pass (2nd-order Butterworth). The lowest panduri note is
    // A3 = 220 Hz; below that there is only hum and rumble, and a tone whose period is longer than one 256-sample
    // frame makes the frame level swing with its phase - 50 Hz mains hum alone read as a stroke every 80 ms.
    // Pitch and the chord check still see the unfiltered signal.
    { const w0 = 2 * Math.PI * 120 / sr, al = Math.sin(w0) / Math.SQRT2, a0 = 1 + al, c = Math.cos(w0);
      this.hb = [(1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, -2 * c / a0, (1 - al) / a0]; this.hz = [0, 0, 0, 0]; }
  }
  cfg(m) { if (m.hfK != null) this.hfK = m.hfK; if (m.gate != null) this.gate = m.gate; if (m.k != null) this.k = m.k; if (m.expect !== undefined) this.expect = m.expect; if (m.floor != null) this.floor = m.floor; }
  push(ch, t) {
    // one analysis frame per 256 samples, whatever the block size: the AudioWorklet delivers 128, the
    // ScriptProcessor fallback 1024. Every time constant below (onset window, release, YIN rate) is
    // counted in frames, so a frame has to mean the same ~5 ms on both paths.
    const N = this.N, buf = this.buf, sr = this.sr;
    const B = this.hb, Z = this.hz; let x1 = Z[0], x2 = Z[1], y1 = Z[2], y2 = Z[3];
    let w = this.w, s = this.acc, h = this.hf, pk = this.peak, prev = this.prev, hop = this.hop, from = 0;
    for (let i = 0; i < ch.length; i++) {
      const v = ch[i]; buf[w] = v; w = w + 1 === N ? 0 : w + 1; const a = v < 0 ? -v : v; if (a > pk) pk = a;   // clipping is judged on the raw input
      const y = B[0] * v + B[1] * x1 + B[2] * x2 - B[3] * y1 - B[4] * y2; x2 = x1; x1 = v; y2 = y1; y1 = y;
      s += y * y; const dv = y - prev; prev = y; h += dv * dv;
      if (++hop >= 256) {
        this.w = w; this.filled = Math.min(N, this.filled + (i + 1 - from)); from = i + 1; this.peak = pk; this.prev = prev;
        const r = Math.sqrt(s / hop), hr = Math.sqrt(h / hop); hop = 0; s = 0; h = 0;
        this.frame(r, t + (i + 1 - 128) / sr, hr); pk = this.peak;
      }
    }
    Z[0] = x1; Z[1] = x2; Z[2] = y1; Z[3] = y2;
    this.w = w; this.filled = Math.min(N, this.filled + (ch.length - from)); this.acc = s; this.hf = h; this.peak = pk; this.prev = prev; this.hop = hop;
  }
  frame(r, t, hr) {
    // the noise floor follows the room, never the music: it may fall at any time, but it rises only while
    // nothing is sounding (or 4 s after the last stroke, so a noise that switched on cannot freeze it).
    // Rising during play let continuous strumming teach the floor its own level: within seconds the
    // gate sat above the strokes and most of them were no longer heard.
    if (r < this.floor) this.floor = this.floor * 0.85 + r * 0.15; else if (!this.sounding || t - this.lastOn > 4) this.floor += (r - this.floor) * 0.0012;
    const thr = Math.max(this.gate, this.floor * this.k);
    // onset: a level rise OR a broadband transient (a new strum on a still-ringing instrument)
    // A stroke on strings that are still ringing hardly raises the level (the string is stopped and struck
    // again), but it always brings a burst of fresh high partials; one 5 ms frame jitters too much to see a soft
    // one, so the burst is also read over two frames against the level before them.
    // The frame must also stand above the loudest of the 4 frames before it (21 ms, a whole period down to
    // 47 Hz; for the two-frame reading, the 4 before its first frame): a steady sound swings from frame to frame
    // with its own phase and never passes that test. Out of silence (released) there is nothing to guard against.
    const R5 = this.r5, H5 = this.h5, j = this.k5; let rMax = 0, hMax = 0, hMaxP = 0;
    for (let q = 1; q <= 5; q++) { const i = (j - q + 10) % 5; if (q <= 4) { if (R5[i] > rMax) rMax = R5[i]; if (H5[i] > hMax) hMax = H5[i]; } if (q >= 2 && H5[i] > hMaxP) hMaxP = H5[i]; }
    const rise = r > this.env * 1.6 && (r > rMax * 1.25 || !this.sounding),
      trans = hr > thr * 0.35 && ((hr > this.hfEnv * this.hfK && hr > hMax * 1.25) || ((hr + this.hrPrev) > 2 * this.hfEnv1 * this.hfK * 0.65 && Math.max(hr, this.hrPrev) > hMaxP * 1.25));
    R5[j] = r; H5[j] = hr; this.k5 = (j + 1) % 5;
    if (r > thr && (rise || trans) && t - this.lastOn > 0.07) {
      if (this.pend) this.flushOnset();
      this.lastOn = t; this.pend = { t: t, pre: this.env, peak: r, n: 0 }; this.sounding = true; this.lowN = 0;
      if (this.expect) { this.chordAt = t + 4096 / this.sr + 0.004; this.chordOn = t; this.chordExp = this.expect; }   // judged against the chord expected at the stroke; the 4096-sample window opens just after it, so the chord before is not in it
    }
    // onset strength = peak level over the first ~48 ms above what was already sounding (accent measure)
    if (this.pend) { if (r > this.pend.peak) this.pend.peak = r; if (++this.pend.n >= 9) this.flushOnset(); }
    // release: the note has decayed into the noise
    if (this.sounding) { if (r < thr * 0.7) { if (++this.lowN >= 4) { this.sounding = false; this.post({ type: 'release', t: t }); } } else this.lowN = 0; }
    this.env = this.env * 0.75 + r * 0.25; this.hfEnv1 = this.hfEnv; this.hfEnv = this.hfEnv * 0.8 + hr * 0.2; this.hrPrev = hr;
    this.fc = (this.fc + 1) % 2;
    // the chord check is spread over one frame per note, and YIN waits while it runs: both in one 2.7 ms audio
    // quantum overran it (4.5 ms measured on a laptop core), and an overrun is a dropout for every sound the app plays
    let busy = false;
    if (this.chordAt > 0 && t >= this.chordAt) { this.chordAt = -1; if (this.chordExp) { this.gzOpen(this.chordExp, t); busy = true; } }
    else if (this.gz) { busy = true; if (this.gzStep()) { const z = this.gz; this.gz = null; this.post(Object.assign({ type: 'chord', t: z.t, t0: z.t0, exp: z.ex }, this.gzDone(z))); } }
    if (!busy && this.fc === 0 && r > thr * 0.6 && this.filled > (this.W + this.tauMax) * this.dec + 8) { const p = this.yin(); this.post({ type: 'pitch', t: t, f: p.f, conf: p.c, rms: r }); }
    if ((this.lv = (this.lv + 1) % 3) === 0) { this.post({ type: 'level', t: t, rms: r, floor: this.floor, thr: thr, peak: this.peak }); this.peak = 0; }
  }
  flushOnset() { const p = this.pend; this.pend = null; this.post({ type: 'onset', t: p.t, rms: p.peak, strength: Math.max(0, p.peak - p.pre * 0.85) }); }
  read(len, dec) {
    const N = this.N, x = this.x; let p = (this.w - len * dec + N * 4) % N;
    for (let i = 0; i < len; i++) { let v = 0; for (let k = 0; k < dec; k++) { v += this.buf[p]; p = (p + 1) % N; } x[i] = v / dec; }
    return x;
  }
  /** cumulative-mean-normalised difference d[a..b], continuing the running sum this.yr */
  ydf(x, a, b) {
    const W = this.W, d = this.d; let run = this.yr;
    for (let tau = a; tau <= b; tau++) { let s = 0; for (let i = 0; i < W; i++) { const q = x[i] - x[i + tau]; s += q * q; } run += s; d[tau] = run > 0 ? s * tau / run : 1; }
    this.yr = run;
  }
  yin() {
    // the difference function is built 32 lags at a time and only as far as it is needed: the first dip under the
    // threshold ends the search, so a clean 440 Hz note costs ~64 lags instead of all 253. Same values as computing all.
    const tm = this.tauMax, d = this.d, x = this.read(this.W + tm + 2, this.dec);
    d[0] = 1; this.yr = 0; let n = 0, tau = -1;
    const need = k => { if (k > n && n < tm) { const b = Math.min(tm, Math.max(k, n + 32)); this.ydf(x, n + 1, b); n = b; } };
    for (let k = this.tauMin; k < tm; k++) {
      need(k + 1);
      if (d[k] < 0.13) { need(k + 2); while (k + 1 < tm && d[k + 1] < d[k]) { k++; need(k + 2); } tau = k; break; }
    }
    if (tau < 0) { need(tm); let mn = 9; for (let k = this.tauMin; k < tm; k++) if (d[k] < mn) { mn = d[k]; tau = k; } if (mn > 0.4) return { f: 0, c: 0 }; }
    need(tau + 1);
    const a = d[tau - 1], b = d[tau], c = d[tau + 1], den = a - 2 * b + c, sh = den ? 0.5 * (a - c) / den : 0;
    return { f: this.fs / (tau + sh), c: Math.max(0, Math.min(1, 1 - b)) };
  }
  /* Is each expected note sounding, and not the fret next to it? 4096 samples (85-93 ms) cannot separate a
     semitone at A3 (13 Hz, about one bin): inside the window's main lobe a neighbour only reads 6 dB below the
     note itself. So the note is compared with the louder of its two semitone neighbours, not with their
     average against a fixed 7 dB, and the octave (where a semitone is two bins apart) is weighed in.
     A neighbour that is itself one of the chord's notes (B and C in a maj7 shape) is not a "wrong fret"; the
     whole tone further out is used instead. A note far below the loudest one is a string not struck. */
  gzOpen(ex, t) {   // take the window now (the stroke is in it), weigh the notes over the next frames
    const n = 4096, N = this.N, g = this.g, hw = this.hw; let p = (this.w - n + N) % N;
    for (let i = 0; i < n; i++) { g[i] = this.buf[p] * hw[i]; p = (p + 1) % N; }
    this.gz = { ex: ex, t: t, t0: this.chordOn, i: 0, sv: [], ref: [] };   // the stroke's own time, kept: another may come before this is done
  }
  gzPow(f) {
    const n = 4096, g = this.g, sr = this.sr; if (f >= sr / 2) return 0;
    const w = 2 * Math.PI * f / sr, cw = 2 * Math.cos(w); let s1 = 0, s2 = 0;
    for (let i = 0; i < n; i++) { const s0 = g[i] + cw * s1 - s2; s2 = s1; s1 = s0; }
    return s1 * s1 + s2 * s2 - cw * s1 * s2;
  }
  /** one note per call; true when every note has been weighed */
  gzStep() {
    const z = this.gz, ex = z.ex, i = z.i, f = ex[i], semi = Math.pow(2, 1 / 12);
    const S = q => this.gzPow(q) + 0.6 * this.gzPow(2 * q), taken = q => ex.some((e, j) => j !== i && Math.abs(1200 * Math.log2(q / e)) < 40);
    let refs = [f / semi, f * semi].filter(q => !taken(q));
    if (!refs.length) refs = [f / semi / semi, f * semi * semi].filter(q => !taken(q));
    z.sv.push(S(f)); z.ref.push(refs.length ? Math.max.apply(null, refs.map(S)) : 0);
    return ++z.i >= ex.length;
  }
  gzDone(z) {
    const top = Math.max.apply(null, z.sv) + 1e-12, db = z.sv.map((v, i) => 10 * Math.log10((v + 1e-12) / (z.ref[i] + 1e-12)));
    return { db: db, present: db.map((v, i) => v > 2 && z.sv[i] > top * 0.02) };
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
    level: 0, floor: 0, err: '', win: null, guards: [], guardOn: PD.store.get('clickGuard', true) !== false, recent: [], selfPlay: [], lastOnsetT: -9, proc: [], peaks: [], lastClip: 0,
    expect: null, starting: null, cancel: false
  };
  /** time from a sound leaving the speaker to the microphone hearing it (calibrated, else a typical value) */
  const roundTrip = () => (calib.latencyMs ? calib.latencyMs / 1000 : ((PD.audio.outLatency || 0) + .02));
  /** is a sound heard at input time t one of our own (metronome click, demo, example)? */
  function ours(t, midi) {
    const L = roundTrip(), now = PD.audio.now();
    st.selfPlay = st.selfPlay.filter(x => x.t1 + L > now - .5);
    return st.selfPlay.some(x => t >= x.t0 + L - .05 && t <= x.t1 + L && (midi == null || x.midis.some(q => Math.abs(q - midi) < .4)));
  }
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
    if (m.type === 'release') { if (st.win) finish();   // a short note has ended: report it now, not at the next pluck
      if (st.lastOnsetT > 0) emit('release', { t: m.t - calib.latencyMs / 1000, dur: m.t - st.lastOnsetT }); return; }
    if (m.type === 'onset') {
      // an onset on top of our own metronome click is held, not dropped: it counts only if pitched instrument sound follows
      const L = roundTrip(), guarded = st.guardOn && st.guards.some(g => Math.abs(g + L - m.t) < 0.05 || Math.abs(g - m.t) < 0.04);
      const self = ours(m.t);   // the app's own example strum / note: never the learner
      const ctx = PD.audio.ctx; if (ctx) { st.proc.push(ctx.currentTime - m.t); if (st.proc.length > 30) st.proc.shift(); }
      if (st.win) finish();
      st.lastOnsetT = m.t;
      // pitch frames that arrived before this (slightly delayed) onset message still belong to the note
      st.win = { t0: m.t, rms: m.rms, strength: m.strength, guarded, self, frames: st.recent.filter(f => f.t >= m.t + 0.022 && f.t <= m.t + 0.2 && f.f > 0) };
      st.peaks.push(m.rms); if (st.peaks.length > 8) st.peaks.shift();
      if (st.peaks.length >= 4 && Math.max(...st.peaks.slice(-4)) < gateFor().gate * 3.2) emit('input', { kind: 'quiet' });
      if (!guarded && !self) emit('onset', { t: m.t - calib.latencyMs / 1000, rms: m.rms, strength: m.strength || m.rms });
      if (st.win.frames.length && st.win.frames[st.win.frames.length - 1].t >= m.t + 0.13) finish();
      else { const w0 = st.win; clearTimeout(st.winT); st.winT = setTimeout(() => { if (st.win === w0) finish(); }, 280); }   // soft notes: no later pitch frame may come
      return;
    }
    // the chord check runs ~90 ms after the stroke; report the stroke's own time
    if (m.type === 'chord') { const t0 = m.t0 != null ? m.t0 : m.t - .06; if (ours(t0)) return; emit('chord', { t: t0 - calib.latencyMs / 1000, db: m.db, present: m.present, exp: m.exp }); }
  }
  function finish() {
    const w = st.win; st.win = null; if (!w) return;
    if (w.self) return;
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
    if (ours(w.t0, midi)) return;
    emit('note', { t: w.t0 - calib.latencyMs / 1000, f: med, midi, cents: (midi - Math.round(midi)) * 100, conf, unsure: conf < 0.55, rms: w.rms });
  }

  function start() {
    if (st.on) return Promise.resolve({ ok: true });
    if (st.starting) return st.starting;
    st.cancel = false;
    st.starting = start0().finally(() => { st.starting = null; });
    return st.starting;
  }
  async function start0() {
    const ctx = PD.audio.ensure(); if (!ctx) return fail('noaudio');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return fail(window.isSecureContext ? 'nomedia' : 'insecure');
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: !!st.aec, noiseSuppression: false, autoGainControl: false, channelCount: 1 } }); }
    catch (e) {
      if (e && (e.name === 'OverconstrainedError' || e.name === 'TypeError')) { try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e2) { return fail(errName(e2)); } }
      else return fail(errName(e));
    }
    if (st.cancel) { stream.getTracks().forEach(tr => tr.stop()); st.cancel = false; return { ok: false, err: 'cancelled' }; }
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
    if (st.cancel) { st.on = true; st.cancel = false; stop(); return { ok: false, err: 'cancelled' }; }
    st.on = true; st.err = ''; cfg(Object.assign(gateFor(), calib.noise ? { floor: calib.noise } : {}, { expect: st.expect }));
    emit('state', status()); return { ok: true };
  }
  function errName(e) { const n = e && e.name; return n === 'NotAllowedError' || n === 'SecurityError' ? 'denied' : n === 'NotFoundError' ? 'notfound' : n === 'NotReadableError' ? 'busy' : 'failed'; }
  function fail(code) { st.err = code; emit('state', status()); return { ok: false, err: code }; }
  /** fully release the microphone */
  function stop() {
    if (st.starting && !st.on) st.cancel = true;   // a start still waiting for permission is abandoned
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
    expect(freqs) { st.expect = freqs && freqs.length ? freqs : null; cfg({ expect: st.expect }); },
    /** audio times of our own metronome clicks so they are not mistaken for plucks */
    guard(times) { const n = PD.audio.now(); st.guards = st.guards.filter(x => x > n - .4 - roundTrip()).concat(times || []); },
    set guardOn(v) { st.guardOn = !!v; },
    get guardOn() { return st.guardOn; },
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
