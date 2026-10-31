const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(700);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('lesson', 'bani-acharuli'); });
  await p.waitForTimeout(700);
  await p.evaluate(() => document.querySelector('.cy').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
  await p.screenshot({ path: 'qa/s3-cycle.png' });
  await p.evaluate(() => document.querySelector('.sx-secs').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300);
  await p.screenshot({ path: 'qa/s3-secs.png' });
  await b.close();
})();
