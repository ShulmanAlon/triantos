-- Fix infinite recursion in campaign_members RLS policy.
-- Cause: policy evaluation can re-enter campaign_members via invoker views/subqueries.

begin;

-- Helper runs with definer rights so policy checks don't recurse through RLS.
create or replace function public.is_campaign_member(p_campaign_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.campaign_members cm
    where cm.campaign_id = p_campaign_id
      and cm.user_id = auth.uid()
  );
$$;

revoke all on function public.is_campaign_member(uuid) from public;
grant execute on function public.is_campaign_member(uuid) to authenticated;

-- Replace the select policy with a recursion-safe version.
drop policy if exists "Allow members and admins to read campaign_members" on public.campaign_members;

create policy "Allow members and admins to read campaign_members"
on public.campaign_members
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_campaign_member(campaign_id)
);

commit;
