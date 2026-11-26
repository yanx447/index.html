-- Song lessons edited by the owner (Admin Lesson Editor).
-- Everyone reads what was published; only the owner (public.is_owner(), the server's own check) can read a draft,
-- the review status or the version history, and only through the functions below can anything be written —
-- no table grants insert, update or delete to anyone, so a direct API request cannot change a lesson.
-- Needs public.is_owner() (schema.sql). Additive; can be run twice.

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
  kind text not null check (kind in ('draft', 'publish', 'verify', 'unverify', 'restore')),
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
create policy song_lessons_read on public.song_lessons for select to authenticated using (published is not null or public.is_owner());
drop policy if exists song_lesson_drafts_owner on public.song_lesson_drafts;
create policy song_lesson_drafts_owner on public.song_lesson_drafts for select to authenticated using (public.is_owner());
drop policy if exists song_lesson_versions_owner on public.song_lesson_versions;
create policy song_lesson_versions_owner on public.song_lesson_versions for select to authenticated using (public.is_owner());

-- ---------- writes: the owner only, checked here on every call ----------
create or replace function public.song_lesson_save(p_id text, p_draft jsonb, p_status text default null, p_note text default null, p_base_rev integer default null)
returns integer language plpgsql security definer set search_path = public as $$
declare cur integer; nxt integer; st text;
begin
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if p_draft is null or jsonb_typeof(p_draft) <> 'object' then raise exception 'bad-draft'; end if;
  if octet_length(p_draft::text) > 3000000 then raise exception 'too-large'; end if;
  insert into song_lessons (id) values (p_id) on conflict (id) do nothing;
  select rev into cur from song_lesson_drafts where id = p_id for update;
  if cur is not null and p_base_rev is not null and p_base_rev <> cur then raise exception 'conflict' using errcode = '40001'; end if;
  nxt := coalesce(cur, 0) + 1;
  st := coalesce(p_status, 'manually-edited');
  insert into song_lesson_drafts (id, draft, status, rev, updated_at) values (p_id, p_draft, st, nxt, now())
    on conflict (id) do update set draft = excluded.draft, status = excluded.status, rev = excluded.rev, updated_at = now();
  insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, nxt, 'draft', p_draft, p_note);
  return nxt;
end $$;

create or replace function public.song_lesson_publish(p_id text, p_note text default null)
returns integer language plpgsql security definer set search_path = public as $$
declare d song_lesson_drafts;
begin
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  select * into d from song_lesson_drafts where id = p_id for update;
  if d.id is null then raise exception 'no-draft'; end if;
  update song_lessons set published = d.draft, published_rev = d.rev, published_at = now(),
    verified = (d.verified_rev is not null and d.verified_rev = d.rev), updated_at = now() where id = p_id;
  update song_lesson_drafts set status = 'published', updated_at = now() where id = p_id;
  insert into song_lesson_versions (lesson_id, rev, kind, data, note) values (p_id, d.rev, 'publish', d.draft, p_note);
  return d.rev;
end $$;

create or replace function public.song_lesson_verify(p_id text, p_on boolean default true)
returns boolean language plpgsql security definer set search_path = public as $$
declare d song_lesson_drafts;
begin
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
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
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
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
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
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
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  insert into song_lessons (id) values (p_id) on conflict (id) do nothing;
  update song_lesson_drafts set status = p_status, updated_at = now() where id = p_id;
  if not found then insert into song_lesson_drafts (id, draft, status, rev) values (p_id, '{}'::jsonb, p_status, 0); end if;
end $$;

-- the recording a lesson plays: an object the owner uploaded to the lesson-audio bucket (or null to take it away)
create or replace function public.song_lesson_set_audio(p_id text, p_path text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'not-allowed' using errcode = '42501'; end if;
  if p_path is not null and split_part(p_path, '/', 1) <> p_id then raise exception 'bad-path'; end if;
  insert into song_lessons (id) values (p_id) on conflict (id) do nothing;
  update song_lessons set audio_path = p_path, updated_at = now() where id = p_id;
end $$;

revoke all on function public.song_lesson_save(text, jsonb, text, text, integer), public.song_lesson_publish(text, text),
  public.song_lesson_verify(text, boolean), public.song_lesson_restore(text, bigint), public.song_lesson_revert(text),
  public.song_lesson_set_status(text, text), public.song_lesson_set_audio(text, text) from public, anon;
grant execute on function public.song_lesson_save(text, jsonb, text, text, integer), public.song_lesson_publish(text, text),
  public.song_lesson_verify(text, boolean), public.song_lesson_restore(text, bigint), public.song_lesson_revert(text),
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
    execute 'create policy lesson_audio_owner_insert on storage.objects for insert to authenticated with check (bucket_id = ''lesson-audio'' and public.is_owner())';
    execute 'drop policy if exists lesson_audio_owner_update on storage.objects';
    execute 'create policy lesson_audio_owner_update on storage.objects for update to authenticated using (bucket_id = ''lesson-audio'' and public.is_owner()) with check (bucket_id = ''lesson-audio'' and public.is_owner())';
    execute 'drop policy if exists lesson_audio_owner_delete on storage.objects';
    execute 'create policy lesson_audio_owner_delete on storage.objects for delete to authenticated using (bucket_id = ''lesson-audio'' and public.is_owner())';
  end if;
end $$;
