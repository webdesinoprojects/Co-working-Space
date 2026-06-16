"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { HeroSectionVM } from "@/features/homepage/types";

const FALLBACK_IMAGES = {
  left: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  topRight: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80",
  bottomRight: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
};

const STRIPS = 6; // vertical "cut" bars used for the reveal
const SLIDE_MS = 5000; // change image every 5s

type Slide = { url: string; alt: string };

/**
 * Full-screen 3D Cube Transition.
 * Perfectly matches the reference designs: "folds" the entire background 
 * image in 3D space like a cube rotating left, right, or up.
 */
function Hero3DTransition({
  current,
  prev,
  mode,
}: {
  current: Slide;
  prev: Slide;
  mode: number;
}) {
  const m = mode % 3;

  if (m === 0) {
    // Rotate Y (Slide Left)
    return (
      <div className="absolute inset-0 overflow-hidden bg-black" style={{ perspective: "1500px" }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ transform: "translateZ(-50vw) rotateY(-90deg)" }}
          animate={{ transform: "translateZ(-50vw) rotateY(0deg)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* CURRENT (Front) */}
          <div className="absolute inset-0 w-full h-full" style={{ transform: "rotateY(0deg) translateZ(50vw)", backfaceVisibility: "hidden" }}>
            <img src={current.url} alt="" className="w-full h-full object-cover" />
          </div>
          {/* PREV (Right face -> swings to front initially) */}
          <div className="absolute inset-0 w-full h-full" style={{ transform: "rotateY(90deg) translateZ(50vw)", backfaceVisibility: "hidden" }}>
            <img src={prev.url} alt="" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (m === 1) {
    // Rotate X (Slide Up)
    return (
      <div className="absolute inset-0 overflow-hidden bg-black" style={{ perspective: "1500px" }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ transform: "translateZ(-50vh) rotateX(90deg)" }}
          animate={{ transform: "translateZ(-50vh) rotateX(0deg)" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* CURRENT (Front) */}
          <div className="absolute inset-0 w-full h-full" style={{ transform: "rotateX(0deg) translateZ(50vh)", backfaceVisibility: "hidden" }}>
            <img src={current.url} alt="" className="w-full h-full object-cover" />
          </div>
          {/* PREV (Bottom face -> swings to front initially) */}
          <div className="absolute inset-0 w-full h-full" style={{ transform: "rotateX(-90deg) translateZ(50vh)", backfaceVisibility: "hidden" }}>
            <img src={prev.url} alt="" className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    );
  }

  // Rotate Y (Slide Right)
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" style={{ perspective: "1500px" }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ transform: "translateZ(-50vw) rotateY(90deg)" }}
        animate={{ transform: "translateZ(-50vw) rotateY(0deg)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* CURRENT (Front) */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: "rotateY(0deg) translateZ(50vw)", backfaceVisibility: "hidden" }}>
          <img src={current.url} alt="" className="w-full h-full object-cover" />
        </div>
        {/* PREV (Left face -> swings to front initially) */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: "rotateY(-90deg) translateZ(50vw)", backfaceVisibility: "hidden" }}>
          <img src={prev.url} alt="" className="w-full h-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
}

export function HeroSection({ data }: { data?: HeroSectionVM }) {
  const badge = data?.badge_text ?? "Alley Workspace";
  const headline =
    data?.headline ??
    "We craft professional environments for teams ready to dominate their category.";
  const ctaLabel = data?.cta_label ?? "Start your trial";
  const ctaHref = data?.cta_href ?? "#";
  const promoTitle = data?.promo_title ?? "Premium Coworking";
  const promoBadge = data?.promo_badge_text ?? "Top Rated 2026";

  const images: Slide[] = [
    {
      url: data?.left_image?.url ?? FALLBACK_IMAGES.left,
      alt: data?.left_image?.alt || "Premium coworking space",
    },
    {
      url: data?.top_right_image?.url ?? FALLBACK_IMAGES.topRight,
      alt: data?.top_right_image?.alt || "Meeting room lounge",
    },
    {
      url: data?.bottom_right_image?.url ?? FALLBACK_IMAGES.bottomRight,
      alt: data?.bottom_right_image?.alt || "Modern office interior",
    },
  ];

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(0);
  const indexRef = useRef(0);
  
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Preload the next image, THEN swap — so every strip reveals the fully-loaded
  // image at once (no half-loaded "only left side changed" seam).
  const goTo = useCallback(
    (next: number) => {
      if (next === indexRef.current) return;
      const swap = () => {
        setPrev(indexRef.current);
        setIndex(next);
      };
      const img = new window.Image();
      img.src = images[next].url;
      if (img.complete) swap();
      else {
        img.onload = swap;
        img.onerror = swap;
      }
    },
    [images]
  );

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(
      () => goTo((indexRef.current + 1) % images.length),
      SLIDE_MS
    );
    return () => clearInterval(id);
  }, [images.length, goTo]);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden">
      {/* FULL-BLEED BACKGROUND, re-keyed so the cut animation replays each slide */}
      <Hero3DTransition
        key={index}
        current={images[index]}
        prev={images[prev]}
        mode={index % 3}
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />

      {/* HERO CONTENT (anchored bottom) */}
      <div className="relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-[160px] pb-12 sm:pb-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* LEFT: copy + CTA */}
          <div className="max-w-[720px]">
            <p className="inline-block text-[13px] sm:text-[14px] text-white tracking-wide mb-5 font-medium bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/25">
              {badge}
            </p>

            <h1 className="text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
              {headline}
            </h1>

            <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
              <a
                href={ctaHref}
                className="group flex items-center gap-4 bg-[#F26522] hover:bg-[#e05a1a] text-white text-[14px] sm:text-[15px] font-medium rounded-full pl-6 pr-2 py-2.5 transition-colors duration-300 shadow-xl shadow-[#F26522]/30"
              >
                <div className="h-[22px] overflow-hidden flex flex-col">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[22px]">
                    {ctaLabel}
                  </span>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[22px]">
                    {ctaLabel}
                  </span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight
                    size={16}
                    className="text-[#F26522] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45"
                  />
                </div>
              </a>

              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.25)] border border-white/40">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-[#E8704E]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                >
                  <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-[14px] sm:text-[15px] font-medium text-gray-900 leading-tight">
                    {promoTitle}
                  </span>
                  <span className="text-[11px] sm:text-[12px] bg-gray-900 text-white px-2 py-0.5 rounded w-fit mt-1">
                    {promoBadge}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: slide counter + thumbnail switcher (fills the empty space) */}
          <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
            <div className="flex items-center gap-3 text-white">
              <span className="text-[22px] font-semibold tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-white/40" />
              <span className="text-[14px] text-white/70 tabular-nums">
                {String(images.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show slide ${i + 1}`}
                  className={`relative h-16 w-24 sm:h-20 sm:w-28 overflow-hidden rounded-xl border transition-all duration-300 ${
                    i === index
                      ? "border-[#F26522] ring-2 ring-[#F26522]/50 scale-105 shadow-lg shadow-black/30"
                      : "border-white/30 opacity-60 hover:opacity-100 hover:border-white/60"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    aria-hidden
                    className="h-full w-full select-none object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
