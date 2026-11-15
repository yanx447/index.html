const { test } = require('node:test');
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const values = new Map();
const PD = { store: { get: (k, v) => values.has(k) ? values.get(k) : v, set: (k, v) => values.set(k, v) }, bus: { on() {}, emit() {} }, i18n: { add() {}, t: (k, p) => k + (p?.n || '') } };
for (const f of ['instrument', 'theory', 'aiscore', 'aimus']) vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/' + f + '.js'), 'utf8'), { PD, Blob });
const A = PD.aiScore, note = (m, t0 = 0, t1 = 1) => ({ m, t0, t1, conf: .8 });
const M = notes => ({ notes: A.map(notes), metre: { num: 4, den: 4 }, bpm: 120, beats: [0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4], dur: 4, key: { r: 9, q: '' } });
function playable(ns) {
  for (const time of [...new Set(ns.flatMap(n => [n.t0, n.t1]))]) {
    const active = ns.filter(n => n.reach && n.t0 <= time && n.t1 > time);
    assert.equal(new Set(active.map(n => n.s)).size, active.length); assert.ok(A.shape(active), 'valid simultaneous shape');
    active.forEach(n => { assert.ok(Math.abs(PD.theory.midi(n.s, n.f) - n.m) < .5); assert.equal(n.finger, n.fi); });
  }
}
test('positions use tuner profile, octaves, 17 frets and A4 calibration', () => {
  assert.deepEqual(Array.from(A.places(64), p => [p.s, p.f]), [[1, 7], [2, 3], [3, 0]]);
  assert.equal(PD.theory.freq(PD.theory.open(1)), 220); values.set('a4', 442); assert.equal(PD.theory.freq(69), 442); values.delete('a4');
  assert.equal(A.places(82).length, 0); assert.ok(A.places(81).some(p => p.f === 17));
});
test('polyphonic open triad and sustained melody reserve different strings', () => {
  const ns = A.map([note(57, 0, 2), note(61, 0, 2), note(64, 0, .8), note(66, 1, 2)]); assert.ok(ns.every(n => n.reach)); playable(ns);
});
test('four voices and out-of-range notes retained and flagged without transposition', () => {
  const ns = A.map([note(57), note(61), note(64), note(69), note(40, 2, 3)]);
  assert.equal(ns.length, 5); assert.equal(ns.filter(n => !n.reach).length, 2); assert.equal(ns.find(n => n.m === 40).reason, 'range'); playable(ns);
});
test('held finger identity remains stable', () => { playable(A.map([note(62, 0, 3), note(66, 1, 2), note(69, 2, 3)])); });
test('editing pitch, timing and locked positions updates canonical model', () => {
  const n = A.map([note(64)])[0]; n.m = 66; n.t0 = .3; n.t1 = 1.8;
  const e = A.map([n])[0]; assert.equal(e.pitch, 66); assert.equal(e.onset, .3); assert.equal(e.duration, 1.5);
  const locked = A.map([{ ...note(64), s: 1, f: 7, lockPosition: true }])[0]; assert.equal(locked.s, 1); assert.equal(locked.f, 7);
});
test('arrangements remain playable and preserve original input', () => {
  const original = [note(64, 0, .5), note(68, .5, 1), note(81, 1, 2)], copy = JSON.stringify(original);
  for (const mode of ['original', 'easy', 'advanced', 'fingerstyle']) {
    const r = A.arrange(original, mode, [{ root: 9, q: '', t0: 0, t1: 3 }]); playable(r.notes);
    if (['easy', 'fingerstyle'].includes(mode)) assert.ok(r.notes.every(n => n.reach));
    if (mode === 'fingerstyle') assert.ok(r.notes.some(n => n.generated));
  }
  assert.equal(JSON.stringify(original), copy);
});
test('metric voices have complete bars, rests and cross-bar ties', () => {
  const s = A.score(M([note(57, .5, 3), note(64, 1, 1.5)])); assert.equal(s.bars, 2); assert.ok(s.events.some(e => e.tieIn)); assert.ok(s.events.some(e => e.tieOut));
  for (let b = 0; b < s.bars; b++) for (let v = 1; v <= s.voices; v++) assert.equal(s.events.filter(e => e.bar === b && e.voice === v).reduce((n, e) => n + e.len, 0), 4);
  assert.ok(s.events.some(e => !e.n));
});
test('MusicXML polyphony includes voices, backup, ties and exact measures', async () => {
  const xml = await A.musicXML(M([note(57, 0, 3), note(64, 0, 1)]), 'A & B').text();
  for (const re of [/A &amp; B/, /<backup><duration>16/, /<tie type="start"/, /<voice>2/, /<technical>/]) assert.match(xml, re);
});
test('compound metre includes silent bars', () => {
  const m = M([note(64, 0, .5)]); m.metre = { num: 6, den: 8, compound: true };
  const s = A.score(m); assert.equal(s.perBar, 3); assert.equal(s.bars, 4); assert.equal(s.events.filter(e => e.bar === 3).reduce((n, e) => n + e.len, 0), 3);
});
test('invalid notes fail explicitly', () => { assert.throws(() => A.map([note(NaN)])); assert.throws(() => A.map([note(60, 2, 1)])); });

test('JSON and text TAB export dense events, tuning and fingering without data loss', async () => {
 const m=M([note(64,0,.1),note(66,.1,.2),note(68,.2,.3)]);
 const json=JSON.parse(await PD.aimus.jsonOf(m,'test').text());
 assert.equal(json.notes.length,3); assert.equal(json.tuning.a4,440); assert.ok('finger' in json.notes[0]);
 const tab=PD.aimus.tabText(m,'test'); assert.match(tab,/tr.bar1/); assert.ok(tab.includes('E4'));
});
