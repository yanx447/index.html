const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
const only = process.argv[2];
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const runs = [
    ['phone-song', { width: 390, height: 844 }, p => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords')],
    ['phone-note', { width: 390, height: 844 }, p => PD.app.startStage(PD.lessons.get('m1') || PD.lessons.all()[3], 'wait')],
    ['desk-song', { width: 1280, height: 800 }, p => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords')],
    ['land-song', { width: 844, height: 390 }, p => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords')],
    ['small-song', { width: 320, height: 640 }, p => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords')],
  ].filter(r => !only || r[0].includes(only));
  for (const [name, vp, fn] of runs) {
    const p = await (await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true })).newPage();
    p.on('pageerror', e => console.log('ERR', name, e.message));
    await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1800);
    await p.evaluate(`localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); (${fn.toString()})()`);
    await p.waitForTimeout(3500);
    await p.evaluate(() => { document.querySelectorAll('.pz-over').forEach(e => e.hidden = true); });
    await p.waitForTimeout(600);
    await p.screenshot({ path: OUT + 'nk-' + name + '.png' });
    const box = await p.evaluate(() => { const n = document.querySelector('.pz-neck'); const r = n && n.getBoundingClientRect(); return r && [Math.round(r.width), Math.round(r.height)]; });
    console.log(name, 'neck box', box);
    await p.close();
  }
  await b.close();
})();
