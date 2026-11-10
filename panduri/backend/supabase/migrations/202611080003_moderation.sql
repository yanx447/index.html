-- The community: report, block, a word filter and an administrator's queue.
-- Apple (guideline 1.2) and Google Play (user-generated content) refuse an app with chat that has none of these.
-- Additive: no existing table, column or policy is changed.

create table if not exists public.blocks (
  blocker uuid not null default auth.uid() references auth.users on delete cascade,
  blocked uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);
alter table public.blocks enable row level security;
drop policy if exists "own blocks read" on public.blocks;
create policy "own blocks read" on public.blocks for select using (blocker = auth.uid());
drop policy if exists "own blocks add" on public.blocks;
create policy "own blocks add" on public.blocks for insert with check (blocker = auth.uid());
drop policy if exists "own blocks remove" on public.blocks;
create policy "own blocks remove" on public.blocks for delete using (blocker = auth.uid());

-- a separate table, not a column on profiles: members may update their own profile row
create table if not exists public.community_bans (
  user_id uuid primary key references auth.users on delete cascade,
  banned_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);
alter table public.community_bans enable row level security;
drop policy if exists "admins read bans" on public.community_bans;
create policy "admins read bans" on public.community_bans for select using (public.is_admin());
drop policy if exists "admins remove bans" on public.community_bans;
create policy "admins remove bans" on public.community_bans for delete using (public.is_admin());

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  reporter uuid not null references auth.users on delete cascade,
  target_user uuid references auth.users on delete set null,
  kind text not null check (kind in ('message', 'post', 'reply', 'user')),
  item_id text not null,
  excerpt text,
  reason text not null check (reason in ('abuse', 'sexual', 'spam', 'danger', 'other')),
  status text not null default 'open' check (status in ('open', 'actioned', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users on delete set null
);
create unique index if not exists reports_one_open on public.reports (reporter, kind, item_id) where status = 'open';
create index if not exists reports_open on public.reports (created_at) where status = 'open';
alter table public.reports enable row level security;   -- no policy for members: reports go through report_content only
drop policy if exists "admins read reports" on public.reports;
create policy "admins read reports" on public.reports for select using (public.is_admin());

-- words refused when posting; the administrator edits this list in the Supabase table editor
create table if not exists public.moderation_terms (
  term text primary key check (term = lower(term) and char_length(term) >= 3)
);
alter table public.moderation_terms enable row level security;
drop policy if exists "admins manage terms" on public.moderation_terms;
create policy "admins manage terms" on public.moderation_terms for all using (public.is_admin()) with check (public.is_admin());
insert into public.moderation_terms (term) values
  ('fuck'), ('fucking'), ('motherfucker'), ('cunt'), ('nigger'), ('faggot'),
  ('ყლე'), ('ყლეო'), ('დედამოტყნული'), ('მუტელი'), ('პიდარასტი')
on conflict do nothing;

create or replace function public.community_banned(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.community_bans b where b.user_id = uid);
$$;

create or replace function public.conversation_blocked(conv uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.conversations c join public.blocks b
      on (b.blocker = c.a and b.blocked = c.b) or (b.blocker = c.b and b.blocked = c.a)
    where c.id = conv
  );
$$;

-- whole words only, by explicit letter ranges, so the result does not depend on the database locale
create or replace function public.has_objectionable_text(content text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.moderation_terms t
    where ' ' || regexp_replace(lower(coalesce(content, '')), '[^a-zა-ჰа-яё0-9]+', ' ', 'g') || ' ' like '% ' || t.term || ' %'
  );
$$;

create or replace function public.refuse_objectionable() returns trigger
language plpgsql security definer set search_path = public as $$
declare content text;
begin
  if tg_table_name = 'posts' then content := new.title || ' ' || coalesce(new.body, ''); else content := new.body; end if;
  if public.has_objectionable_text(content) then raise exception 'objectionable-content'; end if;
  return new;
end $$;

drop trigger if exists messages_filter on public.messages;
create trigger messages_filter before insert on public.messages for each row execute function public.refuse_objectionable();
drop trigger if exists posts_filter on public.posts;
create trigger posts_filter before insert on public.posts for each row execute function public.refuse_objectionable();
drop trigger if exists replies_filter on public.replies;
create trigger replies_filter before insert on public.replies for each row execute function public.refuse_objectionable();

-- RESTRICTIVE policies narrow the existing ones without touching them
drop policy if exists "not banned or blocked" on public.messages;
create policy "not banned or blocked" on public.messages as restrictive for insert
  with check (not public.community_banned(auth.uid()) and not public.conversation_blocked(conversation_id));
drop policy if exists "not banned" on public.posts;
create policy "not banned" on public.posts as restrictive for insert with check (not public.community_banned(auth.uid()));
drop policy if exists "not banned" on public.replies;
create policy "not banned" on public.replies as restrictive for insert with check (not public.community_banned(auth.uid()));
drop policy if exists "not banned or blocked" on public.call_signals;
create policy "not banned or blocked" on public.call_signals as restrictive for insert
  with check (kind = 'end' or (not public.community_banned(auth.uid()) and not public.conversation_blocked(conversation_id)));

drop policy if exists "hide blocked" on public.messages;
create policy "hide blocked" on public.messages as restrictive for select
  using (sender = auth.uid() or not exists (select 1 from public.blocks b where b.blocker = auth.uid() and b.blocked = sender));
drop policy if exists "hide blocked" on public.posts;
create policy "hide blocked" on public.posts as restrictive for select
  using (author = auth.uid() or not exists (select 1 from public.blocks b where b.blocker = auth.uid() and b.blocked = author));
drop policy if exists "hide blocked" on public.replies;
create policy "hide blocked" on public.replies as restrictive for select
  using (author = auth.uid() or not exists (select 1 from public.blocks b where b.blocker = auth.uid() and b.blocked = author));
drop policy if exists "hide blocked" on public.call_signals;
create policy "hide blocked" on public.call_signals as restrictive for select
  using (sender = auth.uid() or not exists (select 1 from public.blocks b where b.blocker = auth.uid() and b.blocked = sender));

-- the excerpt and the target are read here, on the server: a report cannot name something its sender cannot see
create or replace function public.report_content(item_kind text, item_ref text, why text) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); target uuid; quote text;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if item_kind = 'message' then
    select m.sender, left(m.body, 500) into target, quote
      from public.messages m join public.conversations c on c.id = m.conversation_id
      where m.id = item_ref::bigint and me in (c.a, c.b);
  elsif item_kind = 'post' then
    select p.author, left(p.title || E'\n' || coalesce(p.body, ''), 500) into target, quote from public.posts p where p.id = item_ref::bigint;
  elsif item_kind = 'reply' then
    select r.author, left(r.body, 500) into target, quote from public.replies r where r.id = item_ref::bigint;
  elsif item_kind = 'user' then
    select p.id, p.display_name into target, quote from public.profiles p where p.id = item_ref::uuid;
  else
    raise exception 'invalid-kind';
  end if;
  if target is null then raise exception 'not-found'; end if;
  if target = me then raise exception 'own-content'; end if;
  insert into public.reports (reporter, target_user, kind, item_id, excerpt, reason)
    values (me, target, item_kind, item_ref, quote, why)
    on conflict (reporter, kind, item_id) where status = 'open' do nothing;
