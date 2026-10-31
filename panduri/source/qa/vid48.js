const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  for (const id of ['strokes', 'fingers', 'hands', 'sit']) { await p.evaluate(i => PD.app.go('tips', i), id); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'w-' + id + '.png' }); }
  await p.evaluate(() => PD.app.go('chords', 'Bm')); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'w-chords.png', fullPage: false });
  console.log(await p.evaluate(() => [...document.querySelectorAll('.notice')].map(x => x.textContent).join(' | ')));
  console.log('ERR', errs); await b.close();
})();
