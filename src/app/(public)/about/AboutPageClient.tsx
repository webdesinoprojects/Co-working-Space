"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import {
  Building2,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Orbit,
  Fingerprint,
  Gem,
  Radar,
  Aperture,
  Satellite,
} from "lucide-react";
import type {
  AboutHeroSectionVM,
  AboutPillarCardVM,
  AboutStorySectionVM,
  AboutClientStoryVM,
} from "@/features/about/types";

// -- Icon maps -----------------------------------------------------------------

const PILLAR_ICON_MAP: Record<string, React.ElementType> = {
  "building-2": Building2,
  zap: Zap,
  "shield-check": ShieldCheck,
};

const CLIENT_STORY_ICON_MAP: Record<string, React.ElementType> = {
  orbit: Orbit,
  fingerprint: Fingerprint,
  gem: Gem,
  radar: Radar,
  aperture: Aperture,
  satellite: Satellite,
};

// -- Fallbacks -----------------------------------------------------------------

const FB_HERO_IMGS = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80",
];
const FB_STORY_IMGS = [
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=600&q=80",
];
const FB_PILLARS: AboutPillarCardVM[] = [
  {
    id: "fallback-location",
    icon_key: "building-2",
    label: "Location",
    stat: "Noida & Delhi",
    description: "Business-ready workspaces in strong commercial zones.",
    sort_order: 0,
  },
  {
    id: "fallback-speed",
    icon_key: "zap",
    label: "Move-in Speed",
    stat: "24 Hours",
    description: "A faster path from first conversation to operational office space.",
    sort_order: 10,
  },
  {
    id: "fallback-experience",
    icon_key: "shield-check",
    label: "Experience",
    stat: "Premium",
    description: "Professional interiors, managed operations, and strong daily usability.",
    sort_order: 20,
  },
];
const FB_CLIENT_STORIES: AboutClientStoryVM[] = [
  {
    id: "fallback-team-growth",
    tag: "Team Growth",
    author: "Startup Operations Team",
    title: "Startup Team Finds Room to Grow",
    description: "See how a fast-moving team gained flexibility, privacy, and a better client-facing setup.",
    icon_key: "orbit",
    sort_order: 0,
  },
  {
    id: "fallback-deep-work",
    tag: "Deep Work",
    author: "Independent Consultant",
    title: "Freelancers Finally Found Their Focus",
    description: "A calmer workspace, reliable amenities, and a stronger routine made daily work smoother.",
    icon_key: "fingerprint",
    sort_order: 10,
  },
  {
    id: "fallback-meeting-ready",
    tag: "Meeting Ready",
    author: "Business Services Team",
    title: "Client Meetings Feel More Premium",
    description: "Professional meeting rooms and a polished environment helped elevate every first impression.",
    icon_key: "gem",
    sort_order: 20,
  },
  {
    id: "fallback-productivity",
    tag: "Daily Productivity",
    author: "Sales & Support Team",
    title: "The Daily Commute Became Worth It",
    description: "Reliable internet, seamless access, and fewer distractions turned workdays into focused sessions.",
    icon_key: "radar",
    sort_order: 30,
  },
  {
    id: "fallback-collaboration",
    tag: "Collaboration",
    author: "Creative Studio",
    title: "Creative Teams Work Better Together",
    description: "Open collaboration zones and flexible seating gave the team energy without losing structure.",
    icon_key: "aperture",
    sort_order: 40,
  },
  {
    id: "fallback-scaling",
    tag: "Scaling Up",
    author: "Growing Remote Team",
    title: "From Home Office Chaos to Growth",
    description: "Watch how Axion helped bring consistency, professionalism, and momentum back to work.",
    icon_key: "satellite",
    sort_order: 50,
  },
];

// -- Props --------------------------------------------------------------------

type Props = {
  hero: AboutHeroSectionVM | null;
  pillars: AboutPillarCardVM[];
  story: AboutStorySectionVM | null;
  clientStories: AboutClientStoryVM[];
};

// -- Component ----------------------------------------------------------------

