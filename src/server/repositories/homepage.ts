import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import { withImageKitWebp } from "@/lib/image-url";
import type {
  HeroSectionVM,
  IntroSectionVM,
  LocationsSectionVM,
  MembershipSectionVM,
  OfferingsSectionVM,
  WhyChooseUsSectionVM,
  AmenitiesSectionVM,
  TestimonialsSectionVM,
  ContactSectionVM,
  FooterLinkVM,
  FooterSocialLinkVM,
  PublicImageVM,
  ContactInterestOptionVM,
} from "@/features/homepage/types";

type ImgRow = {
  id: string;
  file_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

function toPublicImage(row: Omit<ImgRow, "id"> | null): PublicImageVM | null {
  if (!row) return null;
  return {
    url: withImageKitWebp(row.file_url),
    alt: row.alt_text ?? "",
    width: row.width,
    height: row.height,
  };
}

async function fetchMediaMap(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ids: (string | null | undefined)[]
): Promise<Record<string, ImgRow>> {
  const filtered = Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
  if (filtered.length === 0) return {};

  const { data } = await supabase
    .from("media_assets")
    .select("id, file_url, alt_text, width, height")
    .in("id", filtered)
    .eq("is_published", true);

  const map: Record<string, ImgRow> = {};
  for (const asset of data ?? []) {
    map[asset.id] = {
      id: asset.id,
      file_url: asset.file_url,
      alt_text: asset.alt_text,
      width: asset.width,
      height: asset.height,
    };
  }
  return map;
}

function imageFromMap(
  mediaMap: Record<string, ImgRow>,
  assetId: string | null | undefined
): PublicImageVM | null {
  if (!assetId) return null;
  return toPublicImage(mediaMap[assetId] ?? null);
}

function parseInterestOptions(value: unknown): ContactInterestOptionVM[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (option): option is ContactInterestOptionVM =>
        typeof option === "object" &&
        option !== null &&
        typeof (option as { label?: unknown }).label === "string" &&
        typeof (option as { value?: unknown }).value === "string"
    )
    .map((option) => ({
      label: option.label,
      value: option.value,
    }));
}

export async function getHeroSection(): Promise<HeroSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_hero_sections")
    .select(
      "badge_text, headline, cta_label, cta_href, promo_title, promo_badge_text, left_image_asset_id, top_right_image_asset_id, bottom_right_image_asset_id"
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  const d = (data as unknown) as {
    badge_text: string;
    headline: string;
    cta_label: string;
    cta_href: string;
    promo_title: string;
    promo_badge_text: string;
    left_image_asset_id: string | null;
    top_right_image_asset_id: string | null;
    bottom_right_image_asset_id: string | null;
  };
  const mediaMap = await fetchMediaMap(supabase, [
    d.left_image_asset_id,
    d.top_right_image_asset_id,
    d.bottom_right_image_asset_id,
  ]);

  return {
    badge_text: d.badge_text,
    headline: d.headline,
    cta_label: d.cta_label,
    cta_href: d.cta_href,
    promo_title: d.promo_title,
    promo_badge_text: d.promo_badge_text,
    left_image: imageFromMap(mediaMap, d.left_image_asset_id),
    top_right_image: imageFromMap(mediaMap, d.top_right_image_asset_id),
    bottom_right_image: imageFromMap(mediaMap, d.bottom_right_image_asset_id),
  };
}

export async function getIntroSection(): Promise<IntroSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_intro_sections")
    .select(
      "badge_text, title, body_text, cta_label, cta_href, left_image_asset_id, right_image_asset_id"
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  const d = (data as unknown) as {
    badge_text: string;
    title: string;
    body_text: string;
    cta_label: string;
    cta_href: string;
    left_image_asset_id: string | null;
    right_image_asset_id: string | null;
  };
  const mediaMap = await fetchMediaMap(supabase, [
    d.left_image_asset_id,
    d.right_image_asset_id,
  ]);

  return {
    badge_text: d.badge_text,
    title: d.title,
    body_text: d.body_text,
    cta_label: d.cta_label,
    cta_href: d.cta_href,
    left_image: imageFromMap(mediaMap, d.left_image_asset_id),
    right_image: imageFromMap(mediaMap, d.right_image_asset_id),
  };
}

