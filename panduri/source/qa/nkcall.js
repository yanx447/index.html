// practice screen: the label on the neck for the current note (open string, then a fretted note)
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/nk/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const [W, H] of [[390, 844], [1280, 800]]) {
    const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
    await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); PD.store.set('seen.intro', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); document.querySelector('.cine-boot')?.remove(); });
    const ids = ['poc-three'];
    await p.evaluate(id => PD.practice.open(PD.lessons.get(id), { wait: true }), ids[0]); await p.waitForTimeout(2000); await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /ჯერ მოვუსმენ|Listen first/.test(x.textContent)); b && b.click(); }); await p.waitForTimeout(800); await p.evaluate(() => { PD.practice.screen.neck.setTarget([{ s: 3, f: 0 }], []); }); await p.waitForTimeout(800);
    await p.screenshot({ path: OUT + 'a_' + W + '.png' });
    await p.evaluate(() => { const n = PD.practice.screen.neck; n.setTarget([{ s: 2, f: 3, fi: 2 }], []); }); await p.waitForTimeout(800);
    await p.screenshot({ path: OUT + 'b_' + W + '.png' });
    console.log(W, errs.slice(0, 3)); await p.close();
  }
  await b.close();
})();
