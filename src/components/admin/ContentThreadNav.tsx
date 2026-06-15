"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const contentTree = [
  {
    section: "Homepage",
    base: "/admin/content/home",
    items: [
      { name: "Hero", href: "/hero" },
      { name: "Introducing Axion", href: "/introducing-axion" },
      { name: "Growing Network", href: "/growing-network" },
      { name: "Memberships", href: "/memberships" },
      { name: "Offerings", href: "/offerings" },
      { name: "Why Choose Us", href: "/why-choose-us" },
      { name: "Amenities", href: "/amenities" },
      { name: "Testimonials", href: "/testimonials" },
      { name: "Contact", href: "/contact" },
      { name: "Footer", href: "/footer-socials" },
    ]
  },
  {
    section: "About Us",
    base: "/admin/content/about",
    items: [
      { name: "Hero", href: "/hero" },
      { name: "Story", href: "/story" },
      { name: "Values", href: "/values" },
      { name: "Client Stories", href: "/client-stories" },
    ]
  },
  {
    section: "Workspaces",
    base: "/admin/content/workspaces",
    items: [
      { name: "All Workspaces", href: "" },
    ]
  },
  {
    section: "FAQ",
    base: "/admin/content/faq",
    items: [
      { name: "All FAQs", href: "" }
    ]
  }
];

export function ContentThreadNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-neutral-100">
        <h2 className="font-semibold text-sm text-neutral-900 tracking-wide uppercase">Content Editor</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {contentTree.map((group) => (
          <div key={group.section}>
            <Link
              href={group.base}
              className={`block px-2 mb-2 rounded-md transition-colors ${
                pathname === group.base
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <span className="text-xs font-semibold tracking-wider uppercase">
                {group.section}
              </span>
            </Link>
            <div className="space-y-0.5 border-l-2 border-neutral-100 ml-3 pl-2">
              {group.items.map((item) => {
                const fullHref = `${group.base}${item.href}`;
                const isActive = pathname === fullHref || (item.href === "" && pathname === group.base);
                
                return (
                  <Link
                    key={item.name}
                    href={fullHref}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? "text-neutral-900 bg-neutral-100 font-medium"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    {isActive && <ChevronRight className="w-3.5 h-3.5 -ml-1 text-neutral-400" />}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
