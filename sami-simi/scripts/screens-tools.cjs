// Extra store screenshots for the tools: all-three-at-once (fake mic plays a real strum),
// a chord on the 3D neck, and the tools page.
// Usage: node scripts/screens-tools.cjs <baseUrl> <outDir> <strumWav>
const { chromium } = require('playwright');
const fs = require('fs');

const [,, base = 'http://localhost:8768/sami-simi/app/', out = 'store/screens-raw', strumWav] = process.argv;
const DEVICES = [['ios', 440, 956, 3], ['android', 432, 960, 2.5]];
const LAUNCH = { executablePath: process.env.CHROMIUM || undefined, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${strumWav}`, '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] };

async function page(b, w, h, dpr, lang, path = '') {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, permissions: ['microphone'], hasTouch: true, isMobile: true });
  const p = await c.newPage();
  await p.goto(base);
  await p.evaluate((s) => localStorage.setItem('sami-simi:v1', JSON.stringify(s)), { lang, micPrimed: true, mode: 'auto' });
  await p.goto(base + path);
  await p.waitForTimeout(1000);
  return p;
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(LAUNCH);
  for (const [dev, w, h, dpr] of DEVICES) for (const lang of ['ka', 'en']) {
    // 6 — all three at once: wait for a finished result
    let p = await page(b, w, h, dpr, lang, '?tool=strumtune');
    await p.click('[data-act="mic"]');
    for (let i = 0; i < 60; i++) { await p.waitForTimeout(200); if (await p.evaluate(() => !document.querySelector('.st-col.live') && !!document.querySelector('.st-col.ok, .st-col.warn'))) break; }
    await p.screenshot({ path: `${out}/${dev}-${lang}-6-strum.png` });
    await p.context().close();

    // 7 — chord on the 3D neck (B minor: barré on fret 2, middle string on fret 1)
    p = await page(b, w, h, dpr, lang, '?chord=Bm');
    await p.click('[data-act="3d"]');
    await p.waitForTimeout(9000); // software rendering in CI is slow; let the camera settle
    await p.screenshot({ path: `${out}/${dev}-${lang}-7-chord3d.png` });
    await p.context().close();

    // 8 — tools page
    p = await page(b, w, h, dpr, lang);
    await p.click('#openTools'); await p.waitForTimeout(800);
    await p.screenshot({ path: `${out}/${dev}-${lang}-8-tools.png` });
    await p.context().close();
    console.log('done', dev, lang);
  }
  await b.close();
})();
