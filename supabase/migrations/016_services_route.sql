-- Public services route SEO support and footer sitemap link.

alter table public.page_seo
  drop constraint if exists page_seo_route_path_check;

alter table public.page_seo
  add constraint page_seo_route_path_check
  check (route_path in ('/', '/about', '/workspaces', '/services', '/faq', '/connect', '/privacy-policy'));

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
