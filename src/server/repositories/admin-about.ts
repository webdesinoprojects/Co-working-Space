import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type {
  AdminAboutHeroSectionVM,
  AdminAboutHeroImageVM,
  AdminAboutPillarsSectionVM,
  AdminAboutPillarCardVM,
  AdminAboutStorySectionVM,
  AdminAboutStoryImageVM,
  AdminAboutClientStoryVM,
  AdminImagePreview,
} from "@/features/admin/types";

type ImgRow = {
  file_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

function toAdminImage(
  assetId: string | null,
  row: ImgRow | null
): AdminImagePreview | null {
  if (!row || !assetId) return null;
  return {
    asset_id: assetId,
    url: row.file_url,
    alt: row.alt_text,
    width: row.width,
    height: row.height,
  };
}

async function fetchMediaMap(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ids: (string | null | undefined)[]
): Promise<Record<string, ImgRow>> {
  const filtered = ids.filter((id): id is string => !!id);
  if (filtered.length === 0) return {};
  const { data } = await supabase
    .from("media_assets")
    .select("id, file_url, alt_text, width, height")
    .in("id", filtered);
  const map: Record<string, ImgRow> = {};
  for (const a of data ?? []) {
    map[a.id] = {
      file_url: a.file_url,
      alt_text: a.alt_text,
      width: a.width,
      height: a.height,
    };
  }
  return map;
}

// -- Hero ----------------------------------------------------------------------
export async function getAdminAboutHeroSection(): Promise<AdminAboutHeroSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data: section, error } = await supabase
    .from("about_hero_section")
    .select("id, headline, subtext")
    .eq("section_key", "default")
    .single();

  if (error || !section) {
    console.error("[getAdminAboutHeroSection]", error?.code, error?.message);
    return null;
  }

  const { data: imgRows } = await supabase
    .from("about_hero_images")
    .select("id, section_id, slot, image_asset_id")
    .eq("section_id", section.id)
    .order("slot");

  type SlotRow = { id: string; section_id: string; slot: number; image_asset_id: string | null };
  const rowMap: Record<number, SlotRow> = {};
  for (const r of (imgRows ?? []) as SlotRow[]) rowMap[r.slot] = r;

  const mediaMap = await fetchMediaMap(
    supabase,
    (imgRows ?? []).map((r) => (r as SlotRow).image_asset_id)
  );

  const images: AdminAboutHeroImageVM[] = [1, 2, 3, 4, 5].map((slot) => {
    const row = rowMap[slot];
    return {
      id: row?.id ?? null,
      section_id: section.id,
      slot,
      image_asset_id: row?.image_asset_id ?? null,
      image: row
        ? toAdminImage(row.image_asset_id, mediaMap[row.image_asset_id ?? ""] ?? null)
        : null,
    };
  });

  const d = section as { id: string; headline: string; subtext: string };
  return { id: d.id, headline: d.headline, subtext: d.subtext, images };
}

// -- Pillars/Values ------------------------------------------------------------
export async function getAdminAboutPillarsSection(): Promise<AdminAboutPillarsSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data: section, error } = await supabase
    .from("about_pillars_section")
    .select("id")
    .eq("section_key", "default")
    .single();

  if (error || !section) {
    console.error("[getAdminAboutPillarsSection]", error?.code, error?.message);
    return null;
  }

  const { data: cards } = await supabase
    .from("about_pillar_cards")
    .select("id, section_id, sort_order, icon_key, label, stat, description, is_active")
    .eq("section_id", section.id)
    .order("sort_order");

  return {
    id: (section as { id: string }).id,
    cards: (cards ?? []) as AdminAboutPillarCardVM[],
  };
}

// -- Story ---------------------------------------------------------------------
export async function getAdminAboutStorySection(): Promise<AdminAboutStorySectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data: section, error } = await supabase
    .from("about_story_section")
    .select(
      "id, subheading, heading, body_1, body_2, body_3, belief_1_title, belief_1_text, belief_2_title, belief_2_text"
    )
    .eq("section_key", "default")
    .single();

  if (error || !section) {
    console.error("[getAdminAboutStorySection]", error?.code, error?.message);
    return null;
  }

  const { data: imgRows } = await supabase
    .from("about_story_images")
    .select("id, section_id, slot, image_asset_id")
    .eq("section_id", section.id)
    .order("slot");

  type SlotRow = { id: string; section_id: string; slot: number; image_asset_id: string | null };
  const rowMap: Record<number, SlotRow> = {};
  for (const r of (imgRows ?? []) as SlotRow[]) rowMap[r.slot] = r;

  const mediaMap = await fetchMediaMap(
    supabase,
    (imgRows ?? []).map((r) => (r as SlotRow).image_asset_id)
  );

  const images: AdminAboutStoryImageVM[] = [1, 2, 3, 4].map((slot) => {
    const row = rowMap[slot];
    return {
      id: row?.id ?? null,
      section_id: (section as { id: string }).id,
      slot,
      image_asset_id: row?.image_asset_id ?? null,
      image: row
        ? toAdminImage(row.image_asset_id, mediaMap[row.image_asset_id ?? ""] ?? null)
        : null,
    };
  });

  const d = section as {
    id: string;
    subheading: string;
    heading: string;
    body_1: string;
    body_2: string;
    body_3: string;
    belief_1_title: string;
    belief_1_text: string;
    belief_2_title: string;
    belief_2_text: string;
  };
  return { ...d, images };
}

// -- Client Stories ------------------------------------------------------------
export async function getAdminAboutClientStories(): Promise<AdminAboutClientStoryVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("about_client_stories")
    .select("id, sort_order, tag, author, title, description, icon_key, is_active")
    .order("sort_order");

  if (error) {
    console.error("[getAdminAboutClientStories]", error.code, error.message);
    return [];
  }
  return (data ?? []) as AdminAboutClientStoryVM[];
}
