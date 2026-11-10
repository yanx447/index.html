-- Apply after 202611080001_payments.sql. Web orders are saved before redirecting buyers.
create table if not exists public.billing_orders (
  id uuid primary key,
  provider text not null check (provider in ('tbc', 'paypal')),
  provider_id text not null,
  user_id uuid not null references auth.users on delete cascade,
  plan text not null check (plan in ('monthly', 'yearly')),
  amount numeric(12,2) not null check (amount > 0),
  currency text not null,
  created_at timestamptz not null default now(),
  unique(provider, provider_id)
);
alter table public.billing_orders enable row level security;
revoke all on public.billing_orders from anon, authenticated;
grant all on public.billing_orders to service_role;
alter table public.purchases add column if not exists payment_id text;
create unique index if not exists purchases_provider_payment on public.purchases(provider, payment_id);
alter table public.profiles add column if not exists store_until timestamptz;
alter table public.profiles add column if not exists store_snapshot_ms bigint not null default 0;
-- Existing grants list individual editable columns. Never grant clients store_until or store_snapshot_ms.
create or replace function public.fulfill_web_purchase(purchase_provider text, payment_id text, target uuid, purchase_plan text)
returns void language plpgsql security definer set search_path = public as $$
declare p public.profiles; expiry timestamptz;
begin
  if purchase_provider not in ('tbc', 'paypal') or purchase_plan not in ('monthly', 'yearly') then raise exception 'invalid purchase'; end if;
  if not exists (select 1 from public.billing_orders o where o.provider = purchase_provider and o.provider_id = fulfill_web_purchase.payment_id and o.user_id = target and o.plan = purchase_plan) then raise exception 'unknown order'; end if;
  select * into strict p from public.profiles where id = target for update;
  if exists(select 1 from public.purchases x where x.provider = purchase_provider and x.payment_id = fulfill_web_purchase.payment_id) then return; end if;
  expiry := greatest(now(), coalesce(p.vip_until, now())) + case when purchase_plan = 'monthly' then interval '1 month' else interval '1 year' end;
  insert into public.purchases(user_id, provider, product, status, expires_at, payment_id)
    values(target, purchase_provider, 'premium_' || purchase_plan, 'active', expiry, payment_id);
  if not p.premium_banned then
    update public.profiles set vip_until = expiry,
      plan = case when p.plan = 'vip' and p.vip_until > now() then 'vip' else purchase_plan end where id = target;
  end if;
end $$;
create or replace function public.sync_store_entitlement(target uuid, expiry timestamptz, snapshot_ms bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  -- The provider's absolute expiry supports renewal, cancellation, refunds and retries without adding time twice.
  update public.profiles set store_until = expiry, store_snapshot_ms = snapshot_ms
    where id = target and store_snapshot_ms <= snapshot_ms;
end $$;
create or replace function public.is_premium(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select (uid = auth.uid() and public.is_owner()) or exists (
    select 1 from public.profiles where id = uid and not premium_banned and
      (vip_until > now() or store_until > now())
  );
$$;
revoke all on function public.fulfill_web_purchase(text, text, uuid, text), public.sync_store_entitlement(uuid, timestamptz, bigint) from public, anon, authenticated;
grant execute on function public.fulfill_web_purchase(text, text, uuid, text), public.sync_store_entitlement(uuid, timestamptz, bigint) to service_role;
