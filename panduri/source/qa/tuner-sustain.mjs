import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PitchTracker, State } from '../ext/sami-simi/js/tracker.js';

const quiet = { freq: 0, clarity: 0, periodicity: 0, rms: .001 };
const tone = { freq: 220, clarity: .99, periodicity: .99, rms: .08 };
function tracker() {
  const tr = new PitchTracker();
  tr.configure({ strings: [{ freq: 220 }], mode: 'manual', selected: 0 });
  tr.begin(0);
  for (let t = 0; t <= 1000; t += 25) tr.update(quiet, t);
  for (let t = 1025; t <= 1500; t += 25) tr.update(tone, t);
  assert.equal(tr.snap.state, State.IN_TUNE);
  assert.ok(tr.snap.inTuneMs > 0);
  return tr;
}

test('a new pluck earns its own sustained tuning time after a hold', () => {
  const tr = tracker();
  for (let t = 1525; t <= 2500; t += 25) tr.update(quiet, t);
  assert.equal(tr.snap.state, State.HOLD);
  let first;
  for (let t = 2525; t <= 3100; t += 25) {
    const snap = tr.update(tone, t);
    if (!first && snap.state === State.IN_TUNE) first = { ...snap };
  }
  assert.ok(first);
  assert.equal(first.inTuneMs, 0, 'the silent interval must not instantly complete a guided string');
  assert.ok(tr.snap.inTuneMs > 0, 'continuous sound still accumulates tuning time');
});

test('unstable measurements interrupt sustained tuning time', () => {
  const tr = tracker();
  for (let t = 1525; t <= 2000; t += 25) {
    tr.update({ ...tone, periodicity: .1, freq: 220 * 2 ** ((t % 50 ? 8 : -8) / 1200) }, t);
    if (tr.snap.state === State.UNSTABLE) break;
  }
  assert.equal(tr.snap.state, State.UNSTABLE);
  assert.equal(tr.snap.inTuneMs, 0);
});
