const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  for (const lang of ['ka', 'en']) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
    const errs = [];
    p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_TUNNEL|fonts\.g/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 140)); });
    await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
    await p.evaluate(l => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.i18n.set(l); }, lang);
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      PD.premium.paywall('ai.trans');
      const box = document.querySelector('.pw');
      const items = [...box.querySelectorAll('.pw-list li')].map(x => x.textContent.trim());
      const plans = [...box.querySelectorAll('.pw-plan')].map(x => x.textContent.trim());
      return { why: (box.querySelector('.pw-why') || {}).textContent, n: items.length, items, plans,
        free: (box.querySelector('.pw-free p') || {}).textContent,
        raw: [...box.querySelectorAll('[data-t]')].filter(e => e.textContent.trim() === e.dataset.t).map(e => e.dataset.t),
        gates: Object.keys(PD.premium.FEATURES), allows: ['ai.trans','ai.export','ai.edit','ai.video','ai.stems','ai.more','coach'].map(k => k + '=' + PD.premium.allows(k)) };
    });
    console.log('==', lang, JSON.stringify(r, null, 1).slice(0, 2600));
    console.log('errs', errs);
    await p.close();
  }
  await b.close();
})();
