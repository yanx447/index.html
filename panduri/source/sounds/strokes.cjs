const W = require('./wav.cjs');
function hiFlux(x, sr) {
  const N = 1024, H = 128, fr = Math.floor((x.length - N) / H), hi = [], amp = [];
  const w = new Float64Array(N); for (let i = 0; i < N; i++) w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
  let pl = null;
  for (let f = 0; f < fr; f++) { const re = new Float64Array(N), im = new Float64Array(N); for (let i = 0; i < N; i++) re[i] = x[f * H + i] * w[i]; W.fft(re, im);
    const mag = []; for (let k = 0; k < N / 2; k++) mag.push(Math.log1p(200 * Math.hypot(re[k], im[k])));
    let h = 0; if (pl) for (let k = 1; k < N / 2; k++) { const hz = k * sr / N; if (hz > 1200 && hz < 8000) h += Math.max(0, mag[k] - pl[k]); }
    hi.push(h); pl = mag; }
  return { hi, dt: H / sr };
}
function strokes(x, sr, minGap) {
  const { hi, dt } = hiFlux(x, sr); const mx = Math.max(...hi), g = Math.round((minGap || .07) / dt), out = [];
  for (let i = 1; i < hi.length - 1; i++) {
    let loc = 0; for (let j = Math.max(0, i - 60); j < Math.min(hi.length, i + 60); j++) loc += hi[j]; loc /= 120;
    if (hi[i] > .12 * mx && hi[i] > 2.5 * loc && hi[i] >= hi[i - 1] && hi[i] >= hi[i + 1]) {
      if (out.length && i - out[out.length - 1].i < g) { if (hi[i] > out[out.length - 1].v) out[out.length - 1] = { i, v: hi[i] }; continue; }
      out.push({ i, v: hi[i] });
    }
  }
  // strength = peak amplitude in 40ms after onset
  return out.map(o => { const t = o.i * dt + 1024 / 2 / sr - 128 / sr; const s0 = Math.round(t * sr); let p = 0, e = 0; for (let j = s0; j < s0 + sr * .04 && j < x.length; j++) { p = Math.max(p, Math.abs(x[j])); e += x[j] * x[j]; } return { t, v: o.v / mx, pk: p, rms: Math.sqrt(e / (sr * .04)) }; });
}
module.exports = { strokes, hiFlux };
if (require.main === module) for (const f of process.argv.slice(2)) { const { x, sr } = W.readWav(f); const s = strokes(x, sr); console.log(f.split('/').pop(), s.length); console.log(s.map((p, i) => p.t.toFixed(3) + '(' + (s[i + 1] ? (s[i + 1].t - p.t).toFixed(3) : '-') + ' r' + p.rms.toFixed(2) + ')').join(' ')); }
