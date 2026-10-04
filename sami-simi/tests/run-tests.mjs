// Offline test-suite for the tuning engine. Run:  node tests/run-tests.mjs
// Streams synthetic Panduri-like signals through the real detector + tracker at 30 Hz,
// exactly like the app does, and checks accuracy, direction, octave handling, noise,
// decay/hold, repeated plucks, auto string switching, calibration and transposition.

import { PitchDetector } from '../app/js/pitch-detector.js';
import { PitchTracker, State } from '../app/js/tracker.js';
import { TuningModel } from '../app/js/tuning.js';
import { instruction } from '../app/js/guidance.js';
import { renderPluck } from '../app/js/reference.js';

let pass = 0, fail = 0;
const ok = (cond, name, info = '') => {
  if (cond) { pass++; console.log('  ✓', name, info); }
  else { fail++; console.log('  ✗', name, info); }
};

// deterministic noise
let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

const SR = 48000;

/** harmonic-rich plucked tone with attack pitch glide, pick noise and per-harmonic decay */
function pluck(buf, start, f, { amp = 0.25, dur = 1.5, harm = [1, 0.8, 0.55, 0.35, 0.25, 0.15, 0.1], tau = 1.4, glide = 0.006, B = 0.00008 } = {}) {
  const n0 = Math.floor(start * SR), n = Math.floor(dur * SR);
  const ph = new Float64Array(harm.length);
  for (let i = 0; i < n && n0 + i < buf.length; i++) {
    const t = i / SR;
    const fi = f * (1 + glide * Math.exp(-t / 0.04));
    let s = 0;
    for (let h = 0; h < harm.length; h++) {
      const hf = (h + 1) * fi * Math.sqrt(1 + B * (h + 1) * (h + 1));
      ph[h] += (2 * Math.PI * hf) / SR;
      s += harm[h] * Math.exp(-t * (1 + h * 0.6) / tau) * Math.sin(ph[h]);
    }
    const pick = t < 0.012 ? gauss() * 0.6 * (1 - t / 0.012) : 0;
    const env = Math.min(1, t / 0.002);
    buf[n0 + i] += amp * env * (s * 0.45 + pick);
  }
}
const addNoise = (buf, rms) => { for (let i = 0; i < buf.length; i++) buf[i] += gauss() * rms; };

function run(buf, strings, cfg = {}, detectorOpts = {}) {
  const det = new PitchDetector(SR, { windowSize: 4096, ...detectorOpts });
  const tr = new PitchTracker();
  tr.configure({ strings, mode: 'auto', selected: 0, autoSens: true, sens: 6, tol: 3, ...cfg });
  tr.begin(0);
  const frames = [];
  const hop = SR / 30;
  for (let end = 4096; end <= buf.length; end += hop) {
    const e = Math.floor(end);
    const t = (e / SR) * 1000;
    const r = det.analyze(buf.subarray(e - 4096, e), tr.prior);
    const s = tr.update(r, t);
    frames.push({ t, ...s });
  }
  return frames;
}
const lastValid = (frames, from = 0, to = Infinity) =>
  frames.filter((f) => f.t >= from && f.t <= to && (f.state === State.VALID || f.state === State.IN_TUNE)).pop();

const model = new TuningModel();
const S = model.strings;
const cents = (f, c) => f * Math.pow(2, c / 1200);

console.log('\nString targets');
ok(Math.abs(S[0].freq - 220) < 1e-9 && Math.abs(S[1].freq - 277.1826) < 1e-3 && Math.abs(S[2].freq - 329.6276) < 1e-3,
  'A3 · C♯4 · E4 frequencies', S.map((s) => s.freq.toFixed(3)).join(' / '));
ok(model.label() === 'A · C♯ · E', 'label', model.label());

console.log('\nAccuracy — each string, exact and detuned (manual mode)');
for (const s of S) {
  for (const off of [0, -2, 2, -5, 5, -10, 10, -25, 25]) {
    const buf = new Float32Array(SR * 2.8);
    addNoise(buf, 0.0008);
    pluck(buf, 1.0, cents(s.freq, off));
    const fr = run(buf, S, { mode: 'manual', selected: s.index });
    const v = lastValid(fr, 1300, 2300);
    const err = v ? v.cents - off : NaN;
    const dir = v ? instruction(v.cents, 3).dir : NaN;
    const wantDir = Math.abs(off) <= 3 ? 0 : off < 0 ? 1 : -1;
    ok(v && Math.abs(err) < 0.6 && dir === wantDir && v.octaveOffset === 0,
      `${s.latin}${s.octave} ${off >= 0 ? '+' : ''}${off}¢`, v ? `measured ${v.cents.toFixed(2)}¢  (err ${err.toFixed(2)})` : 'no reading');
  }
}

