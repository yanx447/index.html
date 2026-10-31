// exports really parse, and the editor changes the data
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs'), OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/aitr/';
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); PD.store.set('ai.test', true); document.querySelector('.ag')?.remove(); document.querySelector('.cine-boot')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(600);
  await p.evaluate(async url => { const blob = await (await fetch(url)).blob(); const f = new File([blob], 'bani.mp3', { type: 'audio/mpeg' }); const dt = new DataTransfer(); dt.items.add(f); const i = document.querySelector('input[type=file]'); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); }, 'http://localhost:8766/media/bani/music.mp3');
  await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 });
  await p.evaluate(() => [...document.querySelectorAll('.ai-trans button')].find(x => /ამოცნობა/.test(x.textContent)).click());
  await p.waitForFunction(() => document.querySelector('.tr-tabs'), null, { timeout: 300000 });
  await p.waitForTimeout(400);
  // waveform present?
  const wave = await p.evaluate(() => { const c = document.querySelector('.ai-ribbon'), x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4000) if (d[i] > 8) n++; return n; });
  // exports
  const names = ['MIDI', 'MusicXML', 'ტაბი', 'JSON'];
  const got = {};
  for (const nm of names) {
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 20000 }), p.evaluate(n => [...document.querySelectorAll('.ai-trans .ai-tool button')].find(x => x.textContent.startsWith(n)).click(), nm)]);
    const f = OUT + 'exp_' + nm + (dl.suggestedFilename().match(/\.[a-z]+$/) || [''])[0];
    await dl.saveAs(f); got[nm] = fs.statSync(f).size;
  }
  // the editor: raise one note by an octave and check the data followed
  const ed = await p.evaluate(async () => {
    document.querySelectorAll('.tr-tabs .tab')[2].click(); await new Promise(r => setTimeout(r, 200));
    [...document.querySelectorAll('.ai-trans .ai-tg')].find(x => /შესწორება/.test(x.textContent)).click();
    const before = PD.ai.current.transcription.notes[5].m;
    document.querySelectorAll('.tr-n')[5].click(); await new Promise(r => setTimeout(r, 200));
    const has = !!document.querySelector('.tr-ed');
    [...document.querySelectorAll('.tr-ed button')].find(x => x.textContent === '+8va').click(); await new Promise(r => setTimeout(r, 300));
    return { has, before, after: PD.ai.current.transcription.notes[5].m };
  });
  console.log(JSON.stringify({ waveformPixels: wave, exports: got, editor: ed }));
  console.log('ERR', errs.slice(0, 3)); await b.close();
})();
