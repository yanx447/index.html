// The marketplace in the built app (dist/app), with a fake server in the browser: no real account, payment or network.
// Every page at phone, tablet and desktop widths: no script error, nothing wider than the screen, the four paid packages
// on the promotion page (no free listing), a running sale's struck-out prices, the deletion warning before payment, sponsored
// labels, the countdown words, the owner's discounts page and Premium's sale price on the checkout page.
//   node --test qa/market-ui.cjs            (APP_DIR=dist/app by default)
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');
const localApp = require('./local-app.cjs');
const DIR = path.resolve(process.env.APP_DIR || path.join(__dirname, '../dist/app'));
const APP = 'http://panduri.test/', SB = 'https://market-test.invalid';
const ME = '12345678-1234-1234-1234-123456789abc', OTHER = '87654321-4321-4321-4321-cba987654321';
const NOW = Date.now(), H = 3600e3;
const card = (id, o = {}) => Object.assign({ id, title: 'ფანდური ' + id.slice(0, 4), category: 'panduri', condition: 'good', price: 450, currency: 'GEL', negotiable: false, city: 'თბილისი',
  photo: null, photos: 1, video: true, audio: true, published_at: new Date(NOW - 2 * H).toISOString(), expires_at: new Date(NOW + 22 * H).toISOString(), sponsored: false, package: null,
  seller: { id: OTHER, name: 'ბექა', nick: 'beka', avatar: null } }, o);
const ID = n => String(n).padStart(8, '0') + '-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const ads = [card(ID(1), { sponsored: true, package: 'ad24', title: 'ძალიან გრძელი სათაურის მქონე ფანდური, რომელიც ორ ხაზზე უნდა მოთავსდეს და არ გადავიდეს' }), card(ID(2), { sponsored: true, package: 'ad720', expires_at: new Date(NOW + 2.6 * 864e5).toISOString() })];
const free = Array.from({ length: 9 }, (_, i) => card(ID(10 + i), { price: i % 3 ? 120 * i : null, expires_at: new Date(NOW + (i + 1) * 3 * 864e5).toISOString() }));
const UNTIL = new Date(NOW + 20 * 864e5).toISOString();
const PKG = [['free', 'free', 720, 0, null, 'უფასო განცხადება', 'Free listing'], ['ad24', 'ad', 24, 500, 299, '24-საათიანი რეკლამა', '24-Hour Advertisement'], ['ad72', 'ad', 72, 1000, 699, '3-დღიანი რეკლამა', '3-Day Advertisement'],
  ['ad168', 'ad', 168, 2000, 1499, 'კვირის რეკლამა', 'Weekly Advertisement'], ['ad720', 'ad', 720, 4000, 2999, 'თვის რეკლამა', 'Monthly Advertisement']].map(([id, kind, hours, price_minor, sale_minor, name_ka, name_en]) => ({ id, kind, hours, sale_minor, sale_until: sale_minor ? UNTIL : null, price_minor, currency: 'GEL', name_ka, name_en, active: true }));

