import { createBilling, json, required } from './billing.js';
import { createMarket } from './market.js';
export function paymentCallback(deps) {
const { db, env } = deps, billing = createBilling(deps), market = createMarket(deps);
return async req => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  try {
    const provider = new URL(req.url).searchParams.get('provider');
    const body = await req.json();
    if (provider === 'tbc') {
      // TBC callbacks are hints only. Authenticate the purchase by fetching it from TBC.
      if (typeof body.PaymentId !== 'string' || body.PaymentId.length > 150) return json({ error: 'invalid-request' }, 400);
      // the marketplace's own orders are answered by its code; everything else is Premium, as before
      if (await market.owns('tbc', body.PaymentId)) await market.verifyTBC(body.PaymentId);
      else await billing.verifyTBC(body.PaymentId);
    } else if (provider === 'paypal') {
      const verified = await billing.paypal('/v1/notifications/verify-webhook-signature', {
        auth_algo: req.headers.get('paypal-auth-algo'), cert_url: req.headers.get('paypal-cert-url'),
        transmission_id: req.headers.get('paypal-transmission-id'), transmission_sig: req.headers.get('paypal-transmission-sig'),
        transmission_time: req.headers.get('paypal-transmission-time'), webhook_id: required(env, 'PAYPAL_WEBHOOK_ID'), webhook_event: body
      });
      if (verified.verification_status !== 'SUCCESS') return json({ error: 'invalid-signature' }, 400);
      if (['CHECKOUT.ORDER.APPROVED', 'PAYMENT.CAPTURE.COMPLETED'].includes(body.event_type)) {
        const id = body.event_type === 'CHECKOUT.ORDER.APPROVED' ? body.resource?.id : body.resource?.supplementary_data?.related_ids?.order_id;
        if (typeof id !== 'string' || id.length > 150) return json({ error: 'invalid-order' }, 400);
        if (await market.owns('paypal', id)) await market.verifyPayPal(id, undefined, body.event_type === 'CHECKOUT.ORDER.APPROVED');
        else await billing.verifyPayPal(id, undefined, body.event_type === 'CHECKOUT.ORDER.APPROVED');
      } else if (['PAYMENT.CAPTURE.REFUNDED', 'PAYMENT.CAPTURE.REVERSED'].includes(body.event_type)) {
        // a marketplace refund: the order is read again from PayPal; its paid hours come off the listing
        const id = body.resource?.supplementary_data?.related_ids?.order_id;
        if (typeof id === 'string' && id.length <= 150 && await market.owns('paypal', id)) await market.verifyPayPal(id);
      }
    } else return json({ error: 'invalid-provider' }, 400);
    return json({ received: true });
  } catch (_) { return json({ error: 'retry' }, 503); }
};
}

export function storeWebhook(deps) {
const { env } = deps, billing = createBilling(deps), market = createMarket(deps);
return async req => {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  try {
    if (req.headers.get('Authorization') !== 'Bearer ' + required(env, 'REVENUECAT_WEBHOOK_TOKEN')) return json({ error: 'unauthorized' }, 401);
    const { event } = await req.json();
    if (!event || typeof event !== 'object') return json({ error: 'invalid-event' }, 400);
    const ids = new Set([event.app_user_id, ...(event.transferred_from || []), ...(event.transferred_to || [])].filter(x => typeof x === 'string'));
    if (ids.size > 50) return json({ error: 'invalid-event' }, 400);
    for (const id of ids) await billing.syncStore(id);
    // a refunded marketplace advertisement (a consumable): its hours come off the listing
    if (event.type === 'CANCELLATION' && /^market_/.test(String(event.product_id || '')) && typeof event.transaction_id === 'string') await market.refundStore(event.store, event.transaction_id);
    return json({ received: true });
  } catch (_) { return json({ error: 'retry' }, 503); }
};
}
