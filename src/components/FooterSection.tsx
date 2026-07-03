"use client";

import Link from "next/link";
import { ElementType } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
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
      <a href="#" aria-label="WhatsApp" className="text-gray-400 hover:text-[#25D366] transition-colors">
        <MessageCircle size={20} />
      </a>
    </div>
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
  const hasDynamicLinks = socialLinks && socialLinks.length > 0;
  const whatsappHref =
    socialLinks?.find((link) => {
      const platform = link.platform.toLowerCase();
      const iconKey = link.icon_key.toLowerCase();
      return platform === "whatsapp" || iconKey === "whatsapp";
    })?.href ?? "https://wa.me/919639636131";

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
            <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-2">Location</h4>
            <p className="text-[20px] text-white font-semibold">Delhi, Rithala</p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Workspaces</h4>
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
            <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Sitemap</h4>
            {(hasDynamicFooterLinks
              ? sitemapLinks.map((link) => ({ name: link.label, href: link.href }))
              : [
                  { name: "About", href: "/about" },
                  { name: "Offerings", href: "/workspaces" },
                  { name: "Amenities", href: "/#amenities" },
                  { name: "Contact Us", href: "/connect" },
                  { name: "Privacy Policy", href: "#" },
                ]).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[14px] text-gray-300 hover:text-white hover:translate-x-1 transition-all py-2 font-medium uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-0">Visit Us</h4>
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

          {hasDynamicLinks ? (
            <DynamicSocialLinks links={socialLinks} />
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
        <MessageCircle size={28} />
      </a>
    </footer>
  );
}
