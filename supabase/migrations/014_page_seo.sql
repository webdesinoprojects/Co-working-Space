-- Admin-editable SEO title/description for public static pages.
-- Canonical URLs stay code-controlled from each route path.

create table if not exists public.page_seo (
  route_path text primary key check (route_path in ('/', '/about', '/workspaces', '/faq', '/connect')),
  meta_title text null check (meta_title is null or char_length(meta_title) <= 200),
  meta_description text null check (meta_description is null or char_length(meta_description) <= 400),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_page_seo_updated_at on public.page_seo;
create trigger trg_page_seo_updated_at
before update on public.page_seo
for each row execute function public.set_updated_at();

alter table public.page_seo enable row level security;

drop policy if exists "public read page seo" on public.page_seo;
create policy "public read page seo"
on public.page_seo
for select using (true);

drop policy if exists "admin manage page seo" on public.page_seo;
create policy "admin manage page seo"
on public.page_seo
for all using (public.is_admin()) with check (public.is_admin());

insert into public.page_seo (route_path, meta_title, meta_description)
values
  ('/', 'Alley Workspace | Premium Coworking & Office Spaces in Delhi', 'Alley Workspace offers premium coworking spaces, private cabins, dedicated desks, meeting rooms, and virtual office solutions in Delhi.'),
  ('/about', 'About Alley Workspace | Premium Coworking Spaces in Delhi', 'Learn about Alley Workspace, our mission, values, and approach to premium coworking spaces in Delhi.'),
  ('/workspaces', 'Workspaces | Alley Workspace', 'Explore Alley Workspace coworking options, including dedicated desks, private cabins, meeting rooms, and virtual office solutions.'),
  ('/faq', 'FAQs | Alley Workspace', 'Find answers to common questions about Alley Workspace memberships, offices, meeting rooms, amenities, and bookings.'),
  ('/connect', 'Contact Alley Workspace', 'Contact Alley Workspace to book a tour, ask about coworking plans, or discuss office space requirements.')
on conflict (route_path) do nothing;
