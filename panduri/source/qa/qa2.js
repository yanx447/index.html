const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['microphone'] });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('PE ' + e.message + ' ' + (e.stack || '').split('\n')[1])); p.on('console', m => { if (m.type() === 'error' && !/TUNNEL/.test(m.text())) errs.push(m.text()); });
  await p.goto('http://localhost:8765/panduri-app.html'); await p.evaluate(() => { PD.store.set('onboarded', true); document.querySelector('.ob') && document.querySelector('.ob').remove(); });
  // tuner with fake mic
  await p.evaluate(() => PD.app.go('tuner')); await p.waitForTimeout(300);
  await p.click('.gauge .btn.primary'); await p.waitForTimeout(300);
  await p.click('.sheet .btn.primary'); await p.waitForTimeout(3000);
  console.log('tuner:', await p.evaluate(() => [document.querySelector('.tnote').textContent, document.querySelector('.tread').textContent, document.querySelector('.tmsg').textContent, JSON.stringify(PD.detector.status())]));
  await p.screenshot({ path: 'tuner-mic.png' });
  await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(300);
  console.log('mic after leaving tuner active?', await p.evaluate(() => PD.detector.active));
  // practice with mic
  await p.evaluate(() => { PD.app.startStage(PD.lessons.get('gs-open-a'), 'wait'); }); await p.waitForTimeout(400);
  await p.click('.ws-top [data-i="mic"]'); await p.waitForTimeout(800);
  const notes = await p.evaluate(() => new Promise(r => { const got = []; const off = PD.detector.on('note', m => got.push(m)); setTimeout(() => { off(); r(got.map(m => [Math.round(m.midi * 10) / 10, Math.round(m.conf * 100) / 100, m.unsure])); }, 2500); }));
  console.log('mic notes:', JSON.stringify(notes.slice(0, 6)), 'input', await p.evaluate(() => PD.engine.S.input));
  await p.screenshot({ path: 'ws-mic.png' });
  await p.evaluate(() => PD.practice.close()); console.log('mic after close:', await p.evaluate(() => PD.detector.active));
  // chord explorer: 3D hand + transition
  await p.evaluate(() => PD.app.go('chords', 'min5')); await p.waitForTimeout(300);
  await p.evaluate(() => [...document.querySelectorAll('.btn')].find(b => /3D/.test(b.textContent)).click()); await p.waitForTimeout(2500); await p.screenshot({ path: 'chords-3d.png' });
  // fretboard game
  await p.evaluate(() => PD.app.go('fretboard')); await p.waitForTimeout(300);
  await p.evaluate(() => [...document.querySelectorAll('.btn.primary')].find(b => b.textContent.length > 3).click()); await p.waitForTimeout(200);
  await p.evaluate(() => document.querySelector('.fb .cell[data-s="2"][data-f="5"]').dispatchEvent(new MouseEvent('click', { bubbles: true }))); await p.waitForTimeout(300); await p.screenshot({ path: 'fb-game.png' });
  // explore tour
  await p.evaluate(() => PD.app.go('explore', 'tour')); await p.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) { await p.evaluate(() => document.querySelector('.x3d .info .btn.primary').click()); await p.waitForTimeout(900); }
  await p.screenshot({ path: 'tour.png' });
  // record flow (touch)
  await p.evaluate(() => { PD.app.go('lesson', 'bani-acharuli'); PD.practice.record(PD.lessons.get('bani-acharuli')); }); await p.waitForTimeout(400);
  await p.evaluate(() => [...document.querySelectorAll('.ws-bot .btn.primary')][0].click()); await p.waitForTimeout(5200);
  for (const [s, f] of [[1, 0], [1, 2], [2, 0], [3, 0]]) { await p.evaluate(([s, f]) => PD.engine.input({ kind: 'note', src: 'touch', midi: PD.theory.midi(s, f), s, f, conf: 1, t: PD.audio.now() }), [s, f]); await p.waitForTimeout(260); }
  await p.screenshot({ path: 'rec.png' });
  await p.evaluate(() => [...document.querySelectorAll('.ws-bot .btn.primary')].pop().click()); await p.waitForTimeout(500);
  console.log('recorded events:', await p.evaluate(() => PD.lessons.get('bani-acharuli').events.map(e => e.t + ':' + e.s + '/' + e.f).join(' ')));
  await p.screenshot({ path: 'rec-after.png' });
  // calib wizard with fake mic
  await p.evaluate(() => PD.calib.open()); await p.waitForTimeout(800);
  await p.evaluate(() => document.querySelector('.ob .btn.primary').click()); await p.waitForTimeout(3600);
  console.log('noise:', await p.evaluate(() => document.querySelector('.ob p.mono').textContent));
  await p.screenshot({ path: 'calib.png' });
  console.log('errors', errs);
  await b.close();
})();