async function open(browser, width, lang, state) {
  const context = await browser.newContext({ viewport: { width, height: 860 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(([lang, sb, me]) => {
    const set = (k, v) => localStorage.setItem('pd2:' + k, JSON.stringify(v));
    set('lang', lang); set('cloud.config', { url: sb, key: 'test-key' });
    set('cloud.session', { access_token: 'test-only', refresh_token: 'test-only', expires_at: Date.now() / 1000 + 3600, user: { id: me, created_at: '2025-01-01' } });
    set('cloud.profile', { id: me, role: 'admin', display_name: 'ანა', nickname: 'ana', owner: true });
  }, [lang, SB, ME]);
  await localApp(page, DIR);
  await page.route(u => !u.href.startsWith(APP) && !u.href.startsWith(SB), r => r.abort());   // nothing reaches a real server
  await page.route(SB + '/**', async route => {
    const req = route.request(), url = new URL(req.url()), p = url.pathname;
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
    if (req.method() === 'OPTIONS') return json({});
    const now = new Date().toISOString();
    if (p === '/rest/v1/rpc/market_search') return json({ now, items: free, sponsored: ads });
    if (p === '/rest/v1/rpc/market_featured') return json({ now, items: ads });
    if (p === '/rest/v1/rpc/market_get') {
      const id = req.postDataJSON().listing, base = ads.concat(free).find(x => x.id === id) || card(id);
      const mine = state.mine && id === state.mine.id;
      return json(Object.assign({}, base, { now, body: 'ცაცხვი, 2019 წელი.\nსიმები ახალია.', media: [], has_phone: true, live: true, status: 'active', saved: false, mine: !!mine }, mine ? state.mine : {}, mine ? { stats: { impressions: 120, sponsored_impressions: 40, views: 18, contacts: 3, favorites: 2 } } : {}));
    }
    if (p === '/rest/v1/rpc/market_mine') return json({ now, items: [Object.assign(card(ID(90)), { status: 'active', live: true, stats: { views: 4, contacts: 1, impressions: 30 } }), Object.assign(card(ID(91)), { status: 'draft', live: false, expires_at: null, published_at: null, stats: {} }), Object.assign(card(ID(92)), { status: 'pending', live: false, expires_at: null, stats: {} })] });
    if (p === '/rest/v1/rpc/market_admin_overview') return json({ now, premoderate: false, packages: PKG.map(x => Object.assign({ sold: 3, revenue: 9, active: 1 }, x)), revenue: { GEL: 52 },
      counts: { active_ads: 2, active_free: 9, pending: 1, expiring_24h: 1, deleted_30d: 4, open_reports: 0 }, expiring: [{ id: ID(1), title: 'ფანდური', expires_at: ads[0].expires_at, paid: true }],
      pending: [], history: [{ deleted_at: now, reason: 'expired', paid: true, media: 3 }], reports: [],
      cleanup: { last_run: { started_at: now, finished_at: now, deleted: 1, held: 0, warned: 0, failed: 0 }, runs_24h: 1440, failed_runs_24h: 0, errors: [], media_waiting: 0, media_failed: 0, media_errors: [], media_deleted_30d: 12 },
      payments: { orders: { paid: 5, created: 1 }, stale: [], orphaned: [], recent: [{ id: 'p1', provider: 'tbc', package: 'ad72', amount: '7.00', currency: 'GEL', status: 'applied', effect: 'extend', paid_at: now }] } });
    if (p === '/rest/v1/market_packages') return json(PKG);
    if (p === '/functions/v1/market') return json({ packages: [], providers: [{ id: 'tbc', kind: 'card', wallets: [], prices: Object.fromEntries(PKG.filter(x => x.kind === 'ad').map(x => [x.id, { value: (x.sale_minor / 100).toFixed(2), currency: 'GEL', regular: (x.price_minor / 100).toFixed(2), until: UNTIL }])) }], stores: {}, policies: {} });
    if (p === '/rest/v1/rpc/owner_sales') return json({ now, premium: [{ plan: 'monthly', price_minor: 1499, sale_minor: 999, paypal_sale_value: '3.44', sale_until: UNTIL }, { plan: 'yearly', price_minor: 11999, sale_minor: 8999, paypal_sale_value: '31.03', sale_until: null }],
      market: PKG.filter(x => x.kind === 'ad').map(x => Object.assign({ paypal_value: null, paypal_currency: null, paypal_sale_value: null }, x)) });
    if (p === '/functions/v1/billing') return json({ providers: [{ id: 'tbc', kind: 'card', wallets: [], prices: { monthly: { value: '9.99', currency: 'GEL', regular: '14.99', until: UNTIL }, yearly: { value: '119.99', currency: 'GEL' } } }], stores: {}, policies: {} });
    if (p === '/rest/v1/profiles') return json([{ id: ME, role: 'admin', display_name: 'ანა', nickname: 'ana' }]);
    if (p === '/rest/v1/rpc/is_owner') return json(true);
    if (p.startsWith('/storage/v1/object/sign')) return json([]);
    if (p === '/auth/v1/settings') return json({ external: { email: true } });
    if (p === '/auth/v1/user') return json({ id: ME });
    return json(p.startsWith('/rest/v1/rpc/') ? null : []);
  });
  await page.goto(APP, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.PD && PD.app && PD.market && document.getElementById('main'), null, { timeout: 30000 });
  return { context, page, errors };
}
async function show(page, param) {
  await page.evaluate(param => {
    document.querySelectorAll('.sheet-back, .arr, .ob, .au-gate, #auth-gate, .intro, .welcome').forEach(x => x.remove());
    PD.app.go('market', param);
  }, param);
  await page.waitForFunction(() => !document.querySelector('.mk [aria-busy="true"]'), null, { timeout: 15000 });
  await page.waitForTimeout(300);
}
async function noOverflow(page, label) {
  const o = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth, out = [];
    document.querySelectorAll('.mk *').forEach(el => {
      if (el.closest('.mk-rail, .mk-gal, .mk-chips')) return;    // these scroll sideways by design
      const r = el.getBoundingClientRect(); if (r.width && (r.right > vw + 1 || r.left < -1)) out.push((el.className || el.tagName) + ' ' + Math.round(r.left) + '→' + Math.round(r.right));
    });
    return { vw, sw: document.documentElement.scrollWidth, out: out.slice(0, 5) };
  });
  assert.ok(o.sw <= o.vw + 1, label + ': page scrolls sideways (' + o.sw + ' > ' + o.vw + ')');
  assert.deepEqual(o.out, [], label + ': elements past the screen edge');
}

test('the marketplace at 320, 390, 768 and 1280 px: front page, a listing, the promotion page, my listings, the dashboard', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [320, 390, 768, 1280]) {
      for (const lang of ['ka', 'en']) {
        const state = { mine: card(ID(90), { title: 'ჩემი ფანდური', sponsored: true, package: 'ad720', expires_at: new Date(NOW + 29 * 864e5).toISOString(), published_at: new Date(NOW - 864e5).toISOString() }) };
        const { context, page, errors } = await open(browser, width, lang, state);
        const L = `${width}px ${lang}`;
        await show(page, '');
        assert.ok(await page.locator('.mk-rail .mk-card.sp').count() >= 2, L + ': the sponsored carousel');
        assert.equal(await page.locator('.mk-rail .mk-badge').first().innerText(), lang === 'ka' ? 'რეკლამა' : 'Sponsored');
        assert.ok(await page.locator('.mk-grid .mk-card').count() >= 9, L + ': the listings');
        const cd = await page.locator('.mk-rail .mk-cd-t span').first().innerText();
        assert.match(cd, lang === 'ka' ? /^დარჩენილია \d+ საათი(, \d+ წუთი)?$/ : /^\d+ hours?(, \d+ minutes?)? left$/, L + ': ' + cd);
        await noOverflow(page, L + ' front');
        assert.deepEqual(await page.evaluate(() => [...document.querySelectorAll('.mk-link span')].filter(s => s.scrollWidth > s.clientWidth + 1).map(s => s.textContent)), [], L + ': a label wider than its button');
        await page.screenshot({ path: path.join(process.env.SHOTS || '/tmp', `mk-home-${width}-${lang}.png`), fullPage: false }).catch(() => {});
        // a search: sponsored places appear among the results, labelled
        await page.fill('.mk-bar input', 'ფანდური');
        await page.waitForFunction(() => document.querySelector('.mk-grid .mk-card.sp'), null, { timeout: 5000 });
        assert.equal(await page.locator('.mk-rail').count() === 0 || await page.locator('.mk-sec[hidden] .mk-rail').count() > 0, true, L + ': carousel hidden while searching');
        await page.fill('.mk-bar input', '');
        // a listing
        await show(page, 'l:' + ID(10));
        assert.ok(await page.locator('.mk-cd.big').count(), L + ': countdown on the page');
        assert.ok(await page.getByRole('button', { name: lang === 'ka' ? 'ტელეფონის ნახვა' : 'Show phone' }).count());
        await noOverflow(page, L + ' listing');
        // my live listing → extending it: four advertisements on sale, the deletion warning, the new deadline
        await show(page, 'promote:' + ID(90));
        assert.equal(await page.locator('.mk-plan').count(), 4, L + ': four paid packages for a live listing');
        assert.equal(await page.locator('.mk-head h1').innerText(), lang === 'ka' ? 'რეკლამის გაგრძელება' : 'Extend the advertisement');
        const plans = await page.locator('.mk-plan').allInnerTexts();
        for (const [ka, en, sale, was, pct] of [['24-საათიანი რეკლამა', '24-Hour Advertisement', '2.99', '5', 40], ['3-დღიანი რეკლამა', '3-Day Advertisement', '6.99', '10', 30], ['კვირის რეკლამა', 'Weekly Advertisement', '14.99', '20', 25], ['თვის რეკლამა', 'Monthly Advertisement', '29.99', '40', 25]])
          assert.ok(plans.some(p => p.includes(lang === 'ka' ? ka : en) && p.includes(sale) && new RegExp('\\b' + was + '\\b').test(p) && p.includes('−' + pct + '%')), L + ': ' + en + ' ' + sale + ' instead of ' + was);
        assert.equal(await page.locator('.mk-plan .price-was').count(), 4, L + ': the regular prices struck out');
        assert.equal(await page.locator('.mk-plan .price-was').first().evaluate(e => getComputedStyle(e).textDecorationLine), 'line-through');
        assert.match(await page.locator('.mk-what').innerText(), lang === 'ka' ? /ფასდაკლების დასრულება/ : /The sale ends/, L + ': when the sale ends, and the price after it');
        if (lang === 'ka') assert.doesNotMatch(await page.locator('.mk-what').innerText(), /January|February|March|April|May|June|July|August|September|October|November|December|AM|PM/, L + ': Georgian dates in Georgian');
        assert.ok(await page.locator('.mk-warn').isVisible(), L + ': the warning before payment');
        assert.match(await page.locator('.mk-warn').innerText(), lang === 'ka' ? /მთელი განცხადება ავტომატურად წაიშლება/ : /whole listing is deleted automatically/);
        assert.match(await page.locator('.mk-what').innerText(), lang === 'ka' ? /დაემატება ახლანდელ ვადას/ : /Added to its current deadline/);
        assert.match(await page.locator('.mk-go').innerText(), /2\.99/);
        assert.ok(await page.locator('.mk-perks').isVisible(), L + ': what an advertisement gives, once');
        await noOverflow(page, L + ' promote');
        await page.screenshot({ path: path.join(process.env.SHOTS || '/tmp', `mk-promote-${width}-${lang}.png`), fullPage: true }).catch(() => {});
        // a draft: the same four packages — there is no free listing
        state.mine = Object.assign({}, state.mine, { status: 'draft', live: false, sponsored: false, expires_at: null, published_at: null });
        await show(page, 'promote:' + ID(90));
        assert.equal(await page.locator('.mk-plan').count(), 4, L + ': only paid packages for a draft');
        assert.equal(await page.locator('.mk-plan.free').count(), 0);
        assert.equal(await page.locator('.mk-head h1').innerText(), lang === 'ka' ? 'აირჩიე პაკეტი' : 'Choose a package');
        await page.locator('.mk-plan').nth(2).click();
        assert.match(await page.locator('.mk-what').innerText(), lang === 'ka' ? /გადახდის დადასტურებისთანავე/ : /as soon as the payment is confirmed/);
        await noOverflow(page, L + ' promote draft');
        await show(page, 'mine');
        assert.equal(await page.locator('.mk-row').count(), 3);
        await noOverflow(page, L + ' mine');
        await show(page, 'new');
        assert.ok(await page.locator('.mk-form').count());
        await noOverflow(page, L + ' form');
        await show(page, 'admin');
        assert.equal(await page.locator('.mk-pk-r').count(), 4, L + ': the four packages in the dashboard');
        await noOverflow(page, L + ' admin');
        // the owner's discounts: Premium and the four packages, each with its price, end and a switch
        await show(page, 'sales');
        assert.equal(await page.locator('.mk-sale-r').count(), 6, L + ': two Premium plans + four packages');
        assert.equal(await page.locator('.mk-sale-r.on').count(), 5);
        assert.match(await page.locator('.mk-sale-r.on').first().innerText(), lang === 'ka' ? /−33%/ : /−33%/);
        await noOverflow(page, L + ' sales');
        await page.screenshot({ path: path.join(process.env.SHOTS || '/tmp', `mk-sales-${width}-${lang}.png`), fullPage: true }).catch(() => {});
        // Premium on the checkout page: 9.99 with 14.99 struck out, the end of the sale and the price after it
        await page.evaluate(() => { document.querySelectorAll('.sheet-back, .arr').forEach(x => x.remove()); PD.app.go('checkout', 'monthly'); });
        await page.waitForSelector('.pay-plan .price-was', { timeout: 10000 });
        assert.match(await page.locator('.pay-plan[aria-checked="true"]').innerText(), /9\.99[\s\S]*|14\.99/);
        assert.match(await page.locator('.pay-plan[aria-checked="true"] .price-was').innerText(), /14\.99/);
        assert.match(await page.locator('.pay-sum').innerText(), lang === 'ka' ? /ფასდაკლების დასრულება/ : /The sale ends/);
        assert.equal(await page.locator('.pay-plan:not([aria-checked="true"]) .price-was').count(), 0, L + ': no struck-out price where there is no sale');
        assert.deepEqual(errors, [], L + ': script errors');
        await context.close();
      }
    }
  } finally { await browser.close(); }
});

