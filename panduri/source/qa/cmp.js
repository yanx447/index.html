const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 900, height: 1200 } })).newPage();
  await p.goto('http://localhost:8765/panduri-app.html');
  await p.addStyleTag({ content: '.x3d{height:1000px!important} .x3d .tags{display:none}' });
  await p.evaluate(() => { PD.store.set('onboarded', true); document.querySelector('.ob') && document.querySelector('.ob').remove(); PD.store.set('quality', 'high'); PD.app.go('explore'); });
  await p.waitForTimeout(800);
  for (const v of (process.env.VIEWS || 'front').split(',')) {
    await p.evaluate(v => { PD.R3D.setView(v, true); PD.R3D.invalidate(); }, v);
    await p.waitForTimeout(2500); const el = await p.$('.x3d'); await el.screenshot({ path: 'v-' + v + '.png' });
    console.log(v, await p.evaluate(() => PD.R3D.canvas.height + 'x' + PD.R3D.canvas.width));
  }
  await b.close();
})();
