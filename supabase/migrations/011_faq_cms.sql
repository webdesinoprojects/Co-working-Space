-- FAQ CMS schema and default seed.

create table if not exists public.faq_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique default 'default',
  badge_text text not null default 'Got Questions?',
  title text not null default 'Frequently Asked Questions',
  highlighted_word text not null default 'Questions',
  body_text text not null default 'Everything you need to know about Axion Spaces, memberships, amenities, and how we can help your business thrive.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faq_categories (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.faq_categories(id) on delete set null,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_faq_categories_active_sort
  on public.faq_categories (is_active, sort_order);

create index if not exists idx_faq_items_category_active_sort
  on public.faq_items (category_id, is_active, sort_order);

drop trigger if exists trg_faq_sections_updated_at on public.faq_sections;
create trigger trg_faq_sections_updated_at
before update on public.faq_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_faq_categories_updated_at on public.faq_categories;
create trigger trg_faq_categories_updated_at
before update on public.faq_categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_faq_items_updated_at on public.faq_items;
create trigger trg_faq_items_updated_at
before update on public.faq_items
for each row execute function public.set_updated_at();

alter table public.faq_sections enable row level security;
alter table public.faq_categories enable row level security;
alter table public.faq_items enable row level security;

drop policy if exists "public read faq section" on public.faq_sections;
create policy "public read faq section"
on public.faq_sections
for select using (true);

drop policy if exists "admin manage faq section" on public.faq_sections;
create policy "admin manage faq section"
on public.faq_sections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active faq categories" on public.faq_categories;
create policy "public read active faq categories"
on public.faq_categories
for select using (is_active = true or public.is_admin());

drop policy if exists "admin manage faq categories" on public.faq_categories;
create policy "admin manage faq categories"
on public.faq_categories
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active faq items" on public.faq_items;
create policy "public read active faq items"
on public.faq_items
for select using (is_active = true or public.is_admin());

drop policy if exists "admin manage faq items" on public.faq_items;
create policy "admin manage faq items"
on public.faq_items
for all using (public.is_admin()) with check (public.is_admin());

insert into public.faq_sections (section_key)
values ('default')
on conflict (section_key) do nothing;

insert into public.faq_categories (label, slug, sort_order)
values ('General', 'general', 0)
on conflict (slug) do nothing;

with category as (
  select id from public.faq_categories where slug = 'general'
),
defaults(question, answer, sort_order) as (
  values
    ('What are your operating hours?', 'Our workspaces are accessible 24/7 for dedicated desk and private cabin members. Our front desk and support staff are available Monday through Friday, from 9:00 AM to 6:00 PM.', 0),
    ('Do you offer day passes or trial days?', 'Yes. We offer a one-day free trial so you can experience our premium environment, high-speed internet, and amenities before making a commitment. You can also purchase individual day passes if you just need a temporary space.', 10),
    ('How fast and reliable is the internet connection?', 'We provide enterprise-grade, ultra-fast fiber optic internet with dual-line redundancy. You can expect speeds up to 1 Gbps, ensuring seamless video calls and heavy file transfers without interruption.', 20),
    ('What is included in a dedicated desk membership?', 'A dedicated desk membership includes 24/7 access, your own permanent desk setup, ergonomic seating, a lockable filing cabinet, printing credits, unlimited premium coffee, and access to all lounge areas.', 30),
    ('Can I bring guests to the workspace?', 'Absolutely. Members are welcome to bring guests for meetings in our lounges or booked meeting rooms. Guests just need to sign in at the front desk upon arrival.', 40),
    ('Are meeting rooms included in my membership?', 'Yes, dedicated desk and private cabin members receive a monthly allocation of meeting room credits. These credits can be used to book our conference rooms.', 50),
    ('Is printing and scanning available?', 'Yes, we have enterprise-grade multi-function printers and scanners on every floor. Members receive a monthly printing allowance, and scanning is free.', 60),
    ('Do you have private phone booths?', 'Yes, we offer soundproof private phone booths throughout the workspace. They are available on a first-come, first-served basis and are useful for private calls or deep focus work.', 70),
    ('Is there a minimum commitment period for private cabins?', 'Our private cabins offer flexible terms. Standard agreements can run month-to-month, with discounts available for longer commitments.', 80),
    ('What kind of coffee and snacks are provided?', 'Members get access to coffee, tea, infused water, and selected pantry refreshments depending on the workspace plan.', 90),
    ('Do you host networking events for members?', 'Yes. We host networking events, workshops, founder mixers, and member sessions to help professionals connect and grow.', 100),
    ('Is parking available on-site?', 'Parking availability depends on the location and plan. Dedicated parking spots can be added where available.', 110),
    ('Can I register my company at your address?', 'Yes, we offer business address registration and mail handling services through virtual office packages and eligible private cabin memberships.', 120),
    ('How do I book a meeting room?', 'Meeting rooms can be booked through the team or member booking flow. Availability and credits depend on your workspace plan.', 130)
)
insert into public.faq_items (category_id, question, answer, sort_order)
select category.id, d.question, d.answer, d.sort_order
from category
cross join defaults d
where not exists (
  select 1 from public.faq_items existing
  where existing.question = d.question
);
