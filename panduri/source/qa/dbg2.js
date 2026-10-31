const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message, (e.stack||'').split('\n')[1]));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(500);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); });
  await p.evaluate(() => PD.practice.open(PD.lessons.get('rhythm-mtiuluri'), { wait: false, tempo: .5, view: '2d', mode: 'practice' }, 'rhythm-mtiuluri', 'slow')); await p.waitForTimeout(600);
  await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); }); await p.waitForTimeout(700);
  console.log(await p.evaluate(() => JSON.stringify(PD.practice.hw._rh) + ' assist ' + PD.engine.assist()));
  await b.close();
})();
