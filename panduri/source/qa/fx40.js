const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1200);
  console.log(await p.evaluate(async () => {
    const sr = 44100, n = sr * 2, out = {};
    const mk = f => { const L = new Float32Array(n); for (let i = 0; i < n; i++) L[i] = f(i); return L; };
    const rms = (a, s, e) => { let q = 0; for (let i = s; i < e; i++) q += a[i] * a[i]; return Math.sqrt(q / (e - s)); };
    const run = async (L, cfg) => { const d = PD.aiDeck.create(); d.setSet({ id: 'x', sr, from: 0, tracks: [{ name: 'a', L, R: L }] }); d.setBeats([], 100, 0); cfg(d); const r = await d.render(); d.destroy(); return r.L; };
    const sine = mk(i => Math.sin(2 * Math.PI * 100 * i / sr) * .1);
    const base = await run(sine, () => {}), boost = await run(sine, d => d.setFx(0, 'low', 12));
    out.eqLow100Hz = (20 * Math.log10(rms(boost, sr * .5, sr * 1.5) / rms(base, sr * .5, sr * 1.5))).toFixed(1) + ' dB (want ~+12)';
    const hi = mk(i => Math.sin(2 * Math.PI * 8000 * i / sr) * .1), hcut = await run(hi, d => d.setFx(0, 'high', -12)), hb = await run(hi, () => {});
    out.eqHigh8k = (20 * Math.log10(rms(hcut, sr * .5, sr * 1.5) / rms(hb, sr * .5, sr * 1.5))).toFixed(1) + ' dB (want ~-12)';
    const clickT = mk(i => i < 200 ? (1 - i / 200) * .8 : 0);
    const dry = await run(clickT, () => {}), wet = await run(clickT, d => d.setFx(0, 'rev', .6));
    out.reverb = 'len ' + (dry.length / sr).toFixed(1) + 's → ' + (wet.length / sr).toFixed(1) + 's, tail rms ' + rms(wet, sr * .3, sr * 1.2).toExponential(1) + ' vs dry ' + rms(dry, sr * .3, sr * 1.2).toExponential(1);
    const ech = await run(clickT, d => d.setFx(0, 'echo', .8));
    let pk = 0, at = 0; for (let i = Math.round(sr * .1); i < sr * 1.5; i++) if (Math.abs(ech[i]) > pk) { pk = Math.abs(ech[i]); at = i; }
    out.echoFirstRepeat = (at / sr).toFixed(3) + 's (want 0.450 = dotted 8th at 100 BPM)';
    const loud = mk(i => Math.sin(2 * Math.PI * 220 * i / sr) * .9), lc = await run(loud, d => d.setComp(true)), ln = await run(loud, () => {});
    out.compressor = (20 * Math.log10(rms(lc, sr, sr * 1.8) / rms(ln, sr, sr * 1.8))).toFixed(1) + ' dB on a loud tone (want < 0)';
    return JSON.stringify(out, null, 1);
  }));
  // ripple, sounds, confetti, settings
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home', null, true); });
  await p.waitForTimeout(800);
  await p.mouse.click(100, 520); await p.waitForTimeout(60);
  console.log('ripple spawned', await p.evaluate(() => document.querySelectorAll('.fx-ripple').length >= 0 ? [...document.querySelectorAll('.fx-ripple')].length : 0));
  await p.waitForTimeout(900);
  await p.evaluate(() => PD.fx.celebrate()); await p.waitForTimeout(400);
  await p.screenshot({ path: '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/confetti.png' });
  console.log('confetti on', await p.evaluate(() => !!document.querySelector('.fx-confetti'))); await p.waitForTimeout(1600);
  console.log('confetti gone', await p.evaluate(() => !document.querySelector('.fx-confetti')), 'ripples left', await p.evaluate(() => document.querySelectorAll('.fx-ripple').length));
  await p.evaluate(() => PD.app.go('settings')); await p.waitForTimeout(700);
  console.log('settings toggle', await p.evaluate(() => !!document.querySelector('[data-t="set.uiSounds"]')));
  console.log('ERRORS', errs.length ? errs : 'none');
  await b.close();
})();
