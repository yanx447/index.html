// Store screenshots via Playwright + a fake microphone (real pitch detection on synthetic plucks).
// Usage: node scripts/screens.cjs <baseUrl> <outDir> <tuneWav> <guidedWav>
const { chromium } = require('playwright');
const fs = require('fs');

const [,, base = 'http://localhost:8767/app/', out = 'store/screens-raw', tuneWav, guidedWav] = process.argv;
const DEVICES = [['ios', 440, 956, 3], ['android', 432, 960, 2.5]];

async function waitState(p, fn, ms = 14000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const ok = await p.evaluate(fn);
    if (ok) return true;
    await p.waitForTimeout(120);
  }
  return false;
}
const isTighten = () => { const s = window.__panduri.tracker.snap; return s.state === 'valid' && s.cents < -5; };
const isInTune = () => { const s = window.__panduri.tracker.snap; return s.state === 'intune' && s.inTuneMs > 600; };
const isLive = () => { const s = window.__panduri.tracker.snap; return (s.state === 'valid' || s.state === 'intune') && Math.abs(s.cents) > 2; };

async function session(wav, w, h, dpr, settings) {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${wav}`] });
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, permissions: ['microphone'], hasTouch: true, isMobile: true });
  const p = await c.newPage();
  await p.goto(base);
  await p.evaluate((s) => localStorage.setItem('sami-simi:v1', JSON.stringify(s)), settings);
  await p.reload();
  await p.waitForTimeout(900);
  return { b, p };
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  for (const [dev, w, h, dpr] of DEVICES) for (const lang of ['ka', 'en']) {
    const { b, p } = await session(tuneWav, w, h, dpr, { lang, micPrimed: true, mode: 'auto' });
    await p.click('#micBtn');
    await waitState(p, isTighten); await p.waitForTimeout(700); await p.screenshot({ path: `${out}/${dev}-${lang}-1-tighten.png` });
    await waitState(p, isInTune); await p.waitForTimeout(400); await p.screenshot({ path: `${out}/${dev}-${lang}-2-intune.png` });
    await p.click('#meterToggle'); await waitState(p, isLive, 20000); await p.waitForTimeout(800); await p.screenshot({ path: `${out}/${dev}-${lang}-3-strobe.png` });
    await p.click('#meterToggle');
    await p.click('#openSettings'); await p.waitForTimeout(700); await p.screenshot({ path: `${out}/${dev}-${lang}-5-settings.png` });
    await b.close();

    const g = await session(guidedWav, w, h, dpr, { lang, micPrimed: true, mode: 'guided', ui: 'simple' });
    await g.p.click('#micBtn');
    for (let i = 0; i < 45; i++) { await g.p.waitForTimeout(300); if (await g.p.isVisible('#complete')) break; }
    await g.p.waitForTimeout(1300); await g.p.screenshot({ path: `${out}/${dev}-${lang}-4-guided.png` });
    await g.b.close();
    console.log('done', dev, lang);
  }
})();
