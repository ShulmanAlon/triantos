-- Read helper for campaign page when RLS/view combinations block direct selects.

begin;

create or replace function public.get_campaign_for_viewer(p_campaign_id uuid)
returns table (
  campaign_id uuid,
  name text,
  description text,
  image_url text,
  owner_id uuid,
  owner_username text,
  members jsonb,
  deleted boolean
)
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
  select
    c.id as campaign_id,
    c.name,
    c.description,
    c.image_url,
    c.owner_id,
    owner_u.username as owner_username,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'user_id', cm.user_id,
          'username', member_u.username
        )
      ) filter (where cm.user_id is not null),
      '[]'::jsonb
    ) as members,
    c.deleted
  from public.campaigns c
  join public.users owner_u on owner_u.id = c.owner_id
  left join public.campaign_members cm
    on cm.campaign_id = c.id
   and cm.status = 'active'
  left join public.users member_u on member_u.id = cm.user_id
  cross join me
  where c.id = p_campaign_id
    and (
      me.role = 'admin'
      or c.owner_id = me.id
      or exists (
        select 1
        from public.campaign_members me_cm
        where me_cm.campaign_id = c.id
          and me_cm.user_id = me.id
          and me_cm.status = 'active'
      )
    )
  group by c.id, owner_u.username;
$$;

revoke all on function public.get_campaign_for_viewer(uuid) from public;
grant execute on function public.get_campaign_for_viewer(uuid) to authenticated;

commit;
