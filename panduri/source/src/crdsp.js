/* =====================================================================
   PD.crdsp — the measuring PANDURI Creator adds to Studio 3.0.
   No DOM, no audio output, no network: numbers in, numbers out, so every
   function here runs the same in the browser and in a test (qa/creator-dsp.cjs).

   · tempo()      a tempo that may move. Studio's beat tracker (ai.js beatsOf)
                  holds one tempo ±8 % for the whole song; Georgian folk music
                  speeds up and slows down. Here: an onset envelope → a
                  tempogram (autocorrelation in 6 s windows, 1 s apart) → the
                  most likely tempo PATH through it (Viterbi, a change costs in
                  log-tempo) → beats by dynamic programming whose expected beat
                  length is the local tempo (Ellis 2007 with a moving period).
                  Each window carries its confidence; weak ones go to review.
   · tempoPoints() the beat map as a few tempo points (steps and ramps).
   · strokes()    strum onsets, placed on the beat's subdivision. Whether a
                  stroke went down or up cannot be heard reliably: the
                  direction is the pendulum's, and marked as suggested.
   · tabulate()   notes → string · fret · finger · articulation on the real
                  tuning (open pitches from PD.theory), choosing the path a
                  hand can play: shift distance against the time available,
                  open strings, string changes. A note out of range is NOT
                  moved: it is reported, and the owner picks what to do.
   · phrases(), repeats(), ornaments(), alignLyrics(), midi(), aiff(), wav(), peaks()
   ===================================================================== */
