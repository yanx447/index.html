// the fallback reader: force it on, and check the analysis still comes out right
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 420, height: 900 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); PD.store.set('ai.forceCapture', true); document.querySelector('.ag')?.remove(); document.querySelector('.cine-boot')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(500);
  const t0 = Date.now();
  await p.evaluate(async url => { const blob = await (await fetch(url)).blob(); const f = new File([blob], 'clip.webm', { type: 'video/webm' }); const dt = new DataTransfer(); dt.items.add(f); const i = document.querySelector('input[type=file]'); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); }, process.env.SRC || 'http://localhost:8766/qa/test.webm');
  await p.waitForFunction(() => document.querySelector('.ai-player'), null, { timeout: 300000 });
  const took = Math.round((Date.now() - t0) / 1000);
  const r = await p.evaluate(() => ({ dur: +PD.ai.current.res.dur.toFixed(1), bpm: PD.ai.current.res.bpm, key: PD.ai.current.res.key.r + (PD.ai.current.res.key.q || ''),
    chords: PD.ai.current.res.chords.filter(c => c.root >= 0).length, beats: PD.ai.current.res.beats.length, video: !!document.querySelector('.ai-video') }));
  console.log(JSON.stringify({ tookSec: took, ...r })); console.log('ERR', errs.slice(0, 4)); await b.close();
})();
