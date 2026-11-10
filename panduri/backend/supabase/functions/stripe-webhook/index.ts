import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
Deno.serve(async req => {
  if (req.method !== 'POST') return new Response('Method', { status: 405 });
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(await req.text(), req.headers.get('stripe-signature') || '',
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!, undefined, Stripe.createSubtleCryptoProvider());
  } catch (_) { return new Response('Invalid signature', { status: 400 }); }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return new Response('OK');
  try {
    // Read authoritative state even when events arrive late or are delivered more than once.
    const session = await stripe.checkout.sessions.retrieve((event.data.object as Stripe.Checkout.Session).id);
    if (session.mode !== 'payment' || session.payment_status !== 'paid') return new Response('OK');
    const plan = session.metadata?.plan;
    if (!['monthly', 'yearly'].includes(plan || '') || session.currency !== 'gel' ||
      session.amount_total !== (plan === 'monthly' ? 1499 : 11999) || session.metadata?.user_id !== session.client_reference_id) {
      return new Response('Invalid purchase', { status: 400 });
    }
    const { error } = await db.rpc('fulfill_stripe_purchase', { checkout_id: session.id,
      target: session.client_reference_id, purchase_plan: plan });
    if (error) throw error;
    return new Response('OK');
  } catch (_) { return new Response('Retry', { status: 500 }); }
});
