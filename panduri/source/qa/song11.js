const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) console.log('CERR', m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('devTouch', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('lesson', 'bani-acharuli'); });
  await p.waitForTimeout(800);
  await p.screenshot({ path: OUT + 's11-page.png' });
  await p.evaluate(() => document.querySelector('.snd').scrollIntoView({ block: 'start' })); await p.waitForTimeout(200); await p.screenshot({ path: OUT + 's11-page2.png' });
  await p.evaluate(() => { window.__syn = 0; const s = PD.audio.strum; PD.audio.strum = function () { window.__syn++; return s.apply(this, arguments); }; });
  const st = () => p.evaluate(() => { const E = PD.engine, S = E.S, R = PD.audio.ref; return { title: S.lesson && S.lesson.title.ka, tempo: S.tempo, playing: S.playing, now: +S.now.toFixed(2), steps: S.steps.length, cur: S.cur, mix: R.mix, recCur: !!R.cur, recRate: R.cur && R.cur.r, recDur: R.cur && Math.round(R.cur.buf.duration), state: R.state, syn: window.__syn, guide: E.guideOn() }; });
  for (const stage of ['demo', 'technique', 'chords']) {
    await p.evaluate(s => { PD.practice.active && PD.practice.close(); PD.app.startStage(PD.lessons.get('bani-acharuli'), s); }, stage);
    for (let i = 0; i < 40; i++) { const s = await st(); if (s.playing && (s.recCur || s.syn > 2 || stage === 'technique' && s.now > .5)) break; await p.waitForTimeout(300); }
    await p.waitForTimeout(2500);
    console.log(stage, JSON.stringify(await st()));
    await p.screenshot({ path: OUT + 's11-' + stage + '.png' });
  }
  // switch the chords stage to the synthesizer
  await p.evaluate(() => document.querySelector('.pz-mix').click()); await p.waitForTimeout(300);
  await p.screenshot({ path: OUT + 's11-sound.png' });
  await p.evaluate(() => [...document.querySelectorAll('.sheet .opt')].find(b => /სინთეზატორი/.test(b.textContent)).click()); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('.pz-card [data-t="p.resume"]')?.click()); await p.waitForTimeout(3000);
  console.log('synth', JSON.stringify(await st()));
  await b.close();
})();
