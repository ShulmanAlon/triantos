-- Fix campaign creation failing on NOT NULL invite_code.
-- Ensures invite_code auto-generates when omitted by client inserts.

begin;

-- Safety: ensure generator exists
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

-- Backfill any null/blank values
update public.campaigns
set invite_code = public.generate_campaign_invite_code()
where invite_code is null or trim(invite_code) = '';

-- Critical fix: set default for future inserts
alter table public.campaigns
  alter column invite_code set default public.generate_campaign_invite_code();

commit;
