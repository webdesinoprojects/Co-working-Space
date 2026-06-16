import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");
const shortText = (max = 255) => z.string().min(1).max(max).trim();
const optionalText = (max = 255) =>
  z.string().max(max).trim().optional().nullable();
const href = z
  .string()
  .max(500)
  .trim()
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("#") ||
      value.startsWith("mailto:") ||
      value.startsWith("tel:") ||
      /^https?:\/\//i.test(value),
    "Href must be relative, http(s), mailto, tel, or an anchor"
  );
const sortOrder = z.number().int().min(0).max(9999);

// -- Hero ----------------------------------------------------------------------
export const heroTextSchema = z.object({
  badge_text: shortText(100),
  headline: shortText(300),
  cta_label: shortText(80),
  cta_href: href,
  promo_title: shortText(150),
  promo_badge_text: shortText(100),
});
export type HeroTextInput = z.infer<typeof heroTextSchema>;

export const assignImageSchema = z.object({
  field: z.enum([
    "left_image_asset_id",
    "top_right_image_asset_id",
    "bottom_right_image_asset_id",
  ]),
  asset_id: uuidSchema.nullable(),
});
export type AssignHeroImageInput = z.infer<typeof assignImageSchema>;

// -- Intro ---------------------------------------------------------------------
export const introTextSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
  body_text: shortText(1000),
  cta_label: shortText(80),
  cta_href: href,
});
export type IntroTextInput = z.infer<typeof introTextSchema>;

export const assignIntroImageSchema = z.object({
  field: z.enum(["left_image_asset_id", "right_image_asset_id"]),
  asset_id: uuidSchema.nullable(),
});
export type AssignIntroImageInput = z.infer<typeof assignIntroImageSchema>;

// -- Locations -----------------------------------------------------------------
export const locationsHeaderSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
  view_all_label: shortText(80),
  view_all_href: href,
});
export type LocationsHeaderInput = z.infer<typeof locationsHeaderSchema>;

export const locationCardSchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  layout_slot: z.number().int().min(1).max(7),
  location_name: shortText(150),
  subtitle: optionalText(150),
  image_asset_id: uuidSchema.nullable().optional(),
  hover_visit_label: shortText(80),
  hover_visit_href: href,
  hover_meeting_label: shortText(80),
  hover_meeting_href: href,
  hover_space_label: shortText(80),
  hover_space_href: href,
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type LocationCardInput = z.infer<typeof locationCardSchema>;

// -- Memberships ---------------------------------------------------------------
export const membershipsHeaderSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
  // Checkbox: present as "on" when checked, absent when not. Coerce to boolean.
  is_enabled: z.preprocess(
    (v) => v === "on" || v === true || v === "true",
    z.boolean()
  ),
});
export type MembershipsHeaderInput = z.infer<typeof membershipsHeaderSchema>;

export const membershipPlanSchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  title: shortText(150),
  description: optionalText(500),
  price_text: shortText(100),
  cta_label: shortText(80),
  highlight_badge_text: optionalText(80),
  is_featured: z.boolean(),
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type MembershipPlanInput = z.infer<typeof membershipPlanSchema>;

export const membershipPlanFeatureSchema = z.object({
  id: uuidSchema.optional(),
  plan_id: uuidSchema,
  feature_text: shortText(255),
  sort_order: sortOrder,
});
export type MembershipPlanFeatureInput = z.infer<
  typeof membershipPlanFeatureSchema
>;

// -- Offerings -----------------------------------------------------------------
export const offeringsHeaderSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
});
export type OfferingsHeaderInput = z.infer<typeof offeringsHeaderSchema>;

export const offeringSchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  title: shortText(150),
  icon_key: shortText(100),
  price_text: optionalText(100),
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type OfferingInput = z.infer<typeof offeringSchema>;

export const offeringFeatureSchema = z.object({
  id: uuidSchema.optional(),
  offering_id: uuidSchema,
  feature_text: shortText(255),
  is_included: z.boolean(),
  sort_order: sortOrder,
});
export type OfferingFeatureInput = z.infer<typeof offeringFeatureSchema>;

