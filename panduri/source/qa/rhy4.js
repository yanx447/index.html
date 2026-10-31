const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(600);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); });
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('rhythm-acharuli'), 'watch')); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => [...document.querySelectorAll('.ws canvas')].map(c => { const r = c.getBoundingClientRect(); return c.className + ' ' + c.parentElement.className + ' ' + [r.x, r.y, r.width, r.height].map(Math.round).join(','); }).join('\n')));
  await b.close();
})();
