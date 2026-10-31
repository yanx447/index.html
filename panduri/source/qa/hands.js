const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message, (e.stack||'').split('\n')[1]));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(500);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('wsInsp', false); const o = document.querySelector('.ob'); o && o.remove(); });
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('m1'), 'wait')); await p.waitForTimeout(600);
  await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); }); await p.waitForTimeout(600);
  const shots = [];
  for (let k = 0; k < 6; k++) {
    await p.waitForFunction(() => PD.engine.S.waiting, null, { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(700);
    const info = await p.evaluate(() => { const st = PD.engine.S.steps[PD.engine.S.cur]; return st ? st.notes.map(n => 's' + n.s + 'f' + n.f + 'fi' + n.fi).join(',') : 'end'; });
    await p.screenshot({ path: `qa/h${k}.png`, clip: { x: 0, y: 380, width: 760, height: 300 } }); shots.push(info);
    await p.evaluate(() => { const S = PD.engine.S, st = S.steps[S.cur]; if (!st) return; const n = st.notes[0]; PD.engine.input({ kind: 'note', src: 'touch', midi: PD.theory.midi(n.s, n.f), s: n.s, f: n.f, conf: 1, t: PD.audio.now() }); });
  }
  console.log(shots.join(' | '));
  await b.close();
})();