console.log('\nHarmonics & octave errors');
{
  const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 220, { harm: [0.35, 1, 0.6, 0.45, 0.3, 0.2] }); // 2nd harmonic ≈ 3× fundamental
  const v = lastValid(run(buf, S, { mode: 'auto' }), 1300, 2400);
  ok(v && v.stringIndex === 0 && v.octaveOffset === 0 && Math.abs(v.cents) < 0.8, 'strong 2nd harmonic → still A3', v ? `${v.freq.toFixed(2)} Hz` : '');
}
{
  const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 329.63, { harm: [0.12, 1, 0.8, 0.5, 0.3] }); // weak fundamental
  const v = lastValid(run(buf, S, { mode: 'manual', selected: 2 }), 1300, 2400);
  ok(v && v.octaveOffset === 0 && Math.abs(v.cents) < 1, 'weak fundamental E4 → not an octave high', v ? `${v.freq.toFixed(2)} Hz, oct ${v.octaveOffset}` : '');
}
{
  const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 110);
  const v = lastValid(run(buf, S, { mode: 'manual', selected: 0 }), 1300, 2400);
  ok(v && v.octaveOffset === -1, 'string an octave too low (A2 on A3 string) → octave warning', v ? `oct ${v.octaveOffset}, ${v.freq.toFixed(2)} Hz` : '');
}
{
  const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 440, { harm: [1, 0.4, 0.2] });
  const v = lastValid(run(buf, S, { mode: 'manual', selected: 0 }), 1300, 2400);
  ok(v && v.octaveOffset === 1, 'string an octave too high → octave warning', v ? `oct ${v.octaveOffset}` : '');
}

{
  const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 220);
  const v = lastValid(run(buf, S, { mode: 'manual', selected: 2 }), 1300, 2400);
  ok(v && v.octaveOffset === 0 && Math.abs(v.cents + 700) < 1 && instruction(v.cents, 3).dir === 1,
    'wrong string (A3 played while tuning E4) → not octave-folded, says tighten', v ? `${v.cents.toFixed(1)}¢` : '');
}
{
  // detector alone on an ideal harmonic tone: no systematic bias
  const d = new PitchDetector(SR);
  let worst = 0;
  for (const f of [110, 220, 277.1826, 329.6276, 440, 659.26]) {
    const x = new Float32Array(4096);
    for (let i = 0; i < 4096; i++) { let v = 0; for (let k = 1; k <= 6; k++) v += Math.sin(2 * Math.PI * k * f * i / SR) / k; x[i] = 0.1 * v; }
    worst = Math.max(worst, Math.abs(1200 * Math.log2(d.analyze(x).freq / f)));
  }
  ok(worst < 0.1, 'detector bias on ideal harmonic tones (110–660 Hz)', `max ${worst.toFixed(3)}¢`);
}

