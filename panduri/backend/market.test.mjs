// The marketplace's Edge Function with mocked providers: what the server sends to TBC / PayPal / RevenueCat, what it
// believes, and what it tells the database. The database side is market-sql.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMarket, marketHandler } from './supabase/functions/_shared/market.js';
import { paymentCallback, storeWebhook } from './supabase/functions/_shared/callbacks.js';
import { catalog, premiumSales, createBilling } from './supabase/functions/_shared/billing.js';

const uid = '12345678-1234-1234-1234-123456789abc', listing = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const secrets = { APP_URL: 'https://yanx447.github.io/index.html/panduri/app/', SUPABASE_URL: 'https://backend.example', SUPABASE_SERVICE_ROLE_KEY: 'service', TBC_API_KEY: 'test', TBC_CLIENT_ID: 'test', TBC_CLIENT_SECRET: 'test',
  PAYPAL_CLIENT_ID: 'test', PAYPAL_CLIENT_SECRET: 'test', PAYPAL_MERCHANT_ID: 'merchant', PAYPAL_WEBHOOK_ID: 'webhook', PAYPAL_CURRENCY: 'EUR', PAYPAL_MONTHLY_PRICE: '5.17', PAYPAL_YEARLY_PRICE: '41.38',
  REVENUECAT_SECRET_KEY: 'rc', REVENUECAT_WEBHOOK_TOKEN: 'hook', REVENUECAT_IOS_KEY: 'ios-public', TERMS_URL: 'https://x.example/terms', PRIVACY_URL: 'https://x.example/privacy' };
const PKG = [
  { id: 'free', kind: 'free', hours: 720, price_minor: 0, currency: 'GEL', active: true, sort: 0, name_en: 'Free listing', name_ka: 'უფასო განცხადება' },
  { id: 'ad24', kind: 'ad', hours: 24, price_minor: 500, sale_minor: 299, currency: 'GEL', active: true, sort: 1, store_product: 'market_ad24', name_en: '24-Hour Advertisement', name_ka: '24-საათიანი რეკლამა' },
  { id: 'ad72', kind: 'ad', hours: 72, price_minor: 1000, sale_minor: 699, currency: 'GEL', active: true, sort: 2, store_product: 'market_ad72', name_en: '3-Day Advertisement', name_ka: '3-დღიანი რეკლამა' },
  { id: 'ad168', kind: 'ad', hours: 168, price_minor: 2000, sale_minor: 1499, currency: 'GEL', active: true, sort: 3, store_product: 'market_ad168', name_en: 'Weekly Advertisement', name_ka: 'კვირის რეკლამა', paypal_value: '5.17', paypal_currency: 'EUR' },
  { id: 'ad720', kind: 'ad', hours: 720, price_minor: 4000, sale_minor: 2999, currency: 'GEL', active: true, sort: 4, store_product: 'market_ad720', name_en: 'Monthly Advertisement', name_ka: 'თვის რეკლამა' }];

