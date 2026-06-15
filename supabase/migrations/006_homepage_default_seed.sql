-- Idempotent seed: ensures all singleton homepage section rows exist.
-- Safe to run multiple times via ON CONFLICT DO NOTHING.

INSERT INTO public.home_hero_sections (section_key)
VALUES ('default')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.home_intro_sections (section_key)
VALUES ('default')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.home_locations_sections (section_key)
VALUES ('default')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.home_membership_sections (section_key)
VALUES ('default')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.home_offerings_sections (section_key)
VALUES ('default')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.home_amenities_sections (section_key)
VALUES ('default')
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.home_testimonials_sections (section_key)
VALUES ('default')
ON CONFLICT (section_key) DO NOTHING;
