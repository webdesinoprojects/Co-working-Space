import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type { MediaAssetVM, MediaAssetListVM } from "@/features/admin/types";
import type { MediaAssetInput } from "@/server/validators/media";

export type MediaFilter = {
  folder?: string;
  search?: string;
  sort?: "newest" | "oldest" | "name_asc" | "name_desc";
  page?: number;
  pageSize?: number;
};

const MEDIA_COLUMNS =
  "id, provider_file_id, file_key, file_url, file_name, alt_text, width, height, mime_type, folder, is_published, created_at";

export async function listMediaAssets(
  filter: MediaFilter = {}
): Promise<MediaAssetListVM> {
  const { folder, search, sort = "newest", page = 1, pageSize = 24 } = filter;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("media_assets")
    .select(MEDIA_COLUMNS, { count: "exact" })
    .range(from, to);

  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "name_asc") {
    query = query.order("file_name", { ascending: true, nullsFirst: false });
  } else if (sort === "name_desc") {
    query = query.order("file_name", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  if (folder) {
    query = query.eq("folder", folder);
  }
  if (search) {
    const term = search.trim().replaceAll(",", " ");
    const wildcard = `%${term}%`;
    const clauses = [
      `file_name.ilike.${wildcard}`,
      `alt_text.ilike.${wildcard}`,
      `folder.ilike.${wildcard}`,
      `mime_type.ilike.${wildcard}`,
      `provider_file_id.ilike.${wildcard}`,
      `file_key.ilike.${wildcard}`,
    ];

    if (uuidPattern.test(term)) {
      clauses.push(`id.eq.${term}`);
    }

    query = query.or(clauses.join(","));
  }

  const { data, error, count } = await query;

  if (error) return { items: [], total: 0 };

  return {
    items: (data ?? []) as MediaAssetVM[],
    total: count ?? 0,
  };
}

export async function getMediaAsset(id: string): Promise<MediaAssetVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select(MEDIA_COLUMNS)
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return data as MediaAssetVM;
}

export async function createMediaAsset(
  input: MediaAssetInput & { created_by?: string }
): Promise<MediaAssetVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      file_key: input.file_key,
      provider_file_id: input.provider_file_id ?? null,
      file_url: input.file_url,
      file_name: input.file_name ?? null,
      alt_text: input.alt_text ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
      mime_type: input.mime_type ?? null,
      folder: input.folder ?? null,
      is_published: input.is_published ?? true,
      created_by: input.created_by ?? null,
    })
    .select(MEDIA_COLUMNS)
    .single();

  if (error || !data) return null;

  return data as MediaAssetVM;
}

export async function updateMediaAsset(
  id: string,
  updates: {
    alt_text?: string | null;
    is_published?: boolean;
    folder?: string | null;
  }
): Promise<MediaAssetVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media_assets")
    .update(updates)
    .eq("id", id)
    .select(MEDIA_COLUMNS)
    .single();

  if (error || !data) return null;

  return data as MediaAssetVM;
}

export async function deleteMediaAsset(id: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  return !error;
}
