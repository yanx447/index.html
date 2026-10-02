// Fallback panduri pluck, modelled on recordings of a real panduri (A3 · C♯4 · E4, phone microphone).
// Additive synthesis: every harmonic has its own level and a two-stage decay
// (fast drop right after the pluck, then a quieter, longer ring), as measured from the recordings:
//   level G (dB re. H1), share of the fast stage a, fast time-constant τ1 (s), slow τ2 (s).
// On top: the short pitch glide of a freshly plucked string and a soft fingertip/pick click.
// Partials are kept exactly harmonic so the reference is a clean, unambiguous target pitch.
// Rendered once per note and cached; no audio files needed.

import { audioContext, resumeContext } from './audio-input.js';

//            H1                    H2                    H3                    H4                    H5                   H6                   H7                   H8
const VOICES = [
  { glide: 0.006, click: 0.10, h: [[0, .99, .066, 1.25], [-25.8, .88, .17, .75], [-22.5, .98, .26, 1.56], [-29.7, .94, .13, .74], [-18, 1, .098, 1], [-24.6, 1, .098, 1], [-29.8, 1, .13, 1], [-28, 1, .137, 1]] }, // A
  { glide: 0.0025, click: 0.08, h: [[0, .99, .173, 2.5], [-16.5, .44, .15, .5], [-18.7, .82, .34, .75], [-28.8, .99, .25, 2], [-21.5, 1, .23, 1], [-28.4, .99, .18, 2], [-36.3, .99, .28, 2], [-24.8, 1, .12, 1]] },     // C♯
  { glide: 0.0025, click: 0.08, h: [[0, .97, .082, .73], [-13.5, .79, .078, .63], [-22, 1, .21, 1], [-21.3, 1, .14, 1], [-27.9, 1, .16, 1], [-25.2, 1, .22, 1], [-26.2, 1, .16, 1], [-18.6, 1, .10, 3]] },        // E
];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pure renderer — returns a Float32Array (tested in Node for pitch accuracy). */
export function renderPluck(freq, sr, { stringIndex = 0, duration = 2.8, seed = 7 } = {}) {
  const v = VOICES[Math.min(Math.max(0, stringIndex), VOICES.length - 1)];
  const n = Math.floor(sr * duration);
  const out = new Float32Array(n);
  const nyq = sr * 0.45;

  // partial table: measured H1..H8, then a gently falling, fast-decaying extension
  const parts = v.h.slice();
  for (let k = parts.length + 1; k <= 16; k++) parts.push([parts[7][0] - 3.5 * (k - 8), 1, Math.max(0.035, 0.11 - 0.006 * (k - 8)), 1]);

  const phase = new Float64Array(parts.length);
  const rnd = mulberry32(seed + stringIndex * 101);
  for (let k = 0; k < parts.length; k++) phase[k] = rnd() * 0.3; // near-coherent start, like a real pluck
  const amp = parts.map((p) => Math.pow(10, p[0] / 20));
  const d1 = parts.map((p) => Math.exp(-1 / (p[2] * sr))), d2 = parts.map((p) => Math.exp(-1 / (p[3] * sr)));
  const e1 = parts.map((p, k) => amp[k] * p[1]), e2 = parts.map((p, k) => amp[k] * (1 - p[1]));
  const glideDecay = Math.exp(-1 / (0.05 * sr));
  let glide = v.glide;
  const TWO_PI = 2 * Math.PI;

  for (let i = 0; i < n; i++) {
    const f = freq * (1 + glide);
    glide *= glideDecay;
    let s = 0;
    for (let k = 0; k < parts.length; k++) {
      const hf = f * (k + 1);
      if (hf > nyq) break;
      phase[k] += hf / sr;
      if (phase[k] > 1) phase[k] -= 1;
      s += (e1[k] + e2[k]) * Math.sin(TWO_PI * phase[k]);
      e1[k] *= d1[k]; e2[k] *= d2[k];
    }
    out[i] = s;
  }

  // fingertip/pick click: ~6 ms of band-limited noise at the onset
  const clickN = Math.floor(sr * 0.006);
  let lp = 0, prev = 0;
  for (let i = 0; i < clickN; i++) {
    lp += (rnd() * 2 - 1 - lp) * 0.35;
    const hp = lp - prev; prev = lp;
    out[i] += hp * v.click * 4 * (1 - i / clickN) * (1 - i / clickN);
  }

  // envelope: 1.5 ms attack, 120 ms release at the end, normalise
  const att = Math.floor(sr * 0.0015), rel = Math.floor(sr * 0.12);
  let peak = 0;
  for (let i = 0; i < n; i++) {
    if (i < att) out[i] *= i / att;
    if (i > n - rel) out[i] *= (n - i) / rel;
    const a = Math.abs(out[i]); if (a > peak) peak = a;
  }
  const norm = peak > 0 ? 0.9 / peak : 1;
  for (let i = 0; i < n; i++) out[i] *= norm;
  return out;
}

