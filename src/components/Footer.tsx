"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  Star,
  MapPin
} from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "@/lib/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer 
      className="relative mt-24 overflow-hidden border-t border-border transition-colors duration-500" 
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        
        {/* Top Branding Section */}
        <div className="mb-16 grid gap-8 rounded-[3rem] border border-border p-10 md:grid-cols-[1.2fr_0.8fr] md:p-12 shadow-2xl bg-card-bg/40 backdrop-blur-xl">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tighter uppercase leading-[0.95] text-foreground">
              SPACES<span className="text-brand">.</span>
            </h2>
            <p className="mt-6 max-w-2xl font-body text-sm leading-relaxed text-muted">
              Thoughtfully designed shared workspaces, private offices, and state-of-the-art virtual office solutions across major cities in India. Designed to inspire your daily work.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-3xl border border-border p-8 bg-secondary/30">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-brand mb-2">
              <Star className="h-3 w-3 fill-current" />
              HQ Office Hours
            </div>
            <p className="font-display text-lg font-bold text-foreground">Monday – Saturday</p>
            <p className="font-mono text-sm text-muted">8:00 AM – 8:00 PM</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          <div className="space-y-8">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Our Spaces
            </h4>
            <nav className="flex flex-col gap-4">
              <FooterLink href="#workspaces">Dedicated Desks</FooterLink>
              <FooterLink href="#workspaces">Private Cabins</FooterLink>
              <FooterLink href="#workspaces">Meeting Rooms</FooterLink>
              <FooterLink href="#workspaces">Virtual Offices</FooterLink>
            </nav>
          </div>

          <div className="space-y-8">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Company
            </h4>
            <nav className="flex flex-col gap-4">
              <FooterLink href="#explore">Features Accordion</FooterLink>
              <FooterLink href="#calculator">Pricing Calculator</FooterLink>
              <FooterLink href="#faqs">Frequently Asked</FooterLink>
              <FooterLink href="#contact">Lead Inquiry</FooterLink>
            </nav>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Get in Touch
            </h4>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border p-6 bg-secondary/10">
                <MapPin className="mb-4 h-5 w-5 text-brand" />
                <p className="mb-2 font-display text-sm font-bold uppercase tracking-tight text-foreground">Mumbai Hub</p>
                <p className="font-body text-[13px] leading-relaxed text-muted">
                  Bandra Kurla Complex, Bandra (East), Mumbai, Maharashtra – 400051
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-4 rounded-2xl border border-border p-4 bg-secondary/10">
                  <Phone className="h-4 w-4 text-brand" />
                  <a href="tel:+912261262700" className="font-mono text-xs font-bold tracking-tight text-foreground hover:text-brand">
                    +91 22 6126 2700
                  </a>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border p-4 bg-secondary/10">
                  <Mail className="h-4 w-4 text-brand" />
                  <a href="mailto:contact@spacesworks.com" className="font-mono text-xs font-bold tracking-tight text-foreground hover:text-brand">
                    contact@spacesworks.com
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <div className="flex gap-3">
                <SocialLink href="https://linkedin.com" label="Linkedin"><Linkedin className="h-4 w-4" /></SocialLink>
                <SocialLink href="https://instagram.com" label="Instagram"><Instagram className="h-4 w-4" /></SocialLink>
                <SocialLink href="https://facebook.com" label="Facebook"><Facebook className="h-4 w-4" /></SocialLink>
                <SocialLink href="https://twitter.com" label="Twitter"><Twitter className="h-4 w-4" /></SocialLink>
              </div>
              <a
                href="https://wa.me/912261262700"
                target="_blank"
                className="flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl hover:bg-emerald-700 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border bg-secondary/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-between gap-6 py-8 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:flex-row">
          <div>
            © {new Date().getFullYear()} SPACES. All Rights Reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="hover:text-brand">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand">Terms of Service</Link>
            <Link href="#" className="hover:text-brand">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between font-display text-sm font-bold tracking-tight text-muted hover:text-foreground transition-all duration-300"
    >
      {children}
      <ArrowUpRight className="h-3 w-3 translate-y-1 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 text-brand" />
    </Link>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-card-bg text-muted-foreground transition-all duration-300 hover:scale-110 active:scale-95 hover:border-brand hover:text-brand"
    >
      {children}
    </a>
  );
}