export async function getLocationsSection(): Promise<LocationsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_locations_sections")
    .select(
      `badge_text, title, view_all_label, view_all_href,
       home_location_cards(
         id, location_name, subtitle, image_asset_id,
         hover_visit_label, hover_visit_href,
         hover_meeting_label, hover_meeting_href,
         hover_space_label, hover_space_href,
         sort_order, is_active
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  type CardRow = {
    id: string;
    location_name: string;
    subtitle: string | null;
    image_asset_id: string | null;
    hover_visit_label: string;
    hover_visit_href: string;
    hover_meeting_label: string;
    hover_meeting_href: string;
    hover_space_label: string;
    hover_space_href: string;
    sort_order: number;
    is_active: boolean;
  };

  const d = (data as unknown) as {
    badge_text: string;
    title: string;
    view_all_label: string;
    view_all_href: string;
    home_location_cards: CardRow[];
  };
  const activeCards = (d.home_location_cards ?? [])
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const mediaMap = await fetchMediaMap(
    supabase,
    activeCards.map((card) => card.image_asset_id)
  );

  return {
    badge_text: d.badge_text,
    title: d.title,
    view_all_label: d.view_all_label,
    view_all_href: d.view_all_href,
    cards: activeCards.map((c) => ({
        id: c.id,
        location_name: c.location_name,
        subtitle: c.subtitle,
        image: imageFromMap(mediaMap, c.image_asset_id),
        hover_visit_label: c.hover_visit_label,
        hover_visit_href: c.hover_visit_href,
        hover_meeting_label: c.hover_meeting_label,
        hover_meeting_href: c.hover_meeting_href,
        hover_space_label: c.hover_space_label,
        hover_space_href: c.hover_space_href,
        sort_order: c.sort_order,
      })),
  };
}

export async function getMembershipSection(): Promise<MembershipSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_membership_sections")
    .select(
      `badge_text, title, is_enabled,
       home_membership_plans(
         id, title, description, price_text, cta_label,
         highlight_badge_text, is_featured, sort_order, is_active,
         home_membership_plan_features(id, feature_text, sort_order)
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  type FeatureRow = { id: string; feature_text: string; sort_order: number };
  type PlanRow = {
    id: string;
    title: string;
    description: string | null;
    price_text: string;
    cta_label: string;
    highlight_badge_text: string | null;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
    home_membership_plan_features: FeatureRow[];
  };

  const d = (data as unknown) as {
    badge_text: string;
    title: string;
    is_enabled: boolean;
    home_membership_plans: PlanRow[];
  };

  return {
    badge_text: d.badge_text,
    title: d.title,
    is_enabled: d.is_enabled,
    plans: (d.home_membership_plans ?? [])
      .filter((p) => p.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price_text: p.price_text,
        cta_label: p.cta_label,
        highlight_badge_text: p.highlight_badge_text,
        is_featured: p.is_featured,
        sort_order: p.sort_order,
        features: (p.home_membership_plan_features ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((f) => ({
            id: f.id,
            feature_text: f.feature_text,
            sort_order: f.sort_order,
          })),
      })),
  };
}

