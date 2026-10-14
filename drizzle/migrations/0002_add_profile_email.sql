alter table public.profiles add column if not exists email text;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (user_id, email, display_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name',''));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end $$;

update public.profiles p set email = u.email from auth.users u where p.user_id = u.id and p.email is null;