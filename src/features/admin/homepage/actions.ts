"use server";

import { refresh, revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { createSupabaseServerClient } from "@/server/db/client";
import {
  getAdminHeroSection,
  getAdminIntroSection,
  getAdminLocationsSection,
  getAdminMembershipSection,
  getAdminOfferingsSection,
  getAdminWhyChooseUsSection,
  getAdminAmenitiesSection,
  getAdminTestimonialsSection,
  getAdminContactSection,
  getAdminFooterLinks,
  getAdminFooterSocialLinks,
} from "@/server/repositories/admin-homepage";
import {
  heroTextSchema,
  assignImageSchema,
  introTextSchema,
  assignIntroImageSchema,
  locationsHeaderSchema,
  locationCardSchema,
  membershipsHeaderSchema,
  membershipPlanSchema,
  membershipPlanFeatureSchema,
  offeringsHeaderSchema,
  offeringSchema,
  offeringFeatureSchema,
  whyChooseUsHeaderSchema,
  whyChooseUsCardSchema,
  amenitiesHeaderSchema,
  amenitySchema,
  testimonialsHeaderSchema,
  testimonialSchema,
  contactSectionSchema,
  footerLinkSchema,
  footerSocialLinkSchema,
  reorderSchema,
} from "@/server/validators/homepage";
import type {
  AdminHeroSectionVM,
  AdminIntroSectionVM,
  AdminLocationsSectionVM,
  AdminMembershipSectionVM,
  AdminOfferingsSectionVM,
  AdminWhyChooseUsSectionVM,
  AdminAmenitiesSectionVM,
  AdminTestimonialsSectionVM,
  AdminContactSectionVM,
  AdminFooterLinkVM,
  AdminFooterSocialLinkVM,
  ActionResult,
} from "@/features/admin/types";

function revalidateHomepage(): ActionResult {
  revalidatePath("/");
  revalidatePath("/", "layout");
  refresh();
  return { success: true };
}

async function publishMediaAssetIfNeeded(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  assetId: string | null | undefined
) {
  if (!assetId) return;
  await supabase
    .from("media_assets")
    .update({ is_published: true })
    .eq("id", assetId);
}

// -- Read actions (called from server components / editor pages) ----------------

export async function getHeroSectionAction(): Promise<AdminHeroSectionVM | null> {
  await requireAdmin();
  return getAdminHeroSection();
}

export async function getIntroSectionAction(): Promise<AdminIntroSectionVM | null> {
  await requireAdmin();
  return getAdminIntroSection();
}

export async function getLocationsSectionAction(): Promise<AdminLocationsSectionVM | null> {
  await requireAdmin();
  return getAdminLocationsSection();
}

export async function getMembershipSectionAction(): Promise<AdminMembershipSectionVM | null> {
  await requireAdmin();
  return getAdminMembershipSection();
}

export async function getOfferingsSectionAction(): Promise<AdminOfferingsSectionVM | null> {
  await requireAdmin();
  return getAdminOfferingsSection();
}

export async function getWhyChooseUsSectionAction(): Promise<AdminWhyChooseUsSectionVM | null> {
  await requireAdmin();
  return getAdminWhyChooseUsSection();
}

export async function getAmenitiesSectionAction(): Promise<AdminAmenitiesSectionVM | null> {
  await requireAdmin();
  return getAdminAmenitiesSection();
}

export async function getTestimonialsSectionAction(): Promise<AdminTestimonialsSectionVM | null> {
  await requireAdmin();
  return getAdminTestimonialsSection();
}

export async function getContactSectionAction(): Promise<AdminContactSectionVM | null> {
  await requireAdmin();
  return getAdminContactSection();
}

export async function getFooterLinksAction(): Promise<AdminFooterLinkVM[]> {
  await requireAdmin();
  return getAdminFooterLinks();
}

export async function getFooterSocialLinksAction(): Promise<AdminFooterSocialLinkVM[]> {
  await requireAdmin();
  return getAdminFooterSocialLinks();
}

// -- Hero ----------------------------------------------------------------------

export async function updateHeroTextAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = heroTextSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_hero_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function assignHeroImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = assignImageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.asset_id);

  const { error } = await supabase
    .from("home_hero_sections")
    .update({ [parsed.data.field]: parsed.data.asset_id })
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Intro ---------------------------------------------------------------------

