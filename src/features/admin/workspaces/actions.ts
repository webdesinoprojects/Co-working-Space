"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { createSupabaseServerClient } from "@/server/db/client";
import {
  getAdminWorkspaceList,
  getAdminWorkspaceBySlug,
  getAdminWorkspaceOverview,
} from "@/server/repositories/admin-workspaces";
import {
  workspaceOverviewSchema,
  workspaceCreateSchema,
  workspaceUpdateSchema,
  workspaceHeroImageSchema,
  workspaceOverviewImageSchema,
  workspaceStatSchema,
  workspaceGalleryImageSchema,
  workspaceMarqueeBandSchema,
  workspaceMarqueeItemSchema,
  workspaceAmenitySchema,
  workspacePlanSectionSchema,
  workspacePlanSchema,
  workspacePlanFeatureSchema,
  workspaceReorderSchema,
} from "@/server/validators/workspaces";
import type {
  AdminWorkspaceListItemVM,
  AdminWorkspaceEditorVM,
  AdminWorkspaceOverviewVM,
  ActionResult,
} from "@/features/admin/types";

function revalidateWorkspaces(slug?: string): ActionResult {
  revalidatePath("/workspaces");
  revalidatePath("/workspaces", "layout");
  if (slug) {
    revalidatePath(`/workspaces/${slug}`);
    revalidatePath(`/workspaces/${slug}`, "layout");
  }
  return { success: true };
}

async function publishMediaAssetIfNeeded(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  assetId: string | null | undefined
) {
  if (!assetId) return;
  await supabase.from("media_assets").update({ is_published: true }).eq("id", assetId);
}

// -- Read actions (used by admin pages) ----------------------------------------

export async function getAdminWorkspaceListAction(): Promise<AdminWorkspaceListItemVM[]> {
  await requireAdmin();
  return getAdminWorkspaceList();
}

export async function getAdminWorkspaceBySlugAction(slug: string): Promise<AdminWorkspaceEditorVM | null> {
  await requireAdmin();
  return getAdminWorkspaceBySlug(slug);
}

export async function getAdminWorkspaceOverviewAction(): Promise<AdminWorkspaceOverviewVM | null> {
  await requireAdmin();
  return getAdminWorkspaceOverview();
}

// -- Overview ------------------------------------------------------------------

export async function updateWorkspaceOverviewAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceOverviewSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("workspace_overview_sections")
    .update(parsed.data)
    .eq("section_key", "default");
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Workspace CRUD ------------------------------------------------------------

export async function createWorkspaceAction(raw: unknown): Promise<ActionResult<{ slug: string }>> {
  await requireAdmin();
  const parsed = workspaceCreateSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const supabase = await createSupabaseServerClient();
  const { data: ws, error } = await supabase
    .from("workspaces")
    .insert(parsed.data)
    .select("id, slug")
    .single();
  if (error || !ws) return { success: false, error: error?.message ?? "Insert failed" };
  const wsData = ws as { id: string; slug: string };
  // Auto-create plan_section
  await supabase.from("workspace_plan_sections").insert({
    workspace_id: wsData.id,
    badge_text: "Plans",
    title: "Choose Your Plan",
  });
  revalidateWorkspaces(parsed.data.slug);
  return { success: true, data: { slug: wsData.slug } };
}

export async function updateWorkspaceAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceUpdateSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspaces").update(rest).eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces(parsed.data.slug);
}

export async function deleteWorkspaceAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspaces").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function reorderWorkspacesAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceReorderSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid reorder input" };
  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    parsed.data.map(({ id, sort_order }) =>
      supabase.from("workspaces").update({ sort_order }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };
  return revalidateWorkspaces();
}

// -- Images --------------------------------------------------------------------

export async function assignWorkspaceOverviewImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceOverviewImageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid input" };
  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.image_asset_id);
  const { error } = await supabase
    .from("workspaces")
    .update({ overview_image_asset_id: parsed.data.image_asset_id })
    .eq("id", parsed.data.workspace_id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function assignWorkspaceHeroImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceHeroImageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid input" };
  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.image_asset_id);
  const { error } = await supabase
    .from("workspace_hero_images")
    .upsert(
      { workspace_id: parsed.data.workspace_id, slot: parsed.data.slot, image_asset_id: parsed.data.image_asset_id },
      { onConflict: "workspace_id,slot" }
    );
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Stats ---------------------------------------------------------------------