function setup(o = {}) {
  const orders = [], rpcs = [], calls = [];
  let captured = false;
  const db = {
    auth: { getUser: async () => ({ data: { user: o.unauthorized ? null : { id: uid } } }) },
    from: table => ({
      insert: async row => { if (table === 'market_orders') orders.push(row); return {}; },
      select: () => {
        const f = {};
        const q = { eq: (k, v) => { f[k] = v; return q; }, order: async () => ({ data: o.pkg || PKG }),
          single: async () => ({ data: table === 'market_orders' ? orders.find(x => Object.entries(f).every(([k, v]) => x[k] === v)) : table === 'profiles' ? { premium_banned: false } : null }),
          maybeSingle: async () => ({ data: table === 'market_orders' ? orders.find(x => Object.entries(f).every(([k, v]) => x[k] === v)) || null : null }) };
        return q;
      }
    }),
    rpc: async (name, args) => {
      rpcs.push({ name, args });
      if (name === 'market_order_check') return o.check ? { error: { message: o.check } } : { data: {} };
      if (name === 'market_fulfill_order') return { data: rpcs.filter(r => r.name === name).length > 1 ? 'duplicate' : 'publish' };
      if (name === 'market_apply_payment') return { data: o.effect || 'publish' };
      if (name === 'market_media_due') return { data: o.trash || [] };
      if (name === 'push_hook_secret') return { data: 'db-secret' };
      return { data: null };
    }
  };
  const env = k => (o.env && k in o.env) ? o.env[k] : secrets[k];
  const fetcher = async (url, options = {}) => {
    const body = options.body && /json/.test(options.headers?.['Content-Type'] || '') ? JSON.parse(options.body) : options.body;
    calls.push({ url, method: options.method || 'GET', body });
    let data, status = 200;
    if (url.endsWith('/access-token') || url.endsWith('/oauth2/token')) data = { access_token: 'server-token' };
    else if (url.endsWith('/tpay/payments')) data = { payId: 'tbc-1', links: [{ rel: 'approval_url', uri: 'https://tpay.tbcbank.ge/checkout/tbc-1' }] };
    else if (url.includes('/tpay/payments/')) { const r = orders[0]; data = { payId: r.provider_id, merchantPaymentId: r.id, amount: Number(r.amount), currency: r.currency, status: o.status || 'Succeeded', ...(o.tbc || {}) }; }
    else if (url.endsWith('/v2/checkout/orders')) data = { id: 'pp-1', links: [{ rel: 'payer-action', href: 'https://www.sandbox.paypal.com/checkoutnow?token=pp-1' }] };
    else if (url.endsWith('/capture')) { captured = true; data = {}; }
    else if (url.includes('/v2/checkout/orders/')) { const r = orders[0]; data = { id: r.provider_id, status: captured || o.completed ? 'COMPLETED' : 'APPROVED', purchase_units: [{ custom_id: r.seller_id, reference_id: r.id, amount: { value: r.amount, currency_code: r.currency }, payee: { merchant_id: 'merchant' }, payments: { captures: [{ status: o.capture || 'COMPLETED', amount: { value: r.amount, currency_code: r.currency } }] } }] }; }
    else if (url.endsWith('/verify-webhook-signature')) data = { verification_status: 'SUCCESS' };
    else if (url.includes('/subscribers/')) data = o.rc || { request_date_ms: Date.now(), subscriber: {} };
    else if (url.endsWith('/storage/v1/object/market')) { status = o.storageStatus || 200; data = []; }
    else throw new Error('Unexpected request: ' + url);
    return new Response(JSON.stringify(data), { status });
  };
  return { deps: { db, env, fetcher }, market: createMarket({ db, env, fetcher }), handler: marketHandler({ db, env, fetcher }), orders, rpcs, calls };
}
const req = (body, headers = { Authorization: 'Bearer seller-token' }) => new Request('https://backend.example/functions/v1/market', { method: 'POST', headers, body: JSON.stringify(body) });

test('the catalog: all four packages in GEL through TBC; PayPal only for packages with an owner-approved EUR price', async () => {
  const x = setup(), c = await x.market.offer();
  assert.deepEqual(c.packages.map(p => [p.id, p.hours, p.price.value]), [['ad24', 24, '5.00'], ['ad72', 72, '10.00'], ['ad168', 168, '20.00'], ['ad720', 720, '40.00']]);
  assert.deepEqual(c.providers.find(p => p.id === 'tbc').prices.ad24, { value: '5.00', currency: 'GEL' }, 'no sale running: the regular price');
  assert.deepEqual(Object.keys(c.providers.find(p => p.id === 'paypal').prices), ['ad168'], 'no silent GEL→EUR conversion');
  assert.equal(c.stores.products.ad720, 'market_ad720');
  // nothing configured: nothing to pay with
  const y = setup({ env: Object.fromEntries(Object.keys(secrets).filter(k => /TBC|PAYPAL/.test(k)).map(k => [k, ''])) });
  assert.deepEqual((await y.market.offer()).providers, []);
});

test('TBC checkout: the server picks the amount and the buyer; a browser\'s price or account is ignored', async () => {
  const x = setup();
  const r = await x.handler(req({ action: 'start', listing, package: 'ad72', provider: 'tbc', amount: 0.01, seller: 'attacker' }));
  assert.equal(r.status, 200);
  const out = await r.json();
  assert.equal(out.url, 'https://tpay.tbcbank.ge/checkout/tbc-1');
  assert.equal(x.orders[0].seller_id, uid); assert.equal(x.orders[0].amount, '10.00'); assert.equal(x.orders[0].package_id, 'ad72');
  const pay = x.calls.find(c => c.url.endsWith('/tpay/payments')).body;
  assert.equal(pay.amount.total, 10); assert.equal(pay.amount.currency, 'GEL'); assert.equal(pay.preAuth, false);
  assert.match(pay.returnurl, /\?payment=market-tbc$/);
  assert.equal(pay.callbackUrl, 'https://backend.example/functions/v1/payment-callback?provider=tbc');
  assert.equal(x.rpcs.find(r => r.name === 'market_order_check').args.seller, uid);
});

