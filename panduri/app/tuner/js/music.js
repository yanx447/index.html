// Music theory for the panduri: note names, chords, fingerings for the current tuning,
// chroma analysis for chord recognition. Pure functions (tested in Node).

export const pc = (m) => ((m % 12) + 12) % 12;

const LATIN_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const LATIN_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const KA_SHARP = ['დო', 'დო♯', 'რე', 'რე♯', 'მი', 'ფა', 'ფა♯', 'სოლ', 'სოლ♯', 'ლა', 'ლა♯', 'სი'];
const KA_FLAT = ['დო', 'რე♭', 'რე', 'მი♭', 'მი', 'ფა', 'სოლ♭', 'სოლ', 'ლა♭', 'ლა', 'სი♭', 'სი'];
// roots conventionally named with flats
const FLAT_PC = new Set([3, 8, 10]); // E♭, A♭, B♭ (D♭/G♭ shown as C♯/F♯)

export const pcLatin = (p, flat = FLAT_PC.has(pc(p))) => (flat ? LATIN_FLAT : LATIN_SHARP)[pc(p)];
export const pcKa = (p, flat = FLAT_PC.has(pc(p))) => (flat ? KA_FLAT : KA_SHARP)[pc(p)];

export const QUALITIES = [
  { id: 'maj', sym: '', ka: 'მაჟორი', en: 'major', iv: [0, 4, 7] },
  { id: 'min', sym: 'm', ka: 'მინორი', en: 'minor', iv: [0, 3, 7] },
  { id: '7', sym: '7', ka: 'სეპტაკორდი', en: 'dominant 7', iv: [0, 4, 7, 10] },
  { id: 'm7', sym: 'm7', ka: 'მინორული სეპტაკ.', en: 'minor 7', iv: [0, 3, 7, 10] },
  { id: 'sus4', sym: 'sus4', ka: 'sus4', en: 'sus4', iv: [0, 5, 7] },
  { id: 'dim', sym: 'dim', ka: 'შემცირებული', en: 'diminished', iv: [0, 3, 6] },
];
export const quality = (id) => QUALITIES.find((q) => q.id === id) || QUALITIES[0];

export function chordName(rootPc, qid, lang = 'en') {
  const q = quality(qid);
  return { short: pcLatin(rootPc) + q.sym, long: lang === 'ka' ? `${pcKa(rootPc)} ${q.ka}` : `${pcLatin(rootPc)} ${q.en}` };
}

