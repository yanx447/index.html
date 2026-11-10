import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
Deno.serve(async req => {
  const origin = Deno.env.get('APP_ORIGIN')!;
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Content-Type': 'application/json', 'Vary': 'Origin' };
  const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (req.method === 'OPTIONS') return reply({});
  if (req.method !== 'POST') return reply({ error: 'method' }, 405);
  try {
    const token = req.headers.get('Authorization')?.replace(/^Bearer /, '');
    if (!token) return reply({ error: 'sign-in-required' }, 401);
    const { data: { user }, error } = await db.auth.getUser(token);
    if (error || !user) return reply({ error: 'sign-in-required' }, 401);
    const { plan } = await req.json();
    if (plan !== 'monthly' && plan !== 'yearly') return reply({ error: 'invalid-plan' }, 400);
    const { data: profile, error: profileError } = await db.from('profiles').select('premium_banned').eq('id', user.id).single();
    if (profileError) throw profileError;
    if (profile.premium_banned) return reply({ error: 'premium-blocked' }, 403);
    // Prices are defined on the server; neither the amount nor the account comes from the browser.
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'gel', unit_amount: plan === 'monthly' ? 1499 : 11999,
        product_data: { name: plan === 'monthly' ? 'Panduri Premium — 1 month' : 'Panduri Premium — 1 year' } }, quantity: 1 }],
      client_reference_id: user.id, metadata: { user_id: user.id, plan },
      success_url: origin + '/?payment=success', cancel_url: origin + '/?payment=cancelled'
    });
    return reply({ url: session.url });
  } catch (_) { return reply({ error: 'checkout-unavailable' }, 503); }
});
