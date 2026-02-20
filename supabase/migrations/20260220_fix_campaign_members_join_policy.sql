-- Fix campaign_members insert RLS failures when creating characters.
-- Replaces the "Join campaign" policy with a recursion-safe rule.

begin;

create or replace function public.campaign_exists(p_campaign_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.campaigns c
    where c.id = p_campaign_id
  );
$$;

revoke all on function public.campaign_exists(uuid) from public;
grant execute on function public.campaign_exists(uuid) to authenticated;

drop policy if exists "Join campaign" on public.campaign_members;

create policy "Join campaign"
on public.campaign_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.campaign_exists(campaign_id)
);

commit;
