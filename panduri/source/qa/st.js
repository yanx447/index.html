const { chromium } = require('/opt/node-tools/node_modules/playwright');
const sizes = (process.env.SIZES || 'desktop').split(','), dims = { desktop: [1440, 900], d1366: [1366, 768], phone: [390, 844], small: [375, 667], land: [844, 390], tablet: [834, 1112], tabletL: [1194, 834], d1920: [1920, 1080] };
const LESSON = process.env.L || 'm1', STAGE = process.env.ST || 'wait';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const sz of sizes) {
    const [w, h] = dims[sz]; const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: +(process.env.DPR || 1), hasTouch: sz !== 'desktop' })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' '))); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_TUNNEL/.test(m.text())) errs.push(m.text()); });
    await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(500);
    await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); });
    await p.evaluate(([l, s]) => PD.app.startStage(PD.lessons.get(l), s), [LESSON, STAGE]); await p.waitForTimeout(700);
    await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); }); 
    for (const t of (process.env.T || '1500').split(',')) { await p.waitForTimeout(+t); await p.screenshot({ path: `qa/st-${sz}-${t}.png` }); }
    console.log(sz, errs.length ? errs.join('\n') : 'ok');
  }
  await b.close();
})();
