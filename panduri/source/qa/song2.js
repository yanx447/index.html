const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(800);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('devTouch', true); document.querySelector('.ob')?.remove(); PD.app.startStage(PD.lessons.get('bani-acharuli'), 'slow'); });
  for (let i = 0; i < 4; i++) { await p.waitForTimeout(1500); console.log(await p.evaluate(() => { const e = PD.audio.ref.el; return { rs: e.readyState, ns: e.networkState, err: e.error && e.error.code, t: e.currentTime.toFixed(2), paused: e.paused, src: e.src.slice(0, 60), dur: e.duration }; })); }
  await b.close();
})();
