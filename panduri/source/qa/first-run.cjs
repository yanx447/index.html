// The first-run pages (the questions, then the required introduction) open once per account, never per device.
// Run against `npm run dev`. The server is faked in the browser, no real account or network is touched.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const APP = process.env.APP_URL || 'http://localhost:8181/panduri/app/';
const SB = 'http://localhost:54399';   // never listened on: every request to it is answered by route() below
const OLD = '2025-03-01T10:00:00Z', NEW = new Date().toISOString();
const results = [];

/** a fake Supabase: accounts by e-mail, one progress row per account */
function fakeServer() {
  const users = {}, progress = {};
  const add = (email, created_at) => (users[email] = { id: 'u-' + email.split('@')[0], email, created_at });
  const handler = opts => async route => {
    const req = route.request(), url = new URL(req.url()), p = url.pathname, m = req.method();
    const json = (body, status) => route.fulfill({ status: status || 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: JSON.stringify(body) });
    if (m === 'OPTIONS') return json({});
    if (p === '/auth/v1/settings') return json({ external: { email: true } });
    if (p === '/auth/v1/token') {
      const u = users[req.postDataJSON().email]; if (!u) return json({ error_code: 'invalid_credentials' }, 400);
      return json({ access_token: 'tok-' + u.id, refresh_token: 'r', expires_in: 3600, user: u });
    }
    if (p === '/auth/v1/logout') return json({});
    const me = Object.values(users).find(u => (req.headers().authorization || '').endsWith('tok-' + u.id));
    if (p === '/auth/v1/user') return json(me);
    if (p === '/rest/v1/profiles') return json([{ id: me && me.id, display_name: '', role: 'member' }]);
    if (p === '/rest/v1/rpc/is_owner') return json(false);
    if (p === '/rest/v1/progress') {
      if (m === 'GET') {
        if (opts.failProgress) return json({ message: 'down' }, 500);
        if (opts.delayProgress) await new Promise(r => setTimeout(r, opts.delayProgress));
        return json(progress[me.id] ? [progress[me.id]] : []);
      }
      const row = req.postDataJSON()[0]; progress[row.user_id] = row; return json([row]);
    }
    return json([]);
  };
  return { users, progress, add, handler };
}

async function launch(browser, server, seed, opts) {
  const ctx = await browser.newContext({ viewport: { width: 420, height: 800 }, serviceWorkers: 'block', locale: 'ka-GE' });
  await ctx.addInitScript(([url, s]) => {
    if (localStorage.getItem('pd2:cloud.config')) return;
    localStorage.setItem('pd2:cloud.config', JSON.stringify({ url, key: 'sb_publishable_test' }));
    localStorage.setItem('pd2:uiSounds', 'false'); localStorage.setItem('pd2:lang', '"ka"');
    Object.keys(s).forEach(k => localStorage.setItem('pd2:' + k, JSON.stringify(s[k])));
  }, [SB, seed || {}]);
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', e => page.errors.push(e.message));
  await page.route(SB + '/**', server.handler(opts || {}));
  await page.goto(APP);
  await page.waitForFunction(() => window.PD && window.PD.app && document.querySelector('#page'));
  return { ctx, page };
}
const sessionOf = u => ({ access_token: 'tok-' + u.id, refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 3600, user: u });
const firstRunShown = page => page.evaluate(() => ({ ob: !!document.querySelector('.ob'), intro: !!document.querySelector('.intro') }));
const settled = page => page.waitForFunction(() => !document.querySelector('.arr'), null, { timeout: 15000 }).then(() => page.waitForTimeout(500));

