const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
const routes = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  for (const r of routes) {
    const [route, param] = r.split(':');
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 })).newPage();
    p.on('pageerror', e => console.log('ERR', r, e.message));
    await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
    await p.evaluate(([r, pa]) => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go(r, pa || null); }, [route, param]);
    await p.waitForTimeout(1800);
    await p.screenshot({ path: OUT + 'pg-' + r.replace(':', '_') + '.png', fullPage: true });
    console.log(r, await p.evaluate(() => document.querySelector('.page')?.scrollHeight));
    await p.close();
  }
  await b.close();
})();