console.log('\nNoise, weak signal, decay');
{
  const buf = new Float32Array(SR * 3); addNoise(buf, 0.02);
  const fr = run(buf, S);
  ok(!fr.some((f) => f.state === State.VALID || f.state === State.IN_TUNE), 'loud broadband noise only → never shows a pitch');
}
{
  const buf = new Float32Array(SR * 3); addNoise(buf, 0.004); // rehearsal-room-ish
  pluck(buf, 1.0, cents(277.18, -4), { amp: 0.12 });
  const v = lastValid(run(buf, S, { mode: 'auto' }), 1300, 2300);
  ok(v && v.stringIndex === 1 && Math.abs(v.cents + 4) < 1.2, 'moderate background noise, C♯ −4¢', v ? `${v.cents.toFixed(2)}¢` : '');
}
{
  const buf = new Float32Array(SR * 3); addNoise(buf, 0.0003);
  pluck(buf, 1.0, cents(220, 6), { amp: 0.012 });
  const v = lastValid(run(buf, S, { mode: 'auto' }), 1300, 2300);
  ok(v && Math.abs(v.cents - 6) < 1.2, 'weak pluck in a quiet studio', v ? `${v.cents.toFixed(2)}¢` : '');
}
{
  const buf = new Float32Array(SR * 3.4); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 220, { dur: 1.0, tau: 0.5 });
  const fr = run(buf, S);
  const holdF = fr.find((f) => f.t > 1500 && f.state === State.HOLD);
  const lastV = lastValid(fr);
  const backIdle = fr.find((f) => f.t > (lastV?.t ?? 0) + 200 && f.state === State.LISTENING);
  ok(!!holdF && !!backIdle && backIdle.t - lastV.t < 900, 'decay → hold → listening', holdF && backIdle ? `hold at ${holdF.t.toFixed(0)}ms, idle ${(backIdle.t - lastV.t).toFixed(0)}ms after last valid` : '');
  const vs = fr.filter((f) => f.t > 1200 && (f.state === State.VALID || f.state === State.IN_TUNE));
  const maxJump = Math.max(...vs.map((f) => Math.abs(f.cents)));
  ok(maxJump < 2, 'no needle jumps while the note fades', `max |cents| ${maxJump.toFixed(2)}`);
}
{
  const buf = new Float32Array(SR * 1.2); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 220, { dur: 0.2, glide: 0.03 }); // big attack glide, too short to settle
  const fr = run(buf, S);
  const early = fr.filter((f) => f.t >= 1000 && f.t < 1000 + 85 + 4096 / SR * 1000 * 0 && (f.state === State.VALID || f.state === State.IN_TUNE));
  ok(early.length === 0, 'attack transient is not shown as a reading');
}

console.log('\nRepeated plucks & string switching');
{
  const offs = [-8, 8, -8, 8, -8, 8];
  const buf = new Float32Array(SR * (1 + offs.length * 0.45 + 0.6)); addNoise(buf, 0.0008);
  offs.forEach((o, i) => pluck(buf, 1 + i * 0.45, cents(329.63, o), { dur: 0.45 }));
  const fr = run(buf, S, { mode: 'manual', selected: 2 });
  let good = 0;
  offs.forEach((o, i) => { const v = lastValid(fr, 1000 + i * 450 + 200, 1000 + i * 450 + 440); if (v && Math.sign(v.cents) === Math.sign(o) && Math.abs(v.cents - o) < 2.5) good++; });
  ok(good >= offs.length - 1, 'rapid plucks every 450 ms follow ±8¢ changes', `${good}/${offs.length}`);
}
{
  const seq = [0, 2, 1, 0];
  const buf = new Float32Array(SR * (1 + seq.length * 1.1 + 0.3)); addNoise(buf, 0.0008);
  seq.forEach((k, i) => pluck(buf, 1 + i * 1.1, cents(S[k].freq, 3 - 2 * i), { dur: 1.1 }));
  const fr = run(buf, S, { mode: 'auto' });
  const picked = seq.map((k, i) => lastValid(fr, 1000 + i * 1100 + 300, 1000 + i * 1100 + 1050)?.stringIndex);
  let switches = 0, prev = null;
  for (const f of fr) if (f.state === State.VALID || f.state === State.IN_TUNE) { if (prev != null && f.stringIndex !== prev) switches++; prev = f.stringIndex; }
  ok(picked.join() === seq.join() && switches === seq.length - 1, 'Auto mode: A → E → C♯ → A, no flapping', `picked ${picked.join(',')}, switches ${switches}`);
}
{
  // slowly de-tuned C♯ string at the A/C♯ boundary region (+1.9 semitones above A) → stays put, no flapping
  const buf = new Float32Array(SR * 3); addNoise(buf, 0.0008);
  pluck(buf, 1.0, cents(220, 190), { dur: 1.8 });
  const fr = run(buf, S, { mode: 'auto' });
  let switches = 0, prev = null;
  for (const f of fr) if (f.state === State.VALID || f.state === State.IN_TUNE) { if (prev != null && f.stringIndex !== prev) switches++; prev = f.stringIndex; }
  ok(switches === 0, 'ambiguous pitch between strings → hysteresis holds', `switches ${switches}`);
}

