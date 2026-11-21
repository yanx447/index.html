import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

test('Studio migration isolates accounts, versions projects and retires deleted songs', async () => {
  const db = new PGlite();
  const a = '11111111-1111-1111-1111-111111111111';
  const b = '22222222-2222-2222-2222-222222222222';
  const file = `insert into storage.objects (bucket_id, name) values ('studio-projects', '${a}/song-1')`;
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key);
      insert into auth.users values ('${a}'), ('${b}');
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
      create schema storage;
      create table storage.buckets (id text, name text, public boolean, file_size_limit bigint);
      create table storage.objects (bucket_id text, name text, primary key (bucket_id, name));
      alter table storage.objects enable row level security;
      create function storage.foldername(text) returns text[] language sql immutable as
        $$ select (string_to_array($1,'/'))[1:cardinality(string_to_array($1,'/'))-1] $$;
      create function storage.filename(text) returns text language sql immutable as
        $$ select split_part($1, '/', -1) $$;
      grant usage on schema auth, storage to authenticated;
      grant select, insert, delete on storage.objects to authenticated;
    `);
    await db.exec(await readFile(new URL('supabase/migrations/202611210001_studio_projects.sql', import.meta.url), 'utf8'));
    async function as(user, sql, parameters) {
      await db.exec(`select set_config('test.uid', '${user}', false); set role authenticated;`);
      try { return (await db.query(sql, parameters)).rows; }
      finally { await db.exec('reset role;'); }
    }
    async function put(user, revision, data) {
      const [row] = await as(user, 'select public.studio_put_project($1,$2,$3,$4) as accepted', [
        'song', 'song-1', String(revision).padStart(15, '0') + '-test', data == null ? null : JSON.stringify(data)
      ]);
      return row.accepted;
    }
    await assert.rejects(as(a, file), /row-level security/);
    assert.equal(await put(a, 10, { audio: true, entry: { title: 'record' } }), true);
    await as(a, file);
    assert.equal((await as(a, 'select name from storage.objects')).length, 1);
    assert.deepEqual(await as(b, 'select * from storage.objects'), []);
    assert.deepEqual(await as(b, 'select * from public.studio_projects'), []);
    await assert.rejects(as(b, file), /row-level security/);
    assert.equal(await put(a, 5, { audio: true, entry: { title: 'old' } }), false);
    assert.equal(await put(a, 10, { audio: true, entry: { title: 'record' } }), true);
    assert.equal(await put(a, 5, null), true);
    assert.equal(await put(a, 20, { audio: true }), false);
    assert.equal(await put(a, 21, null), true);
    await as(a, 'delete from storage.objects');
    await assert.rejects(as(a, file), /row-level security/);
    assert.equal((await as(a, 'select payload, deleted from public.studio_projects'))[0].deleted, true);
    assert.equal(await put(b, 20, { audio: false }), true);
    assert.equal((await as(b, 'select payload, deleted from public.studio_projects'))[0].deleted, false);
  } finally {
    await db.close();
  }
});
