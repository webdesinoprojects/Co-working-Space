import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");
const shortText = (max = 255) => z.string().min(1).max(max).trim();
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
const stringList = (max = 10) =>
  z
    .array(z.string().trim().min(1).max(220))
    .max(max)
    .transform((items) => items.map((item) => item.trim()).filter(Boolean));

export const servicesPageSchema = z.object({
  badge_text: shortText(80),
  headline: shortText(240),
  intro_text: shortText(900),
  primary_cta_label: shortText(80),
  primary_cta_href: href,
  secondary_cta_label: shortText(80),
  secondary_cta_href: href,
  highlights: stringList(6).refine((items) => items.length > 0, "Add at least one highlight"),
  services_badge_text: shortText(80),
  services_title: shortText(240),
  services_intro_text: shortText(900),
});

export const assignServicesHeroImageSchema = z.object({
  asset_id: uuidSchema.nullable(),
});

export const assignServiceItemImageSchema = z.object({
  id: uuidSchema,
  asset_id: uuidSchema.nullable(),
});

export const serviceItemSchema = z.object({
  id: uuidSchema.optional(),
  title: shortText(150),
  description: shortText(900),
  icon_key: shortText(80),
  image_asset_id: uuidSchema.nullable().optional(),
  features: stringList(10),
  cta_label: shortText(80),
  cta_href: href,
  sort_order: sortOrder,
  is_active: z.boolean(),
});

export const serviceItemIdSchema = uuidSchema;

export const reorderServicesItemsSchema = z.array(
  z.object({
    id: uuidSchema,
    sort_order: sortOrder,
  })
);
