const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2000);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('learn'); });
  await p.waitForTimeout(800);
  console.log(await p.evaluate(() => { const i = document.querySelector('.tabbar .tab-ind'); const cs = getComputedStyle(i); const r = i.getBoundingClientRect(); return JSON.stringify({ cls: i.className, r: [r.x, r.y, r.width, r.height], bg: cs.backgroundColor, br: cs.borderRadius, pos: cs.position, w: cs.width, h: cs.height }); }));
  await b.close(); })();
