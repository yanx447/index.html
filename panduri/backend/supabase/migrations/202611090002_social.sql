-- The community, grown up: friends by nickname · a feed of photos, videos and music (global and friends) ·
-- reactions (with the panduri), comments, shares · photos, videos and audio in chats, and reactions on them ·
-- notifications that Sima sends to every device the account is signed in on.
--
-- Needs 202611080003_moderation.sql first (blocks, community bans, the word filter, reports).
-- Additive, except: people() and open_conversation() now answer only for friends, and a message may now carry
-- a photo / video / audio / shared post instead of text. Pairs who already have a conversation become friends,
-- so no existing chat disappears.
-- The parts that need the hosted server (storage, pg_net, pg_cron, vault) are created only where they exist,
-- so the same file also runs in the embedded test database.

-- ===================================================================== nicknames
alter table public.profiles add column if not exists nickname text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_nickname_format') then
    alter table public.profiles add constraint profiles_nickname_format check (nickname is null or nickname ~ '^[a-z0-9_.]{3,24}$');
  end if;
end $$;
create unique index if not exists profiles_nickname_key on public.profiles (nickname);

create or replace function public.set_nickname(nick text) returns text
language plpgsql security definer set search_path = public as $$
declare n text := lower(trim(both from regexp_replace(coalesce(nick, ''), '^@+', '')));
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  if n !~ '^[a-z0-9_.]{3,24}$' or n ~ '^[._]' or n ~ '[._]$' or n ~ '\.\.' then raise exception 'nickname-invalid'; end if;
  if public.has_objectionable_text(replace(replace(n, '_', ' '), '.', ' ')) then raise exception 'objectionable-content'; end if;
  if exists (select 1 from public.profiles where nickname = n and id <> auth.uid()) then raise exception 'nickname-taken'; end if;
  update public.profiles set nickname = n where id = auth.uid();
  return n;
end $$;

-- ===================================================================== friends
create table if not exists public.friendships (
  a uuid not null references auth.users on delete cascade,
  b uuid not null references auth.users on delete cascade,
  requester uuid not null references auth.users on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  primary key (a, b),
  check (a < b), check (requester in (a, b))
);
create index if not exists friendships_b on public.friendships (b);
alter table public.friendships enable row level security;
drop policy if exists "own friendships" on public.friendships;
create policy "own friendships" on public.friendships for select using (auth.uid() in (a, b));   -- changes go through the functions below

create or replace function public.is_friend(x uuid, y uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select x is not null and y is not null and exists (select 1 from public.friendships f where f.a = least(x, y) and f.b = greatest(x, y) and f.status = 'accepted');
$$;
create or replace function public.blocked_between(x uuid, y uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.blocks b where (b.blocker = x and b.blocked = y) or (b.blocker = y and b.blocked = x));
$$;
create or replace function public.conversation_friends(conv uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.conversations c where c.id = conv and public.is_friend(c.a, c.b));
$$;

-- the people who already wrote to each other stay able to: their pair becomes a friendship
insert into public.friendships (a, b, requester, status, accepted_at)
  select c.a, c.b, c.a, 'accepted', now() from public.conversations c
  where exists (select 1 from public.messages m where m.conversation_id = c.id)
on conflict do nothing;

/** one person, found by the exact nickname: the directory cannot be read through this */
create or replace function public.find_nickname(nick text)
returns table (id uuid, nickname text, display_name text, avatar_url text, level integer, relation text)
language sql stable security definer set search_path = public as $$
  select p.id, p.nickname, p.display_name, p.avatar_url, p.level,
    coalesce((select case when f.status = 'accepted' then 'friend' when f.requester = auth.uid() then 'outgoing' else 'incoming' end
      from public.friendships f where f.a = least(p.id, auth.uid()) and f.b = greatest(p.id, auth.uid())), 'none')
  from public.profiles p
  where auth.uid() is not null and p.id <> auth.uid()
    and p.nickname = lower(trim(both from regexp_replace(coalesce(nick, ''), '^@+', '')))
    and not public.blocked_between(auth.uid(), p.id);
$$;

-- the opening hello of a new member stays rare: 40 open requests at most
create or replace function public.friend_request(nick text) returns text
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); other uuid; f public.friendships%rowtype;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if public.community_banned(me) then raise exception 'denied' using errcode = '42501'; end if;
  select p.id into other from public.profiles p where p.nickname = lower(trim(both from regexp_replace(coalesce(nick, ''), '^@+', '')));
  if other is null or public.blocked_between(me, other) then raise exception 'not-found'; end if;
  if other = me then raise exception 'self'; end if;
  select * into f from public.friendships x where x.a = least(me, other) and x.b = greatest(me, other) for update;
  if found then
    if f.status = 'accepted' then return 'friend'; end if;
    if f.requester = me then return 'outgoing'; end if;
    update public.friendships x set status = 'accepted', accepted_at = now() where x.a = f.a and x.b = f.b;   -- both asked: friends
    return 'friend';
  end if;
  if (select count(*) from public.friendships x where x.requester = me and x.status = 'pending') >= 40 then raise exception 'too-many-requests'; end if;
  insert into public.friendships (a, b, requester) values (least(me, other), greatest(me, other), me);
  return 'outgoing';
end $$;

create or replace function public.friend_respond(other uuid, accept boolean) returns text
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if accept then
    update public.friendships x set status = 'accepted', accepted_at = now()
      where x.a = least(me, other) and x.b = greatest(me, other) and x.requester = other and x.status = 'pending';
    if not found then raise exception 'not-found'; end if;
    return 'friend';
  end if;
  delete from public.friendships x where x.a = least(me, other) and x.b = greatest(me, other) and x.requester = other and x.status = 'pending';
  return 'none';
end $$;

/** cancel my request, or stop being friends */
create or replace function public.friend_remove(other uuid) returns void
language sql security definer set search_path = public as $$
  delete from public.friendships x where auth.uid() is not null and x.a = least(auth.uid(), other) and x.b = greatest(auth.uid(), other);
$$;

