const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:8770/panduri/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('ai.recent', [{ name: 'NUKRI BERIDZE.mp3', at: 1, key: 'Gm', bpm: 93, chords: ['Gm', 'E♭'] }]); PD.app.go('ai'); });
  await p.waitForTimeout(600);
  await p.setInputFiles('#page input[type=file]', OUT + '../bani40.mp3');
  await p.waitForSelector('.ai-facts', { timeout: 120000 }); await p.waitForTimeout(1500);
  console.log('stored', await p.evaluate(() => JSON.stringify(PD.store.get('ai.recent').map(r => [r.name, r.stored]))));
  await p.reload(); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('ai'); }); await p.waitForTimeout(600);
  await p.screenshot({ path: OUT + 'ai30-a.png' });
  for (let k = 0; k < 3; k++) {
    const t0 = Date.now(); await p.click('.ai-rb'); await p.waitForSelector('.ai-facts', { timeout: 60000 });
    console.log('reopen', k, Date.now() - t0, 'ms', await p.evaluate(() => document.querySelector('.ai-facts').innerText.replace(/\n/g, ' ')));
    await p.evaluate(() => document.querySelector('.ai-body').innerHTML = '');
  }
  await p.click('.ai-rb'); await p.waitForSelector('.ai-facts'); await p.evaluate(() => document.querySelector('.ai-play').click()); await p.waitForTimeout(2000);
  console.log('playing', await p.evaluate(() => document.querySelector('.ai-time').textContent));
  await p.evaluate(() => document.querySelector('.ai-recent').scrollIntoView()); await p.screenshot({ path: OUT + 'ai30-b.png' });
  await p.click('.ai-rdel >> nth=1'); console.log('after delete', await p.evaluate(() => PD.store.get('ai.recent').length));
  await b.close();
})();
