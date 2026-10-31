const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  for (const [w, h, n] of [[390, 844, 'phone'], [960, 540, 'tv'], [844, 390, 'land']]) {
    const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: n === 'phone', userAgent: n === 'tv' ? 'Mozilla/5.0 (Linux; Android 12; BRAVIA 4K VH2 Build/STT1.211025.001.Z4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36' : undefined });
    const p = await c.newPage(); p.on('pageerror', e => console.log('ERR', e.message)); await p.addInitScript(() => { try { localStorage.clear(); } catch (_) {} });
    await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(900);
    await p.screenshot({ path: 'qa/g-' + n + '-gate.png' });
    await p.click('.ag-guest, .ag a, .ag .link').catch(async () => { const x = await p.$$('.ag button'); console.log('btns', await Promise.all(x.map(e => e.textContent()))); });
    await p.waitForTimeout(800);
    console.log(n, 'ob shown:', await p.evaluate(() => !!document.querySelector('.ob')), 'tv class:', await p.evaluate(() => document.documentElement.classList.contains('tv')));
    await p.screenshot({ path: 'qa/g-' + n + '-ob.png' });
    // finish onboarding by skipping
    for (let i = 0; i < 12 && await p.$('.ob'); i++) { const s = await p.$('.ob .btn.primary') || await p.$('.ob .opt'); if (!s) break; await s.click(); await p.waitForTimeout(350); }
    await p.waitForTimeout(900);
    console.log(n, 'home visible:', await p.evaluate(() => { const pg = document.querySelector('.page'); return pg && getComputedStyle(pg).opacity + ' ' + pg.children.length + ' ' + (pg.innerText || '').slice(0, 40).replace(/\n/g, ' '); }));
    await p.screenshot({ path: 'qa/g-' + n + '-home.png' });
    if (n === 'tv') { for (const k of ['ArrowDown', 'ArrowDown', 'ArrowRight']) { await p.keyboard.press(k); await p.waitForTimeout(250); } console.log('focused:', await p.evaluate(() => document.activeElement && (document.activeElement.className + ' ' + document.activeElement.textContent.slice(0, 30)))); await p.screenshot({ path: 'qa/g-tv-nav.png' }); }
    await c.close();
  }
  await b.close();
})();
