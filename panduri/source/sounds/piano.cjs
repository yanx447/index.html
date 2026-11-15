/* Builds the app's piano from the supplied recording of every key.

     node sounds/piano.cjs            (from panduri/source; reads the WAV from the repository root)

   In   MUSIC/Every_Note_Piano.wav       two reference beeps (0 s, 1 s), then all 88 keys, A0 → C8, one every 2 s
   Out  ../app/media/piano/p<midi>.mp3   one note each (mono), for PD.audio.piano
        src/pianodata.js                 PD.PIANO: pitch of every note as recorded, its start, a level correction

   Nothing is guessed silently: there must be exactly 88 notes after the beeps, each note's pitch is measured and must
   lie within 60 cents of its own key (the top octave of a piano is tuned sharp on purpose — "stretch" — so the app
   re-tunes every note to the exact pitch by its playback rate, as it does with the panduri). */
const fs = require('fs'), path = require('path');
const W = require('./wav.cjs'), lamejs = require('./lame.cjs');
const ROOT = path.resolve(__dirname, '../../..'), SRC = path.resolve(__dirname, '..'), OUT = path.resolve(SRC, '../app/media/piano');
const FILE = 'MUSIC/Every_Note_Piano.wav', FIRST = 21, KEYS = 88;
const DELAY = 1089 / 48000;   // MP3 encoder + decoder delay (measured for these encoder settings, see make.cjs)
const hz = m => 440 * Math.pow(2, (m - 69) / 12);
const LIMIT = m => m >= 96 ? 90 : 60;   // the top octave is stretched (C7 +15 … C8 +69 cents on this piano)

function mp3(x, sr, kbps) {
  const enc = new lamejs.Mp3Encoder(1, sr, kbps), n = x.length, pcm = new Int16Array(n), out = [];
  for (let i = 0; i < n; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(x[i] * 32767)));
  for (let i = 0; i < n; i += 1152 * 16) { const b = enc.encodeBuffer(pcm.subarray(i, i + 1152 * 16)); if (b.length) out.push(Buffer.from(b.buffer, b.byteOffset, b.length)); }
  const e = enc.flush(); if (e.length) out.push(Buffer.from(e.buffer, e.byteOffset, e.length));
  return Buffer.concat(out);
}
/** power of one frequency over a window (Goertzel, Hann-windowed) */
function power(x, q, N, f, sr) {
  const w = 2 * Math.PI * f / sr, c = 2 * Math.cos(w); let s1 = 0, s2 = 0;
  for (let i = 0; i < N; i++) { const s0 = x[q + i] * (.5 - .5 * Math.cos(2 * Math.PI * i / N)) + c * s1 - s2; s2 = s1; s1 = s0; }
  return s1 * s1 + s2 * s2 - c * s1 * s2;
}
/** the pitch the ear hears, in cents from the key: YIN for the low and middle keys (median of frames over the first
    0.6 s); from C6 up, where a period is only a few dozen samples, the strongest frequency within ±80 cents instead */
function cents(x, sr, t, m) {
  const f0 = hz(m);
  if (m >= 84) {
    const q = Math.round((t + .06) * sr), N = Math.round(sr * .25); let best = -1, bc = 0;
    for (let c = -80; c <= 80; c += .5) { const p = power(x, q, N, f0 * Math.pow(2, c / 1200), sr); if (p > best) { best = p; bc = c; } }
    return { c: bc, spread: 0 };
  }
  const cs = [], N = m < 45 ? 12000 : 6000;
  for (let u = t + .08; u < t + .7; u += .04) {
    const q = Math.round(u * sr); if (q + N > x.length) break;
    const f = W.yin(x.subarray(q, q + N), sr, f0 * .84, f0 * 1.19), c = 1200 * Math.log2(f / f0);
    if (isFinite(c) && Math.abs(c) < 150) cs.push(c);
  }
  cs.sort((a, b) => a - b);
  const med = cs[cs.length >> 1], q1 = cs[cs.length >> 2], q3 = cs[(cs.length * 3) >> 2];
  return { c: med, spread: q3 - q1 };
}

