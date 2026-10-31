const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  const ms = await p.evaluate(() => { const t = performance.now(); PD.app.go('chords'); return performance.now() - t; }); await p.waitForTimeout(800);
  console.log('open ms', Math.round(ms));
  console.log(await p.evaluate(() => [...document.querySelectorAll('.csec')].map(s => s.querySelector('b').textContent + ':' + s.querySelectorAll('button').length + ' [' + [...s.querySelectorAll('button')].slice(0, 6).map(b => b.textContent).join(' ') + ']').join('\n')));
  console.log('Bm', JSON.stringify(PD_bm = await p.evaluate(() => { const c = PD.curriculum.chords().find(x => x.name === 'Bm'); return c && { frets: c.frets, fingers: c.fingers, v: c.voicings.map(v => v.frets.join('-')) }; })));
  await p.evaluate(() => { [...document.querySelectorAll('.csec button')].find(b => /^Bm/.test(b.textContent)).click(); }); await p.waitForTimeout(600);
  await p.screenshot({ path: OUT + 'chords.png' });
  await p.evaluate(() => document.querySelector('.cgroups').scrollIntoView()); await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'chords2.png' });
  await p.evaluate(() => { const b = [...document.querySelectorAll('.ce-chips .chip')].find(x => x.textContent === PD.i18n.t('ce.all')); }); 
  console.log('ERR', errs); await b.close();
})();
