const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + require('path').resolve('audio/wait.wav') + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ permissions: ['microphone'], viewport: { width: 1280, height: 800 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('micExplained', true); PD.store.set('countIn', false); const o = document.querySelector('.ob'); o && o.remove(); });
  await p.evaluate(() => { PD.engine.setCountIn(false); PD.app.startStage(PD.lessons.get('poc-three'), 'wait'); });
  await p.waitForTimeout(300);
  console.log('gate visible before mic:', await p.evaluate(() => !document.querySelector('.mgate').hidden));
  await p.evaluate(() => { window.__log = []; const E = PD.engine; ['hit', 'wrong', 'unsure'].forEach(k => E.on(k, e => window.__log.push(k + ':' + (e && e.st ? e.st.i : '') + (e && e.r && e.r.heard ? ' heard ' + PD.theory.name(Math.round(e.r.heard.midi)) : '')))); });
  // the learner presses "turn on microphone" in the gate
  await p.evaluate(() => document.querySelector('.mgate .btn.primary').click()); await p.waitForTimeout(400);
  console.log('gate visible after mic:', await p.evaluate(() => !document.querySelector('.mgate').hidden), 'input:', await p.evaluate(() => PD.engine.S.input));
  await p.evaluate(() => PD.engine.play());
  await p.waitForTimeout(27500);
  console.log(await p.evaluate(() => window.__log.join('\n')));
  console.log('cur step:', await p.evaluate(() => PD.engine.S.cur), 'waiting:', await p.evaluate(() => PD.engine.S.waiting));
  await p.screenshot({ path: 'qa/micwait.png' });
  await b.close();
})();
