import "server-only";
import { createSupabaseServerClient } from "@/server/db/client";
import type {
  AdminWorkspaceListItemVM,
  AdminWorkspaceEditorVM,
  AdminWorkspaceHeroImageVM,
  AdminWorkspaceStatVM,
  AdminWorkspaceGalleryImageVM,
  AdminWorkspaceMarqueeBandVM,
  AdminWorkspaceMarqueeItemVM,
  AdminWorkspaceAmenityVM,
  AdminWorkspacePlanSectionVM,
  AdminWorkspacePlanVM,
  AdminWorkspacePlanFeatureVM,
  AdminWorkspaceOverviewVM,
  AdminImagePreview,
} from "@/features/admin/types";

type ImgRow = {
  file_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

function toAdminImage(assetId: string | null, row: ImgRow | null): AdminImagePreview | null {
  if (!row || !assetId) return null;
  return { asset_id: assetId, url: row.file_url, alt: row.alt_text, width: row.width, height: row.height };
}

async function fetchMediaMap(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ids: (string | null | undefined)[]
): Promise<Record<string, ImgRow>> {
  const filtered = Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
  if (filtered.length === 0) return {};
  const { data } = await supabase
    .from("media_assets")
    .select("id, file_url, alt_text, width, height")
    .in("id", filtered);
  const map: Record<string, ImgRow> = {};
  for (const a of data ?? []) {
    map[a.id] = { file_url: a.file_url, alt_text: a.alt_text, width: a.width, height: a.height };
  }
  return map;
}

export async function getAdminWorkspaceOverview(): Promise<AdminWorkspaceOverviewVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("workspace_overview_sections")
    .select("id, badge_text, title, body_text")
    .eq("section_key", "default")
    .single();
  if (error || !data) return null;
  const d = data as { id: string; badge_text: string; title: string; body_text: string };
  return { id: d.id, badge_text: d.badge_text, title: d.title, body_text: d.body_text };
}

export async function getAdminWorkspaceList(): Promise<AdminWorkspaceListItemVM[]> {
  const supabase = await createSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from("workspaces")
    .select("id, slug, nav_label, card_title, sort_order, is_active, is_featured, overview_image_asset_id")
    .order("sort_order");
  if (error || !rows) return [];
  type WRow = { id: string; slug: string; nav_label: string; card_title: string; sort_order: number; is_active: boolean; is_featured: boolean; overview_image_asset_id: string | null };
  const typed = rows as WRow[];
  const mediaMap = await fetchMediaMap(supabase, typed.map((r) => r.overview_image_asset_id));
  return typed.map((r) => ({
    id: r.id, slug: r.slug, nav_label: r.nav_label, card_title: r.card_title,
    sort_order: r.sort_order, is_active: r.is_active, is_featured: r.is_featured,
    overview_image: toAdminImage(r.overview_image_asset_id, r.overview_image_asset_id ? mediaMap[r.overview_image_asset_id] ?? null : null),
  }));
}