export async function updateIntroTextAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = introTextSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_intro_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function assignIntroImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = assignIntroImageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.asset_id);

  const { error } = await supabase
    .from("home_intro_sections")
    .update({ [parsed.data.field]: parsed.data.asset_id })
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Locations -----------------------------------------------------------------

export async function updateLocationsHeaderAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = locationsHeaderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_locations_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertLocationCardAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = locationCardSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.image_asset_id);

  if (id) {
    const { error } = await supabase
      .from("home_location_cards")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase
    .from("home_location_cards")
    .insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteLocationCardAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_location_cards")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Memberships ---------------------------------------------------------------

export async function updateMembershipsHeaderAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = membershipsHeaderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_membership_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertMembershipPlanAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = membershipPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("home_membership_plans")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase
    .from("home_membership_plans")
    .insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteMembershipPlanAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_membership_plans")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertMembershipPlanFeatureAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = membershipPlanFeatureSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("home_membership_plan_features")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase
    .from("home_membership_plan_features")
    .insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteMembershipPlanFeatureAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_membership_plan_features")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Offerings -----------------------------------------------------------------

export async function updateOfferingsHeaderAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = offeringsHeaderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_offerings_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertOfferingAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = offeringSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("home_offerings")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase.from("home_offerings").insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteOfferingAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_offerings")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertOfferingFeatureAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = offeringFeatureSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("home_offering_features")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase
    .from("home_offering_features")
    .insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteOfferingFeatureAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_offering_features")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Why Choose Us -------------------------------------------------------------

export async function updateWhyChooseUsHeaderAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = whyChooseUsHeaderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_why_choose_us_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertWhyChooseUsCardAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = whyChooseUsCardSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("home_why_choose_us_cards")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase.from("home_why_choose_us_cards").insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteWhyChooseUsCardAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_why_choose_us_cards")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Amenities -----------------------------------------------------------------

export async function updateAmenitiesHeaderAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = amenitiesHeaderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_amenities_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertAmenityAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = amenitySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("home_amenities")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase.from("home_amenities").insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteAmenityAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_amenities")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Testimonials --------------------------------------------------------------

export async function updateTestimonialsHeaderAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = testimonialsHeaderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_testimonials_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function upsertTestimonialAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.avatar_asset_id);

  if (id) {
    const { error } = await supabase
      .from("home_testimonials")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase.from("home_testimonials").insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_testimonials")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Contact -------------------------------------------------------------------

export async function updateContactSectionAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = contactSectionSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("home_contact_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Footer Links --------------------------------------------------------------

export async function upsertFooterLinkAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = footerLinkSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("footer_links")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase.from("footer_links").insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteFooterLinkAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("footer_links")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Footer Socials ------------------------------------------------------------

export async function upsertFooterSocialLinkAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = footerSocialLinkSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase
      .from("footer_social_links")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateHomepage();
  }

  const { error } = await supabase.from("footer_social_links").insert(rest);
  return error ? { success: false, error: error.message } : revalidateHomepage();
}

export async function deleteFooterSocialLinkAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("footer_social_links")
    .delete()
    .eq("id", id);

  return error ? { success: false, error: error.message } : revalidateHomepage();
}

// -- Reorder (shared) ----------------------------------------------------------

type ReorderableTable =
  | "home_location_cards"
  | "home_membership_plans"
  | "home_membership_plan_features"
  | "home_offerings"
  | "home_offering_features"
  | "home_why_choose_us_cards"
  | "home_amenities"
  | "home_testimonials"
  | "footer_links"
  | "footer_social_links";

const REORDERABLE_TABLES = new Set<string>([
  "home_location_cards",
  "home_membership_plans",
  "home_membership_plan_features",
  "home_offerings",
  "home_offering_features",
  "home_why_choose_us_cards",
  "home_amenities",
  "home_testimonials",
  "footer_links",
  "footer_social_links",
]);

export async function reorderItemsAction(
  table: ReorderableTable,
  raw: unknown
): Promise<ActionResult> {
  await requireAdmin();

  if (!REORDERABLE_TABLES.has(table)) {
    return { success: false, error: "Invalid reorder target" };
  }

  const parsed = reorderSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid reorder input" };
  }

  const supabase = await createSupabaseServerClient();

  const results = await Promise.all(
    parsed.data.map(({ id, sort_order }) =>
      supabase.from(table).update({ sort_order }).eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    return { success: false, error: failed.error.message };
  }

  return revalidateHomepage();
}
