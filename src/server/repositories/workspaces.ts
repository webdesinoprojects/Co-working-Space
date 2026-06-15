import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type {
  WorkspaceOverviewVM,
  WorkspaceCardVM,
  WorkspaceDetailVM,
  WorkspaceStatVM,
  WorkspaceGalleryImageVM,
  WorkspaceMarqueeBandVM,
  WorkspaceAmenityVM,
  WorkspacePlanSectionVM,
  WorkspacePlanVM,
} from "@/features/workspaces/types";

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
    map[asset.id] = { id: asset.id, file_url: asset.file_url, alt_text: asset.alt_text, width: asset.width, height: asset.height };
  }
  return map;
}

export async function getWorkspaceOverview(): Promise<WorkspaceOverviewVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("workspace_overview_sections")
    .select("badge_text, title, body_text")
    .eq("section_key", "default")
    .single();
  if (error || !data) return null;
  const d = data as { badge_text: string; title: string; body_text: string };
  return { badge_text: d.badge_text, title: d.title, body_text: d.body_text };
}

export async function getActiveWorkspaceList(): Promise<WorkspaceCardVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data: rows } = await supabase
    .from("workspaces")
    .select("id, slug, nav_label, card_title, card_description, overview_image_asset_id, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  if (!rows || rows.length === 0) return [];
  type WRow = { id: string; slug: string; nav_label: string; card_title: string; card_description: string; overview_image_asset_id: string | null; sort_order: number };
  const typed = rows as WRow[];
  const mediaMap = await fetchMediaMap(supabase, typed.map((r) => r.overview_image_asset_id));
  return typed.map((r) => {
    const img = r.overview_image_asset_id ? mediaMap[r.overview_image_asset_id] ?? null : null;
    return {
      id: r.id, slug: r.slug, nav_label: r.nav_label, card_title: r.card_title,
      card_description: r.card_description,
      overview_image: img ? { url: img.file_url, alt: img.alt_text ?? "", width: img.width, height: img.height } : null,
      sort_order: r.sort_order,
    };
  });
}

export async function getWorkspaceBySlug(slug: string): Promise<WorkspaceDetailVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .select("id, slug, nav_label, hero_title, hero_description, cta_label, cta_href, video_label, video_href, meta_title, meta_description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (wsError || !workspace) return null;
  type WS = { id: string; slug: string; nav_label: string; hero_title: string; hero_description: string; cta_label: string; cta_href: string; video_label: string; video_href: string | null; meta_title: string | null; meta_description: string | null };
  const ws = workspace as WS;
  const wsId = ws.id;
  const [
    { data: heroImgRows },
    { data: statRows },
    { data: galleryRows },
    { data: bandRows },
    { data: amenityRows },
    { data: planSection },
  ] = await Promise.all([
    supabase.from("workspace_hero_images").select("slot, image_asset_id").eq("workspace_id", wsId).order("slot"),
    supabase.from("workspace_stats").select("value, label").eq("workspace_id", wsId).eq("is_active", true).order("sort_order"),
    supabase.from("workspace_gallery_images").select("image_asset_id, caption").eq("workspace_id", wsId).eq("is_active", true).order("sort_order"),
    supabase.from("workspace_marquee_bands").select("id, theme, reverse").eq("workspace_id", wsId).eq("is_active", true).order("sort_order"),
    supabase.from("workspace_amenities").select("icon_key, label").eq("workspace_id", wsId).eq("is_active", true).order("sort_order"),
    supabase.from("workspace_plan_sections").select("id, badge_text, title").eq("workspace_id", wsId).single(),
  ]);
  type BandRow = { id: string; theme: "light" | "dark"; reverse: boolean };
  const bands = (bandRows ?? []) as BandRow[];
  const bandIds = bands.map((b) => b.id);
  let itemRows: { band_id: string; item_text: string }[] = [];
  if (bandIds.length > 0) {
    const { data: items } = await supabase.from("workspace_marquee_items").select("band_id, item_text").in("band_id", bandIds).eq("is_active", true).order("sort_order");
    itemRows = (items ?? []) as typeof itemRows;
  }
  type PlanSectionRow = { id: string; badge_text: string; title: string };
  const ps = planSection as PlanSectionRow | null;
  let plans: WorkspacePlanVM[] = [];
  if (ps) {
    const { data: planRows } = await supabase.from("workspace_plans").select("id, title, icon_key, price_text").eq("section_id", ps.id).eq("is_active", true).order("sort_order");
    type PlanRow = { id: string; title: string; icon_key: string; price_text: string | null };
    const planTyped = (planRows ?? []) as PlanRow[];
    const planIds = planTyped.map((p) => p.id);
    let featureRows: { plan_id: string; feature_text: string; is_included: boolean }[] = [];
    if (planIds.length > 0) {
      const { data: features } = await supabase.from("workspace_plan_features").select("plan_id, feature_text, is_included").in("plan_id", planIds).order("sort_order");
      featureRows = (features ?? []) as typeof featureRows;
    }
    plans = planTyped.map((p) => ({
      title: p.title, icon_key: p.icon_key, price_text: p.price_text,
      features: featureRows.filter((f) => f.plan_id === p.id).map((f) => ({ feature_text: f.feature_text, is_included: f.is_included })),
    }));
  }
  type HeroImgRow = { slot: number; image_asset_id: string | null };
  type GalleryRow = { image_asset_id: string | null; caption: string | null };
  const heroRows = (heroImgRows ?? []) as HeroImgRow[];
  const gallRows = (galleryRows ?? []) as GalleryRow[];
  const allMediaIds = [...heroRows.map((r) => r.image_asset_id), ...gallRows.map((r) => r.image_asset_id)];
  const mediaMap = await fetchMediaMap(supabase, allMediaIds);
  const hero_images = heroRows
    .filter((r) => r.image_asset_id && mediaMap[r.image_asset_id])
    .map((r) => { const m = mediaMap[r.image_asset_id!]; return { slot: r.slot, url: m.file_url, alt: m.alt_text ?? "", width: m.width, height: m.height }; });
  const gallery: WorkspaceGalleryImageVM[] = gallRows
    .filter((r) => r.image_asset_id && mediaMap[r.image_asset_id])
    .map((r) => { const m = mediaMap[r.image_asset_id!]; return { url: m.file_url, alt: m.alt_text ?? r.caption ?? "", width: m.width, height: m.height }; });
  const marquee_bands: WorkspaceMarqueeBandVM[] = bands.map((b) => ({
    theme: b.theme, reverse: b.reverse,
    items: itemRows.filter((item) => item.band_id === b.id).map((item) => ({ item_text: item.item_text })),
  }));
  type AmenityRow = { icon_key: string; label: string };
  const amenities: WorkspaceAmenityVM[] = ((amenityRows ?? []) as AmenityRow[]).map((a) => ({ icon_key: a.icon_key, label: a.label }));
  type StatRow = { value: string; label: string };
  const stats: WorkspaceStatVM[] = ((statRows ?? []) as StatRow[]).map((s) => ({ value: s.value, label: s.label }));
  const plan_section: WorkspacePlanSectionVM | null = ps ? { badge_text: ps.badge_text, title: ps.title, plans } : null;
  return {
    id: ws.id, slug: ws.slug, nav_label: ws.nav_label,
    hero_title: ws.hero_title, hero_description: ws.hero_description,
    cta_label: ws.cta_label, cta_href: ws.cta_href,
    video_label: ws.video_label, video_href: ws.video_href,
    hero_images, stats, gallery, marquee_bands, amenities, plan_section,
    meta_title: ws.meta_title, meta_description: ws.meta_description,
  };
}
