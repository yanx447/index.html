/* PANDURI Creator's measuring (src/crdsp.js) against known answers, in Node — no browser.
   node qa/creator-dsp.cjs [--bani path/to/bani-22050-mono.f32]
   1. a click track whose tempo moves: 90 BPM → a ramp to 130 → 130 → a jump to 100 (the beats are known exactly)
   2. Bani-Acharuli against the teacher's own beat map (songdata.js), when its decoded samples are given
   3. tablature: every note on a real string and fret, the hand path, nothing out of range moved silently
   4. MIDI, AIFF, WAV, peaks, tempo points, chord transposition */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { PD: {}, console, Math, Float32Array, Float64Array, Int8Array, Int16Array, Int32Array, Uint8Array, Uint32Array, DataView, ArrayBuffer, Buffer, String, Array, Object, Number, Set, Map, JSON, Error };
vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'crdsp.js'), 'utf8'), ctx);
const X = ctx.PD.crdsp;
let fails = 0, passes = 0; const ok = (c, m, extra) => { if (c) { passes++; console.log('  ✓ ' + m); } else { fails++; console.log('  ✗ ' + m + (extra != null ? ' — ' + JSON.stringify(extra).slice(0, 300) : '')); } };
const SR = 22050;

console.log('\n# 1. a tempo that moves (synthetic, the beats are known)');
const truth = []; { let t = .5; const bpmOf = x => x < 20 ? 90 : x < 30 ? 90 + (x - 20) * 4 : x < 50 ? 130 : 100; while (t < 70) { truth.push(+t.toFixed(4)); t += 60 / bpmOf(t); } }
const y = new Float32Array(Math.ceil(72 * SR)); let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < y.length; i++) y[i] = (rnd() - .5) * .02;
truth.forEach((t, k) => { const s = Math.round(t * SR), f = [220, 277, 330][k % 3], acc = k % 2 ? .45 : .8; for (let j = 0; j < SR * .12 && s + j < y.length; j++) { const e = Math.exp(-j / (SR * .03)); y[s + j] += acc * e * (Math.sin(2 * Math.PI * f * j / SR) + .5 * Math.sin(2 * Math.PI * f * 2 * j / SR) + .3 * (rnd() - .5)); }
  if (k % 2 === 0) { const s2 = s + Math.round(60 / 100 / 2 * SR * .9); for (let j = 0; j < SR * .06 && s2 + j < y.length; j++) y[s2 + j] += .18 * Math.exp(-j / (SR * .02)) * (rnd() - .5); } });
const T = X.tempo(y, SR), F = X.beatF(T.beats, truth);
const near = (t, v) => { const c = T.curve.reduce((a, b) => Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a); return Math.abs(c.bpm - v) <= v * .05; };
ok(F >= .9, 'beats follow the moving tempo: F = ' + F.toFixed(3));
ok(near(10, 90) && near(40, 130) && near(60, 100), 'the tempo curve reads 90 → 130 → 100', T.curve.filter((c, i) => i % 5 === 0).map(c => [c.t, c.bpm]));
const one = []; { const L = 60 / 108; for (let t = truth[0]; t < 70; t += L) one.push(t); }
ok(X.beatF(one, truth) < .5, 'one fixed tempo could not follow it (F ' + X.beatF(one, truth).toFixed(2) + ') — the reason for a tempo map');
const P = X.tempoPoints(T.beats, 3);
ok(P.length >= 3 && P.length <= 14, P.length + ' tempo points describe it', P);
ok(P.some(p => p.ramp), 'the gradual part is a ramp');
const R = X.beatsFrom([{ t: 0, bpm: 90, ramp: true }, { t: 10, bpm: 130 }], 0, 20);
ok(Math.abs(60 / (R[1] - R[0]) - 90) < 3 && Math.abs(60 / (R[R.length - 1] - R[R.length - 2]) - 130) < 3, 'a ramp from the owner\'s tempo points makes beats that speed up 90 → 130');

console.log('\n# 2. Bani-Acharuli against the teacher\'s beat map');
const bi = process.argv.indexOf('--bani'), bf = bi > 0 ? process.argv[bi + 1] : path.join(__dirname, '..', '..', '..', '..', 'bani22.f32');
if (fs.existsSync(bf)) {
  const b = fs.readFileSync(bf), mono = new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4);
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'songdata.js'), 'utf8'), m = /'bani-acharuli'[\s\S]*?beats: \[([\s\S]*?)\]/.exec(src), ref = m[1].split(',').map(Number).filter(Number.isFinite);
  const t0 = Date.now(), B = X.tempo(mono, SR), ms = Date.now() - t0, Fb = X.beatF(B.beats, ref);
  ok(Fb >= .9, 'Bani: beats F = ' + Fb.toFixed(3) + ' against ' + ref.length + ' teacher beats (' + (ms / 1000).toFixed(1) + ' s for ' + (mono.length / SR).toFixed(0) + ' s of audio)');
  ok(Math.abs(B.bpm - 100) < 3, 'Bani: ' + B.bpm + ' BPM (the teacher\'s map: 100)');
  const st = X.strokes(B.env, B.beats, { sub: 3 });
  ok(st.length > B.beats.length * 1.5, st.length + ' strokes found over ' + B.beats.length + ' beats (Acharuli: three places a beat)');
} else console.log('  (skipped: no decoded Bani at ' + bf + ')');

