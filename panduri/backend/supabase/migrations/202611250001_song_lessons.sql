-- Song lessons edited by the owner (Admin Lesson Editor) and the owner's PANDURI Creator projects.
-- Everyone reads what was published; only the owner (public.lesson_owner(), the server's own check) can read a draft,
-- the review status or the version history, and only through the functions below can anything be written —
-- no table grants insert, update or delete to anyone, so a direct API request cannot change a lesson.
-- Needs public.is_owner() (schema.sql). Additive; can be run twice.
-- The owner is checked twice on the server: is_owner() (the confirmed owner email) AND the owner's own user id —
-- an account that only claims the email, or another account, is refused either way.

create or replace function public.lesson_owner() returns boolean language sql stable security definer set search_path = public, auth as $$
  select coalesce(auth.uid() = 'e6556e81-5688-4559-afd4-37d948b36adb'::uuid, false) and public.is_owner();
$$;
revoke all on function public.lesson_owner() from public, anon;
grant execute on function public.lesson_owner() to authenticated;

create table if not exists public.song_lessons (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{1,63}$'),
  published jsonb,                      -- what every learner gets; null until the first publish
  published_rev integer not null default 0,
  published_at timestamptz,
  verified boolean not null default false,   -- the published copy is the one the owner verified
  audio_path text check (audio_path is null or audio_path ~ '^[a-z0-9][a-z0-9-]{1,63}/[A-Za-z0-9._-]{1,80}$'),
  updated_at timestamptz not null default now()
);

create table if not exists public.song_lesson_drafts (
  id text primary key references public.song_lessons(id) on delete cascade,
  draft jsonb not null,
  status text not null default 'analysis-completed' check (status in
    ('not-analyzed', 'analyzing', 'analysis-completed', 'needs-review', 'manually-edited', 'teacher-verified', 'published')),
  rev integer not null default 1,
  verified_rev integer,                 -- the draft revision the owner verified (null: not verified)
  updated_at timestamptz not null default now()
);

create table if not exists public.song_lesson_versions (
  id bigint generated always as identity primary key,
  lesson_id text not null references public.song_lessons(id) on delete cascade,
  rev integer not null,
  kind text not null check (kind in ('draft', 'publish', 'verify', 'unverify', 'restore', 'unpublish', 'create')),
  data jsonb not null,
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists song_lesson_versions_lesson on public.song_lesson_versions (lesson_id, id desc);

alter table public.song_lessons enable row level security;
alter table public.song_lesson_drafts enable row level security;
alter table public.song_lesson_versions enable row level security;

revoke all on public.song_lessons, public.song_lesson_drafts, public.song_lesson_versions from public, anon, authenticated;
grant select on public.song_lessons to anon, authenticated;
grant select on public.song_lesson_drafts, public.song_lesson_versions to authenticated;

-- anon may not call is_owner(): its policy names only the published rows
drop policy if exists song_lessons_read_anon on public.song_lessons;
create policy song_lessons_read_anon on public.song_lessons for select to anon using (published is not null);
drop policy if exists song_lessons_read on public.song_lessons;
create policy song_lessons_read on public.song_lessons for select to authenticated using (published is not null or public.lesson_owner());
drop policy if exists song_lesson_drafts_owner on public.song_lesson_drafts;
create policy song_lesson_drafts_owner on public.song_lesson_drafts for select to authenticated using (public.lesson_owner());
drop policy if exists song_lesson_versions_owner on public.song_lesson_versions;
create policy song_lesson_versions_owner on public.song_lesson_versions for select to authenticated using (public.lesson_owner());

-- ---------- writes: the owner only, checked here on every call ----------


create or replace function public.song_lesson_verify(p_id text, p_on boolean default true)
returns boolean language plpgsql security definer set search_path = public as $$
declare d song_lesson_drafts;
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  select * into d from song_lesson_drafts where id = p_id for update;
  if d.id is null then raise exception 'no-draft'; end if;
  update song_lesson_drafts set verified_rev = case when p_on then d.rev end,
    status = case when p_on then 'teacher-verified' when d.status = 'teacher-verified' then 'manually-edited' else d.status end, updated_at = now() where id = p_id;
  -- the published copy is verified only when it is the very revision that was checked
  update song_lessons set verified = (p_on and published_rev = d.rev), updated_at = now() where id = p_id;
  insert into song_lesson_versions (lesson_id, rev, kind, data) values (p_id, d.rev, case when p_on then 'verify' else 'unverify' end, d.draft);
  return p_on;
end $$;

create or replace function public.song_lesson_restore(p_id text, p_version bigint)
returns integer language plpgsql security definer set search_path = public as $$
declare v song_lesson_versions; nxt integer;
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  select * into v from song_lesson_versions where id = p_version and lesson_id = p_id;
  if v.id is null then raise exception 'no-version'; end if;
  select coalesce(max(rev), 0) + 1 into nxt from song_lesson_drafts where id = p_id;
  insert into song_lesson_drafts (id, draft, status, rev) values (p_id, v.data, 'manually-edited', nxt)
    on conflict (id) do update set draft = excluded.draft, status = 'manually-edited', rev = excluded.rev, updated_at = now();
  insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, nxt, 'restore', v.data, 'version ' || p_version);
  return nxt;
end $$;

-- Revert: the draft goes back to what learners have now
create or replace function public.song_lesson_revert(p_id text)
returns integer language plpgsql security definer set search_path = public as $$
declare pub jsonb; prev integer; nxt integer;
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  select published, published_rev into pub, prev from song_lessons where id = p_id;
  if pub is null then raise exception 'not-published'; end if;
  select coalesce(max(rev), 0) + 1 into nxt from song_lesson_drafts where id = p_id;
  update song_lesson_drafts set draft = pub, status = 'published', rev = nxt, updated_at = now() where id = p_id;
  insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, nxt, 'restore', pub, 'published ' || prev);
  return nxt;
