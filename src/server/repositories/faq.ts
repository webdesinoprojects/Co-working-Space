import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type { FaqSectionVM, FaqCategoryVM, FaqItemVM } from "@/features/faq/types";

export async function getFaqSection(): Promise<FaqSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("faq_sections")
    .select("badge_text, title, highlighted_word, body_text")
    .eq("section_key", "default")
    .single();
  if (error || !data) return null;
  return data as FaqSectionVM;
}

export async function getFaqCategories(): Promise<FaqCategoryVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("faq_categories")
    .select("id, label, slug")
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []) as FaqCategoryVM[];
}

export async function getFaqItems(): Promise<FaqItemVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("faq_items")
    .select("id, category_id, question, answer, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []) as FaqItemVM[];
}
