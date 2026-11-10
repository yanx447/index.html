import { test } from 'node:test';
import assert from 'node:assert/strict';
import { billingHandler, createBilling, catalog } from './supabase/functions/_shared/billing.js';
import { paymentCallback, storeWebhook } from './supabase/functions/_shared/callbacks.js';
const uid = '12345678-1234-1234-1234-123456789abc';
const secrets = { APP_URL: 'https://yanx447.github.io/index.html/panduri/app/', SUPABASE_URL: 'https://backend.example', TBC_API_KEY: 'test', TBC_CLIENT_ID: 'test', TBC_CLIENT_SECRET: 'test', PAYPAL_CLIENT_ID: 'test', PAYPAL_CLIENT_SECRET: 'test', PAYPAL_MERCHANT_ID: 'merchant', PAYPAL_WEBHOOK_ID: 'webhook', PAYPAL_CURRENCY: 'USD', PAYPAL_MONTHLY_PRICE: '5.99', PAYPAL_YEARLY_PRICE: '49.99', REVENUECAT_SECRET_KEY: 'test', REVENUECAT_WEBHOOK_TOKEN: 'private-hook-token' };
function setup(overrides = {}) {
  const orders = [], grants = [], calls = [];
  let captured = false;
  const db = { auth: { getUser: async () => ({ data: { user: overrides.unauthorized ? null : { id: uid } } }) },
    from: table => ({
      insert: async row => { if (overrides.dbFailure) return { error: {} }; orders.push(row); return {}; },
      select: () => { const filters = {}; const q = { eq: (k, v) => { filters[k] = v; return q; }, single: async () => table === 'profiles' ? { data: { premium_banned: !!overrides.banned } } : { data: orders.find(o => Object.entries(filters).every(([k,v]) => o[k] === v)) } }; return q; }
    }), rpc: async (name, args) => { grants.push({ name, args }); return {}; } };
  const env = key => overrides.env?.[key] ?? secrets[key];
  const fetcher = async (url, options) => {
    const body = options.body && (options.headers['Content-Type'] === 'application/json' ? JSON.parse(options.body) : options.body);
    calls.push({ url, options, body });
    let data;
    if (url.endsWith('/access-token') || url.endsWith('/oauth2/token')) data = { access_token: 'server-token' };
    else if (url.endsWith('/tpay/payments')) data = { payId: 'tbc-order', links: [{ rel: 'approval_url', uri: 'https://tpay.tbcbank.ge/checkout/tbc-order' }] };
    else if (url.includes('/tpay/payments/')) { const o = orders[0]; data = { payId: o.provider_id, merchantPaymentId: o.id, amount: Number(o.amount), currency: o.currency, status: overrides.status || 'Succeeded', ...(overrides.tbc || {}) }; }
    else if (url.endsWith('/v2/checkout/orders')) data = { id: 'paypal-order', links: [{ rel: 'payer-action', href: 'https://www.sandbox.paypal.com/checkoutnow?token=paypal-order' }] };
    else if (url.endsWith('/capture')) { captured = true; data = { id: 'paypal-order', status: 'COMPLETED' }; }
    else if (url.includes('/v2/checkout/orders/')) { const o = orders[0]; data = { id: o.provider_id, status: captured || overrides.completed ? 'COMPLETED' : 'APPROVED', purchase_units: [{ custom_id: o.user_id, reference_id: o.id, amount: { value: o.amount, currency_code: o.currency }, payee: { merchant_id: 'merchant' }, payments: { captures: [{ status: 'COMPLETED', amount: { value: o.amount, currency_code: o.currency } }] }, ...(overrides.unit || {}) }] }; }
    else if (url.endsWith('/verify-webhook-signature')) data = { verification_status: overrides.badSignature ? 'FAILURE' : 'SUCCESS' };
    else if (url.includes('/subscribers/')) data = overrides.store || { request_date_ms: Date.now(), subscriber: {} };
    else throw new Error('Unexpected request: ' + url);
    return new Response(JSON.stringify(data), { status: 200 });
  };
  return { deps: { db, env, fetcher }, billing: createBilling({ db, env, fetcher }), handler: billingHandler({ db, env, fetcher }), orders, grants, calls };
}
const req = body => new Request('https://backend.example/functions/v1/billing', { method: 'POST', headers: { Authorization: 'Bearer buyer-token' }, body: JSON.stringify(body) });
test('Unconfigured accounts expose no purchasable providers', () => assert.deepEqual(catalog(() => null).providers, []));
test('Unauthorized and blocked buyers cannot create orders', async () => {
  let x=setup({ unauthorized:true }); assert.equal((await x.handler(req({ action:'start', provider:'tbc', plan:'monthly' }))).status,401); assert.equal(x.calls.length,0);
  x=setup({ banned:true }); await assert.rejects(x.billing.start(uid,'monthly','tbc'), /premium-blocked/); assert.equal(x.calls.length,0);
});
test('TBC amount and account are selected by server; return preserves deployed path', async () => {
  const x=setup(); const r=await x.handler(req({action:'start',plan:'yearly',provider:'tbc',amount:0.01,user_id:'attacker'})); assert.equal(r.status,200);
  assert.equal(x.orders[0].user_id,uid); assert.equal(x.orders[0].amount,'119.99');
  const payload=x.calls.find(c=>c.url.endsWith('/tpay/payments')).body; assert.equal(payload.amount.total,119.99); assert.equal(payload.preAuth,false); assert.match(payload.returnurl,/\/index.html\/panduri\/app\/\?payment=tbc$/);
});
test('Invalid plan, unknown provider, and unsaved order fail without checkout redirect', async () => {
  const x=setup(); await assert.rejects(x.billing.start(uid,'free','tbc'), /invalid-plan/); await assert.rejects(x.billing.start(uid,'monthly','unknown'), /billing-not-configured/);
  const y=setup({dbFailure:true}); await assert.rejects(y.billing.start(uid,'monthly','tbc'),/order-save-failed/);
});
test('TBC paid verification grants to saved buyer; other accounts are refused before provider request', async () => {
  const x=setup(); await x.billing.start(uid,'monthly','tbc'); const n=x.calls.length;
  await assert.rejects(x.billing.verifyTBC('tbc-order','other-user'),/order-not-found/); assert.equal(x.calls.length,n);
  assert.equal((await x.billing.verifyTBC('tbc-order',uid)).paid,true); assert.equal(x.grants[0].args.target,uid);
});
test('TBC mismatch, preauthorization and unsuccessful payment never grant access', async () => {
  for(const override of [{tbc:{amount:0.01}},{tbc:{currency:'USD'}},{tbc:{merchantPaymentId:'other-order'}},{status:'WaitingConfirm'},{status:'Failed'}]) {
    const x=setup(override); await x.billing.start(uid,'monthly','tbc'); await x.billing.verifyTBC('tbc-order',uid).catch(()=>{}); assert.equal(x.grants.length,0);
  }
});
test('PayPal requires capture and a second provider GET before fulfillment', async () => {
  const x=setup(); await x.billing.start(uid,'monthly','paypal'); assert.equal(x.orders[0].currency,'USD'); assert.equal(x.orders[0].amount,'5.99');
  assert.equal((await x.billing.verifyPayPal('paypal-order',uid)).paid,false); assert.equal(x.grants.length,0);
  assert.equal((await x.billing.verifyPayPal('paypal-order',uid,true)).paid,true);
  const captureIndex=x.calls.findIndex(c=>c.url.endsWith('/capture')); assert.ok(captureIndex>0); assert.equal(x.calls[captureIndex+2].options.method,'GET'); assert.equal(x.grants.length,1);
});
test('PayPal amount, recipient and buyer mismatch are refused', async () => {
  for(const unit of [{custom_id:'other-user'},{payee:{merchant_id:'other-merchant'}},{amount:{value:'0.01',currency_code:'USD'}}]) {
    const x=setup({unit,completed:true}); await x.billing.start(uid,'monthly','paypal'); await assert.rejects(x.billing.verifyPayPal('paypal-order',uid),/payment-mismatch/); assert.equal(x.grants.length,0);
  }
});
test('Native state comes from RevenueCat, not a client expiry or receipt', async () => {
  const expiry = new Date(Date.now()+86400000).toISOString();
  const x=setup({store:{request_date_ms:12345,subscriber:{entitlements:{premium:{expires_date:expiry,product_identifier:'premium_monthly'}},subscriptions:{premium_monthly:{store:'app_store',is_sandbox:false}}}}});
  await x.handler(req({action:'sync-store',user_id:'attacker',expiry:'2099-01-01'})); assert.equal(x.grants[0].args.target,uid); assert.equal(x.grants[0].args.expiry,expiry);
});
test('Sandbox, refunds, missing entitlement and unsupported stores revoke native entitlement', async () => {
  for(const subscription of [{store:'app_store',is_sandbox:true},{store:'play_store',refunded_at:'2026-01-01'},{store:'promotional'}]) {
    const x=setup({store:{request_date_ms:12345,subscriber:{entitlements:{premium:{expires_date:'2099-01-01',product_identifier:'premium_monthly'}},subscriptions:{premium_monthly:subscription}}}});
    await x.billing.syncStore(uid); assert.equal(x.grants[0].args.expiry,null);
  }
  const x=setup(); await x.billing.syncStore(uid); assert.equal(x.grants[0].args.expiry,null);
});

