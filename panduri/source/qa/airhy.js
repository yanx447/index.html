// the rhythm card end to end
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/aitr/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.cine-boot')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(500);
  await p.evaluate(async url => { const blob = await (await fetch(url)).blob(); const f = new File([blob], 'bani.mp3', { type: 'audio/mpeg' }); const dt = new DataTransfer(); dt.items.add(f); const i = document.querySelector('input[type=file]'); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); }, process.env.SRC || 'http://localhost:8766/media/bani/music.mp3');
  await p.waitForFunction(() => document.querySelector('.ai-rhy'), null, { timeout: 180000 });
  await p.evaluate(() => [...document.querySelectorAll('.ai-rhy button')].find(x => /რითმის ამოცნობა/.test(x.textContent)).click());
  await p.waitForFunction(() => document.querySelector('.rhy-strip'), null, { timeout: 180000 });
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({
    facts: [...document.querySelectorAll('.ai-rhy .ai-fact')].map(x => x.textContent.trim()),
    cells: [...document.querySelectorAll('.rhy-cell')].map(x => (x.classList.contains('acc') ? 'X' : x.classList.contains('on') ? 'x' : x.classList.contains('weak') ? '-' : '·') + x.querySelector('.rhy-lab').textContent),
    like: [...document.querySelectorAll('.ai-rhy .ai-tool .chip')].map(x => x.textContent),
    arrows: document.querySelectorAll('.rhy-ar svg').length }));
  // hear it
  await p.evaluate(() => [...document.querySelectorAll('.ai-rhy button')].find(x => /მოსმენა/.test(x.textContent)).click());
  await p.waitForTimeout(900);
  const playing = await p.evaluate(() => !!document.querySelector('.rhy-cell.now'));
  await p.evaluate(() => [...document.querySelectorAll('.ai-rhy button')].find(x => /გაჩერება/.test(x.textContent)).click());
  await p.waitForTimeout(300); await (await p.$('.ai-rhy')).screenshot({ path: OUT + 'rhythm.png' });
  console.log(JSON.stringify({ ...r, playing }, null, 1)); console.log('ERR', errs.slice(0, 4)); await b.close();
})();
