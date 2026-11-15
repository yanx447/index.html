// Isolated local regression checks: gestures must not navigate or swallow the next tap.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 600, height: 900 }, serviceWorkers: 'block', hasTouch: true });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('https://**/*', r => r.abort());
    await page.goto(process.env.APP_URL || 'http://localhost:8181/panduri/source/dist/app/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.PD?.app && document.querySelector('.nv-glass-track'));
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      document.querySelectorAll('.ag,.lf,.ob,.cine,.cine-boot').forEach(e => e.remove());
      document.documentElement.classList.remove('solid-nav', 'rm');
      PD.i18n.set('ka'); PD.app.go('home');
    });
    const nav = page.locator('.dock');
    const cdp = await context.newCDPSession(page);
    const touch = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: x == null ? [] : [{ x, y }] });
    await page.waitForTimeout(500);
    const rect = await nav.boundingBox();
    await touch('touchStart', rect.x + 80, rect.y + 30);
    await touch('touchMove', rect.x + 240, rect.y + 30);
    await touch('touchEnd');
    assert.equal(await page.evaluate(() => PD.app.route), 'home', 'swipe must not select a tab');
    await nav.locator('[data-go="learn"]').tap();
    assert.equal(await page.evaluate(() => PD.app.route), 'learn', 'tap after swipe works');
    await touch('touchStart', rect.x + 80, rect.y + 30);
    await touch('touchCancel');
    assert(!/glass-pressed/.test(await nav.getAttribute('class')), 'cancel clears pressed state');
    await nav.locator('[data-go="home"]').tap();
    assert.equal(await page.evaluate(() => PD.app.route), 'home', 'tap after cancel works');
    await page.mouse.move(rect.x + 80, rect.y + 30); await page.mouse.down();
    await page.mouse.move(2, rect.y - 80, { steps: 5 }); await page.mouse.up();
    assert(!/glass-pressed/.test(await nav.getAttribute('class')), 'release outside clears pressed state');
    assert.equal(await page.evaluate(() => PD.app.route), 'home');
    await nav.locator('[data-go="learn"]').focus(); await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => PD.app.route), 'learn', 'keyboard after drag works');
    await page.waitForTimeout(550);
    const indicator = nav.locator('.nv-ind');
    const before = await indicator.boundingBox();
    await page.mouse.move(rect.x + 400, rect.y + 30); await page.mouse.down();
    await page.waitForTimeout(350);
    const pressed = await indicator.boundingBox();
    assert(Math.abs(pressed.x - before.x) < 1 && Math.abs(pressed.width - before.width) < 1, 'pressing another tab must not deform selected indicator');
    await page.mouse.move(2, rect.y - 80); await page.mouse.up();
    await nav.locator('[data-go="home"]').click();
    await page.mouse.move(2, 100); await page.waitForTimeout(500);
    await page.screenshot({ path: path.resolve(__dirname, '../../../docs/v2-review/navigation/clear-glass-home.png'), clip: { x: 0, y: 780, width: 600, height: 120 } });
    for (const width of [320, 390, 780]) {
      await page.setViewportSize({ width, height: 900 }); await page.waitForTimeout(80);
      const r = await nav.boundingBox(); assert(r.x >= 0 && r.x + r.width <= width && r.width <= 561);
      assert.equal(await nav.locator('.nv:visible').count(), 5);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await nav.locator('.nv-glass-track').evaluate(e => getComputedStyle(e).display), 'none');
    await page.evaluate(() => document.documentElement.classList.add('solid-nav'));
    assert.equal(await nav.evaluate(e => getComputedStyle(e).backdropFilter), 'none');
    await page.setViewportSize({ width: 1440, height: 900 }); assert(await page.locator('.side').isVisible());
    assert.deepEqual(errors, []);
    console.log('PASS: touch swipe/tap, cancellation recovery, release outside, keyboard, stable indicator, mobile sizes, reduced motion, solid fallback, desktop; no page errors');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
