-- Device names are user-editable. Actual sessions remain owned by Supabase Auth.
create table if not exists public.device_session_labels (
  session_id uuid primary key references auth.sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 80)
);
alter table public.device_session_labels enable row level security;
revoke all on public.device_session_labels from anon, authenticated;

create or replace function public.my_device_sessions()
returns table(id uuid, label text, agent text, created_at timestamptz, last_seen timestamptz, current_device boolean)
language sql security definer set search_path = '' as $$
 select s.id, l.label, coalesce(nullif(to_jsonb(s)->>'user_agent',''), 'Panduri'),
 s.created_at, coalesce(s.refreshed_at, s.created_at), s.id::text = auth.jwt()->>'session_id'
 from auth.sessions s left join public.device_session_labels l on l.session_id = s.id
 where s.user_id = auth.uid() and (s.not_after is null or s.not_after > now())
 order by s.created_at desc;
$$;
create or replace function public.rename_device_session(target uuid, new_label text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or not exists(select 1 from auth.sessions where id = target and user_id = auth.uid()) then
   raise exception 'Session not found' using errcode = '42501';
 end if;
 if char_length(trim(new_label)) not between 1 and 80 then raise exception 'Invalid device name'; end if;
 insert into public.device_session_labels(session_id,user_id,label) values(target,auth.uid(),trim(new_label))
 on conflict(session_id) do update set label=excluded.label;
end; $$;
create or replace function public.revoke_device_session(target uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if auth.uid() is null or target::text = auth.jwt()->>'session_id' then
   raise exception 'Use sign out for the current device' using errcode = '42501';
 end if;
 if not exists(select 1 from auth.sessions where id=target and user_id=auth.uid()) then
   raise exception 'Session not found' using errcode = '42501';
 end if;
 delete from auth.refresh_tokens where session_id=target;
 delete from auth.sessions where id=target and user_id=auth.uid();
end; $$;
revoke all on function public.my_device_sessions() from public, anon;
revoke all on function public.rename_device_session(uuid,text) from public, anon;
revoke all on function public.revoke_device_session(uuid) from public, anon;
grant execute on function public.my_device_sessions() to authenticated;
grant execute on function public.rename_device_session(uuid,text) to authenticated;
grant execute on function public.revoke_device_session(uuid) to authenticated;
