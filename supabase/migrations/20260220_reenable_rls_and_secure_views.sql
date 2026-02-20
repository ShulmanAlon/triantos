-- Re-enable RLS and remove SECURITY DEFINER behavior from views flagged by Supabase linter.
-- Safe to run multiple times.

begin;

-- 1) Re-enable RLS on public tables that already have policies.
alter table if exists public.campaign_members enable row level security;
alter table if exists public.campaigns enable row level security;
alter table if exists public.characters enable row level security;
alter table if exists public.users enable row level security;

-- 2) Ensure views run with caller permissions (not creator permissions).
-- Requires Postgres/Supabase versions that support view option security_invoker.
alter view if exists public.dashboard_campaigns set (security_invoker = true);
alter view if exists public.campaign_access set (security_invoker = true);

commit;
