-- Messenger: per-account preferences, private receipts, expiring typing, pins,
-- groups and files. Existing pair conversations and message IDs are preserved.
alter table public.conversations add column if not exists group_name text check (char_length(group_name) between 1 and 80);
-- A pair can also take part in multiple groups; only direct chats are unique.
alter table public.conversations drop constraint if exists conversations_a_b_key;
create unique index if not exists conversations_direct_pair on public.conversations(a,b) where group_name is null;
create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  primary key(conversation_id,user_id)
);
alter table public.conversation_members enable row level security;
create index if not exists conversation_members_user on public.conversation_members(user_id,conversation_id);

create or replace function public.chat_member(conv uuid, person uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select person is not null and exists(select 1 from public.conversations c where c.id=conv and
    (c.group_name is null and person in(c.a,c.b) or c.group_name is not null and exists(
      select 1 from public.conversation_members cm where cm.conversation_id=c.id and cm.user_id=person)));
$$;
create or replace function public.conversation_friends(conv uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.conversations c where c.id=conv and
    (c.group_name is null and public.is_friend(c.a,c.b) or c.group_name is not null and public.chat_member(conv)));
$$;
create or replace function public.conversation_blocked(conv uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.conversations c where c.id=conv and c.group_name is null and public.blocked_between(c.a,c.b));
$$;
drop policy if exists "participants" on public.conversations;
create policy "participants" on public.conversations for select using(public.chat_member(id));
drop policy if exists "read members" on public.conversation_members;
create policy "read members" on public.conversation_members for select using(public.chat_member(conversation_id));
drop policy if exists "read in my conversations" on public.messages;
create policy "read in my conversations" on public.messages for select using(public.chat_member(conversation_id));
drop policy if exists "write in my conversations" on public.messages;
create policy "write in my conversations" on public.messages for insert with check(sender=auth.uid() and public.chat_member(conversation_id));
drop policy if exists "participants read reactions" on public.message_reactions;
create policy "participants read reactions" on public.message_reactions for select using(public.chat_member(conversation_id));

create table if not exists public.chat_preferences (
  conversation_id uuid not null references public.conversations on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  theme text not null default 'graphite' check(theme in('graphite','sand','ocean','plum')),
  font text not null default 'default' check(font in('default','serif','mono')),
  muted boolean not null default false,
  notifications boolean not null default true,
  sounds boolean not null default true,
  read_receipts boolean not null default true,
  typing_indicator boolean not null default true,
  restricted boolean not null default false,
  quick_reaction text not null default 'heart' check(quick_reaction in('panduri','heart','fire','clap','laugh','wow','sad')),
  cleared_before bigint not null default 0,
  shared_read bigint not null default 0,
  typing_at timestamptz,
  primary key(conversation_id,user_id)
);
alter table public.chat_preferences enable row level security;
drop policy if exists "own chat preferences" on public.chat_preferences;
create policy "own chat preferences" on public.chat_preferences for select using(user_id=auth.uid() and public.chat_member(conversation_id));
-- Settings writes go through a validating RPC; receipt/clear/typing fields cannot be forged.
create or replace function public.chat_settings(conv uuid, settings jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare p public.chat_preferences;
begin
  if not public.chat_member(conv) then raise exception 'denied' using errcode='42501'; end if;
  insert into public.chat_preferences(conversation_id,user_id) values(conv,auth.uid()) on conflict do nothing;
  update public.chat_preferences set
    theme=coalesce(settings->>'theme',theme), font=coalesce(settings->>'font',font),
    muted=coalesce((settings->>'muted')::boolean,muted), notifications=coalesce((settings->>'notifications')::boolean,notifications),
    sounds=coalesce((settings->>'sounds')::boolean,sounds), read_receipts=coalesce((settings->>'read_receipts')::boolean,read_receipts),
    typing_indicator=coalesce((settings->>'typing_indicator')::boolean,typing_indicator),
    restricted=coalesce((settings->>'restricted')::boolean,restricted), quick_reaction=coalesce(settings->>'quick_reaction',quick_reaction)
    where conversation_id=conv and user_id=auth.uid() returning * into p;
  if not p.typing_indicator or p.restricted then
    update public.chat_preferences set typing_at=null where conversation_id=conv and user_id=auth.uid();
  end if;
  return to_jsonb(p)-'typing_at'-'shared_read';
end $$;
create or replace function public.chat_typing(conv uuid, active boolean) returns void
language plpgsql security definer set search_path=public as $$
begin
  if not public.chat_member(conv) or public.conversation_blocked(conv) then return; end if;
  insert into public.chat_preferences(conversation_id,user_id) values(conv,auth.uid()) on conflict do nothing;
  update public.chat_preferences set typing_at=case when active and typing_indicator and not restricted then now() else null end
    where conversation_id=conv and user_id=auth.uid();
end $$;
create or replace function public.chat_mark_read(conv uuid) returns void
language plpgsql security definer set search_path=public as $$
declare top bigint;
begin
  if not public.chat_member(conv) then return; end if;
  select coalesce(max(id),0) into top from public.messages where conversation_id=conv;
  insert into public.chat_reads(user_id,conversation_id,last_read) values(auth.uid(),conv,top)
    on conflict(user_id,conversation_id) do update set last_read=greatest(public.chat_reads.last_read,excluded.last_read);
  insert into public.chat_preferences(conversation_id,user_id) values(conv,auth.uid()) on conflict do nothing;
  update public.chat_preferences set shared_read=greatest(shared_read,top)
    where conversation_id=conv and user_id=auth.uid() and read_receipts and not restricted;
  update public.notifications set read_at=now() where user_id=auth.uid() and read_at is null and tag in('c:'||conv,'cr:'||conv);
end $$;
create or replace function public.chat_clear(conv uuid) returns void
language plpgsql security definer set search_path=public as $$
begin
  if not public.chat_member(conv) then raise exception 'denied' using errcode='42501'; end if;
  perform public.chat_mark_read(conv);
  insert into public.chat_preferences(conversation_id,user_id) values(conv,auth.uid()) on conflict do nothing;
  update public.chat_preferences set cleared_before=(select coalesce(max(id),0) from public.messages where conversation_id=conv)
    where conversation_id=conv and user_id=auth.uid();
end $$;
drop policy if exists "cleared messages" on public.messages;
create policy "cleared messages" on public.messages as restrictive for select using(id>coalesce(
  (select p.cleared_before from public.chat_preferences p where p.conversation_id=messages.conversation_id and p.user_id=auth.uid()),0));

create table if not exists public.chat_pins (
  message_id bigint primary key references public.messages on delete cascade,
  conversation_id uuid not null references public.conversations on delete cascade,
  pinned_by uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.chat_pins enable row level security;
drop policy if exists "read pins" on public.chat_pins;
create policy "read pins" on public.chat_pins for select using(public.chat_member(conversation_id));
create or replace function public.chat_pin(msg bigint, keep boolean) returns void
language plpgsql security definer set search_path=public as $$
declare conv uuid;
begin
  select conversation_id into conv from public.messages where id=msg;
  if conv is null or not public.chat_member(conv) or public.conversation_blocked(conv) or public.community_banned(auth.uid()) then
    raise exception 'denied' using errcode='42501'; end if;
  if keep then
    insert into public.chat_pins(message_id,conversation_id,pinned_by) values(msg,conv,auth.uid()) on conflict do nothing;
  else delete from public.chat_pins where message_id=msg; end if;
end $$;
create or replace function public.chat_state(conv uuid) returns jsonb
language plpgsql security definer set search_path=public as $$
declare c public.conversations; mine public.chat_preferences; result jsonb;
begin
  if not public.chat_member(conv) then raise exception 'denied' using errcode='42501'; end if;
  select * into c from public.conversations where id=conv;
  insert into public.chat_preferences(conversation_id,user_id) values(conv,auth.uid()) on conflict do nothing;
  select * into mine from public.chat_preferences where conversation_id=conv and user_id=auth.uid();
  select jsonb_build_object('group_name',c.group_name,'preferences',to_jsonb(mine)-'typing_at'-'shared_read',
    'other',case when c.group_name is null then case when c.a=auth.uid() then c.b else c.a end end,
    'members',(select jsonb_agg(jsonb_build_object('id',p.id,'name',p.display_name,'nickname',p.nickname,'avatar',p.avatar_url)) from public.profiles p where p.id in (select c.a where c.group_name is null union select c.b where c.group_name is null union select cm.user_id from public.conversation_members cm where cm.conversation_id=c.id and c.group_name is not null)),
    'typing',coalesce((select jsonb_agg(public.display_of(p.user_id)) from public.chat_preferences p where p.conversation_id=conv and p.user_id<>auth.uid()
      and p.typing_indicator and not p.restricted and p.typing_at>now()-interval '6 seconds'
      and mine.typing_indicator and not mine.restricted and not public.blocked_between(p.user_id,auth.uid())), '[]'::jsonb),
    'read',coalesce((select max(p.shared_read) from public.chat_preferences p where p.conversation_id=conv and p.user_id<>auth.uid()
      and p.read_receipts and not p.restricted and mine.read_receipts and not mine.restricted
      and not public.blocked_between(p.user_id,auth.uid())),0),
    'pins',coalesce((select jsonb_agg(message_id order by created_at desc) from public.chat_pins where conversation_id=conv),'[]'::jsonb)) into result;
  return result;
end $$;

create or replace function public.create_chat_group(title text, members uuid[]) returns uuid
language plpgsql security definer set search_path=public as $$
declare people uuid[]; cid uuid; person uuid;
begin
  if auth.uid() is null or public.community_banned(auth.uid()) then raise exception 'denied' using errcode='42501'; end if;
  title:=trim(title);
  if title is null or char_length(title) not between 1 and 80 or public.has_objectionable_text(title) then raise exception 'invalid-title'; end if;
  select array_agg(distinct x order by x) into people from unnest(array_append(members,auth.uid())) x where x is not null;
  if cardinality(people) not between 3 and 32 then raise exception 'group-size'; end if;
  foreach person in array people loop
    if person<>auth.uid() and (not public.is_friend(auth.uid(),person) or public.blocked_between(auth.uid(),person)) then raise exception 'not-friends' using errcode='42501'; end if;
  end loop;
  insert into public.conversations(a,b,group_name) values(people[1],people[2],title) returning id into cid;
  insert into public.conversation_members(conversation_id,user_id) select cid,unnest(people);
  return cid;
end $$;
-- open_conversation must never return a group belonging to the same first pair.
create or replace function public.open_conversation(other uuid) returns uuid
language plpgsql security definer set search_path=public as $$
declare x uuid:=least(auth.uid(),other); y uuid:=greatest(auth.uid(),other); cid uuid;
begin
  if auth.uid() is null or other is null or other=auth.uid() or not public.is_friend(auth.uid(),other) or public.blocked_between(auth.uid(),other) then raise exception 'not-friends' using errcode='42501'; end if;
  insert into public.conversations(a,b) values(x,y) on conflict(a,b) where group_name is null do update set a=excluded.a returning id into cid;
  return cid;
end $$;
create or replace function public.my_conversations()
returns table(id uuid,other uuid,other_name text,other_avatar text,other_nick text,last_at timestamptz,last_body text,last_sender uuid,last_kind text,unread integer)
language sql stable security definer set search_path=public as $$
  select c.id,case when c.group_name is null then o.id end,coalesce(c.group_name,o.display_name),o.avatar_url,o.nickname,c.last_at,lm.body,lm.sender,
    coalesce(lm.media_kind,case when lm.sticker is not null then 'sticker' when lm.gif is not null then 'gif' when lm.post_ref is not null then 'post' end),
    (select count(*)::int from public.messages m where m.conversation_id=c.id and m.sender<>auth.uid()
      and m.id>greatest(coalesce(pr.cleared_before,0),coalesce((select last_read from public.chat_reads where user_id=auth.uid() and conversation_id=c.id),0))
      and not public.blocked_between(m.sender,auth.uid()))
  from public.conversations c
  left join public.profiles o on c.group_name is null and o.id=case when c.a=auth.uid() then c.b else c.a end
  left join public.chat_preferences pr on pr.conversation_id=c.id and pr.user_id=auth.uid()
  left join lateral(select m.* from public.messages m where m.conversation_id=c.id and m.id>coalesce(pr.cleared_before,0)
    and not public.blocked_between(m.sender,auth.uid()) order by m.id desc limit 1) lm on true
  where public.chat_member(c.id) and public.conversation_friends(c.id) and not public.conversation_blocked(c.id)
    and (coalesce(pr.cleared_before,0)=0 or lm.id is not null)
  order by c.last_at desc limit 100;
$$;
create or replace function public.react_message(msg bigint,emoji text) returns text
language plpgsql security definer set search_path=public as $$
declare conv uuid; cur text;
begin
  select m.conversation_id into conv from public.messages m where m.id=msg and public.chat_member(m.conversation_id);
  if conv is null or public.conversation_blocked(conv) or not public.conversation_friends(conv) or public.community_banned(auth.uid()) then raise exception 'denied' using errcode='42501'; end if;
  select r.emoji into cur from public.message_reactions r where r.message_id=msg and r.user_id=auth.uid();
  if emoji is null or cur=emoji then delete from public.message_reactions where message_id=msg and user_id=auth.uid(); return null; end if;
  insert into public.message_reactions(message_id,conversation_id,user_id,emoji) values(msg,conv,auth.uid(),emoji)
    on conflict(message_id,user_id) do update set emoji=excluded.emoji,created_at=now();
  return emoji;
end $$;

-- Update the content constraint, including old instrument-pack IDs containing '-'.
alter table public.messages drop constraint if exists messages_content;
alter table public.messages add constraint messages_content check(char_length(body)<=4000
  and (char_length(body)>=1 or media_path is not null or post_ref is not null or sticker is not null or gif is not null)
  and (sticker is null or sticker ~ '^[a-z0-9_-]{1,32}$')
  and (gif is null or (gif ~ '^https://(media[0-9]*|i)\.giphy\.com/' and char_length(gif)<=400))
  and (media_kind is null or media_kind in('photo','video','audio','file'))
  and ((media_path is null)=(media_kind is null)) and char_length(media_meta::text)<=2000);
create or replace function public.can_read_media(path text) returns boolean
language sql stable security definer set search_path=public as $$
  select auth.uid() is not null and (split_part(path,'/',1)=auth.uid()::text
    or exists(select 1 from public.feed_posts p where (p.media_path=path or p.thumb_path=path) and public.can_see_post(p.author,p.visibility))
    or exists(select 1 from public.messages m where (m.media_path=path or m.thumb_path=path) and public.chat_member(m.conversation_id) and not public.blocked_between(m.sender,auth.uid()))
    or exists(select 1 from public.posts p where (p.media_path=path or p.thumb_path=path) and not public.blocked_between(auth.uid(),p.author)));
$$;
do $$ begin
  if to_regclass('storage.buckets') is not null then
    update storage.buckets set allowed_mime_types=allowed_mime_types||array['application/pdf','text/plain','text/csv','application/zip',
      'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/octet-stream'] where id='social';
  end if;
end $$;
-- Calls remain 1:1. Restrict prevents ringing in either direction.
create or replace function public.chat_call_allowed(conv uuid) returns boolean
language sql stable security definer set search_path=public as $$
  select public.chat_member(conv) and exists(select 1 from public.conversations c where c.id=conv and c.group_name is null
    and not exists(select 1 from public.chat_preferences p where p.conversation_id=c.id and p.restricted));
$$;
revoke execute on function public.chat_call_allowed(uuid) from public,anon;
grant execute on function public.chat_call_allowed(uuid) to authenticated;
drop policy if exists "chat call privacy" on public.call_signals;
create policy "chat call privacy" on public.call_signals as restrictive for insert
  with check(kind in('end','busy') or public.chat_call_allowed(conversation_id));
create or replace function public.chat_notify_allowed(conv uuid,person uuid) returns boolean
language sql stable security definer set search_path=public as $$
  select not exists(select 1 from public.chat_preferences p where p.conversation_id=conv and p.user_id=person and (p.muted or not p.notifications or p.restricted));
$$;
create or replace function public.notify_message() returns trigger
language plpgsql security definer set search_path=public as $$
declare c public.conversations; person uuid;
begin
  select * into c from public.conversations where id=new.conversation_id;
  for person in select c.a where c.group_name is null union select c.b where c.group_name is null
    union select cm.user_id from public.conversation_members cm where cm.conversation_id=c.id and c.group_name is not null loop
    if person<>new.sender and public.chat_notify_allowed(c.id,person) and not public.blocked_between(new.sender,person) then
      perform public.sima_notify(person,'message',new.sender,
        jsonb_build_object('name',public.display_of(new.sender),'s',left(new.body,120),'what',coalesce(new.media_kind,'text'),'conv',c.id),
        'community:c:'||c.id||':'||coalesce(c.group_name,public.display_of(new.sender),''),'c:'||c.id,true);
    end if;
  end loop;
  return new;
end $$;
create or replace function public.notify_message_reaction() returns trigger
language plpgsql security definer set search_path=public as $$
declare m public.messages;
begin
  if tg_op='UPDATE' and new.emoji=old.emoji then return new; end if;
  select * into m from public.messages where id=new.message_id;
  if public.chat_notify_allowed(m.conversation_id,m.sender) then
    perform public.sima_notify(m.sender,'chat_reaction',new.user_id,
      jsonb_build_object('name',public.display_of(new.user_id),'e',new.emoji,'what',coalesce(m.media_kind,'message'),'conv',m.conversation_id),
      'community:c:'||m.conversation_id||':'||public.display_of(new.user_id),'cr:'||m.conversation_id,true);
  end if;
  return new;
end $$;
grant select on public.conversation_members,public.chat_preferences,public.chat_pins to authenticated;
revoke all on public.conversation_members,public.chat_preferences,public.chat_pins from anon;
revoke insert,update,delete on public.conversation_members,public.chat_preferences,public.chat_pins from authenticated;
do $$ declare f text; begin
  foreach f in array array['chat_member(uuid,uuid)','chat_settings(uuid,jsonb)','chat_typing(uuid,boolean)','chat_state(uuid)',
    'chat_clear(uuid)','chat_pin(bigint,boolean)','create_chat_group(text,uuid[])'] loop
    execute 'revoke execute on function public.'||f||' from public,anon';
    execute 'grant execute on function public.'||f||' to authenticated';
  end loop;
end $$;
revoke execute on function public.chat_notify_allowed(uuid,uuid) from public,anon,authenticated;

create or replace function public.report_content(item_kind text, item_ref text, why text) returns void
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); target uuid; quote text;
begin
  if me is null then raise exception 'not-authenticated'; end if;
  if item_kind = 'message' then
    select m.sender, left(coalesce(nullif(m.body, ''), '[' || coalesce(m.media_kind, case when m.sticker is not null then 'sticker' when m.gif is not null then 'gif' end, 'post') || '] ' || coalesce(m.media_path, m.gif, m.sticker, '')), 500) into target, quote
      from public.messages m join public.conversations c on c.id = m.conversation_id
      where m.id = item_ref::bigint and public.chat_member(c.id);
  elsif item_kind = 'post' then
    select p.author, left(p.title || E'\n' || coalesce(p.body, ''), 500) into target, quote from public.posts p where p.id = item_ref::bigint;
  elsif item_kind = 'reply' then
    select r.author, left(r.body, 500) into target, quote from public.replies r where r.id = item_ref::bigint;
  elsif item_kind = 'user' then
    select p.id, coalesce(p.display_name, '') || coalesce(' @' || p.nickname, '') into target, quote from public.profiles p where p.id = item_ref::uuid;
  elsif item_kind = 'feed' then
    select p.author, left('[' || p.kind || '] ' || p.caption || coalesce(E'\n' || p.media_path, ''), 500) into target, quote
      from public.feed_posts p where p.id = item_ref::bigint and public.can_see_post(p.author, p.visibility);
  elsif item_kind = 'comment' then
    select k.author, left(k.body, 500) into target, quote from public.feed_comments k where k.id = item_ref::bigint and public.post_visible(k.post_id);
  else
    raise exception 'invalid-kind';
  end if;
  if target is null then raise exception 'not-found'; end if;
  if target = me then raise exception 'own-content'; end if;
  insert into public.reports (reporter, target_user, kind, item_id, excerpt, reason)
    values (me, target, item_kind, item_ref, quote, why)
    on conflict (reporter, kind, item_id) where status = 'open' do nothing;
end $$;

