"use server";

import { submitContactMessage } from "@/server/services/contact";
import type { ContactSubmitResult } from "@/features/contact/types";

export async function submitContactAction(
  formData: FormData
): Promise<ContactSubmitResult> {
  const raw = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    interest: formData.get("interest") || undefined,
    message: formData.get("message"),
    source_path: formData.get("source_path") || "/",
  };

  return submitContactMessage(raw);
}
