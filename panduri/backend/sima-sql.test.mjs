import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');

// The live server's state (social + community profiles), then Sima's check on top.
const A = '11111111-1111-1111-1111-111111111111', B = '22222222-2222-2222-2222-222222222222';
const db = new PGlite();
async function as(user, sql) {
  await db.exec(`reset role; select set_config('test.uid', '${user}', false); set role authenticated;`);
  try { return (await db.query(sql)).rows; } finally { await db.exec(`reset role; select set_config('test.uid', '', false);`); }
}
const refused = (user, sql, pattern) => assert.rejects(as(user, sql), pattern);
const mig = name => readFile(new URL('supabase/migrations/' + name, import.meta.url), 'utf8');

test('a feed post needs Sima\'s check: videos and music only, each with a passed stamp', async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users(id uuid primary key, email text, phone text, raw_user_meta_data jsonb, email_confirmed_at timestamptz, phone_confirmed_at timestamptz, last_sign_in_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    grant usage on schema public, auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    insert into auth.users(id, email, email_confirmed_at) values ('${A}', 'a@x', now()), ('${B}', 'b@x', now());`);
  await db.exec(`create schema storage;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, created_at timestamptz default now());
    alter table storage.objects enable row level security;
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
    grant usage on schema storage to authenticated; grant select, insert, delete on storage.objects to authenticated; grant execute on function storage.foldername(text) to authenticated;`);
  await db.exec((await readFile(new URL('../source/supabase/schema.sql', import.meta.url), 'utf8')).replace(/create extension[^;]*;/gi, ''));
  await db.exec(await mig('202611080003_moderation.sql'));
  await db.exec(`insert into public.profiles(id, display_name, role) values ('${A}', 'ანა', 'user'), ('${B}', 'ბექა', 'user') on conflict (id) do update set display_name = excluded.display_name;`);
  await db.exec(await mig('202611090002_social.sql'));
  await db.exec(await mig('202611160001_community_profiles.sql'));

  // published before the check: it stays
  const [{ id: old }] = await as(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'ძველი', '${A}/p/o.mp4', '{"dur": 30}') returning id`);
  const sima = await mig('202611190001_sima_check.sql');
  await db.exec(sima);
  await db.exec(sima);   // running it twice changes nothing
  assert.equal((await db.query(`select count(*)::int as n from public.feed_posts where id = ${old}`)).rows[0].n, 1);

  const post = (u, kind, meta, path = `'${u}/p/${Math.random().toString(36).slice(2)}.mp4'`) =>
    as(u, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('${kind}', 'ვუკრავ', ${path}, '${JSON.stringify(meta)}') returning id`);
  // no stamp, a failed one, a malformed one: refused
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/a.mp4', '{"dur": 20}')`, /sima-check/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/a.mp4', '{"dur": 20, "sima": {"v": 1, "ok": false}}')`, /sima-check/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/a.mp4', '{"dur": 20, "sima": {"v": 1, "ok": "yes"}}')`, /sima-check/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/a.mp4', '{"dur": 20, "sima": true}')`, /sima-check/);
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${A}/p/a.mp4', '{"dur": 20, "sima": {"ok": true}}')`, /sima-check/);
  // photos and text are not the feed's
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('photo', 'x', '${A}/p/a.jpg', '{"sima": {"v": 1, "ok": true}}')`, /video-only/);
  await refused(A, `insert into public.feed_posts(kind, caption) values ('text', 'გამარჯობა')`, /video-only/);
  // a clip that passed: posted, video or music
  const [v] = await post(A, 'video', { dur: 42, w: 1080, h: 1920, sima: { v: 1, ok: true, notes: .62, range: .9 } });
  assert.ok(v.id);
  const [m] = await post(B, 'audio', { dur: 90, sima: { v: 1, ok: true } }, `'${B}/p/s.m4a'`);
  assert.ok(m.id);
  // the other guards still run (someone else's file)
  await refused(A, `insert into public.feed_posts(kind, caption, media_path, media_meta) values ('video', 'x', '${B}/p/b.mp4', '{"sima": {"v": 1, "ok": true}}')`, /not-your-file/);
  // nobody calls the trigger function directly
  await refused(A, `select public.feed_post_sima()`, /permission denied|trigger functions can only be called as triggers/);
});
