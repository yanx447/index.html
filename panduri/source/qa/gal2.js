const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/gal/';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1200); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1800);
  await p.screenshot({ path: OUT + 'd-first.png' });
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.premium.paywall('ai.stems'); }); await p.waitForTimeout(900);
  await p.screenshot({ path: OUT + 'd-paywall.png' });
  await p.evaluate(() => { document.querySelectorAll('.sheet-wrap,.sheet,.scrim').forEach(x => x.remove()); PD.app.go('lesson', 'bani-acharuli'); }); await p.waitForTimeout(900);
  await p.evaluate(() => [...document.querySelectorAll('.btn.primary')].find(x => /დაწყება|Start/.test(x.textContent))?.click()); await p.waitForTimeout(2500);
  await p.screenshot({ path: OUT + 'd-lesson.png' });
  const d = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await d.goto('http://localhost:8765/app/'); await d.waitForTimeout(1000); await d.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home'); }); await d.waitForTimeout(1200);
  await d.screenshot({ path: OUT + 'd-desktop.png' });
  await b.close();
})();
