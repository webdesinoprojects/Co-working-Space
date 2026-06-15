-- Returns true if the calling user is an active admin (any role)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.is_active = true
      and ap.role in ('owner', 'admin', 'editor')
  );
$$;

-- Returns true if the calling user is an active owner
create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.id = auth.uid()
      and ap.is_active = true
      and ap.role = 'owner'
  );
$$;

-- ─── Enable RLS ────────────────────────────────────────────────────────────────

alter table public.admin_profiles enable row level security;
alter table public.media_assets enable row level security;
alter table public.footer_social_links enable row level security;
alter table public.home_hero_sections enable row level security;
alter table public.home_intro_sections enable row level security;
alter table public.home_locations_sections enable row level security;
alter table public.home_location_cards enable row level security;
alter table public.home_membership_sections enable row level security;
alter table public.home_membership_plans enable row level security;
alter table public.home_membership_plan_features enable row level security;
alter table public.home_offerings_sections enable row level security;
alter table public.home_offerings enable row level security;
alter table public.home_offering_features enable row level security;
alter table public.home_amenities_sections enable row level security;
alter table public.home_amenities enable row level security;
alter table public.home_testimonials_sections enable row level security;
alter table public.home_testimonials enable row level security;
alter table public.contact_messages enable row level security;

-- ─── admin_profiles ────────────────────────────────────────────────────────────
-- Any active admin can read profiles (needed for assignment UI)
-- Only owners can write profiles (prevents role escalation by non-owners)

create policy "admins can read profiles"
on public.admin_profiles
for select
using (public.is_admin());

create policy "owners can insert profiles"
on public.admin_profiles
for insert
with check (public.is_owner());

create policy "owners can update profiles"
on public.admin_profiles
for update
using (public.is_owner())
with check (public.is_owner());

create policy "owners can delete profiles"
on public.admin_profiles
for delete
using (public.is_owner());

-- ─── media_assets ──────────────────────────────────────────────────────────────
-- Public sees only published assets; admins see everything

create policy "published media is publicly readable"
on public.media_assets
for select
using (is_published = true or public.is_admin());

create policy "admins can insert media"
on public.media_assets
for insert
with check (public.is_admin());

create policy "admins can update media"
on public.media_assets
for update
using (public.is_admin())
with check (public.is_admin());

create policy "admins can delete media"
on public.media_assets
for delete
using (public.is_admin());

-- ─── footer_social_links ───────────────────────────────────────────────────────

create policy "public can read footer social links"
on public.footer_social_links
for select
using (is_active = true or public.is_admin());

create policy "admins can manage footer social links"
on public.footer_social_links
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_hero_sections ────────────────────────────────────────────────────────

create policy "public can read home hero sections"
on public.home_hero_sections
for select
using (true);

create policy "admins can manage home hero sections"
on public.home_hero_sections
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_intro_sections ───────────────────────────────────────────────────────

create policy "public can read home intro sections"
on public.home_intro_sections
for select
using (true);

create policy "admins can manage home intro sections"
on public.home_intro_sections
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_locations_sections ───────────────────────────────────────────────────

create policy "public can read home locations sections"
on public.home_locations_sections
for select
using (true);

create policy "admins can manage home locations sections"
on public.home_locations_sections
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_location_cards ───────────────────────────────────────────────────────

create policy "public can read home location cards"
on public.home_location_cards
for select
using (is_active = true or public.is_admin());

create policy "admins can manage home location cards"
on public.home_location_cards
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_membership_sections ──────────────────────────────────────────────────

create policy "public can read home membership sections"
on public.home_membership_sections
for select
using (true);

create policy "admins can manage home membership sections"
on public.home_membership_sections
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_membership_plans ─────────────────────────────────────────────────────

create policy "public can read home membership plans"
on public.home_membership_plans
for select
using (is_active = true or public.is_admin());

create policy "admins can manage home membership plans"
on public.home_membership_plans
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_membership_plan_features ────────────────────────────────────────────

create policy "public can read home membership plan features"
on public.home_membership_plan_features
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.home_membership_plans p
    where p.id = plan_id
      and p.is_active = true
  )
);

create policy "admins can manage home membership plan features"
on public.home_membership_plan_features
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_offerings_sections ───────────────────────────────────────────────────

create policy "public can read home offerings sections"
on public.home_offerings_sections
for select
using (true);

create policy "admins can manage home offerings sections"
on public.home_offerings_sections
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_offerings ────────────────────────────────────────────────────────────

create policy "public can read home offerings"
on public.home_offerings
for select
using (is_active = true or public.is_admin());

create policy "admins can manage home offerings"
on public.home_offerings
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_offering_features ────────────────────────────────────────────────────

create policy "public can read home offering features"
on public.home_offering_features
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.home_offerings o
    where o.id = offering_id
      and o.is_active = true
  )
);

create policy "admins can manage home offering features"
on public.home_offering_features
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_amenities_sections ───────────────────────────────────────────────────

create policy "public can read home amenities sections"
on public.home_amenities_sections
for select
using (true);

create policy "admins can manage home amenities sections"
on public.home_amenities_sections
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_amenities ────────────────────────────────────────────────────────────

create policy "public can read home amenities"
on public.home_amenities
for select
using (is_active = true or public.is_admin());

create policy "admins can manage home amenities"
on public.home_amenities
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_testimonials_sections ────────────────────────────────────────────────

create policy "public can read home testimonials sections"
on public.home_testimonials_sections
for select
using (true);

create policy "admins can manage home testimonials sections"
on public.home_testimonials_sections
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── home_testimonials ─────────────────────────────────────────────────────────

create policy "public can read home testimonials"
on public.home_testimonials
for select
using (is_active = true or public.is_admin());

create policy "admins can manage home testimonials"
on public.home_testimonials
for all
using (public.is_admin())
with check (public.is_admin());

-- ─── contact_messages ──────────────────────────────────────────────────────────
-- Anyone (including anonymous public) can INSERT (public contact form)
-- Only admins can read, update, or delete

create policy "public can submit contact messages"
on public.contact_messages
for insert
with check (true);

create policy "admins can read contact messages"
on public.contact_messages
for select
using (public.is_admin());

create policy "admins can update contact messages"
on public.contact_messages
for update
using (public.is_admin())
with check (public.is_admin());

create policy "admins can delete contact messages"
on public.contact_messages
for delete
using (public.is_admin());
