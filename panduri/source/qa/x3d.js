// the in-app 3D explorer, a few camera presets
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/cam/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 900, height: 900 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('explore'); });
  await p.waitForTimeout(2500);
  for (const v of (process.env.V || 'front,head,sound,side').split(',')) { await p.evaluate(v => PD.R3D.setView(v, true), v); await p.waitForTimeout(1500); const el = await p.$('.x3d'); await el.screenshot({ path: OUT + 'x_' + v + '.png' }); }
  console.log(errs.slice(0, 3)); await b.close();
})();
