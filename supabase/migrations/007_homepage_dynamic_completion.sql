-- Completes the homepage CMS surface:
-- - dynamic Why Choose Us section/cards
-- - dynamic Contact section text/form labels
-- - dynamic Footer sitemap links
-- - default rows for list-based sections so admin and frontend start in sync

create table if not exists public.home_why_choose_us_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Our Core Value',
  title text not null default 'Why Should You Choose Axion?',
  body_text text not null default $cms$Because Axion, Is A Place your Ideas deserve..!! a simple question with a simple answer well if your are reading let us tell you more about these big lines we say.. An incubator, A lab of innovations, start-up friendly community, Axion, has many faces to get described. Axion is a archetypical ecosystem, providing essential resources and hard support to the birthing start-ups. Axion is truly a birthing suite for start-ups, turning expectations into reality.$cms$,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_why_choose_us_cards (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.home_why_choose_us_sections(id) on delete cascade,
  title text not null,
  description text not null,
  animation_key text not null default 'rolling-track' check (animation_key in ('rolling-track', 'isometric-cube', 'rising-graph', 'ripple')),
  theme text not null default 'light' check (theme in ('light', 'dark')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_contact_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Get in Touch',
  title text not null default 'Let''s discuss your workspace needs.',
  body_text text not null default 'Whether you need a dedicated desk for your startup or a custom headquarters for your enterprise, we have the perfect solution.',
  phone_label text not null default 'Call Us',
  phone_value text not null default '+91 98765 43210',
  email_label text not null default 'Email Us',
  email_value text not null default 'hello@axionspaces.com',
  full_name_placeholder text not null default 'Full Name',
  email_placeholder text not null default 'E-mail',
  phone_placeholder text not null default 'Contact Number',
  interest_placeholder text not null default 'Interested In',
  message_placeholder text not null default 'Message',
  submit_label text not null default 'Contact Us',
  sending_label text not null default 'Sending...',
  success_title text not null default 'Message sent!',
  success_body text not null default 'Thank you for reaching out. Our team will get back to you shortly.',
  send_another_label text not null default 'Send another message',
  source_path text not null default '/',
  interest_options jsonb not null default '[{"label":"Private Office","value":"private-office"},{"label":"Dedicated Desk","value":"dedicated-desk"},{"label":"Hot Desk","value":"hot-desk"},{"label":"Meeting Room","value":"meeting-room"}]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.footer_links (
  id uuid primary key default gen_random_uuid(),
  group_key text not null default 'sitemap',
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.home_why_choose_us_sections enable row level security;
alter table public.home_why_choose_us_cards enable row level security;
alter table public.home_contact_sections enable row level security;
alter table public.footer_links enable row level security;

create index if not exists idx_home_why_choose_us_cards_section_sort
  on public.home_why_choose_us_cards (section_id, sort_order);

create index if not exists idx_footer_links_group_sort
  on public.footer_links (group_key, sort_order);

drop trigger if exists trg_home_why_choose_us_sections_updated_at on public.home_why_choose_us_sections;
create trigger trg_home_why_choose_us_sections_updated_at
before update on public.home_why_choose_us_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_home_why_choose_us_cards_updated_at on public.home_why_choose_us_cards;
create trigger trg_home_why_choose_us_cards_updated_at
before update on public.home_why_choose_us_cards
for each row execute function public.set_updated_at();

drop trigger if exists trg_home_contact_sections_updated_at on public.home_contact_sections;
create trigger trg_home_contact_sections_updated_at
before update on public.home_contact_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_footer_links_updated_at on public.footer_links;
create trigger trg_footer_links_updated_at
before update on public.footer_links
for each row execute function public.set_updated_at();

drop policy if exists "public can read home why choose us sections" on public.home_why_choose_us_sections;
create policy "public can read home why choose us sections"
on public.home_why_choose_us_sections
for select using (true);

drop policy if exists "admins can manage home why choose us sections" on public.home_why_choose_us_sections;
create policy "admins can manage home why choose us sections"
on public.home_why_choose_us_sections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read home why choose us cards" on public.home_why_choose_us_cards;
create policy "public can read home why choose us cards"
on public.home_why_choose_us_cards
for select using (is_active = true or public.is_admin());

drop policy if exists "admins can manage home why choose us cards" on public.home_why_choose_us_cards;
create policy "admins can manage home why choose us cards"
on public.home_why_choose_us_cards
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read home contact sections" on public.home_contact_sections;
create policy "public can read home contact sections"
on public.home_contact_sections
for select using (true);

drop policy if exists "admins can manage home contact sections" on public.home_contact_sections;
create policy "admins can manage home contact sections"
on public.home_contact_sections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can read footer links" on public.footer_links;
create policy "public can read footer links"
on public.footer_links
for select using (is_active = true or public.is_admin());

drop policy if exists "admins can manage footer links" on public.footer_links;
create policy "admins can manage footer links"
on public.footer_links
for all using (public.is_admin()) with check (public.is_admin());

insert into public.home_why_choose_us_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.home_contact_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

-- Growing Network defaults
with section as (
  select id from public.home_locations_sections where section_key = 'default'
),
defaults(layout_slot, location_name, subtitle, sort_order) as (
  values
    (1, 'Delhi, Rithala', 'Flagship Hub', 0),
    (2, 'Delhi, Rithala', 'Tech Park', 10),
    (3, 'Delhi, Rithala', 'City Center', 20),
    (4, 'Delhi, Rithala', 'Innovation Lab', 30),
    (5, 'Delhi, Rithala', 'Cyber City', 40),
    (6, 'Delhi, Rithala', 'Coastal Hub', 50)
)
insert into public.home_location_cards (
  section_id, layout_slot, location_name, subtitle,
  hover_visit_label, hover_visit_href,
  hover_meeting_label, hover_meeting_href,
  hover_space_label, hover_space_href,
  sort_order, is_active
)
select
  section.id, d.layout_slot, d.location_name, d.subtitle,
  'Request a Visit', '/connect',
  'Book Meeting Room', '/workspaces/meeting-rooms',
  'Book Your Space', '/workspaces',
  d.sort_order, true
from section
cross join defaults d
where not exists (
  select 1 from public.home_location_cards c
  where c.section_id = section.id and c.layout_slot = d.layout_slot
);

-- Membership defaults
with section as (
  select id from public.home_membership_sections where section_key = 'default'
),
defaults(title, description, price_text, cta_label, highlight_badge_text, is_featured, sort_order) as (
  values
    ('Hot Desk', 'Flexible access to any open desk.', 'Rs. 250/mo', 'Select Plan', null::text, false, 0),
    ('Dedicated Desk', 'Your own permanent desk setup.', 'Rs. 400/mo', 'Select Plan', 'Most Popular', true, 10),
    ('Private Office', 'Secure space for teams of 2-50.', 'From Rs. 900/mo', 'Contact Us', null::text, false, 20)
)
insert into public.home_membership_plans (
  section_id, title, description, price_text, cta_label,
  highlight_badge_text, is_featured, sort_order, is_active
)
select section.id, d.title, d.description, d.price_text, d.cta_label, d.highlight_badge_text, d.is_featured, d.sort_order, true
from section
cross join defaults d
where not exists (
  select 1 from public.home_membership_plans p
  where p.section_id = section.id and p.title = d.title
);

with features(plan_title, feature_text, sort_order) as (
  values
    ('Hot Desk', 'Access during business hours', 0),
    ('Hot Desk', 'Ultra-fast WiFi', 10),
    ('Hot Desk', 'Specialty coffee & tea', 20),
    ('Dedicated Desk', '24/7 building access', 0),
    ('Dedicated Desk', 'Ergonomic chair & locking cabinet', 10),
    ('Dedicated Desk', 'Mail & package handling', 20),
    ('Dedicated Desk', '5 meeting room credits/mo', 30),
    ('Private Office', 'Everything in Dedicated', 0),
    ('Private Office', 'Fully furnished & branded', 10),
    ('Private Office', 'Priority IT support', 20)
)
insert into public.home_membership_plan_features (plan_id, feature_text, sort_order)
select p.id, f.feature_text, f.sort_order
from features f
join public.home_membership_plans p on p.title = f.plan_title
join public.home_membership_sections s on s.id = p.section_id and s.section_key = 'default'
where not exists (
  select 1 from public.home_membership_plan_features existing
  where existing.plan_id = p.id and existing.feature_text = f.feature_text
);

-- Offerings defaults
with section as (
  select id from public.home_offerings_sections where section_key = 'default'
),
defaults(title, icon_key, sort_order) as (
  values
    ('Day Pass', 'user', 0),
    ('Hot Desk', 'laptop', 10),
    ('Dedicated Desk', 'monitor', 20),
    ('4-6 Seaters with Boss Cabin', 'briefcase', 30),
    ('2-20 Seaters Cabin', 'users', 40),
    ('Quote on Request Custom Office Space', 'building', 50),
    ('Meeting Room', 'presentation', 60),
    ('Conference Room', 'video', 70)
)
insert into public.home_offerings (section_id, title, icon_key, price_text, sort_order, is_active)
select section.id, d.title, d.icon_key, null::text, d.sort_order, true
from section
cross join defaults d
where not exists (
  select 1 from public.home_offerings o
  where o.section_id = section.id and o.title = d.title
);

with features(plan_title, feature_text, is_included, sort_order) as (
  values
    ('Day Pass', 'High Speed Internet', true, 0),
    ('Day Pass', 'Air Conditioned Area', true, 10),
    ('Day Pass', 'Tea/ Coffee/ Water', true, 20),
    ('Day Pass', 'Printer/ Photocopier/ Scanner*', false, 30),
    ('Day Pass', 'Conference Room Access*', false, 40),
    ('Day Pass', 'Meeting Room Access*', false, 50),
    ('Day Pass', 'Lockable Cabin', false, 60),
    ('Day Pass', 'Reception Services', false, 70),
    ('Day Pass', 'Office Address', false, 80),
    ('Hot Desk', 'High Speed Internet', true, 0),
    ('Hot Desk', 'Air Conditioned Area', true, 10),
    ('Hot Desk', 'Tea/ Coffee/ Water', true, 20),
    ('Hot Desk', 'Printer/ Photocopier/ Scanner*', true, 30),
    ('Hot Desk', 'Conference Room Access*', false, 40),
    ('Hot Desk', 'Meeting Room Access*', false, 50),
    ('Hot Desk', 'Lockable Cabin', false, 60),
    ('Hot Desk', 'Reception Services', true, 70),
    ('Hot Desk', 'Office Address', true, 80),
    ('Dedicated Desk', 'High Speed Internet', true, 0),
    ('Dedicated Desk', 'Air Conditioned Area', true, 10),
    ('Dedicated Desk', 'Tea/ Coffee/ Water', true, 20),
    ('Dedicated Desk', 'Printer/ Photocopier/ Scanner*', true, 30),
    ('Dedicated Desk', 'Conference Room Access*', true, 40),
    ('Dedicated Desk', 'Meeting Room Access*', true, 50),
    ('Dedicated Desk', 'Lockable Cabin', false, 60),
    ('Dedicated Desk', 'Reception Services', true, 70),
    ('Dedicated Desk', 'Office Address', true, 80),
    ('4-6 Seaters with Boss Cabin', 'High Speed Internet', true, 0),
    ('4-6 Seaters with Boss Cabin', 'Air Conditioned Area', true, 10),
    ('4-6 Seaters with Boss Cabin', 'Tea/ Coffee/ Water', true, 20),
    ('4-6 Seaters with Boss Cabin', 'Printer/ Photocopier/ Scanner*', true, 30),
    ('4-6 Seaters with Boss Cabin', 'Conference Room Access*', true, 40),
    ('4-6 Seaters with Boss Cabin', 'Meeting Room Access*', true, 50),
    ('4-6 Seaters with Boss Cabin', 'Lockable Cabin', true, 60),
    ('4-6 Seaters with Boss Cabin', 'Reception Services', true, 70),
    ('4-6 Seaters with Boss Cabin', 'Office Address', true, 80),
    ('2-20 Seaters Cabin', 'High Speed Internet', true, 0),
    ('2-20 Seaters Cabin', 'Air Conditioned Area', true, 10),
    ('2-20 Seaters Cabin', 'Tea/ Coffee/ Water', true, 20),
    ('2-20 Seaters Cabin', 'Printer/ Photocopier/ Scanner*', true, 30),
    ('2-20 Seaters Cabin', 'Conference Room Access*', true, 40),
    ('2-20 Seaters Cabin', 'Meeting Room Access*', true, 50),
    ('2-20 Seaters Cabin', 'Lockable Cabin', true, 60),
    ('2-20 Seaters Cabin', 'Reception Services', true, 70),
    ('2-20 Seaters Cabin', 'Office Address', true, 80),
    ('Quote on Request Custom Office Space', 'High Speed Internet', true, 0),
    ('Quote on Request Custom Office Space', 'Air Conditioned Area', true, 10),
    ('Quote on Request Custom Office Space', 'Tea/ Coffee Machine', true, 20),
    ('Quote on Request Custom Office Space', 'Printer/ Photocopier/ Scanner*', true, 30),
    ('Quote on Request Custom Office Space', 'Conference Room', true, 40),
    ('Quote on Request Custom Office Space', 'Meeting Room', true, 50),
    ('Quote on Request Custom Office Space', 'Lockable Office', true, 60),
    ('Quote on Request Custom Office Space', 'Reception Services', true, 70),
    ('Quote on Request Custom Office Space', 'Office Address', true, 80),
    ('Meeting Room', 'High Speed Internet', true, 0),
    ('Meeting Room', 'Air Conditioned Area', true, 10),
    ('Meeting Room', 'Tea/ Coffee/ Water', true, 20),
    ('Meeting Room', 'Printer/ Photocopier/ Scanner*', false, 30),
    ('Meeting Room', 'Reception Services', true, 40),
    ('Conference Room', 'High Speed Internet', true, 0),
    ('Conference Room', 'Air Conditioned Area', true, 10),
    ('Conference Room', 'Tea/ Coffee/ Water', true, 20),
    ('Conference Room', 'Printer/ Photocopier/ Scanner*', false, 30),
    ('Conference Room', 'Reception Services', true, 40)
)
insert into public.home_offering_features (offering_id, feature_text, is_included, sort_order)
select o.id, f.feature_text, f.is_included, f.sort_order
from features f
join public.home_offerings o on o.title = f.plan_title
join public.home_offerings_sections s on s.id = o.section_id and s.section_key = 'default'
where not exists (
  select 1 from public.home_offering_features existing
  where existing.offering_id = o.id and existing.feature_text = f.feature_text
);

-- Why Choose Us defaults
with section as (
  select id from public.home_why_choose_us_sections where section_key = 'default'
),
defaults(title, description, animation_key, theme, sort_order) as (
  values
    ('Pro level Digital Marketing', $cms$Dive into the depth of the Digital Marketing world and learn skills that would never make you loose. Be a magician of the digital world as it would be wise to not be a spectator but be the creator.$cms$, 'rolling-track', 'light', 0),
    ('Entrepreneurship', $cms$Time has gone, for the jobseekers as the market is changing everyday and every moment thus we here at Axion trains our members not just to fit in any kind of jobs but to survive anywhere on their own.$cms$, 'isometric-cube', 'dark', 10),
    ('Sales Training', $cms$It's not enough for you to just learn a handful of digital marketing skills and run out of your comfort zone to achieve your goals. Thus we have included this Sales training just to make sure you are able to sell what you are best in.$cms$, 'rising-graph', 'light', 20),
    ('Personality Development', $cms$Once you are stuffed with every kind of skills, had gone through every technique of entrepreneurship and even become the data scientist.. don't you feel you need to polish your personality? We promise to polish that for you.$cms$, 'ripple', 'dark', 30)
)
insert into public.home_why_choose_us_cards (
  section_id, title, description, animation_key, theme, sort_order, is_active
)
select section.id, d.title, d.description, d.animation_key, d.theme, d.sort_order, true
from section
cross join defaults d
where not exists (
  select 1 from public.home_why_choose_us_cards c
  where c.section_id = section.id and c.title = d.title
);

-- Amenities defaults
with section as (
  select id from public.home_amenities_sections where section_key = 'default'
),
defaults(icon_key, label, sort_order) as (
  values
    ('wifi', 'High-Speed WiFi', 0),
    ('printer', 'Print & Scan', 10),
    ('coffee', 'Free Coffee', 20),
    ('key', '24/7 Access', 30),
    ('shield', 'Secure Entry', 40),
    ('bike', 'Bike Storage', 50),
    ('briefcase', 'Meeting Rooms', 60),
    ('zap', 'Backup Power', 70),
    ('mic', 'Podcast Studio', 80),
    ('cctv', 'CCTV Surveillance', 90),
    ('coffee', 'Coffee & Tea', 100),
    ('bus', 'Public Transport', 110),
    ('users', 'Community Manager', 120),
    ('sparkles', 'Housekeeping', 130),
    ('printer', 'Printer/ Copier', 140),
    ('droplets', 'Hygienic Washrooms', 150)
)
insert into public.home_amenities (section_id, icon_key, label, sort_order, is_active)
select section.id, d.icon_key, d.label, d.sort_order, true
from section
cross join defaults d
where not exists (
  select 1 from public.home_amenities a
  where a.section_id = section.id and a.label = d.label
);

-- Testimonials defaults
with section as (
  select id from public.home_testimonials_sections where section_key = 'default'
),
defaults(quote, person_name, person_role, company_name, sort_order) as (
  values
    ($cms$Moving our startup to Axion Workspace was the best decision we made. The environment is inspiring, the amenities are flawless, and the community is incredible.$cms$, 'Sarah Jenkins', 'CEO', 'TechFlow', 0),
    ($cms$The private office suites provide the perfect balance of focused quiet time and energetic communal spaces when we want to network.$cms$, 'David Miller', 'Founder', 'Scale Up', 10),
    ($cms$As a freelancer, I needed a space that felt professional. The Observatory location gives me the exact premium vibe I need for client meetings.$cms$, 'Elena Rodriguez', 'Independent Designer', null::text, 20)
)
insert into public.home_testimonials (
  section_id, quote, person_name, person_role, company_name, sort_order, is_active
)
select section.id, d.quote, d.person_name, d.person_role, d.company_name, d.sort_order, true
from section
cross join defaults d
where not exists (
  select 1 from public.home_testimonials t
  where t.section_id = section.id and t.person_name = d.person_name
);

-- Footer defaults
with defaults(group_key, label, href, sort_order) as (
  values
    ('sitemap', 'About', '/about', 0),
    ('sitemap', 'Offerings', '/workspaces', 10),
    ('sitemap', 'Amenities', '/#amenities', 20),
    ('sitemap', 'Contact Us', '/connect', 30),
    ('sitemap', 'Privacy Policy', '#', 40)
)
insert into public.footer_links (group_key, label, href, sort_order, is_active)
select d.group_key, d.label, d.href, d.sort_order, true
from defaults d
where not exists (
  select 1 from public.footer_links l
  where l.group_key = d.group_key and l.label = d.label
);

with defaults(platform, label, href, icon_key, sort_order) as (
  values
    ('facebook', 'Facebook', 'https://www.facebook.com/', 'facebook', 0),
    ('twitter', 'Twitter', 'https://twitter.com/', 'twitter', 10),
    ('instagram', 'Instagram', 'https://www.instagram.com/', 'instagram', 20),
    ('linkedin', 'LinkedIn', 'https://www.linkedin.com/', 'linkedin', 30),
    ('whatsapp', 'WhatsApp', 'https://wa.me/919639636131', 'whatsapp', 40)
)
insert into public.footer_social_links (platform, label, href, icon_key, sort_order, is_active)
select d.platform, d.label, d.href, d.icon_key, d.sort_order, true
from defaults d
where not exists (
  select 1 from public.footer_social_links l
  where l.platform = d.platform and l.href = d.href
);
