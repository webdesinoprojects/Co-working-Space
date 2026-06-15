import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid ID");
const shortText = (max = 255) => z.string().min(1).max(max).trim();
const sortOrder = z.number().int().min(0).max(9999);

export const faqSectionSchema = z.object({
  badge_text: shortText(100),
  title: shortText(200),
  highlighted_word: shortText(100),
  body_text: shortText(500),
});

export const faqCategorySchema = z.object({
  id: uuidSchema.optional(),
  label: shortText(150),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters/numbers/hyphens"),
  sort_order: sortOrder,
  is_active: z.boolean(),
});

export const faqItemSchema = z.object({
  id: uuidSchema.optional(),
  category_id: uuidSchema.nullable().optional(),
  question: shortText(500),
  answer: z.string().min(1).max(2000).trim(),
  sort_order: sortOrder,
  is_active: z.boolean(),
});

export const faqReorderSchema = z.array(
  z.object({ id: uuidSchema, sort_order: sortOrder })
);
