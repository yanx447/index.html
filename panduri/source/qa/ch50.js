const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  await p.evaluate(() => PD.app.go('chords', 'Bm')); await p.waitForTimeout(1500);
  const H = await p.evaluate(() => document.getElementById('page').scrollHeight);
  await p.setViewportSize({ width: 390, height: Math.min(H + 100, 6000) }); await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + (process.argv[2] || 'cfull') + '.png' });
  console.log('H', H, 'nulls', await p.evaluate(() => { const w = document.createTreeWalker(document.getElementById('page'), NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) if (/null|undefined|NaN/.test(n.nodeValue)) out.push(n.nodeValue.trim().slice(0, 60)); return out; }));
  console.log('ERR', errs); await b.close();
})();