console.log('\nCalibration, transposition, octave');
{
  const m442 = new TuningModel({ a4: 442 });
  const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
  pluck(buf, 1.0, 221);
  const v = lastValid(run(buf, m442.strings, { mode: 'auto' }), 1300, 2300);
  ok(v && Math.abs(v.cents) < 0.6 && v.state === State.IN_TUNE, 'A4 = 442 Hz → 221 Hz is in tune', v ? `${v.cents.toFixed(2)}¢` : '');
}
{
  const mt = new TuningModel({ transpose: 1 });
  ok(mt.label() === 'B♭ · D · F', 'transpose +1 → B♭ · D · F', mt.label());
  const md = new TuningModel({ transpose: -1 });
  ok(md.label() === 'A♭ · C · E♭', 'transpose −1 → A♭ · C · E♭', md.label());
  const mo = new TuningModel({ octave: -1 });
  ok(mo.labelWithOctaves() === 'A2 · C♯3 · E3', 'low octave', mo.labelWithOctaves());
  const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
  pluck(buf, 1.0, cents(mt.strings[1].freq, -7));
  const v = lastValid(run(buf, mt.strings, { mode: 'auto' }), 1300, 2300);
  ok(v && v.stringIndex === 1 && Math.abs(v.cents + 7) < 0.8, 'transposed D string −7¢', v ? `${v.cents.toFixed(2)}¢` : '');
}

console.log('\nGuidance wording');
{
  const t = (c) => instruction(c, 3);
  ok(t(-40).text === 'მოუჭირე' && t(-40).dir === 1, 'far flat → მოუჭირე ↑');
  ok(t(-15).text === 'კიდევ ცოტათი მოუჭირე', 'mid flat → კიდევ ცოტათი მოუჭირე');
  ok(t(-6).text === 'ოდნავ მოუჭირე', 'near flat → ოდნავ მოუჭირე');
  ok(t(6).text === 'ოდნავ მოუშვი' && t(6).dir === -1, 'near sharp → ოდნავ მოუშვი ↓');
  ok(t(40).text === 'მოუშვი', 'far sharp → მოუშვი');
  ok(t(2.5).dir === 0, 'within tolerance → აწყობილია');
}

console.log('\nInharmonic partials (measured on a real panduri: H3 −17¢ on C♯4, H2 +6¢ / H3 −25¢ on E4)');
{
  // per-harmonic [cents offset, relative amplitude] taken from 1-second spectra of phone recordings
  const real = [
    { s: 1, p: [[0, 1], [3, 0.35], [-19, 0.6], [-5, 0.25], [1, 0.15]] },
    { s: 2, p: [[0, 1], [13, 0.6], [-18, 0.3], [-2, 0.25], [0, 0.12]] },
    { s: 0, p: [[0, 1], [5, 0.35], [-13, 0.55], [3, 0.2], [6, 0.4]] },
  ];
  for (const { s, p } of real) {
    for (const off of [0, -8, 8]) {
      const buf = new Float32Array(SR * 2.6); addNoise(buf, 0.0008);
      const f = cents(S[s].freq, off), n0 = SR;
      for (let i = 0; i < SR * 1.5; i++) {
        const t = i / SR; let v = 0;
        p.forEach(([c, a], h) => { v += a * Math.exp(-t * (1.6 + h)) * Math.sin(2 * Math.PI * (h + 1) * f * Math.pow(2, c / 1200) * t); });
        buf[n0 + i] += 0.2 * v * Math.min(1, t / 0.002);
      }
      const fr = run(buf, S, { mode: 'manual', selected: s });
      const v = lastValid(fr, 1300, 2300);
      ok(v && Math.abs(v.cents - off) < 1, `${S[s].latin}${S[s].octave} ${off >= 0 ? '+' : ''}${off}¢ with real-instrument partials`, v ? `measured ${v.cents.toFixed(2)}¢` : 'no reading');
    }
  }
}

