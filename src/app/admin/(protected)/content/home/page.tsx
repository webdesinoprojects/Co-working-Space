import Link from "next/link";
import {
  Image,
  Info,
  MapPin,
  CreditCard,
  LayoutGrid,
  Shield,
  Sparkles,
  MessageCircle,
  Mail,
  Share2,
} from "lucide-react";

const sections = [
  { name: "Hero", href: "/admin/content/home/hero", icon: Image, desc: "Banner headline, subtitle, and CTA buttons" },
  { name: "Introducing Alley", href: "/admin/content/home/introducing-axion", icon: Info, desc: "About section with stats and feature highlights" },
  { name: "Growing Network", href: "/admin/content/home/growing-network", icon: MapPin, desc: "Location cards bento grid" },
  { name: "Memberships", href: "/admin/content/home/memberships", icon: CreditCard, desc: "Pricing plans and their feature lists" },
  { name: "Offerings", href: "/admin/content/home/offerings", icon: LayoutGrid, desc: "Service offerings with included/excluded features" },
  { name: "Why Choose Us", href: "/admin/content/home/why-choose-us", icon: Shield, desc: "Editable benefit cards and section copy" },
  { name: "Amenities", href: "/admin/content/home/amenities", icon: Sparkles, desc: "Facility amenities with icons" },
  { name: "Testimonials", href: "/admin/content/home/testimonials", icon: MessageCircle, desc: "Client testimonials and author avatars" },
  { name: "Contact", href: "/admin/content/home/contact", icon: Mail, desc: "Contact copy, labels, placeholders, and options" },
  { name: "Footer", href: "/admin/content/home/footer-socials", icon: Share2, desc: "Footer sitemap links and social icons" },
];

export default function HomepageOverview() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-1 text-neutral-900">Homepage</h1>
      <p className="text-sm text-neutral-400 mb-8">Select a section below to edit its content.</p>
      <div className="grid grid-cols-2 gap-3">
        {sections.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/60 transition-all group flex items-start gap-4"
          >
            <div className="w-9 h-9 rounded-lg bg-white/60 group-hover:bg-white/80 transition-colors flex items-center justify-center shrink-0 mt-0.5">
              <s.icon className="w-4 h-4 text-neutral-700" />
            </div>
            <div>
              <p className="font-semibold text-sm text-neutral-900 mb-0.5">{s.name}</p>
              <p className="text-xs text-neutral-500 leading-snug">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
