-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- 1) Roles enum (compat: create only if missing)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'owner', 'farmer', 'user');
  END IF;
END$$;

-- 2) user_roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- 3) has_role helper function
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    where ur.user_id = _user_id and ur.role = _role
  );
$$;

-- 4) Policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 5) profiles table
create table if not exists public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 6) Timestamp auto-update function (shared)
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 7) Trigger for profiles.updated_at (compat)
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

-- 8) RLS policies for profiles
create policy "Users can view their own profiles"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id);

create policy "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 9) Trigger to create a profile row for every new auth user
create or replace function public.handle_new_user_profiles()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, phone, location)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'location'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 10) Trigger to auto-assign roles on signup
create or replace function public.handle_assign_roles()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;

  if lower(new.email) = lower('yrevanth2006@gmail.com') then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict do nothing;
  end if;

  if (new.raw_user_meta_data ? 'role') then
    if new.raw_user_meta_data ->> 'role' in ('farmer', 'owner') then
      insert into public.user_roles (user_id, role)
      values (new.id, (new.raw_user_meta_data ->> 'role')::public.app_role)
      on conflict do nothing;
    end if;
  end if;

  return new;
end;
$$;

-- 11) Attach triggers to auth.users (compat)
drop trigger if exists on_auth_user_created_profiles on auth.users;
create trigger on_auth_user_created_profiles
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profiles();

drop trigger if exists on_auth_user_created_roles on auth.users;
create trigger on_auth_user_created_roles
  after insert on auth.users
  for each row execute procedure public.handle_assign_roles();