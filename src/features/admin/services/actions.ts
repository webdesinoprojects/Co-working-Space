"use server";

import { refresh, revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import { createSupabaseServerClient } from "@/server/db/client";
import {
  assignServiceItemImageSchema,
  assignServicesHeroImageSchema,
  reorderServicesItemsSchema,
  serviceItemIdSchema,
  serviceItemSchema,
  servicesPageSchema,
} from "@/server/validators/services";
import type { ActionResult } from "@/features/admin/types";

function revalidateServices(): ActionResult {
  revalidatePath("/services");
  revalidatePath("/services", "layout");
  revalidatePath("/admin/content/services");
  refresh();
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

export async function updateServicesPageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = servicesPageSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services_pages")
    .upsert(
      {
        page_key: "default",
        ...parsed.data,
      },
      { onConflict: "page_key" }
    );

  return error ? { success: false, error: error.message } : revalidateServices();
}

export async function assignServicesHeroImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = assignServicesHeroImageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid image selection" };
  }

  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.asset_id);

  const { error } = await supabase
    .from("services_pages")
    .upsert(
      {
        page_key: "default",
        hero_image_asset_id: parsed.data.asset_id,
      },
      { onConflict: "page_key" }
    );

  return error ? { success: false, error: error.message } : revalidateServices();
}

export async function upsertServiceItemAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = serviceItemSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { id, ...rest } = parsed.data;
  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, rest.image_asset_id);

  if (id) {
    const { error } = await supabase
      .from("services_page_items")
      .update(rest)
      .eq("id", id);
    return error ? { success: false, error: error.message } : revalidateServices();
  }

  const { error } = await supabase
    .from("services_page_items")
    .insert(rest);

  return error ? { success: false, error: error.message } : revalidateServices();
}

export async function assignServiceItemImageAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = assignServiceItemImageSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid image selection" };
  }

  const supabase = await createSupabaseServerClient();
  await publishMediaAssetIfNeeded(supabase, parsed.data.asset_id);

  const { error } = await supabase
    .from("services_page_items")
    .update({ image_asset_id: parsed.data.asset_id })
    .eq("id", parsed.data.id);

  return error ? { success: false, error: error.message } : revalidateServices();
}

export async function deleteServiceItemAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = serviceItemIdSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid service ID" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("services_page_items")
    .delete()
    .eq("id", parsed.data);

  return error ? { success: false, error: error.message } : revalidateServices();
}

export async function reorderServicesItemsAction(raw: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = reorderServicesItemsSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid reorder input" };
  }

  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    parsed.data.map(({ id, sort_order }) =>
      supabase.from("services_page_items").update({ sort_order }).eq("id", id)
    )
  );

  const failed = results.find((result) => result.error);
  return failed?.error
    ? { success: false, error: failed.error.message }
    : revalidateServices();
}