test('a listing that has ended answers "no longer available" at its own address', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const { context, page, errors } = await open(browser, 390, 'en', {});
    await page.route(SB + '/rest/v1/rpc/market_get', r => r.fulfill({ status: 200, contentType: 'application/json', body: 'null' }));
    await show(page, 'l:' + ID(55));
    assert.match(await page.locator('.mk-empty').innerText(), /no longer available/);
    assert.deepEqual(errors, []);
    await context.close();
  } finally { await browser.close(); }
});

test('true comparisons, struck out: thirty one-day advertisements for the monthly one, twelve monthly payments for the year', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const lang of ['ka', 'en']) {
      const state = { mine: card(ID(90), { title: 'ჩემი ფანდური', status: 'draft', live: false, sponsored: false, expires_at: null, published_at: null }) };
      const { context, page, errors } = await open(browser, 390, lang, state);
      const plain = { ad24: '2.99', ad72: '6.99', ad168: '14.99', ad720: '29.99' };
      await page.route(SB + '/functions/v1/market', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ packages: [], providers: [{ id: 'tbc', kind: 'card', wallets: [], prices: Object.fromEntries(Object.entries(plain).map(([k, v]) => [k, { value: v, currency: 'GEL' }])) }], stores: {}, policies: {} }) }));
      await page.route(SB + '/rest/v1/market_packages*', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PKG.map(p => Object.assign({}, p, { sale_minor: null, sale_until: null, price_minor: Math.round(Number(plain[p.id] || 0) * 100) }))) }));
      await page.route(SB + '/functions/v1/billing', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ providers: [{ id: 'tbc', kind: 'card', wallets: [], prices: { monthly: { value: '14.99', currency: 'GEL' }, yearly: { value: '119.99', currency: 'GEL' } } }], stores: {}, policies: {} }) }));
      await show(page, 'promote:' + ID(90));
      assert.equal(await page.locator('.mk-plan .price-was').count(), 3, lang + ': the three longer packages, not the 24-hour one');
      const month = await page.locator('.mk-plan').nth(3).innerText();
      assert.match(month, /89[.,]7/); assert.match(month, /29[.,]99/); assert.match(month, /−67%/);
      assert.match(month, lang === 'ka' ? /24-საათიანით 30 დღე/ : /Day by day, 30 days would cost/);
      assert.equal(await page.locator('.mk-plan').nth(0).locator('.price-was').count(), 0);
      await page.screenshot({ path: path.join(process.env.SHOTS || '/tmp', `mk-compare-${lang}.png`), fullPage: false }).catch(() => {});
      await page.evaluate(() => { document.querySelectorAll('.sheet-back, .arr').forEach(x => x.remove()); PD.app.go('checkout', 'yearly'); });
      await page.waitForSelector('.pay-plan .price-was', { timeout: 10000 });
      const year = await page.locator('.pay-plan[aria-checked="true"]').innerText();
      assert.match(year, /179[.,]88/); assert.match(year, /119[.,]99/); assert.match(year, /−33%/);
      assert.equal(await page.locator('.pay-plan .price-was').count(), 1, lang + ': only the yearly plan has a comparison');
      await page.screenshot({ path: path.join(process.env.SHOTS || '/tmp', `pay-compare-${lang}.png`), fullPage: false }).catch(() => {});
      assert.deepEqual(errors, []);
      await context.close();
    }
  } finally { await browser.close(); }
});

