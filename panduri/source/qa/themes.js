const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/th/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1200);
  for (const th of (process.argv[2] || 'ink,mint,wine').split(',')) for (const r of (process.argv[3] || 'home,learn,practice').split(',')) {
    await p.evaluate(([th, r]) => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('theme', th); document.documentElement.dataset.theme = th; document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go(r); }, [th, r]);
    await p.waitForTimeout(1100); await p.screenshot({ path: OUT + th + '-' + r + '.png' });
  }
  await b.close();
})();
