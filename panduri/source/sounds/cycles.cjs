// Cycle tracking for a strummed rhythm recording.
// e(t): high-band spectral flux. Model: cycles start at c_j, stroke k of the cycle at c_j + frac_k * P_j.
// 1. rough period from the stroke count, refined by fold sharpness; 2. fold → K peaks = fractions;
// 3. DP tracking of cycle starts with that template; 4. re-fold on the tracked grid; 5. snap strokes.
const W = require('./wav.cjs'), S = require('./strokes.cjs');
function smooth(a, r) { const o = new Float64Array(a.length); for (let i = 0; i < a.length; i++) { let s = 0, w = 0; for (let j = -r * 2; j <= r * 2; j++) { const k = i + j; if (k < 0 || k >= a.length) continue; const g = Math.exp(-.5 * (j / r) ** 2); s += a[k] * g; w += g; } o[i] = s / w; } return o; }
function interp(a, x) { const i = Math.floor(x); if (i < 0 || i + 1 >= a.length) return 0; const f = x - i; return a[i] * (1 - f) + a[i + 1] * f; }
function track(file, K, rule, prior, anchorFirst, Phint, firstAt) {
  const { x, sr } = W.readWav(file);
  const { hi, dt } = S.hiFlux(x, sr); const lat = 1024 / 2 / sr - 128 / sr;
  const e0 = smooth(hi, 3); const mx = Math.max(...e0); const e = e0.map(v => v / mx);
  const st = S.strokes(x, sr).filter(s => s.rms > .05);
  const first = firstAt != null ? (st.find(q => Math.abs(q.t - firstAt) < .03) || st[0]).t : st[0].t, last = st[st.length - 1].t;
  // period candidates around (span / (n/K))
  const rough = (last - first) / Math.max(1, (st.length - 1) / K);
  const eW = smooth(e, 9); let best = null;
  for (let P = rough * .6; P <= rough * 1.6; P += .002) {
    // fold sharpness: autocorrelation of e at lag P relative to lags P*(1±.5/K)
    let s = 0; for (const m of [1, 2]) { const L = m * P / dt; let q = 0, n = 0; for (let i = 0; i + L + 1 < eW.length; i++) { q += eW[i] * interp(eW, i + L); n++; } s += (m === 1 ? 1 : .6) * (n ? q / n : 0); }
    if (!best || s > best.s) best = { P, s };
  }
  let P = best.P;
  if (anchorFirst && prior) { let bs = -1; for (let q = Phint ? Phint * .92 : rough * .6; q <= (Phint ? Phint * 1.08 : rough * 1.6); q += .002) { let sc = 0, n = 0; for (let ph = 0; ph < (anchorFirst === 'P' ? q : 1e-9); ph += .01) { let q2 = 0, n2 = 0; for (let c = first - (anchorFirst === 'P' ? q : 0) + ph; c + q * .8 < last + .05; c += q) { if (c + q < first) continue; prior.forEach(pk => { q2 += interp(eW, (c + pk * q - lat) / dt); n2++; }); } if (q2 / Math.max(1, n2) > sc / Math.max(1, n)) { sc = q2; n = n2; } } sc /= Math.max(1, n); sc *= Math.min(1, n / (prior.length * 2.5)); if (sc > bs) { bs = sc; P = q; } } }
  // fold into bins over [first, last]
  const fold = (starts, Ps) => { const B = 240, h = new Float64Array(B); starts.forEach((c, j) => { const p = Ps[j]; for (let b = 0; b < B; b++) { const t = c + b / B * p; h[b] += interp(e, (t - lat) / dt); } }); return h; };
  const peaksOf = h => { if (prior && fr0 != null) return priorPeaks(h); return freePeaks(h); };
  let fr0 = null;
  const priorPeaks = h => { const B = h.length; // fr0 = phase of stroke 1 within the fold, prior fractions relative to it
    return prior.map(pk => { const c = (fr0 + pk) % 1; let bb = 0, bv = -1; for (let d = -Math.round(B * .07); d <= Math.round(B * .07); d++) { const b = (Math.round(c * B) + d + B) % B; let s = 0; for (let j = -2; j <= 2; j++) s += h[(b + j + B) % B]; if (s > bv) { bv = s; bb = b; } } return { f: bb / B, v: bv }; }).sort((p, q) => p.f - q.f); };
  const freePeaks = h => { const B = h.length, hs = new Float64Array(B); for (let b = 0; b < B; b++) { let s = 0; for (let j = -3; j <= 3; j++) s += h[(b + j + B) % B]; hs[b] = s / 7; }
    const pk = []; for (let b = 0; b < B; b++) { const a = hs[(b - 1 + B) % B], c = hs[(b + 1) % B]; if (hs[b] > a && hs[b] >= c) pk.push({ b, v: hs[b] }); }
    pk.sort((p, q) => q.v - p.v); const sel = []; for (const p of pk) { if (sel.every(q => Math.min(Math.abs(q.b - p.b), B - Math.abs(q.b - p.b)) > B / (K * 2.6))) sel.push(p); if (sel.length === K) break; }
    return sel.sort((p, q) => p.b - q.b).map(p => ({ f: p.b / B, v: p.v })); };
  let starts = [], Ps = []; for (let c = first - .02; c + P < last + P * .9; c += P) { starts.push(c); Ps.push(P); }
  if (prior) { const h = fold(starts, Ps), B = h.length; let bp0 = 0, bs = -1; for (let p = 0; p < B; p++) { let q = 0; prior.forEach(pk => { const b = Math.round(p + pk * B); for (let j = -4; j <= 4; j++) q += h[((b + j) % B + B) % B]; }); if (q > bs) { bs = q; bp0 = p; } } fr0 = bp0 / B; }
  let fr = peaksOf(fold(starts, Ps));
  for (let it = 0; it < 4; it++) {
    // rotate so frac[0] = stroke 1 by the rule, and shift so it is 0
    const gaps = fr.map((p, i) => ((fr[(i + 1) % K].f - p.f + 1) % 1));
    let one;
    if (prior && fr0 != null) { const cd = fr.map(p => { const d = Math.abs(p.f - fr0); return Math.min(d, 1 - d); }); one = cd.indexOf(Math.min(...cd)); }
    else if (rule === 'longest-after') one = gaps.indexOf(Math.max(...gaps));
    else { const two = gaps.indexOf(Math.min(...gaps)); one = (two - 1 + K) % K; }   // stroke 2 starts the shortest gap
    const f0 = fr[one].f; fr0 = 0; const fracs = []; for (let k = 0; k < K; k++) fracs.push(((fr[(one + k) % K].f - f0) + 1) % 1);
    // DP over candidate cycle starts (every frame)
    const tmpl = t => { let s = 0; for (let k = 0; k < K; k++) s += interp(e, (t + fracs[k] * P - lat) / dt); return s / K; };
    const T0 = first - P * .3, T1 = last + .05; const step = dt; const N = Math.ceil((T1 - T0) / step);
    const sc = new Float64Array(N), C = new Float64Array(N), bp = new Int32Array(N).fill(-1);
    for (let i = 0; i < N; i++) sc[i] = tmpl(T0 + i * step);
    const a = 6;
    for (let i = 0; i < N; i++) { let bv = 0, bj = -1; const lo = Math.round(P * .8 / step), hiL = Math.round(P * 1.25 / step);
      const t = T0 + i * step; if (anchorFirst === true) bv = Math.abs(t - first) < .012 ? 0 : -1e9;
      for (let L = lo; L <= hiL; L++) { const j = i - L; if (j < 0) break; const v = C[j] - a * Math.log(L * step / P) ** 2; if (v > bv) { bv = v; bj = j; } }
      C[i] = sc[i] + bv; bp[i] = bj; }
    // end: the best start whose cycle still has its first stroke within the recording
    let end = 0; for (let i = 0; i < N; i++) if (T0 + i * step <= last + .01 && C[i] > C[end]) end = i;
    if (anchorFirst === true) for (let i = 0; i < N; i++) if (C[i] < -1e8) C[i] = -1e9;
    const path = []; for (let i = end; i >= 0; i = bp[i]) path.unshift(T0 + i * step);
    // drop starts whose template score is weak (silence before/after)
    starts = path.filter((c, j) => tmpl(c) > .12);
    Ps = starts.map((c, j) => j + 1 < starts.length ? starts[j + 1] - c : (j ? c - starts[j - 1] : P));
    P = Ps.slice(0, -1).reduce((s, v) => s + v, 0) / Math.max(1, Ps.length - 1) || P;
    fr = peaksOf(fold(starts, Ps));
    if (it === 3) {
      // snap each stroke to the local envelope maximum
      const cyc = starts.map((c, j) => fracs.map(fk => { const t = c + fk * Ps[j], w = Ps[j] / K * .3; let bt = t, bv = -1; for (let u = t - w; u <= t + w; u += dt) { const v = interp(e, (u - lat) / dt); if (v > bv) { bv = v; bt = u; } } return { t: +bt.toFixed(4), v: +bv.toFixed(3) }; }));
      return { file: file.split('/').pop(), K, P: +P.toFixed(4), fracs: fracs.map(v => +v.toFixed(3)), starts: starts.map(v => +v.toFixed(4)), cycles: cyc, dur: x.length / sr };
    }
  }
}
module.exports = { track };
if (require.main === module) { const r = track(process.argv[2], +process.argv[3], process.argv[4]);
  console.log(r.file, 'P', r.P, 'fracs', r.fracs.join(','), 'cycles', r.cycles.length);
  r.cycles.forEach((c, j) => console.log('  ', j, c.map(s => s.t.toFixed(3) + '/' + s.v.toFixed(2)).join('  '), ' P=' + (r.starts[j + 1] ? (r.starts[j + 1] - r.starts[j]).toFixed(3) : '-'))); }
