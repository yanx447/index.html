const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/mo/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'standalone', { get: () => true }); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home', null, true); });
  await p.waitForTimeout(900);
  // 1. push: frames
  await p.evaluate(() => { document.querySelector('.page').scrollTop = 380; }); console.log('home max scroll', await p.evaluate(() => { const e = document.querySelector('.page'); return [e.scrollTop, e.scrollHeight - e.clientHeight]; }));
  await p.waitForTimeout(200);
  await p.evaluate(() => { window.__f = []; const t0 = performance.now(); PD.app.go('chords'); const snap = () => { const ps = [...document.querySelectorAll('#main > .page')].map(e => (e.classList.contains('leave') ? 'old ' : 'new ') + getComputedStyle(e).transform.replace(/matrix\(1, 0, 0, 1, ([-\d.]+), 0\)/, 'x=$1')); window.__f.push(Math.round(performance.now() - t0) + 'ms ' + ps.join(' | ')); if (performance.now() - t0 < 460) requestAnimationFrame(snap); }; requestAnimationFrame(snap); });
  await p.waitForTimeout(140); await p.screenshot({ path: OUT + 'push-mid.png' });
  await p.waitForTimeout(500);
  const f = await p.evaluate(() => window.__f); console.log('PUSH frames:', f.filter((_, i) => i % 5 === 0).join('\n  '));
  // 2. back restores scroll
  await p.evaluate(() => PD.app.back()); await p.waitForTimeout(150); await p.screenshot({ path: OUT + 'pop-mid.png' }); await p.waitForTimeout(500);
  console.log('BACK route', await p.evaluate(() => PD.app.route), 'scroll', await p.evaluate(() => document.querySelector('#page').scrollTop), 'pages', await p.evaluate(() => document.querySelectorAll('#main > .page').length));
  // 3. tab switch frames
  await p.evaluate(() => { window.__f = []; const t0 = performance.now(); document.querySelector('.tabbar .navb[data-go="learn"]').click(); const snap = () => { const n = document.querySelector('#page'); window.__f.push(Math.round(performance.now() - t0) + 'ms op=' + getComputedStyle(n).opacity + ' ind=' + getComputedStyle(document.querySelector('.tabbar .tab-ind')).transform); if (performance.now() - t0 < 400) requestAnimationFrame(snap); }; requestAnimationFrame(snap); });
  await p.waitForTimeout(600); console.log('TAB frames:', (await p.evaluate(() => window.__f)).filter((_, i) => i % 6 === 0).join('\n  '));
  // 4. rapid navigation
  await p.evaluate(() => { PD.app.go('settings'); PD.app.go('progress'); PD.app.go('chords'); setTimeout(() => history.back(), 30); setTimeout(() => history.back(), 60); });
  await p.waitForTimeout(1000);
  console.log('RAPID route', await p.evaluate(() => PD.app.route), 'pages', await p.evaluate(() => document.querySelectorAll('#main > .page').length), 'dims', await p.evaluate(() => document.querySelectorAll('.pg-dim').length), 'leaves', await p.evaluate(() => document.querySelectorAll('.page.leave').length));
  // 5. segment thumb
  await p.evaluate(() => PD.app.go('settings')); await p.waitForTimeout(700);
  const th = () => p.evaluate(() => { const s = document.querySelector('.page .seg.has-thumb'); const t = s.querySelector('.seg-thumb'); const b = s.querySelector('button[aria-pressed="true"]'); return { thumb: t.style.transform + ' w' + t.style.width, btn: b.offsetLeft + ',' + b.offsetTop + ' w' + b.offsetWidth }; });
  console.log('SEG before', JSON.stringify(await th()));
  await p.evaluate(() => { const s = document.querySelector('.page .seg.has-thumb'); [...s.querySelectorAll('button')].find(b => b.getAttribute('aria-pressed') !== 'true').click(); });
  await p.waitForTimeout(120); await p.screenshot({ path: OUT + 'seg-mid.png', clip: { x: 0, y: 0, width: 390, height: 300 } }); await p.waitForTimeout(400);
  console.log('SEG after ', JSON.stringify(await th()), 'segs with thumb', await p.evaluate(() => document.querySelectorAll('.seg.has-thumb').length));
  // 6. swipe back from the edge (installed-app mode)
  await p.evaluate(() => PD.app.go('home', null, true)); await p.waitForTimeout(600); await p.evaluate(() => PD.app.go('chords')); await p.waitForTimeout(700);
  const cdp = await ctx.newCDPSession(p);
  const tp = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: 420 }] });
  await tp('touchStart', 6);
  for (let x = 10; x <= 180; x += 17) { await tp('touchMove', x); await p.waitForTimeout(16); }
  await p.screenshot({ path: OUT + 'swipe-mid.png' });
  for (let x = 197; x <= 300; x += 26) { await tp('touchMove', x); await p.waitForTimeout(12); }
  await tp('touchEnd'); await p.waitForTimeout(800);
  console.log('SWIPE route', await p.evaluate(() => PD.app.route), 'pages', await p.evaluate(() => document.querySelectorAll('#main > .page').length), 'visible', await p.evaluate(() => getComputedStyle(document.querySelector('#page')).visibility));
  // 7. swipe cancelled (short)
  await p.evaluate(() => PD.app.go('chords')); await p.waitForTimeout(700);
  await tp('touchStart', 6); for (let x = 10; x <= 70; x += 15) { await tp('touchMove', x); await p.waitForTimeout(16); } await tp('touchEnd'); await p.waitForTimeout(600);
  console.log('SWIPE-CANCEL route', await p.evaluate(() => PD.app.route), 'transform', await p.evaluate(() => getComputedStyle(document.querySelector('#page')).transform), 'pages', await p.evaluate(() => document.querySelectorAll('#main > .page').length));
  console.log('ERRORS', errs.length ? errs : 'none');
  await b.close();
})();
