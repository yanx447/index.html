const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(600);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); });
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('rhythm-acharuli'), 'watch')); await p.waitForTimeout(2500);
  for (const v of ['strum','right']) { await p.evaluate(v => PD.R3D.setView(v, true), v); await p.waitForTimeout(900); await p.screenshot({path:`rv-${v}.png`, clip:{x:0,y:240,width:1170,height:530}}); }
  await b.close();
})();