async function signInByEmail(page, email) {
  await page.evaluate(() => { const b = document.querySelector('.sp-signin'); if (b) b.click(); });   // the opening film is still playing over it
  await page.locator('.ag-btn.mail').click();
  await page.locator('.ag-form input[type=email]').fill(email);
  await page.locator('.ag-form input[type=password]').fill('password123');
  await page.locator('.ag-form button[type=submit]').click();
  await page.waitForFunction(() => !document.querySelector('.ag') && window.PD.cloud.session);
  await settled(page);
}
async function walkThroughFirstRun(page) {
  const click = sel => page.locator(sel).first().click();
  await click('.ob .btn.primary');                 // welcome → next
  await click('.ob .opt:nth-of-type(2)');          // no panduri yet: the microphone and tuner steps are skipped
  await click('.ob .opt');                         // level
  await click('.ob .btn.primary');                 // goals
  await click('.ob .opt');                         // daily time
  await click('.ob .btn.quiet:last-of-type');      // finish, to home
  await page.waitForSelector('.intro');
  for (let i = 0; i < 6; i++) await page.locator('.in-next').click();
  await page.waitForFunction(() => !document.querySelector('.intro'));
}
const scenario = async (name, fn) => {
  try { await fn(); results.push('ok   ' + name); }
  catch (e) { results.push('FAIL ' + name + '\n     ' + e.message.split('\n')[0]); process.exitCode = 1; }
};

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    await scenario('an existing account on a device that has never seen it: no pages, and the server is told', async () => {
      const s = fakeServer(); s.add('old@x.ge', OLD);
      const { ctx, page } = await launch(browser, s);
      await signInByEmail(page, 'old@x.ge');
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false });
      assert.equal(s.progress['u-old'].data.onboarded, true);
      assert.deepEqual(page.errors, []); await ctx.close();
    });

    await scenario('a new account: the pages once, then never again, on this device or another', async () => {
      const s = fakeServer(); s.add('new@x.ge', NEW);
      let { ctx, page } = await launch(browser, s);
      await signInByEmail(page, 'new@x.ge');
      assert.deepEqual(await firstRunShown(page), { ob: true, intro: false });
      await walkThroughFirstRun(page);
      await page.waitForFunction(() => window.PD.store.get('intro.done', false));
      await page.waitForTimeout(5000);   // the upload waits 4 s after the last change
      assert.equal(s.progress['u-new'].data.onboarded, true);
      assert.equal(s.progress['u-new'].data['intro.done'], true);
      await page.reload(); await page.waitForFunction(() => window.PD && window.PD.app); await settled(page);
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false }, 'after a reload');
      assert.deepEqual(page.errors, []); await ctx.close();
      ({ ctx, page } = await launch(browser, s));   // a second device: empty storage
      await signInByEmail(page, 'new@x.ge');
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false }, 'on a second device');
      await ctx.close();
    });

    await scenario('leaving half way does not bring a page back: each opens once, and the cards stay in Learn', async () => {
      const s = fakeServer(); s.add('new@x.ge', NEW);
      const { ctx, page } = await launch(browser, s);
      const reopen = async () => { await page.reload(); await page.waitForFunction(() => window.PD && window.PD.app); await settled(page); };
      await signInByEmail(page, 'new@x.ge');
      assert.deepEqual(await firstRunShown(page), { ob: true, intro: false }, 'first launch');
      await reopen();   // left during the questions
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: true }, 'second launch: the cards have not been shown yet');
      await page.locator('.in-next').click();
      await reopen();   // left on the second card
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false }, 'third launch');
      await reopen();
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false }, 'fourth launch');
      for (const id of ['sit', 'hold', 'hands', 'strokes', 'fingers', 'stringnum']) {
        await page.evaluate(i => window.PD.app.go('tips', i, true), id);
        await page.waitForTimeout(150);
        const title = await page.evaluate(i => { const c = window.PD.tips.all(true).find(x => x.id === i); return document.querySelector('#page').innerText.includes(c.title[0]); }, id);
        assert.equal(title, true, 'card in Learn: ' + id);
      }
      assert.deepEqual(page.errors, []); await ctx.close();
    });

    await scenario('one device, two accounts: a new one is asked after signing out of the old one, the old one is not', async () => {
      const s = fakeServer(); const a = s.add('old@x.ge', OLD); s.add('new@x.ge', NEW);
      const { ctx, page } = await launch(browser, s, { 'cloud.session': sessionOf(a), onboarded: true, 'intro.done': true, 'progress.owner': a.id });
      await page.waitForTimeout(800);
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false });
      await page.evaluate(() => window.PD.cloud.auth.signOut());
      await page.waitForSelector('.ag');
      await signInByEmail(page, 'new@x.ge');
      assert.equal((await firstRunShown(page)).ob, true, 'the new account');
      await page.evaluate(() => document.querySelector('.ob').remove());
      await page.evaluate(() => window.PD.cloud.auth.signOut());
      await page.waitForSelector('.ag');
      await signInByEmail(page, 'old@x.ge');
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false }, 'back to the old account');
      await ctx.close();
    });

    await scenario('signed in, a slow server: the pages do not flash while the answer is on its way', async () => {
      const s = fakeServer(); const u = s.add('done@x.ge', NEW);
      s.progress[u.id] = { user_id: u.id, updated_at: new Date().toISOString(), data: { onboarded: true, 'intro.done': true, __mt: {} } };
      const { ctx, page } = await launch(browser, s, { 'cloud.session': sessionOf(u) }, { delayProgress: 3000 });
      for (let i = 0; i < 8; i++) { assert.deepEqual(await firstRunShown(page), { ob: false, intro: false }); await page.waitForTimeout(450); }
      await settled(page);
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false });
      await ctx.close();
    });

    await scenario('the server cannot be read: an account is not asked', async () => {
      const s = fakeServer(); const u = s.add('new@x.ge', NEW);
      const { ctx, page } = await launch(browser, s, { 'cloud.session': sessionOf(u) }, { failProgress: true });
      await settled(page);
      assert.deepEqual(await firstRunShown(page), { ob: false, intro: false });
      await ctx.close();
    });
  } finally { await browser.close(); }
  console.log(results.join('\n'));
})();
