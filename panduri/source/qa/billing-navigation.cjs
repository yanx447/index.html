// Run against the built app with APP_URL; all payment/auth requests are mocked.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const APP = process.env.APP_URL || 'http://127.0.0.1:8194/panduri/app/';

test('Hosted checkout navigation survives an open paywall for free and active Premium accounts', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const active of [false, true]) {
      const context = await browser.newContext({ serviceWorkers: 'block' });
      const page = await context.newPage();
      page.setDefaultTimeout(10000); page.setDefaultNavigationTimeout(10000);
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(active => {
        const set = (key, value) => localStorage.setItem('pd2:' + key, JSON.stringify(value));
        set('lang', 'en'); set('cloud.profile', { role: 'member', vip_until: active ? '2099-01-01' : null });
        set('cloud.config', { url: 'https://billing-test.invalid', key: 'test-key' });
        set('cloud.session', { access_token: 'test-only', refresh_token: 'test-only', expires_at: Date.now() / 1000 + 3600, user: { id: '12345678-1234-1234-1234-123456789abc', created_at: '2025-01-01' } });
      }, active);
      let starts = 0;
      await page.route('**/*', async route => {
        const request = route.request(), url = new URL(request.url());
        if (url.href === APP) return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8">' + ['core', 'ui', 'cloud', 'billing', 'premium'].map(name => '<script src="js/' + name + '.js"></script>').join('') });
        if (url.origin === new URL(APP).origin) return route.continue();
        if (url.hostname === 'www.paypal.com') {
          // Allow a queued sheet-close history.back() to run before navigation commits.
          await new Promise(resolve => setTimeout(resolve, 100));
          return route.fulfill({ contentType: 'text/html', body: '<h1>Mock hosted checkout</h1>' });
        }
        if (url.hostname !== 'billing-test.invalid') return route.abort();
        let body = [];
        if (url.pathname === '/rest/v1/profiles') body = [{ role: 'member', premium_banned: false, vip_until: active ? '2099-01-01' : null }];
        if (url.pathname === '/rest/v1/rpc/is_owner') body = false;
        if (url.pathname === '/functions/v1/billing') {
          const input = request.postDataJSON();
          if (input.action === 'catalog') body = { providers: [{ id: 'paypal', prices: { monthly: { value: '5.17', currency: 'EUR' }, yearly: { value: '41.38', currency: 'EUR' } } }], stores: {}, policies: {} };
          else if (input.action === 'start') { starts++; body = { provider: 'paypal', order: 'test-order', url: 'https://www.paypal.com/checkoutnow?token=test-order' }; }
          else body = { paid: false };
        }
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
      });
      await page.goto(APP, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => !!window.PD?.premium?.paywall);
      await page.waitForFunction(active => PD.premium.active === active, active);
      await page.evaluate(() => { PD.app = { render() { throw new Error('Unexpected app render during checkout'); } }; PD.premium.paywall(); });
      await page.getByRole('button', { name: 'PayPal', exact: true }).waitFor();
      assert.match(await page.locator('.pw-plans').innerText(), /5\.17/);
      assert.match(await page.locator('.pw-plans').innerText(), /41\.38/);
      await page.locator('.pw-plan').first().click();
      await page.getByRole('button', { name: 'Buy Premium', exact: true }).click();
      await page.waitForURL('https://www.paypal.com/checkoutnow?token=test-order');
      await page.getByRole('heading', { name: 'Mock hosted checkout' }).waitFor();
      assert.equal(page.url(), 'https://www.paypal.com/checkoutnow?token=test-order');
      assert.equal(starts, 1);
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
});
