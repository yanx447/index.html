const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1200);
  const scan = async (label) => console.log(label, JSON.stringify(await p.evaluate(() => {
    const warm = c => { const m = c.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?/); if (!m) return false; const [r, g, bb, a] = [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]]; return a > .05 && r - bb > 35 && r > 40 && r < 200 && g < r; };
    const out = {}; document.querySelectorAll('body *').forEach(el => { const cs = getComputedStyle(el); const bg = cs.backgroundImage !== 'none' && /rgb/.test(cs.backgroundImage) ? cs.backgroundImage : cs.backgroundColor; const hits = []; if (warm(bg) || (/gradient/.test(bg) && (bg.match(/rgba?\([^)]*\)/g) || []).some(warm))) hits.push('bg'); if (warm(cs.borderTopColor) && parseFloat(cs.borderTopWidth) > 0) hits.push('bd'); if (hits.length) { const k = el.tagName.toLowerCase() + '.' + [...el.classList].join('.'); out[k] = hits.join('+'); } });
    return out; })));
  await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1500); await scan('FIRST');
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  for (const r of ['home', 'learn', 'path:instrument', 'lesson:bani-acharuli', 'songs', 'rhythms', 'chords', 'settings', 'profile', 'ai', 'tips', 'theory', 'metronome', 'trainer']) { const [a, c] = r.split(':'); await p.evaluate(([a, c]) => PD.app.go(a, c || null), [a, c]); await p.waitForTimeout(900); await scan(r); }
  await b.close();
})();
