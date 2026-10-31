const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch();
  for (const [name, route] of [['ce', 'chords'], ['tr', 'trainer']]) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
    p.on('pageerror', e => console.log('ERR', name, e.message));
    await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
    await p.evaluate(r => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go(r); }, route);
    await p.waitForTimeout(1500);
    const el = await p.$('.neckview'); if (el) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await el.screenshot({ path: OUT + 'nk-' + name + '.png' }); console.log(name, await el.evaluate(e => e.offsetHeight)); } else console.log(name, 'no neckview');
    await p.close();
  }
  await b.close();
})();