create or replace function public.my_friends()
returns table (id uuid, nickname text, display_name text, avatar_url text, level integer, vip boolean, relation text, since timestamptz, last_seen timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.nickname, p.display_name, p.avatar_url, p.level, (p.vip_until is not null and p.vip_until > now()),
    case when f.status = 'accepted' then 'friend' when f.requester = auth.uid() then 'outgoing' else 'incoming' end,
    coalesce(f.accepted_at, f.created_at), p.last_seen
  from public.friendships f
  join public.profiles p on p.id = case when f.a = auth.uid() then f.b else f.a end
  where auth.uid() in (f.a, f.b) and not public.blocked_between(auth.uid(), p.id)
  order by (f.status = 'accepted'), p.last_seen desc nulls last
  limit 500;
$$;

-- the directory shows only friends now (older app versions call this to fill their "People" list)
create or replace function public.people(term text default '')
returns table (id uuid, display_name text, avatar_url text, level integer, vip boolean)
language sql stable security definer set search_path = public as $$
  select p.id, p.display_name, p.avatar_url, p.level, (p.vip_until is not null and p.vip_until > now())
  from public.profiles p
  where auth.uid() is not null and p.id <> auth.uid() and public.is_friend(auth.uid(), p.id)
    and not public.blocked_between(auth.uid(), p.id)
    and (term = '' or p.display_name ilike '%' || term || '%' or p.nickname ilike '%' || term || '%')
  order by p.last_seen desc nulls last limit 50;
$$;

create or replace function public.open_conversation(other uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare x uuid := least(auth.uid(), other); y uuid := greatest(auth.uid(), other); cid uuid;
begin
  if auth.uid() is null or other is null or other = auth.uid() then raise exception 'bad conversation'; end if;
  if not public.is_friend(auth.uid(), other) then raise exception 'not-friends' using errcode = '42501'; end if;
  select id into cid from public.conversations where a = x and b = y;
  if cid is null then insert into public.conversations (a, b) values (x, y) returning id into cid; end if;
  return cid;
end $$;

-- ===================================================================== the feed
create table if not exists public.feed_posts (
  id bigint generated always as identity primary key,
  author uuid not null default auth.uid() references auth.users on delete cascade,
  kind text not null check (kind in ('text', 'photo', 'video', 'audio')),
  caption text not null default '' check (char_length(caption) <= 2200),
  media_path text,
  thumb_path text,
  media_meta jsonb not null default '{}'::jsonb check (char_length(media_meta::text) <= 2000),
  visibility text not null default 'public' check (visibility in ('public', 'friends')),
  reactions integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  check ((kind = 'text') = (media_path is null)),
  check (kind <> 'text' or char_length(caption) >= 1)
);
create index if not exists feed_posts_created on public.feed_posts (created_at desc);
create index if not exists feed_posts_author on public.feed_posts (author, id desc);
create index if not exists feed_posts_media on public.feed_posts (media_path);
create index if not exists feed_posts_thumb on public.feed_posts (thumb_path);
alter table public.feed_posts enable row level security;

create table if not exists public.feed_reactions (
  post_id bigint not null references public.feed_posts on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  emoji text not null check (emoji in ('panduri', 'heart', 'fire', 'clap', 'laugh', 'wow', 'sad')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table public.feed_reactions enable row level security;

create table if not exists public.feed_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.feed_posts on delete cascade,
  author uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists feed_comments_post on public.feed_comments (post_id, id);
alter table public.feed_comments enable row level security;

create table if not exists public.feed_views (
  post_id bigint not null references public.feed_posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists feed_views_user on public.feed_views (user_id);
alter table public.feed_views enable row level security;   -- written only by feed_seen()

create table if not exists public.post_milestones (
  post_id bigint not null references public.feed_posts on delete cascade,
  metric text not null,
  n integer not null,
  created_at timestamptz not null default now(),
  primary key (post_id, metric, n)
);
alter table public.post_milestones enable row level security;

/** who may see a post: its author; a public one, everybody who is signed in; a friends-only one, the author's friends. Never across a block. */
create or replace function public.can_see_post(p_author uuid, p_vis text) returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and (p_author = auth.uid()
    or (not public.blocked_between(auth.uid(), p_author) and (p_vis = 'public' or public.is_friend(auth.uid(), p_author))));
$$;
create or replace function public.post_visible(pid bigint) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.feed_posts p where p.id = pid and public.can_see_post(p.author, p.visibility));
$$;

drop policy if exists "visible posts" on public.feed_posts;
create policy "visible posts" on public.feed_posts for select using (public.can_see_post(author, visibility));
drop policy if exists "own posts add" on public.feed_posts;
create policy "own posts add" on public.feed_posts for insert with check (author = auth.uid() and not public.community_banned(auth.uid()));
drop policy if exists "own or admin posts remove" on public.feed_posts;
create policy "own or admin posts remove" on public.feed_posts for delete using (author = auth.uid() or public.is_admin());

drop policy if exists "reactions on visible posts" on public.feed_reactions;
create policy "reactions on visible posts" on public.feed_reactions for select using (public.post_visible(post_id));

drop policy if exists "comments on visible posts" on public.feed_comments;
create policy "comments on visible posts" on public.feed_comments for select using (public.post_visible(post_id)
  and (author = auth.uid() or not public.blocked_between(auth.uid(), author)));
drop policy if exists "comment on visible posts" on public.feed_comments;
create policy "comment on visible posts" on public.feed_comments for insert with check (public.post_visible(post_id) and not public.community_banned(auth.uid()));
drop policy if exists "own, post author or admin comments remove" on public.feed_comments;
create policy "own, post author or admin comments remove" on public.feed_comments for delete
  using (author = auth.uid() or public.is_admin() or exists (select 1 from public.feed_posts p where p.id = post_id and p.author = auth.uid()));

-- a new post: its author is the one signed in, the counters start at zero, and its files are the author's own
create or replace function public.feed_post_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.author := auth.uid();
  new.reactions := 0; new.comments := 0; new.shares := 0; new.views := 0; new.created_at := now();
  if new.media_path is not null and split_part(new.media_path, '/', 1) <> auth.uid()::text then raise exception 'not-your-file' using errcode = '42501'; end if;
  if new.thumb_path is not null and split_part(new.thumb_path, '/', 1) <> auth.uid()::text then raise exception 'not-your-file' using errcode = '42501'; end if;
  if (select count(*) from public.feed_posts p where p.author = auth.uid() and p.created_at > now() - interval '1 hour') >= 20 then raise exception 'slow-down'; end if;
  return new;
end $$;
drop trigger if exists feed_posts_guard on public.feed_posts;
create trigger feed_posts_guard before insert on public.feed_posts for each row execute function public.feed_post_guard();

-- the word filter knows the feed too
create or replace function public.refuse_objectionable() returns trigger
language plpgsql security definer set search_path = public as $$
declare content text;
begin
  if tg_table_name = 'posts' then content := new.title || ' ' || coalesce(new.body, '');
  elsif tg_table_name = 'feed_posts' then content := new.caption;
  else content := new.body; end if;
  if public.has_objectionable_text(content) then raise exception 'objectionable-content'; end if;
  return new;
end $$;
drop trigger if exists feed_posts_filter on public.feed_posts;
create trigger feed_posts_filter before insert on public.feed_posts for each row execute function public.refuse_objectionable();
drop trigger if exists feed_comments_filter on public.feed_comments;
create trigger feed_comments_filter before insert on public.feed_comments for each row execute function public.refuse_objectionable();
drop trigger if exists feed_comments_author on public.feed_comments;
create trigger feed_comments_author before insert on public.feed_comments for each row execute function public.fill_author_name();

/** the feeds. tab: 'foryou' (everyone's public posts, the ones not yet seen first, then by popularity),
    'friends' (friends and me, newest first), 'user' (one person's posts that I may see), 'one' (the post before_id). */
create or replace function public.feed(tab text default 'foryou', lim integer default 10, before_id bigint default null, target uuid default null, skip_ids bigint[] default null)
returns table (id bigint, author uuid, author_name text, author_nick text, author_avatar text, author_level integer, kind text, caption text,
  media_path text, thumb_path text, media_meta jsonb, visibility text, reactions integer, comments integer, shares integer, views integer,
  created_at timestamptz, my_reaction text, top jsonb, friend boolean, seen boolean, score double precision)
language sql stable security definer set search_path = public as $$
  with base as (
    select p.*, pr.display_name as a_name, pr.nickname as a_nick, pr.avatar_url as a_avatar, pr.level as a_level,
      exists (select 1 from public.feed_views v where v.post_id = p.id and v.user_id = auth.uid()) as was_seen,
      (p.reactions * 2 + p.comments * 3 + p.shares * 4 + p.views * 0.1 + 1)
        / power(extract(epoch from (now() - p.created_at)) / 3600.0 + 2, 1.5) as rank
    from public.feed_posts p join public.profiles pr on pr.id = p.author
    where auth.uid() is not null and public.can_see_post(p.author, p.visibility)
      and case tab
        when 'foryou' then p.visibility = 'public' and p.author <> auth.uid()
        when 'friends' then p.author = auth.uid() or public.is_friend(auth.uid(), p.author)
        when 'user' then p.author = target
        when 'one' then p.id = before_id
        else false end
      and (tab in ('foryou', 'one') or before_id is null or p.id < before_id)
      and (skip_ids is null or not (p.id = any (skip_ids)))
  )
  select b.id, b.author, b.a_name, b.a_nick, b.a_avatar, b.a_level, b.kind, b.caption, b.media_path, b.thumb_path, b.media_meta, b.visibility,
    b.reactions, b.comments, b.shares, b.views, b.created_at,
    (select r.emoji from public.feed_reactions r where r.post_id = b.id and r.user_id = auth.uid()),
    coalesce((select jsonb_agg(x.emoji order by x.n desc, x.emoji) from (select r.emoji, count(*) as n from public.feed_reactions r where r.post_id = b.id group by r.emoji order by count(*) desc, r.emoji limit 3) x), '[]'::jsonb),
    public.is_friend(auth.uid(), b.author), b.was_seen, b.rank
  from base b
  order by case when tab = 'foryou' then b.was_seen::int else 0 end,
    case when tab = 'foryou' then b.rank else 0 end desc,
    b.id desc
  limit least(greatest(coalesce(lim, 10), 1), 30);
$$;

/** a reaction on a post: the same one again takes it back, another one replaces it */
create or replace function public.react_post(post bigint, emoji text) returns text
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); cur text;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if not public.post_visible(post) then raise exception 'not-found'; end if;
  if public.community_banned(me) then raise exception 'denied' using errcode = '42501'; end if;
  select r.emoji into cur from public.feed_reactions r where r.post_id = post and r.user_id = me;
  if emoji is null or cur = emoji then delete from public.feed_reactions r where r.post_id = post and r.user_id = me; return null; end if;
  insert into public.feed_reactions (post_id, user_id, emoji) values (post, me, emoji)
    on conflict (post_id, user_id) do update set emoji = excluded.emoji, created_at = now();
  return emoji;
end $$;

/** the posts this member has had in front of them (counted once per person) */
create or replace function public.feed_seen(ids bigint[]) returns void
language plpgsql security definer set search_path = public as $$
declare pid bigint; n integer;
begin
  if auth.uid() is null then return; end if;
  for pid in select x from unnest(ids[1:50]) x loop
    if not public.post_visible(pid) then continue; end if;
    insert into public.feed_views (post_id, user_id) values (pid, auth.uid()) on conflict do nothing;
    if found then
      update public.feed_posts p set views = p.views + 1 where p.id = pid and p.author <> auth.uid() returning p.views into n;
      if n is not null then perform public.post_milestone(pid, 'views', n); end if;
    end if;
  end loop;
end $$;

-- ===================================================================== chats: photos, videos, audio, shared posts, reactions
alter table public.messages add column if not exists media_path text;
alter table public.messages add column if not exists thumb_path text;
alter table public.messages add column if not exists media_kind text;
alter table public.messages add column if not exists media_meta jsonb not null default '{}'::jsonb;
alter table public.messages add column if not exists post_ref bigint references public.feed_posts on delete set null;
alter table public.messages add column if not exists sticker text;   -- one of the app's own stickers, by name: nothing is uploaded
alter table public.messages add column if not exists gif text;       -- a GIF chosen through the gifs function (GIPHY's own address)
alter table public.messages alter column body set default '';
do $$ declare c text;
begin
  for c in select conname from pg_constraint where conrelid = 'public.messages'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%char_length(body)%' and conname <> 'messages_content' loop
    execute format('alter table public.messages drop constraint %I', c);
  end loop;
  if not exists (select 1 from pg_constraint where conname = 'messages_content') then
    alter table public.messages add constraint messages_content check (char_length(body) <= 4000
      and (char_length(body) >= 1 or media_path is not null or post_ref is not null or sticker is not null or gif is not null)
      and (sticker is null or sticker ~ '^[a-z0-9_]{1,32}$')
      and (gif is null or (gif ~ '^https://(media[0-9]*|i)\.giphy\.com/' and char_length(gif) <= 400))
      and (media_kind is null or media_kind in ('photo', 'video', 'audio'))
      and ((media_path is null) = (media_kind is null))
      and char_length(media_meta::text) <= 2000);
  end if;
end $$;
create index if not exists messages_media on public.messages (media_path) where media_path is not null;
create index if not exists messages_thumb on public.messages (thumb_path) where thumb_path is not null;

drop policy if exists "friends only" on public.messages;
create policy "friends only" on public.messages as restrictive for insert with check (
  public.conversation_friends(conversation_id)
  and (media_path is null or split_part(media_path, '/', 1) = auth.uid()::text)
  and (thumb_path is null or split_part(thumb_path, '/', 1) = auth.uid()::text)
  and (post_ref is null or public.post_visible(post_ref)));
drop policy if exists "friends only" on public.call_signals;
create policy "friends only" on public.call_signals as restrictive for insert
  with check (kind in ('end', 'busy') or public.conversation_friends(conversation_id));

-- a post shared into a chat counts as a share
create or replace function public.count_share() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.post_ref is not null then update public.feed_posts p set shares = p.shares + 1 where p.id = new.post_ref and p.author <> new.sender; end if;
  return new;
end $$;
drop trigger if exists messages_share on public.messages;
create trigger messages_share after insert on public.messages for each row execute function public.count_share();

create table if not exists public.message_reactions (
  message_id bigint not null references public.messages on delete cascade,
  conversation_id uuid not null references public.conversations on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  emoji text not null check (emoji in ('panduri', 'heart', 'fire', 'clap', 'laugh', 'wow', 'sad')),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id)
);
create index if not exists message_reactions_conv on public.message_reactions (conversation_id);
alter table public.message_reactions enable row level security;
drop policy if exists "participants read reactions" on public.message_reactions;
create policy "participants read reactions" on public.message_reactions for select
  using (exists (select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.a, c.b)));

create or replace function public.react_message(msg bigint, emoji text) returns text
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); conv uuid; cur text;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  select m.conversation_id into conv from public.messages m join public.conversations c on c.id = m.conversation_id
    where m.id = msg and me in (c.a, c.b);
  if conv is null then raise exception 'not-found'; end if;
  if not public.conversation_friends(conv) or public.conversation_blocked(conv) or public.community_banned(me) then raise exception 'denied' using errcode = '42501'; end if;
  select r.emoji into cur from public.message_reactions r where r.message_id = msg and r.user_id = me;
  if emoji is null or cur = emoji then delete from public.message_reactions r where r.message_id = msg and r.user_id = me; return null; end if;
  insert into public.message_reactions (message_id, conversation_id, user_id, emoji) values (msg, conv, me, emoji)
    on conflict (message_id, user_id) do update set emoji = excluded.emoji, created_at = now();
  return emoji;
end $$;

-- what has been read in each chat (the unread count on the list)
create table if not exists public.chat_reads (
  user_id uuid not null references auth.users on delete cascade,
  conversation_id uuid not null references public.conversations on delete cascade,
  last_read bigint not null default 0,
  primary key (user_id, conversation_id)
);
alter table public.chat_reads enable row level security;
drop policy if exists "own reads" on public.chat_reads;
create policy "own reads" on public.chat_reads for select using (user_id = auth.uid());

drop function if exists public.my_conversations();
create function public.my_conversations()
returns table (id uuid, other uuid, other_name text, other_avatar text, other_nick text, last_at timestamptz, last_body text, last_sender uuid, last_kind text, unread integer)
language sql stable security definer set search_path = public as $$
  select c.id, o.id, o.display_name, o.avatar_url, o.nickname, c.last_at, lm.body, lm.sender,
    coalesce(lm.media_kind, case when lm.sticker is not null then 'sticker' when lm.gif is not null then 'gif' when lm.post_ref is not null then 'post' end),
    (select count(*)::int from public.messages m where m.conversation_id = c.id and m.sender <> auth.uid()
      and m.id > coalesce((select r.last_read from public.chat_reads r where r.user_id = auth.uid() and r.conversation_id = c.id), 0))
  from public.conversations c
  join public.profiles o on o.id = case when c.a = auth.uid() then c.b else c.a end
  left join lateral (select m.body, m.sender, m.media_kind, m.post_ref, m.sticker, m.gif from public.messages m where m.conversation_id = c.id order by m.id desc limit 1) lm on true
  where auth.uid() in (c.a, c.b) and public.is_friend(c.a, c.b) and not public.blocked_between(c.a, c.b)
  order by c.last_at desc limit 100;
$$;

create or replace function public.chat_mark_read(conv uuid) returns void
language plpgsql security definer set search_path = public as $$
declare top bigint;
begin
  if auth.uid() is null or not exists (select 1 from public.conversations c where c.id = conv and auth.uid() in (c.a, c.b)) then return; end if;
  select coalesce(max(m.id), 0) into top from public.messages m where m.conversation_id = conv;
  insert into public.chat_reads (user_id, conversation_id, last_read) values (auth.uid(), conv, top)
    on conflict (user_id, conversation_id) do update set last_read = greatest(public.chat_reads.last_read, excluded.last_read);
  update public.notifications n set read_at = now() where n.user_id = auth.uid() and n.read_at is null and n.tag in ('c:' || conv, 'cr:' || conv);
end $$;

-- ===================================================================== the help board: a question may carry a photo, a video or a recording
alter table public.posts add column if not exists media_path text;
alter table public.posts add column if not exists thumb_path text;
alter table public.posts add column if not exists media_kind text check (media_kind is null or media_kind in ('photo', 'video', 'audio'));
alter table public.posts add column if not exists media_meta jsonb not null default '{}'::jsonb check (char_length(media_meta::text) <= 2000);
create index if not exists posts_media on public.posts (media_path) where media_path is not null;
drop policy if exists "own files only" on public.posts;
create policy "own files only" on public.posts as restrictive for insert with check (
  (media_path is null or split_part(media_path, '/', 1) = auth.uid()::text)
  and (thumb_path is null or split_part(thumb_path, '/', 1) = auth.uid()::text)
  and ((media_path is null) = (media_kind is null)));

-- ===================================================================== reports know the feed
do $$ declare c text;
begin
  for c in select conname from pg_constraint where conrelid = 'public.reports'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%kind%' loop
    execute format('alter table public.reports drop constraint %I', c);
  end loop;
  alter table public.reports add constraint reports_kind_check check (kind in ('message', 'post', 'reply', 'user', 'feed', 'comment'));
end $$;

create or replace function public.report_content(item_kind text, item_ref text, why text) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); target uuid; quote text;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if item_kind = 'message' then
    select m.sender, left(coalesce(nullif(m.body, ''), '[' || coalesce(m.media_kind, case when m.sticker is not null then 'sticker' when m.gif is not null then 'gif' end, 'post') || '] ' || coalesce(m.media_path, m.gif, m.sticker, '')), 500) into target, quote
      from public.messages m join public.conversations c on c.id = m.conversation_id
      where m.id = item_ref::bigint and me in (c.a, c.b);
  elsif item_kind = 'post' then
    select p.author, left(p.title || E'\n' || coalesce(p.body, ''), 500) into target, quote from public.posts p where p.id = item_ref::bigint;
  elsif item_kind = 'reply' then
    select r.author, left(r.body, 500) into target, quote from public.replies r where r.id = item_ref::bigint;
  elsif item_kind = 'user' then
    select p.id, coalesce(p.display_name, '') || coalesce(' @' || p.nickname, '') into target, quote from public.profiles p where p.id = item_ref::uuid;
  elsif item_kind = 'feed' then
    select p.author, left('[' || p.kind || '] ' || p.caption || coalesce(E'\n' || p.media_path, ''), 500) into target, quote
      from public.feed_posts p where p.id = item_ref::bigint and public.can_see_post(p.author, p.visibility);
  elsif item_kind = 'comment' then
    select k.author, left(k.body, 500) into target, quote from public.feed_comments k where k.id = item_ref::bigint and public.post_visible(k.post_id);
  else
    raise exception 'invalid-kind';
  end if;
  if target is null then raise exception 'not-found'; end if;
  if target = me then raise exception 'own-content'; end if;
  insert into public.reports (reporter, target_user, kind, item_id, excerpt, reason)
    values (me, target, item_kind, item_ref, quote, why)
    on conflict (reporter, kind, item_id) where status = 'open' do nothing;
