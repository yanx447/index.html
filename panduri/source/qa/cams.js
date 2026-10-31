const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack || '').split('\n')[1]));
  await p.goto('http://localhost:8765/panduri-app.html');
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('wsView', '3d'); document.querySelector('.ob') && document.querySelector('.ob').remove(); PD.app.startStage(PD.lessons.get('m2'), 'wait'); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); }); await p.waitForTimeout(1500);
  for (const c of ['player', 'teacher', 'left', 'right', 'fretboard', 'full']) {
    await p.evaluate(c => document.querySelector('[data-cam="' + c + '"]').click(), c); await p.waitForTimeout(2200);
    await (await p.$('.ws-3d')).screenshot({ path: 'cam-' + c + '.png' });
  }
  await p.screenshot({ path: 'ws3d-full.png' });
  console.log(errs);
  await b.close();
})();
