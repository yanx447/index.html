const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file:///home/claude/pd/dist/panduri-app.html'); await p.evaluate(() => { PD.store.set('onboarded', true); document.querySelector('.ob') && document.querySelector('.ob').remove(); });
  await p.evaluate(() => { PD.app.go('lesson', 'gs-three'); PD.app.startStage(PD.lessons.get('gs-three'), 'wait'); PD.engine.S.countIn = false; PD.engine.play(); });
  for (let i = 0; i < 160; i++) {
    await p.waitForTimeout(150);
    const done = await p.evaluate(i => { const S = PD.engine.S; if (S.finished) return true; if (!S.waiting) return false; const st = S.steps[S.cur], n = st.notes[0]; const wrong = i % 5 === 2; PD.engine.input({ kind: 'note', src: 'touch', midi: PD.theory.midi(n.s, n.f) + (wrong ? 1 : 0), s: n.s, f: n.f + (wrong ? 1 : 0), conf: 1, t: PD.audio.now() }); return false; }, i);
    if (done) break;
  }
  await p.waitForTimeout(800); await p.screenshot({ path: 'result.png' });
  const prog = await p.evaluate(() => JSON.stringify(PD.lessons.progress.lesson('gs-three')));
  console.log(prog.slice(0, 300));
  await p.evaluate(() => { document.querySelector('.sheet-back').remove(); PD.practice.close(); }); await p.waitForTimeout(300); await p.screenshot({ path: 'lesson-after.png' });
  // perform stage timing results
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('gs-three'), 'slow')); await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); });
  for (let i = 0; i < 200; i++) { await p.waitForTimeout(80); const d = await p.evaluate(() => { const S = PD.engine.S; if (S.finished) return true; const st = S.steps[S.cur]; if (st && Math.abs(st.t - S.now) < .15) { const n = st.notes[0]; PD.engine.input({ kind: 'note', src: 'touch', midi: PD.theory.midi(n.s, n.f), s: n.s, f: n.f, conf: 1, t: PD.audio.now() }); } return false; }); if (d) break; }
  await p.waitForTimeout(600); await p.screenshot({ path: 'result2.png' });
  console.log('errors', errs);
  await b.close();
})();
