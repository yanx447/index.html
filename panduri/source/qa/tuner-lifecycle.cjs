const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      window.micRequests = [];
      navigator.mediaDevices.getUserMedia = () => new Promise((resolve, reject) => micRequests.push({ resolve, reject }));
      window.grantMic = async index => {
        const { audioContext } = await import('./js/audio-input.js');
        const stream = audioContext().createMediaStreamDestination().stream;
        micRequests[index].stream = stream;
        micRequests[index].resolve(stream);
      };
    });
    await page.goto(process.env.TUNER_URL || 'http://127.0.0.1:8197/panduri/source/ext/sami-simi/index.html?embedded=1');
    await page.waitForFunction(() => window.__panduri);
    await page.locator('#micBtn').click();
    await page.locator('#micGo').click();
    await page.waitForFunction(() => micRequests.length === 1);
    assert.equal(await page.locator('#micBtn').getAttribute('aria-busy'), 'true');
    await page.locator('#micBtn').click();
    await page.evaluate(() => grantMic(0));
    await page.waitForFunction(() => micRequests[0].stream.getTracks()[0].readyState === 'ended');
    assert.equal(await page.evaluate(() => __panduri.running), false);
    await page.locator('#micBtn').click();
    await page.waitForFunction(() => micRequests.length === 2);
    await page.evaluate(() => { __panduri.suspend(); __panduri.activate(); });
    await page.evaluate(() => grantMic(1));
    await page.waitForFunction(() => micRequests[1].stream.getTracks()[0].readyState === 'ended');
    assert.equal(await page.evaluate(() => __panduri.running), false);
    await page.locator('#micBtn').click();
    await page.waitForFunction(() => micRequests.length === 3);
    await page.evaluate(() => grantMic(2));
    await page.waitForFunction(() => __panduri.running);
    assert.equal(await page.locator('#micBtn').getAttribute('aria-busy'), 'false');
    await page.locator('#micBtn').click();
    assert.equal(await page.evaluate(() => micRequests[2].stream.getTracks()[0].readyState), 'ended');
    await page.locator('#micBtn').click();
    await page.waitForFunction(() => micRequests.length === 4);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.evaluate(() => grantMic(3));
    await page.waitForFunction(() => micRequests[3].stream.getTracks()[0].readyState === 'ended');
    assert.equal(await page.evaluate(() => __panduri.running), false);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(() => micRequests.length === 5);
    await page.evaluate(() => grantMic(4));
    await page.waitForFunction(() => __panduri.running);
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
    assert.equal(await page.evaluate(() => micRequests[4].stream.getTracks()[0].readyState), 'ended');
    assert.deepEqual(errors, []);
    console.log('Browser lifecycle: cancel, suspend/reactivate before permission, restart, stop, background/foreground and page exit passed.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