end $$;

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
    elsif r.kind = 'feed' then delete from public.feed_posts p where p.id = r.item_id::bigint;
    elsif r.kind = 'comment' then delete from public.feed_comments k where k.id = r.item_id::bigint;
    end if;
  end if;
  if decision = 'ban' and r.target_user is not null then
    insert into public.community_bans (user_id, banned_by) values (r.target_user, auth.uid()) on conflict do nothing;
  end if;
  update public.reports x set status = case when decision = 'dismiss' then 'dismissed' else 'actioned' end, resolved_at = now(), resolved_by = auth.uid()
    where x.status = 'open' and x.kind = r.kind and x.item_id = r.item_id;
end $$;

-- ===================================================================== notifications: Sima writes them, the push function delivers them
create table if not exists public.notify_settings (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  enabled boolean not null default true,
  kinds jsonb not null default '{}'::jsonb check (jsonb_typeof(kinds) = 'object' and char_length(kinds::text) <= 400),
  quiet boolean not null default true,
  hour integer not null default 19 check (hour between 0 and 23),
  tz text not null default 'Asia/Tbilisi' check (char_length(tz) <= 64),
  lang text not null default 'ka' check (char_length(lang) <= 12),
  goal_min integer not null default 15 check (goal_min between 1 and 240),
  last_practice timestamptz,
  streak integer not null default 0 check (streak between 0 and 10000),
  week_min integer not null default 0 check (week_min between 0 and 20000),
  todo jsonb not null default '[]'::jsonb check (jsonb_typeof(todo) = 'array' and char_length(todo::text) <= 1500),
  updated_at timestamptz not null default now(),
  reminded_on date,       -- the server's own bookkeeping below: members cannot write it
  weekly_on date,
  streak_told integer not null default 0
);
alter table public.notify_settings enable row level security;
drop policy if exists "own settings" on public.notify_settings;
create policy "own settings" on public.notify_settings for select using (user_id = auth.uid());
drop policy if exists "own settings remove" on public.notify_settings;
create policy "own settings remove" on public.notify_settings for delete using (user_id = auth.uid());

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  kind text not null,
  actor uuid references auth.users on delete set null,
  params jsonb not null default '{}'::jsonb,
  title text not null,
  body text not null default '',
  go text,
  tag text,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  pushed_at timestamptz,
  push_tries integer not null default 0
);
create index if not exists notifications_user on public.notifications (user_id, id desc);
create index if not exists notifications_unpushed on public.notifications (created_at) where pushed_at is null;
alter table public.notifications enable row level security;
drop policy if exists "own notifications" on public.notifications;
create policy "own notifications" on public.notifications for select using (user_id = auth.uid());

