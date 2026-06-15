-- Dynamic Workspaces CMS:
-- - overview page content
-- - reusable workspace detail pages at /workspaces/[slug]
-- - seeded current four workspaces

create table if not exists public.workspace_overview_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Spaces',
  title text not null default 'Workspaces tailored for ambitious teams.',
  body_text text not null default 'From private suites to dedicated desks, discover environments engineered for focus, collaboration, and growth.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  nav_label text not null,
  card_title text not null,
  card_description text not null default '',
  overview_image_asset_id uuid references public.media_assets(id) on delete set null,
  hero_title text not null,
  hero_description text not null,
  cta_label text not null default 'Get started',
  cta_href text not null default '#contact',
  video_label text not null default 'Watch video',
  video_href text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default true,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_hero_images (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  slot integer not null check (slot between 1 and 3),
  image_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (workspace_id, slot)
);

create table if not exists public.workspace_stats (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  value text not null,
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_gallery_images (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  sort_order integer not null default 0,
  image_asset_id uuid references public.media_assets(id) on delete set null,
  caption text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_marquee_bands (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  reverse boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_marquee_items (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references public.workspace_marquee_bands(id) on delete cascade,
  item_text text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_amenities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  icon_key text not null default 'wifi',
  label text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_plan_sections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  badge_text text not null default 'Offerings',
  title text not null default 'Workspace Plans',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_plans (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.workspace_plan_sections(id) on delete cascade,
  title text not null,
  icon_key text not null default 'briefcase',
  price_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_plan_features (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.workspace_plans(id) on delete cascade,
  feature_text text not null,
  is_included boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workspaces_active_sort on public.workspaces (is_active, sort_order);
create index if not exists idx_workspace_stats_workspace_sort on public.workspace_stats (workspace_id, sort_order);
create index if not exists idx_workspace_gallery_workspace_sort on public.workspace_gallery_images (workspace_id, sort_order);
create index if not exists idx_workspace_marquee_bands_workspace_sort on public.workspace_marquee_bands (workspace_id, sort_order);
create index if not exists idx_workspace_marquee_items_band_sort on public.workspace_marquee_items (band_id, sort_order);
create index if not exists idx_workspace_amenities_workspace_sort on public.workspace_amenities (workspace_id, sort_order);
create index if not exists idx_workspace_plans_section_sort on public.workspace_plans (section_id, sort_order);
create index if not exists idx_workspace_plan_features_plan_sort on public.workspace_plan_features (plan_id, sort_order);

drop trigger if exists trg_workspace_overview_sections_updated_at on public.workspace_overview_sections;
create trigger trg_workspace_overview_sections_updated_at
before update on public.workspace_overview_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_stats_updated_at on public.workspace_stats;
create trigger trg_workspace_stats_updated_at
before update on public.workspace_stats
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_gallery_images_updated_at on public.workspace_gallery_images;
create trigger trg_workspace_gallery_images_updated_at
before update on public.workspace_gallery_images
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_marquee_bands_updated_at on public.workspace_marquee_bands;
create trigger trg_workspace_marquee_bands_updated_at
before update on public.workspace_marquee_bands
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_marquee_items_updated_at on public.workspace_marquee_items;
create trigger trg_workspace_marquee_items_updated_at
before update on public.workspace_marquee_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_amenities_updated_at on public.workspace_amenities;
create trigger trg_workspace_amenities_updated_at
before update on public.workspace_amenities
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_plan_sections_updated_at on public.workspace_plan_sections;
create trigger trg_workspace_plan_sections_updated_at
before update on public.workspace_plan_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_plans_updated_at on public.workspace_plans;
create trigger trg_workspace_plans_updated_at
before update on public.workspace_plans
for each row execute function public.set_updated_at();

drop trigger if exists trg_workspace_plan_features_updated_at on public.workspace_plan_features;
create trigger trg_workspace_plan_features_updated_at
before update on public.workspace_plan_features
for each row execute function public.set_updated_at();

alter table public.workspace_overview_sections enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_hero_images enable row level security;
alter table public.workspace_stats enable row level security;
alter table public.workspace_gallery_images enable row level security;
alter table public.workspace_marquee_bands enable row level security;
alter table public.workspace_marquee_items enable row level security;
alter table public.workspace_amenities enable row level security;
alter table public.workspace_plan_sections enable row level security;
alter table public.workspace_plans enable row level security;
alter table public.workspace_plan_features enable row level security;

drop policy if exists "public read workspace overview" on public.workspace_overview_sections;
create policy "public read workspace overview" on public.workspace_overview_sections
for select using (true);
drop policy if exists "admin manage workspace overview" on public.workspace_overview_sections;
create policy "admin manage workspace overview" on public.workspace_overview_sections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active workspaces" on public.workspaces;
create policy "public read active workspaces" on public.workspaces
for select using (is_active = true or public.is_admin());
drop policy if exists "admin manage workspaces" on public.workspaces;
create policy "admin manage workspaces" on public.workspaces
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace hero images" on public.workspace_hero_images;
create policy "public read workspace hero images" on public.workspace_hero_images
for select using (
  public.is_admin()
  or exists (select 1 from public.workspaces w where w.id = workspace_id and w.is_active = true)
);
drop policy if exists "admin manage workspace hero images" on public.workspace_hero_images;
create policy "admin manage workspace hero images" on public.workspace_hero_images
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace stats" on public.workspace_stats;
create policy "public read workspace stats" on public.workspace_stats
for select using (
  public.is_admin()
  or (is_active = true and exists (select 1 from public.workspaces w where w.id = workspace_id and w.is_active = true))
);
drop policy if exists "admin manage workspace stats" on public.workspace_stats;
create policy "admin manage workspace stats" on public.workspace_stats
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace gallery" on public.workspace_gallery_images;
create policy "public read workspace gallery" on public.workspace_gallery_images
for select using (
  public.is_admin()
  or (is_active = true and exists (select 1 from public.workspaces w where w.id = workspace_id and w.is_active = true))
);
drop policy if exists "admin manage workspace gallery" on public.workspace_gallery_images;
create policy "admin manage workspace gallery" on public.workspace_gallery_images
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace marquee bands" on public.workspace_marquee_bands;
create policy "public read workspace marquee bands" on public.workspace_marquee_bands
for select using (
  public.is_admin()
  or (is_active = true and exists (select 1 from public.workspaces w where w.id = workspace_id and w.is_active = true))
);
drop policy if exists "admin manage workspace marquee bands" on public.workspace_marquee_bands;
create policy "admin manage workspace marquee bands" on public.workspace_marquee_bands
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace marquee items" on public.workspace_marquee_items;
create policy "public read workspace marquee items" on public.workspace_marquee_items
for select using (
  public.is_admin()
  or (is_active = true and exists (
    select 1
    from public.workspace_marquee_bands b
    join public.workspaces w on w.id = b.workspace_id
    where b.id = band_id and b.is_active = true and w.is_active = true
  ))
);
drop policy if exists "admin manage workspace marquee items" on public.workspace_marquee_items;
create policy "admin manage workspace marquee items" on public.workspace_marquee_items
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace amenities" on public.workspace_amenities;
create policy "public read workspace amenities" on public.workspace_amenities
for select using (
  public.is_admin()
  or (is_active = true and exists (select 1 from public.workspaces w where w.id = workspace_id and w.is_active = true))
);
drop policy if exists "admin manage workspace amenities" on public.workspace_amenities;
create policy "admin manage workspace amenities" on public.workspace_amenities
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace plan sections" on public.workspace_plan_sections;
create policy "public read workspace plan sections" on public.workspace_plan_sections
for select using (
  public.is_admin()
  or exists (select 1 from public.workspaces w where w.id = workspace_id and w.is_active = true)
);
drop policy if exists "admin manage workspace plan sections" on public.workspace_plan_sections;
create policy "admin manage workspace plan sections" on public.workspace_plan_sections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace plans" on public.workspace_plans;
create policy "public read workspace plans" on public.workspace_plans
for select using (
  public.is_admin()
  or (is_active = true and exists (
    select 1
    from public.workspace_plan_sections s
    join public.workspaces w on w.id = s.workspace_id
    where s.id = section_id and w.is_active = true
  ))
);
drop policy if exists "admin manage workspace plans" on public.workspace_plans;
create policy "admin manage workspace plans" on public.workspace_plans
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read workspace plan features" on public.workspace_plan_features;
create policy "public read workspace plan features" on public.workspace_plan_features
for select using (
  public.is_admin()
  or exists (
    select 1
    from public.workspace_plans p
    join public.workspace_plan_sections s on s.id = p.section_id
    join public.workspaces w on w.id = s.workspace_id
    where p.id = plan_id and p.is_active = true and w.is_active = true
  )
);
drop policy if exists "admin manage workspace plan features" on public.workspace_plan_features;
create policy "admin manage workspace plan features" on public.workspace_plan_features
for all using (public.is_admin()) with check (public.is_admin());

insert into public.workspace_overview_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

with defaults(slug, nav_label, card_title, card_description, hero_title, hero_description, sort_order, meta_title, meta_description) as (
  values
    ('dedicated-desks', 'Dedicated Desks', 'Dedicated Desks', 'Reserved desks with storage, ergonomic seating, and premium shared amenities.', 'Your personal desk in a shared space.', 'Enjoy the perfect balance of community and focus. A dedicated desk gives you a reserved workspace with lockable storage, ergonomic seating, and access to all premium amenities. Ideal for freelancers and remote workers.', 0, 'Dedicated Desks', 'Reserved desks with premium amenities for freelancers and remote workers.'),
    ('private-cabins', 'Private Cabins', 'Private Cabins', 'Secure furnished suites for focused teams that need privacy and scale.', 'Private suites for focused teams.', 'Fully furnished, secure offices designed for teams of 2 to 50. Skip the hassle of traditional leasing and move into a managed space with soundproof walls, enterprise-grade IT, and custom branding options.', 10, 'Private Cabins', 'Fully managed private office suites for teams of 2 to 50.'),
    ('meeting-rooms', 'Meeting Rooms', 'Meeting Rooms', 'Professional meeting rooms built for pitches, workshops, and client calls.', 'Pitch, present, and collaborate clearly.', 'Book professional meeting spaces by the hour. Equipped with massive 4K displays, crystal-clear video conferencing setups, and endless coffee to keep your team and clients energized.', 20, 'Meeting Rooms', 'Hourly meeting rooms with displays, video conferencing, and support.'),
    ('virtual-office', 'Virtual Office', 'Virtual Office', 'A premium business address, mail handling, and registration support.', 'A premium address for your business.', 'Establish a professional presence instantly. Get a prime commercial business address, dedicated mail handling, and professional call answering services without the overhead of a physical space.', 30, 'Virtual Office', 'Premium business address, mail handling, and virtual office support.')
)
insert into public.workspaces (
  slug, nav_label, card_title, card_description, hero_title, hero_description, sort_order, meta_title, meta_description
)
select slug, nav_label, card_title, card_description, hero_title, hero_description, sort_order, meta_title, meta_description
from defaults
on conflict (slug) do nothing;

with defaults(slug, value, label, sort_order) as (
  values
    ('dedicated-desks', '24/7', 'Access', 0), ('dedicated-desks', '500+', 'Desks available', 10), ('dedicated-desks', '1GB', 'Fiber Internet', 20), ('dedicated-desks', 'Free', 'Meeting Credits', 30),
    ('private-cabins', '160+', 'Private Cabins', 0), ('private-cabins', '0', 'Setup costs', 10), ('private-cabins', '100%', 'Secure & private', 20), ('private-cabins', 'Custom', 'Layout options', 30),
    ('meeting-rooms', '600+', 'Meeting rooms', 0), ('meeting-rooms', '4K', 'Presentations', 10), ('meeting-rooms', 'Zero', 'Buffering', 20), ('meeting-rooms', '24h', 'Support team', 30),
    ('virtual-office', '50+', 'Prime Addresses', 0), ('virtual-office', 'Daily', 'Mail handling', 10), ('virtual-office', 'GST', 'Registration ready', 20), ('virtual-office', '100%', 'Professional image', 30)
)
insert into public.workspace_stats (workspace_id, value, label, sort_order)
select w.id, d.value, d.label, d.sort_order
from defaults d
join public.workspaces w on w.slug = d.slug
where not exists (
  select 1 from public.workspace_stats s
  where s.workspace_id = w.id and s.label = d.label
);

with defaults(slug, title) as (
  values
    ('dedicated-desks', 'Open Seating Plans'),
    ('private-cabins', 'Private Cabin Plans'),
    ('meeting-rooms', 'Meeting Space Plans'),
    ('virtual-office', 'Virtual Office Plans')
)
insert into public.workspace_plan_sections (workspace_id, title)
select w.id, d.title
from defaults d
join public.workspaces w on w.slug = d.slug
on conflict (workspace_id) do nothing;

with defaults(slug, title, icon_key, price_text, sort_order) as (
  values
    ('dedicated-desks', 'Day Pass', 'user', 'Rs 500 / day', 0),
    ('dedicated-desks', 'Hot Desk', 'laptop', 'Rs 5,000 / month', 10),
    ('dedicated-desks', 'Dedicated Desk', 'monitor', 'Rs 6,500 / month', 20),
    ('private-cabins', '4-6 Seater Cabin', 'briefcase', 'Rs 25,000 / month', 0),
    ('private-cabins', '10-20 Seater Suite', 'users', 'Custom Pricing', 10),
    ('private-cabins', 'Custom Floor Plan', 'building', 'Quote on Request', 20),
    ('meeting-rooms', '4-Seater Room', 'users', 'Rs 500 / hour', 0),
    ('meeting-rooms', '10-Seater Boardroom', 'presentation', 'Rs 1,200 / hour', 10),
    ('meeting-rooms', 'Full-Day Workshop', 'monitor', 'Quote on Request', 20),
    ('virtual-office', 'Business Address', 'building', 'Rs 15,000 / year', 0),
    ('virtual-office', 'GST Registration', 'shield-check', 'Rs 25,000 / year', 10),
    ('virtual-office', 'Premium Virtual Office', 'briefcase', 'Rs 45,000 / year', 20)
)
insert into public.workspace_plans (section_id, title, icon_key, price_text, sort_order)
select s.id, d.title, d.icon_key, d.price_text, d.sort_order
from defaults d
join public.workspaces w on w.slug = d.slug
join public.workspace_plan_sections s on s.workspace_id = w.id
where not exists (
  select 1 from public.workspace_plans p
  where p.section_id = s.id and p.title = d.title
);

with defaults(plan_title, feature_text, is_included, sort_order) as (
  values
    ('Day Pass', 'High Speed Internet', true, 0), ('Day Pass', 'Open Seating', true, 10), ('Day Pass', 'Free Coffee', true, 20), ('Day Pass', 'Meeting Room Credits', false, 30),
    ('Hot Desk', 'High Speed Internet', true, 0), ('Hot Desk', 'Flexible Seating', true, 10), ('Hot Desk', 'Printer Access', true, 20), ('Hot Desk', 'Meeting Room Credits', false, 30),
    ('Dedicated Desk', 'High Speed Internet', true, 0), ('Dedicated Desk', 'Reserved Desk & Locker', true, 10), ('Dedicated Desk', 'Printer Access', true, 20), ('Dedicated Desk', 'Meeting Room Credits', true, 30),
    ('4-6 Seater Cabin', 'Fully Furnished', true, 0), ('4-6 Seater Cabin', 'Dedicated IT Support', true, 10), ('4-6 Seater Cabin', 'Meeting Room Credits', true, 20), ('4-6 Seater Cabin', 'Custom Branding', false, 30),
    ('10-20 Seater Suite', 'Fully Furnished', true, 0), ('10-20 Seater Suite', 'Dedicated IT Support', true, 10), ('10-20 Seater Suite', 'Meeting Room Credits', true, 20), ('10-20 Seater Suite', 'Custom Branding', true, 30),
    ('Custom Floor Plan', 'Build to Suit', true, 0), ('Custom Floor Plan', 'Private Network', true, 10), ('Custom Floor Plan', 'Dedicated Manager', true, 20), ('Custom Floor Plan', 'Private Pantry', true, 30),
    ('4-Seater Room', '4K Display', true, 0), ('4-Seater Room', 'High Speed Internet', true, 10), ('4-Seater Room', 'Whiteboard', true, 20), ('4-Seater Room', 'Video Conferencing', false, 30),
    ('10-Seater Boardroom', '85" 4K Display', true, 0), ('10-Seater Boardroom', 'High Speed Internet', true, 10), ('10-Seater Boardroom', 'Video Conferencing', true, 20), ('10-Seater Boardroom', 'Premium Coffee', true, 30),
    ('Full-Day Workshop', 'Exclusive Room Access', true, 0), ('Full-Day Workshop', 'Custom Layouts', true, 10), ('Full-Day Workshop', 'Dedicated Tech Support', true, 20), ('Full-Day Workshop', 'Full Catering Service', true, 30),
    ('Business Address', 'Premium Office Address', true, 0), ('Business Address', 'Mail & Package Handling', true, 10), ('Business Address', 'GST Registration Support', false, 20), ('Business Address', 'Meeting Room Access', false, 30),
    ('GST Registration', 'Premium Office Address', true, 0), ('GST Registration', 'Mail & Package Handling', true, 10), ('GST Registration', 'GST Registration Support', true, 20), ('GST Registration', 'Meeting Room Credits', false, 30),
    ('Premium Virtual Office', 'Premium Office Address', true, 0), ('Premium Virtual Office', 'Mail & Package Handling', true, 10), ('Premium Virtual Office', 'GST Registration Support', true, 20), ('Premium Virtual Office', 'Monthly Meeting Credits', true, 30)
)
insert into public.workspace_plan_features (plan_id, feature_text, is_included, sort_order)
select p.id, d.feature_text, d.is_included, d.sort_order
from defaults d
join public.workspace_plans p on p.title = d.plan_title
join public.workspace_plan_sections s on s.id = p.section_id
join public.workspaces w on w.id = s.workspace_id
where w.slug in ('dedicated-desks', 'private-cabins', 'meeting-rooms', 'virtual-office')
  and not exists (
    select 1 from public.workspace_plan_features f
    where f.plan_id = p.id and f.feature_text = d.feature_text
  );

with defaults(slug, band_order, theme, reverse, item_text, item_order) as (
  values
    ('dedicated-desks', 0, 'light', false, 'High Speed WiFi', 0), ('dedicated-desks', 0, 'light', false, 'Ergonomic Chairs', 10), ('dedicated-desks', 0, 'light', false, '24/7 Access', 20), ('dedicated-desks', 0, 'light', false, 'Premium Coffee', 30), ('dedicated-desks', 0, 'light', false, 'Printing Services', 40), ('dedicated-desks', 0, 'light', false, 'Community Events', 50),
    ('dedicated-desks', 10, 'dark', true, 'Trusted by Startups', 0), ('dedicated-desks', 10, 'dark', true, 'Ideal for Freelancers', 10), ('dedicated-desks', 10, 'dark', true, 'Remote Workers', 20), ('dedicated-desks', 10, 'dark', true, 'Digital Nomads', 30), ('dedicated-desks', 10, 'dark', true, 'Creative Agencies', 40),
    ('private-cabins', 0, 'light', false, 'Soundproof Walls', 0), ('private-cabins', 0, 'light', false, 'Biometric Access', 10), ('private-cabins', 0, 'light', false, '24/7 Security', 20), ('private-cabins', 0, 'light', false, 'Custom Branding', 30), ('private-cabins', 0, 'light', false, 'Dedicated IT', 40), ('private-cabins', 0, 'light', false, 'Private Pantry', 50),
    ('private-cabins', 10, 'dark', true, 'Built for Teams', 0), ('private-cabins', 10, 'dark', true, 'Enterprise Grade', 10), ('private-cabins', 10, 'dark', true, 'Scalable Growth', 20), ('private-cabins', 10, 'dark', true, 'Fully Managed', 30), ('private-cabins', 10, 'dark', true, 'Zero Setup Cost', 40),
    ('meeting-rooms', 0, 'light', false, '4K Smart TVs', 0), ('meeting-rooms', 0, 'light', false, 'Video Conferencing', 10), ('meeting-rooms', 0, 'light', false, 'High-Speed WiFi', 20), ('meeting-rooms', 0, 'light', false, 'Catering on Demand', 30), ('meeting-rooms', 0, 'light', false, 'Whiteboards', 40), ('meeting-rooms', 0, 'light', false, 'Reception Service', 50),
    ('meeting-rooms', 10, 'dark', true, 'Pitch Perfectly', 0), ('meeting-rooms', 10, 'dark', true, 'Seamless Video Calls', 10), ('meeting-rooms', 10, 'dark', true, 'Hourly Booking', 20), ('meeting-rooms', 10, 'dark', true, 'Impress Clients', 30), ('meeting-rooms', 10, 'dark', true, 'Endless Coffee', 40),
    ('virtual-office', 0, 'light', false, 'Premium Address', 0), ('virtual-office', 0, 'light', false, 'Mail Handling', 10), ('virtual-office', 0, 'light', false, 'Dedicated Phone No.', 20), ('virtual-office', 0, 'light', false, 'Call Forwarding', 30), ('virtual-office', 0, 'light', false, 'Meeting Room Credits', 40), ('virtual-office', 0, 'light', false, 'GST Registration', 50),
    ('virtual-office', 10, 'dark', true, 'Zero Overhead', 0), ('virtual-office', 10, 'dark', true, 'Professional Image', 10), ('virtual-office', 10, 'dark', true, 'Instant Setup', 20), ('virtual-office', 10, 'dark', true, 'Prime Locations', 30), ('virtual-office', 10, 'dark', true, 'Business Support', 40)
)
insert into public.workspace_marquee_bands (workspace_id, theme, reverse, sort_order)
select distinct w.id, d.theme, d.reverse, d.band_order
from defaults d
join public.workspaces w on w.slug = d.slug
where not exists (
  select 1 from public.workspace_marquee_bands b
  where b.workspace_id = w.id and b.sort_order = d.band_order
);

with defaults(slug, band_order, theme, reverse, item_text, item_order) as (
  values
    ('dedicated-desks', 0, 'light', false, 'High Speed WiFi', 0), ('dedicated-desks', 0, 'light', false, 'Ergonomic Chairs', 10), ('dedicated-desks', 0, 'light', false, '24/7 Access', 20), ('dedicated-desks', 0, 'light', false, 'Premium Coffee', 30), ('dedicated-desks', 0, 'light', false, 'Printing Services', 40), ('dedicated-desks', 0, 'light', false, 'Community Events', 50),
    ('dedicated-desks', 10, 'dark', true, 'Trusted by Startups', 0), ('dedicated-desks', 10, 'dark', true, 'Ideal for Freelancers', 10), ('dedicated-desks', 10, 'dark', true, 'Remote Workers', 20), ('dedicated-desks', 10, 'dark', true, 'Digital Nomads', 30), ('dedicated-desks', 10, 'dark', true, 'Creative Agencies', 40),
    ('private-cabins', 0, 'light', false, 'Soundproof Walls', 0), ('private-cabins', 0, 'light', false, 'Biometric Access', 10), ('private-cabins', 0, 'light', false, '24/7 Security', 20), ('private-cabins', 0, 'light', false, 'Custom Branding', 30), ('private-cabins', 0, 'light', false, 'Dedicated IT', 40), ('private-cabins', 0, 'light', false, 'Private Pantry', 50),
    ('private-cabins', 10, 'dark', true, 'Built for Teams', 0), ('private-cabins', 10, 'dark', true, 'Enterprise Grade', 10), ('private-cabins', 10, 'dark', true, 'Scalable Growth', 20), ('private-cabins', 10, 'dark', true, 'Fully Managed', 30), ('private-cabins', 10, 'dark', true, 'Zero Setup Cost', 40),
    ('meeting-rooms', 0, 'light', false, '4K Smart TVs', 0), ('meeting-rooms', 0, 'light', false, 'Video Conferencing', 10), ('meeting-rooms', 0, 'light', false, 'High-Speed WiFi', 20), ('meeting-rooms', 0, 'light', false, 'Catering on Demand', 30), ('meeting-rooms', 0, 'light', false, 'Whiteboards', 40), ('meeting-rooms', 0, 'light', false, 'Reception Service', 50),
    ('meeting-rooms', 10, 'dark', true, 'Pitch Perfectly', 0), ('meeting-rooms', 10, 'dark', true, 'Seamless Video Calls', 10), ('meeting-rooms', 10, 'dark', true, 'Hourly Booking', 20), ('meeting-rooms', 10, 'dark', true, 'Impress Clients', 30), ('meeting-rooms', 10, 'dark', true, 'Endless Coffee', 40),
    ('virtual-office', 0, 'light', false, 'Premium Address', 0), ('virtual-office', 0, 'light', false, 'Mail Handling', 10), ('virtual-office', 0, 'light', false, 'Dedicated Phone No.', 20), ('virtual-office', 0, 'light', false, 'Call Forwarding', 30), ('virtual-office', 0, 'light', false, 'Meeting Room Credits', 40), ('virtual-office', 0, 'light', false, 'GST Registration', 50),
    ('virtual-office', 10, 'dark', true, 'Zero Overhead', 0), ('virtual-office', 10, 'dark', true, 'Professional Image', 10), ('virtual-office', 10, 'dark', true, 'Instant Setup', 20), ('virtual-office', 10, 'dark', true, 'Prime Locations', 30), ('virtual-office', 10, 'dark', true, 'Business Support', 40)
)
insert into public.workspace_marquee_items (band_id, item_text, sort_order)
select b.id, d.item_text, d.item_order
from defaults d
join public.workspaces w on w.slug = d.slug
join public.workspace_marquee_bands b on b.workspace_id = w.id and b.sort_order = d.band_order
where not exists (
  select 1 from public.workspace_marquee_items i
  where i.band_id = b.id and i.item_text = d.item_text
);

with defaults(slug, icon_key, label, sort_order) as (
  values
    ('dedicated-desks', 'wifi', 'High Speed Internet', 0), ('dedicated-desks', 'armchair', 'Lockable Storage', 10), ('dedicated-desks', 'armchair', 'Ergonomic Chair', 20), ('dedicated-desks', 'coffee', 'Free Coffee & Tea', 30), ('dedicated-desks', 'printer', 'Printer/Scanner', 40), ('dedicated-desks', 'zap', 'Power Backup', 50),
    ('private-cabins', 'door-open', 'Soundproof Walls', 0), ('private-cabins', 'building', 'Custom Branding', 10), ('private-cabins', 'zap', 'Dedicated LAN', 20), ('private-cabins', 'shield-check', 'Biometric Access', 30), ('private-cabins', 'shield-check', '24/7 Security', 40), ('private-cabins', 'users', 'Community Manager', 50),
    ('meeting-rooms', 'monitor', '4K Smart TV', 0), ('meeting-rooms', 'video', 'Video Conferencing', 10), ('meeting-rooms', 'wifi', 'High-Speed WiFi', 20), ('meeting-rooms', 'coffee', 'Catering on Demand', 30), ('meeting-rooms', 'presentation', 'Whiteboard', 40), ('meeting-rooms', 'users', 'Reception Service', 50),
    ('virtual-office', 'building', 'Premium Address', 0), ('virtual-office', 'briefcase', 'Mail Handling', 10), ('virtual-office', 'phone', 'Dedicated Phone No.', 20), ('virtual-office', 'phone', 'Call Forwarding', 30), ('virtual-office', 'monitor', 'Meeting Room Credits', 40), ('virtual-office', 'shield-check', 'GST Registration', 50)
)
insert into public.workspace_amenities (workspace_id, icon_key, label, sort_order)
select w.id, d.icon_key, d.label, d.sort_order
from defaults d
join public.workspaces w on w.slug = d.slug
where not exists (
  select 1 from public.workspace_amenities a
  where a.workspace_id = w.id and a.label = d.label
);
