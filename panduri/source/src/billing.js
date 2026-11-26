/* Payments: stores on native devices, hosted checkout (and, once the server has them on, Apple Pay and Google Pay
   on the page itself: paywallet.js) on web/desktop.
   Receipts and redirect parameters never unlock features; only the server profile does. */
PD.billing = (() => {
  const C = PD.cloud;
  let catalogPromise = null, sdk = null, sdkUser = null, initialization = Promise.resolve(), busy = false;
  const native = () => ['ios', 'android'].includes(platform());   // the desktop app exposes window.Capacitor too, and pays by hosted checkout
  const platform = () => window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web';
  const pendingKey = uid => 'billing.pending.' + uid;
  async function catalog() {
    if (!C.session) throw new Error('sign-in-required');
    if (!catalogPromise) catalogPromise = C.billing({ action: 'catalog', v: 2, express: true }).catch(e => { catalogPromise = null; throw e; });
    return catalogPromise;
  }
  async function store() {
    const uid = C.uid;
    if (!uid || !native()) throw new Error('sign-in-required');
    const work = initialization.catch(() => {}).then(async () => {
      if (uid !== C.uid) throw new Error('account-changed');
      const cap = window.Capacitor, config = await catalog(), key = config.stores[platform()];
      if (!key || !cap.isPluginAvailable || !cap.isPluginAvailable('Purchases')) throw new Error('billing-not-configured');
      if (!sdk) sdk = cap.registerPlugin ? cap.registerPlugin('Purchases') : cap.Plugins.Purchases;
      if (!sdk) throw new Error('billing-not-configured');
      if (!sdkUser) await sdk.configure({ apiKey: key, appUserID: uid, diagnosticsEnabled: false, automaticDeviceIdentifierCollectionEnabled: false });
      else if (sdkUser !== uid) await sdk.logIn({ appUserID: uid });
      sdkUser = uid;
      if (uid !== C.uid) throw new Error('account-changed');
      return sdk;
    });
    initialization = work;
    return work;
  }
  async function offerings() {
    const purchases = await store(), result = await purchases.getOfferings();
    const packages = result.current && result.current.availablePackages || [];
    return Object.fromEntries([['monthly', 'MONTHLY'], ['yearly', 'ANNUAL']].map(([plan, kind]) => [plan, packages.find(p => p.packageType === kind)]));
  }
  async function options() {
    if (native()) {
      const packages = await offerings();
      return { native: true, packages, policies: (await catalog()).policies, providers: [{ id: 'store', prices: Object.fromEntries(Object.entries(packages).filter(([, p]) => p).map(([k, p]) => [k, { display: p.product.priceString }])) }] };
    }
    return Object.assign({ native: false }, await catalog());
  }
  async function syncStore() {
    await C.billing({ action: 'sync-store' });
    await C.loadProfile();
  }
  async function verifyPending() {
    const uid = C.uid, pending = uid && PD.store.get(pendingKey(uid), null);
    if (!pending || !C.session) return false;
    let result;
    try { result = await C.billing({ action: 'verify', provider: pending.provider, order: pending.order }); }
    catch (e) {
      // gone at the provider, or still unreadable three days on (an approved order is captured by the webhook anyway): forget it
      if (e.code === 'order-not-found' || !(Date.now() - (pending.at || 0) < 3 * 864e5) && e.code !== 'offline') { PD.store.del(pendingKey(uid)); return false; }
      throw e;
    }
    if (C.uid !== uid) return false;
    if (result.paid) { PD.store.del(pendingKey(uid)); await C.loadProfile(); }
    return !!result.paid;
  }
  async function purchase(plan, provider, selectedPackage) {
    if (busy) throw new Error('purchase-busy');
    if (!C.session) throw new Error('sign-in-required');
    const uid = C.uid; busy = true;
    try {
      if (native()) {
        // Never send store builds to an external card or PayPal checkout.
        const purchases = await store(), p = selectedPackage || (await offerings())[plan];
        if (!p) throw new Error('product-unavailable');
        await purchases.purchasePackage({ aPackage: p });
        if (C.uid !== uid) throw new Error('account-changed');
        await syncStore();
        return { pending: !PD.premium.active };
      }
      // 'paypal-card' is a card typed on PayPal's own page; the order it creates is an ordinary PayPal order.
      if (!['tbc', 'paypal', 'paypal-card'].includes(provider)) throw new Error('invalid-provider');
      const via = provider === 'tbc' ? 'tbc' : 'paypal';
      // Finish an earlier approved purchase before opening another checkout.
      if (await verifyPending()) return { pending: false };
      const result = await C.billing({ action: 'start', plan, provider });
      if (C.uid !== uid) throw new Error('account-changed');
      const url = new URL(result.url);
      const hosts = via === 'tbc' ? ['tpay.tbcbank.ge'] : ['www.paypal.com', 'www.sandbox.paypal.com'];
      if (url.protocol !== 'https:' || !hosts.includes(url.hostname) || result.provider !== via || !result.order) throw new Error('invalid-checkout');
      PD.store.set(pendingKey(uid), { provider: via, order: result.order, plan, at: Date.now() });
      location.assign(url.href);
      return { pending: true, redirecting: true };
    } finally { busy = false; }
  }
  /** the store's own prices for consumables (product id → "₾3.00" as the store shows it) */
  async function consumablePrices(ids) {
    if (!native()) return {};
    const purchases = await store(), r = await purchases.getProducts({ productIdentifiers: ids, type: 'NON_SUBSCRIPTION' });
    return Object.fromEntries(((r && r.products) || []).map(p => [p.identifier, p.priceString]));
  }
  /** buy one consumable in the store; answers the store's transaction id. The server reads the purchase from
      RevenueCat itself before anything is granted — this result is not a receipt. */
  async function consumable(id) {
    if (busy) throw new Error('purchase-busy');
    if (!native()) throw new Error('billing-not-configured');
    const uid = C.uid; busy = true;
    try {
      const purchases = await store(), r = await purchases.getProducts({ productIdentifiers: [id], type: 'NON_SUBSCRIPTION' });
      const product = r && r.products && r.products.find(p => p.identifier === id);
      if (!product) throw new Error('product-unavailable');
      const out = await purchases.purchaseStoreProduct({ product });
      if (C.uid !== uid) throw new Error('account-changed');
      const tx = out && out.transaction && (out.transaction.transactionIdentifier || out.transaction.transactionId);
      if (!tx) throw new Error('purchase-unverified');
      return String(tx);
    } finally { busy = false; }
  }
  /** a price the server sent on sale: { regular, pct, until } — only while the sale runs (the server charges the sale price
      and, after `until`, the regular one again). null for an ordinary price or a store price. */
  function sale(p) {
    if (!p || p.display || !p.regular || !p.until) return null;
    const v = Number(p.value), r = Number(p.regular), u = Date.parse(p.until);
    if (!(v > 0 && r > v) || !(u > Date.now())) return null;
    return { regular: { value: p.regular, currency: p.currency }, pct: Math.round((1 - v / r) * 100), until: new Date(u) };
  }
  /** a true comparison, shown struck out: what the same time costs bought as n of the shorter option (a year as 12 monthly
      payments, 30 days as 30 one-day advertisements). Both prices must be real prices in the same currency. null otherwise. */
  function compare(p, ref, n) {
    if (!p || !ref || p.display || ref.display || p.currency !== ref.currency || !(n > 1)) return null;
    const v = Number(p.value), r = Math.round(Number(ref.value) * n * 100) / 100;
    if (!(v > 0 && r > v)) return null;
    return { regular: { value: r.toFixed(2), currency: p.currency }, pct: Math.round((1 - v / r) * 100) };
  }
  async function restore() {
    if (!C.session) throw new Error('sign-in-required');
    if (native()) { const purchases = await store(); await purchases.restorePurchases(); await syncStore(); }
    else { await verifyPending(); await C.loadProfile(); }
    return PD.premium.active;
  }
  let checking = false, lastCheck = 0;
  // focus and visibilitychange fire together: at most one check a minute (a return from checkout passes `now`)
  async function refresh(now) {
    if (checking || !C.session || !C.configured || now !== true && Date.now() - lastCheck < 60000) return;
    checking = true; lastCheck = Date.now();
    try {
      if (native()) await syncStore(); else await verifyPending();
      await C.loadProfile();
    } catch (_) {} finally { checking = false; }
  }
  window.addEventListener('focus', () => refresh());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  // Restore the app's own return URL; a successful redirect is not a payment receipt.
  const params = new URLSearchParams(location.search), returned = params.get('payment');
  if (['tbc', 'paypal', 'success', 'cancelled'].includes(params.get('payment'))) {
    const url = new URL(location.href);
    ['payment', 'token', 'PayerID'].forEach(k => url.searchParams.delete(k));
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    setTimeout(() => refresh(true), 1200);
  }
  setTimeout(() => refresh(true), 1500);
  let lastUser = C.uid;
  PD.bus.on('cloud', () => { if (lastUser !== C.uid) { lastUser = C.uid; catalogPromise = null; setTimeout(() => refresh(true), 0); } });
  const pending = () => { const uid = C.uid; return uid && PD.store.get(pendingKey(uid), null); };
  // `returned`: the buyer came back from a hosted checkout ('tbc' | 'paypal' | 'cancelled'). It is a hint for the screen, not a receipt.
  return { options, purchase, restore, refresh, verifyPending, pending, consumable, consumablePrices, sale, compare, returned: ['tbc', 'paypal', 'success', 'cancelled'].includes(returned) ? returned : null, get native() { return native(); } };
})();
