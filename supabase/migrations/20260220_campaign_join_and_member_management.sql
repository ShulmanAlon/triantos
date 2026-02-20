-- Membership + invitation system (join/manage flows)
-- Apply in Supabase SQL editor.

begin;

-- 1) campaign_members metadata
alter table if exists public.campaign_members
  add column if not exists role text,
  add column if not exists status text,
  add column if not exists joined_at timestamptz;

update public.campaign_members
set role = coalesce(role, 'player'),
    status = coalesce(status, 'active'),
    joined_at = coalesce(joined_at, now());

alter table public.campaign_members
  alter column role set default 'player',
  alter column status set default 'active',
  alter column joined_at set default now();

alter table public.campaign_members
  alter column role set not null,
  alter column status set not null,
  alter column joined_at set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'campaign_members_role_check'
      and conrelid = 'public.campaign_members'::regclass
  ) then
    alter table public.campaign_members
      add constraint campaign_members_role_check
      check (role in ('owner', 'dm', 'player'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'campaign_members_status_check'
      and conrelid = 'public.campaign_members'::regclass
  ) then
    alter table public.campaign_members
      add constraint campaign_members_status_check
      check (status in ('active', 'invited', 'left'));
  end if;
end $$;

-- Ensure owner has a member row.
insert into public.campaign_members (campaign_id, user_id, role, status, joined_at)
select c.id, c.owner_id, 'owner', 'active', now()
from public.campaigns c
on conflict (campaign_id, user_id) do update
set role = 'owner', status = 'active';

create or replace function public.ensure_owner_campaign_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.campaign_members (campaign_id, user_id, role, status, joined_at)
  values (new.id, new.owner_id, 'owner', 'active', now())
  on conflict (campaign_id, user_id) do update
  set role = 'owner', status = 'active';

  return new;
end;
$$;

drop trigger if exists trg_campaign_owner_membership on public.campaigns;
create trigger trg_campaign_owner_membership
after insert on public.campaigns
for each row
execute function public.ensure_owner_campaign_member();

-- 2) campaign invite code
alter table if exists public.campaigns
  add column if not exists invite_code text;

create or replace function public.generate_campaign_invite_code()
returns text
language plpgsql
as $$
declare
  v_code text;
  v_exists boolean;
begin
  loop
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 10));
    select exists (
      select 1
      from public.campaigns c
      where c.invite_code = v_code
    ) into v_exists;

    exit when not v_exists;
  end loop;

  return v_code;
end;
$$;

update public.campaigns
set invite_code = public.generate_campaign_invite_code()
where invite_code is null or trim(invite_code) = '';

create unique index if not exists campaigns_invite_code_key
on public.campaigns (invite_code);

alter table public.campaigns
  alter column invite_code set not null;

-- 3) shared auth helpers
create or replace function public.current_app_user_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select u.id
  from public.users u
  where u.auth_id = auth.uid()
  limit 1
$$;

revoke all on function public.current_app_user_id() from public;
grant execute on function public.current_app_user_id() to authenticated;

create or replace function public.can_manage_campaign(p_campaign_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  with me as (
    select u.id, u.role
    from public.users u
    where u.auth_id = auth.uid()
    limit 1
  )
  select exists (
    select 1
    from public.campaigns c
    cross join me
    where c.id = p_campaign_id
      and (c.owner_id = me.id or me.role = 'admin')
  )
$$;

revoke all on function public.can_manage_campaign(uuid) from public;
grant execute on function public.can_manage_campaign(uuid) to authenticated;

-- 4) Join/manage RPCs (security definer, guarded checks)
create or replace function public.join_campaign_by_code(p_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_campaign_id uuid;
begin
  v_user_id := public.current_app_user_id();
  if v_user_id is null then
    raise exception 'User not found for authenticated session';
  end if;

  select c.id
  into v_campaign_id
  from public.campaigns c
  where c.invite_code = upper(trim(p_invite_code))
    and coalesce(c.deleted, false) = false
  limit 1;

  if v_campaign_id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.campaign_members (campaign_id, user_id, role, status, joined_at)
  values (v_campaign_id, v_user_id, 'player', 'active', now())
  on conflict (campaign_id, user_id)
  do update set
    status = 'active',
    role = case when public.campaign_members.role = 'owner' then 'owner' else public.campaign_members.role end,
    joined_at = coalesce(public.campaign_members.joined_at, now());

  return v_campaign_id;
end;
$$;

revoke all on function public.join_campaign_by_code(text) from public;
grant execute on function public.join_campaign_by_code(text) to authenticated;

create or replace function public.regenerate_campaign_invite_code(p_campaign_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  if not public.can_manage_campaign(p_campaign_id) then
    raise exception 'Not allowed to manage this campaign';
  end if;

  v_code := public.generate_campaign_invite_code();

  update public.campaigns
  set invite_code = v_code
  where id = p_campaign_id;

  return v_code;
end;
$$;

revoke all on function public.regenerate_campaign_invite_code(uuid) from public;
grant execute on function public.regenerate_campaign_invite_code(uuid) to authenticated;

create or replace function public.set_campaign_member_role(
  p_campaign_id uuid,
  p_member_user_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  if p_role not in ('dm', 'player') then
    raise exception 'Role must be dm or player';
  end if;

  if not public.can_manage_campaign(p_campaign_id) then
    raise exception 'Not allowed to manage this campaign';
  end if;

  select c.owner_id into v_owner_id
  from public.campaigns c
  where c.id = p_campaign_id;

  if v_owner_id = p_member_user_id then
    raise exception 'Cannot change owner role';
  end if;

  update public.campaign_members cm
  set role = p_role
  where cm.campaign_id = p_campaign_id
    and cm.user_id = p_member_user_id;
end;
$$;

revoke all on function public.set_campaign_member_role(uuid, uuid, text) from public;
grant execute on function public.set_campaign_member_role(uuid, uuid, text) to authenticated;

create or replace function public.remove_campaign_member(
  p_campaign_id uuid,
  p_member_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  if not public.can_manage_campaign(p_campaign_id) then
    raise exception 'Not allowed to manage this campaign';
  end if;

  select c.owner_id into v_owner_id
  from public.campaigns c
  where c.id = p_campaign_id;

  if v_owner_id = p_member_user_id then
    raise exception 'Cannot remove owner';
  end if;

  delete from public.campaign_members cm
  where cm.campaign_id = p_campaign_id
    and cm.user_id = p_member_user_id;
end;
$$;

revoke all on function public.remove_campaign_member(uuid, uuid) from public;
grant execute on function public.remove_campaign_member(uuid, uuid) to authenticated;

commit;
