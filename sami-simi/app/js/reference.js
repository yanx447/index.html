// Procedural Panduri pluck — extended Karplus–Strong.
//  • excitation: filtered noise burst with pick-position comb (plucked near the soundboard)
//  • loop: frequency-dependent loss + first-order allpass fractional delay → exact pitch
//  • per-string timbre (brightness, pluck position, sustain)
//  • small-body resonances (three band-pass modes) mixed with the dry string
// Rendered once per note and cached; no audio files needed.

import { audioContext, resumeContext } from './audio-input.js';

const STRING_VOICING = [
  { bright: 0.47, pick: 0.17, t60: 3.1, soft: 0.55 }, // string 1 (A) — warmest
  { bright: 0.45, pick: 0.15, t60: 2.8, soft: 0.5 },
  { bright: 0.43, pick: 0.13, t60: 2.5, soft: 0.45 }, // string 3 (E) — brightest
];
const BODY_MODES = [
  { f: 235, q: 6, g: 0.34 },
  { f: 540, q: 4.5, g: 0.22 },
  { f: 1480, q: 2.5, g: 0.12 },
];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bandpass(input, sr, f, q) {
  const w = (2 * Math.PI * f) / sr, alpha = Math.sin(w) / (2 * q), cw = Math.cos(w);
  const a0 = 1 + alpha;
  const b0 = alpha / a0, b2 = -alpha / a0, a1 = (-2 * cw) / a0, a2 = (1 - alpha) / a0;
  const out = new Float32Array(input.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const x = input[i];
    const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    out[i] = y;
  }
  return out;
}

/** Pure renderer — returns a Float32Array (tested in Node for pitch accuracy). */
export function renderPluck(freq, sr, { stringIndex = 0, duration = 3.2, seed = 7 } = {}) {
  const v = STRING_VOICING[Math.min(stringIndex, STRING_VOICING.length - 1)];
  const n = Math.floor(sr * duration);
  const rnd = mulberry32(seed + stringIndex * 101);

  // loop delay must equal sr/freq: N (delay line) + S (loss filter) + frac (allpass)
  const S = v.bright;
  const P = sr / freq;
  let N = Math.floor(P - S - 0.1);
  let frac = P - S - N;
  if (frac < 0.1) { N -= 1; frac += 1; }
  const C = (1 - frac) / (1 + frac);
  const g = Math.pow(10, -3 / (v.t60 * freq)); // per-period loss for the requested T60

  // excitation: one period of soft-filtered noise with pick-position comb
  const exc = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) { lp += (rnd() * 2 - 1 - lp) * (1 - v.soft); exc[i] = lp; }
  const pd = Math.max(1, Math.round(v.pick * N));
  const exc2 = new Float32Array(N);
  let mean = 0;
  for (let i = 0; i < N; i++) { exc2[i] = exc[i] - (i >= pd ? exc[i - pd] : 0); mean += exc2[i]; }
  mean /= N;
  for (let i = 0; i < N; i++) exc2[i] -= mean;

  const dl = new Float32Array(N);
  const dry = new Float32Array(n);
  let idx = 0, prev = 0, apIn = 0, apOut = 0;
  for (let i = 0; i < n; i++) {
    const out = dl[idx];
    const lf = g * ((1 - S) * out + S * prev);
    prev = out;
    const ap = C * lf + apIn - C * apOut;
    apIn = lf; apOut = ap;
    dl[idx] = ap + (i < N ? exc2[i] : 0);
    idx = idx + 1 === N ? 0 : idx + 1;
    dry[i] = out;
  }

  const mix = new Float32Array(n);
  for (let i = 0; i < n; i++) mix[i] = dry[i] * 0.78;
  for (const m of BODY_MODES) {
    const b = bandpass(dry, sr, m.f, m.q);
    for (let i = 0; i < n; i++) mix[i] += b[i] * m.g;
  }

  // envelope: 1.5 ms attack, 150 ms release at the end, normalise
  const att = Math.floor(sr * 0.0015), rel = Math.floor(sr * 0.15);
  let peak = 0;
  for (let i = 0; i < n; i++) {
    if (i < att) mix[i] *= i / att;
    if (i > n - rel) mix[i] *= (n - i) / rel;
    const a = Math.abs(mix[i]); if (a > peak) peak = a;
  }
  const norm = peak > 0 ? 0.9 / peak : 1;
  for (let i = 0; i < n; i++) mix[i] *= norm;
  return mix;
}

export class ReferenceEngine {
  constructor() {
    this.cache = new Map();
    this.volume = 0.75;
    this.busyUntil = 0;
    this.sources = new Set();
    this.duration = 3.2;
  }

  buffer(freq, stringIndex) {
    const ctx = audioContext();
    const key = `${ctx.sampleRate}|${freq.toFixed(3)}|${stringIndex}`;
    let buf = this.cache.get(key);
    if (!buf) {
      const data = renderPluck(freq, ctx.sampleRate, { stringIndex, duration: this.duration });
      buf = ctx.createBuffer(1, data.length, ctx.sampleRate);
      buf.copyToChannel ? buf.copyToChannel(data, 0) : buf.getChannelData(0).set(data);
      if (this.cache.size > 24) this.cache.clear();
      this.cache.set(key, buf);
    }
    return buf;
  }

  play(freq, stringIndex = 0, when = 0, gain = 1) {
    const ctx = audioContext();
    resumeContext();
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = this.buffer(freq, stringIndex);
    g.gain.value = this.volume * gain;
    src.connect(g).connect(ctx.destination);
    src.start(ctx.currentTime + when);
    this.sources.add(src);
    src.onended = () => { this.sources.delete(src); try { g.disconnect(); } catch (e) { /* noop */ } };
    // the tuner ignores the microphone while the reference sounds (+ room tail)
    this.busyUntil = Math.max(this.busyUntil, performance.now() + (when + this.duration) * 1000 + 200);
  }

  playChord(strings) {
    strings.forEach((s, i) => this.play(s.freq, s.index, i * 0.055, 0.62));
  }

  stop() {
    for (const s of this.sources) { try { s.stop(); } catch (e) { /* noop */ } }
    this.sources.clear();
    this.busyUntil = performance.now() + 150;
  }

  get busy() { return performance.now() < this.busyUntil; }
}