-- every device this account is signed in on and has allowed notifications: one row each
create table if not exists public.push_devices (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  kind text not null check (kind in ('web', 'fcm', 'apns')),
  endpoint text not null unique check (char_length(endpoint) between 10 and 1000),
  p256dh text check (char_length(p256dh) <= 200),
  auth text check (char_length(auth) <= 100),
  lang text check (char_length(lang) <= 12),
  label text check (char_length(label) <= 120),
  created_at timestamptz not null default now(),
  last_ok timestamptz,
  fails integer not null default 0
);
create index if not exists push_devices_user on public.push_devices (user_id);
alter table public.push_devices enable row level security;
drop policy if exists "own devices" on public.push_devices;
create policy "own devices" on public.push_devices for select using (user_id = auth.uid());

-- server-only values (the push function's address, its generated keys); no member can read this table
create table if not exists public.server_config (key text primary key, value text not null);
alter table public.server_config enable row level security;

create table if not exists public.app_releases (
  version text primary key check (char_length(version) between 1 and 40),
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users on delete set null
);
alter table public.app_releases enable row level security;
drop policy if exists "members read releases" on public.app_releases;
create policy "members read releases" on public.app_releases for select using (auth.uid() is not null);

/** the reaction as text, for the lock screen (the panduri has no emoji of its own: the closest one stands in) */
create or replace function public.sima_emoji(k text) returns text
language sql immutable as $$
  select case k when 'panduri' then '🪕' when 'heart' then '❤️' when 'fire' then '🔥' when 'clap' then '👏' when 'laugh' then '😂' when 'wow' then '😮' when 'sad' then '😢' else '' end;
$$;

/** Sima's words. The app shows the same notifications from its own translations; these are for the lock screen.
    Present-tense verbs keep the person's name in the nominative, so no name is ever declined wrongly. */
create or replace function public.sima_text(kind text, p jsonb, lang text, out title text, out body text)
language plpgsql immutable as $$
declare
  en boolean := coalesce(lang, 'ka') <> 'ka';
  n text := coalesce(nullif(p->>'name', ''), case when en then 'Someone' else 'ვიღაც' end);
  w text := coalesce(p->>'what', 'message');
  e text := public.sima_emoji(p->>'e');
  s text := left(coalesce(p->>'s', ''), 120);
  more integer := coalesce((p->>'more')::int, 0);
  num text := coalesce(p->>'n', '');
  on_ka text; dat_ka text; erg_ka text; nom_ka text; w_en text; items text := ''; it jsonb;
begin
  on_ka := case w when 'photo' then 'ფოტოზე' when 'video' then 'ვიდეოზე' when 'audio' then case when kind = 'chat_reaction' then 'აუდიოზე' else 'მუსიკაზე' end when 'text' then 'პოსტზე' else 'შეტყობინებაზე' end;
  dat_ka := case w when 'photo' then 'ფოტოს' when 'video' then 'ვიდეოს' when 'audio' then 'მუსიკას' else 'პოსტს' end;
  erg_ka := case w when 'photo' then 'ფოტომ' when 'video' then 'ვიდეომ' when 'audio' then 'მუსიკამ' else 'პოსტმა' end;
  nom_ka := case w when 'photo' then 'ფოტო' when 'video' then 'ვიდეო' when 'audio' then 'მუსიკა' else 'პოსტი' end;
  w_en := case w when 'photo' then 'photo' when 'video' then 'video' when 'audio' then case when kind = 'chat_reaction' then 'audio' else 'music' end when 'text' then 'post' else 'message' end;
  if s = '' and kind = 'message' then
    s := case w when 'photo' then case when en then '📷 Photo' else '📷 ფოტო' end when 'video' then case when en then '🎬 Video' else '🎬 ვიდეო' end
      when 'audio' then case when en then '🎵 Audio' else '🎵 აუდიო' end when 'post' then case when en then '🔗 A post' else '🔗 პოსტი' end
      when 'sticker' then case when en then '🪕 Sticker' else '🪕 სტიკერი' end when 'gif' then 'GIF' else '' end;
  end if;
  if jsonb_typeof(p->'todo') = 'array' then
    for it in select x from jsonb_array_elements(p->'todo') x limit 3 loop
      items := items || case when items = '' then '' else ' · ' end || case it->>'k'
        when 'exam' then case when en then 'exam “' else 'გამოცდა „' end
        when 'song' then case when en then 'song “' else 'სიმღერა „' end
        when 'theory' then case when en then 'theory review: “' else 'თეორიის გამეორება: „' end
        when 'chapter' then case when en then 'theory “' else 'თეორია „' end
        else case when en then 'lesson “' else 'გაკვეთილი „' end end || left(coalesce(it->>'s', ''), 60) || case when en then '”' else '“' end;
    end loop;
  end if;
  case kind
    when 'message' then title := case when en then 'Sima · New message' else 'სიმა · ახალი წერილი' end;
      body := case when en then n || ' writes: “' || s || '”' else n || ' გწერს: „' || s || '“' end;
    when 'chat_reaction' then title := case when en then 'Sima · Reaction' else 'სიმა · რეაქცია' end;
      body := case when en then n || ' reacted ' || e || ' to your ' || w_en else n || ' რეაგირებს შენს ' || on_ka || ': ' || e end;
    when 'post_reaction' then title := case when en then 'Sima · Reaction' else 'სიმა · რეაქცია' end;
      body := case when more > 0 then case when en then n || ' and ' || more || ' others reacted to your ' || w_en || ' ' || e else n || ' და კიდევ ' || more || ' რეაგირებენ შენს ' || on_ka || ' ' || e end
        else case when en then n || ' reacted ' || e || ' to your ' || w_en else n || ' რეაგირებს შენს ' || on_ka || ': ' || e end end;
    when 'comment' then title := case when en then 'Sima · New comment' else 'სიმა · ახალი კომენტარი' end;
      body := case when en then n || ' commented on your ' || w_en || ': “' || s || '”' else n || ' წერს შენს ' || on_ka || ': „' || s || '“' end;
    when 'friend_post' then title := case when en then 'Sima · A friend posted' else 'სიმა · მეგობრის ახალი პოსტი' end;
      body := case when en then n || ' shared a new ' || w_en || case when s <> '' then ': “' || s || '”' else ' — take a look!' end
        else n || ' ახალ ' || dat_ka || ' აზიარებს' || case when s <> '' then ': „' || s || '“' else ' — ნახე!' end end;
    when 'friend_request' then title := case when en then 'Sima · Friend request' else 'სიმა · მეგობრობის თხოვნა' end;
      body := case when en then n || coalesce(' (@' || (p->>'nick') || ')', '') || ' wants to be your friend.' else n || coalesce(' (@' || (p->>'nick') || ')', '') || ' მეგობრობას გთხოვს.' end;
    when 'friend_accept' then title := case when en then 'Sima · New friend' else 'სიმა · ახალი მეგობარი' end;
      body := case when en then n || ' is your friend now — say hello!' else n || ' უკვე შენი მეგობარია — მიწერე!' end;
    when 'record' then title := case when en then 'Sima · New record 🏆' else 'სიმა · ახალი რეკორდი 🏆' end;
      body := case when en then 'Your ' || w_en || ' just reached ' || num || ' ' || case p->>'metric' when 'views' then 'views' when 'comments' then 'comments' else 'reactions' end || '!'
        else 'შენმა ' || erg_ka || ' ' || num || ' ' || case p->>'metric' when 'views' then 'ნახვას' when 'comments' then 'კომენტარს' else 'რეაქციას' end || ' მიაღწია!' end;
    when 'record_app' then title := case when en then 'Sima · App record 🏆' else 'სიმა · აპის რეკორდი 🏆' end;
      body := case when en then 'Your ' || w_en || ' now has the most reactions in the whole app!' else 'შენს ' || dat_ka || ' ახლა მთელ აპში ყველაზე მეტი რეაქცია აქვს!' end;
    when 'record_top' then title := case when en then 'Sima · Top of the day ⭐' else 'სიმა · დღის საუკეთესო ⭐' end;
      body := case when en then 'Your ' || w_en || ' is the most popular in the global feed today — new members see it first!'
        else 'შენი ' || nom_ka || ' დღეს გლობალურ ფიდში ყველაზე პოპულარულია — ახალი მომხმარებლები მას პირველს ნახულობენ!' end;
    when 'reminder' then title := case when en then 'Sima · Today''s practice' else 'სიმა · დღის საქმე' end;
      body := case when coalesce((p->>'streak')::int, 0) >= 3
          then case when en then (p->>'streak') || ' days in a row — today is still open.' else (p->>'streak') || ' დღეა ზედიზედ ვარჯიშობ — დღეს ჯერ არ გიკრავს.' end
          else case when en then 'You have not played yet today — even ' || coalesce(p->>'m', '10') || ' minutes counts.' else 'დღეს ჯერ არ გივარჯიშია — ' || coalesce(p->>'m', '10') || ' წუთიც საკმარისია.' end end
        || case when items <> '' then case when en then ' Waiting for you: ' else ' გელოდება: ' end || items else '' end;
    when 'idle' then title := case when en then 'Sima · I miss you' else 'სიმა · მომენატრე' end;
      body := case when en then 'You have not practised for ' || num || ' days. Even 10 minutes today is enough.' else num || ' დღეა არ გივარჯიშია. დღეს 10 წუთიც კი საკმარისია.' end
        || case when items <> '' then case when en then ' Waiting for you: ' else ' გელოდება: ' end || items else '' end;
    when 'streak' then title := case when en then 'Sima · ' || num || ' days in a row 🔥' else 'სიმა · ' || num || ' დღე ზედიზედ 🔥' end;
      body := case when en then 'Well done! ' || num || ' days of practice in a row. Keep it going!' else 'ყოჩაღ! ' || num || ' დღეა ზედიზედ ვარჯიშობ. ასე გააგრძელე!' end;
    when 'weekly' then title := case when en then 'Sima · Your week' else 'სიმა · კვირის შეჯამება' end;
      body := case when coalesce((p->>'m')::int, 0) > 0
        then case when en then 'This week you practised ' || (p->>'m') || ' minutes. A new week starts tomorrow.' else 'ამ კვირაში ' || (p->>'m') || ' წუთი ივარჯიშე. ხვალ ახალი კვირა იწყება.' end
        else case when en then 'No practice this week — a new week is a fresh start.' else 'ამ კვირაში არ გივარჯიშია — ახალი კვირა ახალი დასაწყისია.' end end;
    when 'update' then title := case when en then 'Sima · The app has been updated ✨' else 'სიმა · აპი განახლდა ✨' end;
      body := case when en then 'Version ' || coalesce(p->>'v', '') || ': ' || coalesce(nullif(p->>'s', ''), 'open it to see what is new.') else 'ვერსია ' || coalesce(p->>'v', '') || ': ' || coalesce(nullif(p->>'s', ''), 'გახსენი და ნახე, რა შეიცვალა.') end;
    when 'test' then title := case when en then 'Sima · Notifications work ✓' else 'სიმა · შეტყობინებები მუშაობს ✓' end;
      body := case when en then 'This is how my notifications reach every device you are signed in on.' else 'ასე მოგივა ჩემი შეტყობინებები ყველა მოწყობილობაზე, სადაც შესული ხარ.' end;
    else title := case when en then 'Sima' else 'სიმა' end; body := s;
  end case;
  body := left(body, 300);
end $$;

/** the one door every notification goes through. collapse: an unread one with the same tag is replaced (one row per chat, one per post's reactions) */
create or replace function public.sima_notify(target uuid, kind text, actor uuid, params jsonb, go text, tag text, collapse boolean default false) returns bigint
language plpgsql security definer set search_path = public as $$
declare lg text; t record; prev public.notifications%rowtype; p jsonb := coalesce(params, '{}'::jsonb); nid bigint;
begin
  if target is null or (actor is not null and (actor = target or public.blocked_between(target, actor))) then return null; end if;
  select s.lang into lg from public.notify_settings s where s.user_id = target;
  if collapse and tag is not null then
    select * into prev from public.notifications x where x.user_id = target and x.tag = sima_notify.tag and x.read_at is null order by x.id desc limit 1;
    if found then
      if kind = 'post_reaction' and prev.actor is distinct from actor then p := p || jsonb_build_object('more', coalesce((prev.params->>'more')::int, 0) + 1); end if;
      delete from public.notifications x where x.id = prev.id;
    end if;
  end if;
  select * into t from public.sima_text(kind, p, coalesce(lg, 'ka'));
  insert into public.notifications (user_id, kind, actor, params, title, body, go, tag) values (target, kind, actor, p, t.title, t.body, go, tag) returning id into nid;
  return nid;
end $$;

create or replace function public.display_of(uid uuid) returns text
language sql stable security definer set search_path = public as $$
  select coalesce(nullif(p.display_name, ''), '@' || p.nickname, '') from public.profiles p where p.id = uid;
$$;

-- 1 · a friend wrote to me
create or replace function public.notify_message() returns trigger
language plpgsql security definer set search_path = public as $$
declare c public.conversations%rowtype; other uuid;
begin
  select * into c from public.conversations x where x.id = new.conversation_id;
  other := case when c.a = new.sender then c.b else c.a end;
  perform public.sima_notify(other, 'message', new.sender,
    jsonb_build_object('name', public.display_of(new.sender), 's', left(new.body, 120), 'what', coalesce(new.media_kind, case when new.sticker is not null then 'sticker' when new.gif is not null then 'gif' when new.post_ref is not null then 'post' end, 'text'), 'conv', new.conversation_id),
    'community:c:' || new.conversation_id || ':' || coalesce(public.display_of(new.sender), ''), 'c:' || new.conversation_id, true);
  return new;
end $$;
drop trigger if exists messages_notify on public.messages;
create trigger messages_notify after insert on public.messages for each row execute function public.notify_message();

-- 2 · a friend reacted to my photo, video, audio or message in a chat
create or replace function public.notify_message_reaction() returns trigger
language plpgsql security definer set search_path = public as $$
declare m public.messages%rowtype;
begin
  if tg_op = 'UPDATE' and new.emoji = old.emoji then return new; end if;
  select * into m from public.messages x where x.id = new.message_id;
  perform public.sima_notify(m.sender, 'chat_reaction', new.user_id,
    jsonb_build_object('name', public.display_of(new.user_id), 'e', new.emoji, 'what', coalesce(m.media_kind, 'message'), 'conv', m.conversation_id),
    'community:c:' || m.conversation_id || ':' || coalesce(public.display_of(new.user_id), ''), 'cr:' || m.conversation_id, true);
  return new;
end $$;
drop trigger if exists message_reactions_notify on public.message_reactions;
create trigger message_reactions_notify after insert or update on public.message_reactions for each row execute function public.notify_message_reaction();

-- 3 · a friend posted a photo, video or music
create or replace function public.notify_new_post() returns trigger
language plpgsql security definer set search_path = public as $$
declare f uuid; nm text := public.display_of(new.author);
begin
  for f in select case when x.a = new.author then x.b else x.a end from public.friendships x
    where new.author in (x.a, x.b) and x.status = 'accepted' loop
    perform public.sima_notify(f, 'friend_post', new.author, jsonb_build_object('name', nm, 'what', new.kind, 's', left(new.caption, 80), 'post', new.id),
      'community:p:' || new.id, 'fp:' || new.id);
  end loop;
  return new;
end $$;
drop trigger if exists feed_posts_notify on public.feed_posts;
create trigger feed_posts_notify after insert on public.feed_posts for each row execute function public.notify_new_post();

-- 4 · records: a post passes a milestone, beats every other post in the app, or is the day's most popular
create or replace function public.post_milestone(pid bigint, metric text, val integer) returns void
language plpgsql security definer set search_path = public as $$
declare th integer[]; p public.feed_posts%rowtype;
begin
  th := case metric when 'reactions' then '{10,25,50,100,250,500,1000,2500,5000,10000}'::int[]
    when 'views' then '{100,500,1000,5000,10000,50000,100000,500000,1000000}'::int[]
    when 'comments' then '{10,50,100,500,1000}'::int[] else '{}'::int[] end;
  if not (val = any (th)) then return; end if;
  insert into public.post_milestones (post_id, metric, n) values (pid, metric, val) on conflict do nothing;
  if not found then return; end if;
  select * into p from public.feed_posts x where x.id = pid;
  perform public.sima_notify(p.author, 'record', null, jsonb_build_object('what', p.kind, 'metric', metric, 'n', val, 'post', pid), 'community:p:' || pid, 'rec:' || pid || ':' || metric);
end $$;

create or replace function public.count_post_reaction() returns trigger
language plpgsql security definer set search_path = public as $$
declare n integer; p public.feed_posts%rowtype;
begin
  if tg_op = 'DELETE' then update public.feed_posts x set reactions = greatest(x.reactions - 1, 0) where x.id = old.post_id; return old; end if;
  if tg_op = 'INSERT' then
    update public.feed_posts x set reactions = x.reactions + 1 where x.id = new.post_id returning * into p;
    n := p.reactions;
    perform public.post_milestone(new.post_id, 'reactions', n);
    if n >= 10 and n > coalesce((select max(x.reactions) from public.feed_posts x where x.id <> new.post_id), 0) then
      insert into public.post_milestones (post_id, metric, n) values (new.post_id, 'app_top', 0) on conflict do nothing;
      if found then perform public.sima_notify(p.author, 'record_app', null, jsonb_build_object('what', p.kind, 'post', p.id), 'community:p:' || p.id, 'rec:' || p.id || ':app'); end if;
    end if;
  else
    if new.emoji = old.emoji then return new; end if;
    select * into p from public.feed_posts x where x.id = new.post_id;
  end if;
  perform public.sima_notify(p.author, 'post_reaction', new.user_id, jsonb_build_object('name', public.display_of(new.user_id), 'e', new.emoji, 'what', p.kind, 'post', p.id),
    'community:p:' || p.id, 'pr:' || p.id, true);
  return new;
end $$;
drop trigger if exists feed_reactions_count on public.feed_reactions;
create trigger feed_reactions_count after insert or update or delete on public.feed_reactions for each row execute function public.count_post_reaction();

create or replace function public.count_comment() returns trigger
language plpgsql security definer set search_path = public as $$
declare p public.feed_posts%rowtype;
begin
  if tg_op = 'DELETE' then update public.feed_posts x set comments = greatest(x.comments - 1, 0) where x.id = old.post_id; return old; end if;
  update public.feed_posts x set comments = x.comments + 1 where x.id = new.post_id returning * into p;
  perform public.post_milestone(p.id, 'comments', p.comments);
  perform public.sima_notify(p.author, 'comment', new.author, jsonb_build_object('name', coalesce(new.author_name, public.display_of(new.author)), 's', left(new.body, 120), 'what', p.kind, 'post', p.id),
    'community:p:' || p.id, 'cm:' || p.id, true);
  return new;
end $$;
drop trigger if exists feed_comments_count on public.feed_comments;
create trigger feed_comments_count after insert or delete on public.feed_comments for each row execute function public.count_comment();

/** once a day: the author of the most popular post of the last 24 hours hears it from Sima */
create or replace function public.sima_daily_top() returns void
language plpgsql security definer set search_path = public as $$
declare p public.feed_posts%rowtype; day integer := to_char(now(), 'YYYYMMDD')::int;
begin
  select * into p from public.feed_posts x where x.visibility = 'public' and x.created_at > now() - interval '24 hours' and x.reactions + x.comments >= 3
    order by x.reactions * 2 + x.comments * 3 + x.shares * 4 + x.views * 0.1 desc limit 1;
  if not found then return; end if;
  insert into public.post_milestones (post_id, metric, n) values (p.id, 'day_top', day) on conflict do nothing;
  if found then perform public.sima_notify(p.author, 'record_top', null, jsonb_build_object('what', p.kind, 'post', p.id), 'community:p:' || p.id, 'rec:' || p.id || ':day'); end if;
end $$;

-- 5 · a friend request, and its acceptance
create or replace function public.notify_friendship() returns trigger
language plpgsql security definer set search_path = public as $$
declare other uuid;
begin
  if tg_op = 'INSERT' and new.status = 'pending' then
    other := case when new.a = new.requester then new.b else new.a end;
    perform public.sima_notify(other, 'friend_request', new.requester,
      jsonb_build_object('name', public.display_of(new.requester), 'nick', (select nickname from public.profiles where id = new.requester)), 'community:friends', 'fr:' || new.requester, true);
  elsif tg_op = 'UPDATE' and new.status = 'accepted' and old.status = 'pending' then
    other := case when new.a = new.requester then new.b else new.a end;
    perform public.sima_notify(new.requester, 'friend_accept', other, jsonb_build_object('name', public.display_of(other)), 'community:friends', 'fa:' || other, true);
    update public.notifications n set read_at = now() where n.user_id = other and n.tag = 'fr:' || new.requester and n.read_at is null;
  end if;
  return new;
end $$;
drop trigger if exists friendships_notify on public.friendships;
create trigger friendships_notify after insert or update on public.friendships for each row execute function public.notify_friendship();

-- 6 · a practice streak that reaches 3, 7, 14, 30, 50, 100, 200 or 365 days (the app reports the streak when it syncs)
create or replace function public.notify_settings_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare m integer;
begin
  if auth.uid() is null then return new; end if;   -- the server's own bookkeeping (cron, the push function)
  new.user_id := auth.uid();
  new.updated_at := now();
  begin perform now() at time zone new.tz; exception when others then new.tz := 'Asia/Tbilisi'; end;
  if tg_op = 'UPDATE' then new.reminded_on := old.reminded_on; new.weekly_on := old.weekly_on; new.streak_told := old.streak_told;
  else new.reminded_on := null; new.weekly_on := null; new.streak_told := 0; end if;
  select max(x) into m from unnest('{3,7,14,30,50,100,200,365}'::int[]) x where x <= new.streak;
  if m is not null and m > new.streak_told then
    new.streak_told := m;
    if tg_op = 'UPDATE' and coalesce(new.kinds->>'practice', 'true') <> 'false' then
      perform public.sima_notify(new.user_id, 'streak', null, jsonb_build_object('n', m), 'daily', 'streak');
    end if;
  elsif new.streak < new.streak_told then new.streak_told := (select coalesce(max(x), 0) from unnest('{3,7,14,30,50,100,200,365}'::int[]) x where x <= new.streak);
  end if;
  return new;
end $$;
drop trigger if exists notify_settings_guard on public.notify_settings;
create trigger notify_settings_guard before insert or update on public.notify_settings for each row execute function public.notify_settings_guard();

-- 7 · the daily reminder at the member's own hour, in their own time zone: what is left to do (an exam, a song, a theory chapter);
--     and, after 3, 5, 7, 14 and 30 days away, a come-back note. Every 15 minutes; once a day at most.
create or replace function public.sima_reminders() returns integer
language plpgsql security definer set search_path = public as $$
declare r record; lt timestamp; today date; idle integer; sent integer := 0;
begin
  for r in select s.* from public.notify_settings s where s.enabled loop
    lt := now() at time zone r.tz; today := lt::date;
    -- the weekly summary: Sunday, at the reminder hour
    if extract(dow from lt) = 0 and extract(hour from lt) = r.hour and r.weekly_on is distinct from today and coalesce(r.kinds->>'practice', 'true') <> 'false' then
      perform public.sima_notify(r.user_id, 'weekly', null, jsonb_build_object('m', r.week_min), 'progress', 'weekly');
      update public.notify_settings s set weekly_on = today where s.user_id = r.user_id;
    end if;
    if extract(hour from lt) <> r.hour or r.reminded_on is not distinct from today then continue; end if;
    idle := case when r.last_practice is null then null else today - (r.last_practice at time zone r.tz)::date end;
    if idle = 0 then continue; end if;                                   -- already played today
    if idle is not null and idle >= 3 then
      if idle not in (3, 5, 7, 14, 30) or coalesce(r.kinds->>'idle', 'true') = 'false' then continue; end if;
      perform public.sima_notify(r.user_id, 'idle', null, jsonb_build_object('n', idle, 'todo', r.todo), 'home', 'reminder');
    else
      if coalesce(r.kinds->>'practice', 'true') = 'false' then continue; end if;
      perform public.sima_notify(r.user_id, 'reminder', null, jsonb_build_object('streak', r.streak, 'm', r.goal_min, 'todo', r.todo), 'daily', 'reminder');
    end if;
    update public.notify_settings s set reminded_on = today where s.user_id = r.user_id;
    sent := sent + 1;
  end loop;
  return sent;
end $$;

-- 8 · a new version: the owner announces it once, and every member hears it from Sima
create or replace function public.announce_release(version text, note_ka text default '', note_en text default '') returns integer
language plpgsql security definer set search_path = public as $$
declare u record; n integer := 0;
begin
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if char_length(trim(coalesce(version, ''))) not between 1 and 40 then raise exception 'invalid-version'; end if;
  insert into public.app_releases (version, notes, created_by) values (trim(version), jsonb_build_object('ka', left(coalesce(note_ka, ''), 240), 'en', left(coalesce(note_en, ''), 240)), auth.uid());
  for u in select p.id, coalesce(s.lang, 'ka') as lang from public.profiles p left join public.notify_settings s on s.user_id = p.id loop
    perform public.sima_notify(u.id, 'update', null, jsonb_build_object('v', trim(version), 's', left(case when u.lang = 'ka' then coalesce(nullif(note_ka, ''), note_en) else coalesce(nullif(note_en, ''), note_ka) end, 240)), 'settings', 'update');
    n := n + 1;
  end loop;
  return n;
end $$;

/** the test button in Settings: one notification to all of my devices, at most once a minute */
create or replace function public.sima_test() returns bigint
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  if exists (select 1 from public.notifications n where n.user_id = auth.uid() and n.kind = 'test' and n.created_at > now() - interval '1 minute') then raise exception 'slow-down'; end if;
  return public.sima_notify(auth.uid(), 'test', null, '{}'::jsonb, 'settings', 'test');
end $$;

/** what this account wants to be told, and what the app knows about its practice (the reminder needs both) */
create or replace function public.save_notify_settings(s jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  insert into public.notify_settings (user_id) values (auth.uid()) on conflict (user_id) do nothing;
  update public.notify_settings x set
    enabled = coalesce((s->>'enabled')::boolean, x.enabled),
    kinds = case when jsonb_typeof(s->'kinds') = 'object' then s->'kinds' else x.kinds end,
    quiet = coalesce((s->>'quiet')::boolean, x.quiet),
    hour = coalesce((s->>'hour')::int, x.hour),
    tz = coalesce(nullif(s->>'tz', ''), x.tz),
    lang = coalesce(nullif(s->>'lang', ''), x.lang),
    goal_min = coalesce((s->>'goal_min')::int, x.goal_min),
    last_practice = greatest(x.last_practice, nullif(s->>'last_practice', '')::timestamptz),
    streak = coalesce((s->>'streak')::int, x.streak),
    week_min = coalesce((s->>'week_min')::int, x.week_min),
    todo = case when jsonb_typeof(s->'todo') = 'array' then s->'todo' else x.todo end
  where x.user_id = auth.uid();
end $$;

/** ids: the ones read (null: all of them). Returns which of the asked-about ones are read, on any device. */
drop function if exists public.notifications_read(bigint);
create or replace function public.notifications_read(ids bigint[] default null) returns void
language sql security definer set search_path = public as $$
  update public.notifications n set read_at = now() where n.user_id = auth.uid() and n.read_at is null and (ids is null or n.id = any (ids));
$$;
create or replace function public.notifications_clear() returns void
language sql security definer set search_path = public as $$
  delete from public.notifications n where n.user_id = auth.uid();
$$;

/** this device, for this account: the same address moves to whoever signs in on it */
create or replace function public.push_register(device_kind text, device_endpoint text, key_p256dh text default null, key_auth text default null, device_lang text default null, device_label text default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  if device_kind = 'web' and (device_endpoint !~ '^https://' or key_p256dh is null or key_auth is null) then raise exception 'invalid-subscription'; end if;
  if (select count(*) from public.push_devices d where d.user_id = auth.uid()) >= 20 then
    delete from public.push_devices d where d.id = (select x.id from public.push_devices x where x.user_id = auth.uid() order by coalesce(x.last_ok, x.created_at) limit 1);
  end if;
  insert into public.push_devices (user_id, kind, endpoint, p256dh, auth, lang, label)
    values (auth.uid(), device_kind, device_endpoint, key_p256dh, key_auth, left(device_lang, 12), left(device_label, 120))
    on conflict (endpoint) do update set user_id = auth.uid(), kind = excluded.kind, p256dh = excluded.p256dh, auth = excluded.auth, lang = excluded.lang, label = excluded.label, fails = 0;
end $$;
create or replace function public.push_unregister(device_endpoint text) returns void
language sql security definer set search_path = public as $$
  delete from public.push_devices d where d.endpoint = device_endpoint and d.user_id = auth.uid();
$$;

-- ---------------------------------------------------------------- delivery: the database calls the push function
create or replace function public.push_hook_secret() returns text
language plpgsql stable security definer set search_path = public as $$
declare s text;
begin
  if to_regnamespace('vault') is null then return null; end if;
  execute 'select decrypted_secret from vault.decrypted_secrets where name = ''push_hook_secret'' limit 1' into s;
  return s;
end $$;

create or replace function public.push_call(ids bigint[]) returns void
language plpgsql security definer set search_path = public as $$
declare url text; secret text;
begin
  if ids is null or array_length(ids, 1) is null or to_regnamespace('net') is null then return; end if;
  select value into url from public.server_config where key = 'push_url';
  secret := public.push_hook_secret();
  if url is null or secret is null then return; end if;
  execute 'select net.http_post(url := $1, body := $2, headers := $3, timeout_milliseconds := 20000)'
    using url, jsonb_build_object('ids', to_jsonb(ids)), jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', secret);
end $$;

create or replace function public.push_after_insert() returns trigger
language plpgsql security definer set search_path = public as $$
declare chunk bigint[];
begin
  for chunk in select array_agg(id) from (select id, (row_number() over (order by id) - 1) / 200 as g from fresh) x group by g loop
    perform public.push_call(chunk);
  end loop;
  return null;
end $$;
drop trigger if exists notifications_push on public.notifications;
create trigger notifications_push after insert on public.notifications referencing new table as fresh for each statement execute function public.push_after_insert();

/** what did not go out (the function was down, the network failed) is tried again, three times at most, for six hours */
create or replace function public.push_sweep() returns void
language plpgsql security definer set search_path = public as $$
declare ids bigint[];
begin
  with due as (
    update public.notifications n set push_tries = n.push_tries + 1
    where n.id in (select x.id from public.notifications x where x.pushed_at is null and x.push_tries < 3
      and x.created_at < now() - interval '1 minute' and x.created_at > now() - interval '6 hours' order by x.id limit 500)
    returning n.id)
  select array_agg(id) into ids from due;
  perform public.push_call(ids);
end $$;

-- ===================================================================== storage: the members' photos, videos and audio
/** a file may be read by its owner, and by whoever can see the post or the chat that carries it */
create or replace function public.can_read_media(path text) returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null and (
    split_part(path, '/', 1) = auth.uid()::text
    or exists (select 1 from public.feed_posts p where (p.media_path = path or p.thumb_path = path) and public.can_see_post(p.author, p.visibility))
    or exists (select 1 from public.messages m join public.conversations c on c.id = m.conversation_id
      where (m.media_path = path or m.thumb_path = path) and auth.uid() in (c.a, c.b))
    or exists (select 1 from public.posts q where (q.media_path = path or q.thumb_path = path)
      and not public.blocked_between(auth.uid(), q.author)));
$$;

do $$ begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('social', 'social', false, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/x-m4a', 'audio/flac'])
    on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
    execute 'drop policy if exists "social upload own" on storage.objects';
    execute 'create policy "social upload own" on storage.objects for insert to authenticated with check (bucket_id = ''social'' and (storage.foldername(name))[1] = auth.uid()::text and not public.community_banned(auth.uid()))';
    execute 'drop policy if exists "social read visible" on storage.objects';
    execute 'create policy "social read visible" on storage.objects for select to authenticated using (bucket_id = ''social'' and public.can_read_media(name))';
    execute 'drop policy if exists "social delete own" on storage.objects';
    execute 'create policy "social delete own" on storage.objects for delete to authenticated using (bucket_id = ''social'' and (storage.foldername(name))[1] = auth.uid()::text)';
  end if;
end $$;

/** files no post, message or question uses any more (deleted by a moderator, an upload whose post was never saved):
    the push function removes them through the Storage API once a day */
do $$ begin
  if to_regclass('storage.objects') is not null then
    execute $f$
      create or replace function public.orphan_media(lim integer default 500) returns setof text
      language sql stable security definer set search_path = public as $q$
        select o.name from storage.objects o
        where o.bucket_id = 'social' and o.created_at < now() - interval '1 day'
          and not exists (select 1 from public.feed_posts p where p.media_path = o.name or p.thumb_path = o.name)
          and not exists (select 1 from public.messages m where m.media_path = o.name or m.thumb_path = o.name)
          and not exists (select 1 from public.posts q where q.media_path = o.name or q.thumb_path = o.name)
        order by o.created_at limit least(lim, 1000);
      $q$ $f$;
    execute 'revoke all on function public.orphan_media(integer) from public, anon, authenticated';
    if exists (select 1 from pg_roles where rolname = 'service_role') then execute 'grant execute on function public.orphan_media(integer) to service_role'; end if;
  end if;
end $$;
create or replace function public.media_cleanup() returns void
language plpgsql security definer set search_path = public as $$
declare url text; secret text;
begin
  if to_regnamespace('net') is null then return; end if;
  select value into url from public.server_config where key = 'push_url';
  secret := public.push_hook_secret();
  if url is null or secret is null then return; end if;
  execute 'select net.http_post(url := $1, body := $2, headers := $3, timeout_milliseconds := 30000)'
    using url, '{"cleanup": true}'::jsonb, jsonb_build_object('Content-Type', 'application/json', 'x-push-secret', secret);
end $$;

-- ===================================================================== the hosted server: pg_net, the hook secret, the schedule
insert into public.server_config (key, value) values ('push_url', 'https://tecynfffgjgrcafmfqty.supabase.co/functions/v1/push') on conflict (key) do nothing;
do $$ begin
  if exists (select 1 from pg_available_extensions where name = 'pg_net') then create extension if not exists pg_net with schema extensions; end if;
  if to_regnamespace('vault') is not null then
    if not exists (select 1 from vault.secrets where name = 'push_hook_secret') then
      perform vault.create_secret(replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''), 'push_hook_secret', 'the database → push function');
    end if;
  end if;
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron with schema pg_catalog;
    perform cron.schedule('sima-reminders', '*/15 * * * *', 'select public.sima_reminders()');
    perform cron.schedule('sima-push-sweep', '*/5 * * * *', 'select public.push_sweep()');
    perform cron.schedule('sima-daily-top', '0 14 * * *', 'select public.sima_daily_top()');
    perform cron.schedule('social-media-cleanup', '30 3 * * *', 'select public.media_cleanup()');
  end if;
end $$;

-- ===================================================================== access
grant select on public.friendships, public.feed_reactions, public.message_reactions, public.chat_reads, public.notifications, public.push_devices, public.app_releases to authenticated;
grant select, insert, delete on public.feed_posts, public.feed_comments to authenticated;
grant select, delete on public.notify_settings to authenticated;
revoke all on public.server_config, public.feed_views, public.post_milestones from anon, authenticated;

do $$ declare f text;
begin
  foreach f in array array[
    'set_nickname(text)', 'find_nickname(text)', 'friend_request(text)', 'friend_respond(uuid, boolean)', 'friend_remove(uuid)', 'my_friends()',
    'people(text)', 'open_conversation(uuid)', 'my_conversations()', 'chat_mark_read(uuid)', 'react_message(bigint, text)',
    'feed(text, integer, bigint, uuid, bigint[])', 'react_post(bigint, text)', 'feed_seen(bigint[])', 'save_notify_settings(jsonb)',
    'report_content(text, text, text)', 'admin_resolve_report(bigint, text)',
    'announce_release(text, text, text)', 'sima_test()', 'notifications_read(bigint[])', 'notifications_clear()',
    'push_register(text, text, text, text, text, text)', 'push_unregister(text)',
    'can_see_post(uuid, text)', 'post_visible(bigint)', 'can_read_media(text)', 'conversation_friends(uuid)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  -- the server's own machinery: no member may call it
  foreach f in array array[
    'sima_notify(uuid, text, uuid, jsonb, text, text, boolean)', 'sima_text(text, jsonb, text)', 'display_of(uuid)', 'post_milestone(bigint, text, integer)',
    'sima_daily_top()', 'sima_reminders()', 'push_hook_secret()', 'push_call(bigint[])', 'push_sweep()', 'media_cleanup()', 'is_friend(uuid, uuid)', 'blocked_between(uuid, uuid)'] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', f);
  end loop;
  if exists (select 1 from pg_roles where rolname = 'service_role') then execute 'grant execute on function public.push_hook_secret() to service_role'; end if;
end $$;


-- ===================================================================== hardening (Supabase advisors, 2026-11-10)
-- trigger functions are never called through the API: nobody needs EXECUTE on them (a trigger fires without it)
do $$ declare f text;
begin
  foreach f in array array['feed_post_guard()', 'count_share()', 'notify_message()', 'notify_message_reaction()', 'notify_new_post()', 'count_post_reaction()',
    'count_comment()', 'notify_friendship()', 'notify_settings_guard()', 'push_after_insert()', 'refuse_objectionable()', 'fill_author_name()', 'touch_conversation()', 'handle_new_user()'] loop
    if to_regprocedure('public.' || f) is not null then execute format('revoke all on function public.%s from public, anon, authenticated', f); end if;
  end loop;
  revoke all on function public.has_objectionable_text(text) from public, anon;
  grant execute on function public.has_objectionable_text(text) to authenticated;
end $$;
alter function public.sima_text(text, jsonb, text) set search_path = public;
alter function public.sima_emoji(text) set search_path = public;
