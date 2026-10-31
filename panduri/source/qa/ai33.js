const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('http://localhost:8770/panduri/app/'); await p.waitForTimeout(1500);
  // DSP check: 440 Hz sine → +12 semitones → 880 Hz, same length; speed .5 → twice as long, still 440 Hz
  console.log('dsp', await p.evaluate(async () => {
    const sr = 44100, n = sr * 3, L = new Float32Array(n); for (let i = 0; i < n; i++) L[i] = Math.sin(2 * Math.PI * 440 * i / sr) * .5;
    const zc = a => { let z = 0; for (let i = sr; i < a.length - sr; i++) if (a[i - 1] < 0 && a[i] >= 0) z++; return z / ((a.length - 2 * sr) / sr); };
    const out = [];
    for (const [sp, st] of [[1, 12], [.5, 0], [1.25, -3]]) { const d = PD.aiDeck.create(); d.setSet({ id: 'x', sr, from: 0, tracks: [{ name: 'a', L, R: L }] }); await d.setSpeed(sp); await d.setPitch(st); const t0 = performance.now(); const r = await d.render(); out.push({ sp, st, len: (r.L.length / sr).toFixed(2), hz: Math.round(zc(r.L)), ms: Math.round(performance.now() - t0) }); d.destroy(); }
    return JSON.stringify(out);
  }));
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('author', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(600);
  await p.setInputFiles('#page input[type=file]', OUT + '../bani40.mp3');
  await p.waitForSelector('.ai-facts', { timeout: 120000 }); await p.waitForTimeout(800);
  console.log('facts', await p.evaluate(() => document.querySelector('.ai-facts').innerText.replace(/\n/g, ' ')));
  await p.click('.ai-play'); await p.waitForTimeout(3000);
  const q = () => p.evaluate(() => ({ t: document.querySelector('.ai-time').textContent, bar: document.querySelector('.ai-bar').textContent, now: document.querySelector('.ai-now b')?.textContent }));
  console.log('playing', JSON.stringify(await q()));
  // speed 80 % while playing
  await p.evaluate(() => { const s = document.querySelector('.ai-tc input[type=range]'); s.value = 80; s.dispatchEvent(new Event('change')); });
  const t0 = Date.now(); await p.waitForFunction(() => document.querySelector('.ai-prep').hidden, null, { timeout: 60000 }); console.log('speed ready ms', Date.now() - t0);
  const a = await p.evaluate(() => PD.app && document.querySelector('.ai-time').textContent); await p.waitForTimeout(2000); const b2 = await p.evaluate(() => document.querySelector('.ai-time').textContent); console.log('speed80 time', a, '→', b2, 'tempo', await p.evaluate(() => document.querySelectorAll('.ai-fact b')[1].textContent));
  // pitch +2
  await p.evaluate(() => [...document.querySelectorAll('.ai-tc .btn')].find(x => x.textContent === '+').click()); await p.click('.ai-tc .btn >> text=+');
  await p.waitForFunction(() => document.querySelector('.ai-prep').hidden, null, { timeout: 60000 }); await p.waitForTimeout(500);
  console.log('pitch', JSON.stringify(await q()), 'key', await p.evaluate(() => document.querySelectorAll('.ai-fact b')[0].textContent));
  // metronome + 1-bar loop
  await p.click('.ai-tg >> nth=0'); await p.click('.ai-tc .btn >> text=1 ტაქტი'); await p.waitForTimeout(400);
  const ls = []; for (let i = 0; i < 8; i++) { ls.push(await p.evaluate(() => document.querySelector('.ai-time').textContent.split(' /')[0])); await p.waitForTimeout(500); }
  console.log('loop', ls.join(' '), await p.evaluate(() => document.querySelector('.ai-tool:nth-child(4) small').textContent));
  await p.screenshot({ path: OUT + 'ai33-1.png' });
  // split (4 instruments)
  await p.evaluate(() => document.querySelector('.ai-tc .btn.ghost[aria-label]')?.click());
  await p.evaluate(() => document.querySelector('.ai-stems').scrollIntoView());
  console.log('model row hidden', await p.evaluate(() => document.querySelector('.ai-stems .ai-row').hidden));
  await p.click('.ai-stems .btn.primary.big');
  await p.waitForSelector('.ai-mix', { timeout: 1500000 });
  console.log('stems', await p.evaluate(() => [...document.querySelectorAll('.ai-st b')].map(x => x.textContent).join(', ')));
  await p.click('.ai-presets .chip >> nth=1'); await p.waitForTimeout(300);
  console.log('karaoke mutes', await p.evaluate(() => [...document.querySelectorAll('.ai-ms.m')].map(x => x.classList.contains('on') ? 1 : 0).join('')));
  await p.click('.ai-st >> nth=2 >> .ai-ms.s'); await p.waitForTimeout(300);
  console.log('solo', await p.evaluate(() => [...document.querySelectorAll('.ai-ms.s')].map(x => x.classList.contains('on') ? 1 : 0).join('')), 'dim', await p.evaluate(() => [...document.querySelectorAll('.ai-st')].map(x => x.classList.contains('dim') ? 1 : 0).join('')));
  await p.waitForFunction(() => document.querySelector('.ai-prep').hidden, null, { timeout: 120000 });
  console.log('stems playing', JSON.stringify(await q()));
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 120000 }), p.click('.ai-mix .btn >> text=მიქსის შენახვა')]);
  console.log('export', dl.suggestedFilename(), (require('fs').statSync(await dl.path()).size / 1e6).toFixed(1) + ' MB');
  await p.evaluate(() => document.querySelector('.ai-mix').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
  await p.screenshot({ path: OUT + 'ai33-2.png' });
  await b.close();
})();