export async function upsertWorkspaceStatAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceStatSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (id) {
    const { error } = await supabase.from("workspace_stats").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateWorkspaces();
  }
  const { error } = await supabase.from("workspace_stats").insert(rest);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function deleteWorkspaceStatAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_stats").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Gallery -------------------------------------------------------------------

export async function upsertWorkspaceGalleryImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceGalleryImageSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.image_asset_id);
  if (id) {
    const { error } = await supabase.from("workspace_gallery_images").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateWorkspaces();
  }
  const { error } = await supabase.from("workspace_gallery_images").insert(rest);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function deleteWorkspaceGalleryImageAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_gallery_images").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Marquee Bands -------------------------------------------------------------

export async function upsertWorkspaceMarqueeBandAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceMarqueeBandSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (id) {
    const { error } = await supabase.from("workspace_marquee_bands").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateWorkspaces();
  }
  const { error } = await supabase.from("workspace_marquee_bands").insert(rest);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function deleteWorkspaceMarqueeBandAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_marquee_bands").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Marquee Items -------------------------------------------------------------

export async function upsertWorkspaceMarqueeItemAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceMarqueeItemSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (id) {
    const { error } = await supabase.from("workspace_marquee_items").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateWorkspaces();
  }
  const { error } = await supabase.from("workspace_marquee_items").insert(rest);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function deleteWorkspaceMarqueeItemAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_marquee_items").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Amenities -----------------------------------------------------------------

export async function upsertWorkspaceAmenityAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspaceAmenitySchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (id) {
    const { error } = await supabase.from("workspace_amenities").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateWorkspaces();
  }
  const { error } = await supabase.from("workspace_amenities").insert(rest);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function deleteWorkspaceAmenityAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_amenities").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Plan Section --------------------------------------------------------------

export async function updateWorkspacePlanSectionAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspacePlanSectionSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_plan_sections").update(rest).eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Plans ---------------------------------------------------------------------

export async function upsertWorkspacePlanAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspacePlanSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (id) {
    const { error } = await supabase.from("workspace_plans").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateWorkspaces();
  }
  const { error } = await supabase.from("workspace_plans").insert(rest);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function deleteWorkspacePlanAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_plans").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Plan Features -------------------------------------------------------------

export async function upsertWorkspacePlanFeatureAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = workspacePlanFeatureSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Validation failed" };
  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  if (id) {
    const { error } = await supabase.from("workspace_plan_features").update(rest).eq("id", id);
    return error ? { success: false, error: error.message } : revalidateWorkspaces();
  }
  const { error } = await supabase.from("workspace_plan_features").insert(rest);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

export async function deleteWorkspacePlanFeatureAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("workspace_plan_features").delete().eq("id", id);
  return error ? { success: false, error: error.message } : revalidateWorkspaces();
}

// -- Generic Reorder -----------------------------------------------------------

type WorkspaceReorderableTable =
  | "workspace_stats"
  | "workspace_gallery_images"
  | "workspace_marquee_bands"
  | "workspace_marquee_items"
  | "workspace_amenities"
  | "workspace_plans"
  | "workspace_plan_features";

const WORKSPACE_REORDERABLE_TABLES = new Set<string>([
  "workspace_stats",
  "workspace_gallery_images",
  "workspace_marquee_bands",
  "workspace_marquee_items",
  "workspace_amenities",
  "workspace_plans",
  "workspace_plan_features",
]);

export async function reorderWorkspaceItemsAction(
  table: WorkspaceReorderableTable,
  raw: unknown
): Promise<ActionResult> {
  await requireAdmin();
  if (!WORKSPACE_REORDERABLE_TABLES.has(table)) {
    return { success: false, error: "Invalid reorder target" };
  }
  const parsed = workspaceReorderSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid reorder input" };
  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    parsed.data.map(({ id, sort_order }) =>
      supabase.from(table).update({ sort_order }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };
  return revalidateWorkspaces();
}