console.log('\n# 3. tablature on A3 · C♯4 · E4, 17 frets');
const mel = [64, 66, 68, 69, 71, 73, 74, 76, 78, 80, 81, 76, 73, 69, 64, 57, 61, 64, 45, 90].map((mm, i) => ({ t: i * .25, d: .22, m: mm }));
const tb = X.tabulate(mel, { open: [57, 61, 64], frets: 17 });
ok(tb.out.length === 2 && tb.out.includes(18) && tb.out.includes(19), 'the two notes out of range (A2, F♯6) are reported, not moved', tb.out);
ok(tb.tab.every((r, i) => tb.out.includes(i) ? r === null : r && [57, 61, 64][r.s - 1] + r.f === mel[i].m), 'every other note: its string and fret sound that very pitch');
ok(tb.tab.filter(Boolean).every(r => r.f === 0 ? r.fi === 0 : r.fi >= 1 && r.fi <= 4), 'fingers 1–4, open strings 0');
const jumps = tb.tab.filter(Boolean).reduce((a, r, i, arr) => a + (i && r.f && arr[i - 1].f ? Math.abs(r.f - arr[i - 1].f) : 0), 0);
ok(jumps < 40, 'the hand path is short: ' + jumps + ' frets of shifts over ' + mel.length + ' notes');
const fit = X.fitRange(mel, 'octave', { lo: 57, hi: 81 });
ok(fit.notes[18].m === 57 && fit.notes[19].m === 78 && fit.notes[3].m === 69, 'octave transposition moves only the two that do not fit (A2→A3, F♯6→F♯5)');
const tr = X.fitRange(mel.map(n => ({ ...n, m: n.m - 12 })), 'transpose', { lo: 57, hi: 81 });
ok(tr.shift === 12, 'transposing the whole melody finds +12 for a melody an octave low', tr.shift);
const art = X.tabulate([{ t: 0, d: .2, m: 64 }, { t: .2, d: .2, m: 66 }, { t: .4, d: .03, m: 67 }, { t: .43, d: .3, m: 69 }], {});
ok(art.tab[1].art === 'h' && art.tab[2].art === 'gr', 'articulation: a legato step up is a hammer-on, a 30 ms note leaning on the next is a grace note', art.tab.map(r => r.art));

console.log('\n# 4. phrases, files, chords');
const sol = []; for (let p = 0; p < 4; p++) for (let i = 0; i < 6; i++) sol.push({ t: p * 3 + i * .3, d: .25, m: 64 + [0, 2, 4, 5, 4, 2][i] + (p === 2 ? 3 : 0) });
const PH = X.phrases(sol); ok(PH.length === 4, PH.length + ' phrases in a four-phrase solo');
ok(X.repeats(PH).join('') === 'AAAA', 'the same melody (also transposed) shares a letter: ' + X.repeats(PH).join(''));
// MIDI: format 0, 96 ticks, tempo 120 → 60 after one beat, two notes
const mid = Buffer.from([0x4d,0x54,0x68,0x64,0,0,0,6,0,0,0,1,0,96, 0x4d,0x54,0x72,0x6b,0,0,0,30, 0,0xff,0x51,3,0x07,0xa1,0x20, 0,0x90,69,100, 96,0x80,69,0, 0,0xff,0x51,3,0x0f,0x42,0x40, 0,0x90,71,90, 96,0x80,71,0, 0,0xff,0x2f,0]);
const M = X.midi(new Uint8Array(mid));
ok(M.notes.length === 2 && Math.abs(M.notes[1].t - .5) < 1e-3 && Math.abs(M.notes[1].d - 1) < 1e-3 && M.tempos.some(t => Math.abs(t.bpm - 60) < .01), 'MIDI: notes and the file\'s own tempo change', M.notes);
const w = X.wav([new Float32Array([0, .5, -.5, 1])], 8000); ok(w.byteLength === 52 && new DataView(w).getInt16(46, true) === 16383, 'WAV writer');
{ // AIFF: 1 channel, 3 frames, 16-bit, 44100
  const b = Buffer.alloc(12 + 26 + 16 + 6); b.write('FORM', 0); b.writeUInt32BE(b.length - 8, 4); b.write('AIFF', 8);
  b.write('COMM', 12); b.writeUInt32BE(18, 16); b.writeUInt16BE(1, 20); b.writeUInt32BE(3, 22); b.writeUInt16BE(16, 26); Buffer.from([0x40, 0x0e, 0xac, 0x44, 0, 0, 0, 0, 0, 0]).copy(b, 28);
  b.write('SSND', 38); b.writeUInt32BE(8 + 6, 42); b.writeUInt32BE(0, 46); b.writeUInt32BE(0, 50); b.writeInt16BE(16384, 54); b.writeInt16BE(-16384, 56); b.writeInt16BE(0, 58);
  const A = X.aiff(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)); ok(A.sr === 44100 && Math.abs(A.ch[0][0] - .5) < 1e-4 && Math.abs(A.ch[0][1] + .5) < 1e-4, 'AIFF reader (Chrome cannot decode AIFF)', [A.sr, A.ch[0][0]]); }
const pk = X.unpeaks(X.peaks(y.subarray(0, SR * 2), SR, 100)); ok(pk.pk.length === 400 && pk.R === 100, 'waveform peaks round-trip (100 per second)');
ok(X.transposeChord('Am', 2) === 'Bm' && X.transposeChord('B♭/D', 2) === 'C/E' && X.transposeChord('F♯m7', -1) === 'Fm7' && X.transposeChord('Cadd9', 5) === 'Fadd9', 'chord transposition keeps the quality and the bass');

console.log('\n' + passes + ' passed, ' + fails + ' failed'); process.exit(fails ? 1 : 0);
