-- Apply once in the same Supabase project as the app's auth.
create table if not exists public.sima_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  day date not null default current_date,
  turns integer not null default 0,
  last_turn timestamptz not null default now()
);
alter table public.sima_usage enable row level security;
revoke all on public.sima_usage from anon, authenticated;
create or replace function public.sima_take_turn() returns boolean
language plpgsql security definer set search_path = public as $$
declare taken uuid;
begin
  if auth.uid() is null then return false; end if;
  insert into public.sima_usage as usage(user_id, day, turns, last_turn)
  values(auth.uid(), current_date, 1, now())
  on conflict(user_id) do update set
    day = current_date,
    turns = case when usage.day = current_date then usage.turns + 1 else 1 end,
    last_turn = now()
  where usage.last_turn < now() - interval '3 seconds'
    and (usage.day <> current_date or usage.turns < 100)
  returning user_id into taken;
  return taken is not null;
end;
$$;
revoke all on function public.sima_take_turn() from public, anon;
grant execute on function public.sima_take_turn() to authenticated;
