import { z } from "zod";

export const contactMessageSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be under 120 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email must be under 254 characters")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(6, "Phone must be at least 6 characters")
    .max(30, "Phone must be under 30 characters")
    .trim(),
  interest: z
    .string()
    .max(100, "Interest must be under 100 characters")
    .trim()
    .optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters")
    .trim(),
  source_path: z
    .string()
    .max(500)
    .trim()
    .default("/"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
