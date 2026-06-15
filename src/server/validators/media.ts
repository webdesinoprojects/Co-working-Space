import { z } from "zod";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const mediaAssetSchema = z.object({
  provider_file_id: z.string().max(255).optional(),
  file_key: z.string().min(1).max(500),
  file_url: z.string().url().max(2000),
  file_name: z.string().max(255).optional(),
  alt_text: z.string().max(500).trim().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  mime_type: z.enum(ALLOWED_MIME_TYPES).optional(),
  folder: z.string().max(255).optional(),
  is_published: z.boolean().default(true),
});

export type MediaAssetInput = z.infer<typeof mediaAssetSchema>;

export function isAllowedMimeType(
  mime: string
): mime is (typeof ALLOWED_MIME_TYPES)[number] {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}
