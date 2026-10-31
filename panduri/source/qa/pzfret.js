const { chromium } = require('/opt/node-tools/node_modules/playwright');
const VW = +(process.env.VW || 390), VH = +(process.env.VH || 844), L = process.env.L || 'poc-fret';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  // test harness: bypass the mic gate (devTouch) but feed MIC-type events so the real judging path runs
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); PD.store.set('devTouch', true); PD.store.set('countIn', false); document.querySelector('.ob')?.remove(); });
  await p.evaluate(L => { PD.engine.setCountIn(false); PD.app.startStage(PD.lessons.get(L), 'wait'); }, L);
  await p.waitForTimeout(2600); await p.screenshot({ path: 'qa/f-0.png' });
  const mic = m => p.evaluate(m => PD.engine.input({ kind: 'note', src: 'mic', midi: m, conf: .95, t: PD.audio.now() }), m);
  const st = await p.evaluate(() => { const s = PD.engine.S.steps[PD.engine.S.cur]; return s && s.notes[0]; });
  console.log('target', JSON.stringify(st));
  await mic(58); await p.waitForTimeout(150); await p.screenshot({ path: 'qa/f-1.png' });
  await p.waitForTimeout(600); await mic(62); await p.waitForTimeout(200); await p.screenshot({ path: 'qa/f-2.png' });
  await p.waitForTimeout(500); await mic(59); await p.waitForTimeout(120); await p.screenshot({ path: 'qa/f-3.png' });
  await p.waitForTimeout(900); await p.screenshot({ path: 'qa/f-4.png' });
  console.log(await p.evaluate(() => document.querySelector('.pz-mt').textContent + ' | cur ' + PD.engine.S.cur));
  await b.close();
})();
