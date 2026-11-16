-- Premium on sale: a real, time-limited price the owner switches on and off from the app (pmadmin → Discounts).
-- The regular prices: GEL 4.99 / 39.99 (billing.js PLANS; lowered for good on 2026-11-16) and PAYPAL_MONTHLY_PRICE / PAYPAL_YEARLY_PRICE.
-- While sale_until is in the future the `billing` function charges the sale price and the app shows the regular one struck
-- out; after it, the regular price is charged again by itself. A sale that is not lower than the regular price is ignored.
-- Needs only 202611080002_multiplatform_billing.sql and is_owner(). Additive; can be run twice.
create table if not exists public.premium_sales (
  plan text primary key check (plan in ('monthly', 'yearly')),
  sale_minor integer check (sale_minor is null or (sale_minor > 0 and sale_minor < case plan when 'monthly' then 499 else 3999 end)),
  paypal_sale_value text check (paypal_sale_value is null or paypal_sale_value ~ '^[0-9]+\.[0-9]{2}$'),
  sale_until timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);
-- no sale prepared: the prices themselves are low now. The owner can still run a real, time-limited sale from the app.
insert into public.premium_sales (plan) values ('monthly'), ('yearly') on conflict (plan) do nothing;
alter table public.premium_sales enable row level security;   -- read by the billing function (service role) and the owner's functions
revoke all on public.premium_sales from anon, authenticated;

/** the owner's view of every sale: Premium and the marketplace's packages (when that migration is there) */
create or replace function public.owner_sales() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare m jsonb := '[]'::jsonb;
begin
  if not public.is_owner() then raise exception 'not-allowed'; end if;
  if to_regclass('public.market_packages') is not null then
    execute $q$select coalesce(jsonb_agg(jsonb_build_object('id', id, 'name_ka', name_ka, 'name_en', name_en, 'hours', hours, 'price_minor', price_minor,
      'sale_minor', sale_minor, 'paypal_value', paypal_value, 'paypal_currency', paypal_currency, 'paypal_sale_value', paypal_sale_value, 'sale_until', sale_until) order by sort), '[]'::jsonb)
      from public.market_packages where kind = 'ad'$q$ into m;
  end if;
  return jsonb_build_object('now', now(), 'market', m,
    'premium', (select coalesce(jsonb_agg(jsonb_build_object('plan', plan, 'price_minor', case plan when 'monthly' then 499 else 3999 end,
      'sale_minor', sale_minor, 'paypal_sale_value', paypal_sale_value, 'sale_until', sale_until) order by plan), '[]'::jsonb) from public.premium_sales));
end $$;

/** switch a Premium sale on (with its end) or off (until = null). The owner only. */
create or replace function public.owner_premium_sale(sale_plan text, sale_gel numeric, pp_sale text, until timestamptz) returns void
language plpgsql security definer set search_path = public as $$
declare regular integer := case sale_plan when 'monthly' then 499 when 'yearly' then 3999 end;   -- the regular price in tetri (billing.js PLANS)
begin
  if not public.is_owner() then raise exception 'not-allowed'; end if;
  if regular is null then raise exception 'invalid-plan'; end if;
  if until is not null then
    if until <= now() or until > now() + interval '366 days' then raise exception 'invalid-date'; end if;
    if sale_gel is null or round(sale_gel * 100) <= 0 or round(sale_gel * 100) >= regular then raise exception 'sale-not-lower'; end if;
    if nullif(pp_sale, '') is not null and pp_sale !~ '^[0-9]+\.[0-9]{2}$' then raise exception 'invalid-price'; end if;
  end if;
  insert into public.premium_sales (plan) values (sale_plan) on conflict (plan) do nothing;
  update public.premium_sales s set sale_minor = case when sale_gel is null then s.sale_minor else round(sale_gel * 100)::int end,
    paypal_sale_value = case when until is null and nullif(pp_sale, '') is null then s.paypal_sale_value else nullif(pp_sale, '') end,
    sale_until = until, updated_at = now(), updated_by = auth.uid()
  where s.plan = sale_plan;
end $$;

revoke all on function public.owner_sales(), public.owner_premium_sale(text, numeric, text, timestamptz) from public, anon;
grant execute on function public.owner_sales(), public.owner_premium_sale(text, numeric, text, timestamptz) to authenticated;