console.log('\nChord recognition (panduri-voiced chords, overtones must not count as notes)');
{
  const music = await import('../app/js/music.js');
  const sp = new music.Spectrum(8192), T = S.map((s) => s.midi);
  let good = 0, total = 0; const miss = [];
  for (const name of ['A', 'D', 'E', 'Em', 'F#m', 'Bm', 'C#m', 'G', 'C', 'Am', 'Dm', 'B', 'F', 'A7', 'E7', 'D7', 'Asus4']) {
    const p = music.parseChord(name), f = music.fingering(p.root, p.q, T), want = music.chordName(p.root, p.q, 'en').short;
    const buf = new Float32Array(SR * 2);
    f.notes.forEach((m, i) => { const y = renderPluck(440 * 2 ** ((m - 69) / 12), SR, { stringIndex: i, duration: 1.9, seed: i + 3 }); const o = Math.floor(i * 0.02 * SR); for (let k = 0; k < y.length && k + o < buf.length; k++) buf[k + o] += y[k] * 0.3; });
    for (const t of [0.2, 0.5, 0.9, 1.4]) {
      const e = Math.floor(t * SR), prof = music.noteProfile(sp.compute(buf.subarray(e - 8192, e)), SR / 8192, 440, T);
      const m = music.matchChord(prof.chroma, prof.bass), got = music.chordName(m.root, m.q, 'en').short;
      total++; if (got === want) good++; else miss.push(`${want}@${t}s→${got}`);
    }
  }
  ok(good / total >= 0.95, 'chords recognised while ringing', `${good}/${total}${miss.length ? '  missed: ' + miss.join(', ') : ''}`);
}

console.log('\nAll three at once (one strum, each string measured)');
{
  const music = await import('../app/js/music.js');
  for (const offs of [[6, -3, -9], [0, 0, 0], [-12, 8, 3]]) {
    const buf = new Float32Array(SR * 2.4); addNoise(buf, 0.0008);
    S.forEach((s, i) => { const y = renderPluck(cents(s.freq, offs[i]), SR, { stringIndex: i, duration: 2.2, seed: i + 9 }); const o = Math.floor(i * 0.03 * SR); for (let k = 0; k < y.length && k + o < buf.length; k++) buf[k + o] += y[k] * 0.3; });
    const per = [[], [], []];
    for (let t = 0.6; t < 2.0; t += 0.05) { const e = Math.floor(t * SR); music.strumCheck(buf.subarray(e - 16384, e), SR, S.map((s) => s.freq), { n: 16384 }).forEach((q, i) => q.cents != null && per[i].push(q.cents)); }
    const got = per.map((a) => a.sort((p, q) => p - q)[a.length >> 1]);
    ok(got.every((g, i) => Math.abs(g - offs[i]) < 1), `strum ${offs.map((o) => (o >= 0 ? '+' : '') + o + '¢').join(' ')}`, `measured ${got.map((g) => g.toFixed(1)).join(' / ')}`);
  }
}

console.log('\nAccidentally changed settings');
{
  const { tuningChanges, recommended, StandardWatch } = await import('../app/js/drift.js');
  const { DEFAULTS } = await import('../app/js/settings.js');
  const base = { ...DEFAULTS };
  ok(tuningChanges(base).length === 0, 'recommended settings: no notice');
  const messy = { ...base, transpose: 2, a4: 445, lang: 'en', ui: 'simple', meter: 'strobe' };
  ok(tuningChanges(messy).map((c) => c.key).join() === 'transpose,a4', 'notice lists only tuning changes', tuningChanges(messy).map((c) => c.key).join());
  const r = recommended(messy);
  ok(r.transpose === 0 && r.a4 === 440 && r.lang === 'en' && r.ui === 'simple' && r.meter === 'strobe', 'restore keeps language and view');
  ok(tuningChanges(recommended({ ...base, autoSens: false, sens: 2, refVolume: 0 })).length === 0, 'restore fixes deaf sensitivity and silent reference');
  ok(tuningChanges({ ...base, autoSens: false, sens: 7 }).length === 0, 'normal manual sensitivity is not flagged');

  // stream real plucks through detector + tracker and feed the watch exactly like the app
  const watchRun = (settings, plucks) => {
    const m = new TuningModel(settings);
    const buf = new Float32Array(SR * (1 + plucks.length * 1.6)); addNoise(buf, 0.0008);
    plucks.forEach((f, k) => pluck(buf, 1 + k * 1.6, f));
    const det = new PitchDetector(SR), tr = new PitchTracker(), w = new StandardWatch();
    tr.configure({ strings: m.strings, mode: 'auto', selected: 0, autoSens: true, sens: 6, tol: 3 }); tr.begin(0);
    for (let e = 4096; e <= buf.length; e += SR / 30) {
      const i = Math.floor(e), s = tr.update(det.analyze(buf.subarray(i - 4096, i), tr.prior), (i / SR) * 1000);
      if ((s.state === 'valid' || s.state === 'intune' || s.state === 'unstable') && w.push(s.rawFreq, m.strings.map((x) => x.freq))) return (i / SR);
    }
    return null;
  };
  const std = [220, 277.1826, 329.6276];
  const t1 = watchRun({ ...base, transpose: 2 }, std);
  ok(t1 != null && t1 < 4.5, 'standard panduri + transposed settings → restored automatically', t1 ? `after ${t1.toFixed(1)} s` : 'not detected');
  const t2 = watchRun({ ...base, octave: 1 }, [220, 220]);
  ok(t2 == null, 'octave change alone is not mistaken (octave-folded targets still match)', t2 ? 'fired' : 'no false alarm');
  const t3 = watchRun({ ...base, transpose: 2 }, std.map((f) => f * Math.pow(2, 2 / 12)));
  ok(t3 == null, 'panduri really tuned up 2 semitones → no false alarm');
  const t4 = watchRun({ ...base, a4: 442 }, std);
  ok(t4 == null, 'small A4 change (442 Hz) → notice only, no automatic change');
}

