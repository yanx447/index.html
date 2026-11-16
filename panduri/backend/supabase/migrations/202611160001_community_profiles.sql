-- The community becomes a place of its own: profiles people want to visit, following, reposts, history, search.
--   · a profile: a photo everyone can see (the public 'avatars' bucket), a bio, and its numbers — followers,
--     following, and the likes of all its videos together (a deleted video takes its likes with it: the sum is
--     counted from the videos that exist, never stored);
--   · following, one way, as in TikTok (friendship stays what it was: both agree, and only friends can chat);
--   · reposts: a video shown again on my profile; taken back one at a time or all at once;
--   · history: the videos I watched, the last one first, and a way to clear it;
--   · liked and saved videos, seen only by me;
--   · search: people, videos (caption, song, author) and #hashtags; a hashtag's own page;
--   · a share out of the app (a link, another app) counts once per person.
--
-- Needs 202611090002_social.sql. It also carries what it needs from 202611100001_reels.sql, which the live server
-- never received — the song's name, saved videos and the feed() that knows them — but NOT that file's one-minute
-- limit: the camera films up to ten minutes now, and the live server has never limited the length. Do not apply
-- 202611100001_reels.sql after this one (its feed_post_guard would bring the limit back).
-- Additive: no table, column or row is removed. Running it twice changes nothing.

-- ===================================================================== from reels: the song, saved videos
alter table public.feed_posts add column if not exists song text not null default '';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'feed_posts_song_len') then
    alter table public.feed_posts add constraint feed_posts_song_len check (char_length(song) <= 80);
  end if;
end $$;

create or replace function public.refuse_objectionable() returns trigger
language plpgsql security definer set search_path = public as $$
declare content text;
begin
  if tg_table_name = 'posts' then content := new.title || ' ' || coalesce(new.body, '');
  elsif tg_table_name = 'feed_posts' then content := new.caption || ' ' || coalesce(new.song, '');
  else content := new.body; end if;
  if public.has_objectionable_text(content) then raise exception 'objectionable-content'; end if;
  return new;
end $$;

create table if not exists public.feed_saves (
  user_id uuid not null references auth.users on delete cascade,
  post_id bigint not null references public.feed_posts on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create index if not exists feed_saves_user on public.feed_saves (user_id, created_at desc);
alter table public.feed_saves enable row level security;
drop policy if exists "own saves" on public.feed_saves;
create policy "own saves" on public.feed_saves for select using (user_id = auth.uid());   -- changes go through save_post()

create or replace function public.save_post(post bigint, keep boolean default true) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  if coalesce(keep, true) then
    if not public.post_visible(post) then raise exception 'not-found' using errcode = '42501'; end if;
    if (select count(*) from public.feed_saves s where s.user_id = auth.uid()) >= 2000 then raise exception 'too-many-saves'; end if;
    insert into public.feed_saves (user_id, post_id) values (auth.uid(), post) on conflict do nothing;
    return true;
  end if;
  delete from public.feed_saves s where s.user_id = auth.uid() and s.post_id = post;
  return false;
end $$;

-- ===================================================================== a profile: photo, bio
alter table public.profiles add column if not exists bio text not null default '';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_bio_len') then
    alter table public.profiles add constraint profiles_bio_len check (char_length(bio) <= 160);
  end if;
end $$;

/** the bio: at most 160 characters, through the same word filter as everything else members write */
create or replace function public.set_bio(new_bio text) returns text
language plpgsql security definer set search_path = public as $$
declare b text := left(trim(both from regexp_replace(coalesce(new_bio, ''), '\s+\n', E'\n', 'g')), 160);
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  if public.community_banned(auth.uid()) then raise exception 'denied' using errcode = '42501'; end if;
  if b <> '' and public.has_objectionable_text(b) then raise exception 'objectionable-content'; end if;
  update public.profiles set bio = b where id = auth.uid();
  return b;
end $$;

/** the photo: only an address of my own folder in the public 'avatars' bucket, or none */
create or replace function public.set_avatar(url text) returns text
language plpgsql security definer set search_path = public as $$
declare u text := nullif(trim(both from coalesce(url, '')), '');
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  if u is not null and (char_length(u) > 500 or u not like 'https://%/storage/v1/object/public/avatars/' || auth.uid()::text || '/%') then
    raise exception 'not-your-file' using errcode = '42501';
  end if;
  update public.profiles set avatar_url = u where id = auth.uid();
  return u;
end $$;

-- the photo itself: anyone may look at it (it is a profile photo), only its owner may put one there or take it away
do $$ begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
      on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = excluded.allowed_mime_types;
    execute 'drop policy if exists "avatars upload own" on storage.objects';
    execute 'create policy "avatars upload own" on storage.objects for insert to authenticated with check (bucket_id = ''avatars'' and (storage.foldername(name))[1] = auth.uid()::text)';
    execute 'drop policy if exists "avatars delete own" on storage.objects';
    execute 'create policy "avatars delete own" on storage.objects for delete to authenticated using (bucket_id = ''avatars'' and (storage.foldername(name))[1] = auth.uid()::text)';
  end if;
end $$;

-- ===================================================================== following
create table if not exists public.follows (
  follower uuid not null references auth.users on delete cascade,
  followee uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower, followee),
  check (follower <> followee)
);
create index if not exists follows_followee on public.follows (followee, created_at desc);
create index if not exists follows_follower on public.follows (follower, created_at desc);
alter table public.follows enable row level security;
drop policy if exists "follows are public to members" on public.follows;
create policy "follows are public to members" on public.follows for select using (auth.uid() is not null);   -- changes go through follow()

