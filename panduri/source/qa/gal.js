// contact sheet of every main screen: node qa/gal.js <tag>
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/gal/';
require('fs').mkdirSync(OUT, { recursive: true });
const tag = process.argv[2] || 'a';
const R = ['home', 'learn', 'songs', 'practice', 'profile', 'settings', 'theory', 'tips', 'solfege', 'ai', 'rhythms', 'metronome', 'chords', 'fretboard', 'trainer', 'daily', 'progress', 'community', 'lesson:bani-acharuli', 'path:instrument'];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); }); await p.reload(); await p.waitForTimeout(1500);
  await p.screenshot({ path: OUT + tag + '-00-first.png' });
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  let i = 1;
  for (const r of R) { const [route, pa] = r.split(':'); await p.evaluate(([a, b2]) => { PD.app.go(a, b2 || null); }, [route, pa]); await p.waitForTimeout(1100); await p.screenshot({ path: OUT + tag + '-' + String(i++).padStart(2, '0') + '-' + route + '.png' }); }
  await b.close();
})();
