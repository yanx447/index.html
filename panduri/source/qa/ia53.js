const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/ia/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })).newPage();
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  const out = {};
  for (const r of ['home', 'learn', 'path', 'theory', 'tips', 'solfege', 'practice', 'daily', 'trainer', 'metronome', 'rhythms', 'tuner', 'fretboard', 'explore', 'tools', 'songs', 'library', 'ai', 'profile', 'progress', 'settings', 'more']) {
    try { await p.evaluate(r => PD.app.go(r), r); await p.waitForTimeout(900);
      const info = await p.evaluate(() => { const pg = document.getElementById('page'); const hs = [...pg.querySelectorAll('h1,h2,h3,.kicker,summary b,.sec-head b')].map(e => e.tagName[0] + (e.tagName[1] || '') + ':' + e.textContent.trim().slice(0, 50)).filter(x => x.length > 3); const btn = pg.querySelectorAll('button,a').length; return { H: pg.scrollHeight, btn, words: pg.innerText.split(/\s+/).length, hs: hs.slice(0, 40) }; });
      out[r] = info;
      await p.setViewportSize({ width: 390, height: Math.min(info.H + 80, 9000) }); await p.waitForTimeout(500); await p.screenshot({ path: OUT + r + '.png' }); await p.setViewportSize({ width: 390, height: 844 });
    } catch (e) { out[r] = 'ERR ' + e.message.slice(0, 80); }
  }
  require('fs').writeFileSync(OUT + 'ia.json', JSON.stringify(out, null, 1)); await b.close();
})();