console.log('\nAll chords in all positions (17 frets)');
{
  const music = await import('../app/js/music.js');
  const T = S.map((s) => s.midi);
  let bad = [], total = 0, few = [];
  for (const q of ['maj', 'min', '7', 'm7', 'sus4', 'dim']) for (let r = 0; r < 12; r++) {
    const list = music.voicings(r, q, T), tones = music.quality(q).iv.map((i) => music.pc(r + i));
    total += list.length;
    if ((q === 'maj' || q === 'min') && list.length < 3) few.push(music.chordName(r, q).short);
    for (const v of list) {
      const used = v.frets.filter((x) => x > 0);
      const okNotes = v.notes.every((m, i) => m === T[i] + v.frets[i] && tones.includes(music.pc(m)));
      const okHand = v.frets.every((x) => x >= 0 && x <= 17) && (!used.length || Math.max(...used) - Math.min(...used) <= 3);
      if (!okNotes || !okHand) bad.push(music.chordName(r, q).short + '[' + v.frets + ']');
    }
    const std = music.fingering(r, q, T).frets.join();
    if ((q === 'maj' || q === 'min') && !list.some((v) => v.frets.join() === std)) bad.push('standard ' + music.chordName(r, q).short + ' missing');
  }
  ok(!bad.length, 'every position has only chord tones and fits the hand', bad.length ? bad.slice(0, 5).join(', ') : `${total} positions checked`);
  ok(!few.length, 'every major and minor chord has ≥ 3 positions', few.join(', '));
  const a = music.voicings(9, 'maj', T).map((v) => v.frets.join());
  ok(['0,0,0', '4,3,5', '7,8,9', '12,12,12', '16,15,17'].every((x) => a.includes(x)), 'A major: open, both inversions, octave barré and up to fret 17', a.join(' | '));
}

console.log('\nReference tone pitch');
for (const sr of [48000, 44100]) {
  const det = new PitchDetector(sr);
  for (const s of S) {
    const y = renderPluck(s.freq, sr, { stringIndex: s.index });
    const cs = [0.3, 0.8, 1.5].map((t) => { const e = Math.floor(t * sr); const r = det.analyze(y.subarray(e - 4096, e)); return 1200 * Math.log2(r.freq / s.freq); });
    const worst = Math.max(...cs.map(Math.abs));
    ok(worst < 0.3, `reference ${s.latin}${s.octave} @ ${sr / 1000} kHz`, `max error ${worst.toFixed(3)}¢`);
  }
}

console.log('\nPerformance');
{
  const det = new PitchDetector(48000);
  const buf = new Float32Array(4096); for (let i = 0; i < 4096; i++) buf[i] = Math.sin(2 * Math.PI * 220 * i / 48000) + 0.3 * Math.sin(2 * Math.PI * 440 * i / 48000);
  for (let i = 0; i < 50; i++) det.analyze(buf);
  const t0 = performance.now(); const N = 400;
  for (let i = 0; i < N; i++) det.analyze(buf);
  const ms = (performance.now() - t0) / N;
  ok(ms < 3, 'analysis pass cost', `${ms.toFixed(3)} ms per pass → ${(ms * 30 / 10).toFixed(2)}% of one core at 30 Hz`);
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
