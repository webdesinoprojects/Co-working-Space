-- ============================================================
-- Virtual Office package matrix update
-- ============================================================
-- Replaces only the Virtual Office plan cards/features with the
-- approved package list. Other workspace CMS content is untouched.

insert into public.workspace_plan_sections (workspace_id, badge_text, title)
select id, 'Virtual Office', 'Virtual Office Packages'
from public.workspaces
where slug = 'virtual-office'
on conflict (workspace_id) do update
set
  badge_text = excluded.badge_text,
  title = excluded.title,
  updated_at = now();

with target_section as (
  select s.id
  from public.workspace_plan_sections s
  join public.workspaces w on w.id = s.workspace_id
  where w.slug = 'virtual-office'
)
delete from public.workspace_plan_features f
using public.workspace_plans p, target_section s
where f.plan_id = p.id
  and p.section_id = s.id;

with target_section as (
  select s.id
  from public.workspace_plan_sections s
  join public.workspaces w on w.id = s.workspace_id
  where w.slug = 'virtual-office'
)
delete from public.workspace_plans p
using target_section s
where p.section_id = s.id;

with target_section as (
  select s.id
  from public.workspace_plan_sections s
  join public.workspaces w on w.id = s.workspace_id
  where w.slug = 'virtual-office'
),
packages(title, icon_key, price_text, sort_order) as (
  values
    ('Virtual Office Mailing Address', 'building', 'Rs 12,000 + tax / annum', 0),
    ('GST Registration - Basic', 'shield-check', 'Rs 15,000 + tax / annum', 10),
    ('GST Registration - Advanced', 'shield-check', 'Rs 30,000 + tax / annum', 20),
    ('Company Registration - Basic', 'briefcase', 'Rs 15,000 + tax / annum', 30),
    ('Company Registration - Advanced', 'briefcase', 'Rs 30,000 + tax / annum', 40)
)
insert into public.workspace_plans (section_id, title, icon_key, price_text, sort_order, is_active)
select s.id, p.title, p.icon_key, p.price_text, p.sort_order, true
from target_section s
cross join packages p;

with target_section as (
  select s.id
  from public.workspace_plan_sections s
  join public.workspaces w on w.id = s.workspace_id
  where w.slug = 'virtual-office'
),
features(plan_title, feature_text, sort_order) as (
  values
    ('Virtual Office Mailing Address', 'Mailing address usage', 0),
    ('Virtual Office Mailing Address', 'Mail handling', 10),

    ('GST Registration - Basic', 'Address use for GST', 0),
    ('GST Registration - Basic', 'Mail handling', 10),
    ('GST Registration - Basic', 'Temporary signage', 20),
    ('GST Registration - Basic', 'Bank account support', 30),

    ('GST Registration - Advanced', 'Address use for GST', 0),
    ('GST Registration - Advanced', 'Mail handling', 10),
    ('GST Registration - Advanced', 'Permanent signage', 20),
    ('GST Registration - Advanced', '5 hours meeting room', 30),
    ('GST Registration - Advanced', '2 day passes in a month', 40),
    ('GST Registration - Advanced', 'Reception services', 50),

    ('Company Registration - Basic', 'Address use for company registration', 0),
    ('Company Registration - Basic', 'Mail handling', 10),
    ('Company Registration - Basic', 'Temporary signage', 20),
    ('Company Registration - Basic', 'Bank account support', 30),

    ('Company Registration - Advanced', 'Address use for company registration', 0),
    ('Company Registration - Advanced', 'Mail handling', 10),
    ('Company Registration - Advanced', 'Permanent signage', 20),
    ('Company Registration - Advanced', '5 hours meeting room', 30),
    ('Company Registration - Advanced', '2 day passes in a month', 40),
    ('Company Registration - Advanced', 'Reception services', 50)
)
insert into public.workspace_plan_features (plan_id, feature_text, is_included, sort_order)
select p.id, f.feature_text, true, f.sort_order
from features f
join public.workspace_plans p on p.title = f.plan_title
join target_section s on s.id = p.section_id;
