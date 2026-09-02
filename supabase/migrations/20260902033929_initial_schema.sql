-- Nepal Disaster Relief Information MVP
-- Run this in the Supabase SQL editor for your project.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- profiles: links auth.users to an admin role
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  is_admin boolean not null default false,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, is_admin)
  values (new.id, false)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable set search_path = public;

-- ============================================================
-- donation_centers
-- ============================================================
create table if not exists public.donation_centers (
  id uuid primary key default gen_random_uuid(),
  initiative_name text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  contact_details text not null,
  registration_number text,
  operational_hours text not null,
  donation_types text[] not null default '{}',
  website text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  verified_at timestamptz,
  verified_by uuid references public.profiles (id)
);

create index if not exists idx_donation_centers_status on public.donation_centers (status);
create index if not exists idx_donation_centers_lat_lng on public.donation_centers (latitude, longitude);

-- ============================================================
-- official_updates
-- ============================================================
create table if not exists public.official_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  source_organization text not null,
  source_url text not null,
  published_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_official_updates_published_at on public.official_updates (published_at desc);

-- ============================================================
-- disaster_statistics
-- ============================================================
create table if not exists public.disaster_statistics (
  id uuid primary key default gen_random_uuid(),
  category text not null, -- e.g. deaths, rescued, missing, injured, affected_people, affected_households
  value numeric not null,
  unit text,
  location text,
  source_organization text not null,
  source_url text not null,
  reported_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_disaster_statistics_category on public.disaster_statistics (category);
create index if not exists idx_disaster_statistics_reported_at on public.disaster_statistics (reported_at desc);

-- ============================================================
-- materials_needed
-- ============================================================
create table if not exists public.materials_needed (
  id uuid primary key default gen_random_uuid(),
  material text not null,
  description text,
  location text,
  quantity_or_requirement text,
  source_organization text not null,
  source_url text not null,
  reported_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_materials_needed_reported_at on public.materials_needed (reported_at desc);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_donation_centers on public.donation_centers;
create trigger set_updated_at_donation_centers before update on public.donation_centers
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_official_updates on public.official_updates;
create trigger set_updated_at_official_updates before update on public.official_updates
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_disaster_statistics on public.disaster_statistics;
create trigger set_updated_at_disaster_statistics before update on public.disaster_statistics
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_materials_needed on public.materials_needed;
create trigger set_updated_at_materials_needed before update on public.materials_needed
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.donation_centers enable row level security;
alter table public.official_updates enable row level security;
alter table public.disaster_statistics enable row level security;
alter table public.materials_needed enable row level security;

-- profiles: a user can read their own profile; admins can read all
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- donation_centers
drop policy if exists "donation_centers_select_approved_public" on public.donation_centers;
create policy "donation_centers_select_approved_public"
  on public.donation_centers for select
  using (status = 'approved' or public.is_admin());

drop policy if exists "donation_centers_insert_public" on public.donation_centers;
create policy "donation_centers_insert_public"
  on public.donation_centers for insert
  with check (status = 'pending');

drop policy if exists "donation_centers_update_admin_only" on public.donation_centers;
create policy "donation_centers_update_admin_only"
  on public.donation_centers for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "donation_centers_delete_admin_only" on public.donation_centers;
create policy "donation_centers_delete_admin_only"
  on public.donation_centers for delete
  using (public.is_admin());

-- official_updates: public read, admin write
drop policy if exists "official_updates_select_all" on public.official_updates;
create policy "official_updates_select_all"
  on public.official_updates for select
  using (true);

drop policy if exists "official_updates_insert_admin_only" on public.official_updates;
create policy "official_updates_insert_admin_only"
  on public.official_updates for insert
  with check (public.is_admin());

drop policy if exists "official_updates_update_admin_only" on public.official_updates;
create policy "official_updates_update_admin_only"
  on public.official_updates for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "official_updates_delete_admin_only" on public.official_updates;
create policy "official_updates_delete_admin_only"
  on public.official_updates for delete
  using (public.is_admin());

-- disaster_statistics: public read, admin write
drop policy if exists "disaster_statistics_select_all" on public.disaster_statistics;
create policy "disaster_statistics_select_all"
  on public.disaster_statistics for select
  using (true);

drop policy if exists "disaster_statistics_insert_admin_only" on public.disaster_statistics;
create policy "disaster_statistics_insert_admin_only"
  on public.disaster_statistics for insert
  with check (public.is_admin());

drop policy if exists "disaster_statistics_update_admin_only" on public.disaster_statistics;
create policy "disaster_statistics_update_admin_only"
  on public.disaster_statistics for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "disaster_statistics_delete_admin_only" on public.disaster_statistics;
create policy "disaster_statistics_delete_admin_only"
  on public.disaster_statistics for delete
  using (public.is_admin());

-- materials_needed: public read, admin write
drop policy if exists "materials_needed_select_all" on public.materials_needed;
create policy "materials_needed_select_all"
  on public.materials_needed for select
  using (true);

drop policy if exists "materials_needed_insert_admin_only" on public.materials_needed;
create policy "materials_needed_insert_admin_only"
  on public.materials_needed for insert
  with check (public.is_admin());

drop policy if exists "materials_needed_update_admin_only" on public.materials_needed;
create policy "materials_needed_update_admin_only"
  on public.materials_needed for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "materials_needed_delete_admin_only" on public.materials_needed;
create policy "materials_needed_delete_admin_only"
  on public.materials_needed for delete
  using (public.is_admin());

-- ============================================================
-- To make the first admin, after that user has signed up via Supabase Auth:
--   update public.profiles set is_admin = true where id = '<user-uuid>';
-- ============================================================