end $$;

create or replace function public.my_blocks()
returns table (id uuid, name text)
language sql stable security definer set search_path = public as $$
  select b.blocked, p.display_name from public.blocks b left join public.profiles p on p.id = b.blocked
  where b.blocker = auth.uid() order by b.created_at desc;
$$;

create or replace function public.admin_open_reports()
returns table (id bigint, kind text, item_id text, excerpt text, reason text, created_at timestamptz, reporter_name text, target uuid, target_name text, target_banned boolean)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  return query
    select r.id, r.kind, r.item_id, r.excerpt, r.reason, r.created_at, a.display_name, r.target_user, b.display_name, public.community_banned(r.target_user)
    from public.reports r
    left join public.profiles a on a.id = r.reporter
    left join public.profiles b on b.id = r.target_user
    where r.status = 'open' order by r.created_at asc limit 200;
end $$;

-- remove: delete the reported content. ban: delete it and stop the author posting. dismiss: nothing was wrong.
create or replace function public.admin_resolve_report(report_id bigint, decision text) returns void
language plpgsql security definer set search_path = public as $$
declare r public.reports%rowtype;
begin
  if not public.is_admin() then raise exception 'not-allowed'; end if;
  if decision not in ('remove', 'ban', 'dismiss') then raise exception 'invalid-decision'; end if;
  select * into r from public.reports x where x.id = report_id and x.status = 'open' for update;
  if not found then raise exception 'not-found'; end if;
  if decision in ('remove', 'ban') then
    if r.kind = 'message' then delete from public.messages m where m.id = r.item_id::bigint;
    elsif r.kind = 'post' then delete from public.posts p where p.id = r.item_id::bigint;
    elsif r.kind = 'reply' then delete from public.replies y where y.id = r.item_id::bigint;
    end if;
  end if;
  if decision = 'ban' and r.target_user is not null then
    insert into public.community_bans (user_id, banned_by) values (r.target_user, auth.uid()) on conflict do nothing;
  end if;
  update public.reports x set status = case when decision = 'dismiss' then 'dismissed' else 'actioned' end, resolved_at = now(), resolved_by = auth.uid()
    where x.status = 'open' and x.kind = r.kind and x.item_id = r.item_id;
end $$;

revoke all on function public.report_content(text, text, text) from public, anon;
revoke all on function public.my_blocks() from public, anon;
revoke all on function public.admin_open_reports() from public, anon;
revoke all on function public.admin_resolve_report(bigint, text) from public, anon;
grant execute on function public.report_content(text, text, text) to authenticated;
grant execute on function public.my_blocks() to authenticated;
grant execute on function public.admin_open_reports() to authenticated;
grant execute on function public.admin_resolve_report(bigint, text) to authenticated;
