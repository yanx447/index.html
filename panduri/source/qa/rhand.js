const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message, (e.stack||'').split('\n')[1]));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(500);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('wsInsp', false); PD.store.set('wsView', '2d'); const o = document.querySelector('.ob'); o && o.remove(); });
  await p.evaluate(() => PD.practice.open(PD.lessons.get('rhythm-mtiuluri'), { wait: false, tempo: .25, view: '2d', mode: 'practice' }, 'rhythm-mtiuluri', 'slow')); await p.waitForTimeout(600);
  await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); });
  const info = [];
  for (let k = 0; k < 8; k++) { await p.waitForTimeout(330); const r = await p.evaluate(() => { const S = PD.engine.S, st = S.steps[S.cur]; return PD.engine.visualNow().toFixed(2) + (st ? st.st + (st.acc ? '!' : '') : ''); }); info.push(r); await p.screenshot({ path: `qa/r${k}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } }); }
  console.log(info.join(' | '));
  await b.close();
})();
