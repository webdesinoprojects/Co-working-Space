-- Adds an explicit show/hide toggle for the Memberships section.
-- Defaults to true so existing sites keep showing it until an admin turns it off.
alter table public.home_membership_sections
  add column if not exists is_enabled boolean not null default true;
