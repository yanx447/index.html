// Sima's check (src/guard.js) in a real browser: a clip is filmed with MediaRecorder from a canvas and plucked
// tones, then judged the way the camera judges it — the file's own sound decoded, five frames looked at. Also the
// microphone tap (AudioWorklet) and the WAV it writes. Usage: node qa/guard-browser.cjs
const { chromium } = require('playwright'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.setContent('<!doctype html><meta charset=utf-8><body></body>');
  await page.addScriptTag({ content: 'window.PD={i18n:{add(){}}};' + fs.readFileSync(path.join(__dirname, '../src/guard.js'), 'utf8') });
  const res = await page.evaluate(async () => {
    /** a clip: w×h, `scene` sharp | flat | dark, `sound` pluck | hum | none, `sec` seconds, `vbr` bits a second */
    async function film(o) {
      const cv = document.createElement('canvas'); cv.width = o.w; cv.height = o.h; const g = cv.getContext('2d');
      const ac = new AudioContext({ sampleRate: 48000 }); await ac.resume();
      const dst = ac.createMediaStreamDestination();
      const t0 = ac.currentTime + .1;
      if (o.sound !== 'none') {   // the room: a faint, even hiss (a real microphone always has one)
        const nb = ac.createBuffer(1, 48000 * o.sec, 48000), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * .002;
        const ns = ac.createBufferSource(); ns.buffer = nb; ns.connect(dst); ns.start(t0);
      }
      if (o.sound === 'pluck') {   // an A major strum (A3 · C♯4 · E4), five a second, each string dying away
        const ACC = [1, .35, .6, 0, 1, .35, .6, .35];   // one bar of eight: accents, and a rest
        for (let b = 0; b < o.sec * 5; b++) [220, 277.18, 329.63].forEach((f, k) => {
          const amp = ACC[b % 8]; if (!amp) return;
          const at = t0 + b * .2 + k * .012;
          [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].forEach(hn => { const os = ac.createOscillator(), gn = ac.createGain(); os.frequency.value = f * hn; gn.gain.setValueAtTime(.0001, at); gn.gain.exponentialRampToValueAtTime(.08 * amp / hn, at + .004); gn.gain.exponentialRampToValueAtTime(.0004, at + .6); os.connect(gn).connect(dst); os.start(at); os.stop(at + .62); });
        });
      } else if (o.sound === 'hum') {   // one held organ-like tone at 110 Hz with steady noise: not a panduri
        const os = ac.createOscillator(); os.type = 'sawtooth'; os.frequency.value = 110; const gn = ac.createGain(); gn.gain.value = .2; os.connect(gn).connect(dst); os.start(t0); os.stop(t0 + o.sec);
      }
      const v = cv.captureStream(30).getVideoTracks()[0];
      const tracks = [v].concat(o.sound === 'none' ? [] : dst.stream.getAudioTracks());
      const mime = ['video/webm;codecs=vp9,opus', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(new MediaStream(tracks), { mimeType: mime, videoBitsPerSecond: o.vbr, audioBitsPerSecond: 256000 });
      const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      let tick = 0; const draw = () => {
        tick++;
        if (o.scene === 'sharp') { const id = g.createImageData(o.w, o.h); for (let i = 0; i < id.data.length; i += 4) { const c = 60 + Math.random() * 150; id.data[i] = id.data[i + 1] = id.data[i + 2] = c; id.data[i + 3] = 255; } g.putImageData(id, 0, 0); }   // grain an encoder cannot squeeze, like a real sensor's
        else { g.fillStyle = o.scene === 'dark' ? '#0a0a0a' : '#8a8a8a'; g.fillRect(0, 0, o.w, o.h); }
      };
      const iv = setInterval(draw, 33); draw();
      rec.start(500); await new Promise(r => setTimeout(r, o.sec * 1000)); rec.stop(); await new Promise(r => rec.onstop = r); clearInterval(iv); ac.close();
      const blob = new Blob(chunks, { type: mime.split(';')[0] });
      return { blob, meta: { w: o.w, h: o.h, dur: o.sec, fps: 30 } };
    }
    const out = {};
    const cases = {
      good: { w: 1280, h: 720, scene: 'sharp', sound: 'pluck', sec: 6, vbr: 8e6 },
      small: { w: 640, h: 360, scene: 'sharp', sound: 'pluck', sec: 4, vbr: 4e6 },
      dark: { w: 1280, h: 720, scene: 'dark', sound: 'pluck', sec: 4, vbr: 8e6 },
      flat: { w: 1280, h: 720, scene: 'flat', sound: 'pluck', sec: 4, vbr: 8e6 },
      hum: { w: 1280, h: 720, scene: 'sharp', sound: 'hum', sec: 4, vbr: 8e6 },
      mute: { w: 1280, h: 720, scene: 'sharp', sound: 'none', sec: 3, vbr: 8e6 }
    };
    for (const k in cases) {
      const p = await film(cases[k]); const t = performance.now();
      const r = await PD.guard.check(p, { abr: 256000 });
      out[k] = { ok: r.ok, why: r.reasons.map(x => x[0].slice(5)), ms: Math.round(performance.now() - t), sharp: r.picture && r.picture.sharp && Math.round(r.picture.sharp), light: r.picture && Math.round(r.picture.light), bpp: r.picture && r.picture.bpp && +r.picture.bpp.toFixed(3), notes: r.sound && +r.sound.notes.toFixed(2), band: r.sound && Math.round(r.sound.band), stamp: PD.guard.stamp(r) };
    }
    // a file starved of bits (MediaRecorder will not make one: it ignores a request this low), judged on its numbers
    out.starved = { why: PD.guard.judgePicture({ w: 1280, h: 720, fps: 30, vbr: 3e5, bpp: 3e5 / (1280 * 720 * 30), sharp: 50, light: 120 }).map(x => x[0].slice(5)) };
    // the microphone tap: an oscillator's stream, taken sample for sample, written as WAV
    const ac = new AudioContext({ sampleRate: 48000 }); await ac.resume();
    const os = ac.createOscillator(), d = ac.createMediaStreamDestination(); os.frequency.value = 440; os.connect(d); os.start();
    const tp = PD.guard.tap(ac, d.stream.getAudioTracks()[0], 300); await tp.ready; await new Promise(r => setTimeout(r, 1500));
    const w = tp.stop(); const wav = w && PD.guard.wav(w.chs, w.sr, 24);
    const head = wav && new DataView(await wav.slice(0, 44).arrayBuffer());
    out.tap = w && { sec: +(w.chs[0].length / w.sr).toFixed(2), sr: w.sr, ch: w.chs.length, full: w.full, wavBytes: wav.size, bits: head.getUint16(34, true), rate: head.getUint32(24, true) };
    ac.close();
    return out;
  });
  for (const k in res) { const r = Object.assign({}, res[k]); delete r.stamp; console.log(k.padEnd(8), JSON.stringify(r)); }
  assert.equal(res.good.ok, true, 'a sharp HD clip with a plucked chord passes: ' + res.good.why);
  assert.ok(res.small.why.includes('small'), 'a 360p clip is refused');
  assert.ok(res.dark.why.includes('dark'), 'a dark clip is refused');
  assert.ok(res.flat.why.includes('blur'), 'a clip with nothing sharp in it is refused');
  assert.ok(res.starved.why.includes('bits'), 'a clip starved of bits is refused');
  assert.ok(!res.hum.ok, 'a held 110 Hz hum is not a panduri (refused as steady noise or out of range): ' + res.hum.why);
  assert.ok(res.mute.why.includes('noAudio') || res.mute.why.includes('silent'), 'a silent clip is refused');
  assert.ok(res.tap && res.tap.sec > 1 && res.tap.sr === 48000 && res.tap.bits === 24 && res.tap.rate === 48000, 'the tap records the microphone and writes 24-bit WAV');
  assert.deepEqual(errors, []);
  console.log('guard-browser: all as expected');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
