const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + require('path').resolve('audio/rhy60.wav') + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ permissions: ['microphone'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('C', m.type(), m.text().slice(0, 200)));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); PD.store.set('micExplained', true); const o = document.querySelector('.ob'); o && o.remove(); PD.engine.setCountIn(false);
    PD.practice.open(PD.lessons.get('poc-rhythm'), { wait: false, tempo: 1, mode: 'practice', metro: true }, 'poc-rhythm', 'metro'); });
  console.log('open:', await p.evaluate(() => PD.practice.active));
  console.log(await p.evaluate(async () => { const r = await PD.detector.start(); return JSON.stringify(r) + ' active ' + PD.detector.active; }));
  await p.evaluate(() => { window.__ev = []; ['onset', 'note', 'level', 'chord', 'release'].forEach(k => PD.detector.on(k, m => { if (k !== 'level' || Math.random() < .05) window.__ev.push(k + ':' + (m.t || 0).toFixed(2) + (k === 'level' ? '/' + m.rms.toFixed(4) + '/' + (m.thr || 0).toFixed(4) : '')); })); });
  await p.waitForTimeout(4000);
  console.log(await p.evaluate(() => window.__ev.slice(0, 20).join(' ')));
  await b.close();
})();
