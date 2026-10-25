/* =====================================================================
   AI transcription — the music behind the song, measured from the audio.
   Everything here runs on the device, on the decoded samples; nothing is
   uploaded and nothing is invented: every number below comes out of the
   signal, and each one carries the confidence it was measured with.

   · notes     melody transcription: a harmonic-sum salience spectrum over
               a 1/3-semitone grid, Viterbi over pitch + silence, notes cut
               where the pitch changes, starts pulled onto the nearest onset.
               One line at a time (the strongest voice) — for a full mix the
               AI separation is run first and this listens to one instrument.
   · metre     simple or compound from the energy between beats, then the
               bar length from the accent pattern and the chord changes.
   · sections  a self-similarity matrix over beat chroma, cut at novelty
               peaks. The parts are numbered, never named: nothing in the
               audio says "chorus".
   · panduri   every note placed on A3 · C♯4 · E4, 17 frets. A note that
               this tuning cannot play is marked, never moved quietly.
   · exports   MIDI, MusicXML, JSON and panduri tab, written from the same
               data the screen shows.
   ===================================================================== */
PD.aimus = (() => {
  const TH = PD.theory;
  const LO = 40, HI = 88, SUB = 3;                 // E2 … E6, a third of a semitone per step
  const ST = (HI - LO) * SUB + 1;

  /* ---------- the DSP, written so it also runs inside a worker (no PD inside) ---------- */
  const DSPF = function () {
    const LO = 40, HI = 88, SUB = 3, ST = (HI - LO) * SUB + 1;
    const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
    const med = a => { if (!a.length) return 0; const s = Array.from(a).sort((x, y) => x - y); return s[s.length >> 1]; };
    function fftMag(N) {
      const rev = new Uint32Array(N), b = Math.log2(N), cs = new Float32Array(N / 2), sn = new Float32Array(N / 2);
      for (let i = 0; i < N; i++) { let r = 0; for (let k = 0; k < b; k++) r |= ((i >> k) & 1) << (b - 1 - k); rev[i] = r; }
      for (let i = 0; i < N / 2; i++) { cs[i] = Math.cos(2 * Math.PI * i / N); sn[i] = -Math.sin(2 * Math.PI * i / N); }
      const re = new Float32Array(N), im = new Float32Array(N), w = new Float32Array(N);
      for (let i = 0; i < N; i++) w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
      return (x, off, out) => {
        for (let i = 0; i < N; i++) { const j = rev[i], v = x[off + i] || 0; re[j] = v * w[i]; im[j] = 0; }
        for (let size = 2; size <= N; size <<= 1) { const half = size >> 1, step = N / size; for (let i = 0; i < N; i += size) for (let j = 0, k = 0; j < half; j++, k += step) { const a = i + j, c = a + half, tr = re[c] * cs[k] - im[c] * sn[k], ti = re[c] * sn[k] + im[c] * cs[k]; re[c] = re[a] - tr; im[c] = im[a] - ti; re[a] += tr; im[a] += ti; } }
        for (let k = 0; k < N / 2; k++) out[k] = Math.sqrt(re[k] * re[k] + im[k] * im[k]);
      };
    }
    /** the strongest pitch line of a mono signal, note by note */
    function run(mono, sr, opt, onProgress) {
      opt = Object.assign({ hop: 512, N: 4096, minMs: 70, silence: .36, jump: .22, conf: .34, a4: 440, lo: 48, hi: 84, oct: .12 }, opt || {});
      const N = opt.N, HOP = opt.hop, fft = fftMag(N), mag = new Float32Array(N / 2), HALF = N / 2;
      const F = Math.max(2, Math.floor((mono.length - N) / HOP)), dt = HOP / sr, t0off = N / 2 / sr;
      const P0 = Math.max(0, Math.round((opt.lo - LO) * SUB)), P1 = Math.min(ST - 1, Math.round((opt.hi - LO) * SUB)), NP = P1 - P0 + 1;
      // tables: the bins of every partial of every pitch step, and the pitch class of every bin
      const HN = 8, hw = new Float32Array(HN); for (let h = 1; h <= HN; h++) hw[h - 1] = 1 / Math.pow(h, h === 1 ? 0 : 1.45);
      const binOf = new Float32Array(NP * HN);
      for (let p = 0; p < NP; p++) { const f0 = opt.a4 * Math.pow(2, (LO + (P0 + p) / SUB - 69) / 12); for (let h = 1; h <= HN; h++) { const f = f0 * h; binOf[p * HN + h - 1] = f < sr / 2 - 2 ? f * N / sr : -1; } }
      const pcOf = new Int8Array(HALF).fill(-1), FLX = Math.min(HALF, N >> 3);
      for (let k = 2; k < HALF; k++) { const f = k * sr / N; if (f < 55 || f > 2100) continue; const m = 69 + 12 * Math.log2(f / opt.a4), r = Math.round(m); if (Math.abs(m - r) < .4) pcOf[k] = ((r % 12) + 12) % 12; }
      const sal = new Float32Array(F * NP), energy = new Float32Array(F), flux = new Float32Array(F);
      const chroma = new Float32Array(F * 12), prev = new Float32Array(HALF), tmp = new Float32Array(NP);
      for (let i = 0; i < F; i++) {
        fft(mono, i * HOP, mag);
        let e = 0, fl = 0; const co = i * 12;
        for (let k = 2; k < HALF; k++) {
          const v = mag[k]; e += v;
          if (k < FLX) { const lg = Math.log1p(v * 10), d = lg - prev[k]; if (d > 0) fl += d; prev[k] = lg; }
          const pc = pcOf[k]; if (pc >= 0) chroma[co + pc] += Math.sqrt(v);
        }
        energy[i] = e / HALF; flux[i] = fl;
        let cm = 0; for (let k = 0; k < 12; k++) if (chroma[co + k] > cm) cm = chroma[co + k];
        if (cm > 0) for (let k = 0; k < 12; k++) chroma[co + k] /= cm;
        for (let p = 0; p < NP; p++) {
          let s = 0;
          for (let h = 0; h < HN; h++) { const k = binOf[p * HN + h]; if (k < 0) continue; const k0 = k | 0, fr = k - k0, v = (mag[k0] || 0) * (1 - fr) + (mag[k0 + 1] || 0) * fr; s += hw[h] * Math.sqrt(v); }
          tmp[p] = s;
        }
        // a pitch an octave below a real note picks up all of its partials: take that ghost back out
        const o12 = 12 * SUB, so = i * NP; let mx = 0;
        for (let p = 0; p < NP; p++) { const v = Math.max(0, tmp[p] - (p + o12 < NP ? opt.oct * tmp[p + o12] : 0)); sal[so + p] = v; if (v > mx) mx = v; }
        if (mx > 0) for (let p = 0; p < NP; p++) sal[so + p] /= mx;
        if ((i & 127) === 0) onProgress && onProgress(i / F * .75);
      }
      const es = Array.from(energy).sort((a, b) => a - b), eLo = es[Math.floor(es.length * .12)], eHi = es[Math.floor(es.length * .92)] || 1;
      // Viterbi over the pitch steps plus one silence state
      const SIL = NP, W = 4 * SUB, dp = new Float32Array(NP + 1), nd = new Float32Array(NP + 1), back = new Int16Array(F * (NP + 1));
      const emit = (i, p) => p === SIL ? opt.silence * (1 + .9 * (1 - clamp((energy[i] - eLo) / (eHi - eLo || 1), 0, 1))) : sal[i * NP + p];
      for (let p = 0; p <= NP; p++) dp[p] = emit(0, p);
      for (let i = 1; i < F; i++) {
        let bi = 0; for (let p = 1; p <= NP; p++) if (dp[p] > dp[bi]) bi = p;
        const bo = i * (NP + 1), dsil = dp[SIL] - .45;
        for (let p = 0; p < NP; p++) {
          let bs = -1e9, bk = p; const lo = p - W < 0 ? 0 : p - W, hi = p + W >= NP ? NP - 1 : p + W;
          for (let q = lo; q <= hi; q++) { const v = dp[q] - opt.jump * Math.abs(q - p) / SUB; if (v > bs) { bs = v; bk = q; } }
          if (dsil > bs) { bs = dsil; bk = SIL; }
          nd[p] = bs + emit(i, p); back[bo + p] = bk;
        }
        { const a = dp[SIL], b = dp[bi] - .45; if (a >= b) { nd[SIL] = a + emit(i, SIL); back[bo + SIL] = SIL; } else { nd[SIL] = b + emit(i, SIL); back[bo + SIL] = bi; } }
        dp.set(nd);
        if ((i & 511) === 0) onProgress && onProgress(.75 + i / F * .2);
      }
      let s = 0; for (let p = 1; p <= NP; p++) if (dp[p] > dp[s]) s = p;
      const path = new Int16Array(F); path[F - 1] = s;
      for (let i = F - 2; i >= 0; i--) { s = back[(i + 1) * (NP + 1) + s]; path[i] = s; }
      const semi = i => path[i] === SIL ? -1 : Math.round(LO + (P0 + path[i]) / SUB);
      const raw = []; let st = 0;
      for (let i = 1; i <= F; i++) {
        if (i < F && semi(i) === semi(st)) continue;
        const m = semi(st);
        if (m >= 0) { const ks = []; let sc = 0; for (let j = st; j < i; j++) { ks.push((LO + (P0 + path[j]) / SUB - m) * 100); sc += sal[j * NP + path[j]]; } raw.push({ m, i0: st, i1: i, t0: st * dt + t0off, t1: i * dt + t0off, cents: Math.round(med(ks)), conf: clamp(sc / (i - st), 0, 1) }); }
        st = i;
      }
      const minF = Math.max(2, Math.round(opt.minMs / 1000 / dt));
      let notes = raw.filter(n => n.i1 - n.i0 >= minF && n.conf >= opt.conf);
      const wOn = Math.round(.06 / dt);
      notes.forEach(n => { let b = n.i0, bv = flux[n.i0] || 0; for (let j = Math.max(0, n.i0 - wOn); j <= Math.min(F - 1, n.i0 + wOn); j++) if (flux[j] > bv) { bv = flux[j]; b = j; } n.t0 = b * dt + t0off; if (n.t1 <= n.t0 + dt) n.t1 = n.t0 + dt * 2; });
      notes.sort((a, b) => a.t0 - b.t0);
      for (let i = 0; i < notes.length - 1; i++) if (notes[i].t1 > notes[i + 1].t0) notes[i].t1 = notes[i + 1].t0;
      notes = notes.filter(n => n.t1 > n.t0 + .04).map(n => ({ m: n.m, t0: +n.t0.toFixed(3), t1: +n.t1.toFixed(3), cents: n.cents, conf: +n.conf.toFixed(3) }));
      onProgress && onProgress(1);
      const ch = []; for (let i = 0; i < F; i++) ch.push(chroma.subarray(i * 12, i * 12 + 12));
      return { notes, dt, frames: F, chroma: ch, flux, t0off };
    }
    return { run, fftMag, LO, HI, SUB };
  };
  const DSP = DSPF();
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;

  /** transcription on this thread (used when a worker cannot start) */
  async function transcribe(mono, sr, opt, onProgress) {
    opt = Object.assign({ a4: TH.a4 ? TH.a4() : 440 }, opt || {});
    let last = 0;
    const r = DSP.run(mono, sr, opt, p => { const n = Date.now(); if (n - last > 60) { last = n; onProgress && onProgress(p); } });
    await new Promise(r2 => setTimeout(r2, 0));
    return r;
  }
  /** transcription in a worker, so the player and the screen keep running */
  function transcribeAsync(mono, sr, opt, onProgress) {
    opt = Object.assign({ a4: TH.a4 ? TH.a4() : 440 }, opt || {});
    let W = null;
    const p = new Promise((res, rej) => {
      try {
        const body = 'const D=(' + DSPF.toString() + ')();\nself.onmessage=function(e){var d=e.data;var r=D.run(d.mono,d.sr,d.opt,function(p){self.postMessage({p:p});});' +
          'self.postMessage({r:{notes:r.notes,dt:r.dt,frames:r.frames,flux:r.flux,t0off:r.t0off,chroma:Array.prototype.map.call(r.chroma,function(c){return Array.from(c);})}});};';
        W = new Worker(URL.createObjectURL(new Blob([body], { type: 'text/javascript' })));
        W.onmessage = e => { if (e.data.p != null) onProgress && onProgress(e.data.p); else { const r = e.data.r; try { W.terminate(); } catch (_) {} W = null; res(r); } };
        W.onerror = ev => { try { W.terminate(); } catch (_) {} W = null; rej(new Error((ev && ev.message) || 'worker')); };
        W.postMessage({ mono, sr, opt });
      } catch (e) { rej(e); }
    });
    p.cancel = () => { if (W) { try { W.terminate(); } catch (_) {} W = null; } };
    return p;
  }

  /* =================== metre: simple or compound, bar length =================== */
  /** beats + onset flux → { num, den, beatsPerBar, group, conf, alts, phase } */
  function metre(beats, flux, dt, t0off, chords) {
    if (!beats || beats.length < 6) return { num: 4, den: 4, beatsPerBar: 4, group: 4, conf: 0, alts: [], phase: 0, unsure: true };
    const at = t => { const i = Math.round((t - t0off) / dt); return i >= 0 && i < flux.length ? flux[i] : 0; };
    const near = (t, r) => { let m = 0; for (let x = t - r; x <= t + r; x += dt) m = Math.max(m, at(x)); return m; };
    // between every pair of beats: is the energy at the half or at the thirds?
    let half = 0, third = 0;
    for (let k = 0; k < beats.length - 1; k++) {
      const a = beats[k], b = beats[k + 1], L = b - a; if (L <= 0 || L > 2) continue;
      half += near(a + L / 2, L * .07);
      third += (near(a + L / 3, L * .07) + near(a + 2 * L / 3, L * .07)) / 2;
    }
    const subConf = clamp(Math.abs(third - half) / (third + half || 1) * 2.2, 0, 1);
    const compound = third > half * 1.18 && subConf > .28;   // only when the thirds really are stronger; otherwise the simple reading is the safer one
    // bar length: accent contrast on the downbeat + chord changes landing there
    const str = beats.map(b => near(b, .05)), ch = (chords || []).map(c => c.t0).filter(x => x > .2);
    const trial = [];
    for (const g of [2, 3, 4]) {
      let best = null;
      for (let ph = 0; ph < g; ph++) {
        let dsum = 0, dn = 0, osum = 0, on = 0, hit = 0;
        str.forEach((v, k) => { if (((k - ph) % g + g) % g === 0) { dsum += v; dn++; if (ch.some(x => Math.abs(x - beats[k]) < .15)) hit++; } else { osum += v; on++; } });
        const d = dn ? dsum / dn : 0, o = on ? osum / on : 0;
        const sc = (d - o) / (d + o || 1) + (dn ? hit / dn : 0) * .9;
        if (!best || sc > best.sc) best = { g, ph, sc };
      }
      trial.push(best);
    }
    trial.sort((a, b) => b.sc - a.sc);
    const top = trial[0], second = trial[1];
    const conf = clamp((top.sc - (second ? second.sc : 0)) * 1.6, 0, 1) * (.4 + .6 * subConf);
    const sig = g => compound ? { num: g * 3, den: 8 } : { num: g, den: 4 };
    const s0 = sig(top.g);
    const alts = trial.slice(1).map(x => Object.assign(sig(x.g), { score: +x.sc.toFixed(2) }))
      .concat(compound ? [{ num: top.g, den: 4, score: null, note: 'simple' }] : [{ num: top.g * 3, den: 8, score: null, note: 'compound' }]);
    return { num: s0.num, den: s0.den, beatsPerBar: top.g, group: top.g, compound, phase: top.ph, conf: +conf.toFixed(2), alts, unsure: conf < .3 };
  }
  /** the tempo the beats really carry, plus the half and double readings */
  function tempoAlts(bpm) {
    const o = [{ bpm: Math.round(bpm), role: 'main' }];
    if (bpm / 2 >= 40) o.push({ bpm: Math.round(bpm / 2), role: 'half' });
    if (bpm * 2 <= 240) o.push({ bpm: Math.round(bpm * 2), role: 'double' });
    return o;
  }

  /* =================== bars, beats, rhythmic values =================== */
  /** every note gets its bar, its beat inside the bar and a written duration */
  function quantise(notes, beats, mt) {
    if (!beats || beats.length < 2) return notes;
    const g = mt && mt.beatsPerBar || 4, ph = mt && mt.phase || 0;
    let bar0 = 0;
    const beatAt = t => {   // position in beats (fractional) on the real beat grid
      if (t <= beats[0]) return (t - beats[0]) / (beats[1] - beats[0]);
      for (let k = 0; k < beats.length - 1; k++) if (t < beats[k + 1]) return k + (t - beats[k]) / (beats[k + 1] - beats[k]);
      const L = beats[beats.length - 1] - beats[beats.length - 2];
      return beats.length - 1 + (t - beats[beats.length - 1]) / (L || 1);
    };
    const VALS = [[4, 'w'], [3, 'h.'], [2, 'h'], [1.5, 'q.'], [1, 'q'], [.75, 'e.'], [.6667, 'e3'], [.5, 'e'], [.3333, 's3'], [.25, 's']];
    notes.forEach(n => {
      const b0 = beatAt(n.t0), b1 = beatAt(n.t1), len = Math.max(.08, b1 - b0);
      const q0 = Math.round(b0 * 4) / 4;                      // written on a sixteenth grid
      n.posB = +b0.toFixed(3); n.lenB = +len.toFixed(3);
      n.bar = Math.floor((q0 - ph) / g) + 1; if (n.bar < bar0) bar0 = n.bar; n.beat = +(((q0 - ph) % g + g) % g + 1).toFixed(2);
      let best = VALS[0]; for (const v of VALS) if (Math.abs(Math.log2(len / v[0])) < Math.abs(Math.log2(len / best[0]))) best = v;
      n.val = best[1];
    });
    if (bar0 < 1) notes.forEach(n => { n.bar += 1 - bar0; });   // bars are counted from 1
    return notes;
  }

  /* =================== the panduri: string, fret, finger =================== */
  const FING = f => f <= 0 ? 0 : f <= 2 ? 1 : f <= 4 ? 2 : f <= 6 ? 3 : 4;
  /** every way to play this pitch on the instrument as it is tuned now */
  function places(m) {
    const all = TH.positions(Math.round(m)) || [];
    return all.map(p => ({ s: p.s, f: p.f, fi: FING(p.f) })).sort((a, b) => a.f - b.f || b.s - a.s);
  }
  /** a whole line placed on the neck: the position nearest the previous one wins, unreachable notes are marked */
  function mapNotes(notes) {
    let prev = null;
    notes.forEach(n => {
      const ps = places(n.m);
      if (!ps.length) { n.reach = false; n.s = 0; n.f = -1; n.alt = []; n.octave = octaveFix(n.m); return; }
      let best = ps[0];
      if (prev) { const cost = p => Math.abs(p.f - prev.f) + (p.s === prev.s ? 0 : 1.5) + p.f * .05; ps.forEach(p => { if (cost(p) < cost(best)) best = p; }); }
      else ps.forEach(p => { if (p.f < best.f) best = p; });
      n.reach = true; n.s = best.s; n.f = best.f; n.fi = best.fi;
      n.alt = ps.filter(p => p !== best).map(p => ({ s: p.s, f: p.f }));
      prev = best;
    });
    return notes;
  }
  /** a pitch this tuning cannot reach: which octave would reach it (never applied on its own) */
  function octaveFix(m) {
    for (const d of [12, -12, 24, -24]) if ((TH.positions(Math.round(m + d)) || []).length) return { shift: d, m: Math.round(m + d) };
    return null;
  }

  /* =================== sections: where the music repeats =================== */
  /** beat-synchronous chroma → parts, numbered only (nothing in the audio names them) */
  function sections(chroma, dt, t0off, beats, dur) {
    if (!chroma || !beats || beats.length < 12) return [];
    const bc = beats.map((b, k) => {
      const t1 = beats[k + 1] != null ? beats[k + 1] : b + (b - beats[k - 1] || .5);
      const i0 = clamp(Math.round((b - t0off) / dt), 0, chroma.length - 1), i1 = clamp(Math.round((t1 - t0off) / dt), i0 + 1, chroma.length);
      const v = new Float32Array(12); for (let i = i0; i < i1; i++) for (let k2 = 0; k2 < 12; k2++) v[k2] += chroma[i][k2];
      let n = 0; for (let k2 = 0; k2 < 12; k2++) n += v[k2] * v[k2]; n = Math.sqrt(n) || 1;
      for (let k2 = 0; k2 < 12; k2++) v[k2] /= n; return v;
    });
    const B = bc.length, L = 8;                       // novelty over a checkerboard of 8 beats
    const sim = (a, b) => { let s = 0; for (let k = 0; k < 12; k++) s += bc[a][k] * bc[b][k]; return s; };
    const nov = new Float32Array(B);
    for (let i = L; i < B - L; i++) { let same = 0, cross = 0; for (let a = 1; a <= L; a++) for (let b = 1; b <= L; b++) { same += sim(i - a, i - b) + sim(i + a - 1, i + b - 1); cross += 2 * sim(i - a, i + b - 1); } nov[i] = (same - cross) / (L * L * 4); }
    let mx = 0; for (let i = 0; i < B; i++) mx = Math.max(mx, nov[i]); if (mx <= 0) return [];
    const cuts = [0]; const minGap = Math.max(8, Math.round(B / 14));
    for (let i = L; i < B - L; i++) { if (nov[i] < mx * .42) continue; let pk = true; for (let j = Math.max(0, i - 3); j <= Math.min(B - 1, i + 3); j++) if (nov[j] > nov[i]) pk = false; if (pk && i - cuts[cuts.length - 1] >= minGap) cuts.push(i); }
    if (cuts.length < 2) return [];
    cuts.push(B);
    const out = [];
    for (let k = 0; k < cuts.length - 1; k++) { const a = beats[cuts[k]], b = cuts[k + 1] < B ? beats[cuts[k + 1]] : dur; if (b - a > 2) out.push({ t0: +a.toFixed(2), t1: +b.toFixed(2), n: out.length + 1 }); }
    // parts that sound alike get the same number (A, A', B … without naming them)
    out.forEach((s, i) => { s.like = i; for (let j = 0; j < i; j++) { const f = (x, y) => { const i0 = beats.findIndex(t => t >= x), i1 = beats.findIndex(t => t >= y); return [i0 < 0 ? 0 : i0, i1 < 0 ? B : i1]; }; const [a0, a1] = f(s.t0, s.t1), [b0, b1] = f(out[j].t0, out[j].t1), n = Math.min(a1 - a0, b1 - b0); if (n < 6) continue; let v = 0; for (let q = 0; q < n; q++) v += sim(a0 + q, b0 + q); if (v / n > .86) { s.like = out[j].like; break; } } });
    return out;
  }

  /* =================== written forms =================== */
  const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], SOLF = ['დო', 'რე', 'მი', 'ფა', 'სოლ', 'ლა', 'სი'], SOLF_EN = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
  const LPC = [0, 2, 4, 5, 7, 9, 11];
  /** spell a pitch inside a key: letter, accidental, octave */
  function spell(m, key) {
    const r = Math.round(m), pc = ((r % 12) + 12) % 12, flat = key ? TH.prefersFlat(key.r, key.q) : false;
    const SH = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'], FL = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
    const nm = (flat ? FL : SH)[pc], l = nm[0], acc = nm.length > 1 ? nm[1] : '', o = Math.floor(r / 12) - 1;
    return { l, acc, o, name: nm + o, pc };
  }
  /** scale degree 1–7 (+ a sign for a chromatic note) inside the key */
  function degreeOf(m, key) {
    if (!key) return '';
    const iv = ((Math.round(m) - key.r) % 12 + 12) % 12, maj = [0, 2, 4, 5, 7, 9, 11], min = [0, 2, 3, 5, 7, 8, 10], sc = key.q ? min : maj;
    const i = sc.indexOf(iv); if (i >= 0) return String(i + 1);
    for (let k = 0; k < 7; k++) { if (((sc[k] - 1 + 12) % 12) === iv) return '♭' + (k + 1); if (((sc[k] + 1) % 12) === iv) return '♯' + (k + 1); }
    return '?';
  }
  function solfegeOf(m, key, en) {
    if (!key) return '';
    const sp = spell(m, key), i = LET.indexOf(sp.l);
    return (en ? SOLF_EN : SOLF)[i] + sp.acc;
  }

  /* =================== export =================== */
  const DURV = { w: 4, 'h.': 3, h: 2, 'q.': 1.5, q: 1, 'e.': .75, e3: 2 / 3, e: .5, s3: 1 / 3, s: .25 };
  function midiFile(M) {
    const TPQ = 480, ev = [];
    M.notes.forEach(n => { const a = Math.round((n.posB || 0) * TPQ), b = Math.max(a + 10, Math.round(((n.posB || 0) + (n.lenB || .5)) * TPQ)); ev.push({ t: a, on: 1, m: n.m }); ev.push({ t: b, on: 0, m: n.m }); });
    ev.sort((a, b) => a.t - b.t || a.on - b.on);
    const bytes = [], vlq = v => { const s = []; do { s.unshift(v & 127); v >>= 7; } while (v > 0); for (let i = 0; i < s.length - 1; i++) s[i] |= 128; return s; };
    const us = Math.round(60000000 / (M.bpm || 100));
    bytes.push(...vlq(0), 0xFF, 0x51, 3, (us >> 16) & 255, (us >> 8) & 255, us & 255);
    bytes.push(...vlq(0), 0xFF, 0x58, 4, M.metre ? M.metre.num : 4, Math.round(Math.log2(M.metre ? M.metre.den : 4)), 24, 8);
    let last = 0;
    ev.forEach(e => { bytes.push(...vlq(Math.max(0, e.t - last)), e.on ? 0x90 : 0x80, clamp(e.m, 0, 127), e.on ? 90 : 0); last = e.t; });
    bytes.push(...vlq(0), 0xFF, 0x2F, 0);
    const head = [0x4D, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, (TPQ >> 8) & 255, TPQ & 255];
    const tl = bytes.length, trk = [0x4D, 0x54, 0x72, 0x6B, (tl >> 24) & 255, (tl >> 16) & 255, (tl >> 8) & 255, tl & 255];
    return new Blob([new Uint8Array(head.concat(trk, bytes))], { type: 'audio/midi' });
  }
  function musicXML(M, title) {
    const div = 12, g = M.metre ? M.metre.num : 4, den = M.metre ? M.metre.den : 4, perBar = g * (4 / den);
    const esc = s => String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
    const fifths = (() => { if (!M.key) return 0; const maj = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5], r = M.key.q ? (M.key.r + 3) % 12 : M.key.r, i = maj.indexOf(r); return i > 6 ? i - 12 : i; })();
    const bars = {}; M.notes.forEach(n => { const b = Math.max(1, n.bar || 1); (bars[b] = bars[b] || []).push(n); });
    let x = '<?xml version="1.0" encoding="UTF-8"?>\n<score-partwise version="3.1">\n<work><work-title>' + esc(title || 'transcription') + '</work-title></work>\n<part-list><score-part id="P1"><part-name>Panduri</part-name></score-part></part-list>\n<part id="P1">\n';
    const keys = Object.keys(bars).map(Number).sort((a, b) => a - b);
    (keys.length ? keys : [1]).forEach((b, bi) => {
      x += '<measure number="' + b + '">';
      if (bi === 0) x += '<attributes><divisions>' + div + '</divisions><key><fifths>' + fifths + '</fifths><mode>' + (M.key && M.key.q ? 'minor' : 'major') + '</mode></key><time><beats>' + g + '</beats><beat-type>' + den + '</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>';
      let filled = 0;
      (bars[b] || []).sort((p, q) => p.beat - q.beat).forEach(n => {
        const start = (n.beat - 1) * (4 / den);
        if (start > filled + .02) { const r = Math.round((start - filled) * div); if (r > 0) { x += '<note><rest/><duration>' + r + '</duration></note>'; filled += r / div; } }
        const d = Math.max(1, Math.round((DURV[n.val] || 1) * div)), sp = spell(n.m, M.key);
        x += '<note><pitch><step>' + sp.l + '</step>' + (sp.acc ? '<alter>' + (sp.acc === '♯' ? 1 : -1) + '</alter>' : '') + '<octave>' + sp.o + '</octave></pitch><duration>' + d + '</duration><type>' + ({ w: 'whole', h: 'half', q: 'quarter', e: 'eighth', s: '16th' }[n.val[0]] || 'quarter') + '</type>' + (/\.$/.test(n.val) ? '<dot/>' : '') + '</note>';
        filled += d / div;
      });
      const restLeft = Math.round((perBar - filled) * div); if (restLeft > 0) x += '<note><rest/><duration>' + restLeft + '</duration></note>';
      x += '</measure>\n';
    });
    return new Blob([x + '</part>\n</score-partwise>\n'], { type: 'application/vnd.recordare.musicxml+xml' });
  }
  /** panduri tab as text: three lines, E on top — the same layout as the neck on screen */
  function tabText(M, title) {
    const g = M.metre ? M.metre.num : 4, per = 4, rows = [[], [], []], head = [];
    const byBar = {}; M.notes.forEach(n => { const b = Math.max(1, n.bar || 1); (byBar[b] = byBar[b] || []).push(n); });
    const bars = Object.keys(byBar).map(Number).sort((a, b) => a - b);
    let out = (title ? title + '\n' : '') + 'ფანდური · A–C♯–E · ' + (M.metre ? M.metre.num + '/' + M.metre.den : '') + ' · ' + Math.round(M.bpm || 0) + ' BPM\n\n';
    for (let i = 0; i < bars.length; i += per) {
      const chunk = bars.slice(i, i + per); rows[0] = []; rows[1] = []; rows[2] = []; head.length = 0;
      chunk.forEach(b => {
        const cells = Math.max(8, g * 2), col = [[], [], []];
        for (let c = 0; c < cells; c++) { col[0][c] = '-'; col[1][c] = '-'; col[2][c] = '-'; }
        (byBar[b] || []).forEach(n => {
          const c = clamp(Math.round((n.beat - 1) * 2), 0, cells - 1);
          if (!n.reach || n.f < 0) { col[0][c] = '×'; return; }
          col[3 - n.s][c] = String(n.f);      // s3 (E) on the top line, s1 (A) at the bottom
        });
        for (let r = 0; r < 3; r++) rows[r].push(col[r].map(v => v.length > 1 ? v : v + '-').join(''));
        head.push(String(b));
      });
      ['E', 'C♯', 'A'].forEach((nm, r) => { out += (nm + ' ').padEnd(3) + '|' + rows[r].join('|') + '|\n'; });
      out += '    ' + head.map(b => 'ტაქტი ' + b).join('   ') + '\n\n';
    }
    return out;
  }
  function jsonOf(M, title) {
    return new Blob([JSON.stringify({ title, bpm: M.bpm, metre: M.metre, key: M.key && { root: M.key.r, minor: !!M.key.q, conf: M.key.conf },
      tuning: { strings: ['A3', 'C♯4', 'E4'], frets: 17 },
      chords: (M.chords || []).map(c => ({ t0: c.t0, t1: c.t1, name: c.name || null, conf: c.conf == null ? null : c.conf })),
      sections: M.sections || [], beats: (M.beats || []).map(b => +b.toFixed(3)),
      notes: (M.notes || []).map(n => ({ midi: n.m, name: spell(n.m, M.key).name, t0: n.t0, t1: n.t1, bar: n.bar, beat: n.beat, value: n.val, cents: n.cents, conf: n.conf, string: n.reach ? n.s : null, fret: n.reach ? n.f : null, playable: !!n.reach }))
    }, null, 1)], { type: 'application/json' });
  }

  return { transcribe, transcribeAsync, metre, tempoAlts, quantise, mapNotes, places, sections, spell, degreeOf, solfegeOf, midiFile, musicXML, tabText, jsonOf, DURV, LO, HI };
})();

