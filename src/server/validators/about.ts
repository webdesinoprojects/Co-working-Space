import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");
const shortText = (max = 255) => z.string().min(1).max(max).trim();
const longText = (max = 2000) => z.string().min(1).max(max).trim();
const optionalText = (max = 255) =>
  z.string().max(max).trim().optional().nullable();
const sortOrder = z.number().int().min(0).max(9999);

// -- Hero text -----------------------------------------------------------------
export const aboutHeroTextSchema = z.object({
  headline: shortText(500),
  subtext: longText(),
});
export type AboutHeroTextInput = z.infer<typeof aboutHeroTextSchema>;

// -- Hero images (slot 1–5) ----------------------------------------------------
export const aboutHeroImageSchema = z.object({
  section_id: uuidSchema,
  slot: z.number().int().min(1).max(5),
  image_asset_id: uuidSchema.nullable(),
});
export type AboutHeroImageInput = z.infer<typeof aboutHeroImageSchema>;

// -- Pillar cards --------------------------------------------------------------
export const aboutPillarCardSchema = z.object({
  id: uuidSchema.optional(),
  section_id: uuidSchema,
  sort_order: sortOrder,
  icon_key: shortText(100),
  label: shortText(150),
  stat: shortText(150),
  description: shortText(500),
  is_active: z.boolean(),
});
export type AboutPillarCardInput = z.infer<typeof aboutPillarCardSchema>;

// -- Our Story text ------------------------------------------------------------
export const aboutStoryTextSchema = z.object({
  subheading: shortText(100),
  heading: shortText(300),
  body_1: longText(),
  body_2: longText(),
  body_3: longText(),
  belief_1_title: shortText(150),
  belief_1_text: longText(),
  belief_2_title: shortText(150),
  belief_2_text: longText(),
});
export type AboutStoryTextInput = z.infer<typeof aboutStoryTextSchema>;

// -- Story images (slot 1–4) ---------------------------------------------------
export const aboutStoryImageSchema = z.object({
  section_id: uuidSchema,
  slot: z.number().int().min(1).max(4),
  image_asset_id: uuidSchema.nullable(),
});
export type AboutStoryImageInput = z.infer<typeof aboutStoryImageSchema>;

// -- Client stories ------------------------------------------------------------
export const aboutClientStorySchema = z.object({
  id: uuidSchema.optional(),
  sort_order: sortOrder,
  tag: shortText(100),
  author: shortText(150),
  title: shortText(300),
  description: shortText(1000),
  icon_key: shortText(100),
  is_active: z.boolean(),
});
export type AboutClientStoryInput = z.infer<typeof aboutClientStorySchema>;

// -- Reorder (shared shape, same as homepage reorderSchema) --------------------
export const aboutReorderSchema = z.array(
  z.object({
    id: uuidSchema,
    sort_order: sortOrder,
  })
);
export type AboutReorderInput = z.infer<typeof aboutReorderSchema>;