test('no checkout for an expired listing, an unknown package, a provider without a price, or a signed-out buyer', async () => {
  let x = setup({ check: 'listing-expired' });
  await assert.rejects(x.market.start(uid, listing, 'ad24', 'tbc'), /listing-expired/);
  assert.equal(x.calls.filter(c => c.url.includes('tpay')).length, 0);
  x = setup();
  await assert.rejects(x.market.start(uid, listing, 'free', 'tbc'), /invalid-request/);
  await assert.rejects(x.market.start(uid, 'not-a-uuid', 'ad24', 'tbc'), /invalid-request/);
  await assert.rejects(x.market.start(uid, listing, 'ad24', 'paypal'), /billing-not-configured/);
  x = setup({ unauthorized: true });
  assert.equal((await x.handler(req({ action: 'start', listing, package: 'ad24', provider: 'tbc' }))).status, 401);
});

test('payment verification: only "Succeeded" from TBC itself activates; a failed card marks the order failed', async () => {
  let x = setup({ status: 'Succeeded' });
  await x.market.start(uid, listing, 'ad24', 'tbc');
  await assert.rejects(x.market.verifyTBC('tbc-1', 'someone-else'), /order-not-found/);
  assert.deepEqual(await x.market.verifyTBC('tbc-1', uid), { paid: true, effect: 'publish' });
  for (const status of ['Created', 'Processing', 'WaitingConfirm']) {
    x = setup({ status }); await x.market.start(uid, listing, 'ad24', 'tbc');
    assert.deepEqual(await x.market.verifyTBC('tbc-1', uid), { paid: false });
    assert.equal(x.rpcs.some(r => r.name === 'market_fulfill_order'), false, status + ' is not a payment');
  }
  x = setup({ status: 'Failed' }); await x.market.start(uid, listing, 'ad24', 'tbc');
  assert.equal((await x.market.verifyTBC('tbc-1', uid)).failed, true);
  assert.equal(x.rpcs.find(r => r.name === 'market_order_failed').args.provider_ref, 'tbc-1');
  // a changed amount is not this order
  x = setup({ tbc: { amount: 0.03 } }); await x.market.start(uid, listing, 'ad24', 'tbc');
  await assert.rejects(x.market.verifyTBC('tbc-1', uid), /payment-mismatch/);
  // the bank returned the money: the refund reaches the listing
  x = setup({ status: 'Returned' }); await x.market.start(uid, listing, 'ad24', 'tbc');
  assert.equal((await x.market.verifyTBC('tbc-1', uid)).refunded, true);
  assert.deepEqual(x.rpcs.find(r => r.name === 'market_refund').args, { pv: 'tbc', pay: 'tbc-1' });
});

test('callbacks: a marketplace order goes to the marketplace, twice is still once, Premium is untouched', async () => {
  const x = setup(); await x.market.start(uid, listing, 'ad168', 'tbc');
  const cb = paymentCallback(x.deps), hit = () => cb(new Request('https://backend.example/functions/v1/payment-callback?provider=tbc', { method: 'POST', body: JSON.stringify({ PaymentId: 'tbc-1' }) }));
  assert.equal((await hit()).status, 200);
  assert.equal((await hit()).status, 200);
  const f = x.rpcs.filter(r => r.name === 'market_fulfill_order');
  assert.equal(f.length, 2); assert.equal(x.rpcs.some(r => r.name === 'fulfill_web_purchase'), false);
  // the database answers the second call "duplicate": it is the database, not this code, that counts once (market-sql.test.mjs)
});

test('PayPal: captured, verified against the saved order, refunds come back through the webhook', async () => {
  const x = setup(); await x.market.start(uid, listing, 'ad168', 'paypal');
  assert.equal(x.orders[0].amount, '5.17'); assert.equal(x.orders[0].currency, 'EUR');
  const created = x.calls.find(c => c.url.endsWith('/v2/checkout/orders')).body.purchase_units[0];
  assert.equal(created.custom_id, uid); assert.equal(created.amount.value, '5.17');
  assert.deepEqual(await x.market.verifyPayPal('pp-1', uid, true), { paid: true, effect: 'publish' });
  assert.ok(x.calls.some(c => c.url.endsWith('/capture')));
  const y = setup({ completed: true, capture: 'REFUNDED' }); await y.market.start(uid, listing, 'ad168', 'paypal');
  const cb = paymentCallback(y.deps);
  const r = await cb(new Request('https://backend.example/functions/v1/payment-callback?provider=paypal', { method: 'POST', body: JSON.stringify({ event_type: 'PAYMENT.CAPTURE.REFUNDED', resource: { supplementary_data: { related_ids: { order_id: 'pp-1' } } } }) }));
  assert.equal(r.status, 200);
  assert.deepEqual(y.rpcs.find(r => r.name === 'market_refund').args, { pv: 'paypal', pay: 'pp-1' });
});

