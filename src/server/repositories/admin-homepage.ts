import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type {
  AdminHeroSectionVM,
  AdminIntroSectionVM,
  AdminLocationsSectionVM,
  AdminLocationCardVM,
  AdminMembershipSectionVM,
  AdminOfferingsSectionVM,
  AdminWhyChooseUsSectionVM,
  AdminAmenitiesSectionVM,
  AdminTestimonialsSectionVM,
  AdminContactSectionVM,
  AdminFooterLinkVM,
  AdminFooterSocialLinkVM,
  AdminImagePreview,
  AdminContactInterestOptionVM,
} from "@/features/admin/types";

type ImgRow = {
  file_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

function toAdminImage(
  assetId: string | null,
  row: ImgRow | null
): AdminImagePreview | null {
  if (!row || !assetId) return null;
  return {
    asset_id: assetId,
    url: row.file_url,
    alt: row.alt_text,
    width: row.width,
    height: row.height,
  };
}

// Helper: batch-fetch media assets by ID, returns a map keyed by asset ID.
// Avoids the !foreign_key PostgREST join syntax which is not supported on older PostgREST.
async function fetchMediaMap(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ids: (string | null | undefined)[]
): Promise<Record<string, ImgRow>> {
  const filtered = ids.filter((id): id is string => !!id);
  if (filtered.length === 0) return {};
  const { data } = await supabase
    .from("media_assets")
    .select("id, file_url, alt_text, width, height")
    .in("id", filtered);
  const map: Record<string, ImgRow> = {};
  for (const a of data ?? []) {
    map[a.id] = { file_url: a.file_url, alt_text: a.alt_text, width: a.width, height: a.height };
  }
  return map;
}

function parseInterestOptions(value: unknown): AdminContactInterestOptionVM[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (option): option is AdminContactInterestOptionVM =>
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

// -- Hero ----------------------------------------------------------------------
export async function getAdminHeroSection(): Promise<AdminHeroSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_hero_sections")
    .select(
      "id, badge_text, headline, cta_label, cta_href, promo_title, promo_badge_text, left_image_asset_id, top_right_image_asset_id, bottom_right_image_asset_id"
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminHeroSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  const imgMap = await fetchMediaMap(supabase, [
    data.left_image_asset_id,
    data.top_right_image_asset_id,
    data.bottom_right_image_asset_id,
  ]);

  return {
    id: data.id,
    badge_text: data.badge_text,
    headline: data.headline,
    cta_label: data.cta_label,
    cta_href: data.cta_href,
    promo_title: data.promo_title,
    promo_badge_text: data.promo_badge_text,
    left_image_asset_id: data.left_image_asset_id,
    top_right_image_asset_id: data.top_right_image_asset_id,
    bottom_right_image_asset_id: data.bottom_right_image_asset_id,
    left_image: toAdminImage(data.left_image_asset_id, imgMap[data.left_image_asset_id] ?? null),
    top_right_image: toAdminImage(data.top_right_image_asset_id, imgMap[data.top_right_image_asset_id] ?? null),
    bottom_right_image: toAdminImage(data.bottom_right_image_asset_id, imgMap[data.bottom_right_image_asset_id] ?? null),
  };
}

// -- Intro ---------------------------------------------------------------------
export async function getAdminIntroSection(): Promise<AdminIntroSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_intro_sections")
    .select(
      "id, badge_text, title, body_text, cta_label, cta_href, left_image_asset_id, right_image_asset_id"
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminIntroSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  const imgMap = await fetchMediaMap(supabase, [
    data.left_image_asset_id,
    data.right_image_asset_id,
  ]);

  return {
    id: data.id,
    badge_text: data.badge_text,
    title: data.title,
    body_text: data.body_text,
    cta_label: data.cta_label,
    cta_href: data.cta_href,
    left_image_asset_id: data.left_image_asset_id,
    right_image_asset_id: data.right_image_asset_id,
    left_image: toAdminImage(data.left_image_asset_id, imgMap[data.left_image_asset_id] ?? null),
    right_image: toAdminImage(data.right_image_asset_id, imgMap[data.right_image_asset_id] ?? null),
  };
}

// -- Locations -----------------------------------------------------------------
export async function getAdminLocationsSection(): Promise<AdminLocationsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_locations_sections")
    .select("id, badge_text, title, view_all_label, view_all_href")
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminLocationsSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  const { data: cardsData } = await supabase
    .from("home_location_cards")
    .select(
      "id, section_id, layout_slot, location_name, subtitle, image_asset_id, hover_visit_label, hover_visit_href, hover_meeting_label, hover_meeting_href, hover_space_label, hover_space_href, sort_order, is_active"
    )
    .eq("section_id", data.id)
    .order("sort_order");

  const cards = cardsData ?? [];
  const imgMap = await fetchMediaMap(supabase, cards.map((c) => c.image_asset_id));

  return {
    id: data.id,
    badge_text: data.badge_text,
    title: data.title,
    view_all_label: data.view_all_label,
    view_all_href: data.view_all_href,
    cards: cards.map((c): AdminLocationCardVM => ({
      id: c.id,
      section_id: c.section_id,
      layout_slot: c.layout_slot,
      location_name: c.location_name,
      subtitle: c.subtitle,
      image_asset_id: c.image_asset_id,
      image: toAdminImage(c.image_asset_id, imgMap[c.image_asset_id] ?? null),
      hover_visit_label: c.hover_visit_label,
      hover_visit_href: c.hover_visit_href,
      hover_meeting_label: c.hover_meeting_label,
      hover_meeting_href: c.hover_meeting_href,
      hover_space_label: c.hover_space_label,
      hover_space_href: c.hover_space_href,
      sort_order: c.sort_order,
      is_active: c.is_active,
    })),
  };
}

// -- Memberships ---------------------------------------------------------------
export async function getAdminMembershipSection(): Promise<AdminMembershipSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_membership_sections")
    .select(
      `id, badge_text, title, is_enabled,
       home_membership_plans(
         id, section_id, title, description, price_text, cta_label,
         highlight_badge_text, is_featured, sort_order, is_active,
         home_membership_plan_features(id, plan_id, feature_text, sort_order)
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminMembershipSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  type FeatureRow = { id: string; plan_id: string; feature_text: string; sort_order: number };
  type PlanRow = {
    id: string;
    section_id: string;
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
    id: string;
    badge_text: string;
    title: string;
    is_enabled: boolean;
    home_membership_plans: PlanRow[];
  };

  return {
    id: d.id,
    badge_text: d.badge_text,
    title: d.title,
    is_enabled: d.is_enabled,
    plans: (d.home_membership_plans ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        id: p.id,
        section_id: p.section_id,
        title: p.title,
        description: p.description,
        price_text: p.price_text,
        cta_label: p.cta_label,
        highlight_badge_text: p.highlight_badge_text,
        is_featured: p.is_featured,
        sort_order: p.sort_order,
        is_active: p.is_active,
        features: (p.home_membership_plan_features ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((f) => ({
            id: f.id,
            plan_id: f.plan_id,
            feature_text: f.feature_text,
            sort_order: f.sort_order,
          })),
      })),
  };
}

// -- Offerings -----------------------------------------------------------------
export async function getAdminOfferingsSection(): Promise<AdminOfferingsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_offerings_sections")
    .select(
      `id, badge_text, title,
       home_offerings(
         id, section_id, title, icon_key, price_text, sort_order, is_active,
         home_offering_features(id, offering_id, feature_text, is_included, sort_order)
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminOfferingsSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  type OfferingFeatureRow = {
    id: string;
    offering_id: string;
    feature_text: string;
    is_included: boolean;
    sort_order: number;
  };
  type OfferingRow = {
    id: string;
    section_id: string;
    title: string;
    icon_key: string;
    price_text: string | null;
    sort_order: number;
    is_active: boolean;
    home_offering_features: OfferingFeatureRow[];
  };

  const d = (data as unknown) as {
    id: string;
    badge_text: string;
    title: string;
    home_offerings: OfferingRow[];
  };

  return {
    id: d.id,
    badge_text: d.badge_text,
    title: d.title,
    offerings: (d.home_offerings ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((o) => ({
        id: o.id,
        section_id: o.section_id,
        title: o.title,
        icon_key: o.icon_key,
        price_text: o.price_text,
        sort_order: o.sort_order,
        is_active: o.is_active,
        features: (o.home_offering_features ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((f) => ({
            id: f.id,
            offering_id: f.offering_id,
            feature_text: f.feature_text,
            is_included: f.is_included,
            sort_order: f.sort_order,
          })),
      })),
  };
}

// -- Why Choose Us -------------------------------------------------------------
export async function getAdminWhyChooseUsSection(): Promise<AdminWhyChooseUsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_why_choose_us_sections")
    .select(
      `id, badge_text, title, body_text,
       home_why_choose_us_cards(
         id, section_id, title, description, animation_key, theme, sort_order, is_active
       )`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminWhyChooseUsSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  type CardRow = {
    id: string;
    section_id: string;
    title: string;
    description: string;
    animation_key: string;
    theme: "light" | "dark";
    sort_order: number;
    is_active: boolean;
  };

  const d = (data as unknown) as {
    id: string;
    badge_text: string;
    title: string;
    body_text: string;
    home_why_choose_us_cards: CardRow[];
  };

  return {
    id: d.id,
    badge_text: d.badge_text,
    title: d.title,
    body_text: d.body_text,
    cards: (d.home_why_choose_us_cards ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((card) => ({
        id: card.id,
        section_id: card.section_id,
        title: card.title,
        description: card.description,
        animation_key: card.animation_key,
        theme: card.theme,
        sort_order: card.sort_order,
        is_active: card.is_active,
      })),
  };
}

// -- Amenities -----------------------------------------------------------------
export async function getAdminAmenitiesSection(): Promise<AdminAmenitiesSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_amenities_sections")
    .select(
      `id, badge_text, title,
       home_amenities(id, section_id, icon_key, label, sort_order, is_active)`
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminAmenitiesSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  type AmenityRow = {
    id: string;
    section_id: string;
    icon_key: string;
    label: string;
    sort_order: number;
    is_active: boolean;
  };

  const d = (data as unknown) as {
    id: string;
    badge_text: string;
    title: string;
    home_amenities: AmenityRow[];
  };

  return {
    id: d.id,
    badge_text: d.badge_text,
    title: d.title,
    amenities: (d.home_amenities ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((a) => ({
        id: a.id,
        section_id: a.section_id,
        icon_key: a.icon_key,
        label: a.label,
        sort_order: a.sort_order,
        is_active: a.is_active,
      })),
  };
}

// -- Testimonials --------------------------------------------------------------
export async function getAdminTestimonialsSection(): Promise<AdminTestimonialsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_testimonials_sections")
    .select("id, badge_text, title, layout_mode")
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminTestimonialsSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  const { data: testsData } = await supabase
    .from("home_testimonials")
    .select(
      "id, section_id, quote, person_name, person_role, company_name, avatar_asset_id, sort_order, is_active"
    )
    .eq("section_id", data.id)
    .order("sort_order");

  const testimonials = testsData ?? [];
  const imgMap = await fetchMediaMap(supabase, testimonials.map((t) => t.avatar_asset_id));

  return {
    id: data.id,
    badge_text: data.badge_text,
    title: data.title,
    layout_mode: data.layout_mode,
    testimonials: testimonials.map((t) => ({
      id: t.id,
      section_id: t.section_id,
      quote: t.quote,
      person_name: t.person_name,
      person_role: t.person_role,
      company_name: t.company_name,
      avatar_asset_id: t.avatar_asset_id,
      avatar: toAdminImage(t.avatar_asset_id, imgMap[t.avatar_asset_id] ?? null),
      sort_order: t.sort_order,
      is_active: t.is_active,
    })),
  };
}

// -- Contact -------------------------------------------------------------------
export async function getAdminContactSection(): Promise<AdminContactSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("home_contact_sections")
    .select(
      "id, badge_text, title, body_text, phone_label, phone_value, email_label, email_value, full_name_placeholder, email_placeholder, phone_placeholder, interest_placeholder, message_placeholder, submit_label, sending_label, success_title, success_body, send_another_label, source_path, interest_options"
    )
    .eq("section_key", "default")
    .single();

  if (error || !data) {
    console.error("[getAdminContactSection] code:", error?.code, "msg:", error?.message);
    return null;
  }

  const d = (data as unknown) as Omit<AdminContactSectionVM, "interest_options"> & {
    interest_options: unknown;
  };

  return {
    ...d,
    interest_options: parseInterestOptions(d.interest_options),
  };
}

// -- Footer Links --------------------------------------------------------------
export async function getAdminFooterLinks(): Promise<AdminFooterLinkVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("footer_links")
    .select("id, group_key, label, href, sort_order, is_active")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return (data as unknown) as AdminFooterLinkVM[];
}

// -- Footer Socials ------------------------------------------------------------
export async function getAdminFooterSocialLinks(): Promise<AdminFooterSocialLinkVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("footer_social_links")
    .select("id, platform, label, href, icon_key, sort_order, is_active")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return (data as unknown) as AdminFooterSocialLinkVM[];
}
