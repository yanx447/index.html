const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + require('path').resolve('audio/wait.wav') + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ permissions: ['microphone'], viewport: { width: 390, height: 844 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('micExplained', true); PD.store.set('tr.level','open'); const o = document.querySelector('.ob'); o && o.remove(); PD.app.go('trainer'); });
  await p.waitForTimeout(300);
  await p.evaluate(() => PD.detector.start());
  const log = [];
  for (let i = 0; i < 26; i++) { await p.waitForTimeout(1000); const s = await p.evaluate(() => document.querySelector('.tr-prompt').textContent + ' | ' + document.querySelector('.tr-fb').textContent + ' | ' + document.querySelector('.tr-score').textContent); if (log[log.length - 1] !== s) log.push(s); }
  console.log(log.join('\n'));
  await p.screenshot({ path: 'qa/mictrainer.png' });
  await b.close();
})();