/* =====================================================================
   The transcription panel inside the AI studio: one set of measured data
   shown six ways (staff · piano roll · letters · solfège · numbers ·
   panduri tab), every view following the player's real position.
   ===================================================================== */
PD.i18n.add({
  'tr.title': ['ნოტების ამოცნობა', 'Note transcription'],
  'tr.lead': ['AI უსმენს მელოდიას და ნოტ-ნოტად შლის: სიმაღლე, ხანგრძლივობა, ტაქტი და ფანდურის სიმი-ლადი. ერთ ხმას იღებს — ყველაზე ძლიერს. მრავალხმიან ჩანაწერში ჯერ ინსტრუმენტებად დაყავი და მერე აირჩიე, რომელს მოუსმინოს.', 'The AI follows the melody and writes it out note by note: pitch, length, bar and the panduri string and fret. It follows one voice — the strongest one. For a full mix, split the instruments first and then choose which one it should listen to.'],
  'tr.run': ['ნოტების ამოცნობა', 'Transcribe the notes'], 'tr.redo': ['თავიდან ამოცნობა', 'Transcribe again'],
  'tr.working': ['ვუსმენ ნოტებს…', 'Listening for notes…'], 'tr.cancel': ['შეჩერება', 'Stop'], 'tr.src': ['რას მოვუსმინო', 'What to listen to'],
  'tr.srcOrig': ['მთლიან სიმღერას', 'The whole song'], 'tr.range': ['დიაპაზონი', 'Range'],
  'tr.rMel': ['მელოდია', 'Melody'], 'tr.rHigh': ['მაღალი', 'High'], 'tr.rLow': ['ბასი', 'Bass'],
  'tr.notes': ['ნოტები', 'Notes'], 'tr.meter': ['ზომა', 'Time signature'], 'tr.unplay': ['ფანდურზე არ იკვრება', 'Not playable on the panduri'],
  'tr.none': ['ნოტი ვერ ვიპოვე. სცადე სხვა დიაპაზონი, ან ჯერ ინსტრუმენტებად დაყავი.', 'No notes found. Try another range, or split the instruments first.'],
  'tr.vStaff': ['სანოტო', 'Staff'], 'tr.vRoll': ['პიანო', 'Piano roll'], 'tr.vLet': ['ასოები', 'Letters'], 'tr.vSol': ['სოლფეჯიო', 'Solfège'], 'tr.vNum': ['ციფრები', 'Numbers'], 'tr.vTab': ['ტაბი', 'Panduri tab'],
  'tr.onNeck': ['ნოტი ფანდურზე', 'Note on the neck'], 'tr.onNeckD': ['დაკვრისას გრიფზე აკორდის ნაცვლად მიმდინარე ნოტი ჩანს', 'During playback the neck shows the current note instead of the chord'],
  'tr.conf': ['სანდოობა', 'Confidence'], 'tr.cHigh': ['მაღალი', 'high'], 'tr.cMid': ['საშუალო', 'medium'], 'tr.cLow': ['დაბალი', 'low'],
  'tr.unsure': ['ზუსტად ვერ განვსაზღვრე — შეგიძლია ხელით შეცვალო', 'Could not be determined with confidence — you can set it by hand'],
  'tr.alt': ['სხვა შესაძლო წაკითხვა', 'Another possible reading'], 'tr.bar': ['ტაქტი {n}', 'Bar {n}'],
  'tr.exp': ['შენახვა', 'Export'], 'tr.expMidi': ['MIDI', 'MIDI'], 'tr.expXml': ['MusicXML', 'MusicXML'], 'tr.expJson': ['JSON', 'JSON'], 'tr.expTab': ['ტაბი (ტექსტი)', 'Tab (text)'], 'tr.expPdf': ['ბეჭდვა · PDF', 'Print · PDF'],
  'tr.expNote': ['MIDI-ში ფანდურის სიმი და ლადი არ ინახება — ისინი JSON-სა და ტაბშია.', 'MIDI does not carry the panduri string and fret — those are in the JSON and in the tab.'],
  'tr.est': ['ეს AI-ის გაზომვაა და არა დადასტურებული ნოტაცია. სანდოობა ყოველ ნოტზე წერია; შეამოწმე ყურით.', 'This is what the AI measured, not a verified score. Every note carries its confidence; check it by ear.'],
  'tr.oct': ['ოქტავით {d}: {n}', 'octave {d}: {n}'], 'tr.sections': ['ნაწილები', 'Parts'], 'tr.part': ['ნაწილი {n}', 'Part {n}'],
  'tr.secNote': ['ნაწილები იქ იყოფა, სადაც მუსიკა იცვლება. სახელებს არ ვარქმევ — აუდიო არ ამბობს, რომელია მისამღერი.', 'The parts are cut where the music changes. They are not named — the audio does not say which one is a chorus.'],
  'tr.solo': ['მელოდიური', 'melodic'], 'tr.soloD': ['„მელოდიური“ იქ წერია, სადაც ნოტები სხვაგანზე ბევრად ხშირია — ეს გაზომილი სიხშირეა და არა დადასტურებული სოლო. ფრჩხილებში ნოტია წამში.', '"Melodic" marks the parts where the notes come much thicker than elsewhere — that is a measured density, not a verified solo. In brackets: notes per second.'],
  'tr.nps': ['{n} ნოტი/წმ', '{n} notes/s'],
  'tr.tempoAlt': ['ასევე შეიძლება წაიკითხო როგორც {n} BPM', 'Can also be read as {n} BPM'],
  'tr.pos': ['{s} სიმი · {f} ლადი', 'string {s} · fret {f}'], 'tr.open': ['ღია', 'open'], 'tr.nope': ['ვერ იკვრება', 'not playable'],
  'tr.zoom': ['მასშტაბი', 'Zoom'], 'tr.follow': ['თან მიჰყვება', 'Follow'],
  'tr.edit': ['შესწორება', 'Correct'], 'tr.editD': ['შესწორებისას შეეხე ნოტს და შეცვალე სიმაღლე, სიმი ან ლადი', 'In correct mode, tap a note to change its pitch, string or fret']
});
PD.aimus.panel = function (o) {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, A = PD.aimus;
  const SCOL = { 1: '#D9783F', 2: '#78B7DE', 3: '#EFE0B8' }, clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const el = h('section', { class: 'ai-trans' });
  let M = o.saved || null, busy = null, view = PD.store.get('tr.view', 'roll'), onNeck = PD.store.get('tr.neck', true);
  let cur = -1, px = PD.store.get('tr.zoom', 90), follow = true, editMode = false, edBox = null;
  const RANGES = { mel: [55, 84], high: [64, 93], low: [36, 64] };
  let range = PD.store.get('tr.range', 'mel'), src = 'orig';

  /* ---------------- the ask ---------------- */
  function head() {
    const box = h('div', { class: 'ai-trhead' });
    const srcSel = h('div', { class: 'seg' });
    const stems = (o.stemNames && o.stemNames()) || [];
    [['orig', t('tr.srcOrig')]].concat(stems.map(s => [s, t('ai.' + s) || s])).forEach(([k, lab]) => srcSel.append(h('button', { class: 'seg-b' + (src === k ? ' on' : ''), text: lab, onclick: () => { src = k; render(); } })));
    const rgSel = h('div', { class: 'seg' });
    [['mel', 'tr.rMel'], ['high', 'tr.rHigh'], ['low', 'tr.rLow']].forEach(([k, lab]) => rgSel.append(h('button', { class: 'seg-b' + (range === k ? ' on' : ''), text: t(lab), onclick: () => { range = k; PD.store.set('tr.range', k); render(); } })));
    box.append(h('p', { class: 'muted', 'data-t': 'tr.lead' }),
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('tr.src') }), h('div', { class: 'ai-tc' }, [srcSel])]),
      h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('tr.range') }), h('div', { class: 'ai-tc' }, [rgSel])]),
      h('button', { class: 'btn primary', text: M ? t('tr.redo') : t('tr.run'), onclick: run }));
    return box;
  }
  async function run() {
    if (busy) return;
    const st = h('div', { class: 'ai-status' }), lab = h('span', { text: t('tr.working') }), bar = h('i');
    const stop = h('button', { class: 'btn small ghost', text: t('tr.cancel'), onclick: () => { if (busy && busy.cancel) busy.cancel(); busy = null; render(); } });
    st.append(lab, h('div', { class: 'hx-bar' }, [bar]), stop);
    el.innerHTML = ''; el.append(title(), st);
    let mono, off = 0;
    try { const g = await o.getMono(src); mono = g.mono || g; off = g.offset || 0; } catch (e) { st.textContent = t('ai.bad'); busy = null; return; }
    const [lo, hi] = RANGES[range] || RANGES.mel;
    let tr;
    try {
      busy = A.transcribeAsync(mono, 22050, { lo, hi }, p => { bar.style.width = Math.round(p * 94) + '%'; });
      tr = await busy;
    } catch (e) {
      try { tr = await A.transcribe(mono, 22050, { lo, hi }, p => { bar.style.width = Math.round(p * 94) + '%'; }); } catch (e2) { busy = null; st.textContent = t('ai.bad'); return; }
    }
    if (busy === null) return;                       // stopped by the user
    busy = null;
    if (off) tr.notes.forEach(n => { n.t0 = +(n.t0 + off).toFixed(3); n.t1 = +(n.t1 + off).toFixed(3); });
    const R = o.res, beats = R.beats || [];
    const mt = A.metre(beats, tr.flux, tr.dt, tr.t0off + off, R.chords);
    A.quantise(tr.notes, beats, mt); A.mapNotes(tr.notes);
    M = { notes: tr.notes, metre: mt, bpm: R.bpm, key: Object.assign({}, R.key, { conf: +(R.key.s || 0).toFixed(2) }),
      beats, dur: R.dur, src, range, sections: off ? [] : A.sections(tr.chroma, tr.dt, tr.t0off, beats, R.dur),
      chords: (R.chords || []).map(c => ({ t0: c.t0, t1: c.t1, name: c.root >= 0 ? PD.ai.cname(c.root, c.q) : null })) };
    o.save && o.save(M);
    cur = -1; render();
  }
  const title = () => h('div', { class: 'row pg-head' }, [h('h2', { 'data-t': 'tr.title', style: 'margin:0' }), h('span', { class: 'ai-badge', text: 'AI' })]);

  /* ---------------- facts ---------------- */
  function cClass(c) { return c >= .66 ? 'hi' : c >= .4 ? 'mid' : 'lo'; }
  function cWord(c) { return t(c >= .66 ? 'tr.cHigh' : c >= .4 ? 'tr.cMid' : 'tr.cLow'); }
  function facts() {
    const box = h('div', { class: 'ai-facts tr-facts' });
    const mt = M.metre, bad = M.notes.filter(n => !n.reach).length;
    const mSel = h('select', { class: 'tr-sel', onchange: e => { const [n, d] = e.target.value.split('/').map(Number); M.metre = Object.assign({}, M.metre, { num: n, den: d, beatsPerBar: d === 8 ? n / 3 : n, compound: d === 8, byHand: true, unsure: false }); A.quantise(M.notes, M.beats, M.metre); A.mapNotes(M.notes); o.save && o.save(M); o.onMetre && o.onMetre(M.metre); render(); } });
    const opts = [[mt.num, mt.den]].concat([[2, 4], [3, 4], [4, 4], [6, 8], [9, 8], [12, 8]].filter(([n, d]) => !(n === mt.num && d === mt.den)));
    opts.forEach(([n, d]) => mSel.append(h('option', { value: n + '/' + d, text: n + '/' + d, selected: n === mt.num && d === mt.den })));
    box.append(h('div', { class: 'ai-fact' }, [h('small', { text: t('tr.meter') }), mSel, h('em', { class: 'tr-c ' + cClass(mt.byHand ? 1 : mt.conf), text: mt.byHand ? '✓' : cWord(mt.conf) })]));
    box.append(h('div', { class: 'ai-fact' }, [h('small', { text: t('ai.bpm') }), h('b', { text: Math.round(M.bpm) + ' BPM' }),
      h('em', { class: 'tr-alt', text: t('tr.tempoAlt', { n: A.tempoAlts(M.bpm).filter(x => x.role !== 'main').map(x => x.bpm).join(' / ') }) })]));
    box.append(h('div', { class: 'ai-fact' }, [h('small', { text: t('ai.key') }), h('b', { text: PD.ai.cname(M.key.r, M.key.q) }), h('em', { class: 'tr-c ' + cClass(M.key.conf), text: cWord(M.key.conf) })]));
    box.append(h('div', { class: 'ai-fact' }, [h('small', { text: t('tr.notes') }), h('b', { text: String(M.notes.length) }),
      bad ? h('em', { class: 'tr-c lo', text: bad + ' · ' + t('tr.unplay') }) : h('em', { class: 'tr-c hi', text: '✓ ' + t('x3p.string') })].filter(Boolean)));
    return box;
  }

  /* ---------------- views ---------------- */
  const noteLabel = n => view === 'sol' ? A.solfegeOf(n.m, M.key, PD.i18n.lang !== 'ka') : view === 'num' ? A.degreeOf(n.m, M.key) : A.spell(n.m, M.key).name;
  const posLabel = n => !n.reach ? t('tr.nope') : (n.f === 0 ? TH.stringName(n.s) + ' · ' + t('tr.open') : TH.stringName(n.s) + ' · ' + n.f);

  /* piano roll: a window that follows the player; drag to scrub, tap a note to go there */
  function rollView() {
    const cv = h('canvas', { class: 'tr-roll' }), wrap = h('div', { class: 'tr-rollwrap' }, [cv]);
    const zm = h('div', { class: 'ai-tc' }, [h('button', { class: 'btn small', text: '−', onclick: () => { px = Math.max(30, px / 1.4); PD.store.set('tr.zoom', px); draw(); } }),
      h('button', { class: 'btn small', text: '+', onclick: () => { px = Math.min(400, px * 1.4); PD.store.set('tr.zoom', px); draw(); } })]);
    let W = 10, H = 190, dpr = 1, vLo = null, vHi = null;
    function size() { const r = wrap.getBoundingClientRect(); W = Math.max(10, r.width); dpr = Math.min(2, devicePixelRatio || 1); cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; }
    function draw() {
      if (!cv.isConnected) return; size();
      const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
      const p = o.pos(), t0 = p - W / px * .35, t1 = t0 + W / px;
      const near = M.notes.filter(n => n.t1 > t0 - 6 && n.t0 < t1 + 6).map(n => n.m), all = M.notes.map(n => n.m);
      const ms = (near.length ? near : all).slice().sort((a, b) => a - b);
      let lo = ms[Math.floor(ms.length * .02)] - 2, hi = ms[Math.floor(ms.length * .98)] + 2;
      if (hi - lo < 14) { const c = (hi + lo) / 2; lo = c - 7; hi = c + 7; }
      if (vLo == null) { vLo = lo; vHi = hi; } else { vLo += (lo - vLo) * .12; vHi += (hi - vHi) * .12; }   // the window glides instead of jumping
      lo = vLo; hi = vHi; const span = Math.max(8, hi - lo);
      const X = tt => (tt - t0) * px, Y = m => H - 10 - (m - lo) / span * (H - 20), rh = Math.max(4, (H - 20) / span - 1);
      // the bars of the song
      (M.beats || []).forEach((b, k) => { if (b < t0 - 1 || b > t1 + 1) return; const g = M.metre.beatsPerBar || 4, one = (((k - (M.metre.phase || 0)) % g) + g) % g === 0; x.fillStyle = one ? 'rgba(255,244,230,.26)' : 'rgba(255,244,230,.08)'; x.fillRect(X(b), 0, 1, H); });
      M.notes.forEach((n, i) => {
        if (n.t1 < t0 || n.t0 > t1) return;
        const a = X(n.t0), w = Math.max(3, (n.t1 - n.t0) * px - 1), y = Y(n.m);
        x.globalAlpha = .35 + .65 * n.conf;
        x.fillStyle = !n.reach ? 'rgba(190,120,110,.9)' : (i === cur ? '#FFF4E6' : SCOL[n.s] || '#D9A25B');
        if (x.roundRect) { x.beginPath(); x.roundRect(a, y - rh / 2, w, rh, Math.min(4, rh / 2)); x.fill(); } else x.fillRect(a, y - rh / 2, w, rh);
        x.globalAlpha = 1;
        if (w > 26 && rh > 9) { x.fillStyle = '#17100A'; x.font = '700 ' + Math.min(12, rh - 1).toFixed(0) + "px 'Noto Sans Georgian', system-ui"; x.textBaseline = 'middle'; x.fillText(noteLabel(n), a + 3, y); }
      });
      x.fillStyle = '#F6C987'; x.fillRect(X(p) - 1, 0, 2, H);
      x.fillStyle = 'rgba(246,201,135,.9)'; x.beginPath(); x.moveTo(X(p) - 5, 0); x.lineTo(X(p) + 5, 0); x.lineTo(X(p), 7); x.fill();
    }
    cv.onpointerdown = e => {
      const r = cv.getBoundingClientRect(), p = o.pos(), t0 = p - W / px * .35, tt = t0 + (e.clientX - r.left) / px;
      const i = M.notes.findIndex(n => tt >= n.t0 - .04 && tt <= n.t1 + .04);
      if (i >= 0 && editMode) return edit(i);
      o.seek(tt);
    };
    const ro = new ResizeObserver(() => draw()); ro.observe(wrap);
    return { el: h('div', {}, [h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('tr.zoom') }), zm]), wrap]), draw, stop: () => ro.disconnect() };
  }

  /* staff, letters, solfège, numbers and tab are all written bar by bar */
  function barsOf() {
    const by = {}; M.notes.forEach((n, i) => { const b = Math.max(1, n.bar || 1); (by[b] = by[b] || []).push(Object.assign({ i }, n)); });
    return Object.keys(by).map(Number).sort((a, b) => a - b).map(b => ({ b, ns: by[b].sort((p, q) => p.t0 - q.t0) }));
  }
  function staffView() {
    const box = h('div', { class: 'tr-sheet' }), per = innerWidth < 560 ? 2 : 4, bars = barsOf();
    for (let i = 0; i < bars.length; i += per) {
      const chunk = bars.slice(i, i + per), gap = 46, x0 = 74; let x = x0; const ns = [], lines = [];
      chunk.forEach(c => { c.ns.forEach(n => { const sp = A.spell(n.m, M.key); ns.push({ l: sp.l, o: sp.o, acc: sp.acc || '', d: (n.val || 'q').replace(/3$/, '').replace('.', ''), dot: /\./.test(n.val || ''), x: x, label: n.reach ? (n.f === 0 ? '0' : String(n.f)) : '×', col: n.reach ? (SCOL[n.s] || null) : '#C98A80', idx: n.i }); x += gap; }); lines.push(x - gap / 2); x += 12; });
      const W = Math.max(300, x + 16);
      const svg = h('div', { class: 'tr-sys', html: PD.notesArt.staff(ns, { width: W, height: 150, time: i === 0 ? [M.metre.num, M.metre.den] : null, bars: lines.slice(0, -1), end: i + per >= bars.length, label: 'notes' }) });
      svg.dataset.from = chunk[0].b; svg.dataset.to = chunk[chunk.length - 1].b;
      svg.prepend(h('small', { class: 'tr-barn', text: t('tr.bar', { n: chunk[0].b }) }));
      box.append(svg);
    }
    return { el: box, draw() {}, stop() {} };
  }
  function listView() {
    const box = h('div', { class: 'tr-list' });
    barsOf().forEach(c => {
      const row = h('div', { class: 'tr-brow' }, [h('small', { class: 'tr-bn', text: String(c.b) })]);
      c.ns.forEach(n => row.append(h('button', { class: 'tr-n' + (n.reach ? '' : ' bad'), 'data-i': n.i, style: n.reach ? '--sc:' + (SCOL[n.s] || '#D9A25B') : '', onclick: () => editMode ? edit(n.i) : o.seek(n.t0) },
        [h('b', { text: noteLabel(n) }), h('small', { text: posLabel(n) })])));
      box.append(row);
    });
    return { el: box, draw() {}, stop() {} };
  }
  function tabView() {
    const box = h('div', { class: 'tr-tab' }), per = 2, bars = barsOf(), g = M.metre.beatsPerBar || 4, cells = Math.max(8, g * 2);
    for (let i = 0; i < bars.length; i += per) {
      const chunk = bars.slice(i, i + per), sys = h('div', { class: 'tr-tsys' });
      [3, 2, 1].forEach(s => {
        const line = h('div', { class: 'tr-tline' }, [h('i', { class: 'tr-ts', style: 'color:' + SCOL[s], text: TH.stringName(s) })]);
        chunk.forEach(c => {
          const cellsEl = []; for (let k = 0; k < cells; k++) cellsEl.push(h('u', { text: '–' }));
          c.ns.forEach(n => { const k = Math.max(0, Math.min(cells - 1, Math.round((n.beat - 1) * 2))); if (!n.reach) { if (s === 3) cellsEl[k] = h('u', { class: 'bad', text: '×', 'data-i': n.i }); return; } if (n.s === s) cellsEl[k] = h('u', { class: 'on', text: String(n.f), 'data-i': n.i, style: 'color:' + SCOL[s], onclick: () => editMode ? edit(n.i) : o.seek(n.t0) }); });
          line.append(h('div', { class: 'tr-tbar' }, cellsEl));
        });
        sys.append(line);
      });
      sys.append(h('div', { class: 'tr-tnums' }, chunk.map(c => h('small', { text: t('tr.bar', { n: c.b }) }))));
      box.append(sys);
    }
    return { el: box, draw() {}, stop() {} };
  }

  /* ---------------- correcting one note ---------------- */
  function reMap(n) { const ps = A.places(n.m); if (!ps.length) { n.reach = false; n.s = 0; n.f = -1; n.alt = []; n.octave = null; } else { n.reach = true; n.s = ps[0].s; n.f = ps[0].f; n.fi = ps[0].fi; n.alt = ps.slice(1).map(p => ({ s: p.s, f: p.f })); } }
  function edit(i) {
    const n = M.notes[i]; if (!n) return;
    if (edBox) edBox.remove();
    const sp = A.spell(n.m, M.key);
    const row = h('div', { class: 'tr-ed-row' });
    const shift = d => { n.m = clamp(n.m + d, 21, 108); reMap(n); o.save && o.save(M); render(); edit(i); };
    row.append(h('button', { class: 'btn small', text: '−1', onclick: () => shift(-1) }), h('button', { class: 'btn small', text: '+1', onclick: () => shift(1) }),
      h('button', { class: 'btn small', text: '−8va', onclick: () => shift(-12) }), h('button', { class: 'btn small', text: '+8va', onclick: () => shift(12) }),
      h('button', { class: 'btn small ghost', text: '▶', 'aria-label': t('tb.play'), onclick: () => { try { PD.audio.ensure(); if (n.reach) PD.audio.note(n.s, n.f, { vel: .7 }); } catch (_) {} } }));
    const pos = h('div', { class: 'tr-ed-row' });
    const ps = A.places(n.m);
    if (ps.length) ps.forEach(p => pos.append(h('button', { class: 'chip' + (p.s === n.s && p.f === n.f ? ' on' : ''), text: TH.stringName(p.s) + ' · ' + (p.f === 0 ? t('tr.open') : p.f), onclick: () => { n.s = p.s; n.f = p.f; n.fi = p.fi; n.alt = ps.filter(q => q !== p).map(q => ({ s: q.s, f: q.f })); o.save && o.save(M); render(); edit(i); } })));
    else { const oc = n.octave || null; pos.append(h('small', { class: 'tr-c lo', text: t('tr.nope') })); if (oc) pos.append(h('button', { class: 'chip', text: t('tr.oct', { d: oc.shift > 0 ? '+1' : '−1', n: A.spell(oc.m, M.key).name }), onclick: () => shift(oc.shift) })); }
    edBox = h('div', { class: 'tr-ed' }, [
      h('div', { class: 'tr-ed-h' }, [h('b', { text: sp.name }), h('small', { text: t('tr.bar', { n: n.bar }) + ' · ' + n.val + ' · ' + t('tr.conf') + ' ' + cWord(n.conf) }),
        h('button', { class: 'btn small ghost', text: '✕', 'aria-label': t('close'), onclick: () => { edBox.remove(); edBox = null; } })]),
      row, pos,
      h('button', { class: 'btn small ghost', text: t('delete') || '✕', onclick: () => { M.notes.splice(i, 1); o.save && o.save(M); edBox = null; render(); } })]);
    el.append(edBox); PD.i18n.apply(edBox); edBox.scrollIntoView({ block: 'nearest' });
  }

  /* ---------------- export ---------------- */
  function dl(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  function exports() {
    const base = (o.name || 'song').replace(/\.[^.]+$/, '');
    const row = h('div', { class: 'ai-tc' }, [
      h('button', { class: 'btn small', text: t('tr.expMidi'), onclick: () => dl(A.midiFile(M), base + '.mid') }),
      h('button', { class: 'btn small', text: t('tr.expXml'), onclick: () => dl(A.musicXML(M, base), base + '.musicxml') }),
      h('button', { class: 'btn small', text: t('tr.expTab'), onclick: () => dl(new Blob([A.tabText(M, base)], { type: 'text/plain' }), base + ' — ფანდური.txt') }),
      h('button', { class: 'btn small', text: t('tr.expJson'), onclick: () => dl(A.jsonOf(M, base), base + '.json') }),
      h('button', { class: 'btn small ghost', text: t('tr.expPdf'), onclick: () => window.print() })]);
    return h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('tr.exp') }), row, h('small', { class: 'muted', text: t('tr.expNote') })]);
  }

  /* ---------------- render ---------------- */
  let V = null;
  function render() {
    if (V && V.stop) V.stop();
    el.innerHTML = ''; el.append(title());
    if (!M) { el.append(head()); PD.i18n.apply(el); return; }
    el.append(facts());
    if (!M.notes.length) { el.append(h('p', { class: 'notice', text: t('tr.none') }), head()); PD.i18n.apply(el); return; }
    if (M.metre.unsure && !M.metre.byHand) el.append(h('p', { class: 'notice', text: t('tr.unsure') }));
    const tabs = h('div', { class: 'tabs tr-tabs' });
    [['staff', 'tr.vStaff'], ['roll', 'tr.vRoll'], ['let', 'tr.vLet'], ['sol', 'tr.vSol'], ['num', 'tr.vNum'], ['tab', 'tr.vTab']].forEach(([k, lab]) =>
      tabs.append(h('button', { class: 'tab' + (view === k ? ' on' : ''), text: t(lab), onclick: () => { view = k; PD.store.set('tr.view', k); render(); } })));
    el.append(tabs);
    V = view === 'roll' ? rollView() : view === 'staff' ? staffView() : view === 'tab' ? tabView() : listView();
    el.append(V.el);
    const nk = h('button', { class: 'ai-tg', 'aria-pressed': String(onNeck), onclick: () => { onNeck = !onNeck; PD.store.set('tr.neck', onNeck); nk.setAttribute('aria-pressed', String(onNeck)); cur = -1; o.invalidate && o.invalidate(); } }, [h('span', { text: '🪕' }), h('span', { text: t('tr.onNeck') })]);
    const ed = h('button', { class: 'ai-tg', 'aria-pressed': String(editMode), onclick: () => { editMode = !editMode; ed.setAttribute('aria-pressed', String(editMode)); el.classList.toggle('editing', editMode); if (!editMode && edBox) { edBox.remove(); edBox = null; } } }, [h('span', { text: '✎' }), h('span', { text: t('tr.edit') })]);
    el.classList.toggle('editing', editMode);
    el.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('tr.follow') }), h('div', { class: 'ai-tc' }, [nk, ed]), h('small', { class: 'muted', text: t('tr.onNeckD') + ' · ' + t('tr.editD') })]));
    if (M.sections && M.sections.length) {
      // how thick the melody runs in each part — measured, so a part can be called melodic without naming it a solo
      const dens = M.sections.map(s => { const n = M.notes.filter(x => x.t0 >= s.t0 && x.t0 < s.t1).length; return s.t1 > s.t0 ? n / (s.t1 - s.t0) : 0; });
      const sorted = dens.slice().sort((a, b) => a - b), mid = sorted[sorted.length >> 1] || 0;
      const row = h('div', { class: 'ai-tc' });
      M.sections.forEach((s, i) => { const hot = mid > 0 && dens[i] >= mid * 1.35;
        row.append(h('button', { class: 'chip' + (hot ? ' on' : ''), onclick: () => o.seek(s.t0 + .02) },
          [h('span', { text: t('tr.part', { n: s.n }) + ' · ' + PD.fmtTime(s.t0) }), h('em', { class: 'tr-solo', text: ' ' + (hot ? t('tr.solo') + ' ' : '') + '(' + dens[i].toFixed(1) + ')' })])); });
      el.append(h('div', { class: 'ai-tool' }, [h('span', { class: 'ai-tl', text: t('tr.sections') }), row, h('small', { class: 'muted', text: t('tr.secNote') + ' ' + t('tr.soloD') })]));
    }
    el.append(exports(), h('p', { class: 'notice', text: t('tr.est') }), h('details', { class: 'ai-det' }, [h('summary', { text: t('tr.redo') }), head()]));
    PD.i18n.apply(el);
    V.draw && V.draw();
  }
  render();

  /* ---------------- follows the player ---------------- */
  let lastCur = -2;
  function tick(p) {
    if (!M || !M.notes.length) return;
    let i = -1;
    for (let k = 0; k < M.notes.length; k++) { const n = M.notes[k]; if (p >= n.t0 && p < n.t1) { i = k; break; } if (n.t0 > p) break; }
    cur = i;
    if (V && V.draw && view === 'roll') V.draw();
    if (i !== lastCur) {
      lastCur = i;
      el.querySelectorAll('.now').forEach(x => x.classList.remove('now'));
      if (i >= 0) { const node = el.querySelector('[data-i="' + i + '"]'); if (node) { node.classList.add('now'); if (follow && node.scrollIntoView) node.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } }
      if (onNeck && o.neck) { const n = i >= 0 ? M.notes[i] : null; o.neck.setTarget(n && n.reach ? [{ s: n.s, f: n.f, fi: n.fi || 0 }] : [], []); }
    }
  }
  /** the studio re-tracked the beats: the bars, the beats and the written values follow */
  function regrid(beats, bpm) {
    if (!M || !M.notes.length) return;
    M.beats = beats; M.bpm = bpm;
    A.quantise(M.notes, beats, M.metre); o.save && o.save(M); cur = -1; lastCur = -2; render();
  }
  return { el, tick, regrid, ownsNeck: () => !!(onNeck && M && M.notes.length), get data() { return M; }, destroy() { if (busy && busy.cancel) busy.cancel(); if (V && V.stop) V.stop(); } };
};
