-- DM == campaign owner. Transfer ownership to an active member.

begin;

create or replace function public.transfer_campaign_owner(
  p_campaign_id uuid,
  p_new_owner_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_owner_id uuid;
begin
  if not public.can_manage_campaign(p_campaign_id) then
    raise exception 'Not allowed to manage this campaign';
  end if;

  select c.owner_id into v_old_owner_id
  from public.campaigns c
  where c.id = p_campaign_id;

  if v_old_owner_id is null then
    raise exception 'Campaign not found';
  end if;

  if v_old_owner_id = p_new_owner_user_id then
    return;
  end if;

  if not exists (
    select 1
    from public.campaign_members cm
    where cm.campaign_id = p_campaign_id
      and cm.user_id = p_new_owner_user_id
      and cm.status = 'active'
  ) then
    raise exception 'New DM must be an active campaign member';
  end if;

  update public.campaigns
  set owner_id = p_new_owner_user_id
  where id = p_campaign_id;

  -- Keep both users as active members (owner is modeled by campaigns.owner_id).
  insert into public.campaign_members (campaign_id, user_id, role, status, joined_at)
  values (p_campaign_id, p_new_owner_user_id, 'owner', 'active', now())
  on conflict (campaign_id, user_id) do update
  set status = 'active';

  insert into public.campaign_members (campaign_id, user_id, role, status, joined_at)
  values (p_campaign_id, v_old_owner_id, 'player', 'active', now())
  on conflict (campaign_id, user_id) do update
  set status = 'active';
end;
$$;

revoke all on function public.transfer_campaign_owner(uuid, uuid) from public;
grant execute on function public.transfer_campaign_owner(uuid, uuid) to authenticated;

commit;