PD.crdsp = (() => {
  /* ---------------- FFT + onset envelope ---------------- */
  function fftMag(N) {
    const rev = new Uint32Array(N), cs = new Float32Array(N / 2), sn = new Float32Array(N / 2), win = new Float32Array(N), re = new Float32Array(N), im = new Float32Array(N);
    for (let i = 0, b = Math.log2(N); i < N; i++) { let r = 0; for (let k = 0; k < b; k++) r |= ((i >> k) & 1) << (b - 1 - k); rev[i] = r; }
    for (let i = 0; i < N / 2; i++) { cs[i] = Math.cos(-2 * Math.PI * i / N); sn[i] = Math.sin(-2 * Math.PI * i / N); }
    for (let i = 0; i < N; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    return (x, off, out) => {
      for (let i = 0; i < N; i++) { const j = off + i; re[rev[i]] = j < x.length ? x[j] * win[i] : 0; im[rev[i]] = 0; }
      for (let s = 2; s <= N; s <<= 1) { const h = s >> 1, st = N / s; for (let i = 0; i < N; i += s) for (let k = 0; k < h; k++) { const c = cs[k * st], d = sn[k * st], a = i + k, b = a + h, tr = re[b] * c - im[b] * d, ti = re[b] * d + im[b] * c; re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti; } }
      for (let k = 0; k < N / 2; k++) out[k] = Math.hypot(re[k], im[k]);
    };
  }
  /** log-spectral flux, trend removed, unit variance. hop 256 at 22.05 kHz = 11.6 ms */
  function envelope(mono, sr, o) {
    o = o || {}; const N = o.N || 1024, HOP = o.hop || 256, F = Math.max(2, Math.floor((mono.length - N) / HOP) + 1), f = fftMag(N), mag = new Float32Array(N / 2), prev = new Float32Array(N / 2), env = new Float32Array(F);
    const kLo = Math.max(1, Math.floor((o.fLo || 30) * N / sr)), kHi = Math.min(N / 2, Math.ceil((o.fHi || 8000) * N / sr));
    for (let i = 0; i < F; i++) { f(mono, i * HOP, mag); let fl = 0; for (let k = kLo; k < kHi; k++) { const v = Math.log1p(mag[k] * 20), d = v - prev[k]; if (d > 0) fl += d; prev[k] = v; } env[i] = i ? fl : 0; }
    const dt = HOP / sr, W = Math.max(3, Math.round(.4 / dt)), on = new Float32Array(F); let acc = 0;
    for (let i = 0; i < F; i++) { acc += env[i]; if (i >= W) acc -= env[i - W]; on[i] = Math.max(0, env[i] - acc / Math.min(i + 1, W)); }
    let sd = 0; for (let i = 0; i < F; i++) sd += on[i] * on[i]; sd = Math.sqrt(sd / F) || 1; for (let i = 0; i < F; i++) on[i] /= sd;
    return { on, raw: env, dt, t0: N / 2 / sr, F };
  }

  /* ---------------- dynamic tempo ---------------- */
  const BMIN = 40, BMAX = 240;
  function tempogram(E, o) {
    o = o || {}; const { on, dt } = E, W = Math.round((o.win || 6) / dt), H = Math.round((o.hop || 1) / dt), rows = [], centers = [];
    const bpms = []; for (let b = BMIN; b <= BMAX; b += 1) bpms.push(b);
    const prior = bpms.map(b => Math.exp(-.5 * Math.pow(Math.log2(b / (o.centre || 110)) / (o.spread || .9), 2)));
    for (let s = 0; s + W / 2 <= on.length || !rows.length; s += H) {
      const a = Math.max(0, s - (W >> 1)), b = Math.min(on.length, a + W);
      let e0 = 0; for (let i = a; i < b; i++) e0 += on[i] * on[i]; e0 = e0 || 1;
      const ac = L => { const i0 = Math.floor(L), fr = L - i0; let v = 0; for (let i = a + i0 + 1; i < b; i++) v += on[i] * (on[i - i0] * (1 - fr) + on[i - i0 - 1] * fr); return v / e0; };
      const row = bpms.map((bp, k) => { const L = 60 / bp / dt; return (ac(L) + .5 * ac(2 * L) + .25 * (L / 2 > 2 ? ac(L / 2) : 0)) * prior[k]; });
      rows.push(row); centers.push((s) * dt); if (s + H >= on.length) break;
    }
    return { rows, centers, bpms };
  }
  /** the tempo path: one bpm per window, changes allowed where the evidence is strong */
  function tempoPath(TG, o) {
    o = o || {}; const { rows, bpms } = TG, n = rows.length, K = bpms.length, lam = o.lambda != null ? o.lambda : 1.3;
    const lg = bpms.map(b => Math.log2(b)), score = new Float64Array(K), back = [], conf = [];
    const norm = r => { const mx = Math.max(...r) || 1; return r.map(v => Math.max(0, v) / mx); };
    let cur = norm(rows[0]).map(v => Math.log(v + 1e-3)); score.set(cur);
    for (let i = 1; i < n; i++) {
      const r = norm(rows[i]).map(v => Math.log(v + 1e-3)), bk = new Int16Array(K), nx = new Float64Array(K);
      for (let k = 0; k < K; k++) { let best = -1e18, bj = k; const lo = Math.max(0, k - 60), hi = Math.min(K - 1, k + 60);
        for (let j = lo; j <= hi; j++) { const v = score[j] - lam * Math.abs(lg[k] - lg[j]) * 12; if (v > best) { best = v; bj = j; } }
        // an octave jump (the tracker's level) is possible but costly
        for (const j of [Math.round(bpms[k] * 2 - BMIN), Math.round(bpms[k] / 2 - BMIN)]) if (j >= 0 && j < K) { const v = score[j] - 9; if (v > best) { best = v; bj = j; } }
        nx[k] = best + r[k]; bk[k] = bj; }
      score.set(nx); back.push(bk);
    }
    let k = 0; for (let j = 1; j < K; j++) if (score[j] > score[k]) k = j;
    const path = new Array(n); path[n - 1] = k; for (let i = n - 1; i > 0; i--) { k = back[i - 1][k]; path[i - 1] = k; }
    for (let i = 0; i < n; i++) { const r = rows[i], mx = Math.max(...r) || 1, mean = r.reduce((a, b) => a + Math.max(0, b), 0) / r.length || 1, v = Math.max(0, r[path[i]]); conf.push(Math.max(0, Math.min(1, (v / mx) * Math.min(1, (mx / mean - 1) / 2.5)))); }
    return { bpm: path.map(k2 => bpms[k2]), conf };
  }
  function beatsDP(E, periodAt, o) {
    o = o || {}; const { on, dt, t0 } = E, F = on.length, alpha = o.alpha || 120, score = new Float32Array(F), from = new Int32Array(F).fill(-1);
    for (let i = 0; i < F; i++) {
      const P = periodAt(i); let bs = -1e9, bj = -1; const lo = Math.max(0, Math.round(i - 2 * P)), hi = Math.round(i - P / 2);
      for (let j = lo; j <= hi; j++) { const r = Math.log((i - j) / P), v = score[j] - alpha * r * r; if (v > bs) { bs = v; bj = j; } }
      score[i] = on[i] + (bj >= 0 ? Math.max(0, bs) : 0); from[i] = bs > 0 ? bj : -1;
    }
    let e = F - 1, mx = -1; const Pl = periodAt(F - 1); for (let i = Math.max(0, F - Math.round(Pl)); i < F; i++) if (score[i] > mx) { mx = score[i]; e = i; }
    const idx = []; for (let i = e; i >= 0; i = from[i]) { idx.push(i); if (from[i] < 0) break; }
    idx.reverse(); return idx.map(i => +(i * dt + t0).toFixed(4));
  }
  /** mono (22.05 kHz is plenty) → { beats, bpm (median), curve [{t,bpm,conf}], review [{from,to,what,note}] } */
  function tempo(mono, sr, o) {
    o = o || {}; const E = o.env || envelope(mono, sr), TG = tempogram(E, o), P = tempoPath(TG, o), n = TG.centers.length;
    // the level: if the whole path sits above 165 BPM, the tracker took the subdivision — halve it
    const med = arr => { const s = arr.slice().sort((a, b) => a - b); return s[s.length >> 1] || 0; };
    let bpm = P.bpm.slice(); if (med(bpm) > (o.maxBeat || 165)) bpm = bpm.map(b => b / 2); if (med(bpm) < (o.minBeat || 55)) bpm = bpm.map(b => b * 2);
    const at = i => { const tt = i * E.dt; let k = Math.floor(tt / ((TG.centers[1] - TG.centers[0]) || 1)); k = Math.max(0, Math.min(n - 1, k)); const k2 = Math.min(n - 1, k + 1), c0 = TG.centers[k], c1 = TG.centers[k2] || c0 + 1, f = Math.max(0, Math.min(1, (tt - c0) / (c1 - c0 || 1))); return 60 / (bpm[k] * (1 - f) + bpm[k2] * f) / E.dt; };
    const beats = beatsDP(E, at, o);
    const curve = TG.centers.map((t, i) => ({ t: +t.toFixed(2), bpm: +bpm[i].toFixed(1), conf: +P.conf[i].toFixed(2) }));
    const review = []; curve.forEach((c, i) => { if (c.conf < (o.minConf || .25)) { const r = review[review.length - 1]; if (r && r.to >= c.t - 1.01) r.to = c.t + 1; else review.push({ from: Math.max(0, c.t - .5), to: c.t + 1, what: 'tempo', note: 'weak pulse' }); } });
    return { beats, bpm: +med(beats.slice(1).map((b, i) => 60 / (b - beats[i]))).toFixed(1), curve, review, env: E };
  }
  /** F-measure of two beat lists (±tol s) — used to compare methods and to test against a known answer */
  function beatF(est, ref, tol) {
    tol = tol || .07; let hit = 0, j = 0; const used = new Uint8Array(ref.length);
    est.forEach(b => { while (j < ref.length && ref[j] < b - tol) j++; for (let k = j; k < ref.length && ref[k] <= b + tol; k++) if (!used[k]) { used[k] = 1; hit++; break; } });
    const p = est.length ? hit / est.length : 0, r = ref.length ? hit / ref.length : 0; return p + r ? 2 * p * r / (p + r) : 0;
  }
  /** beats → a few tempo points: a piecewise-linear BPM curve within `tol` BPM (a step = two points close together) */
  function tempoPoints(beats, tol) {
    tol = tol || 4; if (!beats || beats.length < 3) return [];
    const pts = []; for (let i = 0; i + 1 < beats.length; i++) pts.push([beats[i], 60 / (beats[i + 1] - beats[i])]);
    // smooth over 9 beats (one late stroke is not a tempo change), then a mean over 5 of those medians
    const md = pts.map((p, i) => { const w = pts.slice(Math.max(0, i - 4), i + 5).map(x => x[1]).sort((a, b) => a - b); return w[w.length >> 1]; });
    const sm = pts.map((p, i) => { const w = md.slice(Math.max(0, i - 2), i + 3); return [p[0], w.reduce((a, b) => a + b, 0) / w.length]; });
    const keep = new Set([0, sm.length - 1]);
    (function dp(a, b) { if (b - a < 2) return; let mx = 0, at = -1; const [t0, v0] = sm[a], [t1, v1] = sm[b];
      for (let i = a + 1; i < b; i++) { const v = v0 + (v1 - v0) * (sm[i][0] - t0) / (t1 - t0 || 1), d = Math.abs(sm[i][1] - v); if (d > mx) { mx = d; at = i; } }
      if (mx > tol) { keep.add(at); dp(a, at); dp(at, b); } })(0, sm.length - 1);
    const ix = [...keep].sort((a, b) => a - b);
    return ix.map((i, k) => { const nx = ix[k + 1]; return { t: +sm[i][0].toFixed(3), bpm: +sm[i][1].toFixed(1), ramp: nx != null && Math.abs(sm[nx][1] - sm[i][1]) > 1.5 && sm[nx][0] - sm[i][0] > 2 }; });
  }
  /** the tempo at time t from tempo points (steps hold, ramps glide) */
  function bpmAt(pts, t) {
    if (!pts || !pts.length) return null; let k = 0; while (k + 1 < pts.length && pts[k + 1].t <= t) k++;
    const p = pts[k], q = pts[k + 1]; if (!p.ramp || !q || t < p.t) return p.bpm; return p.bpm + (q.bpm - p.bpm) * (t - p.t) / (q.t - p.t);
  }
  /** beats from an anchor at t0 to t1 following the tempo points (the grid follows the owner's map; the audio is never touched) */
  function beatsFrom(pts, t0, t1) {
    const out = [t0]; let x = t0; for (let n = 0; n < 20000; n++) { const b1 = bpmAt(pts, x) || 120, mid = x + 30 / b1, b2 = bpmAt(pts, mid) || b1; x += 60 / b2; if (x > t1 + 1e-6) break; out.push(+x.toFixed(4)); }
    return out;
  }

  /* ---------------- strokes ---------------- */
  /** onset peaks of a strummed part → strokes on the subdivision grid. A strum is often two onsets 75–90 ms apart (the
      three strings) — the minimum distance keeps them as one stroke. */
  function strokes(E, beats, o) {
    o = o || {}; const { on, dt, t0 } = E, sub = o.sub || 2, out = [], W = Math.max(1, Math.round(.04 / dt));
    if (!beats || beats.length < 3) return out;
    const ibi = beats.slice(1).map((b, i) => b - beats[i]).sort((a, b) => a - b)[beats.length >> 1] || .5, minGap = Math.min(.1, ibi / sub * .45);
    const thr = new Float32Array(on.length), M = Math.round(1.5 / dt);
    for (let i = 0; i < on.length; i++) { let s = 0, n = 0; for (let j = Math.max(0, i - M); j < Math.min(on.length, i + M); j += 4) { s += on[j]; n++; } thr[i] = (s / n) * (o.k || 1.25) + .15; }
    let last = -1e9;
    for (let i = 1; i + 1 < on.length; i++) {
      if (on[i] < thr[i]) continue; let peak = true; for (let j = Math.max(0, i - W); j <= Math.min(on.length - 1, i + W); j++) if (on[j] > on[i]) { peak = false; break; }
      if (!peak) continue; const t = i * dt + t0; if (t - last < minGap) continue; last = t; out.push({ t, v: on[i] });
    }
    // place on the grid of each beat; direction = the pendulum's (down on the even places), suggested
    const vs = out.map(s => s.v).sort((a, b) => a - b), med = vs[vs.length >> 1] || 1;
    let k = 0; return out.map(s => {
      while (k + 1 < beats.length && beats[k + 1] <= s.t) k++;
      const L = (beats[k + 1] || beats[k] + ibi) - beats[k], pos = (s.t - beats[k]) / L, slot = Math.round(pos * sub), g = k * sub + slot, off = Math.abs(pos * sub - slot) / sub;
      return { t: +s.t.toFixed(3), k: g % 2 ? 'u' : 'd', a: s.v > med * (o.acc || 1.7) ? 1 : 0, sug: 1, conf: +Math.max(0, 1 - off * 4).toFixed(2) };
    });
  }

  /* ---------------- tablature ---------------- */
  const LO = 57;
  /** notes [{t,d,m}] → [{s,f,fi,art}] (null = out of range, reported in .out); open: the strings' open MIDI pitches */
  function tabulate(notes, o) {
    o = o || {}; const open = o.open || [57, 61, 64], F = o.frets || 17, pref = o.prefer || 'auto';
    const C = notes.map(n => { const out = []; open.forEach((p, s) => { const f = Math.round(n.m) - p; if (f >= 0 && f <= F) out.push({ s: s + 1, f }); }); return out; });
    const cost = c => c.f * (pref === 'low' ? .12 : .035) - (c.f === 0 ? (pref === 'open' ? .9 : .3) : 0) + (pref === 'one' && c.s !== 3 ? .4 : 0);
    const hand = (c, p) => c.f === 0 ? p : c.f;
    // Viterbi over the candidates; notes with none are skipped (they keep the hand where it was)
    let prev = null; const back = [];
    notes.forEach((n, i) => {
      const cs = C[i]; if (!cs.length) { back.push(null); return; }
      if (!prev) { prev = { i, sc: cs.map(cost), pos: cs.map(c => hand(c, c.f || 1)) }; back.push(cs.map(() => -1)); return; }
      const pn = notes[prev.i], gap = Math.max(.02, n.t - (pn.t + pn.d * .5)), pc = C[prev.i], bk = [], sc = [], pos = [];
      cs.forEach(c => { let best = 1e9, bj = 0, bp = 1;
        pc.forEach((q, j) => { const p = prev.pos[j], np = hand(c, p), shift = Math.abs(np - p), span = c.f && q.f ? Math.abs(c.f - q.f) : 0;
          const v = prev.sc[j] + cost(c) + shift * (.12 + .5 / (gap + .15)) + (span > 4 ? (span - 4) * .8 : 0) + (c.s !== q.s ? .12 : 0) + (c.s === q.s && c.f === q.f ? -.05 : 0);
          if (v < best) { best = v; bj = j; bp = np; } });
        sc.push(best); bk.push(bj); pos.push(bp); });
      back.push(bk); prev = { i, sc, pos };
    });
    const pick = new Array(notes.length).fill(null);
    if (prev) { let j = prev.sc.indexOf(Math.min(...prev.sc)); for (let i = notes.length - 1; i >= 0; i--) { if (!back[i]) continue; pick[i] = C[i][j]; j = back[i][j]; } }
    // fingers: a four-fret hand; 1 = index … 4 = little finger, 0 = open
    let p = 0; const res = pick.map((c, i) => {
      if (!c) return null; if (!c.f) return { s: c.s, f: 0, fi: 0 };
      if (!p || c.f < p) p = c.f; else if (c.f > p + 3) p = c.f - 3;
      return { s: c.s, f: c.f, fi: c.f - p + 1 };
    });
    // articulation: legato on one string → hammer-on / pull-off / slide; fast repeats → tremolo; a very short note leaning on the next → grace
    res.forEach((r, i) => { if (!r) return; const n = notes[i], q = res[i - 1], pn = notes[i - 1]; r.art = 'p';
      if (q && pn && q.s === r.s && n.t - (pn.t + pn.d) < .04) { const iv = n.m - pn.m; r.art = iv === 0 ? 'p' : Math.abs(iv) <= 2 ? (iv > 0 ? 'h' : 'po') : 'sl'; }
      if (pn && pn.m === n.m && n.t - pn.t < .09) r.art = 'tr';
      const nx = notes[i + 1]; if (n.d < .07 && nx && nx.t - (n.t + n.d) < .03 && Math.abs(nx.m - n.m) <= 2 && nx.d > n.d * 2) r.art = 'gr'; });
    const out = []; notes.forEach((n, i) => { if (!C[i].length) out.push(i); });
    return { tab: res, out, lo: open[0], hi: open[open.length - 1] + F };
  }
  /** choices for notes out of range — nothing is changed until the owner picks one */
  function fitRange(notes, how, o) {
    o = o || {}; const lo = o.lo || LO, hi = o.hi || 81, inR = m => m >= lo && m <= hi;
    if (how === 'octave') return { notes: notes.map(n => { let m = n.m; while (m < lo) m += 12; while (m > hi) m -= 12; return Object.assign({}, n, { m }); }), shift: 0 };
    let best = 0, bn = -1; for (let k = -36; k <= 36; k++) { const c = notes.filter(n => inR(n.m + k)).length, sc = c * 100 - Math.abs(k) - (k % 12 ? 30 : 0); if (sc > bn) { bn = sc; best = k; } }
    const moved = notes.map(n => Object.assign({}, n, { m: n.m + best }));
    if (how === 'transpose') return { notes: moved, shift: best };
    if (how === 'arrange') return { notes: fitRange(moved, 'octave', o).notes, shift: best };   // the best whole shift, then the few left over by an octave
    return { notes, shift: 0 };
  }

  /* ---------------- phrases, repeats, ornaments ---------------- */
  function phrases(notes, o) {
    o = o || {}; if (!notes.length) return [];
    const iois = notes.slice(1).map((n, i) => n.t - notes[i].t).sort((a, b) => a - b), med = iois[iois.length >> 1] || .3, gap = Math.max(o.gap || .35, med * 2.2);
    let cur = [notes[0]]; const out = [];
    for (let i = 1; i < notes.length; i++) { const p = notes[i - 1], n = notes[i]; if (n.t - (p.t + p.d) > gap) { out.push(cur); cur = []; } cur.push(n); }
    out.push(cur);
    let P = out.map(ns => ({ from: ns[0].t, to: ns[ns.length - 1].t + ns[ns.length - 1].d, n: ns.length, ns }));
    for (let i = 0; i < P.length; i++) if (P[i].to - P[i].from < (o.min || 1.5) && P.length > 1) { const j = i === 0 ? 1 : i - 1; const a = P[Math.min(i, j)], b = P[Math.max(i, j)]; a.to = b.to; a.ns = a.ns.concat(b.ns); a.n = a.ns.length; P.splice(Math.max(i, j), 1); i--; }
    const split = []; P.forEach(p => { if (p.to - p.from <= (o.max || 10) || p.ns.length < 4) { split.push(p); return; }
      let bi = 1, bg = -1; for (let k = 1; k < p.ns.length; k++) { const g = p.ns[k].t - (p.ns[k - 1].t + p.ns[k - 1].d), mid = Math.abs(p.ns[k].t - (p.from + p.to) / 2) / (p.to - p.from); const v = g - mid * .2; if (v > bg) { bg = v; bi = k; } }
      split.push(...phrases(p.ns.slice(0, bi), o), ...phrases(p.ns.slice(bi), o)); });
    return split.map(p => ({ from: +p.from.toFixed(3), to: +p.to.toFixed(3), n: p.n || p.ns.length, ns: p.ns }));
  }
  /** phrases with the same melody (transposition-invariant intervals) share a letter */
  function repeats(P) {
    const sig = p => p.ns.slice(1).map((n, i) => Math.round(n.m - p.ns[i].m));
    const letters = []; let next = 0;
    P.forEach((p, i) => { const s = sig(p); let L = null;
      for (let j = 0; j < i && L == null; j++) { const q = sig(P[j]); if (Math.abs(q.length - s.length) > 2 || !s.length) continue; let same = 0; for (let k = 0; k < Math.min(q.length, s.length); k++) if (q[k] === s[k]) same++; if (same / Math.max(q.length, s.length) >= .7) L = letters[j]; }
      letters.push(L != null ? L : String.fromCharCode(65 + (next++ % 26))); });
    return letters;
  }

  /* ---------------- lyrics alignment ---------------- */
  /** lines [{text, syl:[{i}]}] onto the singing: lines get spans in proportion to their syllables over the sung phrases,
      each line starts on a phrase start where one is near, syllables land on the note onsets inside the line */
  function alignLyrics(lines, onsets, sung) {
    if (!lines.length || !sung || !sung.length) return null;
    const total = sung.reduce((a, p) => a + (p.to - p.from), 0), counts = lines.map(l => Math.max(1, l.syl.length)), all = counts.reduce((a, b) => a + b, 0);
    const timeAtSung = x => { let acc = 0; for (const p of sung) { const d = p.to - p.from; if (acc + d >= x) return p.from + (x - acc); acc += d; } return sung[sung.length - 1].to; };
    let acc = 0; return lines.map((l, k) => {
      let t = timeAtSung(acc / all * total), e = timeAtSung((acc + counts[k]) / all * total); acc += counts[k];
      const ps = sung.find(p => Math.abs(p.from - t) < 1.2); if (ps) t = ps.from;
      const on = onsets.filter(x => x >= t - .05 && x < e - .05);
      const syl = l.syl.map((s, j) => ({ i: s.i, t: +(on.length >= l.syl.length ? on[Math.round(j * (on.length - 1) / Math.max(1, l.syl.length - 1))] : t + (e - t) * j / l.syl.length).toFixed(3) }));
      return { t: +t.toFixed(3), e: +Math.max(t + .3, e).toFixed(3), text: l.text, syl, src: 'aligned' };
    });
  }
  /** where a voice is singing: note groups with gaps under `gap` */
  function sungSpans(notes, gap) {
    gap = gap || .45; const out = []; notes.forEach(n => { const l = out[out.length - 1]; if (l && n.t - l.to < gap) l.to = Math.max(l.to, n.t + n.d); else out.push({ from: n.t, to: n.t + n.d }); });
    return out.filter(s => s.to - s.from > .4);
  }

  /* ---------------- files ---------------- */
  /** Standard MIDI File → { notes [{t,d,m,vel,ch,track}], tempos [{t,bpm}], beats (from the file's own tempo map), meter } */
  function midi(buf) {
    const v = new DataView(buf instanceof ArrayBuffer ? buf : buf.buffer, buf.byteOffset || 0, buf.byteLength); let p = 0;
    const str = n => { let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(v.getUint8(p + i)); p += n; return s; };
    const u32 = () => { const x = v.getUint32(p); p += 4; return x; }, u16 = () => { const x = v.getUint16(p); p += 2; return x; };
    const vlq = () => { let x = 0, b; do { b = v.getUint8(p++); x = (x << 7) | (b & 127); } while (b & 128); return x; };
    if (str(4) !== 'MThd') throw new Error('not-midi'); const hl = u32(), fmt = u16(), nt = u16(), div = u16(); p += hl - 6; void fmt;
    if (div & 0x8000) throw new Error('smpte-midi');
    const evs = [], tempos = [{ tick: 0, us: 500000 }]; let meter = null;
    for (let tr = 0; tr < nt && p < v.byteLength; tr++) {
      if (str(4) !== 'MTrk') break; const len = u32(), end = p + len; let tick = 0, run = 0;
      while (p < end) { tick += vlq(); let st = v.getUint8(p); if (st & 128) p++; else st = run;
        if (st === 0xff) { const ty = v.getUint8(p++), l = vlq(); if (ty === 0x51) tempos.push({ tick, us: (v.getUint8(p) << 16) | (v.getUint8(p + 1) << 8) | v.getUint8(p + 2) }); if (ty === 0x58 && !meter) meter = { num: v.getUint8(p), den: Math.pow(2, v.getUint8(p + 1)) }; p += l; continue; }
        if (st === 0xf0 || st === 0xf7) { p += vlq(); continue; }
        run = st; const hi = st & 0xf0, ch = st & 15, a = v.getUint8(p++), b = (hi === 0xc0 || hi === 0xd0) ? 0 : v.getUint8(p++);
        if (hi === 0x90 && b > 0) evs.push({ tick, on: true, m: a, vel: b, ch, tr }); else if (hi === 0x80 || (hi === 0x90 && b === 0)) evs.push({ tick, on: false, m: a, ch, tr }); }
      p = end;
    }
    tempos.sort((a, b) => a.tick - b.tick);
    const sec = tk => { let s = 0, last = 0, us = 500000; for (const tp of tempos) { if (tp.tick >= tk) break; s += (tp.tick - last) * us / div / 1e6; last = tp.tick; us = tp.us; } return s + (tk - last) * us / div / 1e6; };
    evs.sort((a, b) => a.tick - b.tick || (a.on ? 1 : -1));
    const open = new Map(), notes = [];
    evs.forEach(e => { const k = e.ch + ':' + e.m; if (e.on) { if (!open.has(k)) open.set(k, []); open.get(k).push(e); } else { const q = open.get(k); const s = q && q.shift(); if (s) notes.push({ t: +sec(s.tick).toFixed(4), d: +Math.max(.02, sec(e.tick) - sec(s.tick)).toFixed(4), m: s.m, vel: s.vel, ch: s.ch, track: s.tr }); } });
    notes.sort((a, b) => a.t - b.t);
    const lastTick = evs.length ? evs[evs.length - 1].tick : 0, beats = []; for (let tk = 0; tk <= lastTick + div; tk += div) beats.push(+sec(tk).toFixed(4));
    return { notes: notes.filter(n => n.ch !== 9), drums: notes.filter(n => n.ch === 9), tempos: tempos.map(tp => ({ t: +sec(tp.tick).toFixed(4), bpm: +(6e7 / tp.us).toFixed(2) })), beats, meter, duration: beats[beats.length - 1] || 0 };
  }
  /** AIFF / AIFF-C (uncompressed, big- or little-endian 'sowt') → { sr, ch: [Float32Array…] } — Chrome cannot decode AIFF itself */
  function aiff(buf) {
    const v = new DataView(buf); const id = (o, n) => String.fromCharCode(...new Uint8Array(buf, o, n));
    if (id(0, 4) !== 'FORM' || !/AIF[FC]/.test(id(8, 4))) throw new Error('not-aiff');
    let p = 12, nch = 0, frames = 0, bits = 16, sr = 44100, data = -1, little = false;
    while (p + 8 <= buf.byteLength) { const ck = id(p, 4), len = v.getUint32(p + 4);
      if (ck === 'COMM') { nch = v.getUint16(p + 8); frames = v.getUint32(p + 10); bits = v.getUint16(p + 14);
        const ex = v.getUint16(p + 16) & 0x7fff, hi = v.getUint32(p + 18), lo = v.getUint32(p + 22); sr = Math.round((hi * Math.pow(2, -31) + lo * Math.pow(2, -63)) * Math.pow(2, ex - 16383));
        if (len >= 22) { const ct = id(p + 26, 4); if (ct === 'sowt') little = true; else if (ct !== 'NONE' && ct !== 'twos' && id(8, 4) === 'AIFC') throw new Error('aiff-compressed'); } }
      if (ck === 'SSND') data = p + 16 + v.getUint32(p + 8);
      p += 8 + len + (len & 1); }
    if (data < 0 || !nch) throw new Error('bad-aiff');
    const B = bits >> 3, ch = Array.from({ length: nch }, () => new Float32Array(frames)), sc = Math.pow(2, bits - 1);
    for (let i = 0; i < frames; i++) for (let c = 0; c < nch; c++) { const o = data + (i * nch + c) * B; if (o + B > buf.byteLength) break; let x;
      if (B === 1) x = v.getInt8(o); else if (B === 2) x = v.getInt16(o, little); else if (B === 3) { const b0 = v.getUint8(o), b1 = v.getUint8(o + 1), b2 = v.getUint8(o + 2); x = little ? ((b2 << 24) | (b1 << 16) | (b0 << 8)) >> 8 : ((b0 << 24) | (b1 << 16) | (b2 << 8)) >> 8; } else x = v.getInt32(o, little);
      ch[c][i] = x / sc; }
    return { sr, ch };
  }
  /** 16-bit PCM WAV from channels (the working copy that plays everywhere) */
  function wav(ch, sr) {
    const n = ch[0].length, C = ch.length, b = new ArrayBuffer(44 + n * 2 * C), v = new DataView(b), w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2 * C, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, C, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2 * C, true); v.setUint16(32, 2 * C, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2 * C, true);
    for (let i = 0, o = 44; i < n; i++) for (let c = 0; c < C; c++, o += 2) v.setInt16(o, Math.max(-1, Math.min(1, ch[c][i])) * 32767, true);
    return b;
  }
  /** waveform data: min/max pairs at `rate` per second, as signed bytes in base64 (stored with the project) */
  function peaks(x, sr, rate) {
    rate = rate || 100; const n = Math.ceil(x.length / sr * rate), step = sr / rate, out = new Int8Array(n * 2);
    for (let i = 0; i < n; i++) { let lo = 0, hi = 0; for (let j = Math.floor(i * step), e = Math.min(x.length, Math.floor((i + 1) * step)); j < e; j++) { const s = x[j]; if (s < lo) lo = s; else if (s > hi) hi = s; } out[2 * i] = Math.round(lo * 127); out[2 * i + 1] = Math.round(hi * 127); }
    let s = ''; const u = new Uint8Array(out.buffer); for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192));
    return { rate, b64: typeof btoa === 'function' ? btoa(s) : Buffer.from(u).toString('base64') };
  }
  function unpeaks(P) {
    if (!P || !P.b64) return null; const s = typeof atob === 'function' ? atob(P.b64) : Buffer.from(P.b64, 'base64').toString('binary'), u = new Int8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = (s.charCodeAt(i) << 24) >> 24; const pk = new Float32Array(u.length); for (let i = 0; i < u.length; i++) pk[i] = u[i] / 127; return { pk, R: P.rate };
  }

  /* ---------------- chords ---------------- */
  const NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'], ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function rootOf(s) { const m = /^([A-G])([♯#]|[♭b](?!\w*\d*[a-z]{2}))?/.exec(s || ''); if (!m) return null; return { pc: (ROOT[m[1]] + (m[2] ? (/[♯#]/.test(m[2]) ? 1 : -1) : 0) + 12) % 12, len: m[0].length }; }
  function transposeChord(name, k) {
    if (!name) return name; const [main, bass] = name.split('/'), r = rootOf(main); if (!r) return name;
    let out = NAMES[(r.pc + k + 120) % 12] + main.slice(r.len);
    if (bass) { const b = rootOf(bass); out += '/' + (b ? NAMES[(b.pc + k + 120) % 12] + bass.slice(b.len) : bass); }
    return out;
  }
  return { fftMag, envelope, tempogram, tempoPath, beatsDP, tempo, beatF, tempoPoints, bpmAt, beatsFrom, strokes, tabulate, fitRange, phrases, repeats, alignLyrics, sungSpans, midi, aiff, wav, peaks, unpeaks, transposeChord, rootOf, NAMES };
})();
