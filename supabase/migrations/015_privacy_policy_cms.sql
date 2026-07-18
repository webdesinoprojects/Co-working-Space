-- CMS-backed privacy policy page and footer link correction.

alter table public.page_seo
  drop constraint if exists page_seo_route_path_check;

alter table public.page_seo
  add constraint page_seo_route_path_check
  check (route_path in ('/', '/about', '/workspaces', '/faq', '/connect', '/privacy-policy'));

create table if not exists public.privacy_policy_pages (
  page_key text primary key check (page_key = 'default'),
  headline text not null default 'Privacy Policy',
  effective_date_label text not null default 'Effective date: July 18, 2026',
  intro_text text not null default 'Alley Workspace respects your privacy. This policy explains how we collect, use, and protect information when you use our website, contact forms, and workspace enquiry channels.',
  body_content text not null default '## Information we collect
We may collect your name, email address, phone number, selected workspace interest, message details, and basic technical information submitted through our website forms.

## How we use your information
We use your information to respond to enquiries, schedule tours, provide workspace-related services, improve our website experience, and communicate relevant updates about Alley Workspace.

## Sharing of information
We do not sell personal information. We may share limited information with trusted service providers only when needed to operate our website, manage enquiries, or provide requested services.

## Cookies and analytics
Our website may use cookies or analytics tools to understand site performance and improve user experience. You can manage cookie preferences through your browser settings.

## Data security
We use reasonable administrative, technical, and operational safeguards to protect the information submitted through our website.

## Your choices
You may contact us to request correction or deletion of your personal information, subject to legal and operational requirements.

## Contact
For privacy-related questions, contact Alley Workspace through the enquiry form or official contact details listed on this website.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_privacy_policy_pages_updated_at on public.privacy_policy_pages;
create trigger trg_privacy_policy_pages_updated_at
before update on public.privacy_policy_pages
for each row execute function public.set_updated_at();

alter table public.privacy_policy_pages enable row level security;

drop policy if exists "public read privacy policy pages" on public.privacy_policy_pages;
create policy "public read privacy policy pages"
on public.privacy_policy_pages
for select using (true);

drop policy if exists "admin manage privacy policy pages" on public.privacy_policy_pages;
create policy "admin manage privacy policy pages"
on public.privacy_policy_pages
for all using (public.is_admin()) with check (public.is_admin());

insert into public.privacy_policy_pages (page_key)
values ('default')
on conflict (page_key) do nothing;

insert into public.page_seo (route_path, meta_title, meta_description)
values (
  '/privacy-policy',
  'Privacy Policy | Alley Workspace',
  'Read the Alley Workspace privacy policy, including how enquiry information is collected, used, protected, and managed.'
)
on conflict (route_path) do nothing;

update public.footer_links
set href = '/privacy-policy',
    group_key = 'sitemap'
where lower(label) = 'privacy policy';

insert into public.footer_links (group_key, label, href, sort_order, is_active)
select 'sitemap', 'Privacy Policy', '/privacy-policy', 40, true
where not exists (
  select 1 from public.footer_links where lower(label) = 'privacy policy'
);
