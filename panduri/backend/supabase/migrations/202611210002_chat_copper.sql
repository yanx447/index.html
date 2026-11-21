alter table public.chat_preferences drop constraint chat_preferences_theme_check;
alter table public.chat_preferences add constraint chat_preferences_theme_check
  check (theme in ('graphite','sand','ocean','plum','midnight','aurora','rose','forest','sunset','ice',
                   'copper','ember','linen','obsidian'));
