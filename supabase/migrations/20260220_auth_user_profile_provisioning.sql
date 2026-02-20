-- Auto-provision public.users row when a new auth user signs up.

begin;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
begin
  v_username := nullif(trim(coalesce(new.raw_user_meta_data ->> 'username', '')), '');

  if v_username is null then
    v_username := split_part(coalesce(new.email, ''), '@', 1);
  end if;

  if v_username is null or v_username = '' then
    v_username := 'user_' || substr(new.id::text, 1, 8);
  end if;

  insert into public.users (auth_id, username, role)
  select new.id, v_username, 'player'
  where not exists (
    select 1
    from public.users u
    where u.auth_id = new.id
  );

  return new;
end;
$$;

-- Ensure trigger exists once.
drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

commit;
