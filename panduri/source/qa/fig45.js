const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  await p.evaluate(() => PD.app.go('tips', 'sit')); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + 'p-sit.png' });
  await p.click('.fig-views button:nth-child(3)'); await p.waitForTimeout(1200); await p.screenshot({ path: OUT + 'p-sit-front.png' });
  await p.click('.fig-views button:nth-child(4)'); await p.waitForTimeout(800); await p.screenshot({ path: OUT + 'p-sit-top.png' });
  for (const id of ['strokes', 'fingers', 'warmup']) { await p.evaluate(i => PD.app.go('tips', i), id); await p.waitForTimeout(1300); await p.screenshot({ path: OUT + 'p-' + id + '.png' }); }
  await p.evaluate(() => PD.app.go('tips')); await p.evaluate(() => { const b = [...document.querySelectorAll('.chip')].find(x => /პირველი/.test(x.textContent)); b && b.click(); }); await p.waitForTimeout(1200); await p.screenshot({ path: OUT + 'p-list.png' });
  const fps = await p.evaluate(() => new Promise(r => { let n = 0; const s = performance.now(); const f = () => { n++; if (performance.now() - s < 1000) requestAnimationFrame(f); else r(n); }; requestAnimationFrame(f); }));
  console.log('fps', fps, 'ERR', errs);
  await b.close();
})();
