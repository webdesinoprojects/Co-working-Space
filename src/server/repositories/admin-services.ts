import "server-only";
import { SERVICES_PAGE_DEFAULT } from "@/lib/services-defaults";
import { createSupabaseServerClient } from "@/server/db/client";
import type {
  AdminImagePreview,
  AdminServiceItemVM,
  AdminServicesPageVM,
} from "@/features/admin/types";

type ImgRow = {
  file_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

type ServicesPageRow = {
  page_key: string;
  badge_text: string;
  headline: string;
  intro_text: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  hero_image_asset_id: string | null;
  highlights: unknown;
  services_badge_text: string;
  services_title: string;
  services_intro_text: string;
};

type ServiceItemRow = {
  id: string;
  title: string;
  description: string;
  icon_key: string;
  image_asset_id: string | null;
  features: unknown;
  cta_label: string;
  cta_href: string;
  sort_order: number;
  is_active: boolean;
};

function parseStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
}

function toAdminImage(
  assetId: string | null,
  row: ImgRow | null | undefined
): AdminImagePreview | null {
  if (!assetId || !row) return null;
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
  const filtered = Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
  if (filtered.length === 0) return {};

  const { data } = await supabase
    .from("media_assets")
    .select("id, file_url, alt_text, width, height")
    .in("id", filtered);

  const map: Record<string, ImgRow> = {};
  for (const asset of data ?? []) {
    map[asset.id] = {
      file_url: asset.file_url,
      alt_text: asset.alt_text,
      width: asset.width,
      height: asset.height,
    };
  }
  return map;
}

export async function getAdminServicesPage(): Promise<AdminServicesPageVM> {
  const supabase = await createSupabaseServerClient();
  const { data: pageData, error: pageError } = await supabase
    .from("services_pages")
    .select(
      "page_key, badge_text, headline, intro_text, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, hero_image_asset_id, highlights, services_badge_text, services_title, services_intro_text"
    )
    .eq("page_key", "default")
    .single();

  const { data: itemsData, error: itemsError } = await supabase
    .from("services_page_items")
    .select("id, title, description, icon_key, image_asset_id, features, cta_label, cta_href, sort_order, is_active")
    .order("sort_order");

  if (pageError || !pageData || itemsError) {
    return {
      page_key: "default",
      badge_text: SERVICES_PAGE_DEFAULT.badge_text,
      headline: SERVICES_PAGE_DEFAULT.headline,
      intro_text: SERVICES_PAGE_DEFAULT.intro_text,
      primary_cta_label: SERVICES_PAGE_DEFAULT.primary_cta_label,
      primary_cta_href: SERVICES_PAGE_DEFAULT.primary_cta_href,
      secondary_cta_label: SERVICES_PAGE_DEFAULT.secondary_cta_label,
      secondary_cta_href: SERVICES_PAGE_DEFAULT.secondary_cta_href,
      hero_image_asset_id: null,
      hero_image: null,
      highlights: SERVICES_PAGE_DEFAULT.highlights,
      services_badge_text: SERVICES_PAGE_DEFAULT.services_badge_text,
      services_title: SERVICES_PAGE_DEFAULT.services_title,
      services_intro_text: SERVICES_PAGE_DEFAULT.services_intro_text,
      items: [],
    };
  }

  const page = pageData as ServicesPageRow;
  const rows = (itemsData ?? []) as ServiceItemRow[];
  const mediaMap = await fetchMediaMap(supabase, [
    page.hero_image_asset_id,
    ...rows.map((item) => item.image_asset_id),
  ]);

  const items: AdminServiceItemVM[] = rows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon_key: item.icon_key,
      image_asset_id: item.image_asset_id,
      image: toAdminImage(item.image_asset_id, mediaMap[item.image_asset_id ?? ""]),
      features: parseStringArray(item.features, []),
      cta_label: item.cta_label,
      cta_href: item.cta_href,
      sort_order: item.sort_order,
      is_active: item.is_active,
    }));

  return {
    page_key: page.page_key,
    badge_text: page.badge_text,
    headline: page.headline,
    intro_text: page.intro_text,
    primary_cta_label: page.primary_cta_label,
    primary_cta_href: page.primary_cta_href,
    secondary_cta_label: page.secondary_cta_label,
    secondary_cta_href: page.secondary_cta_href,
    hero_image_asset_id: page.hero_image_asset_id,
    hero_image: toAdminImage(page.hero_image_asset_id, mediaMap[page.hero_image_asset_id ?? ""]),
    highlights: parseStringArray(page.highlights, SERVICES_PAGE_DEFAULT.highlights),
    services_badge_text: page.services_badge_text,
    services_title: page.services_title,
    services_intro_text: page.services_intro_text,
    items,
  };
}
