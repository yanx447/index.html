const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const vs = [['', 'a'], ['body::before{mix-blend-mode:normal!important;opacity:.16!important}', 'b'], ['body::before{mix-blend-mode:normal!important;opacity:.22!important}', 'c']];
  for (const [css, n] of vs) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 600 }, deviceScaleFactor: 2 })).newPage();
    await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(300);
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('learn'); });
    if (css) await p.addStyleTag({ content: css });
    await p.waitForTimeout(900); await p.screenshot({ path: 'qa/grain-' + n + '.png' });
  }
  await b.close();
})();
