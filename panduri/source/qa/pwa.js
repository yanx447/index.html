const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/TUNNEL|fonts/.test(m.text())) errs.push(m.text()); });
  await p.goto('http://localhost:8765/app/index.html'); await p.waitForTimeout(2500);
  console.log('sw', await p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return r && (r.active ? r.active.state : 'pending'); }));
  console.log('3d lazy before', await p.evaluate(() => PD.has3D()));
  await p.evaluate(() => { PD.store.set('onboarded', true); document.querySelector('.ob') && document.querySelector('.ob').remove(); PD.app.go('explore'); }); await p.waitForTimeout(1200);
  console.log('3d after', await p.evaluate(() => PD.has3D() && PD.R3D.ready));
  await ctx.setOffline(true); await p.reload(); await p.waitForTimeout(1500);
  console.log('offline boot', await p.evaluate(() => !!(window.PD && PD.app && document.querySelector('.shell'))));
  await ctx.setOffline(false);
  // host-simulated fragment
  const q = await ctx.newPage(); q.on('pageerror', e => errs.push('FRAG ' + e.message));
  await q.goto('http://localhost:8765/host-sim.html'); await q.waitForTimeout(1000);
  console.log('fragment', await q.evaluate(() => ({ title: document.title, bg: getComputedStyle(document.body).backgroundColor, shell: !!document.querySelector('.shell'), doctypes: document.documentElement.outerHTML.match(/<html/gi).length })));
  console.log('errors', errs);
  await b.close();
})();
