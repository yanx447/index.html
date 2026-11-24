const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

function context(extra = {}, pd = {}) {
  return vm.createContext({ PD: { i18n: { add() {} }, ...pd }, window: { addEventListener() {} }, location: { pathname: '/panduri/app/', href: 'https://test.example/panduri/app/', protocol: 'https:' }, setTimeout, clearTimeout,
    Blob, File, URL, AbortController, btoa, ...extra });
}
function load(ctx, ...names) {
  for (const name of names) {
    const file = path.join(__dirname, '..', 'src', name + '.js');
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  }
  return ctx.PD;
}

test('PCM AudioWorklet yields a 24-bit stereo WAV at the actual capture rate', async () => {
  let Processor;
  class Worklet {
    constructor() { this.port = { postMessage() {} }; }
  }
  class Node {
    constructor() {
      this.processor = new Processor();
      this.port = {
        postMessage: data => this.processor.port.onmessage({ data }),
        close() {}
      };
      this.processor.port.postMessage = data => this.port.onmessage({ data });
    }
    disconnect() {}
  }
  let node;
  const AudioWorkletNode = class extends Node { constructor() { super(); node = this; } };
  const ctx = context({
    window: { AudioWorkletNode }, AudioWorkletNode, AudioWorkletProcessor: Worklet,
    registerProcessor: (name, cls) => { assert.equal(name, 'pd-community-pcm'); Processor = cls; },
    MediaStream: class {}
  });
  const music = load(ctx, 'music-community').musicCommunity;
  const audio = {
    sampleRate: 48000,
    audioWorklet: { addModule: async url => vm.runInContext(await (await fetch(url)).text(), ctx) },
    createMediaStreamSource: () => ({ connect() {}, disconnect() {} })
  };
  const input = await music.pcm(audio, {}, 600);
  node.processor.process([[Float32Array.of(1), Float32Array.of(-1)]]);
  input.start();
  node.processor.process([[Float32Array.of(.5, 0), Float32Array.of(-.5, 0)]]);
  input.pause();
  node.processor.process([[Float32Array.of(.9), Float32Array.of(.9)]]);
  input.resume();
  node.processor.process([[Float32Array.of(.25), Float32Array.of(-.25)]]);
  const result = await input.stop();
  const wav = Buffer.from(await result.blob.arrayBuffer());
  assert.equal(result.blob.type, 'audio/wav');
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt16LE(22), 2);
  assert.equal(wav.readUInt32LE(24), 48000);
  assert.equal(wav.readUInt16LE(34), 24);
  assert.equal(wav.readUInt32LE(40), 18);
  assert.deepEqual([...wav.subarray(44, 50)], [0, 0, 64, 1, 0, 192]);
  assert.deepEqual([...wav.subarray(56, 62)], [0, 0, 32, 0, 0, 224]);
  assert.equal(result.dur, 3 / 48000);
});

test('the take clock counts only active sections and keeps 720p in either orientation', () => {
  const music = load(context(), 'music-community').musicCommunity;
  let now = 0;
  const clock = music.captureClock(() => now);
  clock.start();
  now = 3500;
  assert.equal(clock.pause(), 3.5);
  now = 18000;
  assert.equal(clock.seconds(), 3.5);
  clock.resume();
  now = 22500;
  assert.equal(clock.pause(), 8);
  clock.start();
  assert.equal(clock.seconds(), 0);
  assert.ok(music.isHD(720, 1280) && music.isHD(1280, 720) && music.isHD(3840, 2160));
  assert.ok(!music.isHD(719, 1280) && !music.isHD(1920, 480) && !music.isHD(NaN, 720));
});

