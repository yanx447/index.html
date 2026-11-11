/* Builds the app's real panduri sounds from the supplied WAV recordings.

     node sounds/make.cjs            (from panduri/source; reads the WAVs from the repository root)

   In   ფანდურის თითოელი სიმი/ბანი სიმი · მეორე სიმი · პირველი სიმი.wav  every fret, 0 → 17, of strings 1 (A), 2 (C♯), 3 (E)
        რითმები/*.wav                                               Acharuli and Mtiuluri, from very slow to the fastest
        MUSIC/ბანი - აჭარული/ბანის-აჭარული.wav                      Bani-Acharuli, a short version that loops
   Out  ../app/media/strings/s<string>-<fret>.mp3                  one note each, for PD.samples
        ../app/media/rhythms/<id>.mp3                              each rhythm recording, trimmed to whole cycles
        ext/sami-simi/audio/panduri-{a3,cs4,e4}.mp3                the tuner's reference plucks, tuned to A4 = 440 Hz exactly
        src/sounddata.js                                            PD.SOUNDS: pitch of every note, loop points, stroke times

   Nothing is guessed silently: every note's pitch is measured (the frames of its first 0.6 s must agree) and must
   lie nearer its own fret than the next one, and every rhythm's cycles are tracked from the recording itself (see cycles.cjs). */
const fs = require('fs'), path = require('path');
const W = require('./wav.cjs'), C = require('./cycles.cjs'), lamejs = require('./lame.cjs');
const ROOT = path.resolve(__dirname, '../../..'), SRC = path.resolve(__dirname, '..'), MEDIA = path.resolve(SRC, '../app/media');
const STRINGS = { 1: 'ფანდურის თითოელი სიმი/ბანი სიმი.wav', 2: 'ფანდურის თითოელი სიმი/მეორე სიმი.wav', 3: 'ფანდურის თითოელი სიმი/პირველი სიმი.wav' };
const OPEN = { 1: 57, 2: 61, 3: 64 }, FRETS = 17;
// MP3 encoder + decoder delay of these files, measured by decoding them in Chromium (a click at a known sample)
const DELAY = 1089 / 48000;
const MT = [0, .32, .50, .66, .82], AC = [0, .39, .60];   // where each stroke falls in one cycle (measured on the slowest takes)
const RH = [
  // id, file, rhythm, Georgian, English, options
  ['acharuli-open', 'აჭარული ძალიან ნელა.wav', 'acharuli', 'ძალიან ნელა', 'Very slowly'],
  ['acharuli-1', 'აჭარული ძალიან ნელი.wav', 'acharuli', 'ძალიან ნელი', 'Very slow'],
  ['acharuli-2', 'აჭარული ნელი.wav', 'acharuli', 'ნელი', 'Slow'],
  ['acharuli-3', 'აჭარული სწრაფი.wav', 'acharuli', 'სწრაფი', 'Fast'],
  ['mtiuluri-1', 'მთიულური ძალიან ნელი.wav', 'mtiuluri', 'ძალიან ნელი', 'Very slow'],
  ['mtiuluri-2', 'მთიულური ნელი.wav', 'mtiuluri', 'ნელი', 'Slow'],
  // this take does not start on stroke 1: of the first six strokes, the cycle that starts at 0.837 s puts the most
  // stroke positions on an attack (16 of 20, against 16 of 25 from the first stroke)
  ['mtiuluri-3', 'მთიულური ნორმალური.wav', 'mtiuluri', 'ნორმალური', 'Normal', { first: .837 }],
  ['mtiuluri-4', 'მთიულური ცოტათი სწრაფი.wav', 'mtiuluri', 'ცოტათი სწრაფი', 'A little faster'],
  ['mtiuluri-5', 'მთიულური სწრაფი.wav', 'mtiuluri', 'სწრაფი', 'Fast'],
  // the two fastest: the strokes run into each other, so the tracker is given the period (autocorrelation peak)
  // and, for one, where the first full stroke is (the quiet onset before it is the hand touching the strings)
  ['mtiuluri-6', 'მთიულური ძალიან სწრაფი.wav', 'mtiuluri', 'ძალიან სწრაფი', 'Very fast', { first: .296 }],
  ['mtiuluri-7', 'მთიულური ყველაზე სწრაფი.wav', 'mtiuluri', 'ყველაზე სწრაფი', 'Fastest', { P: .53 }]
];
const BANI = 'MUSIC/ბანი - აჭარული/ბანის-აჭარული.wav', SAMIVE = 'ფანდურის თითოელი სიმი/სამივე სიმი.wav';