export async function getAdminWorkspaceBySlug(slug: string): Promise<AdminWorkspaceEditorVM | null> {
  const supabase = await createSupabaseServerClient();
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("id, slug, nav_label, card_title, card_description, overview_image_asset_id, hero_title, hero_description, cta_label, cta_href, video_label, video_href, sort_order, is_active, is_featured, meta_title, meta_description")
    .eq("slug", slug)
    .single();
  if (error || !workspace) return null;
  type WS = { id: string; slug: string; nav_label: string; card_title: string; card_description: string; overview_image_asset_id: string | null; hero_title: string; hero_description: string; cta_label: string; cta_href: string; video_label: string; video_href: string | null; sort_order: number; is_active: boolean; is_featured: boolean; meta_title: string | null; meta_description: string | null };
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
    supabase.from("workspace_hero_images").select("id, workspace_id, slot, image_asset_id").eq("workspace_id", wsId).order("slot"),
    supabase.from("workspace_stats").select("id, workspace_id, value, label, sort_order, is_active").eq("workspace_id", wsId).order("sort_order"),
    supabase.from("workspace_gallery_images").select("id, workspace_id, sort_order, image_asset_id, caption, is_active").eq("workspace_id", wsId).order("sort_order"),
    supabase.from("workspace_marquee_bands").select("id, workspace_id, theme, reverse, sort_order, is_active").eq("workspace_id", wsId).order("sort_order"),
    supabase.from("workspace_amenities").select("id, workspace_id, icon_key, label, sort_order, is_active").eq("workspace_id", wsId).order("sort_order"),
    supabase.from("workspace_plan_sections").select("id, workspace_id, badge_text, title").eq("workspace_id", wsId).single(),
  ]);

  type HeroRow = { id: string; workspace_id: string; slot: number; image_asset_id: string | null };
  type StatRow = { id: string; workspace_id: string; value: string; label: string; sort_order: number; is_active: boolean };
  type GallRow = { id: string; workspace_id: string; sort_order: number; image_asset_id: string | null; caption: string | null; is_active: boolean };
  type BandRow = { id: string; workspace_id: string; theme: "light" | "dark"; reverse: boolean; sort_order: number; is_active: boolean };
  type AmenRow = { id: string; workspace_id: string; icon_key: string; label: string; sort_order: number; is_active: boolean };
  type PSRow = { id: string; workspace_id: string; badge_text: string; title: string };

  const heroRowsTyped = (heroImgRows ?? []) as HeroRow[];
  const statRowsTyped = (statRows ?? []) as StatRow[];
  const gallRowsTyped = (galleryRows ?? []) as GallRow[];
  const bandRowsTyped = (bandRows ?? []) as BandRow[];
  const amenRowsTyped = (amenityRows ?? []) as AmenRow[];
  const ps = planSection as PSRow | null;

  const bandIds = bandRowsTyped.map((b) => b.id);
  let itemRows: { id: string; band_id: string; item_text: string; sort_order: number; is_active: boolean }[] = [];
  if (bandIds.length > 0) {
    const { data: items } = await supabase.from("workspace_marquee_items").select("id, band_id, item_text, sort_order, is_active").in("band_id", bandIds).order("sort_order");
    itemRows = (items ?? []) as typeof itemRows;
  }

  let planSectionVM: AdminWorkspacePlanSectionVM | null = null;
  if (ps) {
    const { data: planRows } = await supabase.from("workspace_plans").select("id, section_id, title, icon_key, price_text, sort_order, is_active").eq("section_id", ps.id).order("sort_order");
    type PlanRow = { id: string; section_id: string; title: string; icon_key: string; price_text: string | null; sort_order: number; is_active: boolean };
    const planTyped = (planRows ?? []) as PlanRow[];
    const planIds = planTyped.map((p) => p.id);
    let featureRows: { id: string; plan_id: string; feature_text: string; is_included: boolean; sort_order: number }[] = [];
    if (planIds.length > 0) {
      const { data: features } = await supabase.from("workspace_plan_features").select("id, plan_id, feature_text, is_included, sort_order").in("plan_id", planIds).order("sort_order");
      featureRows = (features ?? []) as typeof featureRows;
    }
    const plansVM: AdminWorkspacePlanVM[] = planTyped.map((p) => ({
      id: p.id, section_id: p.section_id, title: p.title, icon_key: p.icon_key,
      price_text: p.price_text, sort_order: p.sort_order, is_active: p.is_active,
      features: featureRows.filter((f) => f.plan_id === p.id).map((f): AdminWorkspacePlanFeatureVM => ({
        id: f.id, plan_id: f.plan_id, feature_text: f.feature_text, is_included: f.is_included, sort_order: f.sort_order,
      })),
    }));
    planSectionVM = { id: ps.id, workspace_id: ps.workspace_id, badge_text: ps.badge_text, title: ps.title, plans: plansVM };
  }

  const allMediaIds = [
    ws.overview_image_asset_id,
    ...heroRowsTyped.map((r) => r.image_asset_id),
    ...gallRowsTyped.map((r) => r.image_asset_id),
  ];
  const mediaMap = await fetchMediaMap(supabase, allMediaIds);

  const heroRowMap: Record<number, HeroRow> = {};
  for (const r of heroRowsTyped) heroRowMap[r.slot] = r;
  const hero_images: AdminWorkspaceHeroImageVM[] = [1, 2, 3].map((slot) => {
    const row = heroRowMap[slot];
    return {
      id: row?.id ?? null,
      workspace_id: wsId,
      slot,
      image_asset_id: row?.image_asset_id ?? null,
      image: row ? toAdminImage(row.image_asset_id, row.image_asset_id ? mediaMap[row.image_asset_id] ?? null : null) : null,
    };
  });

  const stats: AdminWorkspaceStatVM[] = statRowsTyped.map((s) => ({
    id: s.id, workspace_id: s.workspace_id, value: s.value, label: s.label, sort_order: s.sort_order, is_active: s.is_active,
  }));

  const gallery: AdminWorkspaceGalleryImageVM[] = gallRowsTyped.map((g) => ({
    id: g.id, workspace_id: g.workspace_id, sort_order: g.sort_order,
    image_asset_id: g.image_asset_id,
    image: toAdminImage(g.image_asset_id, g.image_asset_id ? mediaMap[g.image_asset_id] ?? null : null),
    caption: g.caption, is_active: g.is_active,
  }));

  const marquee_bands: AdminWorkspaceMarqueeBandVM[] = bandRowsTyped.map((b) => ({
    id: b.id, workspace_id: b.workspace_id, theme: b.theme, reverse: b.reverse,
    sort_order: b.sort_order, is_active: b.is_active,
    items: itemRows.filter((item) => item.band_id === b.id).map((item): AdminWorkspaceMarqueeItemVM => ({
      id: item.id, band_id: item.band_id, item_text: item.item_text, sort_order: item.sort_order, is_active: item.is_active,
    })),
  }));

  const amenities: AdminWorkspaceAmenityVM[] = amenRowsTyped.map((a) => ({
    id: a.id, workspace_id: a.workspace_id, icon_key: a.icon_key, label: a.label, sort_order: a.sort_order, is_active: a.is_active,
  }));

  return {
    id: ws.id, slug: ws.slug, nav_label: ws.nav_label, card_title: ws.card_title, card_description: ws.card_description,
    overview_image_asset_id: ws.overview_image_asset_id,
    overview_image: toAdminImage(ws.overview_image_asset_id, ws.overview_image_asset_id ? mediaMap[ws.overview_image_asset_id] ?? null : null),
    hero_title: ws.hero_title, hero_description: ws.hero_description,
    cta_label: ws.cta_label, cta_href: ws.cta_href,
    video_label: ws.video_label, video_href: ws.video_href,
    sort_order: ws.sort_order, is_active: ws.is_active, is_featured: ws.is_featured,
    meta_title: ws.meta_title, meta_description: ws.meta_description,
    hero_images, stats, gallery, marquee_bands, amenities,
    plan_section: planSectionVM,
  };
}
