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


test('the video feed: a video of at most a minute with its song, saving, and the saved list', async () => {
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
  await db.exec(await readFile(new URL('supabase/migrations/202611090002_social.sql', import.meta.url), 'utf8'));
  const reels = await readFile(new URL('supabase/migrations/202611100001_reels.sql', import.meta.url), 'utf8');
  // a photo posted before the feed became a video feed
  const [{ id: oldPhoto }] = await as(A, `insert into public.feed_posts(kind, caption, media_path) values ('photo', 'ძველი ფოტო', '${A}/p/old.jpg') returning id`);
  await db.exec(reels);
  await db.exec(reels);   // running it twice changes nothing
  for (const [u, n] of [[A, 'ana'], [B, 'beka'], [C, 'cira']]) await as(u, `select public.set_nickname('${n}')`);

  // a post is a video of at most a minute, and can name its song
  const post = (u, extra = '', vals = '') => as(u, `insert into public.feed_posts(kind, caption, media_path, thumb_path, media_meta${extra}) values ('video', 'ვიდეო', '${u}/p/v.mp4', '${u}/p/v.jpg', '{"dur": 42.5, "w": 2160, "h": 3840}'${vals}) returning id, song`);
  const [v1] = await post(A, ', song', `, '  მთიულური  '`);
  assert.equal(v1.song, 'მთიულური');
  const [v2] = await post(A, ', visibility', `, 'friends'`);
  assert.equal(v2.song, '');
  const [v3] = await post(C);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path) values ('photo', 'x', '${A}/p/x.jpg')`, /video-only/);
  await refused(A, `insert into public.feed_posts(kind, caption) values ('text', 'x')`, /video-only/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/l.mp4', '{"dur": 75}')`, /video-too-long/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/l.mp4', '{}')`, /video-too-long/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/l.mp4', '{"dur": "abc"}')`, /video-too-long/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta, song) values ('video', 'x', '${A}/p/l.mp4', '{"dur": 5}', 'fuck')`, /objectionable-content/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta, song) values ('video', 'x', '${A}/p/l.mp4', '{"dur": 5}', '${'ა'.repeat(81)}')`, /feed_posts_song_len/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${B}/p/l.mp4', '{"dur": 5}')`, /not-your-file/);

  // the feed shows videos only, with the song and whether I saved it
  const ids = rows => rows.map(r => Number(r.id));
  let rows = await as(B, `select * from public.feed('foryou')`);
  assert.deepEqual(ids(rows).sort(), [Number(v1.id), Number(v3.id)].sort());
  assert.equal(rows.find(r => Number(r.id) === Number(v1.id)).song, 'მთიულური');
  assert.ok(rows.every(r => r.saved === false && r.kind === 'video'));
  assert.deepEqual(ids(await as(B, `select * from public.feed('friends')`)), [Number(v2.id), Number(v1.id)]);   // A is B's friend: the old photo is not shown
  assert.deepEqual(ids(await as(A, `select * from public.feed('user', 30, null, '${A}')`)), [Number(v2.id), Number(v1.id)]);
  assert.deepEqual(ids(await as(A, `select * from public.feed('one', 1, ${oldPhoto})`)), []);
  assert.equal((await one(`select count(*)::int n from public.feed_posts where id = ${oldPhoto}`)).n, 1);   // …but nothing was deleted

  // saving: only what I may see, only for me, and only through the function
  assert.equal((await as(B, `select public.save_post(${v1.id}) v`))[0].v, true);
  assert.equal((await as(B, `select public.save_post(${v1.id}) v`))[0].v, true);   // twice is once
  assert.equal((await as(B, `select public.save_post(${v3.id}, true) v`))[0].v, true);
  await refused(C, `select public.save_post(${v2.id})`, /not-found/);   // friends-only, and C is not A's friend
  await refused(C, `select public.save_post(999999)`, /not-found/);
  await refused(B, `insert into public.feed_saves(user_id, post_id) values ('${B}', ${v2.id})`, /permission denied|row-level security/);
  await refused(B, `delete from public.feed_saves`, /permission denied/);
  assert.equal((await as(C, `select count(*)::int n from public.feed_saves`))[0].n, 0);   // nobody reads another member's saved list
  assert.equal((await as(B, `select count(*)::int n from public.feed_saves`))[0].n, 2);
  rows = await as(B, `select * from public.feed('saved')`);
  assert.deepEqual(ids(rows), [Number(v3.id), Number(v1.id)]);   // the last saved first
  assert.ok(rows.every(r => r.saved === true));
  assert.deepEqual(ids(await as(B, `select * from public.feed('saved', 10, null, null, array[${v3.id}]::bigint[])`)), [Number(v1.id)]);
  assert.equal((await as(B, `select saved from public.feed('foryou') where id = ${v1.id}`))[0].saved, true);
  assert.deepEqual(ids(await as(C, `select * from public.feed('saved')`)), []);

  // a block hides a saved video; taking the save back; a deleted video leaves no save behind
  await as(C, `insert into public.blocks(blocked) values ('${B}')`);
  assert.deepEqual(ids(await as(B, `select * from public.feed('saved')`)), [Number(v1.id)]);
  await as(C, `delete from public.blocks where blocked = '${B}'`);
  assert.equal((await as(B, `select public.save_post(${v3.id}, false) v`))[0].v, false);
  assert.deepEqual(ids(await as(B, `select * from public.feed('saved')`)), [Number(v1.id)]);
  await as(A, `delete from public.feed_posts where id = ${v1.id}`);
  assert.equal((await one(`select count(*)::int n from public.feed_saves`)).n, 0);

  // nobody who is not signed in
  await db.exec(`set role anon`);
  await assert.rejects(db.query(`select * from public.feed('foryou')`), /permission denied/);
  await assert.rejects(db.query(`select public.save_post(1)`), /permission denied/);
  await assert.rejects(db.query(`select * from public.feed_saves`), /permission denied/);
  await db.exec(`reset role`);
});
