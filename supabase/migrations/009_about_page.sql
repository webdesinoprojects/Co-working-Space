-- ============================================================
-- About Page CMS Schema
-- ============================================================

-- HERO SECTION -------------------------------------------------
create table if not exists public.about_hero_section (
  id          uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  headline    text not null default 'Premium workspace built for professionals who want clarity, speed, and a better workday.',
  subtext     text not null default 'Axion Spaces was built to make office decisions easier for founders, freelancers, and growing teams.',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 5 bento image slots for the hero (slot 1 = col-span-2 row-span-2, slots 2-5 = 1x1)
create table if not exists public.about_hero_images (
  id             uuid primary key default gen_random_uuid(),
  section_id     uuid not null references public.about_hero_section(id) on delete cascade,
  slot           integer not null check (slot between 1 and 5),
  image_asset_id uuid references public.media_assets(id) on delete set null,
  unique (section_id, slot),
  created_at     timestamptz not null default now()
);

-- THREE PILLARS SECTION ----------------------------------------
create table if not exists public.about_pillars_section (
  id          uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.about_pillar_cards (
  id          uuid primary key default gen_random_uuid(),
  section_id  uuid not null references public.about_pillars_section(id) on delete cascade,
  sort_order  integer not null default 0,
  icon_key    text not null default 'building-2',
  label       text not null default '',
  stat        text not null default '',
  description text not null default '',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- OUR STORY SECTION --------------------------------------------
create table if not exists public.about_story_section (
  id              uuid primary key default gen_random_uuid(),
  section_key     text not null unique default 'default',
  subheading      text not null default 'Our Story',
  heading         text not null default 'Built to make modern office decisions simpler',
  body_1          text not null default 'Axion Spaces started with a practical goal: create workspace experiences that feel professional, flexible, and easy to act on.',
  body_2          text not null default 'We know that for many businesses, choosing an office is not just about square footage.',
  body_3          text not null default 'That is why our approach blends clean infrastructure, managed amenities, quick response times, and a direct path from first inquiry to booking.',
  belief_1_title  text not null default 'What We Believe',
  belief_1_text   text not null default 'A workspace should remove friction, not add to it.',
  belief_2_title  text not null default 'What We Deliver',
  belief_2_text   text not null default 'Spaces that feel premium on day one.',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 4 image slots for story section grid
create table if not exists public.about_story_images (
  id             uuid primary key default gen_random_uuid(),
  section_id     uuid not null references public.about_story_section(id) on delete cascade,
  slot           integer not null check (slot between 1 and 4),
  image_asset_id uuid references public.media_assets(id) on delete set null,
  unique (section_id, slot),
  created_at     timestamptz not null default now()
);

-- CLIENT STORIES -----------------------------------------------
create table if not exists public.about_client_stories (
  id          uuid primary key default gen_random_uuid(),
  sort_order  integer not null default 0,
  tag         text not null default '',
  author      text not null default '',
  title       text not null default '',
  description text not null default '',
  icon_key    text not null default 'orbit',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- updated_at triggers ------------------------------------------
drop trigger if exists about_hero_section_updated_at on public.about_hero_section;
create trigger about_hero_section_updated_at
  before update on public.about_hero_section
  for each row execute function public.set_updated_at();

drop trigger if exists about_pillars_section_updated_at on public.about_pillars_section;
create trigger about_pillars_section_updated_at
  before update on public.about_pillars_section
  for each row execute function public.set_updated_at();

drop trigger if exists about_pillar_cards_updated_at on public.about_pillar_cards;
create trigger about_pillar_cards_updated_at
  before update on public.about_pillar_cards
  for each row execute function public.set_updated_at();

drop trigger if exists about_story_section_updated_at on public.about_story_section;
create trigger about_story_section_updated_at
  before update on public.about_story_section
  for each row execute function public.set_updated_at();

drop trigger if exists about_client_stories_updated_at on public.about_client_stories;
create trigger about_client_stories_updated_at
  before update on public.about_client_stories
  for each row execute function public.set_updated_at();

-- RLS ----------------------------------------------------------
alter table public.about_hero_section     enable row level security;
alter table public.about_hero_images      enable row level security;
alter table public.about_pillars_section  enable row level security;
alter table public.about_pillar_cards     enable row level security;
alter table public.about_story_section    enable row level security;
alter table public.about_story_images     enable row level security;
alter table public.about_client_stories   enable row level security;

create index if not exists idx_about_hero_images_section_slot
  on public.about_hero_images (section_id, slot);

create index if not exists idx_about_pillar_cards_section_sort
  on public.about_pillar_cards (section_id, sort_order);

create index if not exists idx_about_story_images_section_slot
  on public.about_story_images (section_id, slot);

create index if not exists idx_about_client_stories_sort
  on public.about_client_stories (sort_order);

-- Public read (all about content is published by default)
drop policy if exists "public_read_about_hero" on public.about_hero_section;
create policy "public_read_about_hero"      on public.about_hero_section     for select using (true);
drop policy if exists "public_read_hero_images" on public.about_hero_images;
create policy "public_read_hero_images"     on public.about_hero_images      for select using (true);
drop policy if exists "public_read_pillars" on public.about_pillars_section;
create policy "public_read_pillars"         on public.about_pillars_section  for select using (true);
drop policy if exists "public_read_pillar_cards" on public.about_pillar_cards;
create policy "public_read_pillar_cards"    on public.about_pillar_cards     for select using (is_active = true or public.is_admin());
drop policy if exists "public_read_story" on public.about_story_section;
create policy "public_read_story"           on public.about_story_section    for select using (true);
drop policy if exists "public_read_story_images" on public.about_story_images;
create policy "public_read_story_images"    on public.about_story_images     for select using (true);
drop policy if exists "public_read_client_stories" on public.about_client_stories;
create policy "public_read_client_stories"  on public.about_client_stories   for select using (is_active = true or public.is_admin());

-- Admin full access (service role bypasses RLS; browser JWT users must be active admins)
drop policy if exists "admin_all_about_hero" on public.about_hero_section;
create policy "admin_all_about_hero"      on public.about_hero_section     for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_all_hero_images" on public.about_hero_images;
create policy "admin_all_hero_images"     on public.about_hero_images      for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_all_pillars" on public.about_pillars_section;
create policy "admin_all_pillars"         on public.about_pillars_section  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_all_pillar_cards" on public.about_pillar_cards;
create policy "admin_all_pillar_cards"    on public.about_pillar_cards     for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_all_story" on public.about_story_section;
create policy "admin_all_story"           on public.about_story_section    for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_all_story_images" on public.about_story_images;
create policy "admin_all_story_images"    on public.about_story_images     for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_all_client_stories" on public.about_client_stories;
create policy "admin_all_client_stories"  on public.about_client_stories   for all using (public.is_admin()) with check (public.is_admin());

-- Seed default rows -------------------------------------------
insert into public.about_hero_section (section_key) values ('default')
on conflict (section_key) do nothing;
insert into public.about_pillars_section (section_key) values ('default')
on conflict (section_key) do nothing;
insert into public.about_story_section (section_key) values ('default')
on conflict (section_key) do nothing;

-- Default pillar cards
with sec as (select id from public.about_pillars_section where section_key = 'default')
insert into public.about_pillar_cards (section_id, sort_order, icon_key, label, stat, description)
select sec.id, s.sort_order, s.icon_key, s.label, s.stat, s.description
from sec, (values
  (0, 'building-2', 'Location',      'Noida & Delhi', 'Business-ready workspaces in strong commercial zones.'),
  (10,'zap',        'Move-in Speed', '24 Hours',       'A faster path from first conversation to operational office space.'),
  (20,'shield-check','Experience',   'Premium',        'Professional interiors, managed operations, and strong daily usability.')
) as s(sort_order, icon_key, label, stat, description)
where not exists (
  select 1 from public.about_pillar_cards c
  where c.section_id = sec.id and c.label = s.label
);

-- Default client stories
with defaults(sort_order, tag, author, title, description, icon_key) as (
  values
    (0,  'Team Growth',       'Startup Operations Team',  'Startup Team Finds Room to Grow',        'See how a fast-moving team gained flexibility, privacy, and a better client-facing setup.', 'orbit'),
    (10, 'Deep Work',         'Independent Consultant',   'Freelancers Finally Found Their Focus',   'A calmer workspace, reliable amenities, and a stronger routine made daily work smoother.', 'fingerprint'),
    (20, 'Meeting Ready',     'Business Services Team',   'Client Meetings Feel More Premium',       'Professional meeting rooms and a polished environment helped elevate every first impression.', 'gem'),
    (30, 'Daily Productivity','Sales & Support Team',     'The Daily Commute Became Worth It',       'Reliable internet, seamless access, and fewer distractions turned workdays into focused sessions.', 'radar'),
    (40, 'Collaboration',     'Creative Studio',          'Creative Teams Work Better Together',     'Open collaboration zones and flexible seating gave the team energy without losing structure.', 'aperture'),
    (50, 'Scaling Up',        'Growing Remote Team',      'From Home Office Chaos to Growth',        'Watch how Axion helped bring consistency, professionalism, and momentum back to work.', 'satellite')
)
insert into public.about_client_stories (sort_order, tag, author, title, description, icon_key)
select d.sort_order, d.tag, d.author, d.title, d.description, d.icon_key
from defaults d
where not exists (
  select 1 from public.about_client_stories s
  where s.title = d.title
);