test('App Store / Play: the transaction is read from RevenueCat for this account; old, sandbox or foreign ones are refused', async () => {
  const tx = (over = {}) => ({ request_date_ms: Date.now(), subscriber: { non_subscriptions: { market_ad24: [{ id: 'rc-1', store_transaction_id: 'apple-1', store: 'app_store', is_sandbox: false, purchase_date: new Date().toISOString(), ...over }] } } });
  let x = setup({ rc: tx() });
  assert.deepEqual(await x.market.verifyStore(uid, listing, 'ad24', 'apple-1'), { paid: true, effect: 'publish' });
  const a = x.rpcs.find(r => r.name === 'market_apply_payment').args;
  assert.equal(a.pv, 'app_store'); assert.equal(a.pay, 'apple-1'); assert.equal(a.seller, uid); assert.equal(a.paid_amount, '5.00');
  assert.ok(x.calls.find(c => c.url.includes('/subscribers/' + uid)));
  x = setup({ rc: tx() }); assert.deepEqual(await x.market.verifyStore(uid, listing, 'ad24', 'someone-elses'), { paid: false });
  x = setup({ rc: tx({ is_sandbox: true }) }); await assert.rejects(x.market.verifyStore(uid, listing, 'ad24', 'apple-1'), /payment-mismatch/);
  x = setup({ rc: tx({ purchase_date: new Date(Date.now() - 80 * 3600e3).toISOString() }) }); await assert.rejects(x.market.verifyStore(uid, listing, 'ad24', 'apple-1'), /payment-mismatch/);
  x = setup({ rc: tx(), effect: 'orphaned' }); assert.deepEqual(await x.market.verifyStore(uid, listing, 'ad24', 'apple-1'), { paid: false, effect: 'orphaned' });
  // a refunded consumable reported by RevenueCat
  x = setup();
  const hook = storeWebhook(x.deps);
  const r = await hook(new Request('https://backend.example/functions/v1/store-webhook', { method: 'POST', headers: { Authorization: 'Bearer hook' }, body: JSON.stringify({ event: { type: 'CANCELLATION', app_user_id: uid, product_id: 'market_ad24', store: 'APP_STORE', transaction_id: 'apple-1' } }) }));
  assert.equal(r.status, 200);
  assert.deepEqual(x.rpcs.find(r => r.name === 'market_refund').args, { pv: 'app_store', pay: 'apple-1' });
});

test('media sweep: only with the database\'s secret, only the market bucket, only files in their seller\'s folder; failures recorded for retry', async () => {
  const own = { id: 1, path: uid + '/' + listing + '/a.jpg', seller_id: uid }, forged = { id: 2, path: 'other/' + listing + '/b.jpg', seller_id: uid };
  let x = setup({ trash: [own, forged] });
  assert.equal((await x.handler(req({ sweep: true }, { 'x-push-secret': 'wrong' }))).status, 401);
  assert.equal(x.calls.length, 0);
  const r = await x.handler(req({ sweep: true }, { 'x-push-secret': 'db-secret' }));
  assert.deepEqual(await r.json(), { deleted: 1, failed: 0 });
  const del = x.calls.find(c => c.method === 'DELETE');
  assert.equal(del.url, 'https://backend.example/storage/v1/object/market');
  assert.deepEqual(del.body.prefixes, [own.path], 'a path outside its seller\'s folder is never sent');
  assert.deepEqual(x.rpcs.find(r => r.name === 'market_media_result').args, { ids: [1], ok: true, err: null });
  x = setup({ trash: [own], storageStatus: 500 });
  assert.deepEqual(await (await x.handler(req({ sweep: true }, { 'x-push-secret': 'db-secret' }))).json(), { deleted: 0, failed: 1 });
  const res = x.rpcs.find(r => r.name === 'market_media_result').args;
  assert.equal(res.ok, false); assert.match(res.err, /storage 500/);
});

