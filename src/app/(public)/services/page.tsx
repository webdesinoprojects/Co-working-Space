import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Coffee,
  Key,
  Laptop,
  MapPin,
  Monitor,
  Phone,
  PhoneCall,
  Presentation,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { toUrlSlug } from "@/lib/slug";
import { getServicesPage } from "@/server/repositories/services";
import { getPublicPageMetadata } from "@/server/seo";
import type { ServicesPageVM } from "@/features/services/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata("/services");
}

const ICONS: Record<string, LucideIcon> = {
  building: Building2,
  briefcase: Briefcase,
  laptop: Laptop,
  monitor: Monitor,
  presentation: Presentation,
  video: Video,
  users: Users,
  key: Key,
  shield: ShieldCheck,
  "map-pin": MapPin,
  phone: Phone,
  wifi: Wifi,
  coffee: Coffee,
  printer: Printer,
  zap: Zap,
  sparkles: Sparkles,
};

const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1280&q=85";

function serviceIcon(iconKey: string): LucideIcon {
  return ICONS[iconKey] ?? Building2;
}

function buildServicesJsonLd(page: ServicesPageVM) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.services_title,
    url: `${SITE_URL}/services`,
    itemListElement: page.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.title,
        description: item.description,
        url: `${SITE_URL}/services#${toUrlSlug(item.title)}`,
        provider: {
          "@type": "LocalBusiness",
          name: SITE_NAME,
        },
        areaServed: {
          "@type": "City",
          name: "Delhi",
        },
      },
    })),
  };
}

export default async function ServicesPage() {
  const page = await getServicesPage();
  const jsonLd = buildServicesJsonLd(page);

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <section className="relative overflow-hidden bg-[#F5F7F6] pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pb-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-12">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[12px] font-bold uppercase text-gray-700 shadow-sm">
              <Building2 className="h-4 w-4 text-[#F26522]" />
              {page.badge_text}
            </div>
            <h1 className="font-spaceGrotesk text-[clamp(2.4rem,5.3vw,4.65rem)] font-bold leading-[1.02] text-gray-950">
              {page.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
              {page.intro_text}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={page.primary_cta_href}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#F26522] px-6 py-3 text-[15px] font-semibold text-white shadow-lg shadow-[#F26522]/25 transition-colors hover:bg-[#e05a1a]"
              >
                {page.primary_cta_label}
                <PhoneCall className="h-4 w-4" />
              </Link>
              <Link
                href={page.secondary_cta_href}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-3 text-[15px] font-semibold text-gray-900 transition-colors hover:border-gray-900"
              >
                {page.secondary_cta_label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[380px] overflow-hidden rounded-3xl bg-gray-200 shadow-2xl shadow-black/10 sm:min-h-[500px]">
            <img
              src={page.hero_image?.url ?? FALLBACK_HERO_IMAGE}
              alt={page.hero_image?.alt || "Modern coworking office with shared desks"}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-[12px] font-bold uppercase text-white/75">
                <MapPin className="h-4 w-4 text-[#00A1BA]" />
                Delhi, Rithala
              </div>
              <div className="grid gap-3">
                {page.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl bg-white/12 p-3 text-sm font-medium text-white backdrop-blur-md">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F26522]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.78fr_1fr] lg:items-end">
            <div>
              <p className="mb-3 text-[12px] font-bold uppercase text-[#00A1BA]">
                {page.services_badge_text}
              </p>
              <h2 className="font-spaceGrotesk text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.05] text-gray-950">
                {page.services_title}
              </h2>
            </div>
            <p className="max-w-2xl text-[16px] leading-relaxed text-gray-600 lg:ml-auto">
              {page.services_intro_text}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {page.items.map((item) => {
              const Icon = serviceIcon(item.icon_key);
              const anchorId = toUrlSlug(item.title);
              return (
                <article
                  key={item.id}
                  id={anchorId}
                  className="group flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[#F7F8F7] p-6 text-gray-950 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/70 sm:p-7"
                >
                  {item.image && (
                    <div className="relative -mx-6 -mt-6 mb-6 h-52 overflow-hidden bg-gray-200 sm:-mx-7 sm:-mt-7">
                      <img
                        src={item.image.url}
                        alt={item.image.alt || `${item.title} workspace service at Alley Workspace`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gray-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-spaceGrotesk text-2xl font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>

                  {item.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00A1BA]" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto pt-7">
                    <Link
                      href={item.cta_href}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                    >
                      {item.cta_label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
