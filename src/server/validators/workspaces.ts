import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");
const shortText = (max = 255) => z.string().min(1).max(max).trim();
const optionalText = (max = 255) =>
  z.string().max(max).trim().optional().nullable();
const sortOrder = z.number().int().min(0).max(9999);
const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters/numbers/hyphens, no leading/trailing/double hyphens"
  );
const isSafeHref = (value: string) =>
  value.startsWith("/") ||
  value.startsWith("#") ||
  value.startsWith("https://") ||
  value.startsWith("http://") ||
  value.startsWith("mailto:") ||
  value.startsWith("tel:");
const hrefSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine(isSafeHref, "Href must be a relative path, hash, or safe URL");
const optionalHrefSchema = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .refine((value) => !value || isSafeHref(value), "Href must be a relative path, hash, or safe URL");

// Overview
export const workspaceOverviewSchema = z.object({
  badge_text: shortText(100),
  title: shortText(300),
  body_text: shortText(1000),
});

// Workspace basic
export const workspaceCreateSchema = z.object({
  slug: slugSchema,
  nav_label: shortText(100),
  card_title: shortText(200),
  card_description: shortText(500),
  hero_title: shortText(300),
  hero_description: shortText(1000),
  cta_label: shortText(80),
  cta_href: hrefSchema,
  video_label: shortText(80),
  video_href: optionalHrefSchema,
  sort_order: sortOrder,
  is_active: z.boolean(),
  is_featured: z.boolean(),
  meta_title: optionalText(200),
  meta_description: optionalText(400),
});

export const workspaceUpdateSchema = workspaceCreateSchema.extend({
  id: uuidSchema,
});

// Hero image
export const workspaceHeroImageSchema = z.object({
  workspace_id: uuidSchema,
  slot: z.number().int().min(1).max(3),
  image_asset_id: uuidSchema.nullable(),
});

// Overview image
export const workspaceOverviewImageSchema = z.object({
  workspace_id: uuidSchema,
  image_asset_id: uuidSchema.nullable(),
});

// Stat
export const workspaceStatSchema = z.object({
  id: uuidSchema.optional(),
  workspace_id: uuidSchema,
  value: shortText(100),
  label: shortText(150),
  sort_order: sortOrder,
  is_active: z.boolean(),
});

// Gallery image
export const workspaceGalleryImageSchema = z.object({
  id: uuidSchema.optional(),
  workspace_id: uuidSchema,
  sort_order: sortOrder,
  image_asset_id: uuidSchema.nullable(),
  caption: optionalText(300),
  is_active: z.boolean(),
});

// Marquee band
export const workspaceMarqueeBandSchema = z.object({
  id: uuidSchema.optional(),
  workspace_id: uuidSchema,
  theme: z.enum(["light", "dark"]),
  reverse: z.boolean(),
  sort_order: sortOrder,
  is_active: z.boolean(),
});

// Marquee item
export const workspaceMarqueeItemSchema = z.object({
  id: uuidSchema.optional(),
  band_id: uuidSchema,
  item_text: shortText(200),
  sort_order: sortOrder,
  is_active: z.boolean(),
});

// Amenity
export const workspaceAmenitySchema = z.object({
  id: uuidSchema.optional(),
  workspace_id: uuidSchema,
  icon_key: shortText(100),
  label: shortText(150),
  sort_order: sortOrder,
  is_active: z.boolean(),
});

// Plan section
export const workspacePlanSectionSchema = z.object({
  id: uuidSchema,
  badge_text: shortText(100),
  title: shortText(200),
});

// Plan
export const workspacePlanSchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  title: shortText(150),
  icon_key: shortText(100),
  price_text: optionalText(100),
  sort_order: sortOrder,
  is_active: z.boolean(),
});

// Plan feature
export const workspacePlanFeatureSchema = z.object({
  id: uuidSchema.optional(),
  plan_id: uuidSchema,
  feature_text: shortText(255),
  is_included: z.boolean(),
  sort_order: sortOrder,
});

// Reorder
export const workspaceReorderSchema = z.array(
  z.object({ id: uuidSchema, sort_order: sortOrder })
);
