"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { createSupabaseServerClient } from "@/server/db/client";
import { privacyPolicyPageSchema } from "@/server/validators/privacy-policy";
import type { ActionResult } from "@/features/admin/types";

export async function updatePrivacyPolicyPageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = privacyPolicyPageSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("privacy_policy_pages")
    .upsert(
      {
        page_key: "default",
        ...parsed.data,
      },
      { onConflict: "page_key" }
    );

  if (error) return { success: false, error: error.message };

  revalidatePath("/privacy-policy");
  revalidatePath("/privacy-policy", "layout");
  revalidatePath("/admin/content/privacy-policy");

  return { success: true };
}
