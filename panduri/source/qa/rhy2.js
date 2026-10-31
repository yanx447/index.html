const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(600);
  await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); });
  console.log(await p.evaluate(() => { const L = PD.lessons.get('rhythm-khorumi'); return JSON.stringify(L.events.slice(0,3)) + '\n' + JSON.stringify(PD.lessons.steps(L).slice(0,7).map(s => Object.keys(s).join(',') + ' ' + s.st + (s.acc?'!':'') + ' t' + s.t)); }));
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('rhythm-kazbeguri'), 'wait')); await p.waitForTimeout(800);
  await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); }); await p.waitForTimeout(1500);
  for (let i = 0; i < 8; i++) {
    await p.waitForFunction(() => PD.engine.S.waiting || !PD.engine.S.steps[PD.engine.S.cur], null, {timeout: 8000});
    const r = await p.evaluate(wrong => { const S = PD.engine.S, st = S.steps[S.cur]; if (!st) return 'end'; const d = wrong ? (st.st === 'down' ? 'up' : 'down') : st.st; const before = S.cur; PD.engine.input({ kind: 'strum', src: 'touch', dir: d, t: PD.audio.now() }); return before + st.st + (st.acc ? '!' : '') + (wrong?'(wrong:'+d+')':'') + '->' + S.cur + ' w' + S.waiting + ' hint:' + (document.querySelector('.hint')||{}).textContent; }, i === 1);
    console.log(r); await p.waitForTimeout(100); if (i===1) await p.screenshot({path:'rh-wrong.png'});
  }
  await b.close();
})();
