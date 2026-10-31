const { chromium } = require('/opt/node-tools/node_modules/playwright');
const VID = process.argv[2];
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-video-capture=' + VID, '--autoplay-policy=no-user-gesture-required'] });
  const shot = async (vp, name, lefty, lang) => {
    const c = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, permissions: ['camera', 'microphone'] });
    const p = await c.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('http://localhost:8765/app/'); await p.evaluate(([l, lang]) => { localStorage.clear(); PD.store.set('auth.skip', true); PD.store.set('onboarded', true); PD.store.set('lefty', l); if (lang) PD.store.set('lang', lang); }, [lefty, lang]); await p.reload(); await p.waitForTimeout(700);
    await p.click('.camcard'); await p.waitForTimeout(500);
    await p.screenshot({ path: 'qa/c-' + name + '-launch.png' });
    await p.click('.camsheet .btn.primary.big'); await p.waitForTimeout(1500);
    await p.screenshot({ path: 'qa/c-' + name + '-gate.png' }); const gate = await p.$('.pz-over:not([hidden]) .btn.primary'); if (gate) { await gate.click(); await p.waitForTimeout(500); const al = await p.$('.sheet .btn.primary'); if (al) { await al.click(); } await p.waitForTimeout(1500); }
    await p.waitForTimeout(2500);
    console.log(name, 'cam video playing:', await p.evaluate(() => { const v = document.querySelector('.pz-camv'); return v && v.srcObject && !v.paused && v.videoWidth; }), 'frame:', await p.evaluate(() => !!document.querySelector('.pz-frame')), 'classes:', await p.evaluate(() => document.querySelector('.pz').className));
    await p.screenshot({ path: 'qa/c-' + name + '.png' });
    await c.close();
  };
  await shot({ width: 390, height: 844 }, 'phone', false);
  await shot({ width: 844, height: 390 }, 'land', false);
  await shot({ width: 844, height: 390 }, 'land-lefty', true);
  await shot({ width: 1920, height: 1080 }, 'tv', false);
  await b.close();
})();
