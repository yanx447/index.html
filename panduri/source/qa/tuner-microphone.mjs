// Deterministic permission/lifecycle races without microphone hardware.
import assert from 'node:assert/strict';
import { AudioInput } from '../ext/sami-simi/js/audio-input.js';
const requests = [];
let failGraph = false;
const node = () => ({ frequency: {}, Q: {}, connect(other) { return other; }, disconnect() {} });
class Context {
  state = 'running'; sampleRate = 48000;
  createMediaStreamSource() { if (failGraph) throw Error('Graph failed'); return node(); }
  createBiquadFilter() { return node(); }
  createAnalyser() { return node(); }
}
globalThis.window = { isSecureContext: true, AudioContext: Context };
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
  mediaDevices: { getUserMedia() { return new Promise((resolve, reject) => requests.push({ resolve, reject })); } },
} });
function stream() {
  const track = { stopped: false, stop() { this.stopped = true; }, addEventListener(_, cb) { this.ended = cb; } };
  return { track, getTracks: () => [track], getAudioTracks: () => [track] };
}
const input = new AudioInput();
let first = input.start();
assert.equal(input.start(), first, 'concurrent starts share a permission request');
assert.equal(requests.length, 1);
input.stop();
let next = input.start();
const fresh = stream(); requests[1].resolve(fresh); await next;
const stale = stream(); requests[0].resolve(stale);
await assert.rejects(first, { code: 'cancelled' });
assert.ok(stale.track.stopped, 'late permission releases the unused microphone');
assert.equal(input.stream, fresh, 'late completion cannot replace the newer stream');
await input.start(); assert.equal(requests.length, 2, 'active microphone is reused');
input.stop(); assert.ok(fresh.track.stopped);
first = input.start(); input.stop();
requests[2].reject({ name: 'NotAllowedError' });
await assert.rejects(first, { code: 'cancelled' });
first = input.start(); requests[3].reject({ name: 'NotAllowedError' });
await assert.rejects(first, { code: 'denied' });
failGraph = true;
first = input.start(); const broken = stream(); requests[4].resolve(broken);
await assert.rejects(first, { code: 'unknown' });
assert.ok(broken.track.stopped, 'graph failure releases microphone');
assert.equal(input.active, false);
failGraph = false;
first = input.start(); const recovered = stream(); requests[5].resolve(recovered); await first;
fresh.track.ended(); assert.equal(input.stream, recovered, 'old track events cannot stop new input');
let ended = 0; input.onEnded = () => ended++;
recovered.track.ended(); assert.equal(ended, 1); assert.equal(input.active, false);
console.log('Microphone lifecycle: concurrent start, cancel, restart, denial, graph failure and track loss passed.');
