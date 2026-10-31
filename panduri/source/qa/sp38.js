const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(800); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1800);
  await p.screenshot({ path: OUT + 'sp-0.png' });
  await p.click('.sp-signin'); await p.waitForTimeout(500); await p.screenshot({ path: OUT + 'sp-1.png' });
  console.log('methods', await p.evaluate(() => [...document.querySelectorAll('.ag-btn')].filter(x => !x.hidden).length));
  await p.click('.ag-back'); await p.waitForTimeout(400); console.log('back to splash', await p.evaluate(() => !!document.querySelector('.sp-start')));
  await p.click('.sp-start'); await p.waitForTimeout(900);
  console.log('after start: gate gone', await p.evaluate(() => !document.querySelector('.ag')), 'skip', await p.evaluate(() => PD.store.get('auth.skip')));
  await b.close();
})();
