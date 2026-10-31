const { chromium } = require('/opt/node-tools/node_modules/playwright');
const sizes = (process.env.SIZES || 'desktop').split(','), dims = { desktop: [1440, 900], d1366: [1366, 768], d1920: [1920, 1080], phone: [390, 844], small: [375, 667], land: [844, 390], tablet: [834, 1112], tabletL: [1194, 834] };
const routes = (process.env.ROUTES || 'home,learn,library,progress,more,settings,chords,explore,tuner,rhythms').split(',');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const sz of sizes) {
    const [w, h] = dims[sz]; const p = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: !sz.startsWith('d') })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' '))); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_TUNNEL/.test(m.text())) errs.push(m.text()); });
    await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(500);
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelectorAll('.ob,.ag').forEach(o => o.remove()); });
    if (process.env.LANG2) await p.evaluate(l => PD.i18n.set(l), process.env.LANG2);
    for (const r of routes) {
      await p.evaluate(r => PD.app.go(r), r); await p.waitForTimeout(r === 'explore' || r === 'chords' ? 1600 : 450);
      const ov = await p.evaluate(() => { const pg = document.querySelector('.page'); return pg ? pg.scrollWidth - pg.clientWidth : 0; });
      if (ov > 1) errs.push('overflow-x ' + r + ' ' + ov);
      const clip = await p.evaluate(() => [...document.querySelectorAll('.page button, .page .chip, .page .tag, .tabbar .navb, .rail .navb, .page h1, .page h2')].filter(e => e.offsetParent && (e.scrollWidth > e.clientWidth + 1) && getComputedStyle(e).overflow !== 'visible' || (e.offsetParent && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).whiteSpace === 'nowrap')).map(e => (e.className || e.tagName) + ':' + (e.textContent || '').trim().slice(0, 24)).slice(0, 8));
      if (clip.length) errs.push('clip ' + r + ' ' + clip.join(' | '));
      await p.screenshot({ path: `qa/sc-${sz}-${r}${process.env.LANG2 ? '-' + process.env.LANG2 : ''}.png`, fullPage: !!process.env.FULL });
    }
    const missing = await p.evaluate(() => { const out = []; document.querySelectorAll('[data-t]').forEach(e => { if (PD.i18n.t(e.dataset.t) === e.dataset.t) out.push(e.dataset.t); }); return out; });
    if (missing.length) errs.push('missing ' + missing.join(','));
    console.log(sz, errs.length ? errs.join('\n') : 'ok');
  }
  await b.close();
})();
