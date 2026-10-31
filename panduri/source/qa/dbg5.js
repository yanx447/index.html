const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('LOG', m.text().slice(0, 300)));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); PD.practice.open(PD.lessons.get('c1'), { wait: false, tempo: 1, view: '2d', mode: 'practice', autoplay: true }, 'c1', 'demo'); });
  for (let k = 0; k < 4; k++) { await p.waitForTimeout(700); console.log(await p.evaluate(() => { const ps = PD.practice.hw.pose; return PD.engine.visualNow().toFixed(2) + ' cur' + PD.engine.S.cur + ' ' + JSON.stringify(ps.tips && ps.tips.slice(1).map(x => x.p.map(v => Math.round(v)).join(',') + ' p' + x.press.toFixed(2))) + ' palm ' + Math.round(ps.palmU) + ' assist ' + PD.engine.assist(); })); }
  await b.close(); })();