test('Public terms and privacy pages are linked in both languages even with an empty checkout catalog', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const { context, page, errors } = await open(browser, 390, 'ka', {});
    await page.route(SB + '/functions/v1/billing', route => route.fulfill({ json: { providers: [], stores: {}, policies: {} } }));
    await page.evaluate(() => PD.app.go('checkout', 'monthly'));
    const links = page.locator('.pay-foot a');
    await links.first().waitFor();
    assert.deepEqual(await links.evaluateAll(items => items.map(a => a.getAttribute('href'))), ['terms.html', 'privacy.html']);

    await page.goto(APP + 'terms.html');
    assert.equal(await page.locator('h1:visible').innerText(), 'მომსახურების პირობები');
    assert.match(await page.locator('article:visible').innerText(), /14\.99 ₾/);
    await page.getByRole('link', { name: 'EN', exact: true }).click();
    assert.equal(await page.locator('h1:visible').innerText(), 'Terms of Use');
    assert.match(await page.locator('article:visible').innerText(), /Draft refund policy/);
    await page.getByRole('link', { name: 'Privacy Policy', exact: true }).click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await page.getByRole('link', { name: 'Terms of Use and refund policy', exact: true }).click();
    assert.equal(await page.locator('h1:visible').innerText(), 'Terms of Use');
    assert.deepEqual(errors, []);
    await context.close();
  } finally { await browser.close(); }
});
