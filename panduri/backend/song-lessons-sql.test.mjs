import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const OWNER = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';

test('song lessons: only the owner writes, everyone reads what was published, drafts stay private', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
      create function public.is_owner() returns boolean language sql stable security definer as
        $$ select auth.uid() = '${OWNER}'::uuid $$;
      revoke all on function public.is_owner() from public, anon;
      grant execute on function public.is_owner() to authenticated;
      grant usage on schema public, auth to anon, authenticated;
      create schema storage;
      create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint);
      create table storage.objects (bucket_id text, name text, primary key (bucket_id, name));
      alter table storage.objects enable row level security;
      grant usage on schema storage to authenticated;
      grant select, insert, update, delete on storage.objects to authenticated;
    `);
    const sql = await readFile(new URL('supabase/migrations/202611250001_song_lessons.sql', import.meta.url), 'utf8');
    await db.exec(sql);
    await db.exec(sql);   // can be run twice
    async function as(role, user, q, params) {
      await db.exec(`select set_config('test.uid', '${user || ''}', false); set role ${role};`);
      try { return (await db.query(q, params)).rows; } finally { await db.exec('reset role;'); }
    }
    const owner = (q, p) => as('authenticated', OWNER, q, p), other = (q, p) => as('authenticated', OTHER, q, p), anon = (q, p) => as('anon', null, q, p);
    const draft = { schema: 'panduri-song', id: 'sb-suliko', chords: [{ t: 0, chord: 'G' }] };

    // nobody but the owner can save, publish, verify or attach audio — not even with a direct request
    await assert.rejects(other('select public.song_lesson_save($1,$2)', ['sb-suliko', draft]), /not-allowed/);
    await assert.rejects(anon('select public.song_lesson_save($1,$2)', ['sb-suliko', draft]), /permission denied/);
    await assert.rejects(other('insert into public.song_lessons (id, published) values ($1, $2)', ['sb-x', draft]), /permission denied/);
    await assert.rejects(other('select public.song_lesson_set_audio($1,$2)', ['sb-suliko', 'sb-suliko/a.mp3']), /not-allowed/);

    const r1 = (await owner('select public.song_lesson_save($1,$2,$3) as r', ['sb-suliko', draft, 'needs-review']))[0].r;
    assert.equal(r1, 1);
    // a draft is the owner's: learners see nothing until it is published
    assert.deepEqual(await anon('select * from public.song_lessons'), []);
    assert.deepEqual(await other('select * from public.song_lessons'), []);
    assert.deepEqual(await other('select * from public.song_lesson_drafts'), []);
    assert.equal((await owner('select status from public.song_lesson_drafts'))[0].status, 'needs-review');

    // a stale editor cannot overwrite a newer draft
    const edit = { ...draft, chords: [{ t: 0, chord: 'Em' }] };
    assert.equal((await owner('select public.song_lesson_save($1,$2,null,$3,$4) as r', ['sb-suliko', edit, 'E→Em', 1]))[0].r, 2);
    await assert.rejects(owner('select public.song_lesson_save($1,$2,null,null,$3)', ['sb-suliko', draft, 1]), /conflict/);

    // publish → everyone reads the published copy, not yet verified
    await owner('select public.song_lesson_publish($1,$2)', ['sb-suliko', 'first']);
    const pub = await anon('select id, published, verified from public.song_lessons');
    assert.equal(pub.length, 1); assert.equal(pub[0].published.chords[0].chord, 'Em'); assert.equal(pub[0].verified, false);
    assert.equal((await other('select published_rev from public.song_lessons'))[0].published_rev, 2);

    // verify marks the published copy only when it is the same revision
    await owner('select public.song_lesson_verify($1,true)', ['sb-suliko']);
    assert.equal((await anon('select verified from public.song_lessons'))[0].verified, true);
    await owner('select public.song_lesson_save($1,$2)', ['sb-suliko', { ...edit, bpm: 90 }]);
    await owner('select public.song_lesson_publish($1)', ['sb-suliko']);
    assert.equal((await anon('select verified from public.song_lessons'))[0].verified, false);   // a new revision is not the verified one

    // history and restore
    const vs = await owner('select id, rev, kind from public.song_lesson_versions order by id');
    assert.deepEqual(vs.map(v => v.kind), ['draft', 'draft', 'publish', 'verify', 'draft', 'publish']);
    assert.deepEqual(await other('select * from public.song_lesson_versions'), []);
    await assert.rejects(other('select public.song_lesson_restore($1,$2)', ['sb-suliko', vs[0].id]), /not-allowed/);
    const r5 = (await owner('select public.song_lesson_restore($1,$2) as r', ['sb-suliko', vs[0].id]))[0].r;
    assert.equal(r5, 4);
    assert.equal((await owner('select draft from public.song_lesson_drafts'))[0].draft.chords[0].chord, 'G');
    // what learners have does not change until it is published
    assert.equal((await anon('select published from public.song_lessons'))[0].published.chords[0].chord, 'Em');
    await owner('select public.song_lesson_revert($1)', ['sb-suliko']);
    assert.equal((await owner('select draft from public.song_lesson_drafts'))[0].draft.bpm, 90);

    // audio: only the owner uploads, the path belongs to the lesson
    await assert.rejects(other(`insert into storage.objects values ('lesson-audio', 'sb-suliko/a.mp3')`), /row-level security/);
    await owner(`insert into storage.objects values ('lesson-audio', 'sb-suliko/a.mp3')`);
    await assert.rejects(owner('select public.song_lesson_set_audio($1,$2)', ['sb-suliko', 'other-song/a.mp3']), /bad-path/);
    await owner('select public.song_lesson_set_audio($1,$2)', ['sb-suliko', 'sb-suliko/a.mp3']);
    assert.equal((await anon('select audio_path from public.song_lessons'))[0].audio_path, 'sb-suliko/a.mp3');
    assert.equal((await db.query(`select public from storage.buckets where id = 'lesson-audio'`)).rows[0].public, true);

    // statuses: bad values are refused
    await assert.rejects(owner('select public.song_lesson_set_status($1,$2)', ['sb-suliko', 'whatever']), /check/);
    await owner('select public.song_lesson_set_status($1,$2)', ['ml-new', 'analyzing']);
    assert.equal((await owner(`select status from public.song_lesson_drafts where id = 'ml-new'`))[0].status, 'analyzing');
    await assert.rejects(owner('select public.song_lesson_save($1,$2)', ['Bad Id!', draft]), /check/);
  } finally {
    await db.close();
  }
});
