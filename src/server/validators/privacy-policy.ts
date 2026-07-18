import { z } from "zod";

const shortText = (max = 255) => z.string().min(1).max(max).trim();

export const privacyPolicyPageSchema = z.object({
  headline: shortText(150),
  effective_date_label: shortText(120),
  intro_text: shortText(1000),
  body_content: z.string().min(1).max(12000).trim(),
});
