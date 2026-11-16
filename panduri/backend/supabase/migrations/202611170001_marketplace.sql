-- ფანდურის ბაზარი — the Panduri Marketplace.
--
-- Instruments for sale. Every listing is paid (the owner's decision, 2026-11-16): one of four advertisements, which put
-- the listing in the sponsored places AND define its whole lifetime: when the purchased time ends, the entire listing
-- expires and is deleted, with its photos, video and audio. Only the financial records stay (market_promotions, market_orders).
--
--                                 price (PayPal)        lifetime
--   ad24   24-საათიანი რეკლამა    2.99 ₾ (1.03 EUR)     24 h
--   ad72   3-დღიანი რეკლამა       6.99 ₾ (2.41 EUR)     72 h
--   ad168  კვირის რეკლამა        14.99 ₾ (5.17 EUR)    168 h
--   ad720  თვის რეკლამა          29.99 ₾ (10.34 EUR)   720 h (30 days)
-- (the owner lowered them for good on 2026-11-16; EUR at NBG 2026-11-07, EUR 1 = GEL 2.8998)
--
-- A sale is real: it has an end (sale_until); before and after it the regular price is what is charged, so a struck-out
-- regular price is never a price nobody pays. The owner switches sales on and off (market_owner_sale, is_owner()).
-- The `free` row stays only as the history of the earlier free listing; it is switched off and cannot be chosen.
--
-- Rules the database enforces (not the app):
--   * every time is the server's (market_now()); the device clock decides nothing
--   * paid time starts only when a verified payment meets a publicly active listing; moderation does not use it up
--   * a package bought for a live listing is added to its deadline (a listing left without a paid deadline, e.g. after a
--     refund, gets the package's deadline from now)
--   * a listing is public only while status = 'active' and expires_at is in the future — every read goes through
--     market_is_live(), so an expired listing vanishes from search, sponsored places, saved lists and its own URL
--     at the second it expires, whether or not the cleanup job has run yet
--   * market_expire() (pg_cron, every minute) deletes expired listings; the files go to market_media_trash and the
--     `market` Edge Function deletes them through the Storage API, retrying with back-off
--   * a listing with a payment in flight (an order opened in the last 2 hours) or paid time still queued is never
--     deleted; listing rows are locked by both the payment and the cleanup, so they cannot interleave
--
-- Needs 202611090002_social.sql (notifications, server_config, blocks, the word filter, the hook secret).
-- Additive: no existing table, column, policy or function is changed. It can be run twice.

-- ===================================================================== the clock
-- Tests move time with `set market.test_now = '…'`. The setting is honoured only where the server_config row
-- market_test_clock = 'on' exists — never on the live server, and members cannot write server_config.
create or replace function public.market_now() returns timestamptz
language plpgsql stable security definer set search_path = public as $$
declare v text;
begin
  if exists (select 1 from public.server_config where key = 'market_test_clock' and value = 'on') then
    v := current_setting('market.test_now', true);
    if v is not null and v <> '' then return v::timestamptz; end if;
  end if;
  return now();
end $$;

-- ===================================================================== packages: the server's price list
create table if not exists public.market_packages (
  id text primary key,
  kind text not null check (kind in ('free', 'ad')),
  hours integer not null,
  price_minor integer not null check (price_minor >= 0 and price_minor <= 1000000),   -- tetri
  currency text not null default 'GEL' check (currency = 'GEL'),
  -- PayPal cannot charge GEL: a package is offered through PayPal only once the owner has approved its EUR/USD price
  paypal_value text check (paypal_value is null or paypal_value ~ '^[0-9]+\.[0-9]{2}$'),
  paypal_currency text check (paypal_currency is null or paypal_currency in ('USD', 'EUR')),
  store_product text check (store_product is null or store_product ~ '^[a-z0-9_.]{3,100}$'),   -- App Store / Play consumable
  -- a sale: its price (and PayPal's), and when it ends. No end, or an end in the past: no sale.
  sale_minor integer check (sale_minor is null or (sale_minor > 0 and sale_minor < price_minor)),
  paypal_sale_value text check (paypal_sale_value is null or paypal_sale_value ~ '^[0-9]+\.[0-9]{2}$'),
  sale_until timestamptz,
  name_ka text not null, name_en text not null,
  active boolean not null default true,
  sort integer not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null,
  -- the length of each package is part of its identity: 24 hours is always 24 hours
  constraint market_packages_hours check ((id = 'free' and kind = 'free' and hours = 720 and price_minor = 0)
    or (id = 'ad24' and kind = 'ad' and hours = 24) or (id = 'ad72' and kind = 'ad' and hours = 72)
    or (id = 'ad168' and kind = 'ad' and hours = 168) or (id = 'ad720' and kind = 'ad' and hours = 720))
);
-- an owner's later price changes are kept when this file runs again
insert into public.market_packages (id, kind, hours, price_minor, paypal_value, paypal_currency, store_product, name_ka, name_en, sort, active) values
  ('free',  'free', 720,    0, null,    null,  null,           'უფასო განცხადება',     'Free listing',          0, false),
  ('ad24',  'ad',    24,  299, '1.03',  'EUR', 'market_ad24',  '24-საათიანი რეკლამა',  '24-Hour Advertisement', 1, true),
  ('ad72',  'ad',    72,  699, '2.41',  'EUR', 'market_ad72',  '3-დღიანი რეკლამა',     '3-Day Advertisement',   2, true),
  ('ad168', 'ad',   168, 1499, '5.17',  'EUR', 'market_ad168', 'კვირის რეკლამა',       'Weekly Advertisement',  3, true),
  ('ad720', 'ad',   720, 2999, '10.34', 'EUR', 'market_ad720', 'თვის რეკლამა',         'Monthly Advertisement', 4, true)
on conflict (id) do nothing;
-- the price charged now: the sale's while it runs, the regular one otherwise
create or replace function public.market_price_minor(p public.market_packages) returns integer
language sql stable security definer set search_path = public as $$
  select case when p.sale_minor is not null and p.sale_until is not null and p.sale_until > public.market_now() then p.sale_minor else p.price_minor end;
$$;
alter table public.market_packages enable row level security;
drop policy if exists "anyone reads packages" on public.market_packages;
create policy "anyone reads packages" on public.market_packages for select using (true);

-- ===================================================================== listings
create table if not exists public.market_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users on delete cascade,
  title text not null check (char_length(title) between 3 and 90),
  body text not null default '' check (char_length(body) <= 3000),
  category text not null check (category in ('panduri', 'chonguri', 'instrument', 'parts', 'accessory')),
  condition text not null check (condition in ('new', 'like_new', 'good', 'fair', 'repair')),
  price numeric(10,2) check (price is null or (price >= 0 and price <= 1000000)),   -- null: the price is agreed
  currency text not null default 'GEL' check (currency in ('GEL', 'USD', 'EUR')),
  negotiable boolean not null default false,
  city text not null default '' check (char_length(city) <= 40),
  phone text check (phone is null or phone ~ '^\+?[0-9 ()-]{6,20}$'),
  photos text[] not null default '{}' check (cardinality(photos) <= 8),
  video_path text,
  audio_path text,
  status text not null default 'draft' check (status in ('draft', 'pending', 'active', 'expired', 'rejected')),
  plan text not null default 'ad24' references public.market_packages(id),   -- the package chosen (every listing is paid)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,          -- the moment it became publicly active (again)
  expires_at timestamptz,            -- the end of its whole life; null while draft / pending
  promotion_id uuid,                 -- the paid promotion that set the current deadline; null = a free listing
  queued_hours integer not null default 0 check (queued_hours >= 0),   -- paid while waiting for moderation
  reject_reason text check (char_length(reject_reason) <= 300),
  warned_for timestamptz,            -- the deadline the "expires soon" notice was sent for (sent once per deadline)
  impressions integer not null default 0,
  sponsored_impressions integer not null default 0,
  views integer not null default 0,
  contacts integer not null default 0,
  favorites integer not null default 0,
  check (status not in ('active', 'expired') or (published_at is not null and expires_at is not null))
);
create index if not exists market_listings_live on public.market_listings (expires_at) where status = 'active';
create index if not exists market_listings_seller on public.market_listings (seller_id);
create index if not exists market_listings_cat on public.market_listings (category, published_at desc) where status = 'active';
alter table public.market_listings enable row level security;   -- no policy: every read and write goes through the functions below

-- the one definition of "public": everything that shows a listing to someone other than its seller asks this
create or replace function public.market_is_live(l public.market_listings) returns boolean
language sql stable security definer set search_path = public as $$
  select l.status = 'active' and l.expires_at is not null and l.expires_at > public.market_now();
$$;

-- ===================================================================== payments: orders, promotions (financial records)
create table if not exists public.market_orders (
  id uuid primary key,
  provider text not null check (provider in ('tbc', 'paypal')),
  provider_id text not null,
  seller_id uuid references auth.users on delete set null,
  listing_id uuid references public.market_listings on delete set null,
  package_id text not null references public.market_packages(id),
  amount numeric(12,2) not null check (amount > 0),
  currency text not null,
  status text not null default 'created' check (status in ('created', 'paid', 'failed', 'orphaned', 'refunded')),
  created_at timestamptz not null default now(),
  checked_at timestamptz,
  paid_at timestamptz,
  error text check (char_length(error) <= 300),
  unique (provider, provider_id)
);
create index if not exists market_orders_listing on public.market_orders (listing_id) where status = 'created';
alter table public.market_orders enable row level security;

create table if not exists public.market_promotions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.market_listings on delete set null,   -- kept after the listing is deleted
  seller_id uuid references auth.users on delete set null,
  package_id text not null references public.market_packages(id),
  hours integer not null check (hours > 0),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null,
  provider text not null check (provider in ('tbc', 'paypal', 'app_store', 'play_store')),
  payment_id text not null,
  -- queued: paid, waiting for moderation · applied: its hours are in the listing's deadline ·
  -- orphaned: paid, but the listing was gone or refused (to be refunded) · refunded
  status text not null check (status in ('queued', 'applied', 'orphaned', 'refunded')),
  effect text check (effect in ('publish', 'extend', 'replace_free')),
  paid_at timestamptz not null,
  applied_at timestamptz,
  ends_at timestamptz,
  refunded_at timestamptz,
  unique (provider, payment_id)
);
create index if not exists market_promotions_listing on public.market_promotions (listing_id);
alter table public.market_promotions enable row level security;
drop policy if exists "own promotions" on public.market_promotions;
create policy "own promotions" on public.market_promotions for select using (seller_id = auth.uid() or public.is_admin());

-- ===================================================================== around a listing
create table if not exists public.market_favorites (
  user_id uuid not null references auth.users on delete cascade,
  listing_id uuid not null references public.market_listings on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
alter table public.market_favorites enable row level security;

-- one count per viewer, listing, kind and day: a page opened ten times is one view
create table if not exists public.market_seen (
  listing_id uuid not null references public.market_listings on delete cascade,
  viewer text not null check (char_length(viewer) <= 80),
  kind text not null check (kind in ('impression', 'sponsored', 'view', 'contact')),
  day date not null,
  primary key (listing_id, viewer, kind, day)
);
alter table public.market_seen enable row level security;

create table if not exists public.market_messages (
  id bigint generated always as identity primary key,
  listing_id uuid not null references public.market_listings on delete cascade,
  buyer_id uuid not null references auth.users on delete cascade,
  sender uuid not null references auth.users on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists market_messages_thread on public.market_messages (listing_id, buyer_id, id);
alter table public.market_messages enable row level security;

create table if not exists public.market_reports (
  id bigint generated always as identity primary key,
  listing_id uuid references public.market_listings on delete set null,
  reporter uuid not null references auth.users on delete cascade,
  reason text not null check (reason in ('fake', 'spam', 'wrong', 'abuse', 'other')),
  status text not null default 'open' check (status in ('open', 'actioned', 'dismissed')),
  created_at timestamptz not null default now()
);
create unique index if not exists market_reports_one_open on public.market_reports (reporter, listing_id) where status = 'open';
alter table public.market_reports enable row level security;

-- ===================================================================== cleanup bookkeeping
-- files waiting to be deleted from the `market` bucket; a file is only ever queued under its own seller's folder
create table if not exists public.market_media_trash (
  id bigint generated always as identity primary key,
  path text not null unique check (char_length(path) <= 300),
  seller_id uuid not null,
  listing_id uuid,
  queued_at timestamptz not null default now(),
  tries integer not null default 0,
  next_try_at timestamptz not null default now(),
  last_error text check (char_length(last_error) <= 300),
  done_at timestamptz,
  check (split_part(path, '/', 1) = seller_id::text)
);
create index if not exists market_media_trash_due on public.market_media_trash (next_try_at) where done_at is null;
alter table public.market_media_trash enable row level security;

-- what is kept of a deleted listing: no text, no files — only what the administrator needs to see the job worked
create table if not exists public.market_expired_log (
  id bigint generated always as identity primary key,
  listing_id uuid not null,
  seller_id uuid,
  plan text,
  paid boolean not null default false,
  published_at timestamptz,
  expires_at timestamptz,
  deleted_at timestamptz not null default now(),
  reason text not null check (reason in ('expired', 'seller', 'admin', 'stale')),
  media integer not null default 0
);
create index if not exists market_expired_log_at on public.market_expired_log (deleted_at desc);
alter table public.market_expired_log enable row level security;

create table if not exists public.market_cleanup_runs (
  id bigint generated always as identity primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  deleted integer not null default 0,
  held integer not null default 0,
  failed integer not null default 0,
  warned integer not null default 0,
  error text check (char_length(error) <= 500)
);
alter table public.market_cleanup_runs enable row level security;

create table if not exists public.market_cleanup_errors (
  id bigint generated always as identity primary key,
  listing_id uuid,
  at timestamptz not null default now(),
  error text not null check (char_length(error) <= 500)
);
alter table public.market_cleanup_errors enable row level security;

-- ===================================================================== small helpers
create or replace function public.market_setting(k text) returns text
language sql stable security definer set search_path = public as $$
  select value from public.server_config where key = 'market_' || k;
$$;
create or replace function public.market_premoderate() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.market_setting('premoderate'), 'off') = 'on';
$$;

/** "23 hours", "2 days, 15 hours", "5 hours, 30 minutes" — in Georgian, a noun after a number stays singular */
create or replace function public.market_left(secs bigint, lang text) returns text
language plpgsql immutable set search_path = public as $$
declare en boolean := coalesce(lang, 'ka') <> 'ka'; d bigint; hh bigint; mm bigint; s bigint := greatest(secs, 0);
begin
  d := s / 86400; hh := (s % 86400) / 3600; mm := (s % 3600) / 60;
  if d > 0 then
    return case when en then d || ' day' || case when d = 1 then '' else 's' end || case when hh > 0 then ', ' || hh || ' hour' || case when hh = 1 then '' else 's' end else '' end
      else d || ' დღე' || case when hh > 0 then ', ' || hh || ' საათი' else '' end end;
  elsif hh > 0 then
    return case when en then hh || ' hour' || case when hh = 1 then '' else 's' end || case when mm > 0 then ', ' || mm || ' minute' || case when mm = 1 then '' else 's' end else '' end
      else hh || ' საათი' || case when mm > 0 then ', ' || mm || ' წუთი' else '' end end;
  end if;
  mm := greatest(mm, 1);
  return case when en then mm || ' minute' || case when mm = 1 then '' else 's' end else mm || ' წუთი' end;
end $$;

/** the marketplace's notifications, in the seller's language; the push function delivers them like Sima's */
create or replace function public.market_notify(target uuid, kind text, actor uuid, p jsonb, go text, tag text) returns bigint
language plpgsql security definer set search_path = public as $$
declare lg text; en boolean; ti text := left(coalesce(p->>'title', ''), 80); title text; body text; nid bigint;
  lft text := coalesce(p->>'left', '');
begin
  if target is null or (actor is not null and (actor = target or public.blocked_between(target, actor))) then return null; end if;
  select s.lang into lg from public.notify_settings s where s.user_id = target;
  en := coalesce(lg, 'ka') <> 'ka';
  case kind
    when 'market_active' then
      title := case when en then 'Marketplace · Your listing is live' else 'ბაზარი · განცხადება გამოქვეყნდა' end;
      body := case when en then '“' || ti || '” is now visible to buyers. Time left: ' || lft || '.' else '„' || ti || '“ უკვე ჩანს მყიდველებისთვის. დარჩენილია ' || lft || '.' end;
    when 'market_extended' then
      title := case when en then 'Marketplace · Advertisement extended' else 'ბაზარი · რეკლამა გაგრძელდა' end;
      body := case when en then '“' || ti || '” — time left: ' || lft || '.' else '„' || ti || '“ — დარჩენილია ' || lft || '.' end;
    when 'market_expiring' then
      title := case when en then 'Marketplace · Your listing expires soon' else 'ბაზარი · განცხადების ვადა იწურება' end;
      body := case when en then '“' || ti || '” will be deleted soon — time left: ' || lft || '. Extend it if you want it to stay.' else '„' || ti || '“ მალე წაიშლება — დარჩენილია ' || lft || '. თუ გინდა, რომ დარჩეს, გააგრძელე.' end;
    when 'market_expired' then
      title := case when en then 'Marketplace · Your listing has ended' else 'ბაზარი · განცხადების ვადა ამოიწურა' end;
      body := case when en then '“' || ti || '” has expired and was removed from the marketplace.' else '„' || ti || '“-ის ვადა ამოიწურა და ის ბაზრიდან წაიშალა.' end;
    when 'market_pending' then
      title := case when en then 'Marketplace · Waiting for review' else 'ბაზარი · განხილვას ელოდება' end;
      body := case when en then '“' || ti || '” is being checked. Its time starts only once it is published.' else '„' || ti || '“ მოწმდება. ვადის ათვლა დაიწყება მხოლოდ გამოქვეყნებისას.' end;
    when 'market_rejected' then
      title := case when en then 'Marketplace · Listing not published' else 'ბაზარი · განცხადება არ გამოქვეყნდა' end;
      body := case when en then '“' || ti || '” was not approved' else '„' || ti || '“ არ დამტკიცდა' end || coalesce(': ' || nullif(p->>'why', ''), '.');
    when 'market_removed' then
      title := case when en then 'Marketplace · Listing removed' else 'ბაზარი · განცხადება წაიშალა' end;
      body := case when en then '“' || ti || '” was removed by a moderator.' else '„' || ti || '“ მოდერატორმა წაშალა.' end;
    when 'market_message' then
      title := case when en then 'Marketplace · New message' else 'ბაზარი · ახალი წერილი' end;
      body := coalesce(nullif(p->>'name', ''), case when en then 'Someone' else 'ვიღაც' end) || ' · „' || ti || '“: ' || left(coalesce(p->>'s', ''), 120);
    else return null;
  end case;
  -- one unread notice per listing and kind: an older unread one is replaced
  delete from public.notifications n where n.user_id = target and n.tag = market_notify.tag and n.read_at is null;
  insert into public.notifications (user_id, kind, actor, params, title, body, go, tag)
    values (target, kind, actor, p, title, left(body, 300), go, tag) returning id into nid;
  return nid;
end $$;

create or replace function public.market_note(l public.market_listings, kind text, extra jsonb default '{}'::jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare lg text;
begin
  select s.lang into lg from public.notify_settings s where s.user_id = l.seller_id;
  perform public.market_notify(l.seller_id, kind, null,
    jsonb_build_object('title', l.title, 'id', l.id,
      'left', case when l.expires_at is not null then public.market_left(extract(epoch from l.expires_at - public.market_now())::bigint, coalesce(lg, 'ka')) else '' end) || coalesce(extra, '{}'::jsonb),
    case when kind = 'market_expiring' then 'market:promote:' || l.id when kind in ('market_expired', 'market_removed') then 'market:mine' else 'market:l:' || l.id end,
    'mk:' || l.id || ':' || case when kind in ('market_active', 'market_extended', 'market_pending') then 'state' else kind end);
end $$;

-- ===================================================================== the card a buyer sees
create or replace function public.market_card(l public.market_listings, full_view boolean default false) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'id', l.id, 'title', l.title, 'category', l.category, 'condition', l.condition, 'price', l.price, 'currency', l.currency,
    'negotiable', l.negotiable, 'city', l.city, 'photo', l.photos[1], 'photos', cardinality(l.photos),
    'video', l.video_path is not null, 'audio', l.audio_path is not null,
    'published_at', l.published_at, 'expires_at', l.expires_at,
    'sponsored', l.promotion_id is not null, 'package', case when l.promotion_id is not null then (select p.package_id from public.market_promotions p where p.id = l.promotion_id) end,
    -- a seller's name and photo are for signed-in members, as everywhere else in the community; a guest sees the listing only
    'seller', case when auth.uid() is null then jsonb_build_object('id', l.seller_id)
      else jsonb_build_object('id', l.seller_id, 'name', coalesce(nullif(pr.display_name, ''), '@' || pr.nickname, ''), 'nick', pr.nickname, 'avatar', pr.avatar_url) end)
  || case when full_view then jsonb_build_object('body', l.body, 'media', to_jsonb(l.photos), 'video_path', l.video_path, 'audio_path', l.audio_path, 'has_phone', l.phone is not null) else '{}'::jsonb end
  from (select 1) one left join public.profiles pr on pr.id = l.seller_id;
$$;

-- the rotation of paid listings: stable for ten minutes (paging stays consistent), then a new order
create or replace function public.market_rotation(id uuid) returns text
language sql stable set search_path = public as $$
  select md5(id::text || floor(extract(epoch from public.market_now()) / 600)::text);
$$;

/** search and browse. Organic results are every live listing in the order asked for — the sponsored places do not
    reorder them; they get their own sponsored places on top (`sponsored`), matched to the same filters */
create or replace function public.market_search(term text default '', cat text default null, place text default null,
  pmin numeric default null, pmax numeric default null, cond text default null, sort text default 'new', lim integer default 24, off integer default 0)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); q text := nullif(btrim(coalesce(term, '')), ''); items jsonb; sp jsonb;
begin
  lim := least(greatest(coalesce(lim, 24), 1), 60); off := greatest(coalesce(off, 0), 0);
  with f as (
    select l.* from public.market_listings l
    where public.market_is_live(l) and not public.blocked_between(me, l.seller_id)
      and (cat is null or l.category = cat) and (cond is null or l.condition = cond)
      and (place is null or l.city ilike place)
      and (pmin is null or l.price >= pmin) and (pmax is null or l.price <= pmax)
      and (q is null or l.title ilike '%' || q || '%' or l.body ilike '%' || q || '%' or l.city ilike '%' || q || '%'))
  select coalesce(jsonb_agg(public.market_card(l) order by x.ord1, x.ord2 desc), '[]'::jsonb) into items from (
    select f.id, case sort when 'price_asc' then coalesce(f.price, 1e12) when 'price_desc' then -coalesce(f.price, -1) when 'ending' then extract(epoch from f.expires_at) else 0 end as ord1,
      f.published_at as ord2
    from f order by ord1, ord2 desc limit lim offset off) x join public.market_listings l on l.id = x.id;
  if off = 0 then
    with f as (
      select l.* from public.market_listings l
      where public.market_is_live(l) and l.promotion_id is not null and not public.blocked_between(me, l.seller_id)
        and (cat is null or l.category = cat) and (cond is null or l.condition = cond)
        and (place is null or l.city ilike place)
        and (pmin is null or l.price >= pmin) and (pmax is null or l.price <= pmax)
        and (q is null or l.title ilike '%' || q || '%' or l.body ilike '%' || q || '%' or l.city ilike '%' || q || '%'))
    select coalesce(jsonb_agg(public.market_card(l) order by public.market_rotation(l.id)), '[]'::jsonb) into sp
      from (select f.id from f order by public.market_rotation(f.id) limit 3) x join public.market_listings l on l.id = x.id;
  end if;
  return jsonb_build_object('now', public.market_now(), 'items', items, 'sponsored', coalesce(sp, '[]'::jsonb));
end $$;

/** the sponsored carousel and the featured places: live paid listings only, in rotation */
create or replace function public.market_featured(cat text default null, lim integer default 10, skip uuid default null)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('now', public.market_now(), 'items', coalesce((
    select jsonb_agg(public.market_card(y) order by public.market_rotation(y.id)) from (
      select l.id from public.market_listings l
      where public.market_is_live(l) and l.promotion_id is not null and not public.blocked_between(auth.uid(), l.seller_id)
        and (cat is null or l.category = cat) and (skip is null or l.id <> skip)
      order by public.market_rotation(l.id) limit least(greatest(coalesce(lim, 10), 1), 30)) x join public.market_listings y on y.id = x.id), '[]'::jsonb));
$$;

/** one listing by its address: anyone while it is live; its seller and administrators also afterwards (until deleted) */
create or replace function public.market_get(listing uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings; mine boolean; c jsonb;
begin
  select * into l from public.market_listings x where x.id = listing;
  if not found then return null; end if;
  mine := me is not null and l.seller_id = me;
  if not (public.market_is_live(l) and not public.blocked_between(me, l.seller_id)) and not mine and not public.is_admin() then return null; end if;
  c := public.market_card(l, true) || jsonb_build_object('now', public.market_now(), 'mine', mine, 'status', l.status, 'live', public.market_is_live(l),
    'saved', me is not null and exists (select 1 from public.market_favorites f where f.user_id = me and f.listing_id = l.id));
  if mine or public.is_admin() then
    c := c || jsonb_build_object('stats', jsonb_build_object('impressions', l.impressions, 'sponsored_impressions', l.sponsored_impressions,
      'views', l.views, 'contacts', l.contacts, 'favorites', l.favorites), 'phone', l.phone, 'plan', l.plan, 'queued_hours', l.queued_hours, 'reject_reason', l.reject_reason);
  end if;
  return c;
end $$;

/** the seller's own listings, every state, with their numbers */
create or replace function public.market_mine() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('now', public.market_now(), 'items', coalesce((
    select jsonb_agg(public.market_card(l) || jsonb_build_object('status', l.status, 'live', public.market_is_live(l), 'plan', l.plan,
      'queued_hours', l.queued_hours, 'reject_reason', l.reject_reason, 'updated_at', l.updated_at,
      'awaiting_payment', exists (select 1 from public.market_orders o where o.listing_id = l.id and o.status = 'created' and o.created_at > public.market_now() - interval '2 hours'),
      'stats', jsonb_build_object('impressions', l.impressions, 'sponsored_impressions', l.sponsored_impressions, 'views', l.views, 'contacts', l.contacts, 'favorites', l.favorites))
      order by l.created_at desc)
    from public.market_listings l where l.seller_id = auth.uid()), '[]'::jsonb));
$$;

create or replace function public.market_saved() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('now', public.market_now(), 'items', coalesce((
    select jsonb_agg(public.market_card(l) order by f.created_at desc)
    from public.market_favorites f join public.market_listings l on l.id = f.listing_id
    where f.user_id = auth.uid() and public.market_is_live(l) and not public.blocked_between(auth.uid(), l.seller_id)), '[]'::jsonb));
$$;

create or replace function public.market_seller(target uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when auth.uid() is null or public.blocked_between(auth.uid(), target) or not exists (select 1 from public.profiles p where p.id = target) then null else
    jsonb_build_object('now', public.market_now(),
      'seller', (select jsonb_build_object('id', p.id, 'name', coalesce(nullif(p.display_name, ''), '@' || p.nickname, ''), 'nick', p.nickname, 'avatar', p.avatar_url, 'since', p.created_at) from public.profiles p where p.id = target),
      'items', coalesce((select jsonb_agg(public.market_card(l) order by l.published_at desc) from public.market_listings l where l.seller_id = target and public.market_is_live(l)), '[]'::jsonb))
  end;
$$;

-- ===================================================================== writing a listing
create or replace function public.market_save(listing uuid, f jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings; new_id uuid; pl text := coalesce(nullif(f->>'plan', ''), 'ad24');
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if public.community_banned(me) then raise exception 'banned'; end if;
  if public.has_objectionable_text(coalesce(f->>'title', '') || ' ' || coalesce(f->>'body', '') || ' ' || coalesce(f->>'city', '')) then raise exception 'objectionable-content'; end if;
  if not exists (select 1 from public.market_packages p where p.id = pl and p.kind = 'ad' and p.active) then raise exception 'invalid-package'; end if;
  if listing is null then
    if (select count(*) from public.market_listings x where x.seller_id = me and x.created_at > public.market_now() - interval '1 day') >= 20 then raise exception 'slow-down'; end if;
    insert into public.market_listings (seller_id, title, body, category, condition, price, currency, negotiable, city, phone, plan, created_at, updated_at)
    values (me, btrim(f->>'title'), btrim(coalesce(f->>'body', '')), f->>'category', f->>'condition', nullif(f->>'price', '')::numeric,
      coalesce(nullif(f->>'currency', ''), 'GEL'), coalesce((f->>'negotiable')::boolean, false), btrim(coalesce(f->>'city', '')),
      nullif(btrim(coalesce(f->>'phone', '')), ''), pl, public.market_now(), public.market_now())
    returning market_listings.id into new_id;
    return new_id;
  end if;
  select * into l from public.market_listings x where x.id = listing and x.seller_id = me for update;
  if not found then raise exception 'not-found'; end if;
  if l.status in ('expired', 'rejected') or (l.status = 'active' and not public.market_is_live(l)) then raise exception 'listing-expired'; end if;
  update public.market_listings x set title = btrim(f->>'title'), body = btrim(coalesce(f->>'body', '')), category = f->>'category', condition = f->>'condition',
    price = nullif(f->>'price', '')::numeric, currency = coalesce(nullif(f->>'currency', ''), 'GEL'), negotiable = coalesce((f->>'negotiable')::boolean, false),
    city = btrim(coalesce(f->>'city', '')), phone = nullif(btrim(coalesce(f->>'phone', '')), ''),
    plan = case when l.status = 'draft' then pl else l.plan end, updated_at = public.market_now()
  where x.id = listing;
  return listing;
end $$;

/** the files of a listing: only paths under <seller>/<listing>/ in the `market` bucket; files no longer used go to the trash */
create or replace function public.market_set_media(listing uuid, photo_paths text[], video text default null, audio text default null) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings; pre text; p text; keep text[];
begin
  if me is null then raise exception 'not-authenticated'; end if;
  select * into l from public.market_listings x where x.id = listing and x.seller_id = me for update;
  if not found then raise exception 'not-found'; end if;
  if l.status in ('expired', 'rejected') or (l.status = 'active' and not public.market_is_live(l)) then raise exception 'listing-expired'; end if;
  pre := me::text || '/' || listing::text || '/';
  photo_paths := coalesce(photo_paths, '{}');
  if cardinality(photo_paths) > 8 then raise exception 'too-many-photos'; end if;
  foreach p in array photo_paths || array_remove(array[video, audio], null) loop
    if left(p, char_length(pre)) <> pre or p ~ '\.\.' or char_length(p) > 300 then raise exception 'not-your-file'; end if;
  end loop;
  keep := photo_paths || array_remove(array[video, audio], null);
  insert into public.market_media_trash (path, seller_id, listing_id)
    select x, me, listing from unnest(l.photos || array_remove(array[l.video_path, l.audio_path], null)) x where not (x = any (keep))
    on conflict (path) do nothing;
  update public.market_listings x set photos = photo_paths, video_path = video, audio_path = audio, updated_at = public.market_now() where x.id = listing;
end $$;

-- the moment a listing becomes public: its time starts here and nowhere else
create or replace function public.market_go_live(listing uuid, hrs integer, promo uuid) returns public.market_listings
language plpgsql security definer set search_path = public as $$
declare l public.market_listings; nw timestamptz := public.market_now();
begin
  update public.market_listings x set status = 'active', published_at = nw, expires_at = nw + make_interval(hours => hrs),
    promotion_id = promo, queued_hours = 0, warned_for = null, reject_reason = null, updated_at = nw
  where x.id = listing returning * into l;
  perform public.market_note(l, 'market_active');
  return l;
end $$;

-- there is no free listing any more: a listing is published only by a verified payment (market_apply_payment)
drop function if exists public.market_submit(uuid);

create or replace function public.market_delete(listing uuid) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings;
begin
  select * into l from public.market_listings x where x.id = listing and x.seller_id = me for update;
  if not found then raise exception 'not-found'; end if;
  perform public.market_destroy(l, 'seller');
end $$;

/** the one place a listing row is deleted: its files are queued for the Storage API, a line is kept for the log */
create or replace function public.market_destroy(l public.market_listings, why text) returns void
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  insert into public.market_media_trash (path, seller_id, listing_id)
    select x, l.seller_id, l.id from unnest(l.photos || array_remove(array[l.video_path, l.audio_path], null)) x
    where split_part(x, '/', 1) = l.seller_id::text
    on conflict (path) do nothing;
  get diagnostics n = row_count;
  insert into public.market_expired_log (listing_id, seller_id, plan, paid, published_at, expires_at, reason, media)
    values (l.id, l.seller_id, l.plan, l.promotion_id is not null or exists (select 1 from public.market_promotions p where p.listing_id = l.id and p.status = 'applied'),
      l.published_at, l.expires_at, why, n);
  delete from public.market_listings x where x.id = l.id;
end $$;

-- ===================================================================== buyers
create or replace function public.market_favorite(listing uuid, keep boolean default true) returns boolean
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings; n integer;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  select * into l from public.market_listings x where x.id = listing;
  if keep then
    if not found or not public.market_is_live(l) then raise exception 'not-found'; end if;
    insert into public.market_favorites (user_id, listing_id) values (me, listing) on conflict do nothing;
  else
    delete from public.market_favorites f where f.user_id = me and f.listing_id = listing;
  end if;
  get diagnostics n = row_count;
  if n > 0 and found then update public.market_listings x set favorites = greatest(0, x.favorites + case when keep then 1 else -1 end) where x.id = listing; end if;
  return keep;
end $$;

/** impressions (a card on screen), sponsored impressions, views (the page opened). One per viewer and day. */
create or replace function public.market_track(ids uuid[], what text, device text default null) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); who text; d date := (public.market_now() at time zone 'Asia/Tbilisi')::date; i uuid; n integer;
begin
  if what not in ('impression', 'sponsored', 'view') or ids is null then return; end if;
  who := coalesce(me::text, 'd:' || left(nullif(regexp_replace(coalesce(device, ''), '[^a-zA-Z0-9-]', '', 'g'), ''), 40));
  if who is null then return; end if;
  foreach i in array ids[1:60] loop
    insert into public.market_seen (listing_id, viewer, kind, day)
      select l.id, who, what, d from public.market_listings l where l.id = i and public.market_is_live(l) and (me is null or l.seller_id <> me)
      on conflict do nothing;
    get diagnostics n = row_count;
    if n > 0 then
      update public.market_listings x set impressions = x.impressions + (what = 'impression')::int, sponsored_impressions = x.sponsored_impressions + (what = 'sponsored')::int,
        views = x.views + (what = 'view')::int where x.id = i;
    end if;
  end loop;
end $$;

/** the seller's phone, for a signed-in buyer; counted once a day as a contact */
create or replace function public.market_contact(listing uuid) returns text
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings; n integer;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  select * into l from public.market_listings x where x.id = listing;
  if not found or not public.market_is_live(l) or public.blocked_between(me, l.seller_id) then raise exception 'not-found'; end if;
  if l.seller_id <> me then
    insert into public.market_seen (listing_id, viewer, kind, day) values (l.id, me::text, 'contact', (public.market_now() at time zone 'Asia/Tbilisi')::date) on conflict do nothing;
    get diagnostics n = row_count;
    if n > 0 then update public.market_listings x set contacts = x.contacts + 1 where x.id = l.id; end if;
  end if;
  return l.phone;
end $$;

/** a message about a listing. A buyer writes to the seller; the seller answers a buyer's thread. */
create or replace function public.market_send(listing uuid, body text, buyer uuid default null) returns bigint
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings; b uuid; other uuid; mid bigint; n integer; t text := btrim(coalesce(body, ''));
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if public.community_banned(me) then raise exception 'banned'; end if;
  if t = '' or char_length(t) > 1000 then raise exception 'invalid-message'; end if;
  if public.has_objectionable_text(t) then raise exception 'objectionable-content'; end if;
  select * into l from public.market_listings x where x.id = listing;
  if not found or not public.market_is_live(l) then raise exception 'not-found'; end if;
  if l.seller_id = me then
    if buyer is null or not exists (select 1 from public.market_messages m where m.listing_id = listing and m.buyer_id = buyer) then raise exception 'not-found'; end if;
    b := buyer; other := buyer;
  else b := me; other := l.seller_id; end if;
  if public.blocked_between(me, other) then raise exception 'not-found'; end if;
  if (select count(*) from public.market_messages m where m.sender = me and m.created_at > now() - interval '1 minute') >= 10 then raise exception 'slow-down'; end if;
  insert into public.market_messages (listing_id, buyer_id, sender, body) values (listing, b, me, t) returning id into mid;
  if l.seller_id <> me then
    insert into public.market_seen (listing_id, viewer, kind, day) values (l.id, me::text, 'contact', (public.market_now() at time zone 'Asia/Tbilisi')::date) on conflict do nothing;
    get diagnostics n = row_count;
    if n > 0 then update public.market_listings x set contacts = x.contacts + 1 where x.id = l.id; end if;
  end if;
  perform public.market_notify(other, 'market_message', me, jsonb_build_object('title', l.title, 'name', public.display_of(me), 's', left(t, 120)),
    'market:t:' || listing || ':' || b, 'mkm:' || listing || ':' || b);
  return mid;
end $$;

create or replace function public.market_threads() returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x order by x->>'at' desc), '[]'::jsonb) from (
    select jsonb_build_object('listing', l.id, 'title', l.title, 'photo', l.photos[1], 'buyer', t.buyer_id,
      'other', case when l.seller_id = auth.uid() then t.buyer_id else l.seller_id end,
      'other_name', public.display_of(case when l.seller_id = auth.uid() then t.buyer_id else l.seller_id end),
      'selling', l.seller_id = auth.uid(), 'last', left(t.body, 120), 'at', t.created_at,
      'unread', (select count(*) from public.market_messages u where u.listing_id = l.id and u.buyer_id = t.buyer_id and u.sender <> auth.uid() and u.read_at is null)) x
    from (select distinct on (m.listing_id, m.buyer_id) m.* from public.market_messages m order by m.listing_id, m.buyer_id, m.id desc) t
    join public.market_listings l on l.id = t.listing_id
    where (t.buyer_id = auth.uid() or l.seller_id = auth.uid()) and not public.blocked_between(t.buyer_id, l.seller_id)) y;
$$;

create or replace function public.market_thread(listing uuid, buyer uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings;
begin
  select * into l from public.market_listings x where x.id = listing;
  if not found or (me <> buyer and me <> l.seller_id) then raise exception 'not-found'; end if;
  update public.market_messages m set read_at = now() where m.listing_id = listing and m.buyer_id = buyer and m.sender <> me and m.read_at is null;
  return coalesce((select jsonb_agg(jsonb_build_object('id', m.id, 'mine', m.sender = me, 'body', m.body, 'at', m.created_at) order by m.id)
    from public.market_messages m where m.listing_id = listing and m.buyer_id = buyer), '[]'::jsonb);
end $$;

create or replace function public.market_report(listing uuid, why text) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); l public.market_listings;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  select * into l from public.market_listings x where x.id = listing;
  if not found or not public.market_is_live(l) then raise exception 'not-found'; end if;
  if l.seller_id = me then raise exception 'own-content'; end if;
  insert into public.market_reports (listing_id, reporter, reason) values (listing, me, why) on conflict (reporter, listing_id) where status = 'open' do nothing;
end $$;

-- ===================================================================== payments (service role only: the `market` Edge Function)
/** may this seller pay for this package on this listing now? Raises the reason when not. Answers the price. */
create or replace function public.market_order_check(seller uuid, listing uuid, pkg text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare l public.market_listings; p public.market_packages;
begin
  select * into p from public.market_packages x where x.id = pkg and x.kind = 'ad' and x.active;
  if not found then raise exception 'invalid-package'; end if;
  if public.community_banned(seller) then raise exception 'banned'; end if;
  select * into l from public.market_listings x where x.id = listing and x.seller_id = seller;
  if not found then raise exception 'not-found'; end if;
  if l.status in ('expired', 'rejected') or (l.status = 'active' and not public.market_is_live(l)) then raise exception 'listing-expired'; end if;
  if l.status = 'draft' and cardinality(l.photos) < 1 then raise exception 'photo-required'; end if;
  return to_jsonb(p) || jsonb_build_object('listing_status', l.status, 'charge_minor', public.market_price_minor(p));
end $$;

/** a verified payment's time, applied. Locks the listing, so it cannot meet the cleanup half-way.
    Answers what happened: publish · extend · replace_free · queued · orphaned · duplicate */
create or replace function public.market_apply_payment(pv text, pay text, seller uuid, listing uuid, pkg text, paid_amount numeric, paid_currency text)
returns text language plpgsql security definer set search_path = public as $$
declare l public.market_listings; p public.market_packages; promo uuid; nw timestamptz := public.market_now(); eff text; ends timestamptz; got boolean;
begin
  select * into p from public.market_packages x where x.id = pkg and x.kind = 'ad';
  if not found then raise exception 'invalid-package'; end if;
  -- the listing first, then the payment: every payment for one listing waits here for the one before it
  select * into l from public.market_listings x where x.id = listing for update;
  got := found;
  if exists (select 1 from public.market_promotions x where x.provider = pv and x.payment_id = pay) then return 'duplicate'; end if;
  if not got or l.seller_id is distinct from seller or l.status = 'rejected' then
    insert into public.market_promotions (listing_id, seller_id, package_id, hours, amount, currency, provider, payment_id, status, paid_at)
      values (case when l.id is not null and l.seller_id = seller then l.id end, seller, pkg, p.hours, paid_amount, paid_currency, pv, pay, 'orphaned', nw);
    return 'orphaned';
  end if;
  promo := gen_random_uuid();
  if l.status = 'pending' or (l.status = 'draft' and public.market_premoderate()) then
    insert into public.market_promotions (id, listing_id, seller_id, package_id, hours, amount, currency, provider, payment_id, status, effect, paid_at)
      values (promo, l.id, seller, pkg, p.hours, paid_amount, paid_currency, pv, pay, 'queued', 'publish', nw);
    update public.market_listings x set status = 'pending', queued_hours = x.queued_hours + p.hours, plan = case when x.status = 'draft' then pkg else x.plan end, updated_at = nw
      where x.id = l.id returning * into l;
    perform public.market_note(l, 'market_pending');
    return 'queued';
  end if;
  if public.market_is_live(l) and l.promotion_id is not null then
    eff := 'extend'; ends := l.expires_at + make_interval(hours => p.hours);           -- paid time is kept, the new time is added
  elsif public.market_is_live(l) then
    eff := 'replace_free'; ends := nw + make_interval(hours => p.hours);               -- the package's deadline replaces the free one
  else
    eff := 'publish'; ends := nw + make_interval(hours => p.hours);                    -- a draft (or a listing held for this payment)
  end if;
  insert into public.market_promotions (id, listing_id, seller_id, package_id, hours, amount, currency, provider, payment_id, status, effect, paid_at, applied_at, ends_at)
    values (promo, l.id, seller, pkg, p.hours, paid_amount, paid_currency, pv, pay, 'applied', eff, nw, nw, ends);
  if eff = 'publish' then
    update public.market_listings x set plan = case when x.status = 'draft' then pkg else x.plan end where x.id = l.id;
    perform public.market_go_live(l.id, p.hours, promo);
  else
    update public.market_listings x set expires_at = ends, promotion_id = promo, warned_for = null, updated_at = nw where x.id = l.id returning * into l;
    perform public.market_note(l, 'market_extended');
  end if;
  return eff;
end $$;

/** a web order (TBC / PayPal), after the Edge Function has fetched it from the provider and found it paid */
create or replace function public.market_fulfill_order(pv text, provider_ref text) returns text
language plpgsql security definer set search_path = public as $$
declare o public.market_orders; r text;
begin
  select * into o from public.market_orders x where x.provider = pv and x.provider_id = provider_ref for update;
  if not found then raise exception 'unknown order'; end if;
  if o.status in ('paid', 'orphaned', 'refunded') then return 'duplicate'; end if;
  r := public.market_apply_payment(pv, provider_ref, o.seller_id, o.listing_id, o.package_id, o.amount, o.currency);
  update public.market_orders x set status = case when r = 'orphaned' then 'orphaned' else 'paid' end, paid_at = coalesce(x.paid_at, public.market_now()), checked_at = now(), error = null
    where x.id = o.id;
  return r;
end $$;

create or replace function public.market_order_failed(pv text, provider_ref text, why text) returns void
language sql security definer set search_path = public as $$
  update public.market_orders x set status = 'failed', checked_at = now(), error = left(why, 300)
  where x.provider = pv and x.provider_id = provider_ref and x.status = 'created';
$$;

/** a refund (from the provider, or recorded by the owner): the paid hours come off the listing's deadline */
create or replace function public.market_refund(pv text, pay text) returns text
language plpgsql security definer set search_path = public as $$
declare pr public.market_promotions; l public.market_listings; nw timestamptz := public.market_now();
begin
  select * into pr from public.market_promotions x where x.provider = pv and x.payment_id = pay;
  if not found then return 'unknown'; end if;
  if pr.listing_id is not null then select * into l from public.market_listings x where x.id = pr.listing_id for update; end if;
  select * into pr from public.market_promotions x where x.id = pr.id for update;
  if pr.status = 'refunded' then return 'duplicate'; end if;
  if pr.status = 'applied' and l.id is not null then
    update public.market_listings x set expires_at = greatest(nw, x.expires_at - make_interval(hours => pr.hours)),
      promotion_id = case when x.promotion_id = pr.id then (select y.id from public.market_promotions y where y.listing_id = x.id and y.status = 'applied' and y.id <> pr.id order by y.applied_at desc limit 1) else x.promotion_id end,
      warned_for = null, updated_at = nw where x.id = l.id;
  elsif pr.status = 'queued' and l.id is not null then
    update public.market_listings x set queued_hours = greatest(0, x.queued_hours - pr.hours), updated_at = nw where x.id = l.id;
  end if;
  update public.market_promotions x set status = 'refunded', refunded_at = nw where x.id = pr.id;
  update public.market_orders o set status = 'refunded' where o.provider = pv and o.provider_id = pay;
  return 'refunded';
end $$;

-- ===================================================================== the schedule: expire, warn, delete
create or replace function public.market_expire() returns jsonb
language plpgsql security definer set search_path = public as $$
declare nw timestamptz := public.market_now(); l public.market_listings; run bigint; n_del integer := 0; n_held integer := 0; n_bad integer := 0; n_warn integer := 0;
  was_live boolean;
begin
  insert into public.market_cleanup_runs (started_at) values (now()) returning id into run;
  -- 1 · warn once per deadline: 3 hours before for listings that live 3 days or less, a day before for longer ones
  for l in select * from public.market_listings x
      where x.status = 'active' and x.expires_at > nw and x.warned_for is distinct from x.expires_at
        and x.expires_at - nw <= case when x.expires_at - x.published_at <= interval '72 hours' then interval '3 hours' else interval '24 hours' end
        and x.expires_at - x.published_at > interval '6 hours'
      for update skip locked loop
    perform public.market_note(l, 'market_expiring');
    update public.market_listings x set warned_for = l.expires_at where x.id = l.id;
    n_warn := n_warn + 1;
  end loop;
  -- 2 · delete what has ended (and drafts / refused listings nobody touched for a week)
  for l in select * from public.market_listings x
      where (x.status in ('active', 'expired') and x.expires_at <= nw)
         or (x.status in ('draft', 'rejected') and x.updated_at < nw - interval '7 days')
      order by x.expires_at nulls last limit 500
      for update skip locked loop
    begin
      -- a payment in flight, or paid time not yet used: hidden (it has expired), but not deleted
      if exists (select 1 from public.market_orders o where o.listing_id = l.id and o.status = 'created' and o.created_at > nw - interval '2 hours')
         or exists (select 1 from public.market_promotions p where p.listing_id = l.id and p.status = 'queued') then
        if l.status = 'active' then update public.market_listings x set status = 'expired' where x.id = l.id; end if;
        n_held := n_held + 1;
        continue;
      end if;
      was_live := l.status in ('active', 'expired');
      perform public.market_destroy(l, case when was_live then 'expired' else 'stale' end);
      if was_live then
        perform public.market_notify(l.seller_id, 'market_expired', null, jsonb_build_object('title', l.title, 'id', l.id), 'market:mine', 'mk:' || l.id || ':market_expired');
      end if;
      n_del := n_del + 1;
    exception when others then
      n_bad := n_bad + 1;
      insert into public.market_cleanup_errors (listing_id, error) values (l.id, left(sqlstate || ' ' || sqlerrm, 500));
    end;
  end loop;
  delete from public.market_seen s where s.day < (nw at time zone 'Asia/Tbilisi')::date - 2;
  delete from public.market_cleanup_runs r where r.started_at < now() - interval '30 days';
  delete from public.market_cleanup_errors e where e.at < now() - interval '90 days';
  update public.market_cleanup_runs r set finished_at = now(), deleted = n_del, held = n_held, failed = n_bad, warned = n_warn where r.id = run;
  return jsonb_build_object('deleted', n_del, 'held', n_held, 'failed', n_bad, 'warned', n_warn);
exception when others then
  -- the run itself failed: it is written down and the next minute tries again
  insert into public.market_cleanup_runs (started_at, finished_at, error) values (now(), now(), left(sqlstate || ' ' || sqlerrm, 500));
  return jsonb_build_object('error', sqlerrm);
end $$;

/** for the `market` Edge Function: files due for deletion (tried at most 8 times, waiting longer after each failure) */
create or replace function public.market_media_due(lim integer default 200) returns setof public.market_media_trash
language sql security definer set search_path = public as $$
  select * from public.market_media_trash t where t.done_at is null and t.tries < 8 and t.next_try_at <= now() order by t.id limit least(greatest(lim, 1), 1000);
$$;
create or replace function public.market_media_result(ids bigint[], ok boolean, err text default null) returns void
language sql security definer set search_path = public as $$
  update public.market_media_trash t set
    done_at = case when ok then now() end, tries = t.tries + case when ok then 0 else 1 end,
    next_try_at = case when ok then t.next_try_at else now() + make_interval(mins => (power(2, least(t.tries, 9)))::int * 5) end,
    last_error = case when ok then null else left(err, 300) end
  where t.id = any (ids) and t.done_at is null;
$$;

-- uploads no listing uses (an abandoned form), a day old: queued like any other file
do $$ begin
  if to_regclass('storage.objects') is not null then
    execute $f$
      create or replace function public.market_queue_orphans() returns integer
      language plpgsql security definer set search_path = public as $q$
      declare n integer;
      begin
        insert into public.market_media_trash (path, seller_id)
          select o.name, split_part(o.name, '/', 1)::uuid from storage.objects o
          where o.bucket_id = 'market' and o.created_at < now() - interval '1 day'
            and split_part(o.name, '/', 1) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            and not exists (select 1 from public.market_listings l where o.name = any (l.photos) or o.name = l.video_path or o.name = l.audio_path)
          order by o.created_at limit 500
          on conflict (path) do nothing;
        get diagnostics n = row_count;
        return n;
      end $q$ $f$;
  else
    create or replace function public.market_queue_orphans() returns integer language sql as 'select 0';
  end if;
end $$;

/** the database asks the `market` Edge Function to delete the queued files (pg_net, the same secret as push) */
create or replace function public.market_media_kick() returns void
language plpgsql security definer set search_path = public as $$
declare url text; secret text;
begin
  perform public.market_queue_orphans();
  if to_regnamespace('net') is null then return; end if;
  if not exists (select 1 from public.market_media_trash t where t.done_at is null and t.tries < 8 and t.next_try_at <= now()) then return; end if;
  select value into url from public.server_config where key = 'market_url';
  secret := public.push_hook_secret();
  if url is null or secret is null then return; end if;
  execute 'select net.http_post(url := $1, body := $2, headers := $3, timeout_milliseconds := 30000)'
    using url, '{"sweep": true}'::jsonb, jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', secret);
end $$;

-- ===================================================================== administration
create or replace function public.market_admin_overview() returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare nw timestamptz := public.market_now();
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  return jsonb_build_object(
    'now', nw,
    'premoderate', public.market_premoderate(),
    'packages', (select jsonb_agg(to_jsonb(p) || jsonb_build_object(
        'sold', (select count(*) from public.market_promotions x where x.package_id = p.id and x.status in ('applied', 'queued')),
        'revenue', (select coalesce(sum(x.amount), 0) from public.market_promotions x where x.package_id = p.id and x.status in ('applied', 'queued') and x.currency = 'GEL'),
        'active', (select count(*) from public.market_listings l join public.market_promotions x on x.id = l.promotion_id where x.package_id = p.id and public.market_is_live(l))) order by p.sort)
      from public.market_packages p),
    'revenue', (select coalesce(jsonb_object_agg(c, s), '{}'::jsonb) from (select x.currency c, sum(x.amount) s from public.market_promotions x where x.status in ('applied', 'queued') group by x.currency) r),
    'refunded', (select count(*) from public.market_promotions x where x.status = 'refunded'),
    'counts', jsonb_build_object(
      'active_ads', (select count(*) from public.market_listings l where public.market_is_live(l) and l.promotion_id is not null),
      'active_free', (select count(*) from public.market_listings l where public.market_is_live(l) and l.promotion_id is null),
      'pending', (select count(*) from public.market_listings l where l.status = 'pending'),
      'drafts', (select count(*) from public.market_listings l where l.status = 'draft'),
      'held', (select count(*) from public.market_listings l where l.status in ('active', 'expired') and l.expires_at <= nw),
      'expiring_24h', (select count(*) from public.market_listings l where public.market_is_live(l) and l.expires_at <= nw + interval '24 hours'),
      'deleted_30d', (select count(*) from public.market_expired_log g where g.deleted_at > now() - interval '30 days'),
      'open_reports', (select count(*) from public.market_reports r where r.status = 'open')),
    'expiring', coalesce((select jsonb_agg(jsonb_build_object('id', l.id, 'title', l.title, 'expires_at', l.expires_at, 'paid', l.promotion_id is not null) order by l.expires_at)
      from (select * from public.market_listings l where public.market_is_live(l) and l.expires_at <= nw + interval '24 hours' order by l.expires_at limit 30) l), '[]'::jsonb),
    'pending', coalesce((select jsonb_agg(public.market_card(l, true) || jsonb_build_object('queued_hours', l.queued_hours) order by l.updated_at)
      from public.market_listings l where l.status = 'pending'), '[]'::jsonb),
    'history', coalesce((select jsonb_agg(to_jsonb(g) order by g.deleted_at desc) from (select * from public.market_expired_log g order by g.deleted_at desc limit 50) g), '[]'::jsonb),
    'cleanup', jsonb_build_object(
      'last_run', (select to_jsonb(r) from public.market_cleanup_runs r order by r.id desc limit 1),
      'runs_24h', (select count(*) from public.market_cleanup_runs r where r.started_at > now() - interval '24 hours'),
      'failed_runs_24h', (select count(*) from public.market_cleanup_runs r where r.started_at > now() - interval '24 hours' and (r.error is not null or r.failed > 0)),
      'errors', coalesce((select jsonb_agg(to_jsonb(e) order by e.at desc) from (select * from public.market_cleanup_errors e order by e.at desc limit 20) e), '[]'::jsonb),
      'media_waiting', (select count(*) from public.market_media_trash t where t.done_at is null and t.tries < 8),
      'media_failed', (select count(*) from public.market_media_trash t where t.done_at is null and t.tries >= 8),
      'media_errors', coalesce((select jsonb_agg(jsonb_build_object('path', t.path, 'tries', t.tries, 'error', t.last_error, 'next', t.next_try_at)) from (select * from public.market_media_trash t where t.done_at is null and t.tries > 0 order by t.tries desc limit 20) t), '[]'::jsonb),
      'media_deleted_30d', (select count(*) from public.market_media_trash t where t.done_at > now() - interval '30 days')),
    'payments', jsonb_build_object(
      'orders', (select coalesce(jsonb_object_agg(s, n), '{}'::jsonb) from (select o.status s, count(*) n from public.market_orders o group by o.status) x),
      'stale', coalesce((select jsonb_agg(jsonb_build_object('id', o.id, 'provider', o.provider, 'package', o.package_id, 'amount', o.amount, 'currency', o.currency, 'created_at', o.created_at, 'error', o.error) order by o.created_at desc)
        from (select * from public.market_orders o where o.status in ('created', 'failed') and o.created_at < now() - interval '1 hour' order by o.created_at desc limit 20) o), '[]'::jsonb),
      'orphaned', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'provider', p.provider, 'payment', p.payment_id, 'package', p.package_id, 'amount', p.amount, 'currency', p.currency, 'paid_at', p.paid_at) order by p.paid_at desc)
        from public.market_promotions p where p.status = 'orphaned'), '[]'::jsonb),
      'recent', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'provider', p.provider, 'package', p.package_id, 'amount', p.amount, 'currency', p.currency, 'status', p.status, 'effect', p.effect, 'paid_at', p.paid_at, 'ends_at', p.ends_at) order by p.paid_at desc)
        from (select * from public.market_promotions p order by p.paid_at desc limit 30) p), '[]'::jsonb)),
    'reports', coalesce((select jsonb_agg(jsonb_build_object('id', r.id, 'listing', r.listing_id, 'title', l.title, 'reason', r.reason, 'at', r.created_at) order by r.created_at)
      from public.market_reports r left join public.market_listings l on l.id = r.listing_id where r.status = 'open'), '[]'::jsonb));
