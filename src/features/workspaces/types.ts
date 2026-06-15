// Public view model types for workspaces — safe to import in both server and client code.

import type { PublicImageVM } from "@/features/homepage/types";

export type WorkspaceOverviewVM = {
  badge_text: string;
  title: string;
  body_text: string;
};

export type WorkspaceCardVM = {
  id: string;
  slug: string;
  nav_label: string;
  card_title: string;
  card_description: string;
  overview_image: PublicImageVM | null;
  sort_order: number;
};

export type WorkspaceStatVM = {
  value: string;
  label: string;
};

export type WorkspaceGalleryImageVM = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export type WorkspaceMarqueeItemVM = {
  item_text: string;
};

export type WorkspaceMarqueeBandVM = {
  theme: "light" | "dark";
  reverse: boolean;
  items: WorkspaceMarqueeItemVM[];
};

export type WorkspaceAmenityVM = {
  icon_key: string;
  label: string;
};

export type WorkspacePlanFeatureVM = {
  feature_text: string;
  is_included: boolean;
};

export type WorkspacePlanVM = {
  title: string;
  icon_key: string;
  price_text: string | null;
  features: WorkspacePlanFeatureVM[];
};

export type WorkspacePlanSectionVM = {
  badge_text: string;
  title: string;
  plans: WorkspacePlanVM[];
};

export type WorkspaceDetailVM = {
  id: string;
  slug: string;
  nav_label: string;
  hero_title: string;
  hero_description: string;
  cta_label: string;
  cta_href: string;
  video_label: string;
  video_href: string | null;
  hero_images: Array<{
    slot: number;
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
  }>;
  stats: WorkspaceStatVM[];
  gallery: WorkspaceGalleryImageVM[];
  marquee_bands: WorkspaceMarqueeBandVM[];
  amenities: WorkspaceAmenityVM[];
  plan_section: WorkspacePlanSectionVM | null;
  meta_title: string | null;
  meta_description: string | null;
};

export type { PublicImageVM };
