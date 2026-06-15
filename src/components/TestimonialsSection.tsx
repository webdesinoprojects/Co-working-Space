"use client";

import { motion, Variants } from "framer-motion";
import { Quote } from "lucide-react";
import type { TestimonialsSectionVM } from "@/features/homepage/types";

const orbitalContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const orbitVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 3, ease: "easeOut" }
  }
};

const STATIC_TESTIMONIALS = [
  {
    quote: "Moving our startup to Axion Workspace was the best decision we made. The environment is inspiring, the amenities are flawless, and the community is incredible.",
    person_name: "Sarah Jenkins",
    person_role: "CEO",
    company_name: "TechFlow",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "The private office suites provide the perfect balance of focused quiet time and energetic communal spaces when we want to network.",
    person_name: "David Miller",
    person_role: "Founder",
    company_name: "Scale Up",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "As a freelancer, I needed a space that felt professional. The Observatory location gives me the exact premium vibe I need for client meetings.",
    person_name: "Elena Rodriguez",
    person_role: "Independent Designer",
    company_name: null,
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
  },
];

export function TestimonialsSection({ data }: { data?: TestimonialsSectionVM }) {
  const badge = data?.badge_text ?? "Testimonials";
  const title = data?.title ?? "Trusted by the world's most innovative companies.";

  const hasDynamic = data && data.testimonials.length > 0;

  return (
    <section className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 relative overflow-hidden">

      {/* ORBITAL RINGS BACKGROUND */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] md:w-[120vw] md:h-[120vw] pointer-events-none z-0"
        variants={orbitalContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 200, ease: "linear" }}
          className="w-full h-full flex items-center justify-center opacity-40"
        >
          <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <motion.circle cx="500" cy="500" r="150" stroke="#F26522" strokeWidth="1" strokeDasharray="4 4" variants={orbitVariants} />
            <motion.ellipse cx="500" cy="500" rx="300" ry="200" stroke="#00A1BA" strokeWidth="1.5" transform="rotate(30 500 500)" variants={orbitVariants} />
            <motion.ellipse cx="500" cy="500" rx="350" ry="250" stroke="#111827" strokeWidth="1" strokeOpacity="0.3" transform="rotate(-15 500 500)" variants={orbitVariants} />
            <motion.ellipse cx="500" cy="500" rx="500" ry="350" stroke="#F26522" strokeWidth="2" strokeOpacity="0.4" transform="rotate(60 500 500)" variants={orbitVariants} />
            <motion.ellipse cx="500" cy="500" rx="600" ry="400" stroke="#00A1BA" strokeWidth="1" strokeDasharray="8 8" strokeOpacity="0.5" transform="rotate(-45 500 500)" variants={orbitVariants} />
            <motion.ellipse cx="500" cy="500" rx="800" ry="600" stroke="#111827" strokeWidth="1.5" strokeOpacity="0.15" transform="rotate(15 500 500)" variants={orbitVariants} />
            <motion.circle cx="500" cy="500" r="900" stroke="#F26522" strokeWidth="1" strokeOpacity="0.2" variants={orbitVariants} />
          </svg>
        </motion.div>
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Badge Row */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-black/10">
            5
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 shadow-sm">
            {badge}
          </div>
        </div>

        <h2 className="text-center text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasDynamic
            ? data.testimonials.map((t, idx) => {
                const roleDisplay = [t.person_role, t.company_name].filter(Boolean).join(", ");
                const avatarUrl = t.avatar?.url ?? STATIC_TESTIMONIALS[idx]?.avatar_url;

                return (
                  <div
                    key={t.id}
                    className={`bg-[#EFEFEF] rounded-2xl p-8 relative${idx >= 2 ? " md:hidden lg:block" : ""}`}
                  >
                    <Quote className="absolute top-8 right-8 text-gray-300" size={32} />
                    <p className="text-[16px] text-gray-900 font-medium leading-relaxed mb-8 relative z-10">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={t.person_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-gray-900">{t.person_name}</div>
                        {roleDisplay && <div className="text-[13px] text-gray-600">{roleDisplay}</div>}
                      </div>
                    </div>
                  </div>
                );
              })
            : STATIC_TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className={`bg-[#EFEFEF] rounded-2xl p-8 relative${idx === 2 ? " md:hidden lg:block" : ""}`}
                >
                  <Quote className="absolute top-8 right-8 text-gray-300" size={32} />
                  <p className="text-[16px] text-gray-900 font-medium leading-relaxed mb-8 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                      <img src={t.avatar_url} alt={t.person_name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-gray-900">{t.person_name}</div>
                      <div className="text-[13px] text-gray-600">
                        {t.person_role}{t.company_name ? `, ${t.company_name}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
