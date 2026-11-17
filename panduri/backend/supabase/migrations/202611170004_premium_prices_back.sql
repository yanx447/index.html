-- Premium is 14.99 / 119.99 GEL again (the owner's decision, 2026-11-17). The live server ran 202611170002_premium_sales.sql
-- while the prices were 4.99 / 39.99 and has those numbers in its check and functions; this puts the regular price in one
-- function and uses it everywhere. Can be run twice.
create or replace function public.premium_regular_minor(p text) returns integer
language sql immutable set search_path = public as $$ select case p when 'monthly' then 1499 when 'yearly' then 11999 end $$;
-- the old check is named premium_sales_check (it reads two columns); either name is dropped, one named check is added
alter table public.premium_sales drop constraint if exists premium_sales_check;
alter table public.premium_sales drop constraint if exists premium_sales_sale_minor_check;
alter table public.premium_sales add constraint premium_sales_sale_minor_check check (sale_minor is null or (sale_minor > 0 and sale_minor < public.premium_regular_minor(plan)));

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
    'premium', (select coalesce(jsonb_agg(jsonb_build_object('plan', plan, 'price_minor', public.premium_regular_minor(plan),
      'sale_minor', sale_minor, 'paypal_sale_value', paypal_sale_value, 'sale_until', sale_until) order by plan), '[]'::jsonb) from public.premium_sales));
end $$;

create or replace function public.owner_premium_sale(sale_plan text, sale_gel numeric, pp_sale text, until timestamptz) returns void
language plpgsql security definer set search_path = public as $$
declare regular integer := public.premium_regular_minor(sale_plan);
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
