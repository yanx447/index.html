-- =====================================================================
-- Panduri Learning — Supabase database (run once in Supabase → SQL Editor)
-- Accounts · levels · VIP / premium · progress backup · messages ·
-- help board · call signalling. Row Level Security on every table.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- profiles (one per account, created automatically) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  phone text,
  display_name text default '',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  vip_until timestamptz,                 -- VIP / premium is active while this is in the future
  plan text,                             -- 'vip' (granted by admin) | 'monthly' | 'yearly'
  xp integer not null default 0,
  level integer not null default 0,
  lefty boolean default false,
  created_at timestamptz not null default now(),
  last_seen timestamptz default now()
);
alter table public.profiles enable row level security;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, phone, display_name)
  values (new.id, new.email, new.phone, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
create or replace function public.is_premium(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = uid and vip_until is not null and vip_until > now());
$$;

drop policy if exists "own profile or admin" on public.profiles;
create policy "own profile or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
-- members may change only these columns; role / VIP / plan change only through the admin functions below
revoke update on public.profiles from authenticated, anon;
grant update (display_name, avatar_url, xp, level, lefty, last_seen) on public.profiles to authenticated;

-- ---------- admin: list users, grant / remove VIP, make admins ----------
create or replace function public.admin_list_users(term text default '')
returns setof public.profiles language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return query select * from public.profiles p
    where term = '' or p.display_name ilike '%' || term || '%' or p.email ilike '%' || term || '%' or p.phone ilike '%' || term || '%'
    order by p.created_at desc limit 200;
end $$;
create or replace function public.admin_set_vip(target uuid, until timestamptz, plan text default 'vip')
returns public.profiles language plpgsql security definer set search_path = public as $$
declare r public.profiles;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  update public.profiles p set vip_until = admin_set_vip.until, plan = case when admin_set_vip.until is null then null else admin_set_vip.plan end
    where p.id = admin_set_vip.target returning * into r;
  return r;
end $$;
create or replace function public.admin_set_role(target uuid, new_role text)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare r public.profiles;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if new_role not in ('user', 'admin') then raise exception 'bad role'; end if;
  update public.profiles p set role = admin_set_role.new_role where p.id = admin_set_role.target returning * into r;
  return r;
end $$;

-- ---------- purchases (written by the payment webhook with the service key, never by the app) ----------
create table if not exists public.purchases (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  provider text not null,                -- 'google_play' | 'app_store' | 'stripe'
  product text not null,                 -- 'premium_monthly' | 'premium_yearly'
  status text not null,                  -- 'active' | 'cancelled' | 'expired'
  expires_at timestamptz,
  raw jsonb,
  created_at timestamptz not null default now()
);
alter table public.purchases enable row level security;
drop policy if exists "own purchases" on public.purchases;
create policy "own purchases" on public.purchases for select using (user_id = auth.uid() or public.is_admin());

-- ---------- progress backup (one row per account) ----------
create table if not exists public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.progress enable row level security;
drop policy if exists "own progress" on public.progress;
create policy "own progress" on public.progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- people directory (only public fields) ----------
create or replace function public.people(term text default '')
returns table (id uuid, display_name text, avatar_url text, level integer, vip boolean)
language sql stable security definer set search_path = public as $$
  select p.id, p.display_name, p.avatar_url, p.level, (p.vip_until is not null and p.vip_until > now())
  from public.profiles p
  where auth.uid() is not null and p.id <> auth.uid() and coalesce(p.display_name, '') <> ''
    and (term = '' or p.display_name ilike '%' || term || '%')
  order by p.last_seen desc nulls last limit 50;
$$;

-- ---------- 1:1 conversations ----------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  a uuid not null references auth.users on delete cascade,
  b uuid not null references auth.users on delete cascade,
  last_at timestamptz not null default now(),
  check (a < b), unique (a, b)
);
alter table public.conversations enable row level security;
drop policy if exists "participants" on public.conversations;
create policy "participants" on public.conversations for select using (auth.uid() in (a, b));

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations on delete cascade,
  sender uuid not null default auth.uid() references auth.users on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
drop policy if exists "read in my conversations" on public.messages;
create policy "read in my conversations" on public.messages for select using (exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.a, c.b)));
drop policy if exists "write in my conversations" on public.messages;
create policy "write in my conversations" on public.messages for insert with check (sender = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.a, c.b)));
create index if not exists messages_conv on public.messages (conversation_id, id);

create or replace function public.touch_conversation() returns trigger language plpgsql security definer set search_path = public as $$
begin update public.conversations set last_at = now() where id = new.conversation_id; return new; end $$;
drop trigger if exists messages_touch on public.messages;
create trigger messages_touch after insert on public.messages for each row execute function public.touch_conversation();

