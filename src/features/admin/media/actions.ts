"use server";

import { refresh, revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import {
  listMediaAssets,
  getMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
  type MediaFilter,
} from "@/server/repositories/media";
import { getImageKitAuthParams, persistImageKitAsset } from "@/server/services/imagekit";
import { mediaUpdateSchema } from "@/server/validators/homepage";
import type {
  MediaAssetVM,
  MediaAssetListVM,
  IkAuthParamsVM,
  ActionResult,
} from "@/features/admin/types";

function revalidateMediaConsumers() {
  revalidatePath("/admin/media");
  revalidatePath("/");
  revalidatePath("/", "layout");
  refresh();
}

export async function listMediaAction(
  filter: MediaFilter = {}
): Promise<MediaAssetListVM> {
  await requireAdmin();
  return listMediaAssets(filter);
}

export async function getMediaAssetAction(
  id: string
): Promise<MediaAssetVM | null> {
  await requireAdmin();
  return getMediaAsset(id);
}

// Returns short-lived ImageKit auth params for the client-side upload widget.
// Private key is never included in the response.
export async function getIkAuthParamsAction(): Promise<
  ActionResult<IkAuthParamsVM>
> {
  await requireAdmin();

  try {
    const params = getImageKitAuthParams();
    return { success: true, data: params };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "ImageKit not configured",
    };
  }
}

// Called by the media upload component after a successful ImageKit upload.
export async function persistUploadedAssetAction(
  uploadResult: {
    fileId: string;
    filePath: string;
    url: string;
    name: string;
    width?: number;
    height?: number;
    fileType?: string;
    size?: number;
  },
  meta: { alt_text?: string; folder?: string } = {}
): Promise<ActionResult<MediaAssetVM>> {
  const profile = await requireAdmin();

  return persistImageKitAsset(uploadResult, {
    ...meta,
    created_by: profile.id,
  });
}

export async function updateMediaAssetAction(
  raw: unknown
): Promise<ActionResult<MediaAssetVM>> {
  await requireAdmin();

  const parsed = mediaUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { id, ...updates } = parsed.data;
  const asset = await updateMediaAsset(id, updates);

  if (!asset) {
    return { success: false, error: "Update failed" };
  }

  revalidateMediaConsumers();
  return { success: true, data: asset };
}

export async function deleteMediaAssetAction(
  id: string
): Promise<ActionResult> {
  await requireAdmin();

  const ok = await deleteMediaAsset(id);
  if (ok) {
    revalidateMediaConsumers();
  }

  return ok
    ? { success: true }
    : { success: false, error: "Delete failed" };
}
