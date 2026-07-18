"use client";

import Link from "next/link";
import { ElementType } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
  Youtube,
} from "lucide-react";
import type { FooterLinkVM, FooterSocialLinkVM } from "@/features/homepage/types";

const SOCIAL_ICON_MAP: Record<string, ElementType> = {
  facebook: Facebook,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  "message-circle": MessageCircle,
};

function resolveSocialIcon(platform: string, iconKey: string): ElementType | null {
  const key = iconKey.toLowerCase() || platform.toLowerCase();
  return SOCIAL_ICON_MAP[key] ?? SOCIAL_ICON_MAP[platform.toLowerCase()] ?? null;
}

function DynamicSocialLinks({ links }: { links: FooterSocialLinkVM[] }) {
  return (
    <div className="flex items-center gap-5">
      {links.map((link) => {
        const Icon = resolveSocialIcon(link.platform, link.icon_key);

        return (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.label}
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            {Icon ? (
              <Icon size={20} />
            ) : (
              <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                {link.platform.charAt(0).toUpperCase()}
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}

function isWhatsappSocialLink(link: FooterSocialLinkVM): boolean {
  const platform = link.platform.toLowerCase();
  const iconKey = link.icon_key.toLowerCase();
  const label = link.label.toLowerCase();

  return platform === "whatsapp" || iconKey === "whatsapp" || label.includes("whatsapp");
}

function StaticSocialLinks() {
  return (
    <div className="flex items-center gap-5">
      <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
        <Facebook size={20} />
      </a>
      <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
        <Twitter size={20} />
      </a>
      <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
        <Instagram size={20} />
      </a>
      <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
        <Linkedin size={20} />
      </a>
    </div>
  );
}

function normalizeFooterHref(label: string, href: string): string {
  const normalizedLabel = label.trim().toLowerCase();
  if (normalizedLabel === "privacy policy") return "/privacy-policy";
  if (normalizedLabel === "offerings" || normalizedLabel === "services") return "/services";
  return href;
}

function normalizeFooterLabel(label: string): string {
  return label.trim().toLowerCase() === "offerings" ? "Services" : label;
}

function WhatsappIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 448 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.5 32 1.9 131.6 1.9 254c0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157ZM223.9 438.7c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7C49.1 322.8 39.4 288.9 39.4 254c0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6Zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6Z" />
    </svg>
  );
}

export function FooterSection({
  links,
  socialLinks,
  workspaceItems,
}: {
  links?: FooterLinkVM[];
  socialLinks?: FooterSocialLinkVM[];
  workspaceItems?: { slug: string; nav_label: string }[];
}) {
  const sitemapLinks = links?.filter((link) => link.group_key === "sitemap") ?? [];
  const hasDynamicFooterLinks = sitemapLinks.length > 0;
  const hasConfiguredSocialLinks = Boolean(socialLinks && socialLinks.length > 0);
  const footerSocialLinks = socialLinks?.filter((link) => !isWhatsappSocialLink(link)) ?? [];
  const whatsappHref =
    socialLinks?.find((link) => isWhatsappSocialLink(link))?.href ?? "https://wa.me/919639636131";

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-8 rounded-t-[40px] mt-[-40px] relative z-10 border-t border-gray-800">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex flex-col justify-center font-spaceGrotesk w-fit group select-none mb-6">
              <span className="text-[28px] sm:text-[36px] font-black tracking-tighter text-white leading-[0.85]">
                ALLEY
              </span>
              <span className="text-[12px] sm:text-[14px] font-bold tracking-[0.25em] text-[#00A1BA] leading-none mt-1 group-hover:text-[#F26522] transition-colors duration-300">
                WORKSPACE
              </span>
            </Link>
            <h3 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-2">Location</h3>
            <p className="text-[20px] text-white font-semibold">Delhi, Rithala</p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Workspaces</h3>
            {(workspaceItems && workspaceItems.length > 0
              ? workspaceItems
              : [
                  { slug: "dedicated-desks", nav_label: "Dedicated Desks" },
                  { slug: "private-cabins", nav_label: "Private Cabins" },
                  { slug: "meeting-rooms", nav_label: "Meeting Rooms" },
                  { slug: "virtual-office", nav_label: "Virtual Office" },
                ]
            ).map((ws) => (
              <a
                key={ws.slug}
                href={`/workspaces/${ws.slug}`}
                className="text-[14px] text-gray-300 hover:text-white hover:translate-x-1 transition-all py-2 font-medium"
              >
                {ws.nav_label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Sitemap</h3>
            {(hasDynamicFooterLinks
              ? sitemapLinks.map((link) => ({
                  key: link.id,
                  name: normalizeFooterLabel(link.label),
                  href: normalizeFooterHref(link.label, link.href),
                }))
              : [
                  { key: "about", name: "About", href: "/about" },
                  { key: "services", name: "Services", href: "/services" },
                  { key: "amenities", name: "Amenities", href: "/#amenities" },
                  { key: "contact", name: "Contact Us", href: "/connect" },
                  { key: "privacy-policy", name: "Privacy Policy", href: "/privacy-policy" },
                ]).map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-[14px] text-gray-300 hover:text-white hover:translate-x-1 transition-all py-2 font-medium uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-0">Visit Us</h3>
            <div className="relative w-full h-[250px] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.0871%2C28.7008%2C77.1271%2C28.7408&layer=mapnik&marker=28.7208%2C77.1071"
                title="Rithala, Delhi Map"
              ></iframe>
              <div className="absolute top-3 left-3 bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none">
                OpenStreetMap
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-8 border-b border-gray-800">
          <p className="text-[12px] text-gray-500 font-medium">
            Note: Amenities may vary center to center and all the pictures used in the website may differ from the actual.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="text-[13px] text-gray-500 font-medium">
            &copy; Copyright 2022 - {new Date().getFullYear()} | Alley Workspace | All Rights Reserved
          </div>

          {hasConfiguredSocialLinks ? (
            footerSocialLinks.length > 0 ? (
              <DynamicSocialLinks links={footerSocialLinks} />
            ) : null
          ) : (
            <StaticSocialLinks />
          )}
        </div>
      </div>

      <a
        href={whatsappHref}
        aria-label="WhatsApp"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-110"
      >
        <WhatsappIcon size={28} />
      </a>
    </footer>
  );
}
