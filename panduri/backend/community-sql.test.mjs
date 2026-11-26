import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');

// The live server's state: social, without reels. A, B, C are members; D blocks A.
const A = '11111111-1111-1111-1111-111111111111', B = '22222222-2222-2222-2222-222222222222', C = '33333333-3333-3333-3333-333333333333', D = '77777777-7777-7777-7777-777777777777';
const OWNER = '44444444-4444-4444-4444-444444444444', ADMIN = '55555555-5555-5555-5555-555555555555';
const db = new PGlite();
async function as(user, sql) {
  await db.exec(`reset role; select set_config('test.uid', '${user}', false); set role authenticated;`);
  try { return (await db.query(sql)).rows; } finally { await db.exec(`reset role; select set_config('test.uid', '', false);`); }
}
const refused = (user, sql, pattern) => assert.rejects(as(user, sql), pattern);
const one = async (sql) => (await db.query(sql)).rows[0];
const mig = name => readFile(new URL('supabase/migrations/' + name, import.meta.url), 'utf8');

test('profiles, following, reposts, history, hashtags and search', async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users(id uuid primary key, email text, phone text, raw_user_meta_data jsonb, email_confirmed_at timestamptz, phone_confirmed_at timestamptz, last_sign_in_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    grant usage on schema public, auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    insert into auth.users(id, email, email_confirmed_at) values ('${A}', 'a@x', now()), ('${B}', 'b@x', now()), ('${C}', 'c@x', now()), ('${D}', 'd@x', now()), ('${OWNER}', 'OWNER_EMAIL', now()), ('${ADMIN}', 'admin@x', now());`);
  await db.exec(`create schema storage;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, metadata jsonb, created_at timestamptz default now());
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
    grant usage on schema storage to authenticated; grant select, insert, delete on storage.objects to authenticated; grant execute on function storage.foldername(text) to authenticated;`);
  await db.exec((await readFile(new URL('../source/supabase/schema.sql', import.meta.url), 'utf8')).replace(/create extension[^;]*;/gi, ''));
  await db.exec(await mig('202611080003_moderation.sql'));
  await db.exec(`insert into public.profiles(id, display_name, role) values ('${A}', 'ანა', 'user'), ('${B}', 'ბექა', 'user'), ('${C}', 'ცირა', 'user'), ('${D}', 'დათო', 'user'), ('${OWNER}', 'Owner', 'admin'), ('${ADMIN}', 'Admin', 'admin')
      on conflict (id) do update set display_name = excluded.display_name, role = excluded.role;`);
  await db.exec(await mig('202611090002_social.sql'));
  // a video posted on the live server before this migration (no song column yet), longer than a minute
  const [{ id: old }] = await as(A, `insert into public.feed_posts(kind, caption, media_path, thumb_path, media_meta) values ('video', 'ძველი #Panduri', '${A}/p/o.mp4', '${A}/p/o.jpg', '{"dur": 300}') returning id`);
  const community = await mig('202611160001_community_profiles.sql');
  await db.exec(community);
  await db.exec(community);   // running it twice changes nothing
  for (const [u, n] of [[A, 'ana'], [B, 'beka'], [C, 'cira'], [D, 'dato']]) await as(u, `select public.set_nickname('${n}')`);

  // the length is still not limited (the camera films up to ten minutes), and the song is kept
  const post = (u, cap, extra = '') => as(u, `insert into public.feed_posts(kind, caption, media_path, thumb_path, media_meta, song${extra ? ', visibility' : ''}) values ('video', '${cap}', '${u}/p/${Math.random().toString(36).slice(2)}.mp4', '${u}/p/t.jpg', '{"dur": 540, "w": 1080, "h": 1920}', 'მთიულური'${extra ? `, '${extra}'` : ''}) returning id, song`);
  const [v1] = await post(A, 'ვუკრავ #პანდური და #Fun ერთად #პანდური');
  assert.equal(v1.song, 'მთიულური');
  const [v2] = await post(A, 'მეგობრებისთვის #პანდური', 'friends');
  const [v3] = await post(C, 'სხვა რამ #ხორუმი');

  // hashtags: Georgian and Latin, lower-case, once each
  assert.deepEqual((await one(`select public.hashtags('ა #პანდური #Fun #fun #პანდური, #a_b1 #') as t`)).t.sort(), ['a_b1', 'fun', 'პანდური']);

  // a profile: the bio (160 at most, the word filter), the photo (only my own folder of the avatars bucket)
  assert.equal((await as(A, `select public.set_bio('  ფანდურზე ვუკრავ 🪕  ') as b`))[0].b, 'ფანდურზე ვუკრავ 🪕');
  assert.equal((await as(A, `select public.set_bio(repeat('ა', 200)) as b`))[0].b.length, 160);
  await refused(A, `select public.set_bio('შენ პიდარასტი')`, /objectionable-content/);
  await as(A, `select public.set_bio('ფანდურზე ვუკრავ')`);
  await refused(A, `select public.set_avatar('https://x.supabase.co/storage/v1/object/public/avatars/${B}/a.jpg')`, /not-your-file/);
  await refused(A, `select public.set_avatar('https://evil.example/a.jpg')`, /not-your-file/);
  await as(A, `select public.set_avatar('https://x.supabase.co/storage/v1/object/public/avatars/${A}/a.jpg')`);
  assert.match((await one(`select avatar_url from public.profiles where id = '${A}'`)).avatar_url, /avatars\/1111/);
  assert.equal((await one(`select public from storage.buckets where id = 'avatars'`)).public, true);

  // following: one way; the one followed hears about it once, in their language
  assert.equal((await as(B, `select public.follow('${A}') as f`))[0].f, true);
  assert.equal((await as(B, `select public.follow('${A}') as f`))[0].f, true);   // again: still one
  await as(C, `select public.follow('${A}')`);
  await refused(A, `select public.follow('${A}')`, /self/);
  const fo = (await db.query(`select body, go from public.notifications where user_id = '${A}' and kind = 'follow' order by id`)).rows;
  assert.equal(fo.length, 2); assert.match(fo[0].body, /ბექა გამოგიწერა/); assert.equal(fo[0].go, 'community:u:' + B);
  // a block: D blocks A — A can neither follow D nor find D, and D's videos never reach A
  await as(D, `insert into public.blocks(blocked) values ('${A}')`);
  await refused(A, `select public.follow('${D}')`, /not-found/);
  assert.equal((await as(A, `select * from public.search_users('dat')`)).length, 0);

  // the card: followers, following, likes of every video together
  await as(B, `select public.react_post(${v1.id}, 'panduri')`);
  await as(C, `select public.react_post(${v1.id}, 'heart')`);
  await as(B, `select public.react_post(${old}, 'fire')`);
  let card = (await as(B, `select * from public.profile_card('${A}')`))[0];
  assert.equal(card.followers, 2); assert.equal(card.following, 0); assert.equal(Number(card.likes), 3); assert.equal(card.i_follow, true); assert.equal(card.follows_me, false);
  assert.equal(card.bio, 'ფანდურზე ვუკრავ'); assert.equal(card.relation, 'none');
  assert.equal(card.videos, 2);   // B is not A's friend: the friends-only video is not counted for B
  assert.equal((await as(A, `select * from public.profile_card(null, '@ana')`))[0].videos, 3);
  assert.equal((await as(A, `select * from public.profile_card()`))[0].relation, 'self');
  const list = await as(A, `select * from public.follow_list('${A}', 'followers')`);
  assert.deepEqual(list.map(r => r.nickname), ['cira', 'beka']);
  assert.equal((await as(B, `select * from public.follow_list('${B}', 'following')`))[0].nickname, 'ana');

  // reposts: shown on my profile, the author hears of it; not my own; one at a time or all at once
  assert.equal((await as(B, `select public.repost(${v1.id}) as r`))[0].r, true);
  await as(B, `select public.repost(${v3.id})`);
  await refused(A, `select public.repost(${v1.id})`, /own-post/);
  await refused(B, `select public.repost(${v2.id})`, /not-found/);   // friends-only: not B's to repost
  assert.equal((await db.query(`select * from public.notifications where user_id = '${A}' and kind = 'repost'`)).rows.length, 1);
  let rp = await as(C, `select * from public.feed_list('reposts', '${B}')`);
  assert.deepEqual(rp.map(r => r.id).sort(), [v1.id, v3.id].sort());
  assert.equal((await as(B, `select * from public.feed('one', 1, ${v1.id})`))[0].reposted, true);
  await as(B, `select public.repost(${v3.id}, false)`);
  assert.equal((await as(C, `select * from public.feed_list('reposts', '${B}')`)).length, 1);
  assert.equal((await as(B, `select public.reposts_clear() as n`))[0].n, 1);
  assert.equal((await as(C, `select * from public.feed_list('reposts', '${B}')`)).length, 0);

  // saved, liked, history: mine only, whatever target is asked
  await as(B, `select public.save_post(${v1.id})`);
  assert.equal((await as(B, `select * from public.feed_list('saved')`))[0].id, v1.id);
  assert.equal((await as(C, `select * from public.feed_list('saved', '${B}')`)).length, 0);
  assert.deepEqual((await as(B, `select * from public.feed_list('liked')`)).map(r => r.id).sort(), [old, v1.id].sort());
  await as(B, `select public.feed_seen(array[${v1.id}, ${old}])`);
  await as(B, `select public.feed_seen(array[${v1.id}])`);   // watched again: counted once, comes first in the history
  assert.equal((await one(`select views from public.feed_posts where id = ${v1.id}`)).views, 1);
  const hist = await as(B, `select * from public.feed_list('history')`);
  assert.equal(hist.length, 2);
  await as(B, `select public.history_clear(${old})`);
  assert.deepEqual((await as(B, `select * from public.feed_list('history')`)).map(r => r.id), [v1.id]);
  await as(B, `select public.history_clear()`);
  assert.equal((await as(B, `select * from public.feed_list('history')`)).length, 0);
  await as(B, `select public.feed_seen(array[${old}])`);   // watched after clearing: back in the history, not counted twice
  assert.deepEqual((await as(B, `select * from public.feed_list('history')`)).map(r => r.id), [old]);
  assert.equal((await one(`select views from public.feed_posts where id = ${old}`)).views, 1);

  // hashtags: a tag's page, and the tags that begin with what is typed
  assert.deepEqual((await as(B, `select * from public.feed_list('tag', null, '#პანდური')`)).map(r => r.id), [v1.id]);   // v2 is friends-only
  assert.deepEqual((await as(A, `select * from public.feed_list('tag', null, 'პანდური')`)).map(r => r.id).sort(), [v1.id, v2.id].sort());
  assert.equal((await as(B, `select * from public.feed_list('tag', null, 'PANDURI')`))[0].id, old);
  const tags = await as(B, `select * from public.tag_search('პან')`);
  assert.equal(tags[0].tag, 'პანდური'); assert.equal(tags[0].videos, 1);
  assert.ok((await as(B, `select * from public.tag_search('')`)).some(t => t.tag === 'fun'));
  assert.equal((await as(B, `select * from public.tag_search('a%')`)).length, 0);   // % is a letter here, not a wildcard

  // search: people by @nickname or name, videos by caption, song or author
  assert.equal((await as(B, `select * from public.search_users('@an')`))[0].nickname, 'ana');
  assert.equal((await as(B, `select * from public.search_users('ცირ')`))[0].nickname, 'cira');
  assert.equal((await as(B, `select * from public.search_users('ana')`))[0].followers, 2);
  assert.deepEqual((await as(B, `select * from public.feed_list('search', null, 'ხორუმ')`)).map(r => r.id), [v3.id]);
  assert.ok((await as(B, `select * from public.feed_list('search', null, 'ana')`)).length >= 2);
  assert.equal((await as(B, `select * from public.feed_list('search', null, '%')`)).length, 0);

  // following feed
  assert.deepEqual((await as(B, `select * from public.feed('following', 10)`)).map(r => r.id).sort(), [old, v1.id].sort());

  // a share out of the app: once per person; not counted for the author
  await as(B, `select public.share_out(${v1.id})`); await as(B, `select public.share_out(${v1.id})`); await as(A, `select public.share_out(${v1.id})`);
  assert.equal((await one(`select shares from public.feed_posts where id = ${v1.id}`)).shares, 1);

  // a deleted video takes its likes with it
  await as(A, `delete from public.feed_posts where id = ${v1.id}`);
  card = (await as(B, `select * from public.profile_card('${A}')`))[0];
  assert.equal(Number(card.likes), 1);

  // nobody writes the tables directly
  await refused(B, `insert into public.follows(follower, followee) values ('${B}', '${C}')`, /permission denied/);
  await refused(B, `insert into public.feed_reposts(user_id, post_id) values ('${B}', ${old})`, /permission denied/);
  await refused(B, `select * from public.feed_shares`, /permission denied/);
  await refused(B, `select public.community_note('${A}', 'x', '${B}', 'a', 'b', null, null)`, /permission denied/);
  // unfollow
  assert.equal((await as(B, `select public.follow('${A}', false) as f`))[0].f, false);
  assert.equal((await as(B, `select * from public.profile_card('${A}')`))[0].followers, 1);

  await db.exec(await mig('202611190001_sima_check.sql'));
  const music = await mig('202611240001_music_community.sql');
  await db.exec(music);
  await db.exec(music);
  await as(A, `select public.follow('${B}')`);
  assert.deepEqual((await as(A, `select * from public.music_connections('b')`)).map(r => r.nickname), ['beka']);
  assert.deepEqual((await as(A, `select * from public.music_connections('c')`)).map(r => r.nickname), ['cira']);
  assert.deepEqual(await as(A, `select * from public.music_connections('d')`), []);
  await db.exec(`insert into storage.objects(bucket_id, name, owner, metadata) values
   ('social','${A}/p/music.wav','${A}','{"mimetype":"audio/wav"}'),
   ('social','${A}/p/video.mp4','${A}','{"mimetype":"video/mp4"}'),
   ('social','${A}/p/friends.mp4','${A}','{"mimetype":"video/mp4"}');`);
  const media = (kind, file, dur, visibility = 'public', category = '{}') => `insert into public.feed_posts
     (kind, caption, media_path, media_meta, visibility) values
     ('${kind}', '@beka @beka @dato #ცოცხალი', '${A}/p/${file}', jsonb_build_object('dur', ${dur}) || '${category}'::jsonb, '${visibility}') returning id`;
  const [audio] = await as(A, media('audio', 'music.wav', 900, 'public', '{"genre":"jazz","form":"song","instrument":"vocals"}'));
  const [video] = await as(A, media('video', 'video.mp4', 600, 'public', '{"genre":"georgian-folk","region":"adjara","form":"melody"}'));
  const [privatePost] = await as(A, media('video', 'friends.mp4', 10, 'friends'));
  await refused(A, media('video', 'video.mp4', 601), /media-too-long/);
  await refused(A, media('audio', 'music.wav', 901), /media-too-long/);
  await refused(A, media('video', 'music.wav', 30), /media-type/);
  await refused(A, media('audio', 'missing.wav', 30), /media-type/);
  await refused(A, media('video', 'video.mp4', 30, 'public', '{"genre":"pop","region":"adjara"}'), /music-region/);
  assert.equal((await as(B, `select * from public.feed('one', 1, ${audio.id})`))[0].kind, 'audio');
  assert.deepEqual(await as(B, `select * from public.feed('one', 1, ${privatePost.id})`), []);
  assert.ok((await as(A, `select * from public.feed('foryou', 10)`)).some(post => post.id === audio.id));
  assert.deepEqual((await as(B, `select id from public.feed_list('discover', null, 'georgian-folk.adjara.melody')`)).map(r => r.id), [video.id]);
  assert.deepEqual((await as(B, `select id from public.feed_list('discover', null, 'jazz..song')`)).map(r => r.id), [audio.id]);
  assert.equal((await as(B, "select * from public.tag_search('ცოცხალი')"))[0].videos, 2);
  assert.ok((await one("select public.music_hashtags('#Jazz #ქართული #日本語') as t")).t.includes('日本語'));
  assert.ok((await as(B, `select * from public.feed('one', 1, ${old})`)).length, 'legacy video still visible');
  const mentions = (await db.query(`select user_id, go from public.notifications where kind = 'mention' order by id`)).rows;
  assert.deepEqual(mentions, [audio, video].map(post => ({ user_id: B, go: 'community:p:' + post.id })));

  const quality = await mig('202611240002_community_media_quality.sql');
  await db.exec(quality);
  await db.exec(quality);
  await refused(A, media('video', 'video.mp4', 20), /video-resolution/);
  await refused(A, media('video', 'video.mp4', 20, 'public', '{"w":1280,"h":719}'), /video-resolution/);
  await refused(A, media('video', 'video.mp4', 20, 'public', '{"w":1280,"h":"720"}'), /video-resolution/);
  await as(A, media('video', 'video.mp4', 20, 'public', '{"w":1280,"h":720}'));
  await as(A, media('video', 'video.mp4', 20, 'public', '{"w":720,"h":1280}'));
  await db.exec(`insert into storage.objects(bucket_id, name, owner, metadata) values
   ('social','${A}/p/master.flac','${A}','{"mimetype":"audio/flac"}'),
   ('social','${A}/p/lossy.wav','${A}','{"mimetype":"audio/mpeg"}'),
   ('social','${A}/p/wrong.mp3','${A}','{"mimetype":"audio/wav"}');`);
  await as(A, media('audio', 'music.wav', 20));
  await as(A, media('audio', 'master.flac', 20));
  await refused(A, media('audio', 'lossy.wav', 20), /audio-format/);
  await refused(A, media('audio', 'wrong.mp3', 20), /audio-format/);
  assert.ok((await as(B, `select * from public.feed('one', 1, ${old})`)).length, 'older posts remain readable');

  // one profile with a moving picture: a GIF photo, a still or moving banner (only from my own folder)
  const banner = await mig('202611260001_profile_banner.sql');
  await db.exec(banner);
  await db.exec(banner);   // running it twice changes nothing
  const bucket = await one(`select file_size_limit, allowed_mime_types from storage.buckets where id = 'avatars'`);
  assert.equal(Number(bucket.file_size_limit), 10485760);
  for (const m of ['image/gif', 'video/mp4', 'video/webm', 'image/jpeg']) assert.ok(bucket.allowed_mime_types.includes(m), m);
  await as(A, `select public.set_avatar('https://x.supabase.co/storage/v1/object/public/avatars/${A}/a.gif')`);
  await refused(A, `select public.set_banner('https://x.supabase.co/storage/v1/object/public/avatars/${B}/b.mp4')`, /not-your-file/);
  await refused(A, `select public.set_banner('https://evil.example/b.gif')`, /not-your-file/);
  await refused(A, `select public.set_banner('https://x.supabase.co/storage/v1/object/public/avatars/${A}/' || repeat('b', 500))`, /not-your-file/);
  const bUrl = `https://x.supabase.co/storage/v1/object/public/avatars/${A}/banner-1.mp4`;
  assert.equal((await as(A, `select public.set_banner('${bUrl}') as u`))[0].u, bUrl);
  assert.equal((await as(A, `select * from public.profile_card()`))[0].banner_url, bUrl);
  assert.equal((await as(B, `select * from public.profile_card('${A}')`))[0].banner_url, bUrl);
  assert.equal((await as(B, `select * from public.profile_card('${A}')`))[0].avatar_url.endsWith('a.gif'), true);
  const seenByD = (await as(D, `select * from public.profile_card('${A}')`))[0];
  assert.equal(seenByD.blocked, true); assert.equal(seenByD.banner_url, null);
  await refused('', `select public.set_banner(null)`, /not-authenticated|permission denied/);
  assert.equal((await as(A, `select public.set_banner(null) as u`))[0].u, null);
  assert.equal((await as(A, `select * from public.profile_card()`))[0].banner_url, null);

});