function mp3(x, sr, kbps) {
  const enc = new lamejs.Mp3Encoder(1, sr, kbps || 96), n = x.length, pcm = new Int16Array(n), out = [];
  for (let i = 0; i < n; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(x[i] * 32767)));
  for (let i = 0; i < n; i += 1152 * 16) { const b = enc.encodeBuffer(pcm.subarray(i, i + 1152 * 16)); if (b.length) out.push(Buffer.from(b.buffer, b.byteOffset, b.length)); }
  const e = enc.flush(); if (e.length) out.push(Buffer.from(e.buffer, e.byteOffset, e.length));
  return Buffer.concat(out);
}
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
/** the pitch the ear hears: YIN every 20 ms over the first 0.6 s after the pluck, each frame weighted by its energy.
    (These strings drift upwards by 20–40 cents as they die away; by then the note is 20–30 dB quieter.)
    spread = energy-weighted standard deviation of the frames, in cents */
function pitchAt(x, sr, t, expect) {
  let sw = 0, sm = 0; const fr = [];
  for (let u = t + .04; u < t + .6; u += .02) {
    const q = Math.round(u * sr); if (q + 6000 > x.length) break;
    let e = 0; for (let i = q; i < q + 1920; i++) e += x[i] * x[i];
    const c = 1200 * Math.log2(W.yin(x.subarray(q, q + 6000), sr, expect * .84, expect * 1.19) / expect);
    if (isFinite(c) && Math.abs(c) < 150) { fr.push([c, e]); sw += e; sm += c * e; }
  }
  const m = sm / sw; let v = 0; fr.forEach(([c, e]) => v += e * (c - m) ** 2);
  return { f0: expect * Math.pow(2, m / 1200), spread: Math.sqrt(v / sw) };
}
/** 4-point Hermite resampling by a ratio (ratio > 1 → the pitch goes up) */
function resample(x, ratio) {
  const n = Math.floor((x.length - 3) / ratio), y = new Float32Array(n);
  for (let i = 0; i < n; i++) { const p = i * ratio, k = Math.floor(p), f = p - k, a = x[k - 1] || 0, b = x[k], c = x[k + 1], d = x[k + 2];
    y[i] = b + .5 * f * (c - a + f * (2 * a - 5 * b + 4 * c - d + f * (3 * (b - c) + d - a))); }
  return y;
}
const write = (p, b) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, b); return b.length; };
let total = 0;

