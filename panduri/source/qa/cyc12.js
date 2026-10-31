const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  for (const [name, vp] of [['land', { width: 844, height: 390 }], ['desk', { width: 1280, height: 800 }], ['small', { width: 320, height: 640 }]]) {
    const p = await (await b.newContext({ viewport: vp, deviceScaleFactor: 1.5, hasTouch: true })).newPage();
    p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2200);
    await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('devTouch', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords'); });
    await p.waitForTimeout(7500);
    // simulate the learner: hit every stroke via touch input at the right time for 2 s
    await p.evaluate(() => new Promise(res => { const E = PD.engine, S = E.S; let n = 0; const iv = setInterval(() => { const st = S.steps[S.cur]; if (st && Math.abs(E.secs(S.now, st.t)) < .05) { E.input({ kind: 'onset', src: 'touch', t: PD.audio.now(), strength: .5 }); } if (++n > 400) { clearInterval(iv); res(); } }, 10); }));
    await p.screenshot({ path: OUT + 'cy-' + name + '.png' });
    await p.close();
  }
  await b.close();
})();
