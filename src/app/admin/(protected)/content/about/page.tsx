import Link from "next/link";
import { ImageIcon, Star, BookOpen, Users } from "lucide-react";

const SECTIONS = [
  {
    href: "/admin/content/about/hero",
    icon: ImageIcon,
    label: "Hero",
    desc: "Headline, subtext, and 5 bento image slots",
  },
  {
    href: "/admin/content/about/values",
    icon: Star,
    label: "Three Pillars",
    desc: "Location, speed, experience cards",
  },
  {
    href: "/admin/content/about/story",
    icon: BookOpen,
    label: "Our Story",
    desc: "Story text, belief cards, and 4 image grid",
  },
  {
    href: "/admin/content/about/client-stories",
    icon: Users,
    label: "Client Stories",
    desc: "6 client story cards - sortable, add/edit/delete",
  },
];

export default function AboutOverviewPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-1">
          Content
        </p>
        <h1 className="text-2xl font-bold text-neutral-900">About Us</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Edit each section of the public /about page.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-white/80 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-neutral-200 transition-colors">
                <Icon className="w-5 h-5 text-neutral-700" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">{label}</p>
                <p className="text-sm text-neutral-500 mt-0.5">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
