import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');

// A and B already wrote to each other before this migration; C is a stranger; D… are the crowd that reacts
const A = '11111111-1111-1111-1111-111111111111', B = '22222222-2222-2222-2222-222222222222', C = '33333333-3333-3333-3333-333333333333';
const OWNER = '44444444-4444-4444-4444-444444444444', ADMIN = '55555555-5555-5555-5555-555555555555', CONV = '66666666-6666-6666-6666-666666666666';
const CROWD = Array.from({ length: 11 }, (_, i) => `aaaaaaaa-0000-0000-0000-${String(i + 1).padStart(12, '0')}`);
const db = new PGlite();
async function as(user, sql) {
  await db.exec(`reset role; select set_config('test.uid', '${user}', false); set role authenticated;`);
  try { return (await db.query(sql)).rows; } finally { await db.exec(`reset role; select set_config('test.uid', '', false);`); }
}
const refused = (user, sql, pattern) => assert.rejects(as(user, sql), pattern);
const one = async (sql) => (await db.query(sql)).rows[0];
const notes = async (user, kind) => (await db.query(`select * from public.notifications where user_id = '${user}'${kind ? ` and kind = '${kind}'` : ''} order by id`)).rows;

test('friends, the feed, chats with media, and the notifications Sima sends', async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users(id uuid primary key, email text, phone text, raw_user_meta_data jsonb, email_confirmed_at timestamptz, phone_confirmed_at timestamptz, last_sign_in_at timestamptz, created_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    grant usage on schema public, auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    -- what Supabase gives every new table and function in public (row-level security and explicit revokes are the guard)
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    insert into auth.users(id, email, email_confirmed_at) values ('${A}', 'a@x', now()), ('${B}', 'b@x', now()), ('${C}', 'c@x', now()), ('${OWNER}', 'OWNER_EMAIL', now()), ('${ADMIN}', 'admin@x', now())
      ${CROWD.map(u => `, ('${u}', null, null)`).join('')};`);
  await db.exec((await readFile(new URL('../source/supabase/schema.sql', import.meta.url), 'utf8')).replace(/create extension[^;]*;/gi, ''));
  await db.exec(await readFile(new URL('supabase/migrations/202611080003_moderation.sql', import.meta.url), 'utf8'));
  await db.exec(`insert into public.profiles(id, display_name, role) values ('${A}', 'ანა', 'user'), ('${B}', 'ბექა', 'user'), ('${C}', 'ცირა', 'user'), ('${OWNER}', 'Owner', 'admin'), ('${ADMIN}', 'Admin', 'admin')
      ${CROWD.map((u, i) => `, ('${u}', 'P${i}', 'user')`).join('')}
      on conflict (id) do update set display_name = excluded.display_name, role = excluded.role;
    insert into public.conversations(id, a, b) values ('${CONV}', '${A}', '${B}');
    insert into public.messages(conversation_id, sender, body) values ('${CONV}', '${A}', 'old hello');`);
  // the part of Supabase Storage the migration touches: the bucket list, the objects and their policies
  await db.exec(`create schema storage;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, created_at timestamptz default now());
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
    grant usage on schema storage to authenticated; grant select, insert, delete on storage.objects to authenticated; grant execute on function storage.foldername(text) to authenticated;`);
  await db.exec(await readFile(new URL('supabase/migrations/202611090002_social.sql', import.meta.url), 'utf8'));
  await db.exec(await readFile(new URL('supabase/migrations/202611090002_social.sql', import.meta.url), 'utf8'));   // running it twice changes nothing
  assert.deepEqual((await one(`select public, file_size_limit from storage.buckets where id = 'social'`)), { public: false, file_size_limit: 52428800 });

  // the pair who already talked stayed friends; nobody else is
  assert.equal((await one(`select count(*)::int n from public.friendships where status = 'accepted'`)).n, 1);
  assert.deepEqual((await as(A, `select display_name from public.people('')`)).map(r => r.display_name), ['ბექა']);

  // nicknames: lower case, unique, not offensive
  assert.equal((await as(A, `select public.set_nickname('@Ana_Panduri') v`))[0].v, 'ana_panduri');
  await as(B, `select public.set_nickname('beka')`);
  await as(C, `select public.set_nickname('cira.k')`);
  await refused(C, `select public.set_nickname('beka')`, /nickname-taken/);
  await refused(C, `select public.set_nickname('x')`, /nickname-invalid/);
  await refused(C, `select public.set_nickname('_bad')`, /nickname-invalid/);
  await refused(C, `select public.set_nickname('fuck_you')`, /objectionable-content/);
  for (let i = 0; i < CROWD.length; i++) await as(CROWD[i], `select public.set_nickname('p${i}x')`);

  // a stranger is not in the directory, cannot open a chat, and is found only by the exact nickname
  assert.equal((await as(C, `select * from public.people('')`)).length, 0);
  await refused(C, `select public.open_conversation('${A}')`, /not-friends/);
  assert.equal((await as(C, `select * from public.find_nickname('ana')`)).length, 0);
  assert.equal((await as(C, `select relation from public.find_nickname('@ANA_panduri')`))[0].relation, 'none');

  // 5 · a request and its acceptance, each told by Sima
  assert.equal((await as(C, `select public.friend_request('ana_panduri') v`))[0].v, 'outgoing');
  assert.equal((await as(C, `select public.friend_request('ana_panduri') v`))[0].v, 'outgoing');
  let [req] = await notes(A, 'friend_request');
  assert.equal(req.title, 'სიმა · მეგობრობის თხოვნა');
  assert.equal(req.body, 'ცირა (@cira.k) მეგობრობას გთხოვს.');
  assert.equal(req.go, 'community:friends');
  assert.equal((await as(A, `select relation from public.my_friends() where id = '${C}'`))[0].relation, 'incoming');
  await refused(C, `select public.friend_respond('${A}', true)`, /not-found/);   // only the one asked can accept
  assert.equal((await as(A, `select public.friend_respond('${C}', true) v`))[0].v, 'friend');
  const [acc] = await notes(C, 'friend_accept');
  assert.equal(acc.body, 'ანა უკვე შენი მეგობარია — მიწერე!');
  assert.ok((await one(`select read_at from public.notifications where id = ${req.id}`)).read_at, 'the request is read once answered');
  // asking someone who asked you first makes you friends at once
  await as(CROWD[0], `select public.friend_request('ana_panduri')`);
  assert.equal((await as(A, `select public.friend_request('p0x') v`))[0].v, 'friend');
  await as(A, `select public.friend_remove('${CROWD[0]}')`);
  assert.equal((await as(A, `select count(*)::int n from public.my_friends() where id = '${CROWD[0]}'`))[0].n, 0);

  // 1 · a message, with a photo, to a friend
  const CV2 = (await as(A, `select public.open_conversation('${C}') id`))[0].id;
  await as(A, `insert into public.messages(conversation_id, media_path, media_kind) values ('${CV2}', '${A}/c/1.jpg', 'photo')`);
  await refused(A, `insert into public.messages(conversation_id, media_path, media_kind) values ('${CV2}', '${C}/c/stolen.jpg', 'photo')`, /row-level security/);
  await refused(A, `insert into public.messages(conversation_id, body) values ('${CV2}', '')`, /messages_content/);
  await as(A, `insert into public.messages(conversation_id, body) values ('${CV2}', 'გამარჯობა')`);
  let msgs = await notes(C, 'message');
  assert.equal(msgs.length, 1, 'one row per chat: the newer message replaces the unread one');
  assert.equal(msgs[0].body, 'ანა გწერს: „გამარჯობა“');
  assert.equal(msgs[0].tag, 'c:' + CV2);
  const conv = (await as(C, `select * from public.my_conversations()`))[0];
  assert.equal(conv.unread, 2); assert.equal(conv.last_sender, A); assert.equal(conv.other_nick, 'ana_panduri');
  await as(C, `select public.chat_mark_read('${CV2}')`);
  assert.equal((await as(C, `select unread from public.my_conversations()`))[0].unread, 0);
  assert.ok((await notes(C, 'message'))[0].read_at);
  await as(A, `insert into public.messages(conversation_id, media_path, media_kind) values ('${CV2}', '${A}/c/2.mp4', 'video')`);
  assert.equal((await notes(C, 'message')).at(-1).body, 'ანა გწერს: „🎬 ვიდეო“');

  // stickers and GIFs: by name and from GIPHY only
  await as(A, `insert into public.messages(conversation_id, sticker) values ('${CV2}', 'panduri')`);
  assert.equal((await notes(C, 'message')).at(-1).body, 'ანა გწერს: „🪕 სტიკერი“');
  assert.equal((await as(C, `select last_kind from public.my_conversations()`))[0].last_kind, 'sticker');
  await as(A, `insert into public.messages(conversation_id, gif) values ('${CV2}', 'https://media2.giphy.com/media/abc/200w.gif')`);
  await refused(A, `insert into public.messages(conversation_id, gif) values ('${CV2}', 'https://evil.example/x.gif')`, /messages_content/);
  await refused(A, `insert into public.messages(conversation_id, sticker) values ('${CV2}', '<script>')`, /messages_content/);

  // 2 · a reaction to the photo in the chat
  const photoMsg = (await one(`select id from public.messages where media_path = '${A}/c/1.jpg'`)).id;
  assert.equal((await as(C, `select public.react_message(${photoMsg}, 'panduri') v`))[0].v, 'panduri');
  assert.equal((await notes(A, 'chat_reaction'))[0].body, 'ცირა რეაგირებს შენს ფოტოზე: 🪕');
  assert.equal((await as(C, `select public.react_message(${photoMsg}, 'panduri') v`))[0].v, null, 'the same reaction again takes it back');
  await refused(B, `select public.react_message(${photoMsg}, 'heart')`, /not-found/);

  // the chat's files: its two people, nobody else
  assert.equal((await as(C, `select public.can_read_media('${A}/c/1.jpg') v`))[0].v, true);
  assert.equal((await as(B, `select public.can_read_media('${A}/c/1.jpg') v`))[0].v, false);

  // 3 · a friend posts: every friend hears it, a stranger does not
  const [{ id: vid }] = await as(A, `insert into public.feed_posts(kind, caption, media_path, thumb_path, media_meta) values ('video', 'ჩემი პირველი მრავალჟამიერი', '${A}/p/v.mp4', '${A}/p/v.jpg', '{"dur": 31}') returning id`);
  assert.equal((await notes(B, 'friend_post'))[0].body, 'ანა ახალ ვიდეოს აზიარებს: „ჩემი პირველი მრავალჟამიერი“');
  assert.equal((await notes(C, 'friend_post')).length, 1);
  assert.equal((await notes(CROWD[1], 'friend_post')).length, 0);
  await refused(A, `insert into public.feed_posts(kind, media_path) values ('photo', '${B}/p/x.jpg')`, /not-your-file/);
  await refused(A, `insert into public.feed_posts(kind, caption) values ('text', '')`, /check constraint/);
  await refused(A, `insert into public.feed_posts(kind, caption, reactions) values ('text', 'fuck this', 0)`, /objectionable-content/);
  const [{ id: secret }] = await as(A, `insert into public.feed_posts(kind, caption, media_path, visibility, reactions) values ('photo', 'friends only', '${A}/p/s.jpg', 'friends', 999) returning id`);
  assert.equal((await one(`select reactions from public.feed_posts where id = ${secret}`)).reactions, 0, 'counters cannot be set by the author');

  // global vs friends: a stranger sees the public video, not the friends-only photo; a friend sees both
  const ids = async (u, tab) => (await as(u, `select id from public.feed('${tab}', 30)`)).map(r => +r.id);
  assert.deepEqual(await ids(CROWD[1], 'foryou'), [+vid]);
  assert.deepEqual(await ids(CROWD[1], 'friends'), []);
  assert.deepEqual(await ids(B, 'friends'), [+secret, +vid]);
  assert.deepEqual(await ids(A, 'foryou'), [], 'my own posts are not in my global feed');
  assert.equal((await as(CROWD[1], `select public.can_read_media('${A}/p/v.mp4') v`))[0].v, true);
  assert.equal((await as(CROWD[1], `select public.can_read_media('${A}/p/s.jpg') v`))[0].v, false);
  assert.equal((await as(CROWD[1], `select count(*)::int n from public.feed_posts`))[0].n, 1);

  // the global feed puts what I have not seen first, then the most popular
  const [{ id: other }] = await as(B, `insert into public.feed_posts(kind, caption) values ('text', 'კითხვა: როგორ ვაწყობ?') returning id`);
  await as(CROWD[1], `select public.feed_seen(array[${other}]::bigint[])`);
  assert.deepEqual(await ids(CROWD[1], 'foryou'), [+vid, +other]);
  assert.deepEqual((await as(CROWD[1], `select id from public.feed('foryou', 30, null, null, array[${vid}]::bigint[])`)).map(r => +r.id), [+other]);
  assert.equal((await one(`select views from public.feed_posts where id = ${other}`)).views, 1);

  // reactions: one per person, collapsed into one unread notification; 10 reactions is a record, and the best post in the app
  for (const u of CROWD.slice(1, 11)) await as(u, `select public.react_post(${vid}, 'fire')`);
  assert.equal((await one(`select reactions from public.feed_posts where id = ${vid}`)).reactions, 10);
  const pr = await notes(A, 'post_reaction');
  assert.equal(pr.length, 1);
  assert.equal(pr[0].body, 'P10 და კიდევ 9 რეაგირებენ შენს ვიდეოზე 🔥');
  assert.equal((await notes(A, 'record'))[0].body, 'შენმა ვიდეომ 10 რეაქციას მიაღწია!');
  assert.equal((await notes(A, 'record_app'))[0].body, 'შენს ვიდეოს ახლა მთელ აპში ყველაზე მეტი რეაქცია აქვს!');
  await as(CROWD[1], `select public.react_post(${vid}, 'fire')`);   // taken back
  await as(CROWD[1], `select public.react_post(${vid}, 'fire')`);   // and given again: still one record
  assert.equal((await notes(A, 'record')).length, 1);
  const card = (await as(CROWD[2], `select * from public.feed('one', 1, ${vid})`))[0];
  assert.equal(card.my_reaction, 'fire'); assert.deepEqual(card.top, ['fire']); assert.equal(card.reactions, 10);
  await refused(CROWD[1], `select public.react_post(${secret}, 'heart')`, /not-found/);

  // comments
  await as(B, `insert into public.feed_comments(post_id, body) values (${vid}, 'ძალიან კარგია!')`);
  assert.equal((await notes(A, 'comment'))[0].body, 'ბექა წერს შენს ვიდეოზე: „ძალიან კარგია!“');
  assert.equal((await one(`select comments from public.feed_posts where id = ${vid}`)).comments, 1);
  await refused(CROWD[1], `insert into public.feed_comments(post_id, body) values (${secret}, 'hi')`, /row-level security/);

  // the day's most popular post
  await db.exec('select public.sima_daily_top()'); await db.exec('select public.sima_daily_top()');
  const top = await notes(A, 'record_top');
  assert.equal(top.length, 1);
  assert.equal(top[0].body, 'შენი ვიდეო დღეს გლობალურ ფიდში ყველაზე პოპულარულია — ახალი მომხმარებლები მას პირველს ნახულობენ!');

  // sharing a post into a chat counts it, and the other side may open it
  await as(A, `insert into public.messages(conversation_id, post_ref) values ('${CV2}', ${other})`);
  assert.equal((await one(`select shares from public.feed_posts where id = ${other}`)).shares, 1);

  // a block hides posts both ways and silences notifications from the blocked person
  await as(CROWD[3], `insert into public.blocks(blocked) values ('${A}')`);
  assert.deepEqual(await ids(CROWD[3], 'foryou'), [+other]);
  const before = (await notes(A)).length;
  await refused(CROWD[3], `select public.react_post(${vid}, 'sad')`, /not-found/);
  assert.equal((await notes(A)).length, before);

  // the help board: a question with a recording, readable by every member, never with someone else's file
  await as(C, `insert into public.posts(title, media_path, media_kind) values ('ეს აკორდი სწორია?', '${C}/h/q.m4a', 'audio')`);
  await refused(C, `insert into public.posts(title, media_path, media_kind) values ('x', '${A}/h/q.m4a', 'audio')`, /row-level security/);
  assert.equal((await as(CROWD[5], `select public.can_read_media('${C}/h/q.m4a') v`))[0].v, true);

  // reports and removal
  await as(CROWD[4], `select public.report_content('feed', '${vid}', 'spam')`);
  const rep = (await as(ADMIN, `select * from public.admin_open_reports()`))[0];
  assert.equal(rep.kind, 'feed');

  // 6 · a streak that reaches a week; 7 · the daily reminder at my hour, with what is left to do
  await as(B, `select public.save_notify_settings('{"hour": 3, "tz": "Mars/Base", "lang": "ka", "streak": 2, "last_practice": "2020-01-01T00:00:00Z"}')`);
  assert.equal((await one(`select tz from public.notify_settings where user_id = '${B}'`)).tz, 'Asia/Tbilisi', 'an unknown time zone falls back');
  await as(B, `select public.save_notify_settings('{"hour": 3, "tz": "UTC", "streak": 7}')`);
  assert.equal((await notes(B, 'streak'))[0].body, 'ყოჩაღ! 7 დღეა ზედიზედ ვარჯიშობ. ასე გააგრძელე!');
  await as(B, `update public.notify_settings set reminded_on = '2000-01-01', streak_told = 0`);   // no policy lets a member write the server's columns
  assert.equal((await one(`select reminded_on, streak_told from public.notify_settings where user_id = '${B}'`)).streak_told, 7);
  const hour = (await one(`select extract(hour from now() at time zone 'UTC')::int h`)).h;
  await as(B, `select public.save_notify_settings('${JSON.stringify({ hour, tz: 'UTC', streak: 4, goal_min: 20, last_practice: new Date(Date.now() - 864e5).toISOString(), todo: [{ k: 'exam', s: 'პირველი ბლოკი' }, { k: 'theory', s: 'ინტერვალები' }] })}')`);
  assert.equal((await one('select public.sima_reminders() n')).n >= 1, true);
  assert.equal((await one('select public.sima_reminders() n')).n, 0, 'once a day');
  const rem = (await notes(B, 'reminder'))[0];
  assert.equal(rem.body, '4 დღეა ზედიზედ ვარჯიშობ — დღეს ჯერ არ გიკრავს. გელოდება: გამოცდა „პირველი ბლოკი“ · თეორიის გამეორება: „ინტერვალები“');
  await as(C, `select public.save_notify_settings('${JSON.stringify({ hour, tz: 'UTC', lang: 'en', last_practice: new Date(Date.now() - 3 * 864e5).toISOString(), todo: [{ k: 'song', s: 'Mravalzhamieri' }] })}')`);
  await db.exec('select public.sima_reminders()');
  assert.equal((await notes(C, 'idle'))[0].body, 'You have not practised for 3 days. Even 10 minutes today is enough. Waiting for you: song “Mravalzhamieri”');
  await as(A, `select public.save_notify_settings('${JSON.stringify({ hour, tz: 'UTC', last_practice: new Date().toISOString() })}')`);
  await db.exec('select public.sima_reminders()');
  assert.equal((await notes(A, 'reminder')).length, 0, 'no reminder on a day already played');

  // 8 · a new version, announced by the owner only, reaches everybody in their language
  await refused(ADMIN, `select public.announce_release('2.0', 'ახალი ფიდი', 'A new feed')`, /not-allowed/);
  const told = (await as(OWNER, `select public.announce_release('2.0', 'ახალი ფიდი', 'A new feed') n`))[0].n;
  assert.equal(told, 5 + CROWD.length);
  assert.equal((await notes(B, 'update'))[0].body, 'ვერსია 2.0: ახალი ფიდი');
  assert.equal((await notes(C, 'update'))[0].title, 'Sima · The app has been updated ✨');
  assert.equal((await notes(C, 'update'))[0].body, 'Version 2.0: A new feed');

  // devices: the same browser moves to whoever signs in on it
  await as(A, `select public.push_register('web', 'https://push.example/abc', 'p', 'k', 'ka', 'Chrome')`);
  await as(B, `select public.push_register('web', 'https://push.example/abc', 'p', 'k', 'ka', 'Chrome')`);
  assert.equal((await as(A, `select count(*)::int n from public.push_devices`))[0].n, 0);
  assert.equal((await as(B, `select count(*)::int n from public.push_devices`))[0].n, 1);
  await refused(B, `select public.push_register('web', 'http://insecure', 'p', 'k')`, /invalid-subscription/);
  await as(B, `select public.push_unregister('https://push.example/abc')`);
  assert.equal((await as(B, `select count(*)::int n from public.push_devices`))[0].n, 0);

  // storage: a member uploads only into their own folder, and reads only what they may see
  await as(A, `insert into storage.objects(bucket_id, name) values ('social', '${A}/p/v.mp4'), ('social', '${A}/p/s.jpg'), ('social', '${A}/c/1.jpg')`);
  await refused(A, `insert into storage.objects(bucket_id, name) values ('social', '${B}/p/x.jpg')`, /row-level security/);
  assert.deepEqual((await as(CROWD[1], `select name from storage.objects order by name`)).map(r => r.name), [`${A}/p/v.mp4`]);
  assert.equal((await as(B, `select count(*)::int n from storage.objects`))[0].n, 2, 'a friend: the public and the friends-only file, not a chat they are not in');
  assert.equal((await as(C, `select count(*)::int n from storage.objects`))[0].n, 3, 'C is in the chat that carries 1.jpg');
  // a file nothing uses any more is found for removal after a day; one in use never is
  await db.exec(`insert into storage.objects(bucket_id, name, created_at) values ('social', '${A}/p/lost.jpg', now() - interval '2 days'), ('social', '${A}/p/new.jpg', now());
    update storage.objects set created_at = now() - interval '2 days' where name = '${A}/p/v.mp4'`);
  assert.deepEqual((await db.query(`select * from public.orphan_media(10) x`)).rows.map(r => r.x), [`${A}/p/lost.jpg`]);
  await refused(A, `select * from public.orphan_media(10)`, /permission denied/);

  // what only the server may do
  await refused(A, `select public.sima_notify('${B}', 'message', null, '{}', null, null)`, /permission denied/);
  await refused(A, `select public.sima_reminders()`, /permission denied/);
  await refused(A, `select public.push_hook_secret()`, /permission denied/);
  await refused(A, `select * from public.server_config`, /permission denied/);
  assert.equal((await as(A, `select count(*)::int n from public.notifications where user_id <> '${A}'`))[0].n, 0);

  // the test button, and reading
  await as(A, `select public.sima_test()`);
  await refused(A, `select public.sima_test()`, /slow-down/);
  const [n1, n2] = (await notes(A)).filter(n => !n.read_at).map(n => n.id);
  await as(A, `select public.notifications_read(array[${n2}]::bigint[])`);
  assert.equal((await one(`select read_at from public.notifications where id = ${n1}`)).read_at, null, 'one read, the others untouched');
  await as(A, `select public.notifications_read()`);
  assert.equal((await as(A, `select count(*)::int n from public.notifications where read_at is null`))[0].n, 0);
});
