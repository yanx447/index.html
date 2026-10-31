const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); PD.app.go('tuner'); }); await p.waitForTimeout(500);
  console.log(await p.evaluate(() => { const e = [...document.querySelectorAll('.page .btn.primary')].find(x => /მიკრ/.test(x.textContent)); const cs = getComputedStyle(e); return [e.outerHTML.slice(0, 300), e.scrollWidth, e.clientWidth, cs.width, cs.maxWidth, cs.flex, getComputedStyle(e.parentElement).cssText.slice(0,10), e.parentElement.outerHTML.slice(0, 120)].join('\n'); }));
  await b.close(); })();
