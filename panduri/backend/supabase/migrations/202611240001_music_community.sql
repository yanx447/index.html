-- Music posts share the private social bucket and the existing visibility rules.
-- Sima's browser analysis supplies optional feedback. Publishing still uses the existing moderation rules.
drop trigger if exists feed_posts_sima on public.feed_posts;
drop function if exists public.feed_post_sima();

create or replace function public.feed_post_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare dur numeric;
begin
  new.author := auth.uid();
  new.reactions := 0; new.comments := 0; new.shares := 0; new.views := 0; new.created_at := now();
  new.song := trim(both from coalesce(new.song, ''));
  if new.kind not in ('video', 'audio') then raise exception 'media-only' using errcode = '22023'; end if;
  if jsonb_typeof(new.media_meta) is distinct from 'object' then raise exception 'media-metadata' using errcode = '22023'; end if;
  begin dur := (new.media_meta ->> 'dur')::numeric; exception when others then dur := null; end;
  if dur is null or dur <= 0 or dur > (case when new.kind = 'audio' then 900 else 600 end)
    then raise exception 'media-too-long' using errcode = '22023'; end if;
  if new.media_path is null or split_part(new.media_path, '/', 1) is distinct from auth.uid()::text
    or split_part(new.media_path, '/', 2) <> 'p'
    then raise exception 'not-your-file' using errcode = '42501'; end if;
  if new.thumb_path is not null and (split_part(new.thumb_path, '/', 1) is distinct from auth.uid()::text
    or split_part(new.thumb_path, '/', 2) <> 'p')
    then raise exception 'not-your-file' using errcode = '42501'; end if;
  if not exists (select 1 from storage.objects o where o.bucket_id = 'social' and o.name = new.media_path
    and split_part(coalesce(o.metadata ->> 'mimetype', ''), '/', 1) = new.kind)
    then raise exception 'media-type' using errcode = '22023'; end if;
  if new.thumb_path is not null and not exists (select 1 from storage.objects o where o.bucket_id = 'social'
    and o.name = new.thumb_path and split_part(coalesce(o.metadata ->> 'mimetype', ''), '/', 1) = 'image')
    then raise exception 'media-type' using errcode = '22023'; end if;
  if new.media_meta ->> 'genre' is not null and new.media_meta ->> 'genre' not in
    ('rock','pop','jazz','folk','georgian-folk','classical','electronic','hip-hop','blues','soul','world','other')
    then raise exception 'music-genre' using errcode = '22023'; end if;
  if new.media_meta ->> 'region' is not null and
    (new.media_meta ->> 'genre' is distinct from 'georgian-folk' or new.media_meta ->> 'region' not in
      ('kazbegi','adjara','kakheti','mtiuleti','khevsureti','tusheti','pshavi','kartli','guria','samegrelo',
       'svaneti','imereti','racha','lechkhumi','meskheti','javakheti','abkhazeti','lazeti','other'))
    then raise exception 'music-region' using errcode = '22023'; end if;
  if new.media_meta ->> 'form' is not null and new.media_meta ->> 'form' not in
    ('song','melody','instrumental','rhythm','improvisation','cover')
    then raise exception 'music-form' using errcode = '22023'; end if;
  if new.media_meta ->> 'instrument' is not null and new.media_meta ->> 'instrument' not in
    ('vocals','panduri','chonguri','doli','garmoni','salamuri','duduki','guitar','bass','piano','drums','violin',
     'cello','winds','brass','accordion','mandolin','banjo','harp','strings','ensemble','other')
    then raise exception 'music-instrument' using errcode = '22023'; end if;
  if (select count(*) from public.feed_posts p where p.author = auth.uid() and p.created_at > now() - interval '1 hour') >= 20
    then raise exception 'slow-down'; end if;
  return new;
end $$;

create index if not exists feed_posts_music_media on public.feed_posts (author, media_path);
create index if not exists feed_posts_music_genre on public.feed_posts ((media_meta ->> 'genre'), created_at desc)
  where visibility = 'public' and kind in ('video', 'audio');

-- The global Storage limit is set separately in Supabase. Keep existing larger bucket settings.
do $$ begin
  if to_regclass('storage.buckets') is not null then
    update storage.buckets set file_size_limit = greatest(file_size_limit, 52428800)
    where id = 'social' and file_size_limit is not null;
  end if;
end $$;

create or replace function public.music_connections(term text default '')
returns table (nickname text, display_name text)
language sql stable security definer set search_path = public as $$
  select p.nickname, p.display_name from public.profiles p
  where p.nickname is not null and auth.uid() <> p.id and not public.blocked_between(auth.uid(), p.id)
    and left(p.nickname, char_length(coalesce(term, ''))) = lower(coalesce(term, ''))
    and exists (select 1 from public.follows f where
      (f.follower = auth.uid() and f.followee = p.id) or (f.followee = auth.uid() and f.follower = p.id))
  order by p.nickname limit 12;
$$;
revoke all on function public.music_connections(text) from public, anon;
grant execute on function public.music_connections(text) to authenticated;

