"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { WorkspaceCardVM } from "@/features/workspaces/types";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80";

export function WorkspaceCardsSection({
  workspaces,
}: {
  workspaces: WorkspaceCardVM[];
}) {
  if (!workspaces || workspaces.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* HEADER */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-black/10">
              2
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 shadow-sm">
              Our Workspaces
            </div>
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
            Explore Our Spaces
          </h2>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {workspaces.map((ws, i) => (
            <motion.div
              key={ws.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/workspaces/${ws.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-[#FAFAFA] overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-400 h-full"
              >
                {/* IMAGE */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={ws.overview_image?.url ?? FALLBACK_IMG}
                    alt={ws.overview_image?.alt || ws.card_title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>

                {/* TEXT */}
                <div className="flex flex-col flex-1 p-5 sm:p-6">
                  <h3 className="text-[17px] sm:text-[19px] font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#F26522] transition-colors duration-300">
                    {ws.card_title}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {ws.card_description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-[#F26522]">
                    <span>Learn more</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
