-- Apply after source/supabase/schema.sql. Only the verified webhook can grant paid time.
alter table public.purchases add column if not exists checkout_id text unique;
revoke insert, update, delete on public.purchases from anon, authenticated;
create or replace function public.fulfill_stripe_purchase(checkout_id text, target uuid, purchase_plan text)
returns void language plpgsql security definer set search_path = public as $$
declare p public.profiles; expiry timestamptz;
begin
  if purchase_plan not in ('monthly', 'yearly') then raise exception 'invalid plan'; end if;
  select * into strict p from public.profiles where id = target for update;
  if exists (select 1 from public.purchases x where x.checkout_id = fulfill_stripe_purchase.checkout_id) then return; end if;
  expiry := greatest(now(), coalesce(p.vip_until, now())) + case when purchase_plan = 'monthly' then interval '1 month' else interval '1 year' end;
  insert into public.purchases(user_id, provider, product, status, expires_at, checkout_id)
    values(target, 'stripe', 'premium_' || purchase_plan, 'active', expiry, checkout_id);
  -- A payment cannot undo an owner's ban or replace a manually granted lifetime VIP.
  if not p.premium_banned then
    update public.profiles set vip_until = expiry,
      plan = case when p.plan = 'vip' and p.vip_until > now() then 'vip' else purchase_plan end where id = target;
  end if;
end $$;
revoke all on function public.fulfill_stripe_purchase(text, uuid, text) from public, anon, authenticated;
grant execute on function public.fulfill_stripe_purchase(text, uuid, text) to service_role;