/** a short notification in the receiver's own language (Sima's general form: the text is composed here) */
create or replace function public.community_note(target uuid, kind text, actor uuid, ka text, en text, go text, tag text) returns void
language plpgsql security definer set search_path = public as $$
declare lg text;
begin
  select s.lang into lg from public.notify_settings s where s.user_id = target;
  perform public.sima_notify(target, kind, actor, jsonb_build_object('s', case when coalesce(lg, 'ka') = 'ka' then ka else en end), go, tag, true);
end $$;

/** keep = true follows, false stops following; answers whether I follow now */
create or replace function public.follow(target uuid, keep boolean default true) returns boolean
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); nm text;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if not coalesce(keep, true) then
    delete from public.follows f where f.follower = me and f.followee = target;
    return false;
  end if;
  if target is null or target = me then raise exception 'self'; end if;
  if not exists (select 1 from public.profiles p where p.id = target) or public.blocked_between(me, target) then raise exception 'not-found'; end if;
  if public.community_banned(me) then raise exception 'denied' using errcode = '42501'; end if;
  if (select count(*) from public.follows f where f.follower = me and f.created_at > now() - interval '1 hour') >= 200 then raise exception 'slow-down'; end if;
  if (select count(*) from public.follows f where f.follower = me) >= 10000 then raise exception 'too-many'; end if;
  insert into public.follows (follower, followee) values (me, target) on conflict do nothing;
  if found then
    nm := public.display_of(me);
    perform public.community_note(target, 'follow', me, nm || ' გამოგიწერა.', nm || ' started following you.', 'community:u:' || me, 'fo:' || me);
  end if;
  return true;
end $$;

