-- Supabase Auth users are invited manually. Grant panel access by inserting their UUID here.
create table public.admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_releases enable row level security;
alter table public.release_game_versions enable row level security;
alter table public.release_loaders enable row level security;
alter table public.release_files enable row level security;
create unique index project_releases_version_casefold_unique on public.project_releases (project_id, lower(version));

create policy "member can see own membership" on public.admin_members for select to authenticated using (user_id = (select auth.uid()));
create policy "public and admins can read projects" on public.projects for select to anon, authenticated using (
  (status = 'published' and visibility = 'public') or
  exists (select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "public and admins can read releases" on public.project_releases for select to anon, authenticated using (
  (status = 'published' and exists (select 1 from public.projects p where p.id = project_id and p.status = 'published' and p.visibility = 'public')) or
  exists (select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "public and admins can read game versions" on public.release_game_versions for select to anon, authenticated using (
  exists (select 1 from public.project_releases r where r.id = release_id) or
  exists (select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "public and admins can read loaders" on public.release_loaders for select to anon, authenticated using (
  exists (select 1 from public.project_releases r where r.id = release_id) or
  exists (select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);
create policy "public and admins can read files" on public.release_files for select to anon, authenticated using (
  exists (select 1 from public.project_releases r where r.id = release_id) or
  exists (select 1 from public.admin_members m where m.user_id = (select auth.uid()))
);

-- Unlisted projects are only returned for a known slug, never by collection queries.
create or replace function public.get_public_project(project_slug text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select to_jsonb(p) || jsonb_build_object('project_releases', coalesce((
    select jsonb_agg(to_jsonb(r) || jsonb_build_object(
      'release_game_versions', coalesce((select jsonb_agg(to_jsonb(g)) from public.release_game_versions g where g.release_id = r.id), '[]'::jsonb),
      'release_loaders', coalesce((select jsonb_agg(to_jsonb(l)) from public.release_loaders l where l.release_id = r.id), '[]'::jsonb),
      'release_files', coalesce((select jsonb_agg(to_jsonb(f)) from public.release_files f where f.release_id = r.id), '[]'::jsonb)
    ) order by r.sort_order) from public.project_releases r where r.project_id = p.id and r.status = 'published'
  ), '[]'::jsonb))
  from public.projects p where p.slug = project_slug and p.status = 'published' and p.visibility <> 'private'
  limit 1;
$$;

create or replace function public.save_project(project_id uuid, payload jsonb)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  saved_id uuid;
  new_release_id uuid;
  item jsonb;
  item_index integer := 0;
begin
  if auth.uid() is null or not exists (select 1 from public.admin_members where user_id = auth.uid()) then
    raise exception 'Access denied' using errcode = '42501';
  end if;
  if jsonb_typeof(payload) <> 'object' or
     length(trim(coalesce(payload->>'name', ''))) not between 2 and 80 or
     coalesce(payload->>'slug', '') !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or
     length(payload->>'slug') not between 2 and 80 or
     length(trim(coalesce(payload->>'summary', ''))) not between 10 and 220 or
     length(coalesce(payload->>'description', '')) > 50000 or
     (coalesce(payload->>'iconUrl','') <> '' and payload->>'iconUrl' !~* '^https?://') or
     (coalesce(payload->>'sourceUrl','') <> '' and payload->>'sourceUrl' !~* '^https?://') or
     (coalesce(payload->>'issuesUrl','') <> '' and payload->>'issuesUrl' !~* '^https?://') or
     jsonb_typeof(payload->'releases') <> 'array' or jsonb_array_length(payload->'releases') > 50 then
    raise exception 'Invalid project data' using errcode = '22023';
  end if;
  if project_id is null then
    insert into public.projects (slug, name, summary, description, type, status, visibility, icon_url, source_url, issues_url, license, client_side, server_side, featured, published_at)
    values (payload->>'slug', payload->>'name', payload->>'summary', coalesce(payload->>'description',''), (payload->>'type')::public.project_type,
      (payload->>'status')::public.project_status, (payload->>'visibility')::public.project_visibility, nullif(payload->>'iconUrl',''), nullif(payload->>'sourceUrl',''),
      nullif(payload->>'issuesUrl',''), nullif(payload->>'license',''), (payload->>'clientSide')::public.side_support, (payload->>'serverSide')::public.side_support,
      coalesce((payload->>'featured')::boolean, false), case when payload->>'status' = 'published' then now() else null end)
    returning id into saved_id;
  else
    update public.projects set slug = payload->>'slug', name = payload->>'name', summary = payload->>'summary', description = coalesce(payload->>'description',''),
      type = (payload->>'type')::public.project_type, status = (payload->>'status')::public.project_status, visibility = (payload->>'visibility')::public.project_visibility,
      icon_url = nullif(payload->>'iconUrl',''), source_url = nullif(payload->>'sourceUrl',''), issues_url = nullif(payload->>'issuesUrl',''), license = nullif(payload->>'license',''),
      client_side = (payload->>'clientSide')::public.side_support, server_side = (payload->>'serverSide')::public.side_support,
      featured = coalesce((payload->>'featured')::boolean, false), updated_at = now(),
      published_at = case when payload->>'status' = 'published' then coalesce(published_at, now()) else null end
    where id = project_id returning id into saved_id;
    if saved_id is null then raise exception 'Project not found' using errcode = 'P0002'; end if;
    delete from public.project_releases r where r.project_id = saved_id and r.id not in (
      select (value->>'id')::uuid from jsonb_array_elements(payload->'releases') where value ? 'id'
    );
    -- Temporary versions avoid unique conflicts when two existing releases swap names.
    update public.project_releases r set version = '__sync__' || r.id::text where r.project_id = saved_id;
  end if;
  for item in select value from jsonb_array_elements(payload->'releases') loop
    if length(trim(coalesce(item->>'version',''))) not between 1 and 40 or
       length(trim(coalesce(item->>'name',''))) not between 1 and 100 or
       length(coalesce(item->>'changelog','')) > 20000 or
       length(coalesce(item->>'filename','')) > 180 or
       coalesce(item->>'downloadUrl','') !~* '^https?://' or
       jsonb_typeof(item->'gameVersions') <> 'array' or jsonb_array_length(item->'gameVersions') not between 1 and 30 or
       jsonb_typeof(item->'loaders') <> 'array' or jsonb_array_length(item->'loaders') not between 1 and 15 then
      raise exception 'Invalid release data' using errcode = '22023';
    end if;
    new_release_id := null;
    if item ? 'id' then
      update public.project_releases r set version = item->>'version', name = item->>'name', changelog = coalesce(item->>'changelog',''),
        channel = (item->>'channel')::public.release_channel, status = (item->>'status')::public.release_status, sort_order = item_index,
        published_at = case when item->>'status' = 'published' then coalesce(r.published_at, now()) else null end
      where r.id = (item->>'id')::uuid and r.project_id = saved_id returning r.id into new_release_id;
    end if;
    if new_release_id is null then
      insert into public.project_releases (project_id, version, name, changelog, channel, status, sort_order, published_at)
      values (saved_id, item->>'version', item->>'name', coalesce(item->>'changelog',''), (item->>'channel')::public.release_channel,
        (item->>'status')::public.release_status, item_index, case when item->>'status' = 'published' then now() else null end)
      returning id into new_release_id;
    else
      delete from public.release_game_versions where release_id = new_release_id;
      delete from public.release_loaders where release_id = new_release_id;
      delete from public.release_files where release_id = new_release_id;
    end if;
    insert into public.release_game_versions (release_id, game_version)
      select new_release_id, lower(trim(value)) from jsonb_array_elements_text(item->'gameVersions') where length(trim(value)) between 1 and 30 group by lower(trim(value));
    insert into public.release_loaders (release_id, loader)
      select new_release_id, lower(trim(value)) from jsonb_array_elements_text(item->'loaders') where length(trim(value)) between 1 and 30 group by lower(trim(value));
    insert into public.release_files (release_id, display_name, kind, url, filename, "primary")
    values (new_release_id, coalesce(nullif(item->>'filename',''), (item->>'name') || ' ' || (item->>'version')), 'external', item->>'downloadUrl', nullif(item->>'filename',''), true);
    item_index := item_index + 1;
  end loop;
  return saved_id;
end;
$$;

create or replace function public.delete_project(project_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (select 1 from public.admin_members where user_id = auth.uid()) then
    raise exception 'Access denied' using errcode = '42501';
  end if;
  delete from public.projects where id = project_id;
  if not found then raise exception 'Project not found' using errcode = 'P0002'; end if;
end;
$$;

revoke execute on function public.save_project(uuid, jsonb) from public, anon;
revoke execute on function public.delete_project(uuid) from public, anon;
revoke execute on function public.get_public_project(text) from public;
grant execute on function public.save_project(uuid, jsonb) to authenticated;
grant execute on function public.delete_project(uuid) to authenticated;
grant execute on function public.get_public_project(text) to anon, authenticated;
grant select on public.projects, public.project_releases, public.release_game_versions, public.release_loaders, public.release_files to anon, authenticated;
grant select on public.admin_members to authenticated;