end $$;

/** prices and availability of the packages: the owner only. A package's length cannot be changed (the table refuses it). */
create or replace function public.market_admin_package(pkg text, price_gel numeric, is_active boolean, pp_value text default null, pp_currency text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'not-allowed'; end if;
  if pkg = 'free' then raise exception 'invalid-package'; end if;
  if price_gel is null or price_gel <= 0 or price_gel > 10000 then raise exception 'invalid-price'; end if;
  if exists (select 1 from public.market_packages p where p.id = pkg and p.sale_minor is not null and p.sale_minor >= round(price_gel * 100)) then raise exception 'sale-not-lower'; end if;
  update public.market_packages p set price_minor = round(price_gel * 100)::int, active = is_active,
    paypal_value = nullif(pp_value, ''), paypal_currency = case when nullif(pp_value, '') is null then null else pp_currency end,
    updated_at = now(), updated_by = auth.uid()
  where p.id = pkg and p.kind = 'ad';
  if not found then raise exception 'invalid-package'; end if;
end $$;

/** a sale on one package: its price (GEL, and optionally PayPal's), until when. until null: the sale ends now. The owner only. */
create or replace function public.market_owner_sale(pkg text, sale_gel numeric, pp_sale text, until timestamptz) returns void
language plpgsql security definer set search_path = public as $$
declare p public.market_packages;
begin
  if not public.is_owner() then raise exception 'not-allowed'; end if;
  select * into p from public.market_packages x where x.id = pkg and x.kind = 'ad' for update;
  if not found then raise exception 'invalid-package'; end if;
  if until is not null then
    if until <= public.market_now() or until > public.market_now() + interval '366 days' then raise exception 'invalid-date'; end if;
    if sale_gel is null or round(sale_gel * 100) <= 0 or round(sale_gel * 100) >= p.price_minor then raise exception 'sale-not-lower'; end if;
    if nullif(pp_sale, '') is not null and (pp_sale !~ '^[0-9]+\.[0-9]{2}$' or p.paypal_value is null or pp_sale::numeric >= p.paypal_value::numeric) then raise exception 'sale-not-lower'; end if;
  end if;
  update public.market_packages x set sale_minor = case when sale_gel is null then x.sale_minor else round(sale_gel * 100)::int end,
    paypal_sale_value = case when until is null and nullif(pp_sale, '') is null then x.paypal_sale_value else nullif(pp_sale, '') end,
    sale_until = until, updated_at = now(), updated_by = auth.uid()
  where x.id = pkg;
end $$;

create or replace function public.market_admin_premoderate(turn_on boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  insert into public.server_config (key, value) values ('market_premoderate', case when turn_on then 'on' else 'off' end)
    on conflict (key) do update set value = excluded.value;
end $$;

/** approve: published now, with the paid time that waited; its time starts at this moment */
create or replace function public.market_admin_review(listing uuid, approve boolean, why text default null) returns void
language plpgsql security definer set search_path = public as $$
declare l public.market_listings; hrs integer; promo uuid; nw timestamptz := public.market_now();
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  select * into l from public.market_listings x where x.id = listing and x.status = 'pending' for update;
  if not found then raise exception 'not-found'; end if;
  if approve then
    select p.id into promo from public.market_promotions p where p.listing_id = l.id and p.status = 'queued' order by p.paid_at desc limit 1;
    hrs := l.queued_hours;
    if hrs <= 0 then raise exception 'nothing-paid'; end if;
    update public.market_promotions p set status = 'applied', applied_at = nw, ends_at = nw + make_interval(hours => hrs) where p.listing_id = l.id and p.status = 'queued';
    perform public.market_go_live(l.id, hrs, promo);
  else
    update public.market_promotions p set status = 'orphaned' where p.listing_id = l.id and p.status = 'queued';   -- paid: to be refunded
    update public.market_listings x set status = 'rejected', queued_hours = 0, reject_reason = left(nullif(btrim(coalesce(why, '')), ''), 300), updated_at = nw where x.id = l.id returning * into l;
    perform public.market_note(l, 'market_rejected', jsonb_build_object('why', coalesce(l.reject_reason, '')));
  end if;
end $$;

create or replace function public.market_admin_remove(listing uuid, report_id bigint default null) returns void
language plpgsql security definer set search_path = public as $$
declare l public.market_listings;
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  select * into l from public.market_listings x where x.id = listing for update;
  if found then
    perform public.market_destroy(l, 'admin');
    perform public.market_notify(l.seller_id, 'market_removed', null, jsonb_build_object('title', l.title), 'market:mine', 'mk:' || l.id || ':market_removed');
  end if;
  update public.market_reports r set status = 'actioned' where r.status = 'open' and (r.listing_id = listing or r.id = report_id);
end $$;

create or replace function public.market_admin_dismiss(report_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  update public.market_reports r set status = 'dismissed' where r.id = report_id and r.status = 'open';
end $$;

/** the owner records a refund made in the provider's own dashboard (TBC, PayPal): the paid hours come off the listing */
create or replace function public.market_admin_refund(promotion uuid) returns text
language plpgsql security definer set search_path = public as $$
declare pr public.market_promotions;
begin
  if not public.is_owner() then raise exception 'not-allowed'; end if;
  select * into pr from public.market_promotions x where x.id = promotion;
  if not found then raise exception 'not-found'; end if;
  return public.market_refund(pr.provider, pr.payment_id);
end $$;

/** retry the files whose deletion failed eight times (after the cause has been fixed) */
create or replace function public.market_admin_retry_media() returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  update public.market_media_trash t set tries = 0, next_try_at = now() where t.done_at is null and t.tries >= 8;
  get diagnostics n = row_count;
  return n;
end $$;

-- ===================================================================== storage: the `market` bucket
/** an upload into <me>/<listing>/…: only for a listing of mine that is not over (a policy cannot read the table itself) */
create or replace function public.market_can_upload(path text) returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and split_part(path, '/', 1) = auth.uid()::text and not public.community_banned(auth.uid())
    and exists (select 1 from public.market_listings l where l.id::text = split_part(path, '/', 2) and l.seller_id = auth.uid()
      and (l.status in ('draft', 'pending') or public.market_is_live(l)));
$$;
/** a listing's file may be read by its seller, by administrators, and by anyone while the listing is live */
create or replace function public.can_read_market_media(path text) returns boolean
language sql stable security definer set search_path = public as $$
  select (auth.uid() is not null and split_part(path, '/', 1) = auth.uid()::text) or public.is_admin()
    or exists (select 1 from public.market_listings l where (path = any (l.photos) or path = l.video_path or path = l.audio_path)
      and public.market_is_live(l));
$$;

do $$ begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('market', 'market', false, 52428800, array['image/jpeg', 'image/png', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/x-m4a', 'audio/flac'])
    on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
    -- uploads only into my own folder, only under a listing of mine that is not over
    execute 'drop policy if exists "market upload own" on storage.objects';
    execute 'create policy "market upload own" on storage.objects for insert to authenticated with check (bucket_id = ''market'' and public.market_can_upload(name))';
    execute 'drop policy if exists "market read live" on storage.objects';
    execute 'create policy "market read live" on storage.objects for select to anon, authenticated using (bucket_id = ''market'' and public.can_read_market_media(name))';
    execute 'drop policy if exists "market delete own" on storage.objects';
    execute 'create policy "market delete own" on storage.objects for delete to authenticated using (bucket_id = ''market'' and (storage.foldername(name))[1] = auth.uid()::text)';
  end if;
end $$;

-- ===================================================================== the hosted server: the schedule
insert into public.server_config (key, value) values ('market_url', 'https://tecynfffgjgrcafmfqty.supabase.co/functions/v1/market') on conflict (key) do nothing;
insert into public.server_config (key, value) values ('market_premoderate', 'off') on conflict (key) do nothing;
do $$ begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron with schema pg_catalog;
    perform cron.schedule('market-expire', '* * * * *', 'select public.market_expire()');
    perform cron.schedule('market-media-sweep', '*/5 * * * *', 'select public.market_media_kick()');
  end if;
end $$;

-- ===================================================================== access
revoke all on public.market_listings, public.market_orders, public.market_favorites, public.market_seen, public.market_messages, public.market_reports,
  public.market_media_trash, public.market_expired_log, public.market_cleanup_runs, public.market_cleanup_errors from anon, authenticated;
revoke all on public.market_packages, public.market_promotions from anon, authenticated;
grant select on public.market_packages to anon, authenticated;
grant select on public.market_promotions to authenticated;
do $$ declare f text;
begin
  -- browsing works signed out
  foreach f in array array['market_search(text, text, text, numeric, numeric, text, text, integer, integer)', 'market_featured(text, integer, uuid)',
    'market_get(uuid)', 'market_seller(uuid)', 'market_track(uuid[], text, text)', 'can_read_market_media(text)', 'market_now()'] loop
    execute format('revoke all on function public.%s from public', f);
    execute format('grant execute on function public.%s to anon, authenticated', f);
  end loop;
  foreach f in array array['market_mine()', 'market_saved()', 'market_save(uuid, jsonb)', 'market_set_media(uuid, text[], text, text)',
    'market_delete(uuid)', 'market_favorite(uuid, boolean)', 'market_contact(uuid)', 'market_send(uuid, text, uuid)', 'market_threads()', 'market_thread(uuid, uuid)',
    'market_report(uuid, text)', 'market_can_upload(text)', 'market_admin_overview()', 'market_admin_package(text, numeric, boolean, text, text)', 'market_owner_sale(text, numeric, text, timestamptz)', 'market_admin_premoderate(boolean)',
    'market_admin_review(uuid, boolean, text)', 'market_admin_remove(uuid, bigint)', 'market_admin_dismiss(bigint)', 'market_admin_refund(uuid)', 'market_admin_retry_media()'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  -- the server's own machinery: the Edge Function (service role) and pg_cron only
  foreach f in array array['market_order_check(uuid, uuid, text)', 'market_apply_payment(text, text, uuid, uuid, text, numeric, text)', 'market_fulfill_order(text, text)',
    'market_order_failed(text, text, text)', 'market_refund(text, text)', 'market_expire()', 'market_media_due(integer)', 'market_media_result(bigint[], boolean, text)',
    'market_media_kick()', 'market_queue_orphans()', 'market_go_live(uuid, integer, uuid)', 'market_destroy(market_listings, text)', 'market_note(market_listings, text, jsonb)',
    'market_notify(uuid, text, uuid, jsonb, text, text)', 'market_setting(text)', 'market_premoderate()', 'market_card(market_listings, boolean)',
    'market_is_live(market_listings)', 'market_rotation(uuid)', 'market_left(bigint, text)', 'market_price_minor(market_packages)'] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', f);
    if exists (select 1 from pg_roles where rolname = 'service_role') then execute format('grant execute on function public.%s to service_role', f); end if;
  end loop;
end $$;
