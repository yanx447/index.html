const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(500);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); });
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('m1'), 'wait')); await p.waitForTimeout(800);
  console.log(await p.evaluate(() => { const G = PD.geom.g; return JSON.stringify({ strumU: G.strumU, FE: G.FE, hole: G.hole.u, A: PD.engine.ASSIST[PD.engine.assist()] }); }));
  await p.screenshot({ path: 'qa/hand2x.png', clip: { x: 200, y: 380, width: 760, height: 330 } });
  await b.close();
})();
