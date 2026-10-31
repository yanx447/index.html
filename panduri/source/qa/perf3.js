const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const run = async (w, h, d, css, label) => {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: d })).newPage();
    await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
    if (css) await p.addStyleTag({ content: css });
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.practice.open(PD.lessons.get('m1'), { wait: false, tempo: 1, mode: 'practice', autoplay: true }, 'm1', 'demo'); });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => new Promise(res => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res(Math.round(n / 3)); }; requestAnimationFrame(f); }));
    console.log(label, w + 'x' + h + '@' + d, 'fps', r);
    await p.close();
  };
  await run(1440, 900, 2, '', 'now');
  await run(1440, 900, 2, 'body::before{display:none!important}', 'no-grain');
  await run(1440, 900, 2, 'body::before{will-change:auto!important}', 'no-willchange');
  await run(1440, 900, 2, '.pz{background:#140c07!important}', 'pz-solid');
  await b.close();
})();
