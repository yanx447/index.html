const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 834, height: 1112 }, hasTouch: true })).newPage();
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); PD.app.startStage(PD.lessons.get('m1'), 'wait'); }); await p.waitForTimeout(800);
  console.log(await p.evaluate(() => { const G = PD.practice.hw.G; return JSON.stringify({ W: G.W, H: G.H, sH: G.sH, s: G.s, pan: G.pan, laneH: G.laneH }); }));
  await b.close(); })();
