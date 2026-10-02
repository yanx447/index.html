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

/** Where to play a note (MIDI) on the panduri with the lowest fret. */
export function position(midi, tuning, maxFret = 12) {
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
  if (q.id === 'sus4') continue;
  const v = new Float64Array(12);
  q.iv.forEach((iv, k) => { v[pc(r + iv)] = k === 0 ? 1.15 : 1; });
  TEMPLATES.push({ root: r, q: q.id, v, n: q.iv.length });
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

/** Best matching chord for a chroma vector. Returns { root, q, score, second }. */
export function matchChord(ch) {
  let best = null, second = null;
  for (const t of TEMPLATES) {
    let dot = 0, nt = 0;
    for (let k = 0; k < 12; k++) { dot += ch[k] * t.v[k]; nt += t.v[k] * t.v[k]; }
    // penalise energy outside the chord
    let out = 0; for (let k = 0; k < 12; k++) if (!t.v[k]) out += ch[k];
    const score = dot / Math.sqrt(nt) - 0.6 * out - (t.n === 4 ? 0.04 : 0);
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
