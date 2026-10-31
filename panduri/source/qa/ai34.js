const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8770/panduri/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('ai'); });
  await p.setInputFiles('#page input[type=file]', OUT + '../bani40.mp3');
  await p.waitForSelector('.ai-facts', { timeout: 120000 }); await p.waitForTimeout(500);
  await p.click('.ai-play'); await p.waitForTimeout(1500);
  const P = () => p.evaluate(() => { const r = document.querySelector('.ai-seek').value; return +r / 1000 * 40; });
  let s = []; for (let i = 0; i < 4; i++) { s.push((await P()).toFixed(2)); await p.waitForTimeout(400); } console.log('normal', s.join(' '));
  await p.click('.ai-tc .btn >> text=1 ტაქტი'); await p.waitForTimeout(200);
  s = []; for (let i = 0; i < 14; i++) { s.push((await P()).toFixed(2)); await p.waitForTimeout(300); } console.log('loop', s.join(' '), await p.evaluate(() => document.querySelector('.ai-tool:nth-child(4) small').textContent));
  await p.click('.ai-tc .btn >> text=4 ტაქტი'); await p.waitForTimeout(200);
  s = []; for (let i = 0; i < 12; i++) { s.push((await P()).toFixed(2)); await p.waitForTimeout(700); } console.log('loop4', s.join(' '), await p.evaluate(() => document.querySelector('.ai-tool:nth-child(4) small').textContent));
  await b.close();
})();
