import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';

const OWNER = '11111111-1111-1111-1111-111111111111';
const OTHER = '22222222-2222-2222-2222-222222222222';
// an account the email check would let through (as if it held the owner's address) but that is not the owner's user id
const IMPOSTOR = '33333333-3333-3333-3333-333333333333';
const REAL_OWNER = 'e6556e81-5688-4559-afd4-37d948b36adb';

test('song lessons: only the owner writes, everyone reads what was published, drafts stay private', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
      create function public.is_owner() returns boolean language sql stable security definer as
        $$ select auth.uid() in ('${OWNER}'::uuid, '${IMPOSTOR}'::uuid) $$;
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
    const file = await readFile(new URL('supabase/migrations/202611250001_song_lessons.sql', import.meta.url), 'utf8');
    assert.ok(file.includes(REAL_OWNER), 'the migration names the owner by user id');
    const sql = file.replaceAll(REAL_OWNER, OWNER);
    await db.exec(sql);
    await db.exec(sql);   // can be run twice
    async function as(role, user, q, params) {
      await db.exec(`select set_config('test.uid', '${user || ''}', false); set role ${role};`);
      try { return (await db.query(q, params)).rows; } finally { await db.exec('reset role;'); }
    }
    const owner = (q, p) => as('authenticated', OWNER, q, p), impostor = (q, p) => as('authenticated', IMPOSTOR, q, p), other = (q, p) => as('authenticated', OTHER, q, p), anon = (q, p) => as('anon', null, q, p);
    const draft = { schema: 'panduri-song', id: 'sb-suliko', chords: [{ t: 0, chord: 'G' }] };

    // nobody but the owner can save, publish, verify or attach audio — not even with a direct request
    await assert.rejects(other('select public.song_lesson_save($1,$2)', ['sb-suliko', draft]), /not-allowed/);
    await assert.rejects(anon('select public.song_lesson_save($1,$2)', ['sb-suliko', draft]), /permission denied/);
    await assert.rejects(impostor('select public.song_lesson_save($1,$2)', ['sb-suliko', draft]), /not-allowed/);
    assert.equal((await impostor('select public.lesson_owner() as o'))[0].o, false);
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
    assert.deepEqual(await impostor('select * from public.song_lesson_versions'), []);
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

    // ---------- PANDURI Creator ----------
    const proj = { schema: 'panduri-song', v: 2, id: 'cr-test1', title: { ka: 'ახალი', en: 'New' }, creator: { type: 'melody', categories: ['melodies', 'solos'] },
      beats: [0, .5, 1], notes: [[0, .5, 69, 3, 0, 0]], assets: [{ id: 'a1', role: 'mix', path: 'cr-test1/a1.wav' }], analysis: { chords: [] }, review: [{ from: 0, to: 1, what: 'chords' }], edited: { notes: true } };
    await assert.rejects(other('select public.creator_create($1,$2)', ['cr-test1', proj]), /not-allowed/);
    await assert.rejects(impostor('select public.creator_create($1,$2)', ['cr-test1', proj]), /not-allowed/);
    await assert.rejects(anon('select public.creator_create($1,$2)', ['cr-test1', proj]), /permission denied/);
    await assert.rejects(owner('select public.creator_create($1,$2)', ['sb-suliko', proj]), /bad-id/);
    assert.equal((await owner('select public.creator_create($1,$2) as r', ['cr-test1', proj]))[0].r, 1);
    await assert.rejects(owner('select public.creator_create($1,$2)', ['cr-test1', proj]), /exists/);
    const pr = (await owner(`select creator, title, kind, status from public.song_lesson_drafts where id = 'cr-test1'`))[0];
    assert.deepEqual(pr, { creator: true, title: 'ახალი', kind: 'melody', status: 'not-analyzed' });
    assert.deepEqual(await other(`select * from public.song_lesson_drafts where id = 'cr-test1'`), []);
    // autosave: no version row; a stale device is refused
    const nv = async () => (await owner(`select count(*)::int as n from public.song_lesson_versions where lesson_id = 'cr-test1'`))[0].n;
    const v0 = await nv();
    assert.equal((await owner('select public.song_lesson_autosave($1,$2,$3) as r', ['cr-test1', { ...proj, bpm: 100 }, 1]))[0].r, 2);
    assert.equal(await nv(), v0);
    await assert.rejects(owner('select public.song_lesson_autosave($1,$2,$3)', ['cr-test1', proj, 1]), /conflict/);
    await assert.rejects(other('select public.song_lesson_autosave($1,$2,$3)', ['cr-test1', proj, 2]), /not-allowed/);
    // publish into two sections: learners get the lesson without the owner's files, the analysis and the review notes
    await assert.rejects(owner('select public.song_lesson_publish($1,null,$2)', ['cr-test1', ['songs', 'secret']]), /bad-category/);
    await owner('select public.song_lesson_publish($1)', ['cr-test1']);
    const cp = (await anon(`select published, categories, kind from public.song_lessons where id = 'cr-test1'`))[0];
    assert.deepEqual(cp.categories, ['melodies', 'solos']); assert.equal(cp.kind, 'melody');
    assert.equal(cp.published.bpm, 100); assert.equal(cp.published.notes.length, 1);
    for (const k of ['assets', 'analysis', 'review', 'edited']) assert.equal(cp.published[k], undefined, k + ' is not published');
    await assert.rejects(owner('select public.song_lesson_delete($1)', ['cr-test1']), /published/);
    await assert.rejects(other('select public.song_lesson_unpublish($1)', ['cr-test1']), /not-allowed/);
    await owner('select public.song_lesson_unpublish($1)', ['cr-test1']);
    assert.deepEqual(await anon(`select * from public.song_lessons where id = 'cr-test1'`), []);
    // the private bucket: only the owner lists, reads and writes it
    await assert.rejects(other(`insert into storage.objects values ('creator-audio', 'cr-test1/a1.wav')`), /row-level security/);
    await assert.rejects(impostor(`insert into storage.objects values ('creator-audio', 'cr-test1/x.wav')`), /row-level security/);
    await owner(`insert into storage.objects values ('creator-audio', 'cr-test1/a1.wav')`);
    assert.deepEqual(await other(`select * from storage.objects where bucket_id = 'creator-audio'`), []);
    assert.equal((await owner(`select count(*)::int as n from storage.objects where bucket_id = 'creator-audio'`))[0].n, 1);
    assert.equal((await db.query(`select public from storage.buckets where id = 'creator-audio'`)).rows[0].public, false);
    await assert.rejects(other('select public.song_lesson_delete($1)', ['cr-test1']), /not-allowed/);
    await owner('select public.song_lesson_delete($1)', ['cr-test1']);
    assert.deepEqual(await owner(`select * from public.song_lesson_drafts where id = 'cr-test1'`), []);
    assert.equal(await nv(), 0);
  } finally {
    await db.close();
  }
});