export async function getOfferingsSection(): Promise<OfferingsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_offerings_sections")
    .select(
      `badge_text, title,
       home_offerings(
         id, title, icon_key, price_text, sort_order, is_active,
         home_offering_features(id, feature_text, is_included, sort_order)
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  type OfferingFeatureRow = {
    id: string;
    feature_text: string;
    is_included: boolean;
    sort_order: number;
  };
  type OfferingRow = {
    id: string;
    title: string;
    icon_key: string;
    price_text: string | null;
    sort_order: number;
    is_active: boolean;
    home_offering_features: OfferingFeatureRow[];
  };

  const d = (data as unknown) as {
    badge_text: string;
    title: string;
    home_offerings: OfferingRow[];
  };

  return {
    badge_text: d.badge_text,
    title: d.title,
    offerings: (d.home_offerings ?? [])
      .filter((o) => o.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((o) => ({
        id: o.id,
        title: o.title,
        icon_key: o.icon_key,
        price_text: o.price_text,
        sort_order: o.sort_order,
        features: (o.home_offering_features ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((f) => ({
            id: f.id,
            feature_text: f.feature_text,
            is_included: f.is_included,
            sort_order: f.sort_order,
          })),
      })),
  };
}

export async function getWhyChooseUsSection(): Promise<WhyChooseUsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_why_choose_us_sections")
    .select(
      `badge_text, title, body_text,
       home_why_choose_us_cards(
         id, title, description, animation_key, theme, sort_order, is_active
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  type CardRow = {
    id: string;
    title: string;
    description: string;
    animation_key: string;
    theme: "light" | "dark";
    sort_order: number;
    is_active: boolean;
  };

  const d = (data as unknown) as {
    badge_text: string;
    title: string;
    body_text: string;
    home_why_choose_us_cards: CardRow[];
  };

  return {
    badge_text: d.badge_text,
    title: d.title,
    body_text: d.body_text,
    cards: (d.home_why_choose_us_cards ?? [])
      .filter((card) => card.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((card) => ({
        id: card.id,
        title: card.title,
        description: card.description,
        animation_key: card.animation_key,
        theme: card.theme,
        sort_order: card.sort_order,
      })),
  };
}

export async function getAmenitiesSection(): Promise<AmenitiesSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_amenities_sections")
    .select(
      `badge_text, title,
       home_amenities(id, icon_key, label, sort_order, is_active)`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  type AmenityRow = {
    id: string;
    icon_key: string;
    label: string;
    sort_order: number;
    is_active: boolean;
  };

  const d = (data as unknown) as {
    badge_text: string;
    title: string;
    home_amenities: AmenityRow[];
  };

  return {
    badge_text: d.badge_text,
    title: d.title,
    amenities: (d.home_amenities ?? [])
      .filter((a) => a.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((a) => ({
        id: a.id,
        icon_key: a.icon_key,
        label: a.label,
        sort_order: a.sort_order,
      })),
  };
}

export async function getTestimonialsSection(): Promise<TestimonialsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_testimonials_sections")
    .select(
      `badge_text, title, layout_mode,
       home_testimonials(
         id, quote, person_name, person_role, company_name, avatar_asset_id, sort_order, is_active
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  type TestimonialRow = {
    id: string;
    quote: string;
    person_name: string;
    person_role: string | null;
    company_name: string | null;
    avatar_asset_id: string | null;
    sort_order: number;
    is_active: boolean;
  };

  const d = (data as unknown) as {
    badge_text: string;
    title: string;
    layout_mode: string;
    home_testimonials: TestimonialRow[];
  };
  const activeTestimonials = (d.home_testimonials ?? [])
    .filter((t) => t.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const mediaMap = await fetchMediaMap(
    supabase,
    activeTestimonials.map((testimonial) => testimonial.avatar_asset_id)
  );

  return {
    badge_text: d.badge_text,
    title: d.title,
    layout_mode: d.layout_mode,
    testimonials: activeTestimonials.map((t) => ({
        id: t.id,
        quote: t.quote,
        person_name: t.person_name,
        person_role: t.person_role,
        company_name: t.company_name,
        avatar: imageFromMap(mediaMap, t.avatar_asset_id),
        sort_order: t.sort_order,
      })),
  };
}

export async function getContactSection(): Promise<ContactSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_contact_sections")
    .select(
      "badge_text, title, body_text, phone_label, phone_value, email_label, email_value, full_name_placeholder, email_placeholder, phone_placeholder, interest_placeholder, message_placeholder, submit_label, sending_label, success_title, success_body, send_another_label, source_path, interest_options"
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) return null;

  const d = (data as unknown) as Omit<ContactSectionVM, "interest_options"> & {
    interest_options: unknown;
  };

  return {
    ...d,
    interest_options: parseInterestOptions(d.interest_options),
  };
}

export async function getFooterLinks(): Promise<FooterLinkVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("footer_links")
    .select("id, group_key, label, href, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return (data as unknown) as FooterLinkVM[];
}

export async function getFooterSocialLinks(): Promise<FooterSocialLinkVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("footer_social_links")
    .select("id, platform, label, href, icon_key, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return (data as unknown) as FooterSocialLinkVM[];
}
