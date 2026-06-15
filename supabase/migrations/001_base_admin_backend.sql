create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- admin_profiles.id is a FK to auth.users so orphaned profiles are impossible
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor')),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'imagekit' check (provider in ('imagekit')),
  asset_kind text not null default 'image' check (asset_kind in ('image')),
  provider_file_id text,
  file_key text not null unique,
  file_url text not null,
  file_name text,
  alt_text text,
  width integer,
  height integer,
  mime_type text check (
    mime_type is null
    or mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/avif')
  ),
  folder text,
  -- is_published controls public visibility; unpublished assets are admin-only
  is_published boolean not null default true,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.footer_social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  href text not null,
  icon_key text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_media_assets_is_published
  on public.media_assets (is_published);

create unique index if not exists idx_media_assets_provider_file_id
  on public.media_assets (provider, provider_file_id)
  where provider_file_id is not null;

create index if not exists idx_footer_social_links_sort_order
  on public.footer_social_links (sort_order);

create trigger trg_admin_profiles_updated_at
before update on public.admin_profiles
for each row
execute function public.set_updated_at();

create trigger trg_media_assets_updated_at
before update on public.media_assets
for each row
execute function public.set_updated_at();

create trigger trg_footer_social_links_updated_at
before update on public.footer_social_links
for each row
execute function public.set_updated_at();