// Real panduri plucks (A3 · C♯4 · E4 recorded on the author's instrument), pitch-corrected so
// the fundamental sits exactly on A4 = 440 Hz equal temperament, lightly de-noised.
// Other pitches (A4 calibration, transposition, fretted notes) are played by resampling the
// nearest recording. If the files cannot be loaded or decoded, the additive model above is used.
const SAMPLES = [
  { file: 'panduri-a3.mp3', midi: 57 },
  { file: 'panduri-cs4.mp3', midi: 61 },
  { file: 'panduri-e4.mp3', midi: 64 },
];
const midiFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class ReferenceEngine {
  constructor() {
    this.cache = new Map();
    this.volume = 0.75;
    this.busyUntil = 0;
    this.sources = new Set();
    this.duration = 2.8;
    this.samples = null;   // [{ buffer, freq }] once decoded
    this.loading = null;
  }

  /** Decode the recorded plucks (idempotent). Safe before any user gesture. */
  load() {
    if (this.loading) return this.loading;
    const OAC = globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
    if (!OAC || typeof fetch !== 'function') return (this.loading = Promise.resolve(null));
    const dec = new OAC(1, 1, 48000);
    this.loading = Promise.all(SAMPLES.map(async (s) => {
      const res = await fetch(new URL(`../audio/${s.file}`, import.meta.url));
      if (!res.ok) throw new Error(res.status);
      const data = await res.arrayBuffer();
      const buffer = await new Promise((ok, bad) => { const p = dec.decodeAudioData(data, ok, bad); if (p && p.catch) p.catch(bad); });
      return { buffer, freq: midiFreq(s.midi) };
    })).then((list) => (this.samples = list)).catch(() => null);
    return this.loading;
  }

  /** The recorded pluck to use for a pitch: { buffer, rate } — or null (use the model). */
  voice(freq, stringIndex = 0) {
    const sm = this.samples;
    if (!sm) return null;
    const d = sm.map((s) => 12 * Math.log2(freq / s.freq));
    const own = sm[stringIndex] ? stringIndex : -1;
    // keep the string's own recording when the shift is moderate (it keeps that string's colour)
    let i = own >= 0 && d[own] >= -3 && d[own] <= 8 ? own : 0;
    if (i !== own) for (let k = 1; k < sm.length; k++) if (Math.abs(d[k]) < Math.abs(d[i])) i = k;
    return { buffer: sm[i].buffer, rate: freq / sm[i].freq };
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
    if (!this.samples) this.load();
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    const v = this.voice(freq, stringIndex);
    let dur;
    if (v) { src.buffer = v.buffer; src.playbackRate.value = v.rate; dur = v.buffer.duration / v.rate; }
    else { src.buffer = this.buffer(freq, stringIndex); dur = this.duration; }
    g.gain.value = this.volume * gain;
    src.connect(g).connect(ctx.destination);
    src.start(ctx.currentTime + when);
    this.sources.add(src);
    src.onended = () => { this.sources.delete(src); try { g.disconnect(); } catch (e) { /* noop */ } };
    // the tuner ignores the microphone while the reference sounds (+ room tail)
    this.busyUntil = Math.max(this.busyUntil, performance.now() + (when + dur) * 1000 + 200);
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
