-- Apply quality gates to new community posts. Existing posts and chat attachments retain their formats.
-- The client reads media container metadata. Storage checks the declared MIME and the database checks publisher dimensions.
create or replace function public.feed_post_quality() returns trigger
language plpgsql security definer set search_path = pg_catalog, public
as $$
declare
  width_px numeric;
  height_px numeric;
  mime text;
begin
  if new.kind = 'video' then
    if jsonb_typeof(new.media_meta -> 'w') is distinct from 'number' or
       jsonb_typeof(new.media_meta -> 'h') is distinct from 'number' then
      raise exception 'video-resolution' using errcode = '22023';
    end if;
    width_px := (new.media_meta ->> 'w')::numeric;
    height_px := (new.media_meta ->> 'h')::numeric;
    if least(width_px, height_px) < 720 or trunc(width_px) <> width_px or trunc(height_px) <> height_px then
      raise exception 'video-resolution' using errcode = '22023';
    end if;
  elsif new.kind = 'audio' then
    select lower(split_part(o.metadata ->> 'mimetype', ';', 1)) into mime
    from storage.objects o where o.bucket_id = 'social' and o.name = new.media_path;
    if not coalesce(
      (mime in ('audio/wav', 'audio/wave', 'audio/x-wav', 'audio/vnd.wave') and lower(new.media_path) like '%.wav') or
      (mime in ('audio/flac', 'audio/x-flac') and lower(new.media_path) like '%.flac'), false
    ) then
      raise exception 'audio-format' using errcode = '22023';
    end if;
  end if;
  return new;
end
$$;

revoke all on function public.feed_post_quality() from public, anon, authenticated;
drop trigger if exists feed_posts_quality on public.feed_posts;
create trigger feed_posts_quality
before insert on public.feed_posts
for each row execute function public.feed_post_quality();
