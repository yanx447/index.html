const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  p.on('pageerror', e => console.log('PE', e.message, (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  p.on('console', m => { if (m.type() === 'error') console.log('CE', m.text()); });
  await p.goto(process.env.URL || 'http://localhost:8765/panduri-app.html'); await p.waitForTimeout(500);
  console.log(await p.evaluate(process.env.EXPR || '!!PD.R3D'));
  await b.close();
})();