/** Parse "A", "C#m", "Bbm7", "F#sus4", "Edim", "D♯7" → { root, q } or null. */
export function parseChord(s) {
  const m = String(s).trim().replace('♯', '#').replace('♭', 'b').match(/^([A-Ga-g])([#b]?)(m7|maj|min|m|7|sus4|dim)?$/);
  if (!m) return null;
  const base = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[m[1].toLowerCase()];
  const root = pc(base + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0));
  const map = { m: 'min', min: 'min', maj: 'maj', 7: '7', m7: 'm7', sus4: 'sus4', dim: 'dim' };
  return { root, q: m[3] ? map[m[3]] : 'maj' };
}

/**
 * Fingering for a chord on the three strings (open MIDI notes `tuning`, low → high).
 * Major and minor follow the panduri patterns: barré [n, n, n] and [n, n−1, n];
 * other chords use a search that covers the most important chord tones with the smallest stretch.
 * Returns { frets: [f1, f2, f3], notes: [midi…], barre: n|null }.
 */
export function fingering(rootPc, qid, tuning) {
  const q = quality(qid);
  const n = pc(rootPc - tuning[0]);
  if (qid === 'maj') { const f = [n, n, n]; return done(f, n > 0 ? n : null); }
  if (qid === 'min') {
    const k = n === 0 ? 12 : n;
    const f = [k, k - 1, k];
    return done(f, k);
  }
  const tones = q.iv.map((i) => pc(rootPc + i));
  const must = qid === '7' || qid === 'm7' ? [0, 1, 3] : [0, 1, 2]; // 7th chords: root, 3rd, 7th (5th may be dropped)
  let best = null;
  for (let a = 0; a <= 12; a++) for (let b = 0; b <= 12; b++) for (let c = 0; c <= 12; c++) {
    const f = [a, b, c];
    const notes = f.map((x, i) => pc(tuning[i] + x));
    if (!notes.every((p) => tones.includes(p))) continue;
    if (!must.every((k) => notes.includes(tones[k]))) continue;
    const used = f.filter((x) => x > 0);
    const span = used.length ? Math.max(...used) - Math.min(...used) : 0;
    if (span > 4) continue;
    const score = span * 3 + Math.max(...f) + (notes[0] === tones[0] ? 0 : 4);
    if (!best || score < best.score) best = { f, score };
  }
  return done(best ? best.f : [n, n, n], null);
  function done(f, barre) { return { frets: f, notes: f.map((x, i) => tuning[i] + x), barre }; }
}

/**
 * Every playable position of a chord on the neck (up to `maxFret`).
 * A position puts one chord tone on each string, covers the essential tones (all three for a
 * triad; root, 3rd and 7th for a seventh chord) and fits the hand: fretted notes within a
 * 4-fret span; open strings only together with low frets (≤ 5).
 * Returns [{ frets, notes, barre, low, inv }] sorted up the neck, where `inv` is the chord
 * tone in the bass (0 root, 1 third, 2 fifth, 3 seventh) and `low` the lowest fret used.
 */
export function voicings(rootPc, qid, tuning, maxFret = 17) {
  const q = quality(qid);
  const tones = q.iv.map((i) => pc(rootPc + i));
  const must = q.iv.length === 4 ? [0, 1, 3] : [0, 1, 2];
  const per = tuning.map((t) => { const a = []; for (let f = 0; f <= maxFret; f++) if (tones.includes(pc(t + f))) a.push(f); return a; });
  const out = [];
  for (const a of per[0]) for (const b of per[1]) for (const c of per[2]) {
    const f = [a, b, c];
    const notes = f.map((x, i) => tuning[i] + x);
    const pcs = notes.map(pc);
    if (!must.every((k) => pcs.includes(tones[k]))) continue;
    const used = f.filter((x) => x > 0);
    const lo = used.length ? Math.min(...used) : 0, hi = used.length ? Math.max(...used) : 0;
    if (hi - lo > 3) continue;
    if (used.length < 3 && hi > 5) continue;
    const barre = used.length >= 2 && f.filter((x) => x === lo).length >= 2 ? lo : null;
    out.push({ frets: f, notes, barre, low: used.length === 3 ? lo : 0, inv: tones.indexOf(pcs[0]) });
  }
  // up the neck; at the same place prefer the smaller stretch
  return out.sort((x, y) => x.low - y.low || Math.max(...x.frets) - Math.max(...y.frets) || x.frets[0] - y.frets[0]);
}

/** Where to play a note (MIDI) on the panduri with the lowest fret. */
export function position(midi, tuning, maxFret = 17) {
  let best = null;
  tuning.forEach((t, s) => {
    const f = midi - t;
    if (f >= 0 && f <= maxFret && (!best || f < best.fret)) best = { string: s, fret: f };
  });
  return best;
}

// ── chroma / chord recognition ────────────────────────────────────────────────────────────
const TEMPLATES = [];
for (let r = 0; r < 12; r++) for (const q of QUALITIES) {
  const v = new Float64Array(12);
  q.iv.forEach((iv, k) => { v[pc(r + iv)] = k === 0 ? 1.15 : 1; });
  TEMPLATES.push({ root: r, q: q.id, v, n: q.iv.length, pen: q.id === 'sus4' ? 0.03 : q.iv.length === 4 ? 0.04 : 0 });
}

/**
 * Chroma (12 pitch-class energies) from a magnitude spectrum.
 * mags: Float32Array of linear magnitudes, binHz: Hz per bin.
 */
export function chroma(mags, binHz, a4 = 440, fMin = 75, fMax = 1400) {
  const out = new Float64Array(12);
  const i0 = Math.max(1, Math.floor(fMin / binHz)), i1 = Math.min(mags.length - 2, Math.ceil(fMax / binHz));
  for (let i = i0; i <= i1; i++) {
    const m = mags[i];
    if (m <= mags[i - 1] || m < mags[i + 1]) continue; // local peaks only
    // parabolic interpolation of the peak frequency
    const a = mags[i - 1], b = m, c = mags[i + 1];
    const den = a - 2 * b + c, d = den ? (0.5 * (a - c)) / den : 0;
    const f = (i + d) * binHz;
    const midi = 69 + 12 * Math.log2(f / a4);
    const w = b * b / Math.sqrt(f / 110); // favour lower partials a little
    out[pc(Math.round(midi))] += w;
  }
  let s = 0; for (let k = 0; k < 12; k++) s += out[k];
  if (s > 0) for (let k = 0; k < 12; k++) out[k] /= s;
  return out;
}

/**
 * Harmonic-aware pitch-class profile. Plain chroma counts every partial as a note — on a real
 * panduri the strong 3rd partial of C♯4 (a G♯) turned an open A chord into C♯m. Here notes are
 * picked one by one (strongest harmonic series first) and each note's partials are removed before
 * the next, so overtones are not mistaken for notes. Partials are matched within ±45¢ because
 * real panduri partials are inharmonic (measured up to −25¢).
 * @param tuning MIDI notes of the open strings (candidates are limited to the instrument's range)
 * @returns {{chroma: Float64Array, notes: {midi:number, f:number, s:number}[]}}
 */
export function noteProfile(mags, binHz, a4 = 440, tuning = [57, 61, 64], maxNotes = tuning.length) {
  // spectral peaks with parabolic interpolation
  const pf = [], pa = [];
  let top = 0;
  const i0 = Math.max(2, Math.floor(70 / binHz)), i1 = Math.min(mags.length - 2, Math.ceil(2600 / binHz));
  for (let i = i0; i <= i1; i++) if (mags[i] > top) top = mags[i];
  if (!(top > 0)) return { chroma: new Float64Array(12), notes: [] };
  const thr = top * 0.01;
  for (let i = i0; i <= i1; i++) {
    const m = mags[i];
    if (m < thr || m <= mags[i - 1] || m < mags[i + 1]) continue;
    const a = mags[i - 1], c = mags[i + 1], den = a - 2 * m + c, d = den ? (0.5 * (a - c)) / den : 0;
    pf.push((i + d) * binHz); pa.push(m);
  }
  const amp = Float64Array.from(pa);
  const lo = Math.min(...tuning) - 1, hi = Math.max(...tuning) + 15;
  const near = (f) => { // strongest remaining peak within ±45 cents of f
    let best = -1;
    for (let j = 0; j < pf.length; j++) {
      if (Math.abs(1200 * Math.log2(pf[j] / f)) <= 45 && (best < 0 || amp[j] > amp[best])) best = j;
    }
    return best;
  };
  const notes = [];
  let first = 0;
  for (let n = 0; n < maxNotes; n++) {
    let bestM = -1, bestS = 0, bestF = 0;
    for (let midi = lo; midi <= hi; midi++) {
      const f = a4 * Math.pow(2, (midi - 69) / 12);
      const j1 = near(f);
      if (j1 < 0 || amp[j1] < top * 0.02) continue;          // a played note has a real fundamental
      let s = amp[j1];
      for (let h = 2; h <= 6; h++) { const j = near(h * pf[j1]); if (j >= 0) s += amp[j] / Math.pow(h, 0.7); }
      if (s > bestS) { bestS = s; bestM = midi; bestF = pf[j1]; }
    }
    if (bestM < 0 || (first && bestS < first * 0.05)) break;
    if (!first) first = bestS;
    notes.push({ midi: bestM, f: bestF, s: bestS });
    // remove this note's partials (fundamental fully, overtones mostly — they may be shared)
    for (let h = 1; h <= 8; h++) { const j = near(h * bestF); if (j >= 0) amp[j] *= h === 1 ? 0 : 0.15; }
  }
  // presence, not loudness: a quiet low string is as much part of the chord as a loud one
  const ch = new Float64Array(12);
  for (const nt of notes) ch[pc(nt.midi)] += Math.pow(nt.s / first, 0.25);
  let sum = 0; for (let k = 0; k < 12; k++) sum += ch[k];
  if (sum > 0) for (let k = 0; k < 12; k++) ch[k] /= sum;
  let bass = -1, lowest = Infinity;
  for (const nt of notes) if (nt.midi < lowest) { lowest = nt.midi; bass = pc(nt.midi); }
  return { chroma: ch, notes, bass };
}

/** Best matching chord for a chroma vector. Returns { root, q, score, second }. */
export function matchChord(ch, bass = -1) {
  let best = null, second = null;
  for (const t of TEMPLATES) {
    let dot = 0, nt = 0;
    for (let k = 0; k < 12; k++) { dot += ch[k] * t.v[k]; nt += t.v[k] * t.v[k]; }
    // penalise energy outside the chord
    let out = 0; for (let k = 0; k < 12; k++) if (!t.v[k]) out += ch[k];
    const score = dot / Math.sqrt(nt) - 0.6 * out - t.pen + (t.root === bass ? 0.03 : 0);
    if (!best || score > best.score) { second = best; best = { root: t.root, q: t.q, score }; }
    else if (!second || score > second.score) second = { root: t.root, q: t.q, score };
  }
  return { ...best, second };
}

// ── small radix-2 FFT (magnitude spectrum with Hann window) ────────────────────────────
export class Spectrum {
  constructor(n) {
    this.n = n; this.re = new Float64Array(n); this.im = new Float64Array(n); this.mag = new Float32Array(n / 2);
    this.win = new Float64Array(n); for (let i = 0; i < n; i++) this.win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
    const bits = Math.log2(n); this.rev = new Uint32Array(n);
    for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < bits; b++) r |= ((i >> b) & 1) << (bits - 1 - b); this.rev[i] = r; }
  }
  compute(x) {
    const { n, re, im, win, rev } = this; const off = x.length - Math.min(n, x.length);
    for (let i = 0; i < n; i++) { re[i] = i < x.length ? x[off + i] * win[i] : 0; im[i] = 0; }
    for (let i = 0; i < n; i++) { const j = rev[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; } }
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1, ang = (-2 * Math.PI) / size;
      for (let i = 0; i < n; i += size) for (let j = 0; j < half; j++) {
        const c = Math.cos(ang * j), s = Math.sin(ang * j), a = i + j, b = a + half;
        const tr = re[b] * c - im[b] * s, ti = re[b] * s + im[b] * c;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
      }
    }
    for (let i = 0; i < n / 2; i++) this.mag[i] = Math.hypot(re[i], im[i]);
    return this.mag;
  }
}