/* ---------- 1. the notes: every fret of every string ---------- */
const notes = {}, report = [];
const tuner = {};
for (const s of [1, 2, 3]) {
  const { x, sr } = W.readWav(path.join(ROOT, STRINGS[s]));
  const on = W.onsets(x, sr, { minGap: .25, k: 1.5, floor: .1 }).list.map(p => { let pk = 0; for (let j = Math.round(p.t * sr); j < Math.round(p.t * sr) + 4800 && j < x.length; j++) pk = Math.max(pk, Math.abs(x[j])); return { t: p.t, pk }; });
  const strong = on.filter(p => p.pk > .5);
  if (strong.length < FRETS + 1) throw new Error(`string ${s}: ${strong.length} notes found, ${FRETS + 1} needed`);
  // 2 and 3 carry one note more than the 17 frets (fret 18, beyond the app's fretboard); it is left out
  notes[s] = [];
  for (let f = 0; f <= FRETS; f++) {
    const p = strong[f], next = on.find(q => q.t > p.t + .9), expect = hz(OPEN[s] + f);
    const { f0, spread } = pitchAt(x, sr, p.t, expect), cents = 1200 * Math.log2(f0 / expect);
    // the notes come in order, one per fret; a pitch nearer another fret, or frames that disagree, stops the build
    if (!(Math.abs(cents) < 95) || !(spread < 25)) throw new Error(`string ${s} fret ${f}: measured ${f0.toFixed(1)} Hz, ${cents.toFixed(0)} cents from ${expect.toFixed(1)} Hz (frames spread ${spread.toFixed(1)} c)`);
    const a = Math.max(0, Math.round((p.t - .012) * sr)), end = Math.min(p.t + 2.4, next ? next.t - .03 : x.length / sr), b = Math.round(end * sr);
    const seg = x.slice(a, b);
    // level: the first half second of every note brought to the same loudness, peaks kept under −0.5 dB
    let e = 0; const nE = Math.min(seg.length, Math.round(.5 * sr)); for (let i = 0; i < nE; i++) e += seg[i] * seg[i];
    let pk = 0; for (const v of seg) pk = Math.max(pk, Math.abs(v));
    // the open string, longer, for the tuner (it rings until the next note is played)
    const long = f === 0 ? x.slice(a, Math.round(Math.min(p.t + 3.0, next ? next.t - .03 : x.length / sr) * sr)) : null;
    notes[s].push({ f, t: p.t, seg, long, rms: Math.sqrt(e / nE), pk, f0, cents, spread });
    report.push(`s${s} f${String(f).padStart(2)}  ${f0.toFixed(2).padStart(7)} Hz  ${(cents >= 0 ? '+' : '') + cents.toFixed(1)} c  ±${spread.toFixed(1)} c  ${(seg.length / sr).toFixed(2)} s`);
  }
  notes[s].sr = sr;
}
const allRms = [].concat(...Object.values(notes).map(l => l.map(n => n.rms))).sort((a, b) => a - b), target = allRms[allRms.length >> 1];
const SOUNDS = { strings: {}, rhythms: {}, delay: +DELAY.toFixed(5) };
for (const s of [1, 2, 3]) {
  const sr = notes[s].sr;
  SOUNDS.strings[s] = notes[s].map(n => {
    const g = Math.min(target / n.rms, .94 / n.pk), y = new Float32Array(n.seg.length), fo = Math.round(.3 * sr);
    for (let i = 0; i < y.length; i++) { let v = n.seg[i] * g; if (i < 96) v *= i / 96; if (i > y.length - fo) v *= Math.pow((y.length - i) / fo, 2); y[i] = v; }
    const file = `strings/s${s}-${String(n.f).padStart(2, '0')}.mp3`;
    total += write(path.join(MEDIA, file), mp3(y, sr, 96));
    if (n.f === 0) tuner[s] = { y: n.long.map(v => v * g), f0: n.f0, sr };
    // hz: the note as recorded; the app re-tunes it to the exact pitch of the fret (A4 setting, the learner's tuning)
    // start: 3 ms before the attack (the first sample above 5 % of the note's peak), past the encoder's silence
    let pkY = 0; for (const v of y) pkY = Math.max(pkY, Math.abs(v)); let att = 0; while (att < y.length && Math.abs(y[att]) < .05 * pkY) att++;
    return { f: n.f, file, hz: +n.f0.toFixed(3), start: +(DELAY + Math.max(0, att / sr - .003)).toFixed(4) };
  });
}
/* ---------- 2. the tuner's reference plucks: the open strings, clean, at A4 = 440 Hz exactly ----------
   A real string is not a clean reference: on these recordings the loudest partial of A (the 3rd) is split in two
   5 Hz apart and sits 2.96–2.98 × the fundamental, so the note beats and its pitch sounds muddy; E carries the open
   C♯ string ringing along (−23 dB); every take has 20–45 Hz handling rumble. So the reference keeps the pluck itself
   (the first 60 ms of the recording) and the recording's own level and decay of every harmonic, and rebuilds the
   rest from exact multiples of the target pitch: the panduri's colour, without beats, without the other strings. */
