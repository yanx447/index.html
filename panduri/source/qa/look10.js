const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('lesson', 'bani-acharuli'); });
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + 'sp1.png', fullPage: true });
  // log synth calls
  await p.evaluate(() => { window.__syn = []; const s = PD.audio.strum, n = PD.audio.note; PD.audio.strum = function () { window.__syn.push('strum@' + PD.engine.S.now.toFixed(2)); return s.apply(this, arguments); }; PD.audio.note = function () { window.__syn.push('note'); return n.apply(this, arguments); }; PD.store.set('devTouch', true); });
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords')); await p.waitForTimeout(6000);
  await p.screenshot({ path: OUT + 'ch1.png' });
  console.log('chords stage', await p.evaluate(() => JSON.stringify({ tempo: PD.engine.S.tempo, wait: PD.engine.S.wait, steps: PD.engine.S.steps.length, waiting: PD.engine.S.waiting, now: PD.engine.S.now, syn: window.__syn.slice(0, 10), ref: !!PD.audio.ref.cur })));
  await p.evaluate(() => PD.practice.close());
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'technique')); await p.waitForTimeout(5000);
  await p.screenshot({ path: OUT + 'te1.png' });
  console.log('technique', await p.evaluate(() => JSON.stringify({ tempo: PD.engine.S.tempo, bpm: PD.engine.bpm(), steps: PD.engine.S.steps.length, syn: window.__syn.length, ref: !!PD.audio.ref.cur })));
  await b.close();
})();
