// The marketplace's money and its cleanup. Server-only; nothing a browser sends about a price, a payment's state or a
// time is trusted. Prices and lengths come from public.market_packages; every payment is fetched again from the
// provider before the database is told; the database (market_apply_payment) decides what the time does.
import { BillingError, appURL, catalog, createBilling, json, required } from './billing.js';

const PACKAGES = ['ad24', 'ad72', 'ad168', 'ad720'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// the database's refusals the seller can act on; anything else is "unavailable"
const REASONS = ['invalid-package', 'not-found', 'listing-expired', 'photo-required', 'banned'];
const reason = error => REASONS.find(r => String(error && error.message || '').includes(r));

export function createMarket({ db, env, fetcher = fetch }) {
  const billing = createBilling({ db, env, fetcher });
  async function rpc(name, args) {
    const { data, error } = await db.rpc(name, args);
    if (error) { const r = reason(error); throw new BillingError(r || 'market-unavailable', r ? (r === 'not-found' ? 404 : 409) : 503); }
    return data;
  }
  async function packages() {
    const { data, error } = await db.from('market_packages').select('*').order('sort');
    if (error || !Array.isArray(data)) throw new BillingError('market-unavailable', 503);
    return data;
  }
  // a sale is real only while it runs: before and after it the regular price is charged (and the app shows no struck-out price)
  const saleOn = p => p.sale_minor > 0 && p.sale_minor < p.price_minor && p.sale_until && Date.parse(p.sale_until) > Date.now();
  const gel = p => saleOn(p) ? { value: (p.sale_minor / 100).toFixed(2), currency: 'GEL', regular: (p.price_minor / 100).toFixed(2), until: p.sale_until } : { value: (p.price_minor / 100).toFixed(2), currency: 'GEL' };
  const paypalOf = p => saleOn(p) && p.paypal_sale_value && Number(p.paypal_sale_value) > 0 && Number(p.paypal_sale_value) < Number(p.paypal_value)
    ? { value: p.paypal_sale_value, currency: p.paypal_currency, regular: p.paypal_value, until: p.sale_until } : { value: p.paypal_value, currency: p.paypal_currency };
  /** what a seller can pay with for each package, decided here from the server's configuration */
  async function offer() {
    const list = (await packages()).filter(p => p.kind === 'ad' && p.active), base = catalog(env, 2);
    const ids = base.providers.map(p => p.id), providers = [];
    if (ids.includes('tbc')) providers.push({ id: 'tbc', kind: 'card', wallets: base.providers.find(p => p.id === 'tbc').wallets || [],
      prices: Object.fromEntries(list.map(p => [p.id, gel(p)])) });
    // PayPal cannot charge GEL: only packages whose EUR/USD price the owner has approved
    const pp = Object.fromEntries(list.filter(p => p.paypal_value && p.paypal_currency).map(p => [p.id, paypalOf(p)]));
    if (Object.keys(pp).length) {
      if (ids.includes('paypal-card')) providers.push({ id: 'paypal-card', kind: 'card', wallets: [], prices: pp });
      if (ids.includes('paypal')) providers.push({ id: 'paypal', kind: 'paypal', prices: pp });
    }
    const products = Object.fromEntries(list.filter(p => p.store_product).map(p => [p.id, p.store_product]));
    return { packages: list.map(p => ({ id: p.id, hours: p.hours, price: gel(p), name_ka: p.name_ka, name_en: p.name_en })),
      providers, stores: { ios: base.stores.ios, android: base.stores.android, products }, policies: base.policies };
  }
  async function order(provider, id, uid) {
    const { data, error } = await db.from('market_orders').select('*').eq('provider', provider).eq('provider_id', id).single();
    if (error || !data || (uid && data.seller_id !== uid)) throw new BillingError('order-not-found', 404);
    return data;
  }
  /** is this provider payment one of the marketplace's? (the payment callbacks ask before Premium's code sees it) */
  async function owns(provider, id) {
    // a failed lookup (the table not migrated yet, a short outage) is "not ours": Premium's code then answers as before, and an
    // unknown order there makes the provider retry later — a payment callback never fails because the marketplace is missing
    const { data, error } = await db.from('market_orders').select('id').eq('provider', provider).eq('provider_id', id).maybeSingle();
    return !error && !!data;
  }
  async function start(uid, listing, pkg, provider) {
    if (!UUID.test(String(listing)) || !PACKAGES.includes(pkg)) throw new BillingError('invalid-request');
    const o = await offer(), via = o.providers.find(p => p.id === provider);
    if (!via || !via.prices[pkg]) throw new BillingError('billing-not-configured', 503);
    await rpc('market_order_check', { seller: uid, listing, pkg });
    const id = crypto.randomUUID(), price = via.prices[pkg], name = o.packages.find(p => p.id === pkg).name_en;
    let link, ref;
    if (provider === 'tbc') {
      const result = await billing.tbc('payments', { amount: { currency: 'GEL', total: Number(price.value) },
        returnurl: appURL(env, { payment: 'market-tbc' }), callbackUrl: required(env, 'SUPABASE_URL') + '/functions/v1/payment-callback?provider=tbc',
        preAuth: false, language: 'KA', merchantPaymentId: id, description: 'Panduri Marketplace — ' + name, saveCard: false });
      link = result.links?.find(l => l.rel === 'approval_url')?.uri; ref = result.payId;
      if (!ref || !link || new URL(link).hostname !== 'tpay.tbcbank.ge' || new URL(link).protocol !== 'https:') throw new BillingError('invalid-checkout', 502);
    } else {
      const landing = provider === 'paypal-card' ? { landing_page: 'GUEST_CHECKOUT' } : {};
      const result = await billing.paypal('/v2/checkout/orders', { intent: 'CAPTURE', purchase_units: [{ reference_id: id, custom_id: uid, invoice_id: id,
        amount: { currency_code: price.currency, value: price.value }, payee: { merchant_id: required(env, 'PAYPAL_MERCHANT_ID') }, description: 'Panduri Marketplace — ' + name }],
        payment_source: { paypal: { experience_context: { ...landing, user_action: 'PAY_NOW', shipping_preference: 'NO_SHIPPING', return_url: appURL(env, { payment: 'market-paypal' }), cancel_url: appURL(env, { payment: 'market-cancelled' }) } } } }, id);
      link = result.links?.find(l => ['payer-action', 'approve'].includes(l.rel))?.href; ref = result.id;
      const allowed = env('PAYPAL_ENV') === 'live' ? 'www.paypal.com' : 'www.sandbox.paypal.com';
      if (!ref || !link || new URL(link).hostname !== allowed || new URL(link).protocol !== 'https:') throw new BillingError('invalid-checkout', 502);
    }
    const via2 = provider === 'tbc' ? 'tbc' : 'paypal';
    const { error } = await db.from('market_orders').insert({ id, provider: via2, provider_id: ref, seller_id: uid, listing_id: listing, package_id: pkg, amount: price.value, currency: price.currency });
    if (error) throw new BillingError('order-save-failed', 503);
    return { url: link, order: ref, provider: via2 };
  }
  const done = async (provider, ref) => ({ paid: true, effect: await rpc('market_fulfill_order', { pv: provider, provider_ref: ref }) });
  async function verifyTBC(id, uid) {
    const row = await order('tbc', id, uid), result = await billing.tbc('payments/' + encodeURIComponent(id));
    if (result.payId !== id || result.currency !== row.currency || Math.round(Number(result.amount) * 100) !== Math.round(Number(row.amount) * 100) || result.merchantPaymentId !== row.id) throw new BillingError('payment-mismatch');
    if (result.status === 'Succeeded') return done('tbc', id);
    if (['Returned', 'PartialReturned'].includes(result.status)) { await rpc('market_refund', { pv: 'tbc', pay: id }); return { paid: false, refunded: true }; }
    if (['Failed', 'Expired', 'Rejected', 'Cancelled'].includes(result.status)) { await rpc('market_order_failed', { pv: 'tbc', provider_ref: id, why: String(result.status) }); return { paid: false, failed: true }; }
    return { paid: false };
  }
  async function verifyPayPal(id, uid, capture = false) {
    const row = await order('paypal', id, uid);
    let result = await billing.paypal('/v2/checkout/orders/' + encodeURIComponent(id));
    if (capture && result.status === 'APPROVED') {
      await billing.paypal('/v2/checkout/orders/' + encodeURIComponent(id) + '/capture', {}, row.id + '-capture');
      result = await billing.paypal('/v2/checkout/orders/' + encodeURIComponent(id));
    }
    if (result.id !== id || result.purchase_units?.length !== 1) throw new BillingError('payment-mismatch');
    const unit = result.purchase_units[0], caps = unit.payments?.captures || [];
    if (unit.custom_id !== row.seller_id || unit.reference_id !== row.id || unit.payee?.merchant_id !== required(env, 'PAYPAL_MERCHANT_ID') || unit.amount?.currency_code !== row.currency || Number(unit.amount?.value) !== Number(row.amount)) throw new BillingError('payment-mismatch');
    if (caps.length === 1 && ['REFUNDED', 'PARTIALLY_REFUNDED'].includes(caps[0].status)) { await rpc('market_refund', { pv: 'paypal', pay: id }); return { paid: false, refunded: true }; }
    if (result.status === 'COMPLETED' && caps.length === 1 && caps[0].status === 'COMPLETED' && caps[0].amount?.currency_code === row.currency && Number(caps[0].amount?.value) === Number(row.amount)) return done('paypal', id);
    if (result.status === 'VOIDED' || (caps.length === 1 && caps[0].status === 'DECLINED')) { await rpc('market_order_failed', { pv: 'paypal', provider_ref: id, why: 'declined' }); return { paid: false, failed: true }; }
    return { paid: false };
  }
  /** an App Store / Google Play consumable: the transaction is read from RevenueCat for this account, never from the app */
  async function verifyStore(uid, listing, pkg, transaction) {
    if (!UUID.test(String(uid)) || !UUID.test(String(listing)) || !PACKAGES.includes(pkg) || typeof transaction !== 'string' || !transaction || transaction.length > 200) throw new BillingError('invalid-request');
    const p = (await packages()).find(x => x.id === pkg && x.kind === 'ad');
    if (!p || !p.store_product) throw new BillingError('billing-not-configured', 503);
    const result = await billing.call('https://api.revenuecat.com/v1/subscribers/' + encodeURIComponent(uid), { headers: { Authorization: 'Bearer ' + required(env, 'REVENUECAT_SECRET_KEY') } });
    const list = result.subscriber?.non_subscriptions?.[p.store_product] || [];
    const tx = list.find(t => t && (t.store_transaction_id === transaction || t.id === transaction));
    if (!tx) return { paid: false };
    if (!['app_store', 'play_store'].includes(tx.store)) throw new BillingError('payment-mismatch');
    if (tx.is_sandbox !== false && env('BILLING_ALLOW_SANDBOX') !== 'true') throw new BillingError('payment-mismatch');
    const bought = Date.parse(tx.purchase_date);
    if (!Number.isFinite(bought) || Date.now() - bought > 72 * 3600e3) throw new BillingError('payment-mismatch');   // an old receipt cannot buy new time
    const ref = tx.store_transaction_id || tx.id;
    const effect = await rpc('market_apply_payment', { pv: tx.store, pay: ref, seller: uid, listing, pkg, paid_amount: gel(p).value, paid_currency: p.currency });
    return { paid: effect !== 'orphaned', effect };
  }
  async function refundStore(store, transaction) {
    const pv = { APP_STORE: 'app_store', PLAY_STORE: 'play_store', app_store: 'app_store', play_store: 'play_store' }[store];
    if (!pv || typeof transaction !== 'string' || !transaction) return;
    await rpc('market_refund', { pv, pay: transaction });
  }
  /** the files the database queued: deleted from the `market` bucket only, a hundred at a time, each batch's result recorded */
  async function sweep() {
    const rows = await rpc('market_media_due', { lim: 300 });
    const base = required(env, 'SUPABASE_URL'), key = required(env, 'SUPABASE_SERVICE_ROLE_KEY');
    let deleted = 0, failed = 0;
    for (let i = 0; i < rows.length; i += 100) {
      const part = rows.slice(i, i + 100).filter(r => typeof r.path === 'string' && r.path.split('/')[0] === r.seller_id && !r.path.includes('..'));
      if (!part.length) continue;
      const ids = part.map(r => r.id);
      try {
        const r = await fetcher(base + '/storage/v1/object/market', { method: 'DELETE', signal: AbortSignal.timeout(20000),
          headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: part.map(x => x.path) }) });
        if (!r.ok) throw new Error('storage ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 200));
        await rpc('market_media_result', { ids, ok: true, err: null });
        deleted += part.length;
      } catch (e) {
        console.error('market sweep', String(e));
        await rpc('market_media_result', { ids, ok: false, err: String(e).slice(0, 300) });
        failed += part.length;
      }
    }
    return { deleted, failed };
  }
  return { offer, start, owns, verifyTBC, verifyPayPal, verifyStore, refundStore, sweep, user: billing.user };
}

