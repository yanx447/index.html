import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
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

test('messenger privacy, groups, files, pins, clear and notifications', async () => {
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
  const migration=await readFile(new URL('supabase/migrations/202611180001_messenger.sql',import.meta.url),'utf8');
  await db.exec(migration); await db.exec(migration);
  await db.exec(await readFile(new URL('supabase/migrations/202611180002_chat_glass.sql', import.meta.url), 'utf8'));
  await db.exec(await readFile(new URL('supabase/migrations/202611180003_chat_replies_search.sql', import.meta.url), 'utf8'));
  const state=async u=>(await as(u,`select public.chat_state('${CONV}') s`))[0].s;
  const settings=(u,patch)=>as(u,`select public.chat_settings('${CONV}','${JSON.stringify(patch)}'::jsonb)`);
  const send=(u,body)=>as(u,`insert into public.messages(conversation_id,body) values('${CONV}','${body}') returning id`);
  assert.equal((await state(A)).preferences.theme,'graphite');
  const emojiContext={PD:{h(){},i18n:{add(){}},stickers:{STICKERS:[]}},t:k=>k};vm.createContext(emojiContext);vm.runInContext((await readFile(new URL('../source/src/chatkit.js',import.meta.url),'utf8')).replace('return { emojiGrid,','return { _emoji:EMOJI, emojiGrid,'),emojiContext);
  const allEmoji=emojiContext.PD.chatkit._emoji.map(r=>r[1]);assert.equal(allEmoji.length,3944);const unsupported=(await db.query('select value from jsonb_array_elements_text($1::jsonb) as x(value) where not public.chat_emoji_allowed(value)',[JSON.stringify(allEmoji)])).rows;assert.equal(unsupported.length,0,JSON.stringify(unsupported.slice(0,20)));
  for(const emoji of ['👍🏽','👩‍💻','🇬🇪','❤️','1️⃣'])assert.equal((await one("select public.chat_emoji_allowed('"+emoji+"') ok")).ok,true);
  for(const value of ['hello','<script>','a',' ','x'.repeat(33)])assert.equal((await one("select public.chat_emoji_allowed('"+value+"') ok")).ok,false);
  await as(A,`select public.chat_settings('${CONV}','{"theme":"aurora","font":"humanist","quick_reaction":"👍🏽"}')`);assert.equal((await state(A)).preferences.quick_reaction,'👍🏽');
  await refused(C,`select public.chat_state('${CONV}')`,/denied/);
  await refused(C,`select public.chat_settings('${CONV}','{}')`,/denied/);
  await refused(A,`update public.chat_preferences set shared_read=999`,/permission denied/);
  await refused(A,`select public.chat_settings('${CONV}','{"theme":"evil"}')`,/check constraint/);
  await settings(A,{theme:'ocean',font:'serif',quick_reaction:'clap'});
  assert.equal((await state(A)).preferences.theme,'ocean');assert.equal((await state(B)).preferences.theme,'graphite');
  await as(A,`select public.chat_typing('${CONV}',true)`);assert.deepEqual((await state(B)).typing,['ანა']);
  await settings(A,{typing_indicator:false});assert.deepEqual((await state(B)).typing,[]);
  await as(A,`select public.chat_typing('${CONV}',true)`);assert.deepEqual((await state(B)).typing,[]);
  await settings(A,{typing_indicator:true});await as(A,`select public.chat_typing('${CONV}',true)`);
  await db.exec(`update public.chat_preferences set typing_at=now()-interval '10 seconds'`);assert.deepEqual((await state(B)).typing,[]);
  const [{id:message}]=await send(A,'hello receipts');await as(B,`select public.chat_mark_read('${CONV}')`);assert.equal((await state(A)).read,message);
  const reply=await as(B,`insert into public.messages(conversation_id,body,reply_to) values('${CONV}','visible reply',${message}) returning reply_to`);
  assert.equal(reply[0].reply_to,message);
  assert.equal((await as(B,`select id from public.chat_search('${CONV}','RECEIPTS')`))[0].id,message);
  assert.deepEqual(await as(C,`select id from public.chat_search('${CONV}','receipts')`),[]);
  assert.deepEqual(await as(B,`select id from public.chat_search('${CONV}','%_')`),[]);
  await settings(B,{read_receipts:false});assert.equal((await state(A)).read,0);
  await settings(B,{read_receipts:true});await settings(A,{read_receipts:false});assert.equal((await state(A)).read,0);await settings(A,{read_receipts:true});
  const count=async()=>Number((await one(`select count(*) n from public.notifications where user_id='${B}' and kind='message'`)).n);
  await settings(B,{muted:true});const n=await count();await send(A,'silent');assert.equal(await count(),n);
  await settings(B,{muted:false,notifications:false});await send(A,'no notification');assert.equal(await count(),n);
  await settings(B,{notifications:true,restricted:true});await send(A,'restricted');assert.equal(await count(),n);
  await as(B,`select public.chat_typing('${CONV}',true)`);assert.deepEqual((await state(A)).typing,[]);assert.equal((await state(A)).read,0);
  await refused(A,`insert into public.call_signals(conversation_id,kind,payload) values('${CONV}','ring','{}')`,/row-level security/);
  await settings(B,{restricted:false});await send(A,'notify again');assert.equal(await count(),n+1);
  await as(A,`select public.chat_pin(${message},true)`);assert.deepEqual((await state(B)).pins,[message]);
  await refused(C,`select public.chat_pin(${message},true)`,/denied/);await as(B,`select public.chat_pin(${message},false)`);assert.deepEqual((await state(A)).pins,[]);
  await as(A,`insert into public.messages(conversation_id,sticker) values('${CONV}','doli-fire'),('${CONV}','headphones')`);
  await as(A,`insert into public.messages(conversation_id,media_kind,media_path,media_meta) values('${CONV}','file','${A}/c/guide.pdf','{"name":"guide.pdf"}')`);
  assert.equal((await as(B,`select public.can_read_media('${A}/c/guide.pdf') ok`))[0].ok,true);assert.equal((await as(C,`select public.can_read_media('${A}/c/guide.pdf') ok`))[0].ok,false);
  await as(A,`select public.chat_clear('${CONV}')`);assert.equal((await as(A,`select * from public.messages where conversation_id='${CONV}'`)).length,0);
  assert.ok((await as(B,`select * from public.messages where conversation_id='${CONV}'`)).length>0);assert.equal((await as(A,`select * from public.my_conversations()`)).length,0);
  assert.deepEqual(await as(A,`select id from public.chat_search('${CONV}','receipts')`),[]);
  await refused(A,`insert into public.messages(conversation_id,body,reply_to) values('${CONV}','hidden quote',${message})`,/message unavailable/);
  await send(B,'back again');assert.equal((await as(A,`select * from public.messages where conversation_id='${CONV}'`)).length,1);assert.equal((await as(A,`select * from public.my_conversations()`)).length,1);
  await db.exec(`insert into public.friendships(a,b,requester,status) values('${A}','${C}','${A}','accepted')`);
  const [{cid:group}]=await as(A,`select public.create_chat_group('Trio',array['${B}','${C}']::uuid[]) cid`);
  assert.notEqual(group,CONV);assert.equal((await as(A,`select public.open_conversation('${B}') cid`))[0].cid,CONV);
  await refused(A,`select public.create_chat_group('bad',array['${B}','${OWNER}']::uuid[])`,/not-friends/);
  const [{id:gm}]=await as(C,`insert into public.messages(conversation_id,body,media_path,media_kind) values('${group}','group hello','${C}/c/group.webm','audio') returning id`);
  await refused(B,`insert into public.messages(conversation_id,body,reply_to) values('${CONV}','wrong conversation',${gm})`,/message unavailable/);
  assert.equal((await as(B,`select * from public.messages where conversation_id='${group}'`)).length,1);assert.equal((await as(OWNER,`select * from public.messages where conversation_id='${group}'`)).length,0);
  await refused(OWNER,`insert into public.messages(conversation_id,body) values('${group}','intrude')`,/row-level security/);
  await as(B,`select public.react_message(${gm},'heart')`);await as(C,`select public.chat_pin(${gm},true)`);assert.deepEqual((await as(B,`select public.chat_state('${group}') s`))[0].s.pins,[gm]);
  assert.equal((await as(B,`select public.can_read_media('${C}/c/group.webm') ok`))[0].ok,true);assert.equal((await as(OWNER,`select public.can_read_media('${C}/c/group.webm') ok`))[0].ok,false);
  assert.ok((await as(C,`select * from public.my_conversations()`)).some(x=>x.other_name==='Trio'));
  await refused(C,`insert into public.call_signals(conversation_id,kind,payload) values('${group}','ring','{}')`,/row-level security/);
  await as(B,`select public.report_content('message','${gm}','spam')`);
  const [{id:fromA}]=await as(A,`insert into public.messages(conversation_id,body) values('${group}','group report test') returning id`);
  await as(C,`select public.report_content('message','${fromA}','spam')`);
  await refused(OWNER,`select public.report_content('message','${fromA}','spam')`,/not-found/);
  assert.equal((await as(C,`select public.chat_state('${group}') s`))[0].s.members.length,3);
  await db.exec('set role anon');await assert.rejects(db.query(`select public.chat_state('${CONV}')`),/permission denied/);await db.exec('reset role');await db.close();
});
