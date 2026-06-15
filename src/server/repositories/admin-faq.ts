import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type { AdminFaqSectionVM, AdminFaqCategoryVM, AdminFaqItemVM } from "@/features/admin/types";

export async function getAdminFaqSection(): Promise<AdminFaqSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("faq_sections")
    .select("id, badge_text, title, highlighted_word, body_text")
    .eq("section_key", "default")
    .single();
  if (error || !data) return null;
  return data as AdminFaqSectionVM;
}

export async function getAdminFaqCategories(): Promise<AdminFaqCategoryVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("faq_categories")
    .select("id, label, slug, sort_order, is_active")
    .order("sort_order");
  return (data ?? []) as AdminFaqCategoryVM[];
}

export async function getAdminFaqItems(): Promise<AdminFaqItemVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("faq_items")
    .select("id, category_id, question, answer, sort_order, is_active")
    .order("sort_order");
  return (data ?? []) as AdminFaqItemVM[];
}
