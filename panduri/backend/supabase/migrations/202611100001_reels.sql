-- The feed becomes a video feed (reels): one swipe, one video.
--   · a post in the feed is a video of at most 60 seconds, and may name the song or rhythm that is played;
--   · a member can save a video and find it again („შენახულები");
--   · feed() also answers `song` and `saved`, knows the tab 'saved', and shows videos only.
-- Needs 202611090002_social.sql first. Additive: no table, column or row is removed. Photos, music and text
-- posted to the feed before this (there were none on the live server) stay in the table but are no longer shown.
-- Running it twice changes nothing.

-- ===================================================================== the song or rhythm of a video
alter table public.feed_posts add column if not exists song text not null default '';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'feed_posts_song_len') then
    alter table public.feed_posts add constraint feed_posts_song_len check (char_length(song) <= 80);
  end if;
end $$;

-- a new post: as before (the author is the one signed in, counters start at zero, the files are the author's own,
-- twenty an hour at most), and now: a video, no longer than a minute
create or replace function public.feed_post_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare dur numeric;
begin
  new.author := auth.uid();
  new.reactions := 0; new.comments := 0; new.shares := 0; new.views := 0; new.created_at := now();
  new.song := trim(both from coalesce(new.song, ''));
  if new.kind <> 'video' then raise exception 'video-only' using errcode = '22023'; end if;
  begin dur := (new.media_meta ->> 'dur')::numeric; exception when others then dur := null; end;
  if dur is null or dur <= 0 or dur > 61 then raise exception 'video-too-long' using errcode = '22023'; end if;
  if new.media_path is not null and split_part(new.media_path, '/', 1) <> auth.uid()::text then raise exception 'not-your-file' using errcode = '42501'; end if;
  if new.thumb_path is not null and split_part(new.thumb_path, '/', 1) <> auth.uid()::text then raise exception 'not-your-file' using errcode = '42501'; end if;
  if (select count(*) from public.feed_posts p where p.author = auth.uid() and p.created_at > now() - interval '1 hour') >= 20 then raise exception 'slow-down'; end if;
  return new;
end $$;

-- the word filter reads the song's name too
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

-- ===================================================================== saved videos
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

/** keep = true saves a video I may see, false takes it out of my saved ones; answers whether it is saved now */
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

-- ===================================================================== the feed
-- the answer has two more columns, so the old function has to go first (the app keeps working: it reads columns by name)
drop function if exists public.feed(text, integer, bigint, uuid, bigint[]);
/** the feeds, videos only. tab: 'foryou' (everyone's public videos, the ones not yet seen first, then by popularity),
    'friends' (friends and me, newest first), 'user' (one person's videos that I may see), 'one' (the video before_id),
    'saved' (the ones I saved that I may still see, the last saved first; before_id pages by post id within that order). */
create function public.feed(tab text default 'foryou', lim integer default 10, before_id bigint default null, target uuid default null, skip_ids bigint[] default null)
returns table (id bigint, author uuid, author_name text, author_nick text, author_avatar text, author_level integer, kind text, caption text,
  media_path text, thumb_path text, media_meta jsonb, visibility text, reactions integer, comments integer, shares integer, views integer,
  created_at timestamptz, my_reaction text, top jsonb, friend boolean, seen boolean, score double precision, song text, saved boolean)
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
    public.is_friend(auth.uid(), b.author), b.was_seen, b.rank, b.song, b.saved_at is not null
  from base b
  order by case when tab = 'foryou' then b.was_seen::int else 0 end,
    case when tab = 'foryou' then b.rank else 0 end desc,
    case when tab = 'saved' then b.saved_at end desc nulls last,
    b.id desc
  limit least(greatest(coalesce(lim, 10), 1), 30);
$$;

-- ===================================================================== who may call what
grant select on public.feed_saves to authenticated;
revoke insert, update, delete on public.feed_saves from anon, authenticated;
revoke all on public.feed_saves from anon;
do $$ declare f text; begin
  foreach f in array array['feed(text, integer, bigint, uuid, bigint[])', 'save_post(bigint, boolean)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
