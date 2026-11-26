-- Faces: the current name and photo of the people on a screen (comments, group chats), read live from
-- profiles, so a new photo shows to everyone everywhere — the way profile_card already does for one person.
--   · signed-in members only; at most 100 ids per call
--   · between two people where either blocked the other, no photo (the same rule as profile_card)
create or replace function public.faces(ids uuid[])
returns table(id uuid, display_name text, nickname text, avatar_url text)
language sql stable security definer set search_path = public as $$
  select p.id, p.display_name, p.nickname,
    case when public.blocked_between(auth.uid(), p.id) then null else p.avatar_url end
  from public.profiles p
  where auth.uid() is not null and p.id = any((ids)[1:100]);
$$;
revoke all on function public.faces(uuid[]) from public, anon;
grant execute on function public.faces(uuid[]) to authenticated;
