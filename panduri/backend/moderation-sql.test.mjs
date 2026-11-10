import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
// Pass PGLITE_MODULE only when running outside a package that already provides @electric-sql/pglite.
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');

const A = '11111111-1111-1111-1111-111111111111', B = '22222222-2222-2222-2222-222222222222', ADMIN = '33333333-3333-3333-3333-333333333333', CONV = '44444444-4444-4444-4444-444444444444';
const db = new PGlite();
/** runs one statement as a signed-in member, under row-level security */
async function as(user, sql) {
  await db.exec(`reset role; select set_config('test.uid', '${user}', false); set role authenticated;`);
  try { return (await db.query(sql)).rows; } finally { await db.exec('reset role'); }
}
const refused = (user, sql, pattern) => assert.rejects(as(user, sql), pattern);
const count = async (table, where = 'true') => (await db.query(`select count(*)::int as n from public.${table} where ${where}`)).rows[0].n;

test('community moderation: report, block, filter, ban, administrator queue', async () => {
  await db.exec(`create role anon; create role authenticated; create role service_role;
    create schema auth;
    create table auth.users(id uuid primary key, email text, phone text, raw_user_meta_data jsonb, email_confirmed_at timestamptz, phone_confirmed_at timestamptz, last_sign_in_at timestamptz, created_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
    grant usage on schema public, auth to authenticated;
    grant execute on function auth.uid() to authenticated;
    insert into auth.users(id) values ('${A}'), ('${B}'), ('${ADMIN}');`);
  await db.exec((await readFile(new URL('../source/supabase/schema.sql', import.meta.url), 'utf8')).replace(/create extension[^;]*;/gi, ''));   // gen_random_uuid is built in; the embedded server has no pgcrypto
  await db.exec(await readFile(new URL('supabase/migrations/202611080003_moderation.sql', import.meta.url), 'utf8'));
  await db.exec(`grant select, insert, update, delete on all tables in schema public to authenticated;
    insert into public.profiles(id, display_name, role) values ('${A}', 'A', 'user'), ('${B}', 'B', 'user'), ('${ADMIN}', 'Admin', 'admin') on conflict (id) do update set display_name = excluded.display_name, role = excluded.role;
    insert into public.conversations(id, a, b) values ('${CONV}', '${A}', '${B}');`);
  const send = (u, text) => as(u, `insert into public.messages(conversation_id, body) values ('${CONV}', '${text}') returning id`);

  // the filter: whole words only, in both alphabets
  const [{ id: msg }] = await send(B, 'გამარჯობა');
  await refused(B, `insert into public.messages(conversation_id, body) values ('${CONV}', 'what the FUCK')`, /objectionable-content/);
  await refused(B, `insert into public.messages(conversation_id, body) values ('${CONV}', 'ყლეო შენ')`, /objectionable-content/);
  await send(B, 'scunthorpe is a town');

  // a report takes its text and target from the server; only someone who can see the message can report it
  await as(A, `select public.report_content('message', '${msg}', 'abuse')`);
  await as(A, `select public.report_content('message', '${msg}', 'spam')`);   // a second report of the same thing is not a second row
  assert.equal(await count('reports'), 1);
  assert.equal((await db.query('select excerpt, target_user from public.reports')).rows[0].excerpt, 'გამარჯობა');
  await refused(ADMIN, `select public.report_content('message', '${msg}', 'abuse')`, /not-found/);
  await refused(B, `select public.report_content('message', '${msg}', 'abuse')`, /own-content/);
  await refused(A, `select public.report_content('message', '${msg}', 'bogus')`, /check constraint/);

  // a member cannot read the queue or act on it
  assert.equal((await as(A, 'select * from public.reports')).length, 0);
  await refused(A, 'select * from public.admin_open_reports()', /not-allowed/);
  await refused(A, `select public.admin_resolve_report(1, 'dismiss')`, /not-allowed/);

  // blocking: the blocked person cannot write or ring, and the blocker no longer sees them
  await as(A, `insert into public.blocks(blocked) values ('${B}')`);
  await refused(B, `insert into public.messages(conversation_id, body) values ('${CONV}', 'hello')`, /row-level security/);
  await refused(A, `insert into public.messages(conversation_id, body) values ('${CONV}', 'hello')`, /row-level security/);
  await refused(B, `insert into public.call_signals(conversation_id, kind) values ('${CONV}', 'ring')`, /row-level security/);
  assert.equal((await as(A, 'select * from public.messages')).length, 0);
  assert.equal((await as(B, 'select * from public.messages')).length, 2);
  assert.deepEqual((await as(A, 'select * from public.my_blocks()')).map(r => r.name), ['B']);
  assert.equal((await as(B, 'select * from public.blocks')).length, 0);
  await as(A, `delete from public.blocks where blocked = '${B}'`);
  assert.equal((await as(A, 'select * from public.messages')).length, 2);

  // the administrator: sees the queue, removes the content, bans the author
  const queue = await as(ADMIN, 'select * from public.admin_open_reports()');
  assert.equal(queue.length, 1); assert.equal(queue[0].target_name, 'B');
  await as(ADMIN, `select public.admin_resolve_report(${queue[0].id}, 'ban')`);
  assert.equal(await count('messages', `id = ${msg}`), 0);
  assert.equal((await as(ADMIN, 'select * from public.admin_open_reports()')).length, 0);
  await refused(B, `insert into public.posts(title) values ('hello')`, /row-level security/);
  await refused(B, `insert into public.messages(conversation_id, body) values ('${CONV}', 'hello')`, /row-level security/);
  await as(B, 'delete from public.community_bans');   // row-level security: nothing happens
  assert.equal(await count('community_bans'), 1);

  // deleting an account takes its blocks and reports with it
  await as(A, `insert into public.blocks(blocked) values ('${ADMIN}')`);
  await db.exec(`delete from auth.users where id = '${A}'`);
  assert.equal(await count('blocks'), 0);
  assert.equal(await count('reports', `reporter = '${A}'`), 0);
});
