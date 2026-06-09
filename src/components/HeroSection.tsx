"use client";

import { ArrowRight } from "lucide-react";
import { Swirl, ChromaFlow, FlutedGlass, FilmGrain, Shader } from "shaders/react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden bg-[#EFEFEF]">
      {/* SHADER BACKGROUND */}
      <div className="absolute inset-0 z-10 pointer-events-none [&_*]:!w-full [&_*]:!h-full [&_canvas]:!object-cover">
        <Shader>
          <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
          <ChromaFlow 
            baseColor="#ffffff" 
            downColor="#ff5f03" 
            leftColor="#ff5f03" 
            rightColor="#ff5f03" 
            upColor="#ff5f03" 
            momentum={13} 
            radius={3.5} 
          />
          <FlutedGlass 
            aberration={0.61} 
            angle={31} 
            frequency={8} 
            highlight={0.12} 
            highlightSoftness={0} 
            lightAngle={-90} 
            refraction={4} 
            shape="rounded" 
            softness={1} 
            speed={0.15} 
          />
          <FilmGrain strength={0.05} />
        </Shader>
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-[140px] pb-14 sm:pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* LEFT COLUMN: TEXT & CTA */}
        <div className="w-full lg:w-[55%] flex flex-col items-start">
          <p className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-4 sm:mb-6 font-medium bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40">
            Axion Workspace
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-gray-900">
            We craft professional environments <br className="hidden xl:block" />
            for teams ready to dominate <br className="hidden xl:block" />
            their category.
          </h1>
          
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <button className="group flex items-center gap-4 bg-[#F26522] hover:bg-[#e05a1a] text-white text-[14px] sm:text-[15px] font-medium rounded-full pl-6 pr-2 py-2.5 transition-colors duration-300 shadow-xl shadow-[#F26522]/20">
              <div className="h-[22px] overflow-hidden flex flex-col">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[22px]">Start your trial</span>
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[22px]">Start your trial</span>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center">
                <ArrowRight size={16} className="text-[#F26522] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
              </div>
            </button>
            
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-white/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-shadow duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-[#E8704E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-[14px] sm:text-[15px] font-medium text-gray-900 leading-tight">Premium Coworking</span>
                <span className="text-[11px] sm:text-[12px] bg-gray-900 text-white px-2 py-0.5 rounded w-fit mt-1">Top Rated 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANIMATED BENTO GRID */}
        <div className="w-full lg:w-[45%] grid grid-cols-2 grid-rows-2 gap-4 h-[350px] sm:h-[400px] lg:h-[480px]">
          
          {/* Bento Item 1: Large Left */}
          <div className="col-span-1 row-span-2 relative rounded-3xl overflow-hidden group shadow-2xl shadow-black/10 transform transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F26522]/20">
            <img 
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80" 
              alt="Premium Coworking Desk" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className="bg-white/20 backdrop-blur-md text-white text-[12px] font-semibold px-3 py-1 rounded-full border border-white/30">Ergonomic</div>
            </div>
          </div>

          {/* Bento Item 2: Top Right */}
          <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-xl shadow-black/10 transform transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F26522]/20 delay-100">
            <img 
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80" 
              alt="Meeting Room Lounge" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-5 left-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className="bg-white/20 backdrop-blur-md text-white text-[12px] font-semibold px-3 py-1 rounded-full border border-white/30">Collaborative</div>
            </div>
          </div>

          {/* Bento Item 3: Bottom Right */}
          <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group shadow-xl shadow-black/10 transform transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#F26522]/20 delay-200">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
              alt="Office Details" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-5 left-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <div className="bg-white/20 backdrop-blur-md text-white text-[12px] font-semibold px-3 py-1 rounded-full border border-white/30">Inspiring</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
