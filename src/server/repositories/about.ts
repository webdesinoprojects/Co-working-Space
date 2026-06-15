import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type {
  AboutHeroSectionVM,
  AboutHeroImageVM,
  AboutPillarCardVM,
  AboutStorySectionVM,
  AboutStoryImageVM,
  AboutClientStoryVM,
} from "@/features/about/types";

type ImgRow = {
  id: string;
  file_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

async function fetchMediaMap(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ids: (string | null | undefined)[]
): Promise<Record<string, ImgRow>> {
  const filtered = Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
  if (filtered.length === 0) return {};
  const { data } = await supabase
    .from("media_assets")
    .select("id, file_url, alt_text, width, height")
    .in("id", filtered)
    .eq("is_published", true);
  const map: Record<string, ImgRow> = {};
  for (const asset of data ?? []) {
    map[asset.id] = {
      id: asset.id,
      file_url: asset.file_url,
      alt_text: asset.alt_text,
      width: asset.width,
      height: asset.height,
    };
  }
  return map;
}

export async function getAboutHeroSection(): Promise<AboutHeroSectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data: section, error } = await supabase
    .from("about_hero_section")
    .select("id, headline, subtext")
    .eq("section_key", "default")
    .single();

  if (error || !section) return null;

  const { data: imgRows } = await supabase
    .from("about_hero_images")
    .select("slot, image_asset_id")
    .eq("section_id", section.id)
    .order("slot");

  const rows = (imgRows ?? []) as { slot: number; image_asset_id: string | null }[];
  const mediaMap = await fetchMediaMap(supabase, rows.map((r) => r.image_asset_id));

  const images: AboutHeroImageVM[] = rows
    .filter((r) => r.image_asset_id && mediaMap[r.image_asset_id])
    .map((r) => {
      const m = mediaMap[r.image_asset_id!];
      return {
        slot: r.slot,
        url: m.file_url,
        alt: m.alt_text ?? "",
        width: m.width,
        height: m.height,
      };
    });

  const d = section as { headline: string; subtext: string };
  return { headline: d.headline, subtext: d.subtext, images };
}

export async function getAboutPillarCards(): Promise<AboutPillarCardVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data: section } = await supabase
    .from("about_pillars_section")
    .select("id")
    .eq("section_key", "default")
    .single();

  if (!section) return [];

  const { data } = await supabase
    .from("about_pillar_cards")
    .select("id, icon_key, label, stat, description, sort_order")
    .eq("section_id", section.id)
    .eq("is_active", true)
    .order("sort_order");

  return (data ?? []) as AboutPillarCardVM[];
}

export async function getAboutStorySection(): Promise<AboutStorySectionVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data: section, error } = await supabase
    .from("about_story_section")
    .select(
      "id, subheading, heading, body_1, body_2, body_3, belief_1_title, belief_1_text, belief_2_title, belief_2_text"
    )
    .eq("section_key", "default")
    .single();

  if (error || !section) return null;

  const { data: imgRows } = await supabase
    .from("about_story_images")
    .select("slot, image_asset_id")
    .eq("section_id", section.id)
    .order("slot");

  const rows = (imgRows ?? []) as { slot: number; image_asset_id: string | null }[];
  const mediaMap = await fetchMediaMap(supabase, rows.map((r) => r.image_asset_id));

  const images: AboutStoryImageVM[] = rows
    .filter((r) => r.image_asset_id && mediaMap[r.image_asset_id])
    .map((r) => {
      const m = mediaMap[r.image_asset_id!];
      return {
        slot: r.slot,
        url: m.file_url,
        alt: m.alt_text ?? "",
        width: m.width,
        height: m.height,
      };
    });

  const d = section as {
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

export async function getAboutClientStories(): Promise<AboutClientStoryVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("about_client_stories")
    .select("id, tag, author, title, description, icon_key, sort_order")
    .eq("is_active", true)
    .order("sort_order");

  return (data ?? []) as AboutClientStoryVM[];
}
