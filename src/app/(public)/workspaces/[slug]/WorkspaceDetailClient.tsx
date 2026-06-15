"use client";

import WorkspaceLayout from "@/components/WorkspaceLayout";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { ImageBentoGallery } from "@/components/ImageBentoGallery";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { ServicesSection } from "@/components/ServicesSection";
import type { WorkspaceDetailVM } from "@/features/workspaces/types";
import type { ServiceOffering } from "@/components/ServicesSection";
import type { AmenityItem } from "@/components/AmenitiesSection";
import {
  Wifi, ShieldCheck, Car, Armchair, Zap, ThermometerSnowflake, DoorOpen, Wind,
  Phone, Cctv, Coffee, Bus, Users, Sparkles, Printer, Droplets,
  Key, Shield, Bike, Briefcase, Mic, User, Laptop, Monitor, Building,
  Presentation, Video, HelpCircle,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  printer: Printer,
  coffee: Coffee,
  key: Key,
  shield: Shield,
  "shield-check": ShieldCheck,
  bike: Bike,
  briefcase: Briefcase,
  zap: Zap,
  mic: Mic,
  cctv: Cctv,
  bus: Bus,
  users: Users,
  sparkles: Sparkles,
  droplets: Droplets,
  phone: Phone,
  armchair: Armchair,
  thermometer: ThermometerSnowflake,
  "thermometer-snowflake": ThermometerSnowflake,
  door: DoorOpen,
  "door-open": DoorOpen,
  wind: Wind,
  car: Car,
  user: User,
  laptop: Laptop,
  monitor: Monitor,
  building: Building,
  presentation: Presentation,
  video: Video,
};

function resolveIcon(key: string): LucideIcon {
  return ICON_MAP[key.toLowerCase()] ?? HelpCircle;
}

const FALLBACK_IMAGES: [string, string, string] = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
];

export default function WorkspaceDetailClient({ workspace }: { workspace: WorkspaceDetailVM }) {
  // Build hero images tuple — always 3 items
  const heroImgsSorted = [...workspace.hero_images].sort((a, b) => a.slot - b.slot);
  const getHeroImg = (slot: number) =>
    heroImgsSorted.find((i) => i.slot === slot)?.url ?? FALLBACK_IMAGES[slot - 1] ?? FALLBACK_IMAGES[0];
  const heroImages: [string, string, string] = [getHeroImg(1), getHeroImg(2), getHeroImg(3)];

  // Gallery URLs
  const galleryUrls = workspace.gallery.map((g) => g.url);

  // Amenities for AmenitiesSection
  const amenityItems: AmenityItem[] = workspace.amenities.map((a) => ({
    icon: resolveIcon(a.icon_key),
    text: a.label,
  }));

  // Plans for ServicesSection
  const serviceOfferings: ServiceOffering[] = workspace.plan_section
    ? workspace.plan_section.plans.map((p) => ({
        title: p.title,
        icon: resolveIcon(p.icon_key),
        price: p.price_text ?? undefined,
        features: p.features.map((f) => ({ name: f.feature_text, included: f.is_included })),
      }))
    : [];

  const stats = workspace.stats.map((s) => ({ value: s.value, label: s.label }));

  return (
    <WorkspaceLayout
      title={workspace.hero_title}
      description={workspace.hero_description}
      stats={stats}
      images={heroImages}
      ctaLabel={workspace.cta_label}
      ctaHref={workspace.cta_href}
      videoLabel={workspace.video_label}
      videoHref={workspace.video_href}
    >
      {/* First marquee band — right after hero */}
      {workspace.marquee_bands[0] && (
        <InfiniteMarquee
          items={workspace.marquee_bands[0].items.map((item) => item.item_text)}
          reverse={workspace.marquee_bands[0].reverse}
          theme={workspace.marquee_bands[0].theme}
        />
      )}

      {/* Gallery */}
      {galleryUrls.length > 0 && <ImageBentoGallery images={galleryUrls} />}

      {/* Amenities */}
      {amenityItems.length > 0 && <AmenitiesSection amenitiesList={amenityItems} />}

      {/* Second marquee band — after amenities */}
      {workspace.marquee_bands[1] && (
        <InfiniteMarquee
          items={workspace.marquee_bands[1].items.map((item) => item.item_text)}
          reverse={workspace.marquee_bands[1].reverse}
          theme={workspace.marquee_bands[1].theme}
        />
      )}

      {/* Plans / Services */}
      {serviceOfferings.length > 0 && (
        <ServicesSection
          offeringsList={serviceOfferings}
          title={workspace.plan_section?.title ?? "Our Plans"}
        />
      )}
    </WorkspaceLayout>
  );
}
