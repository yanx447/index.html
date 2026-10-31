const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  await p.evaluate(() => PD.app.go('tips', 'lefthand')); await p.waitForTimeout(3500);
  console.log(await p.evaluate(() => { const v = document.querySelector('.tp-hero video'); return v ? { t: v.currentTime.toFixed(2), paused: v.paused, rs: v.readyState, cap: document.querySelector('.fig-vcap').textContent, views: document.querySelectorAll('.fig-views button').length } : 'no video'; }));
  await p.screenshot({ path: OUT + 'v-left.png' });
  await p.click('.fig-views button:last-child'); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + 'v-left2.png' });
  await p.evaluate(() => PD.app.go('tips')); await p.waitForTimeout(800); await p.evaluate(() => { const b = [...document.querySelectorAll('.chip')].find(x => /მარცხენა/.test(x.textContent)); b && b.click(); }); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'v-list.png' });
  console.log('ERR', errs); await b.close();
})();
