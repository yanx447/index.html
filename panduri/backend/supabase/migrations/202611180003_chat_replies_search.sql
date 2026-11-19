begin;
alter table public.messages add column if not exists reply_to bigint references public.messages(id) on delete set null;
create index if not exists messages_reply_to_idx on public.messages(reply_to) where reply_to is not null;

-- Keep reply references within the sender's visible conversation, including cleared history.
create or replace function public.validate_chat_reply() returns trigger
language plpgsql security invoker set search_path=public as $$
begin
  if new.reply_to is not null and not exists (
    select 1 from public.messages parent
    where parent.id=new.reply_to and parent.conversation_id=new.conversation_id and parent.id<new.id
  ) then
    raise exception 'message unavailable' using errcode='23514';
  end if;
  return new;
end $$;
drop trigger if exists validate_chat_reply on public.messages;
create trigger validate_chat_reply before insert or update of reply_to,conversation_id on public.messages
  for each row execute function public.validate_chat_reply();

create or replace function public.chat_search(conv uuid, term text, before_id bigint default null)
returns table(id bigint,sender uuid,body text,created_at timestamptz)
language sql stable security invoker set search_path=public as $$
  select m.id,m.sender,m.body,m.created_at
  from public.messages m
  where m.conversation_id=conv and auth.uid() is not null
    and char_length(trim(term)) between 2 and 100
    and (before_id is null or m.id<before_id)
    and strpos(lower(m.body),lower(trim(term)))>0
  order by m.id desc limit 40;
$$;
revoke all on function public.chat_search(uuid,text,bigint) from public,anon;
grant execute on function public.chat_search(uuid,text,bigint) to authenticated;
notify pgrst, 'reload schema';
commit;
