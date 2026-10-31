const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
  const r = await p.evaluate(async () => {
    localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove();
    const out = {};
    for (const c of PD.tips.all()) { PD.app.go('tips', c.id); await new Promise(r => setTimeout(r, 60)); out[c.id] = document.querySelector('.page h1')?.textContent.slice(0, 20); }
    PD.tips.editor(); const n = document.querySelectorAll('.studio details').length;
    // approve + edit one card, check it shows
    const x = PD.store.get('tips.edit', {}); x.wrist = { ok: true, title: 'შესწორებული' }; PD.store.set('tips.edit', x);
    document.querySelector('.studio')?.remove(); PD.app.go('tips', 'wrist'); await new Promise(r => setTimeout(r, 100));
    await new Promise(r => setTimeout(r, 400)); const t1 = document.querySelector('#page h1').textContent, badge = document.querySelector('#page .tp-src').className;
    PD.i18n.set('en'); PD.app.go('tips'); await new Promise(r => setTimeout(r, 100)); const en = document.querySelector('.page h1').textContent;
    return { cards: Object.keys(out).length, missing: Object.entries(out).filter(([k, v]) => !v).map(x => x[0]), editorRows: n, t1, badge, en };
  });
  console.log(JSON.stringify(r));
  await b.close();
})();
