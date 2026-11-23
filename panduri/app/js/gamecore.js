/* =====================================================================
   Games — the rules without a screen: charts, matching, scoring,
   progress, achievements, daily challenge, challenge codes and the
   session state machine. Pure functions (no DOM, no audio), so every
   rule is checked in Node: qa/games-core.cjs.
   Honesty rules, the same as the lesson engine's:
   · a note the microphone did not hear clearly is "unsure" — never a
     mistake and never points;
   · a wrong note is only called wrong when the reading is confident;
   · stroke direction (↓/↑) is not judged — sound cannot tell it;
   · every pitch comes from the instrument profile (PD.theory.midi).
   ===================================================================== */
PD.gameCore = (() => {
  const TH = () => PD.theory;

  /* ---------- deterministic randomness: one seed, one chart ---------- */
  function hash(s) { s = String(s); let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function rng(seed) {
    let a = (typeof seed === 'number' ? seed : hash(seed)) >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let x = a; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  }
  const pickOf = (r, a) => a[Math.floor(r() * a.length) % a.length];

  /* ---------- difficulty: timing windows (s), pitch tolerance (cents), fall time (s) ---------- */
  const DIFF = {
    easy: { id: 'easy', perfect: .07, great: .12, good: .19, win: .26, cents: 45, lead: 2.4 },
    normal: { id: 'normal', perfect: .05, great: .095, good: .15, win: .22, cents: 38, lead: 2.0 },
    hard: { id: 'hard', perfect: .035, great: .07, good: .115, win: .18, cents: 32, lead: 1.7 },
    expert: { id: 'expert', perfect: .025, great: .05, good: .085, win: .14, cents: 26, lead: 1.45 }
  };
  const DIFFS = ['easy', 'normal', 'hard', 'expert'];
  const diff = id => DIFF[id] || DIFF.normal;

  /* ---------- grades ---------- */
  const GRADES = ['perfect', 'great', 'good'];
  const WEIGHT = { perfect: 1, great: .8, good: .5, miss: 0 };
  const POINTS = { perfect: 100, great: 75, good: 40 };
  const timingGrade = (off, D) => { const a = Math.abs(off) - 1e-9; return a <= D.perfect ? 'perfect' : a <= D.great ? 'great' : a <= D.good ? 'good' : null; };
  const pitchGrade = (c, tol) => { const a = Math.abs(c) - 1e-6; return a <= tol * .5 ? 'perfect' : a <= tol * .8 ? 'great' : a <= tol ? 'good' : null; };
  const worse = (a, b) => GRADES[Math.max(GRADES.indexOf(a), GRADES.indexOf(b))];
  /* The grade of a right note is its timing (Perfect = the right note on time; Great and Good = further off).
     Pitch decides right or wrong; only a note near the edge of the tolerance is held to Great. A plucked string is
     sharpest in its first ~0.2 s, which is when the detector reads it: the teacher's recorded open A string, about
     8 cents sharp when it settles, reads 26 cents sharp there (qa/games-mic.cjs). Grading pitch finely would cost the
     bass string its Perfects for its own physics. */
  const gradeOf = (tg, cents, tol) => tg === 'perfect' && Math.abs(cents) > tol * .8 ? 'great' : tg;
  /** combo multiplier: ×1, ×2 from 10, ×3 from 25, ×4 from 50 */
  const mult = c => c >= 50 ? 4 : c >= 25 ? 3 : c >= 10 ? 2 : 1;

  /** a heard note against the expected pitch. ok, or why not: unsure · octave · sharp · flat · semitone · wrong */
  function judgePitch(exp, ev, tol) {
    if (!ev || ev.unsure || !(ev.conf >= .55) || !isFinite(ev.midi)) return { ok: false, kind: 'unsure' };
    const d = ev.midi - exp, c = d * 100;
    if (Math.abs(c) <= tol + 1e-6) return { ok: true, cents: c };
    if (Math.abs(Math.abs(d) - 12) < .35) return ev.conf < .8 ? { ok: false, kind: 'unsure' } : { ok: false, kind: 'octave', dir: Math.sign(d), cents: c };
    if (ev.conf < .72) return { ok: false, kind: 'unsure' };
    if (Math.abs(c) <= 70) return { ok: false, kind: c > 0 ? 'sharp' : 'flat', cents: c };
    if (Math.abs(Math.abs(d) - 1) < .35) return { ok: false, kind: 'semitone', dir: Math.sign(d), cents: c };
    return { ok: false, kind: 'wrong', cents: c };
  }

  /* ---------- score keeping ---------- */
  function scorer() {
    const s = { score: 0, combo: 0, maxCombo: 0, perfect: 0, great: 0, good: 0, miss: 0, unsure: 0, extra: 0, offs: [], cents: [], wrong: 0, acc: { ok: 0, n: 0 } };
    return {
      s,
      hit(g, off, cents, bonus) { s[g]++; s.combo++; if (s.combo > s.maxCombo) s.maxCombo = s.combo; if (off != null) s.offs.push(off); if (cents != null) s.cents.push(cents); const p = Math.round(((POINTS[g] || 0) + (bonus || 0)) * mult(s.combo)); s.score += p; return p; },
      miss(wrong) { s.miss++; s.combo = 0; if (wrong) s.wrong++; },
      unsure() { s.unsure++; },
      extra() { s.extra++; },
      accent(ok) { if (ok == null) return; s.acc.n++; if (ok) s.acc.ok++; }
    };
  }
  /** the result of a round. total = notes in the chart. Accuracy leaves out notes not heard clearly; when most
      notes were not heard the round earns no stars and is not called failed (the microphone was the problem) */
  function result(s, total, D) {
    const judged = s.perfect + s.great + s.good + s.miss, hits = s.perfect + s.great + s.good;
    const acc = judged ? (s.perfect * WEIGHT.perfect + s.great * WEIGHT.great + s.good * WEIGHT.good) / judged : null;
    const heard = total ? judged / total : 0;
    const lowHeard = total > 0 && heard < .5;
    const stars = lowHeard || acc == null ? 0 : acc >= .9 ? 3 : acc >= .75 ? 2 : acc >= .5 ? 1 : 0;
    const mean = s.offs.length ? s.offs.reduce((a, b) => a + b, 0) / s.offs.length : null;
    const sd = s.offs.length > 1 ? Math.sqrt(s.offs.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (s.offs.length - 1)) : null;
    const timing = s.offs.length && D ? s.offs.reduce((a, o) => a + Math.max(0, 1 - Math.abs(o) / D.good), 0) / s.offs.length : null;
    return {
      score: s.score, acc, stars, hits, judged, total, heard, lowHeard, passed: stars >= 1,
      perfect: s.perfect, great: s.great, good: s.good, miss: s.miss, unsure: s.unsure, extra: s.extra, wrong: s.wrong, maxCombo: s.maxCombo,
      pitchAcc: judged ? hits / judged : null, timing, meanOff: mean, sdOff: sd,
      accentAcc: s.acc.n ? s.acc.ok / s.acc.n : null, accentN: s.acc.n,
      centsMean: s.cents.length ? s.cents.reduce((a, b) => a + Math.abs(b), 0) / s.cents.length : null
    };
  }

  /* ---------- Note Rush: matching heard notes to the chart ----------
     chart: [{ t (song s), midi }] sorted. A heard note belongs to the nearest unjudged note within the window whose
     pitch it matches; failing that, a confident wrong pitch counts against the nearest note. A note becomes a miss once
     its window has passed — after a grace for the detector, which reports a pitch ~0.13–0.28 s after the stroke. */
  const GRACE = .32;
  function noteMatcher(chart, D, sc) {
    const st = chart.map(() => ({ res: null, uns: false }));
    let first = 0, pend = [];   // strokes heard whose pitch is still on its way
    const live = t => { const out = []; for (let i = first; i < chart.length; i++) { const dt = t - chart[i].t; if (dt < -D.win) break; if (!st[i].res && dt <= D.win) out.push(i); } return out; };
    return {
      st,
      /** a stroke was heard at song time t: its note may still be judged, so its neighbours wait for the pitch */
      onset(t) { pend.push(t); },
      /** ev: { t (song s), midi, conf, unsure } → { i, grade, off, cents, pts } | { i, miss, kind } | { unsure, i } | { extra } */
      input(ev) {
        pend = pend.filter(p => Math.abs(p - ev.t) > .002);
        const cand = live(ev.t);
        if (!cand.length) { sc.extra(); return { extra: true }; }
        const near = cand.slice().sort((a, b) => Math.abs(chart[a].t - ev.t) - Math.abs(chart[b].t - ev.t));
        for (const i of near) {
          const p = judgePitch(chart[i].midi, ev, D.cents);
          if (!p.ok) continue;
          const off = ev.t - chart[i].t, tg = timingGrade(off, D);
          if (!tg) { st[i].res = 'miss'; sc.miss(false); return { i, miss: true, kind: off < 0 ? 'early' : 'late', off }; }
          const g = gradeOf(tg, p.cents, D.cents);
          st[i].res = g; st[i].off = off; st[i].cents = p.cents;
          return { i, grade: g, off, cents: p.cents, pts: sc.hit(g, off, p.cents) };
        }
        const i = near[0], p = judgePitch(chart[i].midi, ev, D.cents);
        if (p.kind === 'unsure') { st[i].uns = true; return { unsure: true, i }; }
        st[i].res = 'miss'; st[i].kind = p.kind; st[i].heard = ev.midi; sc.miss(true);
        return { i, miss: true, kind: p.kind, cents: p.cents, heard: ev.midi };
      },
      /** song time now → notes that just became missed (or unsure). Nothing struck near a note: missed as soon as its
          window closes; a stroke near it whose pitch has not arrived yet: wait for the pitch */
      advance(t) {
        const out = [];
        pend = pend.filter(p => t - p < GRACE + .1);
        for (let i = first; i < chart.length; i++) {
          const n = chart[i], wait = pend.some(p => Math.abs(p - n.t) <= D.win) ? GRACE : .06;
          if (t - n.t <= D.win + wait) break;
          if (!st[i].res) { if (st[i].uns) { st[i].res = 'unsure'; sc.unsure(); out.push({ i, unsure: true }); } else { st[i].res = 'miss'; st[i].kind = 'none'; sc.miss(false); out.push({ i, miss: true, kind: 'none' }); } }
          first = i + 1;
        }
        return out;
      },
      done(t) { return !chart.length || (first >= chart.length && t - chart[chart.length - 1].t > D.win); }
    };
  }

  /* ---------- Rhythm Battle: matching strokes (onsets) ----------
     chart: [{ t, acc }]. Timing from the onset, accent from its strength relative to this player's recent strokes —
     the lesson engine's rule: clearly above the soft ones and nearer the loud ones. Direction is never judged. */
  function accentOf(hist, str) {
    if (hist.length < 3 || !str) return null;
    const so = hist.slice().sort((a, b) => a - b), lo = so[Math.floor(so.length * .2)], hi = so[Math.ceil(so.length * .8) - 1];
    return str > Math.max(lo * 1.35, Math.sqrt(lo * hi));
  }
  function rhythmMatcher(chart, D, sc) {
    const st = chart.map(() => ({ res: null })), hist = [];
    let first = 0, lastOn = -9, groupT = -9;
    // two strokes closer than two windows: each keeps half the gap, so a stroke can never be claimed by its neighbour
    const win = chart.map((x, i) => Math.min(D.win, i ? (x.t - chart[i - 1].t) / 2 : D.win, i < chart.length - 1 ? (chart[i + 1].t - x.t) / 2 : D.win));
    /* One stroke across three strings is several attacks: the teacher's recorded strums reach the E string 75–90 ms after
       the A string, which the detector (70 ms apart at least) reports as a second onset. Onsets that close belong to the
       stroke that began the group — never more than half the gap to the next written stroke, so two strokes never merge. */
    const minGap = chart.length > 1 ? Math.min(...chart.slice(1).map((x, i) => x.t - chart[i].t)) : 1;
    const SPREAD = Math.min(.11, minGap * .45), GROUP = Math.min(.2, minGap * .6);
    return {
      st,
      /** ev: { t, strength } → { i, grade, off, accOk, pts } | { i, miss, kind } | { extra } | { same } (the rest of a strum) */
      input(ev) {
        if (ev.t - lastOn < SPREAD && ev.t - groupT < GROUP) { lastOn = ev.t; return { same: true }; }
        lastOn = groupT = ev.t;
        let best = -1, bd = 1e9;
        for (let i = first; i < chart.length; i++) { const dt = ev.t - chart[i].t; if (-dt > D.win) break; if (!st[i].res && Math.abs(dt) <= win[i] && Math.abs(dt) < bd) { bd = Math.abs(dt); best = i; } }
        const str = ev.strength || 0, heardAcc = accentOf(hist, str);
        if (str) { hist.push(str); if (hist.length > 10) hist.shift(); }
        if (best < 0) { sc.extra(); return { extra: true }; }
        const off = ev.t - chart[best].t, tg = timingGrade(off, D);
        if (!tg) { st[best].res = 'miss'; sc.miss(false); return { i: best, miss: true, kind: off < 0 ? 'early' : 'late', off }; }
        const accOk = heardAcc == null ? null : heardAcc === !!chart[best].acc;
        sc.accent(accOk);
        st[best].res = tg; st[best].off = off; st[best].accOk = accOk;
        return { i: best, grade: tg, off, accOk, pts: sc.hit(tg, off, null, accOk ? 15 : 0) };
      },
      /* a stroke played exactly on a metronome click is held by the detector until pitched sound follows it
         (so the click itself never counts): its onset arrives up to ~0.28 s late, hence the wait before a miss */
      advance(t) {
        const out = [];
        for (let i = first; i < chart.length; i++) {
          if (t - chart[i].t <= win[i] + .3) break;
          if (!st[i].res) { st[i].res = 'miss'; sc.miss(false); out.push({ i, miss: true, kind: 'none' }); }
          first = i + 1;
        }
        return out;
      },
      done(t) { return !chart.length || (first >= chart.length && t - chart[chart.length - 1].t > D.win); }
    };
  }

  /* ---------- the notes a level uses: always from the instrument's own note map ---------- */
  const MAJOR = [0, 2, 4, 5, 7, 9, 11];
  /** every pitch reachable in frets [a, b], each with the position nearest the middle of that range (ties: lower fret) */
  function pool(frets, scaleRoot) {
    const T = TH(), S = PD.instrument.stringCount, mid = (frets[0] + frets[1]) / 2, by = new Map();
    for (let s = 1; s <= S; s++) for (let f = frets[0]; f <= frets[1]; f++) {
      const m = Math.round(T.midi(s, f));
      if (scaleRoot != null && !MAJOR.includes(((m - scaleRoot) % 12 + 12) % 12)) continue;
      const o = by.get(m), d = Math.abs(f - mid);
      if (!o || d < o.d - 1e-9 || (Math.abs(d - o.d) < 1e-9 && f < o.f)) by.set(m, { midi: m, s, f, d });
    }
    return [...by.values()].sort((a, b) => a.midi - b.midi).map(({ midi, s, f }) => ({ midi, s, f }));
  }
  const A_ROOT = 9;   // A: the key of the open strings A · C♯ · E (they form its major triad)

  /* Note Rush levels. The note material is the instrument's (computed positions); the patterns are ordinary practice
     patterns (scale steps, runs, arpeggios) — not the teacher's curriculum. */
  const RUSH = [
    { id: 1, key: 'open', bpm: 66, frets: [0, 0], n: 24, pat: 'free' },
    { id: 2, key: 'first', bpm: 70, frets: [0, 2], n: 28, pat: 'free', scale: true },
    { id: 3, key: 'pos1', bpm: 76, frets: [0, 4], n: 32, pat: 'scale', scale: true },
    { id: 4, key: 'melodic', bpm: 80, frets: [0, 4], n: 32, pat: 'runs', scale: true },
    { id: 5, key: 'rhythm', bpm: 72, frets: [0, 4], n: 36, pat: 'runs', scale: true, rhythm: true },
    { id: 6, key: 'pos5', bpm: 80, frets: [3, 7], n: 36, pat: 'runs', scale: true },
    { id: 7, key: 'leaps', bpm: 84, frets: [0, 7], n: 36, pat: 'arps', scale: true, rhythm: true },
    { id: 8, key: 'adv', bpm: 92, frets: [0, 12], n: 40, pat: 'mix', scale: true, rhythm: true },
    { id: 9, key: 'expert', bpm: 104, frets: [0, 17], n: 48, pat: 'mix', rhythm: true }
  ];
  const TRIADS = [[9, 1, 4], [2, 6, 9], [4, 8, 11]];   // pitch classes of A · D · E, the I, IV and V of A
  /** a melodic line of n pitches (indices into a pool sorted low → high) */
  function line(P, n, pat, r) {
    const out = []; let i = Math.floor(r() * P.length);
    const clampI = k => Math.max(0, Math.min(P.length - 1, k));
    while (out.length < n) {
      const kind = pat === 'mix' ? pickOf(r, ['runs', 'runs', 'arps', 'free']) : pat;
      if (kind === 'free' || P.length < 3) {   // a small step or the same note — never three of one note in a row
        let j = clampI(i + Math.round((r() - .5) * 4));
        if (out.length >= 2 && out[out.length - 1] === j && out[out.length - 2] === j) j = j > 0 ? j - 1 : j + 1;
        i = clampI(j); out.push(i);
      } else if (kind === 'scale' || kind === 'runs') {   // steps of the scale, up or down
        const len = kind === 'scale' ? 4 + Math.floor(r() * 4) : 3 + Math.floor(r() * 3), dir = i > P.length * .6 ? -1 : i < P.length * .4 ? 1 : (r() < .5 ? -1 : 1);
        for (let k = 0; k < len && out.length < n; k++) { out.push(i); if (i + dir < 0 || i + dir >= P.length) break; i += dir; }
        i = clampI(i + (r() < .5 ? -2 : 2));
      } else {   // an arpeggio: three or four notes of one triad, rising or falling
        const pcs = pickOf(r, TRIADS), idx = [];
        P.forEach((p, k) => { if (pcs.includes(((p.midi % 12) + 12) % 12)) idx.push(k); });
        if (idx.length < 3) { out.push(i); i = clampI(i + 1); continue; }
        const len = Math.min(idx.length, 3 + Math.floor(r() * 2)); let s0 = idx.findIndex(k => k >= i); if (s0 < 0) s0 = idx.length - 1;
        const a = Math.max(0, Math.min(idx.length - len, s0 - 1)), seg = idx.slice(a, a + len);
        (r() < .5 ? seg : seg.reverse()).forEach(k => { if (out.length < n) out.push(k); });
        i = out[out.length - 1];
      }
    }
    return out.slice(0, n);
  }
  /** rhythm cells in beats: eighths always come in pairs on the beat */
  const CELLS = [[1], [1], [.5, .5], [2], [1.5, .5]];
  /** a level's chart: [{ i, b (beat), t (s), d (beats), midi, s, f }]. t = 0 is the end of the countdown */
  function rushChart(levelId, diffId, seed) {
    const L = RUSH.find(x => x.id === levelId) || RUSH[0], D = diff(diffId), r = rng(seed != null ? seed : 'rush:' + L.id);
    const P = pool(L.frets, L.scale ? A_ROOT : null);
    const idx = line(P, L.n, L.pat, r), spb = 60 / L.bpm, start = D.lead + .6, out = [];
    let b = 0, j = 0;
    while (j < idx.length) {
      const cell = L.rhythm ? pickOf(r, CELLS) : (r() < .18 ? [2] : [1]);
      for (const d of cell) { if (j >= idx.length) break; const p = P[idx[j]]; out.push({ i: j, b, t: +(start + b * spb).toFixed(4), d, midi: p.midi, s: p.s, f: p.f }); b += d; j++; }
      if (!L.rhythm && r() < .12) b += 1;   // a breath now and then
    }
    return { level: L, chart: out, bpm: L.bpm, spb, start, len: start + b * spb, pool: P };
  }

  /* ---------- Rhythm Battle ---------- */
  const RB_BPM = { easy: 60, normal: 85, hard: 110, expert: 130 };
  const RB_CYCLES = { kazbeguri: 8, mtiuluri: 6, khorumi: 4, acharuli: 8 };
  /** r: a rhythm with strokes [{direction, accent}] and timing.durations (beats). Count-in: 4 beats; strokes after it */
  function rhythmChart(r, bpm, cycles) {
    const spb = 60 / bpm, d = (r.timing && r.timing.durations && r.timing.durations.length === r.strokes.length) ? r.timing.durations : r.strokes.map(() => 1);
    const out = [], n = cycles || RB_CYCLES[r.id] || 6; let b = 4;
    for (let c = 0; c < n; c++) r.strokes.forEach((s, k) => { out.push({ i: out.length, c, k, b, t: +(b * spb).toFixed(4), acc: !!s.accent, dir: s.direction }); b += d[k]; });
    return { chart: out, spb, countIn: 4, len: b * spb, beats: b };
  }

  /* ---------- Melody Memory ---------- */
  const MEMORY = [
    { id: 1, n: 3, frets: [0, 0] }, { id: 2, n: 4, frets: [0, 2], scale: true }, { id: 3, n: 5, frets: [0, 4], scale: true },
    { id: 4, n: 6, frets: [0, 4], scale: true, n2: 8 }, { id: 5, n: 5, frets: [0, 4], scale: true, rhythm: true },
    { id: 6, n: 6, frets: [0, 4], scale: true, rhythm: true, rests: true }, { id: 7, n: 6, frets: [3, 7], scale: true, rhythm: true }, { id: 8, n: 8, frets: [0, 7], scale: true, rhythm: true, rests: true }
  ];
  const MEM_ROUNDS = 5;
  /** one melody: [{ midi, s, f, d (beats), rest (beats after) }] */
  function melody(levelId, round, seed) {
    const L = MEMORY.find(x => x.id === levelId) || MEMORY[0], r = rng(seed != null ? seed : 'mem:' + L.id + ':' + round);
    const P = pool(L.frets, L.scale ? A_ROOT : null), n = L.n2 ? L.n + Math.floor(r() * (L.n2 - L.n + 1)) : L.n;
    const idx = line(P, n, P.length < 4 ? 'free' : 'runs', r);
    return idx.map((k, j) => ({ midi: P[k].midi, s: P[k].s, f: P[k].f, d: L.rhythm ? pickOf(r, [1, 1, .5, 2]) : 1, rest: L.rests && j < n - 1 && r() < .25 ? 1 : 0 }));
  }
  /** compare the played rhythm with the target's, tempo-free: inter-onset intervals as shares of the whole */
  function rhythmMatch(targetIOI, playedIOI) {
    if (targetIOI.length < 2 || targetIOI.length !== playedIOI.length) return null;
    const ts = targetIOI.reduce((a, b) => a + b, 0), ps = playedIOI.reduce((a, b) => a + b, 0); if (!(ts > 0 && ps > 0)) return null;
    const err = targetIOI.reduce((a, x, i) => a + Math.abs(playedIOI[i] / ps - x / ts) / (x / ts), 0) / targetIOI.length;
    return Math.max(0, Math.min(1, 1 - err));
  }

  /* ---------- Fret Hunter ---------- */
  const HUNT = [{ id: 1, frets: [0, 4], scale: true, n: 10 }, { id: 2, frets: [0, 7], scale: true, n: 12 }, { id: 3, frets: [0, 12], n: 14 }, { id: 4, frets: [0, 17], n: 16 }];
  const HUNT_MODE = { learn: { hint: 0, limit: 0 }, challenge: { hint: 5, limit: 0 }, expert: { hint: -1, limit: 7 } };
  function huntTargets(levelId, seed) {
    const L = HUNT.find(x => x.id === levelId) || HUNT[0], r = rng(seed != null ? seed : 'hunt:' + L.id), P = pool(L.frets, L.scale ? A_ROOT : null), out = [];
    while (out.length < L.n) { const p = pickOf(r, P); if (out.length && out[out.length - 1].midi === p.midi) continue; out.push({ midi: p.midi }); }
    return out;
  }

  /* ---------- Chord Master: the computed library (positions from the tuning, fingers by the teacher's rule) ---------- */
  const CHORD_SETS = [
    { id: 1, names: ['A', 'Dm', 'D'] }, { id: 2, names: ['F♯m', 'A♯', 'Bm', 'B'] }, { id: 3, names: ['G', 'C', 'Em', 'Gm'] },
    { id: 4, names: ['A7', 'D7', 'F♯m7', 'Dm7'] }, { id: 5, names: ['E', 'C♯m', 'Fmaj7', 'Dmaj7', 'G7'] }
  ];
  function chordSet(levelId) {
    const L = CHORD_SETS.find(x => x.id === levelId) || CHORD_SETS[0], lib = TH().chordLibrary();
    return L.names.map(n => lib.find(c => c.name === n && !c.none)).filter(Boolean).map(c => ({ name: c.name, ka: c.ka, frets: c.voicings[0].frets.slice(), fingers: c.voicings[0].fingers.slice(), midis: c.voicings[0].frets.map((f, i) => TH().midi(i + 1, f)) }));
  }

  /* ---------- the catalogue ---------- */
  const GAMES = [
    { id: 'rush', levels: RUSH.length, diffs: DIFFS },
    { id: 'rhythm', levels: 4, diffs: DIFFS },
    { id: 'memory', levels: MEMORY.length, diffs: ['normal'] },
    { id: 'hunt', levels: HUNT.length, diffs: ['learn', 'challenge', 'expert'] },
    { id: 'chord', levels: CHORD_SETS.length, diffs: ['notes', 'strum'] },
    { id: 'song', levels: 0, diffs: ['easy', 'normal', 'hard'] },
    { id: 'band', levels: 0, diffs: ['perform', 'practice'] },
    { id: 'arena', levels: 0, diffs: [] }
  ];

  /* ---------- progress (versioned; synced with the account by cloud.js through merge()) ---------- */
  const KEYS = { best: 'games.best', hist: 'games.hist', ach: 'games.ach', daily: 'games.daily' };
  const V = 1;
  const lkey = (g, l, d) => g + ':' + l + ':' + d;
  function empty(k) { return k === KEYS.hist ? { v: V, list: [] } : { v: V, map: {} }; }
  function norm(k, o) { return o && o.v === V && (k === KEYS.hist ? Array.isArray(o.list) : o.map && typeof o.map === 'object') ? o : empty(k); }
  /** one finished round into the records. Returns { best (the record), improved: { score, stars, first } } */
  function record(bestState, r) {
    const B = norm(KEYS.best, bestState), k = lkey(r.g, r.l, r.d), o = B.map[k] || { best: 0, acc: 0, stars: 0, combo: 0, plays: 0, first: 0, last: 0 };
    const improved = { score: r.score > o.best, stars: Math.max(0, r.stars - o.stars), first: !o.stars && r.stars > 0 };
    const n = { best: Math.max(o.best, r.score), acc: Math.max(o.acc || 0, r.acc || 0), stars: Math.max(o.stars, r.stars), combo: Math.max(o.combo, r.maxCombo || 0), plays: o.plays + 1, first: o.first || r.date, last: r.date };
    B.map[k] = n;
    return { state: B, rec: n, improved };
  }
  /** merging two copies of a key (this device and the account's): nothing played on either is lost */
  function merge(k, a, b) {
    if (a == null) return b; if (b == null) return a;
    if (k === KEYS.best) {
      const A = norm(k, a), B = norm(k, b), out = { v: V, map: {} };
      new Set(Object.keys(A.map).concat(Object.keys(B.map))).forEach(x => {
        const p = A.map[x], q = B.map[x]; if (!p || !q) { out.map[x] = p || q; return; }
        out.map[x] = { best: Math.max(p.best, q.best), acc: Math.max(p.acc || 0, q.acc || 0), stars: Math.max(p.stars, q.stars), combo: Math.max(p.combo, q.combo), plays: Math.max(p.plays, q.plays), first: Math.min(p.first || q.first, q.first || p.first), last: Math.max(p.last, q.last) };
      });
      return out;
    }
    if (k === KEYS.hist) {
      const m = new Map(); norm(k, b).list.concat(norm(k, a).list).forEach(x => { if (x && x.date) m.set(x.date + ':' + x.g + ':' + x.l, x); });
      return { v: V, list: [...m.values()].sort((x, y) => x.date - y.date).slice(-300) };
    }
    if (k === KEYS.ach || k === KEYS.daily) {
      const A = norm(k, a), B = norm(k, b), out = { v: V, map: Object.assign({}, B.map) };
      Object.keys(A.map).forEach(x => { const p = A.map[x], q = out.map[x]; out.map[x] = q == null ? p : k === KEYS.ach ? Math.min(p, q) : (p && p.done ? p : q); });
      return out;
    }
    return a;
  }

  /* ---------- achievements: each is a fact about the records ---------- */
  const ACH = [
    ['first', s => s.plays >= 1], ['plays10', s => s.plays >= 10], ['plays50', s => s.plays >= 50],
    ['rush1', s => (s.cleared.rush || 0) >= 1], ['rush5', s => (s.cleared.rush || 0) >= 5], ['rush3s', s => s.three.rush > 0],
    ['combo25', s => s.maxCombo >= 25], ['combo50', s => s.maxCombo >= 50], ['combo100', s => s.maxCombo >= 100],
    ['rhythm4', s => s.rhythms >= 4], ['rhythmFast', s => s.rhythmFast],
    ['memory6', s => s.memoryClean6], ['hunt10', s => s.huntFast], ['chord5', s => s.chords >= 5],
    ['daily3', s => s.dailyStreak >= 3], ['daily7', s => s.dailyStreak >= 7], ['stars50', s => s.stars >= 50]
  ];
  function stats(best, hist, daily, today) {
    const B = norm(KEYS.best, best).map, H = norm(KEYS.hist, hist).list, Dl = norm(KEYS.daily, daily).map;
    const s = { plays: H.length, cleared: {}, three: { rush: 0 }, stars: 0, maxCombo: 0, rhythms: 0, rhythmFast: false, memoryClean6: false, huntFast: false, chords: 0, dailyStreak: 0, time: 0 };
    const rh = new Set();
    Object.keys(B).forEach(k => {
      const [g, l, d] = k.split(':'), r = B[k];
      s.stars += r.stars; s.maxCombo = Math.max(s.maxCombo, r.combo || 0);
      if (r.stars > 0) s.cleared[g] = (s.cleared[g] || 0) + 1;
      if (g === 'rush' && r.stars >= 3) s.three.rush++;
      if (g === 'rhythm' && r.stars > 0) { rh.add(l); if (d === 'hard' || d === 'expert') s.rhythmFast = true; }
    });
    s.rhythms = rh.size;
    H.forEach(x => { s.time += x.dur || 0; if (x.g === 'memory' && x.clean6) s.memoryClean6 = true; if (x.g === 'hunt' && x.avgFind && x.avgFind < 3 && x.found >= 10) s.huntFast = true; });
    s.chords = new Set(H.filter(x => x.g === 'chord').flatMap(x => x.chordsOk || [])).size;
    if (today != null) { let d = Dl[today] && Dl[today].done ? today : today - 1; while (Dl[d] && Dl[d].done) { s.dailyStreak++; d--; } }
    return s;
  }
  /** achievements newly earned → their ids (the caller stores the date) */
  function newAchievements(st, ach) { const got = norm(KEYS.ach, ach).map; return ACH.filter(([id, f]) => !got[id] && f(st)).map(([id]) => id); }

  /* ---------- the daily challenge: the same for everyone on a date, fitted to what this player has opened ---------- */
  const dayNum = d => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  function daily(day, best) {
    const r = rng('daily:' + day), B = norm(KEYS.best, best).map, g = pickOf(r, ['rush', 'rush', 'rhythm', 'memory', 'hunt']);
    const opened = id => { let n = 1; for (let l = 1; l <= 9; l++) if (Object.keys(B).some(k => k.startsWith(id + ':' + l + ':') && B[k].stars > 0)) n = l + 1; return n; };
    if (g === 'rhythm') { const ids = ['kazbeguri', 'mtiuluri', 'khorumi', 'acharuli']; return { day, g, l: pickOf(r, ids), d: 'easy', goal: { kind: 'acc', v: .8 } }; }
    const max = g === 'rush' ? RUSH.length : g === 'memory' ? MEMORY.length : HUNT.length, l = Math.max(1, Math.min(max, opened(g) - (r() < .5 ? 1 : 0)));
    const goal = g === 'rush' ? pickOf(r, [{ kind: 'stars', v: 2 }, { kind: 'combo', v: 15 }, { kind: 'acc', v: .8 }]) : { kind: 'stars', v: 2 };
    return { day, g, l, d: g === 'hunt' ? 'challenge' : 'normal', goal };
  }
  /** a harder setting than the challenge's also counts */
  const LADDER = { rush: DIFFS, rhythm: DIFFS, memory: ['normal'], hunt: ['learn', 'challenge', 'expert'] };
  function dailyMet(ch, r) {
    if (!ch || !r || r.g !== ch.g || String(r.l) !== String(ch.l)) return false;
    const o = LADDER[ch.g] || [ch.d]; if (o.indexOf(r.d) < o.indexOf(ch.d)) return false;
    const G = ch.goal; return G.kind === 'stars' ? r.stars >= G.v : G.kind === 'combo' ? (r.maxCombo || 0) >= G.v : (r.acc || 0) >= G.v;
  }

  /* ---------- Arena: a challenge travels as a code. It is checked for typing errors, not against cheating ---------- */
  const b64 = { enc(s) { const u = new TextEncoder().encode(s); let bin = ''; u.forEach(c => { bin += String.fromCharCode(c); }); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
    dec(s) { const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)); return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))); } };
  const sum4 = s => (hash('pd-arena:' + s) % 1679616).toString(36).padStart(4, '0');
  function encodeChallenge(o) {
    const body = { v: 1, g: o.g, l: o.l, d: o.d, seed: o.seed >>> 0, sc: Math.round(o.score || 0), acc: Math.round((o.acc || 0) * 1000), pa: Math.round((o.pitchAcc || 0) * 1000), ta: Math.round((o.timing || 0) * 1000), ms: o.mistakes || 0, cb: o.maxCombo || 0, nm: String(o.name || '').slice(0, 24), at: o.date || 0 };
    const j = b64.enc(JSON.stringify(body)); return j + '.' + sum4(j);
  }
  function decodeChallenge(code) {
    try {
      const s = String(code || '').trim().replace(/^.*[#?&]gmc=/, '').replace(/[^A-Za-z0-9_.-]/g, ''), dot = s.lastIndexOf('.');
      if (dot < 8) return null; const j = s.slice(0, dot); if (sum4(j) !== s.slice(dot + 1)) return null;
      const o = JSON.parse(b64.dec(j)); if (!o || o.v !== 1 || !['rush', 'rhythm'].includes(o.g)) return null;
      return { g: o.g, l: o.l, d: o.d, seed: o.seed >>> 0, score: o.sc, acc: o.acc / 1000, pitchAcc: o.pa / 1000, timing: o.ta / 1000, mistakes: o.ms, maxCombo: o.cb, name: o.nm, date: o.at };
    } catch (_) { return null; }
  }
  /** who did better, measure by measure */
  function compare(a, b) {
    const rows = [['score', a.score, b.score, 1], ['acc', a.acc, b.acc, 1], ['pitchAcc', a.pitchAcc, b.pitchAcc, 1], ['timing', a.timing, b.timing, 1], ['mistakes', a.mistakes, b.mistakes, -1], ['maxCombo', a.maxCombo, b.maxCombo, 1]]
      .map(([k, x, y, s]) => ({ k, a: x, b: y, win: x == null || y == null || x === y ? 0 : (x - y) * s > 0 ? 1 : -1 }));
    const w = (a.score || 0) === (b.score || 0) ? 0 : (a.score || 0) > (b.score || 0) ? 1 : -1;
    return { rows, win: w };
  }

  /* ---------- the session's states ---------- */
  const FLOW = {
    idle: ['preparing', 'exiting'], preparing: ['calibrating', 'countdown', 'idle', 'exiting'], calibrating: ['preparing', 'countdown', 'exiting'],
    countdown: ['playing', 'paused', 'exiting'], playing: ['paused', 'completed', 'failed', 'exiting'], paused: ['countdown', 'preparing', 'exiting'],
    completed: ['preparing', 'exiting'], failed: ['preparing', 'exiting'], exiting: []
  };
  function machine(onChange) {
    let s = 'idle';
    return { get state() { return s; }, can: n => FLOW[s].includes(n), go(n) { if (!FLOW[s] || !FLOW[s].includes(n)) return false; const p = s; s = n; if (onChange) onChange(n, p); return true; } };
  }
  /** song time ↔ audio time, across pauses. Each run is a segment; a moment inside a pause belongs to no song time */
  function clock() {
    const seg = [];
    const api = {
      run(songT, audioT) { api.stop(audioT); seg.push({ a0: audioT, s0: songT, a1: Infinity }); },
      stop(audioT) { const g = seg[seg.length - 1]; if (g && g.a1 === Infinity) g.a1 = Math.max(g.a0, audioT); },
      get running() { const g = seg[seg.length - 1]; return !!g && g.a1 === Infinity; },
      /** song time of an audio moment (null inside a pause) */
      song(a) {
        if (!seg.length) return null;
        if (a < seg[0].a0) return seg[0].s0 + (a - seg[0].a0);
        for (let i = seg.length - 1; i >= 0; i--) { const g = seg[i]; if (a >= g.a0 && a <= g.a1) return g.s0 + (a - g.a0); if (a > g.a1) return null; }
        return null;
      },
      /** where the song is now (frozen at its last moment while paused) */
      at(a) { const g = seg[seg.length - 1]; if (!g) return 0; if (a < g.a0) return g.s0; return g.s0 + (Math.min(a, g.a1) - g.a0); },
      audio(songT) { const g = seg[seg.length - 1]; return g ? g.a0 + (songT - g.s0) : NaN; },
      reset() { seg.length = 0; }
    };
    return api;
  }

  /** the app's XP for a session (premium.js: correct notes + 5 per minute), shown on the result screen */
  const sessionXP = (correct, sec) => Math.max(0, Math.round(correct || 0)) + Math.round((sec || 0) / 60 * 5);
  const bonusXP = imp => (imp.first ? 20 : 0) + 10 * (imp.stars || 0);

  return {
    hash, rng, DIFF, DIFFS, diff, GRADES, WEIGHT, POINTS, timingGrade, pitchGrade, worse, gradeOf, mult, judgePitch, scorer, result,
    noteMatcher, rhythmMatcher, accentOf, GRACE, pool, A_ROOT, RUSH, rushChart, RB_BPM, RB_CYCLES, rhythmChart,
    MEMORY, MEM_ROUNDS, melody, rhythmMatch, HUNT, HUNT_MODE, huntTargets, CHORD_SETS, chordSet, GAMES,
    KEYS, lkey, empty, norm, record, merge, ACH, stats, newAchievements, dayNum, daily, dailyMet,
    encodeChallenge, decodeChallenge, compare, FLOW, machine, clock, sessionXP, bonusXP
  };
})();