test('Unsigned PayPal callbacks cannot capture or grant; signed approval completes a saved order', async () => {
  const event = { event_type: 'CHECKOUT.ORDER.APPROVED', resource: { id: 'paypal-order' } };
  const callbackReq = () => new Request('https://edge.example/payment-callback?provider=paypal', {method:'POST', body:JSON.stringify(event)});
  const bad=setup({badSignature:true}); await bad.billing.start(uid,'monthly','paypal');
  assert.equal((await paymentCallback(bad.deps)(callbackReq())).status,400); assert.equal(bad.grants.length,0); assert.equal(bad.calls.some(c=>c.url.endsWith('/capture')),false);
  const good=setup(); await good.billing.start(uid,'monthly','paypal');
  assert.equal((await paymentCallback(good.deps)(callbackReq())).status,200); assert.equal(good.grants.length,1);
});
test('TBC callback status cannot override the authoritative bank payment', async () => {
  const x=setup({status:'Failed'}); await x.billing.start(uid,'monthly','tbc');
  const req=new Request('https://edge.example/payment-callback?provider=tbc', {method:'POST',body:JSON.stringify({PaymentId:'tbc-order',status:'Succeeded'})});
  assert.equal((await paymentCallback(x.deps)(req)).status,200); assert.equal(x.grants.length,0);
});
test('Store webhook requires its own secret and reads provider state instead of event expiry', async () => {
  const event={event:{app_user_id:uid,expiration_at_ms:99999999999999}};
  const x=setup(), hook=storeWebhook(x.deps);
  let response=await hook(new Request('https://edge.example/store-webhook',{method:'POST',body:JSON.stringify(event)})); assert.equal(response.status,401);assert.equal(x.grants.length,0);
  response=await hook(new Request('https://edge.example/store-webhook',{method:'POST',headers:{Authorization:'Bearer private-hook-token'},body:JSON.stringify(event)})); assert.equal(response.status,200);assert.equal(x.grants[0].args.expiry,null);
});
