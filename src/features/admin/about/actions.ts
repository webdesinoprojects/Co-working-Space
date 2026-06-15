"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { createSupabaseServerClient } from "@/server/db/client";
import {
  getAdminAboutHeroSection,
  getAdminAboutPillarsSection,
  getAdminAboutStorySection,
  getAdminAboutClientStories,
} from "@/server/repositories/admin-about";
import {
  aboutHeroTextSchema,
  aboutHeroImageSchema,
  aboutPillarCardSchema,
  aboutStoryTextSchema,
  aboutStoryImageSchema,
  aboutClientStorySchema,
  aboutReorderSchema,
} from "@/server/validators/about";
import type {
  AdminAboutHeroSectionVM,
  AdminAboutPillarsSectionVM,
  AdminAboutStorySectionVM,
  AdminAboutClientStoryVM,
  ActionResult,
} from "@/features/admin/types";

function revalidateAboutPage(): ActionResult {
  revalidatePath("/about");
  revalidatePath("/about", "layout");
  return { success: true };
}

async function publishMediaAssetIfNeeded(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  assetId: string | null | undefined
) {
  if (!assetId) return;
  await supabase
    .from("media_assets")
    .update({ is_published: true })
    .eq("id", assetId);
}

// -- Read actions --------------------------------------------------------------

export async function getAboutHeroSectionAction(): Promise<AdminAboutHeroSectionVM | null> {
  await requireAdmin();
  return getAdminAboutHeroSection();
}

export async function getAboutPillarsSectionAction(): Promise<AdminAboutPillarsSectionVM | null> {
  await requireAdmin();
  return getAdminAboutPillarsSection();
}

export async function getAboutStorySectionAction(): Promise<AdminAboutStorySectionVM | null> {
  await requireAdmin();
  return getAdminAboutStorySection();
}

export async function getAboutClientStoriesAction(): Promise<AdminAboutClientStoryVM[]> {
  await requireAdmin();
  return getAdminAboutClientStories();
}

// -- Hero text -----------------------------------------------------------------

export async function updateAboutHeroTextAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = aboutHeroTextSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("about_hero_section")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

// -- Hero images ---------------------------------------------------------------

export async function assignAboutHeroImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = aboutHeroImageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.image_asset_id);

  const { error } = await supabase
    .from("about_hero_images")
    .upsert(
      {
        section_id: parsed.data.section_id,
        slot: parsed.data.slot,
        image_asset_id: parsed.data.image_asset_id,
      },
      { onConflict: "section_id,slot" }
    );

  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

// -- Pillar/Value cards --------------------------------------------------------

export async function upsertAboutPillarCardAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = aboutPillarCardSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase.from("about_pillar_cards").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateAboutPage();
  }

  const { error } = await supabase.from("about_pillar_cards").insert(rest);
  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

export async function deleteAboutPillarCardAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("about_pillar_cards").delete().eq("id", id);

  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

// -- Story text ----------------------------------------------------------------

export async function updateAboutStoryTextAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = aboutStoryTextSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("about_story_section")
    .update(parsed.data)
    .eq("section_key", "default");

  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

// -- Story images --------------------------------------------------------------

export async function assignAboutStoryImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = aboutStoryImageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.image_asset_id);

  const { error } = await supabase
    .from("about_story_images")
    .upsert(
      {
        section_id: parsed.data.section_id,
        slot: parsed.data.slot,
        image_asset_id: parsed.data.image_asset_id,
      },
      { onConflict: "section_id,slot" }
    );

  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

// -- Client stories ------------------------------------------------------------

export async function upsertAboutClientStoryAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = aboutClientStorySchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();

  if (id) {
    const { error } = await supabase.from("about_client_stories").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateAboutPage();
  }

  const { error } = await supabase.from("about_client_stories").insert(rest);
  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

export async function deleteAboutClientStoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("about_client_stories").delete().eq("id", id);

  return error ? { success: false, error: error.message } : revalidateAboutPage();
}

// -- Reorder -------------------------------------------------------------------

type AboutReorderableTable = "about_pillar_cards" | "about_client_stories";
const ABOUT_REORDERABLE_TABLES = new Set<string>([
  "about_pillar_cards",
  "about_client_stories",
]);

export async function reorderAboutItemsAction(
  table: AboutReorderableTable,
  raw: unknown
): Promise<ActionResult> {
  await requireAdmin();

  if (!ABOUT_REORDERABLE_TABLES.has(table)) {
    return { success: false, error: "Invalid reorder target" };
  }

  const parsed = aboutReorderSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid reorder input" };

  const supabase = await createSupabaseServerClient();

  const results = await Promise.all(
    parsed.data.map(({ id, sort_order }) =>
      supabase.from(table).update({ sort_order }).eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };

  return revalidateAboutPage();
}
