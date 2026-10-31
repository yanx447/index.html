const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = process.argv[2] || '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/ui/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  // the real fonts come from Google Fonts on devices; here the closest local faces stand in
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: "@font-face{font-family:'Noto Serif Georgian';src:local('DejaVu Serif');font-weight:600 700}@font-face{font-family:'Noto Sans Georgian';src:local('DejaVu Sans');font-weight:400 500}@font-face{font-family:'Noto Sans Georgian';src:local('DejaVu Sans Bold');font-weight:600 700}" }));
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  for (const [r, prm] of [['home'], ['learn'], ['songs'], ['lesson', 'bani-acharuli'], ['lesson', 'poc-three'], ['practice'], ['profile'], ['settings'], ['theory'], ['chords'], ['rhythms'], ['tuner'], ['trainer'], ['metronome'], ['fretboard'], ['daily'], ['progress'], ['community']]) {
    await p.evaluate(([r, prm]) => PD.app.go(r, prm || null), [r, prm]); await p.waitForTimeout(900);
    await p.screenshot({ path: OUT + 'v-' + r + (prm ? '-' + prm : '') + '.png' });
  }
  await b.close();
})();
