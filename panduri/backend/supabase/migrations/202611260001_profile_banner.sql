-- One profile, with a moving picture if its owner wants one:
--   · the photo may be a GIF (or an animated WebP): the 'avatars' bucket now takes image/gif;
--   · a banner above the photo: a still picture (JPEG/PNG/WebP), or a moving one (GIF, animated WebP, or a short
--     silent MP4/WebM loop). It lives in the same public 'avatars' bucket, in its owner's own folder;
--   · profile_card() answers banner_url too.
-- The bucket's size limit goes from 2 MB to 10 MB, because a moving picture is larger than a photo. The app
-- itself keeps a photo or GIF avatar under 4 MB and a banner under 10 MB.
--
-- Needs 202611160001_community_profiles.sql and 202611240001_music_community.sql (profile_card as it is now).
-- Additive: no table, column or row is removed. Running it twice changes nothing.

alter table public.profiles add column if not exists banner_url text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_banner_len') then
    alter table public.profiles add constraint profiles_banner_len check (banner_url is null or char_length(banner_url) <= 500);
  end if;
end $$;

/** the banner: only an address of my own folder in the public 'avatars' bucket, or none */
create or replace function public.set_banner(url text) returns text
language plpgsql security definer set search_path = public as $$
declare u text := nullif(trim(both from coalesce(url, '')), '');
begin
  if auth.uid() is null then raise exception 'not-authenticated'; end if;
  if public.community_banned(auth.uid()) then raise exception 'denied' using errcode = '42501'; end if;
  if u is not null and (char_length(u) > 500 or u not like 'https://%/storage/v1/object/public/avatars/' || auth.uid()::text || '/%') then
    raise exception 'not-your-file' using errcode = '42501';
  end if;
  update public.profiles set banner_url = u where id = auth.uid();
  return u;
end $$;

-- the bucket: GIFs for the photo, and short videos for a moving banner
do $$ begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    update storage.buckets set file_size_limit = 10485760,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
      where id = 'avatars';
  end if;
end $$;

-- profile_card gains one column at the end; a function's columns cannot change in place, so it is made again
drop function if exists public.profile_card(uuid, text);
create function public.profile_card(target uuid default null, nick text default null)
returns table (id uuid, nickname text, display_name text, avatar_url text, bio text, level integer, vip boolean,
  followers integer, following integer, likes bigint, videos integer, i_follow boolean, follows_me boolean, relation text, blocked boolean,
  banner_url text)
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
    public.blocked_between(auth.uid(), p.id),
    -- a blocked pair sees no banner, as it sees no videos
    case when public.blocked_between(auth.uid(), p.id) then null else p.banner_url end
  from p;
$$;

revoke all on function public.profile_card(uuid, text) from public, anon;
grant execute on function public.profile_card(uuid, text) to authenticated;
revoke all on function public.set_banner(text) from public, anon;
grant execute on function public.set_banner(text) to authenticated;

notify pgrst, 'reload schema';
