const { chromium } = require('/opt/node-tools/node_modules/playwright');
const VW = +(process.env.VW || 390), VH = +(process.env.VH || 844);
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + require('path').resolve('audio/wait.wav') + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ permissions: ['microphone'], viewport: { width: VW, height: VH }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) console.log('CERR', m.text()); });
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); PD.store.set('micExplained', true); PD.store.set('countIn', false); document.querySelector('.ob')?.remove(); });
  await p.evaluate(() => { PD.engine.setCountIn(false); PD.app.startStage(PD.lessons.get('poc-three'), 'wait'); });
  await p.waitForTimeout(500);
  await p.screenshot({ path: 'qa/pz-gate.png' });
  console.log('gate visible before mic:', await p.evaluate(() => !document.querySelector('.pz-over').hidden));
  await p.evaluate(() => { window.__log = []; const E = PD.engine; ['hit', 'wrong', 'unsure'].forEach(k => E.on(k, e => window.__log.push(k + ':' + (e && e.st ? e.st.i : '') + (e && e.r && e.r.heard ? ' heard ' + PD.theory.name(Math.round(e.r.heard.midi)) : '')))); });
  await p.evaluate(() => document.querySelector('.pz-over .btn.primary').click());
  for (let i = 0; i < 12; i++) { await p.waitForTimeout(i === 0 ? 900 : 2300); await p.screenshot({ path: 'qa/pz-' + i + '.png' }); }
  console.log(await p.evaluate(() => window.__log.join('\n')));
  console.log('cur step:', await p.evaluate(() => PD.engine.S.cur), 'waiting:', await p.evaluate(() => PD.engine.S.waiting));
  await b.close();
})();
