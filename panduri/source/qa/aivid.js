// a video dropped into the studio: analysis, picture, sync, and the new jumps
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/aitr/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.cine-boot')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(500);
  await p.evaluate(async url => { const blob = await (await fetch(url)).blob(); const f = new File([blob], 'panduri.webm', { type: 'video/webm' }); const dt = new DataTransfer(); dt.items.add(f); const i = document.querySelector('input[type=file]'); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); }, 'http://localhost:8766/qa/test.webm');
  await p.waitForFunction(() => document.querySelector('.ai-player'), null, { timeout: 180000 });
  await p.waitForTimeout(1200);
  const base = await p.evaluate(() => {
    const v = document.querySelector('.ai-video');
    return { hasVideo: !!v, w: v && v.videoWidth, h: v && v.videoHeight, dur: v && +v.duration.toFixed(1),
      analysis: { bpm: PD.ai.current.res.bpm, key: PD.ai.current.res.key.r + (PD.ai.current.res.key.q || ''), chords: PD.ai.current.res.chords.filter(c => c.root >= 0).length, beats: PD.ai.current.res.beats.length } };
  });
  // typed jump
  const jumped = await p.evaluate(async () => {
    const i = document.querySelector('.ai-time-in'); i.value = '0:22';
    [...document.querySelectorAll('.ai-goto button')].find(x => /გადასვლა/.test(x.textContent)).click();
    await new Promise(r => setTimeout(r, 500));
    const v = document.querySelector('.ai-video');
    return { time: document.querySelector('.ai-time').textContent.trim().split(' ')[0], video: +v.currentTime.toFixed(2) };
  });
  // jump to a bar
  const barJ = await p.evaluate(async () => {
    const i = document.querySelector('.ai-bar-in'); i.value = 12;
    [...document.querySelectorAll('.ai-goto button')].find(x => /ტაქტზე/.test(x.textContent)).click();
    await new Promise(r => setTimeout(r, 500));
    return { time: document.querySelector('.ai-time').textContent.trim().split(' ')[0], bar: document.querySelector('.ai-bar').textContent, video: +document.querySelector('.ai-video').currentTime.toFixed(2) };
  });
  // speed presets reach the video too
  const spd = await p.evaluate(async () => {
    [...document.querySelectorAll('.ai-sppre .chip')].find(x => x.textContent === '50%').click();
    await new Promise(r => setTimeout(r, 700));
    return { deck: PD.ai.current.res && document.querySelector('.ai-sprow b').textContent, rate: document.querySelector('.ai-video').playbackRate };
  });
  await p.evaluate(() => document.querySelector('.ai-player').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(400); await p.screenshot({ path: OUT + 'video.png' });
  console.log(JSON.stringify({ base, jumped, barJ, spd }, null, 1)); console.log('ERR', errs.slice(0, 4)); await b.close();
})();
