-- Per-account Studio records. A tombstone permanently retires a project ID.
create table public.studio_projects (
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('song', 'arrangement')),
  project_id text not null check (project_id ~ '^[a-zA-Z0-9_-]{1,96}$'),
  revision text collate "C" not null check (revision ~ '^[0-9]{15}-[a-z0-9]{1,32}$'),
  deleted boolean not null default false,
  payload jsonb check (payload is null or jsonb_typeof(payload) = 'object'),
  primary key (user_id, kind, project_id),
  check (deleted = (payload is null))
);

alter table public.studio_projects enable row level security;
revoke all on public.studio_projects from anon, authenticated;
grant select, insert, update on public.studio_projects to authenticated;

create policy studio_projects_read on public.studio_projects
for select to authenticated using (user_id = (select auth.uid()));
create policy studio_projects_insert on public.studio_projects
for insert to authenticated with check (user_id = (select auth.uid()));
create policy studio_projects_update on public.studio_projects
for update to authenticated using (user_id = (select auth.uid()) and not deleted)
with check (user_id = (select auth.uid()));

create function public.studio_put_project(studio_kind text, studio_id text, studio_revision text, studio_payload jsonb)
returns boolean
language plpgsql security invoker set search_path = ''
as $$
begin
  if exists (
    select 1 from public.studio_projects
    where user_id = auth.uid() and kind = studio_kind and project_id = studio_id and deleted
  ) then
    return studio_payload is null;
  end if;

  insert into public.studio_projects as p (user_id, kind, project_id, revision, deleted, payload)
  values (auth.uid(), studio_kind, studio_id, studio_revision, studio_payload is null, studio_payload)
  on conflict (user_id, kind, project_id) do update
    set revision = excluded.revision, payload = excluded.payload, deleted = excluded.deleted
    where not p.deleted and (excluded.deleted or excluded.revision > p.revision);
  if found then return true; end if;

  return exists (
    select 1 from public.studio_projects
    where user_id = auth.uid() and kind = studio_kind and project_id = studio_id
      and (revision = studio_revision or (deleted and studio_payload is null))
  );
end;
$$;
revoke all on function public.studio_put_project(text,text,text,jsonb) from public, anon;
grant execute on function public.studio_put_project(text,text,text,jsonb) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values ('studio-projects', 'studio-projects', false, 52428800);

create policy studio_project_audio_read on storage.objects for select to authenticated
using (
  bucket_id = 'studio-projects'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy studio_project_audio_add on storage.objects for insert to authenticated
with check (
  bucket_id = 'studio-projects'
  and (storage.foldername(name)) = array[(select auth.uid())::text]
  and exists (
    select 1 from public.studio_projects p
    where p.user_id = (select auth.uid()) and p.kind = 'song'
      and p.project_id = storage.filename(name) and not p.deleted
      and p.payload->>'audio' = 'true'
  )
);

create policy studio_project_audio_delete on storage.objects for delete to authenticated
using (bucket_id = 'studio-projects' and (storage.foldername(name))[1] = (select auth.uid())::text);