end $$;

create or replace function public.song_lesson_set_status(p_id text, p_status text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  insert into song_lessons (id) values (p_id) on conflict (id) do nothing;
  update song_lesson_drafts set status = p_status, updated_at = now() where id = p_id;
  if not found then insert into song_lesson_drafts (id, draft, status, rev) values (p_id, '{}'::jsonb, p_status, 0); end if;
end $$;

-- the recording a lesson plays: an object the owner uploaded to the lesson-audio bucket (or null to take it away)
create or replace function public.song_lesson_set_audio(p_id text, p_path text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if p_path is not null and split_part(p_path, '/', 1) <> p_id then raise exception 'bad-path'; end if;
  insert into song_lessons (id) values (p_id) on conflict (id) do nothing;
  update song_lessons set audio_path = p_path, updated_at = now() where id = p_id;
end $$;

revoke all on function public.song_lesson_verify(text, boolean), public.song_lesson_restore(text, bigint), public.song_lesson_revert(text),
  public.song_lesson_set_status(text, text), public.song_lesson_set_audio(text, text) from public, anon;
grant execute on function public.song_lesson_verify(text, boolean), public.song_lesson_restore(text, bigint), public.song_lesson_revert(text),
  public.song_lesson_set_status(text, text), public.song_lesson_set_audio(text, text) to authenticated;

-- ---------- the recordings: a public bucket (a published lesson plays for everyone); only the owner writes ----------
do $$ begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit) values ('lesson-audio', 'lesson-audio', true, 52428800)
      on conflict (id) do update set public = true, file_size_limit = 52428800;
  end if;
end $$;
do $$ begin
  if to_regclass('storage.objects') is not null then
    execute 'drop policy if exists lesson_audio_owner_insert on storage.objects';
    execute 'create policy lesson_audio_owner_insert on storage.objects for insert to authenticated with check (bucket_id = ''lesson-audio'' and public.lesson_owner())';
    execute 'drop policy if exists lesson_audio_owner_update on storage.objects';
    execute 'create policy lesson_audio_owner_update on storage.objects for update to authenticated using (bucket_id = ''lesson-audio'' and public.lesson_owner()) with check (bucket_id = ''lesson-audio'' and public.lesson_owner())';
    execute 'drop policy if exists lesson_audio_owner_delete on storage.objects';
    execute 'create policy lesson_audio_owner_delete on storage.objects for delete to authenticated using (bucket_id = ''lesson-audio'' and public.lesson_owner())';
  end if;
end $$;

-- =====================================================================
-- PANDURI Creator — the owner's own projects: new lessons made from uploaded audio.
-- A Creator project is a lesson draft like any other (song_lesson_drafts), so the editor, the version history,
-- Preview, Publish and the learner's lesson all read ONE copy of the data. What only the owner may see — the
-- uploaded files, the raw analysis, the places marked for review — stays in the draft and is taken out on publish.
-- Every write is a security-definer function that checks public.lesson_owner() (user id AND confirmed email);
-- no table is writable directly.

alter table public.song_lessons add column if not exists categories text[] not null default '{}';
alter table public.song_lessons add column if not exists kind text;
do $$ begin
  alter table public.song_lessons add constraint song_lessons_categories check (categories <@ array['songs', 'melodies', 'solos', 'teaching']::text[]);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.song_lessons add constraint song_lessons_kind check (kind is null or kind in ('song', 'melody', 'solo', 'full'));
exception when duplicate_object then null; end $$;

alter table public.song_lesson_drafts add column if not exists creator boolean not null default false;
alter table public.song_lesson_drafts add column if not exists title text;
alter table public.song_lesson_drafts add column if not exists kind text;
alter table public.song_lesson_drafts add column if not exists created_at timestamptz not null default now();
alter table public.song_lesson_drafts add column if not exists saved_at timestamptz;      -- the last explicit save (an autosave leaves it)

-- what a learner may receive: the draft without the owner's files, the raw analysis and the review notes
create or replace function public.song_lesson_public(d jsonb) returns jsonb language sql immutable as $$
  select (d - 'analysis' - 'review' - 'assets' - 'edited' - 'wip' - 'private');
$$;

-- ---------- a new project ----------
create or replace function public.creator_create(p_id text, p_draft jsonb)
returns integer language plpgsql security definer set search_path = public as $$
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if p_id !~ '^cr-[a-z0-9][a-z0-9-]{3,60}$' then raise exception 'bad-id'; end if;
  if p_draft is null or jsonb_typeof(p_draft) <> 'object' then raise exception 'bad-draft'; end if;
  if octet_length(p_draft::text) > 3000000 then raise exception 'too-large'; end if;
  if exists (select 1 from song_lessons where id = p_id) then raise exception 'exists' using errcode = '23505'; end if;
  insert into song_lessons (id, kind) values (p_id, p_draft #>> '{creator,type}');
  insert into song_lesson_drafts (id, draft, status, rev, creator, title, kind, saved_at)
    values (p_id, p_draft, coalesce(nullif(p_draft ->> 'status', ''), 'not-analyzed'), 1, true, left(coalesce(p_draft #>> '{title,ka}', p_draft #>> '{title,en}', p_id), 200), p_draft #>> '{creator,type}', now());
  insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, 1, 'create', p_draft, 'created');
  return 1;
end $$;

-- ---------- save: a version row; autosave: the same draft, no version row (the history stays readable) ----------
create or replace function public.song_lesson_save(p_id text, p_draft jsonb, p_status text default null, p_note text default null, p_base_rev integer default null)
returns integer language plpgsql security definer set search_path = public as $$
declare cur integer; nxt integer; st text;
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if p_draft is null or jsonb_typeof(p_draft) <> 'object' then raise exception 'bad-draft'; end if;
  if octet_length(p_draft::text) > 3000000 then raise exception 'too-large'; end if;
  insert into song_lessons (id) values (p_id) on conflict (id) do nothing;
  select rev into cur from song_lesson_drafts where id = p_id for update;
  if cur is not null and p_base_rev is not null and p_base_rev <> cur then raise exception 'conflict' using errcode = '40001'; end if;
  nxt := coalesce(cur, 0) + 1;
  st := coalesce(p_status, 'manually-edited');
  insert into song_lesson_drafts (id, draft, status, rev, updated_at, saved_at, creator, title, kind)
    values (p_id, p_draft, st, nxt, now(), now(), p_id like 'cr-%', left(coalesce(p_draft #>> '{title,ka}', p_draft #>> '{title,en}'), 200), p_draft #>> '{creator,type}')
    on conflict (id) do update set draft = excluded.draft, status = excluded.status, rev = excluded.rev, updated_at = now(), saved_at = now(),
      title = excluded.title, kind = excluded.kind;
  insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, nxt, 'draft', p_draft, p_note);
  return nxt;
end $$;

create or replace function public.song_lesson_autosave(p_id text, p_draft jsonb, p_base_rev integer)
returns integer language plpgsql security definer set search_path = public as $$
declare cur integer;
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if p_draft is null or jsonb_typeof(p_draft) <> 'object' then raise exception 'bad-draft'; end if;
  if octet_length(p_draft::text) > 3000000 then raise exception 'too-large'; end if;
  select rev into cur from song_lesson_drafts where id = p_id for update;
  if cur is null then raise exception 'no-draft'; end if;
  if p_base_rev is not null and p_base_rev <> cur then raise exception 'conflict' using errcode = '40001'; end if;
  update song_lesson_drafts set draft = p_draft, rev = cur + 1, updated_at = now(),
    status = case when status in ('published', 'teacher-verified', 'not-analyzed', 'analysis-completed', 'needs-review') then 'manually-edited' else status end,
    title = left(coalesce(p_draft #>> '{title,ka}', p_draft #>> '{title,en}', title), 200), kind = coalesce(p_draft #>> '{creator,type}', kind)
    where id = p_id;
  return cur + 1;
end $$;

-- ---------- publish into one or more sections (one copy of the data; the sections only list it) ----------
drop function if exists public.song_lesson_publish(text, text);
create or replace function public.song_lesson_publish(p_id text, p_note text default null, p_categories text[] default null)
returns integer language plpgsql security definer set search_path = public as $$
declare d song_lesson_drafts; cats text[];
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  select * into d from song_lesson_drafts where id = p_id for update;
  if d.id is null then raise exception 'no-draft'; end if;
  cats := coalesce(p_categories, (select array_agg(x) from jsonb_array_elements_text(coalesce(d.draft #> '{creator,categories}', '[]'::jsonb)) x), '{}');
  if not (cats <@ array['songs', 'melodies', 'solos', 'teaching']::text[]) then raise exception 'bad-category'; end if;
  update song_lessons set published = public.song_lesson_public(d.draft), published_rev = d.rev, published_at = now(), categories = cats,
    kind = coalesce(d.draft #>> '{creator,type}', kind),
    verified = (d.verified_rev is not null and d.verified_rev = d.rev), updated_at = now() where id = p_id;
  update song_lesson_drafts set status = 'published', updated_at = now() where id = p_id;
  insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, d.rev, 'publish', d.draft, p_note);
  return d.rev;
end $$;

create or replace function public.song_lesson_unpublish(p_id text)
returns void language plpgsql security definer set search_path = public as $$
declare d song_lesson_drafts;
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  update song_lessons set published = null, published_at = null, verified = false, categories = '{}', updated_at = now() where id = p_id;
  if not found then raise exception 'no-lesson'; end if;
  select * into d from song_lesson_drafts where id = p_id for update;
  if d.id is not null then
    update song_lesson_drafts set status = case when d.verified_rev = d.rev then 'teacher-verified' else 'manually-edited' end, updated_at = now() where id = p_id;
    insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, d.rev, 'unpublish', d.draft, null);
  end if;
end $$;

-- Delete Draft: a project that learners do not have (unpublish first); for a built-in song, its draft goes and the built-in lesson stays
create or replace function public.song_lesson_delete(p_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.lesson_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if exists (select 1 from song_lessons where id = p_id and published is not null) then raise exception 'published'; end if;
  delete from song_lessons where id = p_id;   -- the draft and its versions go with it (on delete cascade)
end $$;

-- the publish function changed its signature: grant it again, and the new ones
revoke all on function public.song_lesson_publish(text, text, text[]), public.song_lesson_unpublish(text), public.song_lesson_delete(text),
  public.song_lesson_autosave(text, jsonb, integer), public.creator_create(text, jsonb), public.song_lesson_save(text, jsonb, text, text, integer) from public, anon;
grant execute on function public.song_lesson_publish(text, text, text[]), public.song_lesson_unpublish(text), public.song_lesson_delete(text),
  public.song_lesson_autosave(text, jsonb, integer), public.creator_create(text, jsonb), public.song_lesson_save(text, jsonb, text, text, integer) to authenticated;

-- ---------- the owner's uploads: a PRIVATE bucket (originals, separated stems); nobody else can list, read or write it ----------
do $$ begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit) values ('creator-audio', 'creator-audio', false, 52428800)
      on conflict (id) do update set public = false, file_size_limit = 52428800;
  end if;
end $$;
do $$ begin
  if to_regclass('storage.objects') is not null then
    execute 'drop policy if exists creator_audio_owner_select on storage.objects';
    execute 'create policy creator_audio_owner_select on storage.objects for select to authenticated using (bucket_id = ''creator-audio'' and public.lesson_owner())';
    execute 'drop policy if exists creator_audio_owner_insert on storage.objects';
    execute 'create policy creator_audio_owner_insert on storage.objects for insert to authenticated with check (bucket_id = ''creator-audio'' and public.lesson_owner())';
    execute 'drop policy if exists creator_audio_owner_update on storage.objects';
    execute 'create policy creator_audio_owner_update on storage.objects for update to authenticated using (bucket_id = ''creator-audio'' and public.lesson_owner()) with check (bucket_id = ''creator-audio'' and public.lesson_owner())';
    execute 'drop policy if exists creator_audio_owner_delete on storage.objects';
    execute 'create policy creator_audio_owner_delete on storage.objects for delete to authenticated using (bucket_id = ''creator-audio'' and public.lesson_owner())';
  end if;
end $$;