export function AboutPageClient({ hero, pillars, story, clientStories }: Props) {
  const visiblePillars = pillars.length > 0 ? pillars : FB_PILLARS;
  const visibleClientStories =
    clientStories.length > 0 ? clientStories : FB_CLIENT_STORIES;

  // Hero images: use DB URL if available, fall back to Unsplash per slot.
  function heroImgUrl(slot: number) {
    const found = hero?.images.find((i) => i.slot === slot);
    return found?.url ?? FB_HERO_IMGS[slot - 1] ?? FB_HERO_IMGS[0];
  }
  function heroImgAlt(slot: number) {
    const found = hero?.images.find((i) => i.slot === slot);
    return found?.alt || `Workspace ${slot}`;
  }

  // Story images
  function storyImgUrl(slot: number) {
    const found = story?.images.find((i) => i.slot === slot);
    return found?.url ?? FB_STORY_IMGS[slot - 1] ?? null;
  }
  function storyImgAlt(slot: number) {
    const found = story?.images.find((i) => i.slot === slot);
    return found?.alt || `Office space ${slot}`;
  }

  return (
    <AuroraBackground className="!bg-[#F8F8F8] !text-gray-900 font-sans overflow-hidden items-start justify-start flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="flex-1 flex flex-col gap-6 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="text-[13px] sm:text-[14px] font-semibold bg-white border border-gray-200 text-gray-900 rounded-full px-4 py-1.5 shadow-sm uppercase tracking-wider">
                About Axion Spaces
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900 pr-4"
            >
              {hero?.headline ??
                "Premium workspace built for professionals who want clarity, speed, and a better workday."}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed max-w-2xl"
            >
              {hero?.subtext ??
                "Axion Spaces was built to make office decisions easier for founders, freelancers, and growing teams."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1 w-full h-[400px] sm:h-[500px] lg:h-[600px] relative"
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <img
                  src={heroImgUrl(1)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  alt={heroImgAlt(1)}
                />
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md border border-gray-100">
                <img
                  src={heroImgUrl(2)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  alt={heroImgAlt(2)}
                />
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md border border-gray-100">
                <img
                  src={heroImgUrl(3)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  alt={heroImgAlt(3)}
                />
              </div>
              <div className="col-span-2 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <img
                  src={heroImgUrl(4)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  alt={heroImgAlt(4)}
                />
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md border border-gray-100">
                <img
                  src={heroImgUrl(5)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  alt={heroImgAlt(5)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="pb-24 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visiblePillars.map((card, i) => {
            const Icon = PILLAR_ICON_MAP[card.icon_key] ?? Building2;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-lg"
              >
                <Icon size={32} className="text-[#F26522] mb-6" />
                <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  {card.label}
                </h3>
                <h2 className="text-[28px] font-bold text-gray-900 mb-4">{card.stat}</h2>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="w-full py-24 relative z-10 bg-white border-y border-gray-200">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h3 className="text-[14px] font-bold text-[#F26522] uppercase tracking-widest mb-4">
              {story?.subheading ?? "Our Story"}
            </h3>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] text-gray-900 mb-8">
              {story?.heading ?? "Built to make modern office decisions simpler"}
            </h2>
            <div className="space-y-6 text-[16px] sm:text-[18px] text-gray-600 leading-relaxed">
              <p>
                {story?.body_1 ??
                  "Axion Spaces started with a practical goal: create workspace experiences that feel professional, flexible, and easy to act on."}
              </p>
              <p>
                {story?.body_2 ??
                  "We know that for many businesses, choosing an office is not just about square footage."}
              </p>
              <p>
                {story?.body_3 ??
                  "That is why our approach blends clean infrastructure, managed amenities, quick response times, and a direct path from first inquiry to booking."}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-[#F8F8F8] p-6 rounded-2xl shadow-sm border border-gray-200">
                <h4 className="text-[18px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#F26522]" />
                  {story?.belief_1_title ?? "What We Believe"}
                </h4>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {story?.belief_1_text ??
                    "A workspace should remove friction, not add to it."}
                </p>
              </div>
              <div className="bg-[#F8F8F8] p-6 rounded-2xl shadow-sm border border-gray-200">
                <h4 className="text-[18px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#F26522]" />
                  {story?.belief_2_title ?? "What We Deliver"}
                </h4>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  {story?.belief_2_text ?? "Spaces that feel premium on day one."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 2x2 story image grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="grid grid-cols-2 gap-4 h-[400px] lg:h-[500px]">
              {[1, 2, 3, 4].map((slot) => {
                const url = storyImgUrl(slot);
                return (
                  <div
                    key={slot}
                    className="rounded-2xl overflow-hidden border border-gray-100 shadow-md bg-gray-50"
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={storyImgAlt(slot)}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CLIENT STORIES */}
      <section className="py-24 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h3 className="text-[14px] font-bold text-[#F26522] uppercase tracking-widest mb-4">
            Client Stories
          </h3>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] text-gray-900 mb-6">
            Real walkthroughs from teams already working here
          </h2>
          <p className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed">
            Trusted by 100+ companies and growing teams. Hear the experience in their own words.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleClientStories.map((story, i) => {
            const Icon = CLIENT_STORY_ICON_MAP[story.icon_key] ?? Orbit;
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg hover:border-gray-300 transition-all shadow-sm"
              >
                <div className="text-[12px] font-bold text-[#F26522] uppercase tracking-widest mb-2">
                  {story.tag}
                </div>
                <h3 className="text-[20px] font-bold text-gray-900 mb-4">{story.title}</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                  {story.description}
                </p>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#F8F8F8] border border-gray-200 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#F26522]" />
                  </div>
                  <div className="text-[14px] font-semibold text-gray-900">{story.author}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </AuroraBackground>
  );
}
