-- Sima's check: the community takes only panduri videos and panduri music.
-- The app listens to every clip on the device before it is uploaded (src/guard.js): tuned, plucked notes in the
-- panduri's range, clean sound, a good picture. Only a clip that passed carries media_meta.sima = { v, ok: true, … }.
-- This trigger refuses a post without it, so an older copy of the app (one still run by its service worker) cannot
-- post past the check. It is not a proof — a hand-made request can write the stamp — and it does not say so: the
-- sound itself never reaches the server, by design.
-- Photo and text posts are refused too: the feed is videos (and music) only, and neither can be listened to.
-- Posts already published are not touched.
-- Additive: no table, column or row is changed. Running it twice changes nothing.

create or replace function public.feed_post_sima() returns trigger
language plpgsql security definer set search_path = public as $$
declare st jsonb := coalesce(new.media_meta -> 'sima', 'null'::jsonb);
begin
  if new.kind not in ('video', 'audio') then raise exception 'video-only' using errcode = '22023'; end if;
  if jsonb_typeof(st) <> 'object' or coalesce(st ->> 'ok', '') <> 'true' or coalesce(st ->> 'v', '') !~ '^[1-9][0-9]*$' then
    raise exception 'sima-check' using errcode = '22023';
  end if;
  return new;
end $$;
revoke all on function public.feed_post_sima() from public, anon, authenticated;

drop trigger if exists feed_posts_sima on public.feed_posts;
create trigger feed_posts_sima before insert on public.feed_posts for each row execute function public.feed_post_sima();
