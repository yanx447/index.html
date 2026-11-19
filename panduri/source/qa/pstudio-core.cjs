/* Panduri Studio's music model (src/pstcore.js), on the app's real instrument and theory:
   places on the neck, a .panduri round trip, rhythm expansion with the teacher's strokes,
   MIDI out and back in, quantize / humanize / transpose. Usage: node qa/pstudio-core.cjs */
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const store = {}; global.window = global; global.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.PD = { i18n: { add() {}, pick: o => o.en || o, t: k => k }, bus: { on() {}, emit() {} }, store: { get: (k, d) => (k in store ? JSON.parse(store[k]) : d), set: (k, v) => { store[k] = JSON.stringify(v); }, del: k => { delete store[k]; } } };
const load = f => eval(fs.readFileSync(path.join(__dirname, '../src', f), 'utf8'));
['instrument.js', 'theory.js'].forEach(load);
try { load('curriculum.js'); } catch (e) { PD.curriculum = { rhythms: () => [], commonRhythms: () => [] }; console.log('(curriculum not loaded: ' + e.message.slice(0, 60) + ')'); }
load('pstcore.js');
const C = PD.pstCore, T = PD.theory;
// 1. the neck: A · C♯ · E open, 17 frets, from the instrument — string 1 is A (the bass)
assert.equal(T.midi(1, 0), 57); assert.equal(T.midi(2, 0), 61); assert.equal(T.midi(3, 0), 64);
assert.deepEqual(C.places(64).map(p => [p.s, p.f]), [[3, 0], [2, 3], [1, 7]]);   // E4: open E, C♯ string fret 3, A string fret 7
assert.deepEqual(C.placeFor(64, { s: 1 }), { s: 1, f: 7 });
const low = C.note({ m: 40, t: 0, d: 1 }); assert.equal(low.s, 0); assert.equal(C.reach(low), false);   // below the panduri: shown, never played as a panduri note
const top = C.note({ s: 3, f: 17, t: 0 }); assert.equal(top.m, 81);
// 2. a project, written and read back
const p = C.project('Test'); const solo = p.tracks.find(t => t.kind === 'notes');
solo.notes.push(C.note({ s: 1, f: 0, t: 0, d: 1 }), C.note({ m: 64, t: 1, d: .5, v: .9 }), low);
const back = C.parse(C.serialize(p));
assert.equal(back.tracks.length, 2); assert.deepEqual(back.tracks[1].notes.map(n => [n.m, n.s, n.f, n.t]), solo.notes.map(n => [n.m, n.s, n.f, n.t]));
assert.throws(() => C.parse('{"format":"x"}'), /not-panduri/); assert.throws(() => C.parse(JSON.stringify({ format: 'panduri-project', v: 99 })), /newer/);
// 3. rhythm: the teacher's strokes and accents, played as real strokes
const pr = C.presets(); console.log('presets:', pr.map(x => x.id + '(' + x.steps.map(s => (s.dir === 'down' ? '↓' : '↑') + (s.acc ? '!' : '')).join('') + ')').join(' '));
const kaz = pr.find(x => x.id === 'kazbeguri');
if (kaz) assert.deepEqual(kaz.steps.map(s => [s.dir, s.acc]), [['down', true], ['up', false], ['down', false]]);
const mti = pr.find(x => x.id === 'mtiuluri');
if (mti) assert.deepEqual(mti.steps.map(s => [s.dir, s.acc]), [['down', true], ['down', false], ['up', true], ['down', false], ['up', false]]);
const r = p.tracks[0]; r.rhythm.steps = C.steps([{ direction: 'down', accent: true }, { direction: 'up', accent: false }], [1, 1]); r.rhythm.bars = 2;
r.rhythm.chords = [{ bar: 0, name: 'Dm', frets: [0, 1, 1] }, { bar: 1, name: 'C', frets: [3, 3, 3] }];
const ev = C.rhythmEvents(p, r); assert.equal(ev.length, 8); assert.equal(ev[0].dir, 'down'); assert.equal(ev[1].dir, 'up'); assert.ok(ev[0].v > ev[1].v, 'the accent is louder');
assert.deepEqual(ev[4].frets, [3, 3, 3], 'bar 2 takes the next chord');
r.rhythm.steps[1].str = [0, 1, 1]; assert.deepEqual(C.rhythmEvents(p, r)[1].frets, [null, 1, 1], 'a stroke can skip a string');
// 4. MIDI out and back in
const mid = C.toMidi(p), parsed = C.fromMidi(mid);
assert.equal(Math.round(parsed.bpm), p.bpm); assert.deepEqual(parsed.meter, [4, 4]);
const pianoIn = parsed.tracks.find(t => t.name === 'Solo'); assert.ok(pianoIn, 'the solo track comes back by name');
assert.deepEqual(pianoIn.notes.map(n => [n.m, +n.t.toFixed(3)]), [[57, 0], [64, 1]], 'only the playable notes are written');
const rhyIn = parsed.tracks.find(t => t.name === 'Rhythm'); assert.equal(rhyIn.notes.length, 4 * 3 + 4 * 2, 'a down stroke is three string notes, the up stroke (set to skip A) two');
const up1 = rhyIn.notes.filter(n => n.t >= 1 && n.t < 1.1).sort((a, b) => a.t - b.t).map(n => n.m); assert.deepEqual(up1, [65, 62], 'an up stroke crosses from the E string down to C♯');
// 5. editing
assert.deepEqual(C.quantize([{ t: .27 }], .25).map(n => n.t), [.25]);
const h = C.humanize([{ t: 1, v: .5 }], .02, .1, 7)[0]; assert.ok(Math.abs(h.t - 1) <= .02 && Math.abs(h.v - .5) <= .1);
const up = C.transpose([C.note({ s: 1, f: 3, t: 0 })], 2)[0]; assert.equal(up.m, 62); assert.deepEqual([up.s, up.f], [1, 5]);
console.log('pstudio-core: all as expected —', p.tracks.length, 'tracks ·', ev.length, 'strokes ·', mid.length, 'MIDI bytes');