function same(a, b) { if (!a || !b || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

export function marketHandler(deps) {
  const market = createMarket(deps);
  return async req => {
    if (req.method === 'OPTIONS') return json({});
    if (req.method !== 'POST') return json({ error: 'method' }, 405);
    try {
      const hook = req.headers.get('x-push-secret');
      if (hook) {   // the database's schedule (pg_net), with the secret only it and the server functions can read
        const { data } = await deps.db.rpc('push_hook_secret', {});
        if (!same(hook, data || '')) return json({ error: 'unauthorized' }, 401);
        const body = await req.json().catch(() => ({}));
        return body.sweep ? json(await market.sweep()) : json({ error: 'invalid-request' }, 400);
      }
      const u = await market.user(req), input = await req.json();
      if (input.action === 'catalog') return json(await market.offer());
      if (input.action === 'start') return json(await market.start(u.id, input.listing, input.package, input.provider));
      if (input.action === 'store') return json(await market.verifyStore(u.id, input.listing, input.package, input.transaction));
      if (input.action === 'verify' && typeof input.order === 'string' && input.order.length < 150) {
        if (input.provider === 'tbc') return json(await market.verifyTBC(input.order, u.id));
        if (input.provider === 'paypal') return json(await market.verifyPayPal(input.order, u.id, true));
      }
      throw new BillingError('invalid-request');
    } catch (e) { return json({ error: e instanceof BillingError ? e.message : 'market-unavailable' }, e instanceof BillingError ? e.status : 503); }
  };
}
