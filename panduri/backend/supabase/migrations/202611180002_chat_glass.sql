-- Expand chat appearance and Unicode emoji choices without changing membership/RLS.
begin;
create or replace function public.chat_emoji_allowed(value text) returns boolean
language sql immutable strict set search_path=public as $$
 select value in ('panduri','heart','fire','clap','laugh','wow','sad') or
   (char_length(value) between 1 and 32 and octet_length(value)<=128
    and value !~ '^[\x00-\x7f]*$' and value !~ '[[:space:]<>"&]'
    and regexp_replace(value,'[🅰🅱ℹⓂ🅾🅿]','','g') !~ '[[:alpha:]]');
$$;
revoke all on function public.chat_emoji_allowed(text) from public,anon;
grant execute on function public.chat_emoji_allowed(text) to authenticated;
alter table public.message_reactions drop constraint if exists message_reactions_emoji_check;
alter table public.message_reactions add constraint message_reactions_emoji_check check(public.chat_emoji_allowed(emoji));
alter table public.chat_preferences drop constraint if exists chat_preferences_quick_reaction_check;
alter table public.chat_preferences add constraint chat_preferences_quick_reaction_check check(public.chat_emoji_allowed(quick_reaction));
alter table public.chat_preferences drop constraint if exists chat_preferences_theme_check;
alter table public.chat_preferences add constraint chat_preferences_theme_check check(theme in('graphite','sand','ocean','plum','midnight','aurora','rose','forest','sunset','ice'));
alter table public.chat_preferences drop constraint if exists chat_preferences_font_check;
alter table public.chat_preferences add constraint chat_preferences_font_check check(font in('default','serif','mono','system','rounded','humanist','book','large'));
create or replace function public.sima_emoji(k text) returns text language sql immutable as $$
 select case k when 'panduri' then '🪕' when 'heart' then '❤️' when 'fire' then '🔥' when 'clap' then '👏' when 'laugh' then '😂' when 'wow' then '😮' when 'sad' then '😢' else case when public.chat_emoji_allowed(k) then k else '' end end;
$$;
commit;
