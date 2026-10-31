const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('devTouch', true); PD.store.set('songMix', 'synth'); PD.audio.ref.mix = 'synth'; document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove();
    window.__s = []; const s = PD.audio.strum; PD.audio.strum = function (fr, dir, o) { window.__s.push([PD.engine.S.now.toFixed(2), dir, (o.when - PD.audio.now()).toFixed(3), !!o.guide]); return s.apply(this, arguments); };
    PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords'); });
  await p.waitForTimeout(8000);
  console.log(await p.evaluate(() => JSON.stringify({ n: window.__s.length, first: window.__s.slice(0, 6), rec: !!PD.audio.ref.cur, mix: PD.audio.ref.mix })));
  // listen stage with the synth: precisely scheduled too
  await p.evaluate(() => { PD.practice.close(); window.__s = []; PD.app.startStage(PD.lessons.get('bani-acharuli'), 'demo'); });
  await p.waitForTimeout(5000);
  console.log(await p.evaluate(() => JSON.stringify({ n: window.__s.length, first: window.__s.slice(0, 4), rec: !!PD.audio.ref.cur })));
  await b.close();
})();
