// minimal WAV reader (PCM 16/24/32, float32) → mono Float32Array
const fs = require('fs');
function readWav(path) {
  const b = fs.readFileSync(path);
  let p = 12, fmt = null, data = null;
  while (p + 8 <= b.length) {
    const id = b.toString('ascii', p, p + 4), sz = b.readUInt32LE(p + 4);
    if (id === 'fmt ') fmt = { tag: b.readUInt16LE(p + 8), ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22) };
    if (id === 'data') { data = b.subarray(p + 8, p + 8 + sz); }
    p += 8 + sz + (sz & 1);
  }
  const bps = fmt.bits / 8, n = Math.floor(data.length / bps / fmt.ch), x = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let c = 0; c < fmt.ch; c++) {
      const o = (i * fmt.ch + c) * bps;
      let v;
      if (fmt.tag === 3) v = data.readFloatLE(o);
      else if (bps === 2) v = data.readInt16LE(o) / 32768;
      else if (bps === 3) v = data.readIntLE(o, 3) / 8388608;
      else v = data.readInt32LE(o) / 2147483648;
      s += v;
    }
    x[i] = s / fmt.ch;
  }
  return { x, sr: fmt.sr };
}
function writeWav(path, x, sr) {
  const n = x.length, b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(x[i] * 32767))), 44 + i * 2);
  fs.writeFileSync(path, b);
}
// spectral-flux onset envelope, hop 256
function onsets(x, sr, opt) {
  opt = opt || {};
  const N = 1024, H = 256, frames = Math.floor((x.length - N) / H), env = new Float32Array(frames), rms = new Float32Array(frames);
  const re = new Float64Array(N), im = new Float64Array(N);
  let prev = new Float64Array(N / 2);
  const w = new Float64Array(N); for (let i = 0; i < N; i++) w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
  for (let f = 0; f < frames; f++) {
    let e = 0;
    for (let i = 0; i < N; i++) { const v = x[f * H + i]; re[i] = v * w[i]; im[i] = 0; e += v * v; }
    rms[f] = Math.sqrt(e / N);
    fft(re, im);
    let flux = 0; const cur = new Float64Array(N / 2);
    for (let k = 1; k < N / 2; k++) { cur[k] = Math.log1p(100 * Math.hypot(re[k], im[k])); const d = cur[k] - prev[k]; if (d > 0) flux += d; }
    env[f] = flux; prev = cur;
  }
  // adaptive threshold peak picking
  const out = [], minGap = Math.round((opt.minGap || .12) * sr / H);
  const med = (a, i, r) => { const s = []; for (let j = Math.max(0, i - r); j < Math.min(a.length, i + r + 1); j++) s.push(a[j]); s.sort((p, q) => p - q); return s[s.length >> 1]; };
  let mx = 0; for (const v of env) mx = Math.max(mx, v);
  for (let f = 1; f < frames - 1; f++) {
    const th = med(env, f, 20) * (opt.k || 1.5) + mx * (opt.floor || .08);
    if (env[f] > th && env[f] >= env[f - 1] && env[f] >= env[f + 1]) {
      if (out.length && f - out[out.length - 1].f < minGap) { if (env[f] > out[out.length - 1].v) out[out.length - 1] = { f, v: env[f] }; continue; }
      out.push({ f, v: env[f] });
    }
  }
  return { list: out.map(o => ({ t: o.f * H / sr + N / 2 / sr * .5, v: o.v })), env, rms, H };
}
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let j = 0; j < len / 2; j++) { const ur = re[i + j], ui = im[i + j], vr = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci, vi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr; re[i + j] = ur + vr; im[i + j] = ui + vi; re[i + j + len / 2] = ur - vr; im[i + j + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } }
  }
}
// YIN pitch of a segment
function yin(x, sr, fmin, fmax) {
  fmin = fmin || 80; fmax = fmax || 1200;
  const W = Math.min(x.length >> 1, 4096), tmax = Math.floor(sr / fmin), tmin = Math.floor(sr / fmax);
  const d = new Float64Array(tmax + 1);
  for (let t = 1; t <= tmax; t++) { let s = 0; for (let i = 0; i < W; i++) { const v = x[i] - x[i + t]; s += v * v; } d[t] = s; }
  let run = 0; const c = new Float64Array(tmax + 1); c[0] = 1;
  for (let t = 1; t <= tmax; t++) { run += d[t]; c[t] = d[t] * t / (run || 1); }
  let T = -1; for (let t = tmin; t < tmax; t++) if (c[t] < .15 && c[t] < c[t + 1]) { T = t; break; }
  if (T < 0) { let m = 1e9; for (let t = tmin; t < tmax; t++) if (c[t] < m) { m = c[t]; T = t; } }
  const a = c[T - 1], b = c[T], cc = c[T + 1], den = a - 2 * b + cc, sh = den ? .5 * (a - cc) / den : 0;
  return sr / (T + sh);
}
const midiOf = f => 69 + 12 * Math.log2(f / 440);
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nameOf = m => NAMES[((Math.round(m) % 12) + 12) % 12] + (Math.floor(Math.round(m) / 12) - 1);
module.exports = { readWav, writeWav, onsets, yin, midiOf, nameOf, fft };
