/* Deterministic audio regressions: node qa/ai-analysis.cjs */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const PD = { i18n: { add() {} }, theory: { a4: () => 440, CHORD_TYPES: [{ k: '', iv: [0, 4, 7] }, { k: 'm', iv: [0, 3, 7] }] } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/ai.js'), 'utf8'), { PD, location: { pathname: '/', protocol: 'https:' }, setTimeout, URL, console });
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/aimus.js'), 'utf8'), { PD });
const sr = 22050;
const beats = Array.from({ length: 16 }, (_, i) => i / 2);
function chord(root, minor, seconds = 4) {
  const x = new Float32Array(Math.round(seconds * sr));
  for (const midi of [root, root + (minor ? 3 : 4), root + 7]) {
    const f = 440 * 2 ** ((midi - 69) / 12);
    for (let i = 0; i < x.length; i++) x[i] += .15 * Math.sin(2 * Math.PI * f * i / sr);
  }
  return x;
}
test('silence stays no-chord, including very short files', async () => {
  for (const length of [100, sr * 4]) {
    const r = await PD.ai.analyse(new Float32Array(length), sr, null, { beats });
    assert.ok(r.chords.length);
    assert.ok(r.chords.every(c => c.root === -1));
    assert.equal(r.chords.at(-1).t1, length / sr);
  }
});
test('major and minor triads in every key', async () => {
  for (let pc = 0; pc < 12; pc++) for (const minor of [false, true]) {
    const r = await PD.ai.analyse(chord(48 + pc, minor), sr, null, { beats, voc: 'simple' });
    const c = r.chords.find(c => c.t0 <= 2 && c.t1 > 2);
    assert.equal(c.root, pc, `root ${pc} minor ${minor}`);
    assert.equal(c.q, minor ? 'm' : '', `quality ${pc} minor ${minor}`);
  }
});
test('last chord and trailing silence cover the complete file', async () => {
  const a = chord(48, false, 2), b = chord(50, true, 2);
  const x = new Float32Array(sr * 6); x.set(a); x.set(b, a.length);
  const r = await PD.ai.analyse(x, sr, null, { beats, voc: 'simple' });
  assert.equal(r.chords.find(c => c.t0 <= 3 && c.t1 > 3).root, 2);
  assert.equal(r.chords.at(-1).root, -1);
  assert.equal(r.chords.at(-1).t1, 6);
  for (let i = 1; i < r.chords.length; i++) assert.equal(r.chords[i].t0, r.chords[i - 1].t1);
});
test('empty audio fails clearly', async () => {
  await assert.rejects(PD.ai.analyse(new Float32Array(), sr), /Empty or invalid audio/);
});

test('a transition between beats follows the audio', async () => {
  const change = 2.18;
  const a = chord(48, false, change), b = chord(50, true, 4 - change);
  const audio = new Float32Array(a.length + b.length);
  audio.set(a); audio.set(b, a.length);
  const r = await PD.ai.analyse(audio, sr, null, { beats, voc: 'simple' });
  const next = r.chords.find(c => c.root === 2 && c.q === 'm');
  assert.ok(next && Math.abs(next.t0 - change) < .07, JSON.stringify(r.chords));
  assert.equal(r.chords[r.chords.indexOf(next) - 1].t1, next.t0);
});

test('editing a chord start preserves a contiguous timeline', () => {
  const chords = [{ t0: 0, t1: 1 }, { t0: 1, t1: 2 }];
  assert.equal(PD.ai.setChordStart(chords, 1, 1.23), true);
  assert.deepEqual(chords, [{ t0: 0, t1: 1.23 }, { t0: 1.23, t1: 2 }]);
  for (const time of [-1, 0, 2, NaN]) assert.equal(PD.ai.setChordStart(chords, 1, time), false);
});

test('accents must repeat and have both attack and loudness contrast', () => {
  const beats = Array.from({ length: 33 }, (_, i) => i * .5);
  const dt = .01;
  function read(strength, volume) {
    const env = new Float32Array(1650), lev = new Float32Array(env.length);
    beats.slice(0, -1).forEach((time, index) => {
      const p = Math.round(time / dt), variation = 1 + Math.floor(index / 4) / 2;
      env[p] = strength[index % 4] * variation;
      lev[p + 2] = volume[index % 4] * variation;
    });
    return PD.aimus.rhythm({ env, lev, dt, t0off: 0 }, beats, { beatsPerBar: 4 }, [], []);
  }
  assert.equal(read([1, 1, 1, 1], [1, 1, 1, 1]).cells.some(c => c.acc), false);
  assert.equal(read([1, 2, 1, 1], [1, 1, 1, 1]).cells.some(c => c.acc), false);
  const result = read([1, 2, 1, 1], [1, 2, 1, 1]);
  assert.equal(result.cells.filter(c => c.acc).map(c => c.beat).join(','), '2');
});
