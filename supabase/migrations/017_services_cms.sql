-- CMS-backed Services page.

alter table public.page_seo
  drop constraint if exists page_seo_route_path_check;

alter table public.page_seo
  add constraint page_seo_route_path_check
  check (route_path in ('/', '/about', '/workspaces', '/services', '/faq', '/connect', '/privacy-policy'));

create table if not exists public.services_pages (
  page_key text primary key check (page_key = 'default'),
  badge_text text not null default 'Services',
  headline text not null default 'Workspace services built around how your team works.',
  intro_text text not null default 'Choose from flexible desks, private cabins, meeting rooms, virtual office support, and managed office solutions at Alley Workspace in Delhi, Rithala.',
  primary_cta_label text not null default 'Book a Tour',
  primary_cta_href text not null default '/connect',
  secondary_cta_label text not null default 'View Workspaces',
  secondary_cta_href text not null default '/workspaces',
  hero_image_asset_id uuid references public.media_assets(id) on delete set null,
  highlights jsonb not null default '["Flexible terms for individuals and teams", "Business-ready address and meeting support", "Professional workspace infrastructure in Delhi"]'::jsonb check (jsonb_typeof(highlights) = 'array'),
  services_badge_text text not null default 'What we provide',
  services_title text not null default 'Services for daily work, meetings, and business setup',
  services_intro_text text not null default 'Each service can be managed from the admin panel, including copy, image, feature bullets, icon, CTA, order, and visibility.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services_page_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_key text not null default 'building',
  image_asset_id uuid references public.media_assets(id) on delete set null,
  features jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  cta_label text not null default 'Enquire Now',
  cta_href text not null default '/connect',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_services_page_items_active_order
  on public.services_page_items (is_active, sort_order);

drop trigger if exists trg_services_pages_updated_at on public.services_pages;
create trigger trg_services_pages_updated_at
before update on public.services_pages
for each row execute function public.set_updated_at();

drop trigger if exists trg_services_page_items_updated_at on public.services_page_items;
create trigger trg_services_page_items_updated_at
before update on public.services_page_items
for each row execute function public.set_updated_at();

alter table public.services_pages enable row level security;
alter table public.services_page_items enable row level security;

drop policy if exists "public read services pages" on public.services_pages;
create policy "public read services pages"
on public.services_pages
for select using (true);

drop policy if exists "admin manage services pages" on public.services_pages;
create policy "admin manage services pages"
on public.services_pages
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active service items" on public.services_page_items;
create policy "public read active service items"
on public.services_page_items
for select using (is_active = true or public.is_admin());

drop policy if exists "admin manage service items" on public.services_page_items;
create policy "admin manage service items"
on public.services_page_items
for all using (public.is_admin()) with check (public.is_admin());

insert into public.services_pages (page_key)
values ('default')
on conflict (page_key) do nothing;

insert into public.page_seo (route_path, meta_title, meta_description)
values (
  '/services',
  'Services | Alley Workspace',
  'Explore Alley Workspace services, including coworking desks, private cabins, meeting rooms, virtual office support, and managed workspace solutions in Delhi.'
)
on conflict (route_path) do nothing;

update public.footer_links
set label = 'Services',
    href = '/services',
    group_key = 'sitemap'
where lower(label) in ('offerings', 'services');

insert into public.footer_links (group_key, label, href, sort_order, is_active)
select 'sitemap', 'Services', '/services', 10, true
where not exists (
  select 1 from public.footer_links where lower(label) = 'services'
);

with defaults(title, description, icon_key, features, cta_label, cta_href, sort_order) as (
  values
    (
      'Coworking Desks',
      'Flexible hot desk and dedicated desk access for focused daily work without long leases.',
      'laptop',
      '["Hot desk and dedicated desk options", "High-speed internet and shared amenities", "Useful for freelancers, founders, and small teams"]'::jsonb,
      'Enquire About Desks',
      '/connect?interest=coworking-desks',
      0
    ),
    (
      'Private Cabins',
      'Lockable private offices for teams that need privacy, stability, and a professional workspace.',
      'key',
      '["Cabins for small and growing teams", "Privacy for calls and focused work", "Managed workspace support included"]'::jsonb,
      'Enquire About Cabins',
      '/connect?interest=private-cabins',
      10
    ),
    (
      'Meeting Rooms',
      'Book professional rooms for client meetings, interviews, reviews, workshops, and team sessions.',
      'presentation',
      '["Suitable for meetings and interviews", "Professional setting for client discussions", "Flexible booking support"]'::jsonb,
      'Book a Meeting Room',
      '/connect?interest=meeting-rooms',
      20
    ),
    (
      'Virtual Office',
      'Use a business address and registration support without committing to a full-time physical office.',
      'map-pin',
      '["Business address support", "Helpful for remote and hybrid teams", "Registration-focused workspace service"]'::jsonb,
      'Enquire About Virtual Office',
      '/connect?interest=virtual-office',
      30
    ),
    (
      'Managed Office',
      'Custom workspace setup for teams that want a serviced office experience with operational support.',
      'building',
      '["Custom workspace planning", "Serviced office operations", "Designed for teams ready to scale"]'::jsonb,
      'Discuss Managed Office',
      '/connect?interest=managed-office',
      40
    )
)
insert into public.services_page_items (
  title,
  description,
  icon_key,
  features,
  cta_label,
  cta_href,
  sort_order
)
select
  d.title,
  d.description,
  d.icon_key,
  d.features,
  d.cta_label,
  d.cta_href,
  d.sort_order
from defaults d
where not exists (select 1 from public.services_page_items);
