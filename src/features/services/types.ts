import type { PublicImageVM } from "@/features/homepage/types";

export type ServiceItemVM = {
  id: string;
  title: string;
  description: string;
  icon_key: string;
  image: PublicImageVM | null;
  features: string[];
  cta_label: string;
  cta_href: string;
  sort_order: number;
};

export type ServicesPageVM = {
  badge_text: string;
  headline: string;
  intro_text: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  hero_image: PublicImageVM | null;
  highlights: string[];
  services_badge_text: string;
  services_title: string;
  services_intro_text: string;
  items: ServiceItemVM[];
};