/** the people who follow `target` ('followers') or whom `target` follows ('following'), the newest first */
create or replace function public.follow_list(target uuid, which text default 'followers', lim integer default 50, off integer default 0)
returns table (id uuid, nickname text, display_name text, avatar_url text, level integer, i_follow boolean, follows_me boolean, at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.id, p.nickname, p.display_name, p.avatar_url, p.level,
    exists (select 1 from public.follows x where x.follower = auth.uid() and x.followee = p.id),
    exists (select 1 from public.follows x where x.follower = p.id and x.followee = auth.uid()),
    f.created_at
  from public.follows f join public.profiles p on p.id = case when which = 'following' then f.followee else f.follower end
  where auth.uid() is not null and (case when which = 'following' then f.follower else f.followee end) = target
    and not public.blocked_between(auth.uid(), p.id)
  order by f.created_at desc
  limit least(greatest(coalesce(lim, 50), 1), 100) offset greatest(coalesce(off, 0), 0);
$$;

-- ===================================================================== reposts, shares out
create table if not exists public.feed_reposts (
  user_id uuid not null references auth.users on delete cascade,
  post_id bigint not null references public.feed_posts on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create index if not exists feed_reposts_user on public.feed_reposts (user_id, created_at desc);
alter table public.feed_reposts enable row level security;
drop policy if exists "own reposts" on public.feed_reposts;
create policy "own reposts" on public.feed_reposts for select using (user_id = auth.uid());   -- a profile's reposts are read through feed_list()

/** keep = true reposts a video I may see (not my own), false takes the repost back; answers whether it is reposted now */
create or replace function public.repost(post bigint, keep boolean default true) returns boolean
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); who uuid; nm text;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if not coalesce(keep, true) then
    delete from public.feed_reposts r where r.user_id = me and r.post_id = post;
    return false;
  end if;
  select p.author into who from public.feed_posts p where p.id = post and p.visibility = 'public';
  if who is null or not public.post_visible(post) then raise exception 'not-found'; end if;
  if who = me then raise exception 'own-post'; end if;
  if public.community_banned(me) then raise exception 'denied' using errcode = '42501'; end if;
  if (select count(*) from public.feed_reposts r where r.user_id = me) >= 2000 then raise exception 'too-many'; end if;
  insert into public.feed_reposts (user_id, post_id) values (me, post) on conflict do nothing;
  if found then
    nm := public.display_of(me);
    perform public.community_note(who, 'repost', me, nm || ' შენს ვიდეოს აზიარებს თავის პროფილზე.', nm || ' reposted your video.', 'community:p:' || post, 'rp:' || post || ':' || me);
  end if;
  return true;
end $$;

/** every repost of mine, taken back at once; answers how many there were */
create or replace function public.reposts_clear() returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  delete from public.feed_reposts r where r.user_id = auth.uid();
  get diagnostics n = row_count; return n;
end $$;

create table if not exists public.feed_shares (
  user_id uuid not null references auth.users on delete cascade,
  post_id bigint not null references public.feed_posts on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
alter table public.feed_shares enable row level security;   -- written only by share_out(); nobody reads it directly

/** a video shared out of the app (a link copied, another app opened): its share count grows once per person */
create or replace function public.share_out(post bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or not public.post_visible(post) then return; end if;
  insert into public.feed_shares (user_id, post_id) values (auth.uid(), post) on conflict do nothing;
  if found then update public.feed_posts p set shares = p.shares + 1 where p.id = post and p.author <> auth.uid(); end if;
end $$;

-- ===================================================================== history
/** the posts this member has had in front of them: counted once per person, and the last time is kept for the history */
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
    else
      update public.feed_views v set at = now() where v.post_id = pid and v.user_id = auth.uid();
    end if;
  end loop;
end $$;

-- clearing the history hides it from me; the view itself was counted and stays counted (the row keeps the count honest)
alter table public.feed_views add column if not exists hidden boolean not null default false;
create or replace function public.history_clear(post bigint default null) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  update public.feed_views v set hidden = true where v.user_id = auth.uid() and (post is null or v.post_id = post);
end $$;
-- a video watched again after the history was cleared comes back into it
create or replace function public.feed_views_unhide() returns trigger
language plpgsql as $$ begin if new.at is distinct from old.at then new.hidden := false; end if; return new; end $$;
drop trigger if exists feed_views_unhide on public.feed_views;
create trigger feed_views_unhide before update on public.feed_views for each row execute function public.feed_views_unhide();

-- ===================================================================== hashtags
/** the #hashtags of a text, lower-case, once each: Latin and Georgian letters, digits and _ */
create or replace function public.hashtags(t text) returns text[]
language sql immutable set search_path = public as $$
  select coalesce(array_agg(distinct lower(m[1])), '{}'::text[])
  from regexp_matches(coalesce(t, ''), '#([0-9A-Za-z_Ⴀ-ჿᲐ-Ჿ]{1,50})', 'g') m;
$$;
create index if not exists feed_posts_tags on public.feed_posts using gin (public.hashtags(caption));

/** hashtags that begin with `term` (or, with no term, the most used of the last 60 days), with how many videos and views */
create or replace function public.tag_search(term text default '', lim integer default 20)
returns table (tag text, videos integer, views bigint)
language sql stable security definer set search_path = public as $$
  select x.tag, count(*)::integer, coalesce(sum(p.views), 0)::bigint
  from public.feed_posts p, unnest(public.hashtags(p.caption)) as x(tag)
  where auth.uid() is not null and p.kind = 'video' and p.visibility = 'public'
    and not public.blocked_between(auth.uid(), p.author)
    and (coalesce(trim(both '#' from trim(both from term)), '') = '' and p.created_at > now() - interval '60 days'
         or x.tag like lower(replace(replace(replace(trim(both '#' from trim(both from term)), '\', '\\'), '%', '\%'), '_', '\_')) || '%')
  group by x.tag
  order by count(*) desc, sum(p.views) desc, x.tag
  limit least(greatest(coalesce(lim, 20), 1), 50);
$$;

-- ===================================================================== people
/** people whose @nickname begins with, or whose name contains, `term` (blocked people are never found) */
create or replace function public.search_users(term text, lim integer default 20)
returns table (id uuid, nickname text, display_name text, avatar_url text, level integer, bio text, followers integer, i_follow boolean)
language sql stable security definer set search_path = public as $$
  with q as (select lower(replace(replace(replace(trim(both '@' from trim(both from coalesce(term, ''))), '\', '\\'), '%', '\%'), '_', '\_')) as v)
  select p.id, p.nickname, p.display_name, p.avatar_url, p.level, p.bio,
    (select count(*)::integer from public.follows f where f.followee = p.id),
    exists (select 1 from public.follows f where f.follower = auth.uid() and f.followee = p.id)
  from public.profiles p, q
  where auth.uid() is not null and q.v <> '' and p.nickname is not null and p.id <> auth.uid()
    and (p.nickname like q.v || '%' or lower(coalesce(p.display_name, '')) like '%' || q.v || '%')
    and not public.blocked_between(auth.uid(), p.id)
  order by (p.nickname = q.v) desc, (p.nickname like q.v || '%') desc, (select count(*) from public.follows f where f.followee = p.id) desc, p.nickname
  limit least(greatest(coalesce(lim, 20), 1), 50);
$$;

/** one profile with its numbers. likes = the likes (reactions) of all its videos that exist now */
create or replace function public.profile_card(target uuid default null, nick text default null)
returns table (id uuid, nickname text, display_name text, avatar_url text, bio text, level integer, vip boolean,
  followers integer, following integer, likes bigint, videos integer, i_follow boolean, follows_me boolean, relation text, blocked boolean)
language sql stable security definer set search_path = public as $$
  with p as (
    select pr.* from public.profiles pr
    where auth.uid() is not null and (pr.id = coalesce(target, case when nick is null then auth.uid() end) or (nick is not null and pr.nickname = lower(trim(both '@' from nick))))
    limit 1
  )
  select p.id, p.nickname, p.display_name, p.avatar_url, p.bio, p.level, (p.vip_until is not null and p.vip_until > now()),
    (select count(*)::integer from public.follows f where f.followee = p.id),
    (select count(*)::integer from public.follows f where f.follower = p.id),
    (select coalesce(sum(x.reactions), 0)::bigint from public.feed_posts x where x.author = p.id),
    (select count(*)::integer from public.feed_posts x where x.author = p.id and x.kind = 'video' and public.can_see_post(x.author, x.visibility)),
    exists (select 1 from public.follows f where f.follower = auth.uid() and f.followee = p.id),
    exists (select 1 from public.follows f where f.follower = p.id and f.followee = auth.uid()),
    case when p.id = auth.uid() then 'self' else coalesce((
      select case when fr.status = 'accepted' then 'friend' when fr.requester = auth.uid() then 'outgoing' else 'incoming' end
      from public.friendships fr where (fr.a = auth.uid() and fr.b = p.id) or (fr.b = auth.uid() and fr.a = p.id) limit 1), 'none') end,
    public.blocked_between(auth.uid(), p.id)
  from p;
$$;

-- ===================================================================== the feed (as in reels: videos only, with the song and saved)
drop function if exists public.feed(text, integer, bigint, uuid, bigint[]);
create function public.feed(tab text default 'foryou', lim integer default 10, before_id bigint default null, target uuid default null, skip_ids bigint[] default null)
returns table (id bigint, author uuid, author_name text, author_nick text, author_avatar text, author_level integer, kind text, caption text,
  media_path text, thumb_path text, media_meta jsonb, visibility text, reactions integer, comments integer, shares integer, views integer,
  created_at timestamptz, my_reaction text, top jsonb, friend boolean, seen boolean, score double precision, song text, saved boolean,
  reposted boolean, following boolean)
language sql stable security definer set search_path = public as $$
  with base as (
    select p.*, pr.display_name as a_name, pr.nickname as a_nick, pr.avatar_url as a_avatar, pr.level as a_level,
      exists (select 1 from public.feed_views v where v.post_id = p.id and v.user_id = auth.uid()) as was_seen,
      (select s.created_at from public.feed_saves s where s.post_id = p.id and s.user_id = auth.uid()) as saved_at,
      (p.reactions * 2 + p.comments * 3 + p.shares * 4 + p.views * 0.1 + 1)
        / power(extract(epoch from (now() - p.created_at)) / 3600.0 + 2, 1.5) as rank
    from public.feed_posts p join public.profiles pr on pr.id = p.author
    where auth.uid() is not null and p.kind = 'video' and public.can_see_post(p.author, p.visibility)
      and case tab
        when 'foryou' then p.visibility = 'public' and p.author <> auth.uid()
        when 'friends' then p.author = auth.uid() or public.is_friend(auth.uid(), p.author)
        when 'following' then exists (select 1 from public.follows f where f.follower = auth.uid() and f.followee = p.author)
        when 'user' then p.author = target
        when 'one' then p.id = before_id
        when 'saved' then exists (select 1 from public.feed_saves s where s.post_id = p.id and s.user_id = auth.uid())
        else false end
      and (tab in ('foryou', 'one', 'saved') or before_id is null or p.id < before_id)
      and (skip_ids is null or not (p.id = any (skip_ids)))
  )
  select b.id, b.author, b.a_name, b.a_nick, b.a_avatar, b.a_level, b.kind, b.caption, b.media_path, b.thumb_path, b.media_meta, b.visibility,
    b.reactions, b.comments, b.shares, b.views, b.created_at,
    (select r.emoji from public.feed_reactions r where r.post_id = b.id and r.user_id = auth.uid()),
    coalesce((select jsonb_agg(x.emoji order by x.n desc, x.emoji) from (select r.emoji, count(*) as n from public.feed_reactions r where r.post_id = b.id group by r.emoji order by count(*) desc, r.emoji limit 3) x), '[]'::jsonb),
    public.is_friend(auth.uid(), b.author), b.was_seen, b.rank, b.song, b.saved_at is not null,
    exists (select 1 from public.feed_reposts r where r.post_id = b.id and r.user_id = auth.uid()),
    exists (select 1 from public.follows f where f.follower = auth.uid() and f.followee = b.author)
  from base b
  order by case when tab = 'foryou' then b.was_seen::int else 0 end,
    case when tab = 'foryou' then b.rank else 0 end desc,
    case when tab = 'saved' then b.saved_at end desc nulls last,
    b.id desc
  limit least(greatest(coalesce(lim, 10), 1), 30);
$$;

/** the lists of a profile and of search, paged by offset, each in its own order:
      'user' (target's videos, newest) · 'reposts' (target's reposts, last reposted first) ·
      'saved' · 'liked' · 'history' (mine only, whatever target says) ·
      'tag' (term = a hashtag, most liked first) · 'search' (term in the caption, the song or the author's name, most liked first)
    `at` is when the thing the list is about happened (posted, reposted, saved, liked, last watched). */
create or replace function public.feed_list(tab text, target uuid default null, term text default null, lim integer default 12, off integer default 0)
returns table (id bigint, author uuid, author_name text, author_nick text, author_avatar text, author_level integer, kind text, caption text,
  media_path text, thumb_path text, media_meta jsonb, visibility text, reactions integer, comments integer, shares integer, views integer,
  created_at timestamptz, my_reaction text, friend boolean, song text, saved boolean, reposted boolean, following boolean, at timestamptz)
language sql stable security definer set search_path = public as $$
  with q as (
    select lower(trim(both '#' from trim(both from coalesce(term, '')))) as tag,
      '%' || replace(replace(replace(trim(both from coalesce(term, '')), '\', '\\'), '%', '\%'), '_', '\_') || '%' as pat,
      char_length(trim(both from coalesce(term, ''))) as n
  ),
  src as (
    select s.post_id as pid, s.created_at as at from public.feed_saves s where tab = 'saved' and s.user_id = auth.uid()
    union all select r.post_id, r.created_at from public.feed_reactions r where tab = 'liked' and r.user_id = auth.uid()
    union all select v.post_id, v.at from public.feed_views v where tab = 'history' and v.user_id = auth.uid() and not v.hidden
    union all select r.post_id, r.created_at from public.feed_reposts r where tab = 'reposts' and r.user_id = coalesce(target, auth.uid())
    union all select p.id, p.created_at from public.feed_posts p where tab = 'user' and p.author = coalesce(target, auth.uid())
    union all select p.id, p.created_at from public.feed_posts p, q where tab = 'tag' and q.tag <> '' and q.tag = any (public.hashtags(p.caption))
    union all select p.id, p.created_at from public.feed_posts p join public.profiles pr on pr.id = p.author, q
      where tab = 'search' and q.n >= 1 and (p.caption ilike q.pat or p.song ilike q.pat or pr.nickname ilike q.pat or pr.display_name ilike q.pat)
  )
  select p.id, p.author, pr.display_name, pr.nickname, pr.avatar_url, pr.level, p.kind, p.caption, p.media_path, p.thumb_path, p.media_meta, p.visibility,
    p.reactions, p.comments, p.shares, p.views, p.created_at,
    (select r.emoji from public.feed_reactions r where r.post_id = p.id and r.user_id = auth.uid()),
    public.is_friend(auth.uid(), p.author), p.song,
    exists (select 1 from public.feed_saves s where s.post_id = p.id and s.user_id = auth.uid()),
    exists (select 1 from public.feed_reposts r where r.post_id = p.id and r.user_id = auth.uid()),
    exists (select 1 from public.follows f where f.follower = auth.uid() and f.followee = p.author),
    src.at
  from src join public.feed_posts p on p.id = src.pid join public.profiles pr on pr.id = p.author
  where auth.uid() is not null and p.kind = 'video' and public.can_see_post(p.author, p.visibility)
    and not public.blocked_between(auth.uid(), p.author)
  order by case when tab in ('tag', 'search') then p.reactions * 2 + p.comments * 3 + p.shares * 4 + p.views * 0.1 end desc nulls last,
    src.at desc, p.id desc
  limit least(greatest(coalesce(lim, 12), 1), 30) offset greatest(coalesce(off, 0), 0);
$$;

-- ===================================================================== who may call what
grant select on public.feed_saves, public.follows, public.feed_reposts to authenticated;
revoke insert, update, delete on public.feed_saves, public.follows, public.feed_reposts, public.feed_shares from anon, authenticated;
revoke all on public.feed_saves, public.follows, public.feed_reposts, public.feed_shares from anon;
revoke all on public.feed_shares from authenticated;
do $$ declare f text; begin
  foreach f in array array['feed(text, integer, bigint, uuid, bigint[])', 'save_post(bigint, boolean)', 'set_bio(text)', 'set_avatar(text)',
    'follow(uuid, boolean)', 'follow_list(uuid, text, integer, integer)', 'repost(bigint, boolean)', 'reposts_clear()', 'share_out(bigint)',
    'feed_seen(bigint[])', 'history_clear(bigint)', 'tag_search(text, integer)', 'search_users(text, integer)',
    'profile_card(uuid, text)', 'feed_list(text, uuid, text, integer, integer)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
  -- helpers only the functions above call
  revoke all on function public.community_note(uuid, text, uuid, text, text, text, text) from public, anon, authenticated;
  revoke all on function public.feed_views_unhide() from public, anon, authenticated;
end $$;
