const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 })).newPage();
  await p.goto('http://localhost:8765/panduri-app.html');
  await p.evaluate(() => { PD.store.set('onboarded', true); document.querySelector('.ob') && document.querySelector('.ob').remove(); PD.store.set('quality', 'high'); PD.app.go('explore'); });
  await p.waitForTimeout(800);
  await p.evaluate(() => { const x = document.querySelector('.x3d'); x.style.height = '520px'; x.style.background = 'transparent'; x.style.border = '0'; document.querySelector('.x3d .tags').hidden = true; document.querySelector('.x3d .views').hidden = true; PD.R3D.quality = 'high'; PD.R3D.setView('player', true); PD.R3D.handsVisible = false; });
  await p.waitForTimeout(3500);
  const el = await p.$('.x3d'); await el.screenshot({ path: '../assets/hero.png' });
  await b.close();
})();
