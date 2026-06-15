import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import {
  contactMessageSchema,
  type ContactMessageInput,
} from "@/server/validators/contact";
import type { ContactSubmitResult } from "@/features/contact/types";

// Inserts a contact form submission. Uses the anon client; RLS allows
// unauthenticated INSERTs on contact_messages (no public SELECT/UPDATE/DELETE).
// Validation happens before any DB call.
export async function submitContactMessage(
  raw: unknown
): Promise<ContactSubmitResult> {
  const parsed = contactMessageSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [path, errs] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      fieldErrors[path] = errs ?? [];
    }
    return {
      success: false,
      error: "Validation failed",
      fieldErrors,
    };
  }

  const input: ContactMessageInput = parsed.data;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_messages").insert({
    full_name: input.full_name,
    email: input.email,
    phone: input.phone,
    interest: input.interest ?? null,
    message: input.message,
    source_path: input.source_path,
    status: "new",
  });

  if (error) {
    return {
      success: false,
      error: "Failed to submit. Please try again.",
    };
  }

  return { success: true };
}