// -- Why Choose Us -------------------------------------------------------------
export const whyChooseUsHeaderSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
  body_text: shortText(1500),
});
export type WhyChooseUsHeaderInput = z.infer<typeof whyChooseUsHeaderSchema>;

export const whyChooseUsCardSchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  title: shortText(150),
  description: shortText(1500),
  animation_key: z.enum(["rolling-track", "isometric-cube", "rising-graph", "ripple"]),
  theme: z.enum(["light", "dark"]),
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type WhyChooseUsCardInput = z.infer<typeof whyChooseUsCardSchema>;

// -- Amenities -----------------------------------------------------------------
export const amenitiesHeaderSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
});
export type AmenitiesHeaderInput = z.infer<typeof amenitiesHeaderSchema>;

export const amenitySchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  icon_key: shortText(100),
  label: shortText(150),
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type AmenityInput = z.infer<typeof amenitySchema>;

// -- Testimonials --------------------------------------------------------------
export const testimonialsHeaderSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
});
export type TestimonialsHeaderInput = z.infer<typeof testimonialsHeaderSchema>;

export const testimonialSchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  quote: shortText(1000),
  person_name: shortText(150),
  person_role: optionalText(150),
  company_name: optionalText(150),
  avatar_asset_id: uuidSchema.nullable().optional(),
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

// -- Contact -------------------------------------------------------------------
const interestOptionSchema = z.object({
  label: shortText(80),
  value: shortText(80),
});

export const contactSectionSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
  body_text: shortText(1000),
  phone_label: shortText(80),
  phone_value: shortText(80),
  email_label: shortText(80),
  email_value: shortText(150),
  full_name_placeholder: shortText(80),
  email_placeholder: shortText(80),
  phone_placeholder: shortText(80),
  interest_placeholder: shortText(80),
  message_placeholder: shortText(80),
  submit_label: shortText(80),
  sending_label: shortText(80),
  success_title: shortText(120),
  success_body: shortText(500),
  send_another_label: shortText(120),
  source_path: href,
  interest_options: z.array(interestOptionSchema).min(1).max(12),
});
export type ContactSectionInput = z.infer<typeof contactSectionSchema>;

// -- Footer Links --------------------------------------------------------------
export const footerLinkSchema = z.object({
  id: uuidSchema.optional(),
  group_key: shortText(80),
  label: shortText(120),
  href,
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type FooterLinkInput = z.infer<typeof footerLinkSchema>;

// -- Footer Socials ------------------------------------------------------------
export const footerSocialLinkSchema = z.object({
  id: uuidSchema.optional(),
  platform: shortText(80),
  label: shortText(80),
  href: z.string().url("Must be a valid URL").max(500),
  icon_key: shortText(100),
  sort_order: sortOrder,
  is_active: z.boolean(),
});
export type FooterSocialLinkInput = z.infer<typeof footerSocialLinkSchema>;

// -- Reorder -------------------------------------------------------------------
export const reorderSchema = z.array(
  z.object({
    id: uuidSchema,
    sort_order: sortOrder,
  })
);
export type ReorderInput = z.infer<typeof reorderSchema>;

// -- Messages ------------------------------------------------------------------
export const messageStatusSchema = z.object({
  id: uuidSchema,
  status: z.enum(["new", "viewed", "in_progress", "resolved", "spam"]),
});
export type MessageStatusInput = z.infer<typeof messageStatusSchema>;

export const messageNotesSchema = z.object({
  id: uuidSchema,
  admin_notes: z.string().max(5000).trim(),
});
export type MessageNotesInput = z.infer<typeof messageNotesSchema>;

// -- Media ---------------------------------------------------------------------
export const mediaUpdateSchema = z.object({
  id: uuidSchema,
  alt_text: z.string().max(500).trim().optional().nullable(),
  is_published: z.boolean().optional(),
  folder: z.string().max(255).trim().optional().nullable(),
});
export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>;
