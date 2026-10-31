const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/h3/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await p.goto(process.env.URL || 'http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('intro.done', true); document.querySelector('.ag')?.remove(); });
  await p.waitForTimeout(900);
  const chord = process.env.CH || 'Bm', fr = process.env.FR || '';
  await p.evaluate(([c, f]) => { const all = PD.curriculum.chords(), TT = PD.theory; let id = null; if (f) { for (const x of all) { if (x.none) continue; const T = x.q != null ? TT.CHORD_TYPES.find(y => y.k === x.q) : null; const vs = (x.voicings || [x]).concat(x.root != null && T ? TT.voicings(x.root, T) : []); const v = vs.find(v => v.frets.join('-') + '/' + v.fingers.map(q => q || 0).join('') === f); if (v) { id = x.id + '|' + v.frets.join('-'); break; } } } PD.app.go('chords', id || all.find(x => x.name === c).id); }, [chord, fr]); await p.waitForTimeout(900);
  await p.click('.h3-dim button[data-k="3d"]'); await p.waitForTimeout(9000);
  const r = await p.evaluate(() => ({ msg: document.querySelector('.h3-msg')?.hidden ? '' : document.querySelector('.h3-msg')?.textContent, caps: [...document.querySelectorAll('.h3-caps li')].map(x => x.textContent), stage: !document.querySelector('.h3-stage')?.hidden }));
  await p.screenshot({ path: OUT + 'h3_front.png' });
  await p.click('.h3-views button[data-k="player"]'); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + 'h3_player.png' });
  await p.click('.ce-stepb'); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'h3_step.png' });
  console.log(JSON.stringify(r), errs.slice(0, 5)); await b.close();
})();
