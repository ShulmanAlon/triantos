-- Reliable campaign deletion for owner/admin under RLS.

begin;

create or replace function public.set_campaign_deleted(
  p_campaign_id uuid,
  p_deleted boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.can_manage_campaign(p_campaign_id) then
    raise exception 'Not allowed to manage this campaign';
  end if;

  update public.campaigns
  set deleted = p_deleted
  where id = p_campaign_id;
end;
$$;

revoke all on function public.set_campaign_deleted(uuid, boolean) from public;
grant execute on function public.set_campaign_deleted(uuid, boolean) to authenticated;

commit;