const r = W.readWav(path.join(ROOT, FILE)), x = r.x || r, sr = r.sr || 48000;
// onsets: a rise of more than 8 dB within 30 ms, above -50 dB, at least 0.6 s after the previous one
const H = Math.round(sr * .01), E = [];
for (let i = 0; i + H <= x.length; i += H) { let e = 0; for (let k = i; k < i + H; k++) e += x[k] * x[k]; E.push(10 * Math.log10(e / H + 1e-12)); }
const on = []; for (let i = 3; i < E.length; i++) if (E[i] - E[i - 3] > 8 && E[i] > -50 && (!on.length || i - on[on.length - 1] > 60)) on.push(i);
const notes = on.slice(2);
if (notes.length !== KEYS) throw new Error('expected ' + KEYS + ' notes after the two beeps, found ' + notes.length);

fs.mkdirSync(OUT, { recursive: true });
const data = {}; let bytes = 0; const report = [], bad = [];
notes.forEach((fi, k) => {
  const m = FIRST + k, t0 = fi / 100;
  // the attack: the first sample within ±40 ms of the onset frame that reaches 15 % of the note's early peak, less 3 ms
  const a = Math.max(0, Math.round((t0 - .04) * sr)), b = Math.round((t0 + .12) * sr);
  let pk = 0; for (let i = a; i < b; i++) pk = Math.max(pk, Math.abs(x[i]));
  let st = a; while (st < b && Math.abs(x[st]) < pk * .15) st++;
  st = Math.max(0, st - Math.round(sr * .003));
  const next = k + 1 < notes.length ? Math.round(notes[k + 1] / 100 * sr) - Math.round(sr * .06) : x.length;
  let len = Math.min(next - st, Math.round(sr * 1.94));
  // the tail: cut where the note has died 60 dB below its peak
  const env = Math.round(sr * .02); let last = len;
  for (let i = len - env; i > sr * .3; i -= env) { let e = 0; for (let j = 0; j < env; j++) e = Math.max(e, Math.abs(x[st + i + j])); if (e > pk * .001) { last = Math.min(len, i + env * 2); break; } }
  len = last;
  const y = x.slice(st, st + len), fade = Math.min(Math.round(sr * .12), len >> 2);
  for (let i = 0; i < fade; i++) y[len - 1 - i] *= i / fade;
  const pitch = cents(x, sr, st / sr, m);
  if (!(Math.abs(pitch.c) <= LIMIT(m))) bad.push(W.nameOf(m) + ' ' + pitch.c + '¢');
  // the top of the keyboard was played softer: half of the difference to the loudest notes is made up when played
  const pdB = 20 * Math.log10(pk + 1e-9), gain = Math.max(.6, Math.min(2.5, Math.pow(10, (-1.5 - pdB) * .5 / 20)));
  const buf = mp3(y, sr, 96); fs.writeFileSync(path.join(OUT, 'p' + m + '.mp3'), buf); bytes += buf.length;
  data[m] = { file: 'piano/p' + m + '.mp3', hz: +(hz(m) * Math.pow(2, pitch.c / 1200)).toFixed(3), start: +DELAY.toFixed(4), gain: +gain.toFixed(3) };
  report.push(W.nameOf(m) + (pitch.c >= 0 ? '+' : '') + pitch.c.toFixed(0) + (pitch.spread > 15 ? '~' + pitch.spread.toFixed(0) : '') + ' ' + (len / sr).toFixed(2) + 's');
});
if (bad.length) throw new Error('pitch too far from its key: ' + bad.join(', ') + '\n' + report.join(' · '));
fs.writeFileSync(path.join(SRC, 'src/pianodata.js'), '/* Generated by sounds/piano.cjs from MUSIC/Every_Note_Piano.wav — do not edit by hand.\n' +
  '   notes[midi]: one recorded key each (hz = the pitch as recorded; the app plays it at the exact pitch).\n' +
  '   start = where the note begins in the decoded file; gain = level correction (the top keys were played softer). */\n' +
  'PD.PIANO = ' + JSON.stringify({ first: FIRST, last: FIRST + KEYS - 1, notes: data }) + ';\n');
console.log(report.join(' · '));
console.log(KEYS + ' notes, ' + (bytes / 1024 / 1024).toFixed(2) + ' MB → ' + path.relative(ROOT, OUT));