test('edited PCM round-trips through a WAV header and FLAC requires STREAMINFO', async () => {
  const music = load(context(), 'music-community').musicCommunity;
  const wave = await music.encodeWav({
    numberOfChannels: 1, length: 4, sampleRate: 48000,
    getChannelData: () => Float32Array.of(0, -.5, 1, -1)
  }, 1, () => false, () => {});
  assert.equal(wave.type, 'audio/wav');
  assert.equal(wave.size, 54);
  const info = await music.losslessInfo(wave);
  assert.equal(info.codec, 'wav');
  assert.equal(info.bits, 24);
  assert.equal(info.seconds, 3 / 48000);
  const samples = new DataView(await wave.arrayBuffer());
  assert.equal(samples.getUint32(40, true), 9);
  assert.equal(samples.getUint8(53), 0);

  const flac = Buffer.alloc(46);
  flac.write('fLaC');
  flac[4] = 128;
  flac[7] = 34;
  flac.writeBigUInt64BE((96000n << 44n) | (1n << 41n) | (23n << 36n) | 192000n, 18);
  const lossless = await music.losslessInfo(new Blob([flac]));
  assert.equal(lossless.codec, 'flac');
  assert.equal(lossless.bits, 24);
  assert.equal(lossless.channels, 2);
  assert.equal(lossless.seconds, 2);
  assert.equal(await music.losslessInfo(new Blob(['ID3compressed'], { type: 'audio/wav' })), null);
  assert.equal(await music.losslessInfo(new Blob([flac.subarray(0, 42)])), null);

  const badWav = Buffer.from(await wave.arrayBuffer());
  badWav.writeUInt16LE(85, 20);
  assert.equal(await music.losslessInfo(new Blob([badWav])), null);
});

test('video capture skips encoders that report support but fail to start', () => {
  const cache = new Map();
  const MediaRecorder = { isTypeSupported: () => true };
  const ctx = context({ window: { MediaRecorder }, MediaRecorder }, {
    store: { get: (k, fallback) => cache.get(k) ?? fallback, set: (k, v) => cache.set(k, v), del: k => cache.delete(k) }
  });
  const { vedit } = load(ctx, 'mixrack', 'vedit');
  const initial = vedit.pickFormat();
  assert.match(initial.m, /^video\/mp4/);
  vedit.rememberFormat(initial);
  vedit.rejectEncoder(initial.m);
  const alternate = vedit.pickFormat('video/webm');
  assert.match(alternate.m, /^video\/webm/);
  vedit.rememberFormat(alternate);
  assert.equal(vedit.pickFormat().m, alternate.m);
});

test('clip fades fit the retained section even when both controls exceed its length', () => {
  const { vedit } = load(context(), 'mixrack', 'vedit');
  const clip = { a: 2, b: 4, fadeIn: 3, fadeOut: 1 };
  assert.deepEqual(Array.from(vedit.fadeEdges(clip)), [1.5, .5]);
  assert.equal(vedit.fadeLevel(clip, 2), 0);
  assert.equal(vedit.fadeLevel(clip, 2.75), .5);
  assert.equal(vedit.fadeLevel(clip, 3.5), 1);
  assert.equal(vedit.fadeLevel(clip, 3.75), .5);
  assert.equal(vedit.fadeLevel(clip, 4), 0);
  assert.equal(vedit.fadeLevel({ a: 2, b: 4 }, 2), 1);
});

test('bypassed or inactive plugins do not cause an unedited clip to be re-encoded', () => {
  const { mixrack } = load(context(), 'mixrack');
  const { defaults, changed, tailSeconds } = mixrack;
  const audio = overrides => ({ ...defaults, ...overrides });
  assert.equal(changed(defaults), false);
  assert.equal(changed(audio({ threshold: -60, deFreq: 4300, tapeDrive: 12 })), false);
  assert.equal(changed(audio({ mid: 6, eqMask: 1 << 2, rev: 35, revOff: true, comp: 100, compOff: true })), false);
  assert.equal(tailSeconds(audio({ rev: 25, revOff: true, del: 40, delOff: true })), 0);
  assert.equal(changed(audio({ mid: 6 })), true);
  assert.equal(changed(audio({ deess: 30 })), true);
  assert.equal(changed(audio({ tape: 40 })), true);
  assert.equal(changed(audio({ lp: 6000 })), true);
});