create or replace function public.open_conversation(other uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare x uuid := least(auth.uid(), other); y uuid := greatest(auth.uid(), other); cid uuid;
begin
  if auth.uid() is null or other is null or other = auth.uid() then raise exception 'bad conversation'; end if;
  select id into cid from public.conversations where a = x and b = y;
  if cid is null then insert into public.conversations (a, b) values (x, y) returning id into cid; end if;
  return cid;
end $$;

create or replace function public.my_conversations()
returns table (id uuid, other uuid, other_name text, other_avatar text, last_at timestamptz, last_body text)
language sql stable security definer set search_path = public as $$
  select c.id, o.id, o.display_name, o.avatar_url, c.last_at,
    (select m.body from public.messages m where m.conversation_id = c.id order by m.id desc limit 1)
  from public.conversations c
  join public.profiles o on o.id = case when c.a = auth.uid() then c.b else c.a end
  where auth.uid() in (c.a, c.b)
  order by c.last_at desc limit 100;
$$;

-- ---------- help board: questions and answers ----------
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  author uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text,
  title text not null check (char_length(title) between 1 and 200),
  body text default '' check (char_length(body) <= 4000),
  created_at timestamptz not null default now()
);
create table if not exists public.replies (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts on delete cascade,
  author uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
alter table public.posts enable row level security;
alter table public.replies enable row level security;
create or replace function public.fill_author_name() returns trigger language plpgsql security definer set search_path = public as $$
begin new.author := auth.uid(); select display_name into new.author_name from public.profiles where id = auth.uid(); return new; end $$;
drop trigger if exists posts_author on public.posts;
create trigger posts_author before insert on public.posts for each row execute function public.fill_author_name();
drop trigger if exists replies_author on public.replies;
create trigger replies_author before insert on public.replies for each row execute function public.fill_author_name();
drop policy if exists "members read posts" on public.posts;
create policy "members read posts" on public.posts for select using (auth.uid() is not null);
drop policy if exists "members write posts" on public.posts;
create policy "members write posts" on public.posts for insert with check (auth.uid() is not null);
drop policy if exists "own or admin delete posts" on public.posts;
create policy "own or admin delete posts" on public.posts for delete using (author = auth.uid() or public.is_admin());
drop policy if exists "members read replies" on public.replies;
create policy "members read replies" on public.replies for select using (auth.uid() is not null);
drop policy if exists "members write replies" on public.replies;
create policy "members write replies" on public.replies for insert with check (auth.uid() is not null);
drop policy if exists "own or admin delete replies" on public.replies;
create policy "own or admin delete replies" on public.replies for delete using (author = auth.uid() or public.is_admin());

-- ---------- video call signalling (WebRTC offer / answer / ICE between the two participants) ----------
create table if not exists public.call_signals (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations on delete cascade,
  sender uuid not null default auth.uid() references auth.users on delete cascade,
  kind text not null check (kind in ('ring', 'offer', 'answer', 'ice', 'end', 'busy')),
  payload jsonb,
  created_at timestamptz not null default now()
);
alter table public.call_signals enable row level security;
drop policy if exists "participants read signals" on public.call_signals;
create policy "participants read signals" on public.call_signals for select using (exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.a, c.b)));
drop policy if exists "participants send signals" on public.call_signals;
create policy "participants send signals" on public.call_signals for insert with check (sender = auth.uid() and exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.a, c.b)));
create index if not exists call_signals_conv on public.call_signals (conversation_id, id);

-- ---------- delete my account (Google Play and Facebook require it): removes the account and everything above ----------
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = auth.uid();
end $$;

-- ---------- access for signed-in members (row-level security above still decides which rows) ----------
grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.purchases to authenticated;
grant select, insert, update, delete on public.progress to authenticated;
grant select on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;
grant select, insert, delete on public.posts, public.replies to authenticated;
grant select, insert on public.call_signals to authenticated;
revoke execute on function public.delete_my_account(), public.open_conversation(uuid), public.my_conversations(), public.people(text),
  public.admin_list_users(text), public.admin_set_vip(uuid, timestamptz, text), public.admin_set_role(uuid, text) from public, anon;
grant execute on function public.delete_my_account(), public.open_conversation(uuid), public.my_conversations(), public.people(text),
  public.admin_list_users(text), public.admin_set_vip(uuid, timestamptz, text), public.admin_set_role(uuid, text), public.is_admin(), public.is_premium(uuid) to authenticated;

-- ---------- make YOURSELF the admin (once, after you have signed up in the app) ----------
-- update public.profiles set role = 'admin' where email = 'YOUR_EMAIL_HERE';
