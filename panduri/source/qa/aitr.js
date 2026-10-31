// the AI studio end to end: load a real recording, transcribe, every view, exports
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/aitr/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const [W, H] = (process.env.SIZE || '390x844').split('x').map(Number);
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); document.querySelector('.cine-boot')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(800);
  // hand the page a real file, exactly as the file picker would
  await p.evaluate(async url => {
    const blob = await (await fetch(url)).blob();
    const f = new File([blob], 'bani.mp3', { type: 'audio/mpeg' });
    const dt = new DataTransfer(); dt.items.add(f);
    const inp = document.querySelector('input[type=file]'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, 'http://localhost:8766/media/bani/music.mp3');
  await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 });
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.ai-trans').scrollIntoView());
  await p.screenshot({ path: OUT + 'a_ask.png', fullPage: false });
  // transcribe
  await p.evaluate(() => [...document.querySelectorAll('.ai-trans button')].find(x => /ამოცნობა/.test(x.textContent)).click());
  await p.waitForFunction(() => document.querySelector('.tr-tabs'), null, { timeout: 300000 });
  await p.waitForTimeout(600);
  const info = await p.evaluate(() => { const M = PD.aimus._last || null; return null; });
  // playing: the cursor and the neck must follow
  await p.evaluate(() => { document.querySelectorAll('.tr-tabs .tab')[1].click(); PD.aiDeck && 0; });
  await p.waitForTimeout(300);
  await p.evaluate(() => { document.querySelectorAll('.tr-tabs .tab')[2].click(); });
  await p.waitForTimeout(300);
  const playing = await p.evaluate(async () => {
    const out = [];
    for (const k of [8, 40, 120]) {
      const n = PD.ai.current.transcription.notes[k]; document.querySelector('.ai-seek').value = Math.round((n.t0 + .02) / PD.ai.current.res.dur * 1000);
      document.querySelector('.ai-seek').dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(r => setTimeout(r, 420));
      const el = document.querySelector('.ai-trans .now');
      out.push({ want: PD.theory.name(n.m), got: el ? el.querySelector('b').textContent : null, time: document.querySelector('.ai-time').textContent.trim().split(' ')[0] });
    }
    return out;
  });
  await p.evaluate(() => { const e = document.querySelector('.tr-tabs'); e.scrollIntoView({ block: 'start' }); scrollBy(0, -90); });
  await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'play.png' });
  console.log('PLAYING', JSON.stringify(playing));
  for (const v of ['roll', 'staff', 'let', 'sol', 'num', 'tab']) {
    await p.evaluate(v => { const i = { staff: 0, roll: 1, let: 2, sol: 3, num: 4, tab: 5 }[v]; document.querySelectorAll('.tr-tabs .tab')[i].click(); }, v);
    await p.waitForTimeout(500);
    await p.evaluate(() => { const e = document.querySelector('.tr-tabs'); e.scrollIntoView({ block: 'start' }); scrollBy(0, -90); });
    await p.waitForTimeout(400);
    await p.screenshot({ path: OUT + 'v_' + v + '.png' });
  }
  const stats = await p.evaluate(() => {
    const el = document.querySelector('.ai-trans');
    return { facts: [...el.querySelectorAll('.ai-fact')].map(x => x.textContent.trim()), tabs: [...el.querySelectorAll('.tr-tabs .tab')].map(x => x.textContent),
      exports: [...el.querySelectorAll('.ai-tool button')].map(x => x.textContent).slice(-6), tabRows: el.querySelectorAll('.tr-tline').length };
  });
  console.log(JSON.stringify(stats, null, 1)); console.log('ERR', errs.slice(0, 5)); await b.close();
})();
