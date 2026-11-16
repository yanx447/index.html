// Local generated audio exercises the editor's public export-cache version.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ serviceWorkers: 'block' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://**/*', r => r.abort());
    await page.goto(process.env.APP_URL || 'http://localhost:8181/panduri/app/');
    await page.waitForFunction(() => window.PD?.vedit);
    await page.evaluate(() => {
      document.querySelectorAll('.ag,.lf,.ob,.cine,.cine-boot').forEach(e => e.remove());
      PD.i18n.set('en');
      const samples = 8000, ab = new ArrayBuffer(44 + samples * 2), view = new DataView(ab);
      const str = (off, s) => [...s].forEach((c, i) => view.setUint8(off + i, c.charCodeAt(0)));
      str(0, 'RIFF'); view.setUint32(4, ab.byteLength - 8, true); str(8, 'WAVE');
      str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
      view.setUint16(22, 1, true); view.setUint32(24, 8000, true); view.setUint32(28, 16000, true);
      view.setUint16(32, 2, true); view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, samples * 2, true);
      for (let i = 0; i < samples; i++) view.setInt16(44 + i * 2, Math.sin(i * 2 * Math.PI * 220 / 8000) * 12000, true);
      const root = document.createElement('div'); root.className = 'cam'; document.body.append(root);
      window.editor = PD.vedit.mount(root, { file: new File([ab], 'tone.wav', { type: 'audio/wav' }), meta: { w: 320, h: 240, dur: 1 }, roomMB: 20, onBack() {}, onNext() {} });
    });
    await page.locator('.ve-tool').filter({ has: page.locator('[data-t="ve.sound"]') }).click();
    await page.locator('.ve-sw').waitFor();
    await page.locator('.ve-sw').click();
    await page.waitForFunction(() => document.querySelector('.ve-st').textContent === '');
    const exportedVersion = await page.evaluate(() => editor.version());
    const strength = page.locator('.ve-row input').first();
    await strength.fill('90');
    await strength.dispatchEvent('change');
    await page.waitForFunction(() => document.querySelector('.ve-st').textContent === '');
    assert.ok(await page.evaluate(v => editor.version() > v, exportedVersion), 'changing noise removal must invalidate the previously rendered video');
    await page.evaluate(() => editor.destroy());
    assert.deepEqual(errors, []);
    console.log('PASS: changing noise removal strength invalidates the cached video export.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
