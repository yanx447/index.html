const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('devTouch', true); PD.store.set('xp', 99999); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home'); });
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'slow')); await p.waitForTimeout(1500);
  await p.evaluate(() => { const E = PD.engine, S = E.S; E.stop(); const n = S.steps.length; for (let i = 0; i < n - 6; i++) { S.res[i].missed = true; S.res[i].attempts = 1; if (i % 3 === 0) { S.res[i].missed = false; S.res[i].ok = true; S.res[i].first = true; S.res[i].off = (Math.random() - .5) * .2; } } E.configure({ mode: 'perform', wait: false }); E.seek(S.steps[n - 6].t); S.cur = n - 6; E.play(); });
  for (let i = 0; i < 40 && !(await p.evaluate(() => !!document.querySelector('.sheet [data-t="r.title"]'))); i++) await p.waitForTimeout(500);
  await p.waitForTimeout(800);
  console.log(await p.evaluate(() => { const g = document.querySelector('.tgraph'); const r = g && g.getBoundingClientRect(); return JSON.stringify({ tg: r && [r.width, r.height], svgH: g && g.querySelector('svg').getBoundingClientRect().height, html: g && g.innerHTML.slice(0, 300) }); }));
  console.log(await p.evaluate(() => { const L = document.querySelector('.errline'); return L.parentElement.innerHTML.slice(L.parentElement.innerHTML.indexOf('errline') - 200, L.parentElement.innerHTML.indexOf('errline') + 900); }));
  await b.close();
})();
