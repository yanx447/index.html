/* =====================================================================
   Apple Pay and Google Pay on the checkout page itself (checkout.js).
   The server decides whether a wallet is on (billing catalog `express`); this
   module only asks the device whether it can pay, draws the wallet's own button
   and runs the wallet's sheet. The sheet hands over an encrypted token, which
   goes straight to the server; the server charges it and grants Premium. No
   card number ever reaches this page, and a sheet that closes is not a receipt.
   Store builds never come here: Premium in the App Store or Google Play is the
   store's own purchase (billing.js).
   pay() must be called inside the click: both wallets refuse a sheet without one.
   ===================================================================== */
PD.payWallet = (() => {
  const h = PD.h, C = PD.cloud;
  const outcome = r => r && r.paid ? { paid: true } : r && r.pending ? { pending: true } : { declined: true };

  const apple = {
    ready() {
      try { return Promise.resolve(!!(window.ApplePaySession && ApplePaySession.supportsVersion(3) && ApplePaySession.canMakePayments())); }
      catch (_) { return Promise.resolve(false); }   // canMakePayments throws outside a secure top-level page
    },
    // Apple's own button, drawn by Safari from CSS (checkout.css .xp-apple); its words follow `lang`, and Apple has none in Georgian
    button: (cfg, onclick) => h('button', { type: 'button', class: 'xp-apple', lang: PD.i18n.lang === 'ka' ? 'en' : PD.i18n.lang, 'aria-label': 'Apple Pay', onclick }),
    pay(cfg, plan, price, label) {
      return new Promise((resolve, reject) => {
        let over = false;
        const end = (f, v) => { if (!over) { over = true; f(v); } };
        const s = new ApplePaySession(3, { countryCode: cfg.country, currencyCode: price.currency, supportedNetworks: cfg.networks, merchantCapabilities: cfg.capabilities,
          lineItems: [{ label, amount: price.value, type: 'final' }], total: { label: cfg.merchantName, amount: price.value, type: 'final' } });
        s.onvalidatemerchant = e => C.billing({ action: 'wallet-session', wallet: 'apple_pay', validationURL: e.validationURL })
          .then(r => s.completeMerchantValidation(r.session))
          .catch(err => { try { s.abort(); } catch (_) {} end(reject, err); });
        s.onpaymentauthorized = e => C.billing({ action: 'wallet-pay', wallet: 'apple_pay', plan, token: e.payment.token })
          .then(r => { const o = outcome(r); s.completePayment(o.declined ? ApplePaySession.STATUS_FAILURE : ApplePaySession.STATUS_SUCCESS); end(resolve, o); })
          .catch(err => { try { s.completePayment(ApplePaySession.STATUS_FAILURE); } catch (_) {} end(reject, err); });
        s.oncancel = () => end(resolve, { cancelled: true });
        s.begin();
      });
    }
  };

  // Google's script is fetched only when the server has switched Google Pay on, and only on this page.
  let script = null;
  const load = () => script || (script = new Promise((resolve, reject) => {
    if (window.google && google.payments) return resolve();
    const el = document.createElement('script');
    el.src = 'https://pay.google.com/gp/p/js/pay.js'; el.async = true;
    el.onload = () => resolve(); el.onerror = () => { script = null; el.remove(); reject(new Error('wallet-unavailable')); };
    document.head.append(el);
  }));
  const clients = {};
  const client = cfg => clients[cfg.environment] || (clients[cfg.environment] = new google.payments.api.PaymentsClient({ environment: cfg.environment }));
  const BASE = { apiVersion: 2, apiVersionMinor: 0 };
  const params = cfg => ({ allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'], allowedCardNetworks: cfg.networks });
  const card = cfg => ({ type: 'CARD', parameters: params(cfg), tokenizationSpecification: { type: 'PAYMENT_GATEWAY', parameters: { gateway: cfg.gateway, gatewayMerchantId: cfg.gatewayMerchantId } } });
  const google_ = {
    ready: cfg => load().then(() => client(cfg).isReadyToPay({ ...BASE, allowedPaymentMethods: [{ type: 'CARD', parameters: params(cfg) }] })).then(r => !!(r && r.result)).catch(() => false),
    button(cfg, onClick) {
      const box = h('div', { class: 'xp-google' });
      box.append(client(cfg).createButton({ onClick, buttonType: 'buy', buttonColor: 'white', buttonSizeMode: 'fill', buttonRadius: 12, allowedPaymentMethods: [card(cfg)] }));
      return box;
    },
    pay: (cfg, plan, price, label) => client(cfg).loadPaymentData({ ...BASE, allowedPaymentMethods: [card(cfg)], merchantInfo: { merchantId: cfg.merchantId, merchantName: cfg.merchantName },
      transactionInfo: { totalPriceStatus: 'FINAL', totalPrice: price.value, totalPriceLabel: label, currencyCode: price.currency, countryCode: cfg.country } })
      .then(d => C.billing({ action: 'wallet-pay', wallet: 'google_pay', plan, token: d.paymentMethodData.tokenizationData.token }), e => { if (e && e.statusCode === 'CANCELED') return { cancelled: true }; throw e; })
      .then(r => r && r.cancelled ? r : outcome(r))
  };

  const W = { apple_pay: apple, google_pay: google_ };
  return {
    /** can this device pay with this wallet now? never throws */
    ready: cfg => W[cfg.id] ? W[cfg.id].ready(cfg) : Promise.resolve(false),
    button: (cfg, onclick) => W[cfg.id].button(cfg, onclick),
    /** → { paid } | { pending } | { declined } | { cancelled }; rejects when the server could not be reached */
    pay: (cfg, plan, price, label) => W[cfg.id].pay(cfg, plan, price, label)
  };
})();