function cleanPluck(y0, sr, f0, target, dur) {
  const x = resample(y0, target / f0);                       // partials now near k × target
  const N = 4096, H = 240, w = new Float64Array(N); let sw2 = 0; for (let i = 0; i < N; i++) { w[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N); sw2 += w[i] * w[i]; }
  const K = Math.min(24, Math.floor(7000 / target)), frames = Math.floor((x.length - N) / H), env = [];   // env[k][j]
  for (let k = 0; k < K; k++) env.push(new Float64Array(frames));
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let j = 0; j < frames; j++) {
    for (let i = 0; i < N; i++) { re[i] = x[j * H + i] * w[i]; im[i] = 0; } W.fft(re, im);
    for (let k = 0; k < K; k++) { const fk = (k + 1) * target, lo = Math.floor(fk * .975 * N / sr), hi = Math.ceil(fk * 1.025 * N / sr); let e = 0; for (let q = lo; q <= hi; q++) e += re[q] * re[q] + im[q] * im[q]; env[k][j] = Math.sqrt(4 * e / (N * sw2)); }
  }
  // smooth each envelope in the log domain: little at the start (the attack's shape), up to ±125 ms later (removes the beating)
  const tOf = j => (j * H + N / 2) / sr;
  const sm = env.map(a => { const o = new Float64Array(frames); for (let j = 0; j < frames; j++) { const hw = Math.round(Math.min(.125, .01 + .4 * tOf(j)) * sr / H); let s = 0, n = 0; for (let q = Math.max(0, j - hw); q <= Math.min(frames - 1, j + hw); q++) { s += Math.log(a[q] + 1e-9); n++; } o[j] = Math.exp(s / n); } return o; });
  const n = Math.min(Math.round(dur * sr), x.length), out = new Float32Array(n);
  // phase of every harmonic at the middle of the crossfade, so the rebuilt partials continue the recorded ones
  const X0 = .06, X1 = .10, tc = (X0 + X1) / 2, nc = Math.round(tc * sr), M = 1536, ph = [];
  for (let k = 0; k < K; k++) { const om = 2 * Math.PI * (k + 1) * target / sr; let zr = 0, zi = 0; for (let i = -M / 2; i < M / 2; i++) { const v = (x[nc + i] || 0) * (.5 + .5 * Math.cos(2 * Math.PI * i / M)); zr += v * Math.cos(om * i); zi -= v * Math.sin(om * i); } ph.push(Math.atan2(zi, zr)); }
  const ampAt = (k, t) => { const u = (t * sr - N / 2) / H; if (u <= 0) return sm[k][0]; if (u >= frames - 1) return sm[k][frames - 1] * Math.exp(-(u - frames + 1) * H / sr / .3); const j = Math.floor(u), f = u - j; return sm[k][j] * (1 - f) + sm[k][j + 1] * f; };
  let hpPrev = 0, hpOut = 0; const hpA = Math.exp(-2 * Math.PI * 70 / sr);
  for (let i = 0; i < n; i++) {
    const t = i / sr; let syn = 0;
    if (t >= X0) for (let k = 0; k < K; k++) syn += ampAt(k, t) * Math.cos(2 * Math.PI * (k + 1) * target * (i - nc) / sr + ph[k]);
    hpOut = hpA * (hpOut + x[i] - hpPrev); hpPrev = x[i];     // 70 Hz high-pass on the recorded attack
    const g = t < X0 ? 0 : t > X1 ? 1 : (t - X0) / (X1 - X0);
    out[i] = hpOut * (1 - g) + syn * g;
  }
  const fo = Math.round(.25 * sr); for (let i = n - fo; i < n; i++) out[i] *= Math.pow((n - i) / fo, 2);
  let pk = 0; for (const v of out) pk = Math.max(pk, Math.abs(v)); if (pk > .94) for (let i = 0; i < n; i++) out[i] *= .94 / pk;
  return out;
}
const TUNER = { 1: 'panduri-a3.mp3', 2: 'panduri-cs4.mp3', 3: 'panduri-e4.mp3' };
for (const s of [1, 2, 3]) {
  const tn = tuner[s], z = cleanPluck(tn.y, tn.sr, tn.f0, hz(OPEN[s]), 2.8);
  // the tuner plays from sample 0: the encoder delay is a fixed 23 ms of silence before the pluck, which does not matter there
  total += write(path.join(SRC, 'ext/sami-simi/audio', TUNER[s]), mp3(z, tn.sr, 128));
  report.push(`tuner ${TUNER[s]}  ${(z.length / tn.sr).toFixed(2)} s, rebuilt on ${hz(OPEN[s]).toFixed(2)} Hz`);
}
/* ---------- 3. the rhythms: whole cycles, looped seamlessly; the time of every stroke ---------- */
function bake(id, file, a, b, cycles, sr, x) {
  // the loop runs from a to b (12 ms before stroke 1 of the first cycle and of the cycle after the last);
  // outside it the file is silent, with a 4 ms fade in and an 8 ms fade out at the seams
  const pad = .03, s0 = Math.round((a - pad) * sr), s1 = Math.round((b + pad) * sr), y = x.slice(Math.max(0, s0), s1), A = Math.round(pad * sr), B = y.length - Math.round(pad * sr);
  for (let i = 0; i < y.length; i++) { let g = 1; if (i < A) g = 0; else if (i < A + 192) g = (i - A) / 192; if (i >= B) g = 0; else if (i > B - 384) g = Math.min(g, (B - i) / 384); y[i] *= g * .95; }
  const off = DELAY - (a - pad), out = `rhythms/${id}.mp3`;
  total += write(path.join(MEDIA, out), mp3(y, sr, 96));
  const r3 = v => +(v + off).toFixed(4);
  return { file: out, loop: [r3(a), r3(b)], cycles: cycles.map(c => c.map(r3)) };
}
/** stroke times of each tracked cycle: the onset found near the template position, or the template position itself */
function strokeTimes(r, j) {
  const c = r.starts[j], P = j + 1 < r.starts.length ? r.starts[j + 1] - c : r.P;
  return r.fracs.map((fk, k) => { const sn = r.cycles[j][k]; return sn && sn.v >= .25 ? sn.t : c + fk * P; });
}
for (const [id, f, rhythm, ka, en, opt] of RH) {
  const o = opt || {}, K = rhythm === 'mtiuluri' ? 5 : 3, file = path.join(ROOT, 'რითმები', f);
  const r = C.track(file, K, rhythm === 'mtiuluri' ? 'longest-after' : 'short', K === 5 ? MT : AC, K === 5, o.P, o.first);
  let js = r.starts.map((_, j) => j);
  while (js.length && r.cycles[js[0]][0].v < .3) js.shift();        // a weak "cycle" before the playing starts
  const times = js.map(j => strokeTimes(r, j));
  // the loop: every cycle but the last; its first stroke is where the loop turns round
  const a = times[0][0] - .012, b = times[times.length - 1][0] - .012;
  const { x, sr } = W.readWav(file);
  const out = bake(id, f, a, b, times.slice(0, -1), sr, x);
  const per = (b - a) / (times.length - 1);
  (SOUNDS.rhythms[rhythm] = SOUNDS.rhythms[rhythm] || []).push(Object.assign({ id, name: { ka, en }, period: +per.toFixed(4) }, out));
  report.push(`${id.padEnd(14)} ${String(times.length - 1).padStart(2)} cycles · ${per.toFixed(3)} s per cycle · loop ${(b - a).toFixed(2)} s`);
}
/* ---------- 4. Bani-Acharuli: 16 rhythms on the recording = 4 × (Dm Dm B♭ C), read from each rhythm's bass and chroma.
   The very first stroke comes a little early, so the loop is the last three chord cycles: rhythms 5–16. ---------- */
{
  const file = path.join(ROOT, BANI), r = C.track(file, 3, 'short', AC, false), FROM = 4, N = 12;
  if (r.starts.length < FROM + N) throw new Error(`Bani-Acharuli: ${r.starts.length} rhythms tracked, ${FROM + N} expected`);
  const times = []; for (let j = FROM; j < FROM + N; j++) times.push(strokeTimes(r, j));
  const P = (times[N - 1][0] - times[0][0]) / (N - 1), a = times[0][0] - .012, b = times[N - 1][0] + P - .012;
  const { x, sr } = W.readWav(file);
  SOUNDS.bani = Object.assign({ id: 'bani-acharuli', song: 'bani-acharuli', cycle: ['Dm', 'Dm', 'B♭', 'C'], period: +P.toFixed(4) }, bake('bani-acharuli', BANI, a, b, times, sr, x));
  report.push(`bani-acharuli  ${N} rhythms · ${P.toFixed(3)} s per rhythm · loop ${(b - a).toFixed(2)} s`);
}
/* ---------- 5. სამივე სიმი: the open strings together. Four strokes, every one a down stroke (the low A sounds first in
   each, measured string by string): a slow arpeggio (A, then C♯ +182 ms, E +347 ms) and three strums, tighter each time
   (144, 101, 48 ms). The strums become the app's recorded open-chord down stroke (round robin); the arpeggio's timing is
   what the tuner's "all three strings" follows. As recorded, A is 10 cents above C♯ and E, so the chord plays at the
   strings' mean pitch; the up stroke, not recorded, is built from the single notes. ---------- */
{
  const { x, sr } = W.readWav(path.join(ROOT, SAMIVE));
  const on = W.onsets(x, sr, { minGap: 1.5, k: 1.5, floor: .1 }).list.filter(p => { let pk = 0; for (let j = Math.round(p.t * sr); j < Math.round(p.t * sr) + 2400; j++) pk = Math.max(pk, Math.abs(x[j] || 0)); return pk > .5; });
  if (on.length !== 4) throw new Error(`სამივე სიმი: ${on.length} strokes found, 4 expected`);
  // the strings' own pitch, from the sustain after each stroke
  const pitch = (t, f) => { const N = 65536, L = sr, s0 = Math.round(t * sr), re = new Float64Array(N), im = new Float64Array(N); for (let i = 0; i < L && s0 + i < x.length; i++) re[i] = x[s0 + i] * (.5 - .5 * Math.cos(2 * Math.PI * i / L)); W.fft(re, im);
    const m = k => Math.hypot(re[k], im[k]); let bk = Math.round(f * .97 * N / sr); for (let k = bk; k <= Math.round(f * 1.03 * N / sr); k++) if (m(k) > m(bk)) bk = k; const a = Math.log(m(bk - 1)), b = Math.log(m(bk)), c = Math.log(m(bk + 1)); return (bk + .5 * (a - c) / (a - 2 * b + c)) * sr / N; };
  const chords = [];
  for (let k = 1; k < 4; k++) {
    const t = on[k].t, end = k + 1 < on.length ? on[k + 1].t - .03 : x.length / sr, a = Math.round((t - .012) * sr), b = Math.round(Math.min(t + 3.0, end) * sr), y = x.slice(a, b), fo = Math.round(.3 * sr);
    let pk = 0; for (const v of y) pk = Math.max(pk, Math.abs(v)); const g = .9 / pk;
    for (let i = 0; i < y.length; i++) { y[i] *= g; if (i < 96) y[i] *= i / 96; if (i > y.length - fo) y[i] *= Math.pow((y.length - i) / fo, 2); }
    const hzs = [[1, 220], [2, 277.18], [3, 329.63]].map(([s0, f]) => +pitch(t + .5, f * Math.pow(2, 0)).toFixed(2));
    const file = `strings/chord-0-0-0-down-${k}.mp3`;
    total += write(path.join(MEDIA, file), mp3(y, sr, 112));
    let att = 0; while (att < y.length && Math.abs(y[att]) < .05) att++;
    chords.push({ shape: '0-0-0', dir: 'down', file, hz: hzs, start: +(DELAY + Math.max(0, att / sr - .003)).toFixed(4) });
    report.push(`chord 0-0-0 down #${k}  ${hzs.join(' · ')} Hz  ${(y.length / sr).toFixed(2)} s`);
  }
  SOUNDS.chords = chords;
  // the arpeggio: when each string starts (onset of each string's attack, s) and how loud (peak)
  const arp = W.onsets(x, sr, { minGap: .04, k: 1.3, floor: .03 }).list.filter(p => { if (p.t > on[1].t - .5) return false; let pk = 0; for (let j = Math.round(p.t * sr); j < Math.round((p.t + .03) * sr); j++) pk = Math.max(pk, Math.abs(x[j])); return pk > .8; }).slice(0, 3);   // a string's own attack, not the ring of the one before
  report.push(`arpeggio  ${arp.map(p => ((p.t - arp[0].t) * 1000).toFixed(0) + ' ms').join(' · ')}  (tuner chord)`);
}
const js = `/* Generated by sounds/make.cjs from the supplied recordings — do not edit by hand.
   strings[s][f]: one recorded note per fret (hz = the pitch as recorded; the app plays it at the fret's exact pitch).
   rhythms[id]: recordings of the rhythm, slow to fast; loop = [start, end] in seconds of the decoded file,
   cycles = the time of every stroke of every cycle inside the loop (stroke order = the rhythm's own order).
   bani: the Bani-Acharuli loop; cycles = one entry per rhythm of the chord cycle Dm Dm B♭ C.
   chords: recorded whole-chord strokes (shape, direction; hz = each string's pitch as recorded). */
PD.SOUNDS = ${JSON.stringify(SOUNDS)};
`;
write(path.join(SRC, 'src/sounddata.js'), Buffer.from(js));
console.log(report.join('\n'));
console.log('total mp3', (total / 1024).toFixed(0), 'KB · sounddata.js', (js.length / 1024).toFixed(1), 'KB');
