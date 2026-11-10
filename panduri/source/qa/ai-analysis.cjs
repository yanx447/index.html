/* Deterministic audio regressions: node qa/ai-analysis.cjs */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const PD = { i18n: { add() {} }, theory: { a4: () => 440, CHORD_TYPES: [{ k: '', iv: [0, 4, 7] }, { k: 'm', iv: [0, 3, 7] }] } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/ai.js'), 'utf8'), { PD, location: { pathname: '/', protocol: 'https:' }, setTimeout, URL, console });
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
