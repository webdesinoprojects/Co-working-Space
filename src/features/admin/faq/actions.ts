"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { createSupabaseServerClient } from "@/server/db/client";
import {
  faqSectionSchema,
  faqCategorySchema,
  faqItemSchema,
  faqReorderSchema,
} from "@/server/validators/faq";
import type { ActionResult } from "@/features/admin/types";

function revalidateFaq() {
  revalidatePath("/faq");
  revalidatePath("/faq", "layout");
}

export async function updateFaqSectionAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqSectionSchema.safeParse(raw);
  if (!parsed.success)
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("faq_sections")
    .update(parsed.data)
    .eq("section_key", "default");

  if (error) return { success: false, error: error.message };
  revalidateFaq();
  return { success: true };
}

export async function upsertFaqCategoryAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqCategorySchema.safeParse(raw);
  if (!parsed.success)
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };

  const supabase = await createSupabaseServerClient();
  const { id, ...rest } = parsed.data;
  const { error } = id
    ? await supabase.from("faq_categories").update(rest).eq("id", id)
    : await supabase.from("faq_categories").insert(rest);

  if (error) return { success: false, error: error.message };
  revalidateFaq();
  return { success: true };
}

export async function deleteFaqCategoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("faq_categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateFaq();
  return { success: true };
}

export async function upsertFaqItemAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqItemSchema.safeParse(raw);
  if (!parsed.success)
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };

  const supabase = await createSupabaseServerClient();
  const { id, ...rest } = parsed.data;
  const { error } = id
    ? await supabase.from("faq_items").update(rest).eq("id", id)
    : await supabase.from("faq_items").insert(rest);

  if (error) return { success: false, error: error.message };
  revalidateFaq();
  return { success: true };
}

export async function deleteFaqItemAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidateFaq();
  return { success: true };
}

const REORDER_ALLOWLIST = ["faq_categories", "faq_items"] as const;
type ReorderTable = (typeof REORDER_ALLOWLIST)[number];

export async function reorderFaqItemsAction(
  table: string,
  raw: unknown
): Promise<ActionResult> {
  await requireAdmin();
  if (!REORDER_ALLOWLIST.includes(table as ReorderTable))
    return { success: false, error: "Invalid table" };

  const parsed = faqReorderSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const supabase = await createSupabaseServerClient();
  await Promise.all(
    parsed.data.map(({ id, sort_order }) =>
      supabase.from(table as ReorderTable).update({ sort_order }).eq("id", id)
    )
  );
  revalidateFaq();
  return { success: true };
}
