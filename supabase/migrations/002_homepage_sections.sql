create table if not exists public.home_hero_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Axion Workspace',
  headline text not null default 'We craft professional environments for teams ready to dominate their category.',
  cta_label text not null default 'Start your trial',
  cta_href text not null default '#contact',
  promo_title text not null default 'Premium Coworking',
  promo_badge_text text not null default 'Top Rated 2026',
  left_image_asset_id uuid references public.media_assets(id) on delete set null,
  top_right_image_asset_id uuid references public.media_assets(id) on delete set null,
  bottom_right_image_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_intro_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Introducing Axion',
  title text not null default 'Strategy-led workspaces, delivering results for professionals and beyond.',
  body_text text not null default 'Through ergonomic design, thoughtful architecture, and iteration we help growing teams realize their full potential in physical spaces.',
  cta_label text not null default 'About our spaces',
  cta_href text not null default '/about',
  left_image_asset_id uuid references public.media_assets(id) on delete set null,
  right_image_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_locations_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Our Growing Network',
  title text not null default 'Premium Spaces in Delhi, Rithala',
  view_all_label text not null default 'View all locations',
  view_all_href text not null default '/locations',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_location_cards (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.home_locations_sections(id) on delete cascade,
  layout_slot integer not null check (layout_slot between 1 and 6),
  location_name text not null,
  subtitle text,
  image_asset_id uuid references public.media_assets(id) on delete set null,
  hover_visit_label text not null default 'Request a Visit',
  hover_visit_href text not null default '/connect',
  hover_meeting_label text not null default 'Book Meeting Room',
  hover_meeting_href text not null default '/workspaces/meeting-rooms',
  hover_space_label text not null default 'Book Your Space',
  hover_space_href text not null default '/workspaces',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, layout_slot)
);

create table if not exists public.home_membership_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Memberships',
  title text not null default 'Plans for every stage of growth',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_membership_plans (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.home_membership_sections(id) on delete cascade,
  title text not null,
  description text,
  price_text text not null,
  cta_label text not null default 'Select Plan',
  highlight_badge_text text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_membership_plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.home_membership_plans(id) on delete cascade,
  feature_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_offerings_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Offerings',
  title text not null default 'Price on Request',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_offerings (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.home_offerings_sections(id) on delete cascade,
  title text not null,
  icon_key text not null,
  price_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_offering_features (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.home_offerings(id) on delete cascade,
  feature_text text not null,
  is_included boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_amenities_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Premium Amenities',
  title text not null default 'Our Amenities',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_amenities (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.home_amenities_sections(id) on delete cascade,
  icon_key text not null,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_testimonials_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Testimonials',
  title text not null default 'Trusted by the world''s most innovative companies.',
  layout_mode text not null default 'horizontal-drag' check (layout_mode in ('horizontal-drag')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_testimonials (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.home_testimonials_sections(id) on delete cascade,
  quote text not null,
  person_name text not null,
  person_role text,
  company_name text,
  avatar_asset_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.home_hero_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.home_intro_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.home_locations_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.home_membership_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.home_offerings_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.home_amenities_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.home_testimonials_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

create index if not exists idx_home_location_cards_section_sort
  on public.home_location_cards (section_id, sort_order);

create index if not exists idx_home_membership_plans_section_sort
  on public.home_membership_plans (section_id, sort_order);

create index if not exists idx_home_membership_features_plan_sort
  on public.home_membership_plan_features (plan_id, sort_order);

create index if not exists idx_home_offerings_section_sort
  on public.home_offerings (section_id, sort_order);

create index if not exists idx_home_offering_features_offering_sort
  on public.home_offering_features (offering_id, sort_order);

create index if not exists idx_home_amenities_section_sort
  on public.home_amenities (section_id, sort_order);

create index if not exists idx_home_testimonials_section_sort
  on public.home_testimonials (section_id, sort_order);

create trigger trg_home_hero_sections_updated_at
before update on public.home_hero_sections
for each row
execute function public.set_updated_at();

create trigger trg_home_intro_sections_updated_at
before update on public.home_intro_sections
for each row
execute function public.set_updated_at();

create trigger trg_home_locations_sections_updated_at
before update on public.home_locations_sections
for each row
execute function public.set_updated_at();

create trigger trg_home_location_cards_updated_at
before update on public.home_location_cards
for each row
execute function public.set_updated_at();

create trigger trg_home_membership_sections_updated_at
before update on public.home_membership_sections
for each row
execute function public.set_updated_at();

create trigger trg_home_membership_plans_updated_at
before update on public.home_membership_plans
for each row
execute function public.set_updated_at();

create trigger trg_home_membership_plan_features_updated_at
before update on public.home_membership_plan_features
for each row
execute function public.set_updated_at();

create trigger trg_home_offerings_sections_updated_at
before update on public.home_offerings_sections
for each row
execute function public.set_updated_at();

create trigger trg_home_offerings_updated_at
before update on public.home_offerings
for each row
execute function public.set_updated_at();

create trigger trg_home_offering_features_updated_at
before update on public.home_offering_features
for each row
execute function public.set_updated_at();

create trigger trg_home_amenities_sections_updated_at
before update on public.home_amenities_sections
for each row
execute function public.set_updated_at();

create trigger trg_home_amenities_updated_at
before update on public.home_amenities
for each row
execute function public.set_updated_at();

create trigger trg_home_testimonials_sections_updated_at
before update on public.home_testimonials_sections
for each row
execute function public.set_updated_at();

create trigger trg_home_testimonials_updated_at
before update on public.home_testimonials
for each row
execute function public.set_updated_at();
