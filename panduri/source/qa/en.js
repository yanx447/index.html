const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const [nm, w, h] of [['phone', 390, 844], ['desk', 1440, 900], ['land', 844, 390]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, hasTouch: nm !== 'desk' })).newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
    await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); PD.i18n.set('en'); });
    await p.evaluate(() => PD.app.go('lesson', 'm1')); await p.waitForTimeout(400); await p.screenshot({ path: `qa/en-${nm}-lesson.png` });
    await p.evaluate(() => PD.app.go('rhythm', 'khorumi')); await p.waitForTimeout(400); await p.screenshot({ path: `qa/en-${nm}-rhythm.png` });
    await p.evaluate(() => PD.app.startStage(PD.lessons.get('rhythm-khorumi'), 'wait')); await p.waitForTimeout(700);
    await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); }); await p.waitForTimeout(1200); await p.screenshot({ path: `qa/en-${nm}-ws.png` });
    const clip = await p.evaluate(() => [...document.querySelectorAll('.ws button, .ws .chip, .ws b, .ws small')].filter(e => e.offsetParent && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).textOverflow !== 'ellipsis').map(e => (e.className || e.tagName) + ':' + e.textContent.trim().slice(0, 20)).slice(0, 8));
    console.log(nm, errs.join(';') || 'ok', clip.length ? 'CLIP ' + clip.join(' | ') : '');
  }
  await b.close(); })();
