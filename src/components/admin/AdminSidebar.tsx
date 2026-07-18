"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  MessageSquare,
  LogOut,
  Sparkles,
} from "lucide-react";
import type { WorkspaceNavItem } from "@/components/WorkspaceNavContext";

// ─── Nav tree ─────────────────────────────────────────────────────────────────

const baseContentGroups = [
  {
    section: "Homepage",
    base: "/admin/content/home",
    items: [
      { name: "Hero", href: "/hero" },
      { name: "Introducing Alley", href: "/introducing-axion" },
      { name: "Growing Network", href: "/growing-network" },
      { name: "Memberships", href: "/memberships" },
      { name: "Offerings", href: "/offerings" },
      { name: "Why Choose Us", href: "/why-choose-us" },
      { name: "Amenities", href: "/amenities" },
      { name: "Testimonials", href: "/testimonials" },
      { name: "Contact", href: "/contact" },
      { name: "Footer", href: "/footer-socials" },
    ],
  },
  {
    section: "About Us",
    base: "/admin/content/about",
    items: [
      { name: "Hero", href: "/hero" },
      { name: "Story", href: "/story" },
      { name: "Values", href: "/values" },
      { name: "Client Stories", href: "/client-stories" },
    ],
  },
  {
    section: "Workspaces",
    base: "/admin/content/workspaces",
    items: [{ name: "All Workspaces", href: "" }],
  },
  {
    section: "Services",
    base: "/admin/content/services",
    items: [{ name: "Services Page", href: "" }],
  },
  {
    section: "FAQ",
    base: "/admin/content/faq",
    items: [{ name: "All FAQs", href: "" }],
  },
  {
    section: "SEO",
    base: "/admin/content/seo",
    items: [{ name: "All Pages", href: "" }],
  },
  {
    section: "Legal",
    base: "/admin/content/privacy-policy",
    items: [{ name: "Privacy Policy", href: "" }],
  },
];

const topItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon, exact: false },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare, exact: false },
];

export function AdminSidebar({
  isOpen,
  workspaceItems = [],
}: {
  isOpen: boolean;
  onToggle?: () => void;
  workspaceItems?: WorkspaceNavItem[];
}) {
  const pathname = usePathname();
  const contentGroups = baseContentGroups.map((group) =>
    group.section === "Workspaces"
      ? {
          ...group,
          items: [
            { name: "All Workspaces", href: "" },
            ...workspaceItems.map((workspace) => ({
              name: workspace.nav_label,
              href: `/${workspace.slug}`,
            })),
          ],
        }
      : group
  );

  if (!isOpen) return null;

  return (
    <aside className="w-[280px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[2rem] m-4 flex flex-col shrink-0 overflow-hidden z-20 text-neutral-900">
      {/* Logo Area */}
      <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">Alley</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-8 scrollbar-hide">
        
        {/* Main Menu */}
        <div className="space-y-1">
          {topItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-md font-medium"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 font-medium"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-neutral-400"}`} />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Section (acting like "TEAMS" in the mock) */}
        {contentGroups.map((group) => {
          return (
            <div key={group.section}>
              <h3 className="px-4 mb-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                {group.section}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const href = group.base + item.href;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={item.name}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "text-neutral-900 font-semibold"
                          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 font-medium"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-neutral-900" : "bg-neutral-300"}`} />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-neutral-100 mt-auto">
        {/* POST form, not a <Link>: a GET logout route gets prefetched by
            Next.js in production and signs the user out automatically. */}
        <form action="/admin/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium mt-1"
          >
            <LogOut className="w-5 h-5 text-neutral-400" />
            <span className="text-[15px]">Log out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