test('noise profiling attenuates background while retaining a foreground tone', async () => {
  const { vedit } = load(context(), 'mixrack', 'vedit');
  const sr = 16000, len = sr * 2;
  const output = channels => {
    const data = Array.from({ length: channels }, () => new Float32Array(len));
    return { length: len, sampleRate: sr, numberOfChannels: channels, getChannelData: c => data[c] };
  };
  const source = output(2), ac = { createBuffer: output };
  for (let i = 0; i < len; i++) {
    const noise = .035 * Math.sin(2 * Math.PI * 600 * i / sr);
    const playing = i > sr ? .3 * Math.sin(2 * Math.PI * 2100 * i / sr) : 0;
    source.getChannelData(0)[i] = noise + playing;
    source.getChannelData(1)[i] = noise + playing * .7;
  }
  const after = await vedit.denoise(ac, source, .85, () => {}, () => false, .1);
  const amplitude = (buf, frequency, c) => {
    const ch = buf.getChannelData(c);
    let acc = 0;
    for (let i = 20000; i < 28000; i++) acc += ch[i] * Math.sin(2 * Math.PI * frequency * i / sr);
    return Math.abs(acc / 4000);
  };
  for (let c = 0; c < 2; c++) {
    assert.ok(amplitude(after, 600, c) < amplitude(source, 600, c) * .35);
    assert.ok(amplitude(after, 2100, c) > amplitude(source, 2100, c) * .85);
  }
});

test('instrument suggestions use model confidence and song posts keep international tags', () => {
  const { guard, musicCommunity } = load(context(), 'music-community', 'guard');
  const frame = (...categories) => ({ classifications: [{ categories }] });
  const result = guard.matchInstrument([
    frame({ categoryName: 'Piano', score: .92 }, { categoryName: 'Acoustic guitar', score: .42 }),
    frame({ categoryName: 'Singing', score: .84 }, { categoryName: 'Drum kit', score: .28 })
  ]);
  assert.deepEqual(Array.from(result), ['piano', 'vocals']);
  assert.deepEqual(Array.from(musicCommunity.tags('#ფოლკი #Jazz #JAZZ #日本語')), ['ფოლკი', 'jazz', '日本語']);
});

test('resumable upload continues from the server offset after a network interruption', async () => {
  const CHUNK = 6 * 1024 * 1024, responses = [];
  let lost = false, offset = 0;
  const request = async (url, opt) => {
    const headers = opt.headers;
    responses.push({ url, method: opt.method, offset: headers['Upload-Offset'], bytes: opt.body?.size });
    assert.equal(headers.Authorization, 'Bearer test-token');
    if (opt.method === 'POST') {
      assert.equal(headers['Upload-Length'], String(CHUNK + 17));
      return new Response(null, { status: 201, headers: { Location: '/storage/v1/upload/resumable/abc' } });
    }
    if (opt.method === 'HEAD') return new Response(null, { headers: { 'Upload-Offset': String(offset) } });
    assert.equal(Number(headers['Upload-Offset']), offset);
    offset += opt.body.size;
    if (!lost) { lost = true; throw new Error('network disappeared after the write'); }
    return new Response(null, { status: 204, headers: { 'Upload-Offset': String(offset) } });
  };
  const config = { url: 'https://project.supabase.co', key: 'test-key' };
  const session = { user: { id: 'member' }, access_token: 'test-token', expires_at: 9999999999 };
  const app = load(context({ fetch: request }, {
    store: { get: key => key === 'cloud.session' ? session : config, set() {}, del() {} },
    account: { configure() {} }, bus: { on() {} }
  }), 'cloud');
  const progress = [];
  const result = await app.cloud.storage.uploadResumable('member/p/video.mp4',
    new Blob([new Uint8Array(CHUNK + 17)], { type: 'video/mp4' }), fraction => progress.push(fraction));
  assert.equal(result, 'member/p/video.mp4');
  assert.match(responses[0].url, /^https:\/\/project\.storage\.supabase\.co/);
  assert.deepEqual(responses.map(({ method, offset, bytes }) => [method, offset, bytes]),
    [['POST', undefined, undefined], ['PATCH', '0', CHUNK], ['HEAD', undefined, undefined], ['PATCH', String(CHUNK), 17]]);
  assert.equal(progress.at(-1), 1);
});
