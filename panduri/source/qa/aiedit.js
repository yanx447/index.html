// tempo by hand and chord correction: do the data and the screen really follow?
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/aitr/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.cine-boot')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(600);
  await p.evaluate(async url => { const blob = await (await fetch(url)).blob(); const f = new File([blob], 'bani.mp3', { type: 'audio/mpeg' }); const dt = new DataTransfer(); dt.items.add(f); const i = document.querySelector('input[type=file]'); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); }, 'http://localhost:8766/media/bani/music.mp3');
  await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 });
  await p.evaluate(() => [...document.querySelectorAll('.ai-trans button')].find(x => /ამოცნობა/.test(x.textContent)).click());
  await p.waitForFunction(() => document.querySelector('.tr-tabs'), null, { timeout: 300000 });
  await p.waitForTimeout(400);
  const before = await p.evaluate(() => ({ bpm: PD.ai.current.res.bpm, beats: PD.ai.current.res.beats.length, bars: Math.max(...PD.ai.current.transcription.notes.map(n => n.bar)) }));
  // halve the tempo
  await p.evaluate(() => [...document.querySelectorAll('.ai-tool button')].find(x => x.textContent === '÷2').click());
  await p.waitForFunction(b0 => PD.ai.current.res.beats.length !== b0, before.beats, { timeout: 120000 });
  await p.waitForTimeout(900);
  const half = await p.evaluate(() => ({ bpm: PD.ai.current.res.bpm, beats: PD.ai.current.res.beats.length, bars: Math.max(...PD.ai.current.transcription.notes.map(n => n.bar)), by: PD.ai.current.res.bpmBy }));
  // type a tempo
  await p.evaluate(() => { const i = document.querySelector('.ai-bpm-in'); i.value = 120; [...document.querySelectorAll('.ai-tool button')].find(x => /დაყენება/.test(x.textContent)).click(); });
  await p.waitForFunction(() => PD.ai.current.res.bpm === 120, null, { timeout: 120000 });
  const typed = await p.evaluate(() => ({ bpm: PD.ai.current.res.bpm, beats: PD.ai.current.res.beats.length }));
  // metre by hand → the deck must count in 3
  await p.evaluate(() => { const s = document.querySelector('.tr-sel'); s.value = '3/4'; s.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForTimeout(600);
  const met = await p.evaluate(() => PD.ai.current.transcription.metre);
  // chord correction
  const ch = await p.evaluate(async () => {
    [...document.querySelectorAll('.ai-tool .ai-tg')].find(x => /აკორდების შესწორება/.test(x.textContent)).click();
    const r = document.querySelector('.ai-rwrap').getBoundingClientRect();
    const i = PD.ai.current.res.chords.findIndex(c => c.root >= 0 && c.t1 - c.t0 > 1);
    const c = PD.ai.current.res.chords[i], x = (c.t0 + c.t1) / 2 / PD.ai.current.res.dur * r.width;
    document.querySelector('.ai-rwrap').dispatchEvent(new MouseEvent('click', { clientX: r.left + x, clientY: r.top + 20, bubbles: true }));
    await new Promise(r2 => setTimeout(r2, 300));
    const open = !!document.querySelector('.ai-ed');
    const was = c.root + c.q;
    [...document.querySelectorAll('.ai-ed-row .chip')].find(b2 => b2.textContent === 'F').click();
    await new Promise(r2 => setTimeout(r2, 300));
    [...document.querySelectorAll('.ai-ed-row .chip')].find(b2 => b2.textContent === 'm7').click();
    await new Promise(r2 => setTimeout(r2, 300));
    return { open, was, now: PD.ai.current.res.chords[i].root + PD.ai.current.res.chords[i].q, by: PD.ai.current.res.chordsBy, canUndo: !document.querySelector('.ai-chback').hidden };
  });
  await p.evaluate(() => document.querySelector('.ai-rwrap').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'edit.png' });
  console.log(JSON.stringify({ before, half, typed, met: { n: met.num + '/' + met.den, bpb: met.beatsPerBar, byHand: met.byHand }, ch }, null, 1));
  console.log('ERR', errs.slice(0, 4)); await b.close();
})();
