-- Restrict campaign creation to an allowlist and move creation to a guarded RPC.
-- Friends-only mode: set public.users.can_create_campaign = true for approved users.

begin;

alter table if exists public.users
  add column if not exists can_create_campaign boolean not null default false;

create or replace function public.current_user_can_create_campaign()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.users u
    where u.auth_id = auth.uid()
      and (
        coalesce(u.can_create_campaign, false) = true
        or u.role = 'admin'
      )
  );
$$;

revoke all on function public.current_user_can_create_campaign() from public;
grant execute on function public.current_user_can_create_campaign() to authenticated;

drop policy if exists "Allow insert if owner_id belongs to auth user" on public.campaigns;
drop policy if exists "Allow allowlisted users to create campaigns" on public.campaigns;

create policy "Allow allowlisted users to create campaigns"
on public.campaigns
for insert
to authenticated
with check (
  owner_id = public.current_app_user_id()
  and public.current_user_can_create_campaign()
);

create or replace function public.create_campaign_secure(
  p_name text,
  p_description text default null,
  p_image_url text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_campaign_id uuid;
  v_name text;
begin
  v_owner_id := public.current_app_user_id();
  if v_owner_id is null then
    raise exception 'User not found for authenticated session';
  end if;

  if not public.current_user_can_create_campaign() then
    raise exception 'You are not allowed to create campaigns';
  end if;

  v_name := nullif(trim(coalesce(p_name, '')), '');
  if v_name is null then
    raise exception 'Campaign name is required';
  end if;

  insert into public.campaigns (name, description, image_url, owner_id)
  values (
    v_name,
    nullif(trim(coalesce(p_description, '')), ''),
    nullif(trim(coalesce(p_image_url, '')), ''),
    v_owner_id
  )
  returning id into v_campaign_id;

  return v_campaign_id;
end;
$$;

revoke all on function public.create_campaign_secure(text, text, text) from public;
grant execute on function public.create_campaign_secure(text, text, text) to authenticated;

commit;
