begin;

-- One shared UTC date per conversation, regardless of how many messages arrive.
create table if not exists public.chat_active_days (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  day date not null,
  primary key (conversation_id, day)
);
alter table public.chat_active_days enable row level security;
revoke all on public.chat_active_days from public, anon, authenticated;

create or replace function public.note_chat_active_day() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.chat_active_days(conversation_id,day)
  values (new.conversation_id,(statement_timestamp() at time zone 'UTC')::date)
  on conflict do nothing;
  return new;
end $$;
revoke all on function public.note_chat_active_day() from public, anon, authenticated;
drop trigger if exists note_chat_active_day on public.messages;
create trigger note_chat_active_day after insert on public.messages
for each row when (new.body ~ '[^[:space:]]') execute function public.note_chat_active_day();

-- Give existing conversations credit for their recent sent text.
insert into public.chat_active_days(conversation_id,day)
select distinct m.conversation_id,(m.created_at at time zone 'UTC')::date
from public.messages m
where m.body ~ '[^[:space:]]' and m.created_at >= now()-interval '1001 days'
  and m.created_at <= now()
on conflict do nothing;

create or replace function public.chat_streak(conv uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  today date := (now() at time zone 'UTC')::date;
  last_day date;
  run integer;
begin
  if not public.chat_member(conv) then
    raise exception 'denied' using errcode='42501';
  end if;
  select max(d.day) into last_day from public.chat_active_days d
  where d.conversation_id=conv and d.day<=today;
  if last_day is null or last_day<today-1 then
    return jsonb_build_object('days',0,'today',false);
  end if;
  select coalesce(min(i) filter (where d.day is null),1000) into run
  from generate_series(0,999) as s(i)
  left join public.chat_active_days d on d.conversation_id=conv and d.day=last_day-s.i;
  return jsonb_build_object('days',run,'today',last_day=today);
end $$;
revoke all on function public.chat_streak(uuid) from public, anon;
grant execute on function public.chat_streak(uuid) to authenticated;

alter table public.chat_preferences drop constraint if exists chat_preferences_font_check;
alter table public.chat_preferences add constraint chat_preferences_font_check
check(font in ('default','system','rounded','humanist','serif','book','mono','large',
                'noto-sans','noto-serif','dm-sans','bricolage','plex-mono'));
notify pgrst, 'reload schema';
commit;
