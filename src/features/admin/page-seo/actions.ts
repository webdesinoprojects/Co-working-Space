"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { createSupabaseServerClient } from "@/server/db/client";
import { pageSeoSchema } from "@/server/validators/page-seo";
import type { ActionResult } from "@/features/admin/types";

export async function updatePageSeoAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = pageSeoSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("page_seo")
    .upsert(parsed.data, { onConflict: "route_path" });

  if (error) return { success: false, error: error.message };

  revalidatePath(parsed.data.route_path);
  revalidatePath(parsed.data.route_path, "layout");
  revalidatePath("/admin/content/seo");

  return { success: true };
}
