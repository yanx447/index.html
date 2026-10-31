// video + full transcription: does the whole chain work on a dropped video?
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/aitr/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/?cap'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); if (location.search.indexOf('cap') >= 0) PD.store.set('ai.forceCapture', true); document.querySelector('.ag')?.remove(); document.querySelector('.cine-boot')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(500);
  await p.evaluate(async url => { const blob = await (await fetch(url)).blob(); const f = new File([blob], url.endsWith('.mp3') ? 'bani.mp3' : 'panduri.webm', { type: url.endsWith('.mp3') ? 'audio/mpeg' : 'video/webm' }); const dt = new DataTransfer(); dt.items.add(f); const i = document.querySelector('input[type=file]'); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); }, process.env.SRC || 'http://localhost:8766/qa/test.webm');
  await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 });
  await p.evaluate(() => [...document.querySelectorAll('.ai-trans button')].find(x => /ამოცნობა/.test(x.textContent)).click());
  await p.waitForFunction(() => document.querySelector('.tr-tabs'), null, { timeout: 300000 });
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => { const M = PD.ai.current.transcription; return {
    notes: M.notes.length, reach: M.notes.filter(n => n.reach).length, metre: M.metre.num + '/' + M.metre.den, bpm: M.bpm,
    dens: M.sections.map(s => +(M.notes.filter(x => x.t0 >= s.t0 && x.t0 < s.t1).length / (s.t1 - s.t0)).toFixed(2)), parts: M.sections.length, marks: [...document.querySelectorAll('.tr-solo')].map(x => x.textContent.trim()),
    views: [...document.querySelectorAll('.tr-tabs .tab')].length, video: !!document.querySelector('.ai-video') }; });
  await p.evaluate(() => { document.querySelectorAll('.tr-tabs .tab')[5].click(); });
  await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('.ai-trans').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'video_tr.png' });
  console.log(JSON.stringify(r)); console.log('ERR', errs.slice(0, 4)); await b.close();
})();
