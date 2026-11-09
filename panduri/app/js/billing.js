/* Payments: stores on native devices, hosted checkout on web/desktop.
   Receipts and redirect parameters never unlock features; only the server profile does. */
PD.billing = (() => {
  const C = PD.cloud;
  let catalogPromise = null, sdk = null, sdkUser = null, initialization = Promise.resolve(), busy = false;
  const native = () => ['ios', 'android'].includes(platform());   // the desktop app exposes window.Capacitor too, and pays by hosted checkout
  const platform = () => window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'web';
  const pendingKey = uid => 'billing.pending.' + uid;
  async function catalog() {
    if (!C.session) throw new Error('sign-in-required');
    if (!catalogPromise) catalogPromise = C.billing({ action: 'catalog' }).catch(e => { catalogPromise = null; throw e; });
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
    catch (e) { if (e.code === 'order-not-found') { PD.store.del(pendingKey(uid)); return false; } throw e; }
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
      if (!['tbc', 'paypal'].includes(provider)) throw new Error('invalid-provider');
      // Finish an earlier approved purchase before opening another checkout.
      if (await verifyPending()) return { pending: false };
      const result = await C.billing({ action: 'start', plan, provider });
      if (C.uid !== uid) throw new Error('account-changed');
      const url = new URL(result.url);
      const hosts = provider === 'tbc' ? ['tpay.tbcbank.ge'] : ['www.paypal.com', 'www.sandbox.paypal.com'];
      if (url.protocol !== 'https:' || !hosts.includes(url.hostname) || result.provider !== provider || !result.order) throw new Error('invalid-checkout');
      PD.store.set(pendingKey(uid), { provider, order: result.order });
      location.assign(url.href);
      return { pending: true };
    } finally { busy = false; }
  }
  async function restore() {
    if (!C.session) throw new Error('sign-in-required');
    if (native()) { const purchases = await store(); await purchases.restorePurchases(); await syncStore(); }
    else { await verifyPending(); await C.loadProfile(); }
    return PD.premium.active;
  }
  let checking = false;
  async function refresh() {
    if (checking || !C.session || !C.configured) return;
    checking = true;
    try {
      if (native()) await syncStore(); else await verifyPending();
      await C.loadProfile();
    } catch (_) {} finally { checking = false; }
  }
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  // Restore the app's own return URL; a successful redirect is not a payment receipt.
  const params = new URLSearchParams(location.search);
  if (['tbc', 'paypal', 'success', 'cancelled'].includes(params.get('payment'))) {
    const url = new URL(location.href);
    ['payment', 'token', 'PayerID'].forEach(k => url.searchParams.delete(k));
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    setTimeout(refresh, 1200);
  }
  setTimeout(refresh, 1500);
  let lastUser = C.uid;
  PD.bus.on('cloud', () => { if (lastUser !== C.uid) { lastUser = C.uid; catalogPromise = null; setTimeout(refresh, 0); } });
  return { options, purchase, restore, refresh, get native() { return native(); } };
})();