create or replace function public.notify_music_mentions() returns trigger
language plpgsql security definer set search_path = public as $$
declare person record;
begin
  for person in
    select distinct p.id from regexp_matches(new.caption, '(^|[^[:alnum:]_.@])@([a-zA-Z0-9][a-zA-Z0-9_.]{1,22}[a-zA-Z0-9])(?![a-zA-Z0-9_]|\.[a-zA-Z0-9])', 'g') m
    join public.profiles p on p.nickname = lower(m[2])
    where p.id <> new.author and not public.blocked_between(new.author, p.id)
      and (new.visibility = 'public' or public.is_friend(new.author, p.id))
      and exists (select 1 from public.follows f where
        (f.follower = new.author and f.followee = p.id) or (f.followee = new.author and f.follower = p.id))
    limit 12
  loop
    perform public.community_note(person.id, 'mention', new.author,
      public.display_of(new.author) || ' თავის მუსიკალურ პოსტში მოგნიშნა',
      public.display_of(new.author) || ' mentioned you in a music post',
      'community:p:' || new.id, 'mention:' || new.id);
  end loop;
  return new;
end $$;
revoke all on function public.notify_music_mentions() from public, anon, authenticated;
drop trigger if exists feed_posts_music_mentions on public.feed_posts;
create trigger feed_posts_music_mentions after insert on public.feed_posts
  for each row execute function public.notify_music_mentions();

create or replace function public.music_hashtags(t text) returns text[]
language sql immutable set search_path = public as $$
  select coalesce(array_agg(distinct lower(m[1])), '{}'::text[])
  from regexp_matches(coalesce(t, ''), '#([[:alnum:]_Ⴀ-ჿᲐ-Ჿ]{1,50})', 'g') m;
$$;
create index if not exists feed_posts_music_tags on public.feed_posts using gin (public.music_hashtags(caption));

create or replace function public.tag_search(term text default '', lim integer default 20)
returns table (tag text, videos integer, views bigint)
language sql stable security definer set search_path = public as $$
  select x.tag, count(*)::integer, coalesce(sum(p.views), 0)::bigint
  from public.feed_posts p, unnest(public.music_hashtags(p.caption)) as x(tag)
  where auth.uid() is not null and p.kind in ('video', 'audio') and p.visibility = 'public'
    and not public.blocked_between(auth.uid(), p.author)
    and (coalesce(trim(both '#' from trim(both from term)), '') = '' and p.created_at > now() - interval '60 days'
         or x.tag like lower(replace(replace(replace(trim(both '#' from trim(both from term)), '\', '\\'), '%', '\%'), '_', '\_')) || '%')
  group by x.tag
  order by count(*) desc, sum(p.views) desc, x.tag
  limit least(greatest(coalesce(lim, 20), 1), 50);
$$;

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
    (select count(*)::integer from public.feed_posts x where x.author = p.id and x.kind in ('video', 'audio') and public.can_see_post(x.author, x.visibility)),
    exists (select 1 from public.follows f where f.follower = auth.uid() and f.followee = p.id),
    exists (select 1 from public.follows f where f.follower = p.id and f.followee = auth.uid()),
    case when p.id = auth.uid() then 'self' else coalesce((
      select case when fr.status = 'accepted' then 'friend' when fr.requester = auth.uid() then 'outgoing' else 'incoming' end
      from public.friendships fr where (fr.a = auth.uid() and fr.b = p.id) or (fr.b = auth.uid() and fr.a = p.id) limit 1), 'none') end,
    public.blocked_between(auth.uid(), p.id)
  from p;
$$;

create or replace function public.feed(tab text default 'foryou', lim integer default 10, before_id bigint default null, target uuid default null, skip_ids bigint[] default null)
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
    where auth.uid() is not null and p.kind in ('video', 'audio') and public.can_see_post(p.author, p.visibility)
      and not public.blocked_between(auth.uid(), p.author)
      and case tab
        when 'foryou' then p.visibility = 'public'
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
    union all select p.id, p.created_at from public.feed_posts p
      where tab = 'discover' and p.visibility = 'public' and coalesce(term, '') <> ''
        and (split_part(term, '.', 1) = '' or p.media_meta ->> 'genre' = split_part(term, '.', 1))
        and (split_part(term, '.', 2) = '' or p.media_meta ->> 'region' = split_part(term, '.', 2))
        and (split_part(term, '.', 3) = '' or p.media_meta ->> 'form' = split_part(term, '.', 3))
    union all select p.id, p.created_at from public.feed_posts p, q where tab = 'tag' and q.tag <> '' and q.tag = any (public.music_hashtags(p.caption))
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
  where auth.uid() is not null and p.kind in ('video', 'audio') and public.can_see_post(p.author, p.visibility)
    and not public.blocked_between(auth.uid(), p.author)
  order by case when tab in ('tag', 'search', 'discover') then p.reactions * 2 + p.comments * 3 + p.shares * 4 + p.views * 0.1 end desc nulls last,
    src.at desc, p.id desc
  limit least(greatest(coalesce(lim, 12), 1), 30) offset greatest(coalesce(off, 0), 0);
$$;
