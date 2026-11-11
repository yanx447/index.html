// Server-only billing. Browser amounts, user IDs and payment status are never trusted.
export const PLANS = { monthly: 1499, yearly: 11999 };
export class BillingError extends Error {
  constructor(code, status = 400) { super(code); this.status = status; }
}
export function required(env, name) {
  const v = env(name); if (!v) throw new BillingError('billing-not-configured', 503); return v;
}
export function appURL(env, query) {
  const u = new URL(required(env, 'APP_URL'));
  if (u.protocol !== 'https:' || u.search || u.hash) throw new BillingError('billing-not-configured', 503);
  u.search = new URLSearchParams(query).toString(); return u.href;
}
export async function api(fetcher, url, options = {}) {
  const r = await fetcher(url, { ...options, signal: AbortSignal.timeout(15000) });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new BillingError('payment-provider-unavailable', 502);
  return body;
}
export function paypalPrice(env, plan) {
  const currency = required(env, 'PAYPAL_CURRENCY');
  const value = required(env, plan === 'monthly' ? 'PAYPAL_MONTHLY_PRICE' : 'PAYPAL_YEARLY_PRICE');
  if (!['USD', 'EUR'].includes(currency) || !/^[0-9]+\.[0-9]{2}$/.test(value) || Number(value) <= 0) throw new BillingError('billing-not-configured', 503);
  return { currency_code: currency, value };
}
// Wallets appear on TBC's hosted page only after the bank activates them for this merchant; the owner lists them here.
const WALLETS = ['apple_pay', 'google_pay'];
export function tbcWallets(env) { return String(env('TBC_WALLETS') || '').split(',').map(x => x.trim()).filter(x => WALLETS.includes(x)); }
const hasTBC = env => ['TBC_API_KEY', 'TBC_CLIENT_ID', 'TBC_CLIENT_SECRET'].every(k => env(k));
const hasPayPal = env => ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET', 'PAYPAL_WEBHOOK_ID', 'PAYPAL_MERCHANT_ID', 'PAYPAL_CURRENCY', 'PAYPAL_MONTHLY_PRICE', 'PAYPAL_YEARLY_PRICE'].every(k => env(k));
// A card through PayPal without a PayPal account (PayPal guest checkout). Only while TBC is absent, and only when the
// owner has turned on "PayPal account optional" and confirmed the card form appears for this merchant.
const hasPayPalCard = env => !hasTBC(env) && hasPayPal(env) && env('PAYPAL_GUEST_CARD') === 'true';
// version 1 is what clients built before the checkout page understand: never send them a provider they cannot show.
export function catalog(env, version = 1) {
  const providers = [];
  const policies = { terms: env('TERMS_URL') || null, privacy: env('PRIVACY_URL') || null };
  const validPolicies = Object.values(policies).every(v => { try { return new URL(v).protocol === 'https:'; } catch (_) { return false; } });
  const ppPrices = () => Object.fromEntries(Object.keys(PLANS).map(p => { const v = paypalPrice(env, p); return [p, { value: v.value, currency: v.currency_code }]; }));
  if (hasTBC(env)) {
    providers.push({ id: 'tbc', kind: 'card', ...(version >= 2 ? { wallets: tbcWallets(env) } : {}), prices: { monthly: { value: '14.99', currency: 'GEL' }, yearly: { value: '119.99', currency: 'GEL' } } });
  }
  if (version >= 2 && hasPayPalCard(env)) providers.push({ id: 'paypal-card', kind: 'card', wallets: [], prices: ppPrices() });
  if (hasPayPal(env)) providers.push({ id: 'paypal', kind: 'paypal', prices: ppPrices() });
  return { providers, policies, stores: { ios: validPolicies && env('REVENUECAT_SECRET_KEY') ? env('REVENUECAT_IOS_KEY') || null : null, android: validPolicies && env('REVENUECAT_SECRET_KEY') ? env('REVENUECAT_ANDROID_KEY') || null : null }, entitlement: 'premium' };
}
export function createBilling({ db, env, fetcher = fetch }) {
  const call = (url, options) => api(fetcher, url, options);
  async function user(req) {
    const token = req.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new BillingError('sign-in-required', 401);
    const { data, error } = await db.auth.getUser(token);
    if (error || !data?.user) throw new BillingError('sign-in-required', 401);
    return data.user;
  }
  async function profile(uid) {
    const { data, error } = await db.from('profiles').select('premium_banned').eq('id', uid).single();
    if (error || !data) throw new BillingError('account-unavailable', 503);
    if (data.premium_banned) throw new BillingError('premium-blocked', 403);
  }
  async function writeOrder(row) {
    const { error } = await db.from('billing_orders').insert(row);
    if (error) throw new BillingError('order-save-failed', 503);
  }
  async function order(provider, id, uid) {
    const { data, error } = await db.from('billing_orders').select('*').eq('provider', provider).eq('provider_id', id).single();
    if (error || !data || (uid && data.user_id !== uid)) throw new BillingError('order-not-found', 404);
    return data;
  }
  async function fulfill(row) {
    const { error } = await db.rpc('fulfill_web_purchase', { purchase_provider: row.provider, payment_id: row.provider_id, target: row.user_id, purchase_plan: row.plan });
    if (error) throw new BillingError('fulfillment-unavailable', 503);
  }
  async function tbc(path, body) {
    const headers = { apikey: required(env, 'TBC_API_KEY') };
    const token = await call('https://api.tbcbank.ge/v1/tpay/access-token', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: required(env, 'TBC_CLIENT_ID'), client_secret: required(env, 'TBC_CLIENT_SECRET') }).toString() });
    if (!token.access_token) throw new BillingError('payment-provider-unavailable', 502);
    return call('https://api.tbcbank.ge/v1/tpay/' + path, { method: body ? 'POST' : 'GET', headers: { ...headers, Authorization: 'Bearer ' + token.access_token, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  }
  const ppBase = () => env('PAYPAL_ENV') === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  async function paypal(path, body, requestID) {
    const token = await call(ppBase() + '/v1/oauth2/token', { method: 'POST', headers: { Authorization: 'Basic ' + btoa(required(env, 'PAYPAL_CLIENT_ID') + ':' + required(env, 'PAYPAL_CLIENT_SECRET')), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
    if (!token.access_token) throw new BillingError('payment-provider-unavailable', 502);
    return call(ppBase() + path, { method: body ? 'POST' : 'GET', headers: { Authorization: 'Bearer ' + token.access_token, 'Content-Type': 'application/json', ...(requestID ? { 'PayPal-Request-Id': requestID } : {}) }, body: body ? JSON.stringify(body) : undefined });
  }
  async function start(uid, plan, provider) {
    if (!Object.hasOwn(PLANS, plan)) throw new BillingError('invalid-plan');
    if (!catalog(env, 2).providers.some(p => p.id === provider)) throw new BillingError('billing-not-configured', 503);
    await profile(uid);
    const id = crypto.randomUUID();
    if (provider === 'tbc') {
      const result = await tbc('payments', { amount: { currency: 'GEL', total: PLANS[plan] / 100 },
        returnurl: appURL(env, { payment: 'tbc' }), callbackUrl: required(env, 'SUPABASE_URL') + '/functions/v1/payment-callback?provider=tbc',
        preAuth: false, language: 'KA', merchantPaymentId: id, description: 'Panduri Premium',
        // Omit methods: TBC shows only the methods activated for this merchant (card, Apple Pay, Google Pay).
        saveCard: false });
      const link = result.links?.find(l => l.rel === 'approval_url')?.uri;
      if (!result.payId || !link || new URL(link).hostname !== 'tpay.tbcbank.ge' || new URL(link).protocol !== 'https:') throw new BillingError('invalid-checkout', 502);
      await writeOrder({ id, provider, provider_id: result.payId, user_id: uid, plan, amount: (PLANS[plan] / 100).toFixed(2), currency: 'GEL' });
      return { url: link, order: result.payId, provider };
    }
    if (provider === 'paypal' || provider === 'paypal-card') {
      // The card form is PayPal's own page; the order, its verification and its webhook are an ordinary PayPal order.
      const price = paypalPrice(env, plan), landing = provider === 'paypal-card' ? { landing_page: 'GUEST_CHECKOUT' } : {};
      const result = await paypal('/v2/checkout/orders', { intent: 'CAPTURE', purchase_units: [{ reference_id: id, custom_id: uid, invoice_id: id, amount: price,
        payee: { merchant_id: required(env, 'PAYPAL_MERCHANT_ID') }, description: 'Panduri Premium — ' + plan }],
        payment_source: { paypal: { experience_context: { ...landing, user_action: 'PAY_NOW', shipping_preference: 'NO_SHIPPING', return_url: appURL(env, { payment: 'paypal' }), cancel_url: appURL(env, { payment: 'cancelled' }) } } } }, id);
      const link = result.links?.find(l => ['payer-action', 'approve'].includes(l.rel))?.href;
      const allowed = env('PAYPAL_ENV') === 'live' ? 'www.paypal.com' : 'www.sandbox.paypal.com';
      if (!result.id || !link || new URL(link).hostname !== allowed || new URL(link).protocol !== 'https:') throw new BillingError('invalid-checkout', 502);
      await writeOrder({ id, provider: 'paypal', provider_id: result.id, user_id: uid, plan, amount: price.value, currency: price.currency_code });
      return { url: link, order: result.id, provider: 'paypal' };
    }
    throw new BillingError('invalid-provider');
  }
  async function verifyTBC(id, uid) {
    const row = await order('tbc', id, uid), result = await tbc('payments/' + encodeURIComponent(id));
    if (result.payId !== id || result.currency !== row.currency || Math.round(Number(result.amount) * 100) !== Math.round(Number(row.amount) * 100) || result.merchantPaymentId !== row.id) throw new BillingError('payment-mismatch');
    if (result.status === 'Succeeded') { await fulfill(row); return { paid: true }; }
    return { paid: false };
  }
  async function verifyPayPal(id, uid, capture = false) {
    const row = await order('paypal', id, uid);
    let result = await paypal('/v2/checkout/orders/' + encodeURIComponent(id));
    // Capture only a saved order approved through PayPal. Signed ORDER.APPROVED also supports buyers who close the return page.
    if (capture && result.status === 'APPROVED') {
      await paypal('/v2/checkout/orders/' + encodeURIComponent(id) + '/capture', {}, row.id + '-capture');
      result = await paypal('/v2/checkout/orders/' + encodeURIComponent(id));
    }
    if (result.id !== id || result.purchase_units?.length !== 1) throw new BillingError('payment-mismatch');
    const unit = result.purchase_units[0], payments = unit.payments?.captures || [];
    if (unit.custom_id !== row.user_id || unit.reference_id !== row.id || unit.payee?.merchant_id !== required(env, 'PAYPAL_MERCHANT_ID') || unit.amount?.currency_code !== row.currency || Number(unit.amount?.value) !== Number(row.amount)) throw new BillingError('payment-mismatch');
    // GET after capture includes the complete order schema; never unlock on APPROVED alone.
    if (result.status === 'COMPLETED' && payments.length === 1 && payments[0].status === 'COMPLETED' && payments[0].amount?.currency_code === row.currency && Number(payments[0].amount?.value) === Number(row.amount)) {
      await fulfill(row); return { paid: true };
    }
    return { paid: false };
  }
  async function syncStore(uid) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uid)) return;
    const result = await call('https://api.revenuecat.com/v1/subscribers/' + encodeURIComponent(uid), { headers: { Authorization: 'Bearer ' + required(env, 'REVENUECAT_SECRET_KEY') } });
    const entitlement = result.subscriber?.entitlements?.premium;
    const subscription = entitlement && result.subscriber?.subscriptions?.[entitlement.product_identifier];
    const sandboxAllowed = env('BILLING_ALLOW_SANDBOX') === 'true';
    let expiry = entitlement?.expires_date;
    if (!subscription || !['app_store', 'play_store'].includes(subscription.store) || (subscription.is_sandbox !== false && !sandboxAllowed) || subscription.refunded_at) expiry = null;
    if (expiry && !Number.isFinite(Date.parse(expiry))) throw new BillingError('invalid-entitlement', 502);
    const snapshot = result.request_date_ms;
    if (!Number.isFinite(snapshot)) throw new BillingError('invalid-entitlement', 502);
    const { error } = await db.rpc('sync_store_entitlement', { target: uid, expiry: expiry || null, snapshot_ms: snapshot });
    if (error) throw new BillingError('fulfillment-unavailable', 503);
    return { synced: true };
  }
  return { user, start, verifyTBC, verifyPayPal, syncStore, paypal };
}
export function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' } });
}
export function billingHandler(deps) {
  const billing = createBilling(deps);
  return async req => {
    if (req.method === 'OPTIONS') return json({});
    if (req.method !== 'POST') return json({ error: 'method' }, 405);
    try {
      const u = await billing.user(req), input = await req.json();
      if (input.action === 'catalog') return json(catalog(deps.env, input.v === 2 ? 2 : 1));
      if (input.action === 'start') return json(await billing.start(u.id, input.plan, input.provider));
      if (input.action === 'sync-store') return json(await billing.syncStore(u.id));
      if (input.action === 'verify' && typeof input.order === 'string' && input.order.length < 150) {
        if (input.provider === 'tbc') return json(await billing.verifyTBC(input.order, u.id));
        if (input.provider === 'paypal') return json(await billing.verifyPayPal(input.order, u.id, true));
      }
      throw new BillingError('invalid-request');
    } catch (e) { return json({ error: e instanceof BillingError ? e.message : 'billing-unavailable' }, e instanceof BillingError ? e.status : 503); }
  };
}
