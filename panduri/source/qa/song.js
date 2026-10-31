const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) console.log('CERR', m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(800);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); PD.store.set('devTouch', true); document.querySelector('.ob')?.remove(); PD.app.go('lesson', 'bani-acharuli'); });
  await p.waitForTimeout(500); await p.screenshot({ path: 'qa/s-page.png' });
  console.log(await p.evaluate(() => { const l = PD.lessons.get('bani-acharuli'); return [l.events.length, PD.lessons.steps(l).length, l.sections.map(s => s.name.ka + ' ' + s.from + '-' + s.to).join(' | ')].join(' :: '); }));
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'slow'));
  await p.waitForTimeout(4000); await p.screenshot({ path: 'qa/s-play1.png' });
  console.log(await p.evaluate(() => { const r = PD.audio.ref; return { mix: r.mix, el: !!r.el, t: r.el && r.el.currentTime, paused: r.el && r.el.paused, now: PD.engine.S.now, playing: PD.engine.S.playing }; }));
  await p.waitForTimeout(3000); await p.screenshot({ path: 'qa/s-play2.png' });
  console.log(await p.evaluate(() => { const r = PD.audio.ref, S = PD.engine.S; return { t: r.el && r.el.currentTime.toFixed(2), expected: (S.now / (S.lesson.bpm / 60) + r.offset).toFixed(2), rate: r.el && r.el.playbackRate }; }));
  await p.evaluate(() => { PD.practice.close(); PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords'); });
  await p.waitForTimeout(2500); await p.screenshot({ path: 'qa/s-chords.png' });
  console.log(await p.evaluate(() => { const r = PD.audio.ref, S = PD.engine.S; return { waiting: S.waiting, cur: S.cur, name: S.steps[S.cur] && S.steps[S.cur].name, paused: r.el && r.el.paused, now: S.now }; }));
  await b.close();
})();
