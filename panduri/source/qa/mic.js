// Feed a WAV through Chromium's fake microphone and log what the detector reports.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const WAV = process.argv[2] || 'audio/notes.wav', SEC = +(process.argv[3] || 20);
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + require('path').resolve(WAV) + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ permissions: ['microphone'] }); const p = await ctx.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); window.__ev = []; const t0 = performance.now();
    ['note', 'onset', 'release'].forEach(k => { try { PD.detector.on(k, m => window.__ev.push(Object.assign({ k, at: (performance.now() - t0) / 1000 }, m))); } catch (_) {} }); });
  const r = await p.evaluate(async () => { const r = await PD.detector.start(); return r; });
  console.log('start', JSON.stringify(r), await p.evaluate(() => PD.detector.status().mode));
  await p.waitForTimeout(SEC * 1000);
  const ev = await p.evaluate(() => window.__ev);
  const t00 = ev.length ? ev[0].t : 0;
  ev.forEach(e => console.log(e.k.padEnd(7), 't=' + (e.t - t00).toFixed(3), e.midi != null ? 'midi=' + e.midi.toFixed(2) + ' conf=' + (e.conf || 0).toFixed(2) + (e.unsure ? ' UNSURE' : '') : '', e.rms != null ? 'rms=' + e.rms.toFixed(3) : '', e.strength != null ? 'str=' + e.strength.toFixed(3) : '', e.dur != null ? 'dur=' + e.dur.toFixed(2) : ''));
  await b.close();
})();