test('a running sale: charged and shown as 2.99 instead of 5.00; an ended sale is the regular price again', async () => {
  const until = new Date(Date.now() + 864e5).toISOString(), ended = new Date(Date.now() - 1000).toISOString();
  const on = PKG.map(p => p.kind === 'ad' ? { ...p, sale_until: p.id === 'ad720' ? ended : until } : p);
  const x = setup({ pkg: on }), c = await x.market.offer(), tbc = c.providers.find(p => p.id === 'tbc');
  assert.deepEqual(tbc.prices.ad24, { value: '2.99', currency: 'GEL', regular: '5.00', until });
  assert.deepEqual(tbc.prices.ad168, { value: '14.99', currency: 'GEL', regular: '20.00', until });
  assert.deepEqual(tbc.prices.ad720, { value: '40.00', currency: 'GEL' }, 'its sale ended: no struck-out price, the regular price is charged');
  assert.equal(c.providers.find(p => p.id === 'paypal').prices.ad168.value, '5.17', 'PayPal keeps its regular price without an approved PayPal sale price');
  await x.market.start(uid, listing, 'ad24', 'tbc');
  assert.equal(x.orders[0].amount, '2.99');
  assert.equal(x.calls.find(c2 => c2.url.endsWith('/tpay/payments')).body.amount.total, 2.99);
  // a PayPal sale price is used only when it is lower than PayPal's regular price
  const y = setup({ pkg: on.map(p => p.id === 'ad168' ? { ...p, paypal_sale_value: '3.75' } : p.id === 'ad72' ? { ...p, paypal_value: '2.00', paypal_currency: 'EUR', paypal_sale_value: '9.00' } : p) });
  const pp = (await y.market.offer()).providers.find(p => p.id === 'paypal').prices;
  assert.deepEqual(pp.ad168, { value: '3.75', currency: 'EUR', regular: '5.17', until });
  assert.deepEqual(pp.ad72, { value: '2.00', currency: 'EUR' });
});

test('Premium on sale: the billing function charges the owner\'s sale price while it runs, and the regular price otherwise', async () => {
  const until = new Date(Date.now() + 864e5).toISOString();
  const rows = [{ plan: 'monthly', sale_minor: 999, paypal_sale_value: '3.44', sale_until: until }, { plan: 'yearly', sale_minor: 8999, paypal_sale_value: '31.03', sale_until: new Date(Date.now() - 1).toISOString() }];
  const db = { from: () => ({ select: async () => ({ data: rows }) }) };
  const sales = await premiumSales(db);
  assert.deepEqual(Object.keys(sales), ['monthly'], 'an ended sale is no sale');
  const env = k => secrets[k], cat = catalog(env, 2, sales);
  assert.deepEqual(cat.providers.find(p => p.id === 'tbc').prices.monthly, { value: '9.99', currency: 'GEL', regular: '14.99', until });
  assert.deepEqual(cat.providers.find(p => p.id === 'tbc').prices.yearly, { value: '119.99', currency: 'GEL' });
  assert.deepEqual(cat.providers.find(p => p.id === 'paypal').prices.monthly, { value: '3.44', currency: 'EUR', regular: '5.17', until });
  // a sale that is not lower is ignored; no table (not yet migrated): no sale, nothing breaks
  assert.deepEqual(await premiumSales({ from: () => ({ select: async () => ({ data: [{ plan: 'monthly', sale_minor: 1499, sale_until: until }] }) }) }), {});
  assert.deepEqual(await premiumSales({ from: () => ({ select: async () => ({ error: { message: 'relation does not exist' } }) }) }), {});
  // start: the order is saved with the sale price, and TBC is asked for exactly that
  const x = setup();
  x.deps.db.from = (orig => t => t === 'premium_sales' ? { select: async () => ({ data: rows }) } : orig(t))(x.deps.db.from);
  const billing = createBilling(x.deps);
  const saved = [];
  x.deps.db.from = (orig => t => t === 'billing_orders' ? { insert: async r => { saved.push(r); return {}; } } : orig(t))(x.deps.db.from);
  x.deps.db.from = (orig => t => t === 'profiles' ? { select: () => ({ eq: () => ({ single: async () => ({ data: { premium_banned: false } }) }) }) } : orig(t))(x.deps.db.from);
  await billing.start(uid, 'monthly', 'tbc');
  assert.equal(saved[0].amount, '9.99');
  assert.equal(x.calls.find(c => c.url.endsWith('/tpay/payments')).body.amount.total, 9.99);
});
