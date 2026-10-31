const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('devTouch', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  for (const [id, st] of [['rhythm-acharuli', 'metro'], ['m1', 'slow'], ['rh-down', 'metro']]) {
    await p.evaluate(([id, st]) => { PD.practice.active && PD.practice.close(); PD.app.startStage(PD.lessons.get(id), st); }, [id, st]);
    await p.waitForTimeout(5500); await p.screenshot({ path: OUT + 'l-' + id + '.png' });
  }
  await b.close();
})();