// ── open-string check from one strum ───────────────────────────────────────────────────
/**
 * Measures each open string's fundamental in a strummed chord. The open strings of the panduri
 * (A3 · C♯4 · E4) have well-separated fundamentals, so each one is located as the peak of the
 * Hann-windowed spectrum (Goertzel + golden-section search) within ±spanCents of its target.
 * @param x      time-domain frame (the last `n` samples are used)
 * @param freqs  target frequencies of the open strings
 * @returns [{ cents, level }] per string — cents null when the string is not heard
 */
export function strumCheck(x, sr, freqs, { n = 8192, spanCents = 90 } = {}) {
  const N = Math.min(n, x.length), off = x.length - N;
  const w = new Float64Array(N);
  let mean = 0; for (let i = 0; i < N; i++) mean += x[off + i]; mean /= N;
  for (let i = 0; i < N; i++) w[i] = (x[off + i] - mean) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)));
  const mag = (f) => {
    const c = 2 * Math.cos((2 * Math.PI * f) / sr); let s1 = 0, s2 = 0;
    for (let i = 0; i < N; i++) { const s0 = w[i] + c * s1 - s2; s2 = s1; s1 = s0; }
    return Math.sqrt(Math.max(0, s1 * s1 + s2 * s2 - c * s1 * s2)) / N;
  };
  const k = Math.pow(2, 1 / 1200);
  const res = freqs.map((f) => {
    const steps = 18; let best = -1, bc = 0;
    for (let i = -steps; i <= steps; i++) { const cc = (i / steps) * spanCents, m = mag(f * Math.pow(k, cc)); if (m > best) { best = m; bc = cc; } }
    const st = spanCents / steps; let a = bc - st, b = bc + st;
    const g = 0.6180339887; let c1 = b - g * (b - a), c2 = a + g * (b - a), m1 = mag(f * Math.pow(k, c1)), m2 = mag(f * Math.pow(k, c2));
    for (let it = 0; it < 18; it++) {
      if (m1 > m2) { b = c2; c2 = c1; m2 = m1; c1 = b - g * (b - a); m1 = mag(f * Math.pow(k, c1)); }
      else { a = c1; c1 = c2; m1 = m2; c2 = a + g * (b - a); m2 = mag(f * Math.pow(k, c2)); }
    }
    const cents = 0.5 * (a + b), edge = Math.abs(bc) >= spanCents - st * 0.5;
    // noise reference: the spectrum half-way between this string and its neighbours' range
    const floor = 0.5 * (mag(f * Math.pow(k, -160)) + mag(f * Math.pow(k, 160)));
    return { cents: edge ? null : cents, level: Math.max(m1, m2), floor };
  });
  const top = Math.max(...res.map((r) => r.level));
  return res.map((r) => ({ cents: r.cents != null && r.level > top * 0.03 && r.level > r.floor * 4 ? r.cents : null, level: r.level }));
}
