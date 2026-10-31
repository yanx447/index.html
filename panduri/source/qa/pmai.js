// the free AI studio: analysis works, transcription/export/edit/video are behind the paywall
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/pmai/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(800);
  const put = (url, name, type) => p.evaluate(async ([u, n, ty]) => {
    const blob = await (await fetch(u)).blob();
    const dt = new DataTransfer(); dt.items.add(new File([blob], n, { type: ty }));
    const inp = document.querySelector('input[type=file]'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, [url, name, type]);
  // 1 · a video is refused for a free account
  await put('http://localhost:8766/qa/test.webm', 'clip.webm', 'video/webm');
  await p.waitForTimeout(1200);
  console.log('VIDEO:', await p.evaluate(() => (document.querySelector('.ai-status .notice') || {}).textContent));
  // 2 · audio analyses normally
  await put('http://localhost:8766/media/bani/music.mp3', 'bani.mp3', 'audio/mpeg');
  await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const q = s => document.querySelector(s), tx = s => (q(s) || {}).textContent || '';
    const facts = [...document.querySelectorAll('.ai-fact')].map(x => x.textContent.trim());
    const tr = q('.ai-trans');
    return { facts, left: PD.store.get('ai.day', null),
      trHasRun: !!tr.querySelector('.btn.primary') && tr.querySelector('.btn.primary').textContent,
      trNotice: (tr.querySelector('.notice') || {}).textContent,
      hasRhythm: !!q('.ai-rhy, .ai-rhythm') || /BPM/.test(tx('.ai-facts')) };
  });
  console.log('FACTS:', JSON.stringify(r).slice(0, 900));
  // 3 · the chord editor asks for Premium
  const ch = await p.evaluate(() => {
    const tg = [...document.querySelectorAll('.ai-tool')].find(x => /აკორდ|Chord/i.test(x.textContent));
    const b2 = tg && tg.querySelector('.ai-tg'); if (b2) b2.click();
    return !!document.querySelector('.pw');
  });
  console.log('CHORD EDIT → paywall:', ch);
  await p.evaluate(() => { document.querySelector('.sheet-x, .pw .btn.quiet')?.click(); document.querySelector('.sheet-back')?.remove(); });
  await p.screenshot({ path: OUT + 'free.png', fullPage: true });
  // 4 · the daily limit
  const day = await p.evaluate(() => { PD.store.set('ai.day', { d: new Date().toDateString(), n: 9 }); return PD.store.get('ai.day', null); });
  await put('http://localhost:8766/media/bani/music.mp3', 'other.mp3', 'audio/mpeg');
  await p.waitForTimeout(1500);
  console.log('DAY:', JSON.stringify(day), '→', await p.evaluate(() => (document.querySelector('.ai-status .notice') || {}).textContent));
  console.log('errs', errs);
  await b.close();
})();
