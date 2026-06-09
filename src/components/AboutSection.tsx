"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const waveContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const wavePathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 2.5, ease: "easeInOut" } 
  }
};

export function AboutSection() {
  return (
    <section id="workspaces" className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden relative">
      
      {/* DIAGONAL SCATTERED WAVES BACKGROUND */}
      <motion.div 
        className="hidden lg:block absolute inset-0 z-0 pointer-events-none"
        variants={waveContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            {/* Top Right to Bottom Left Diagonal Lines */}
            <motion.path 
              variants={wavePathVariants}
              d="M1600 -100 Q 1100 200 600 500 T -200 1000" 
              stroke="#00A1BA" 
              strokeWidth="1.5" 
              strokeOpacity="0.3" 
            />
            <motion.path 
              variants={wavePathVariants}
              d="M1800 0 Q 1200 300 700 600 T -100 1100" 
              stroke="#F26522" 
              strokeWidth="1" 
              strokeOpacity="0.4" 
            />
            <motion.path 
              variants={wavePathVariants}
              d="M1500 -200 Q 1000 100 500 400 T -300 900" 
              stroke="#111827" 
              strokeWidth="1.5" 
              strokeDasharray="6 6"
              strokeOpacity="0.2" 
            />
            <motion.path 
              variants={wavePathVariants}
              d="M1900 -50 Q 1300 400 800 700 T 0 1200" 
              stroke="#F26522" 
              strokeWidth="2.5" 
              strokeOpacity="0.1" 
            />
          </svg>
        </motion.div>
      </motion.div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* HEADER ROW */}
        <div className="relative flex items-center justify-between w-full mb-12 sm:mb-16 lg:mb-28 z-10 px-5 sm:px-8 lg:px-12">
          
          {/* Left: Text & Badge */}
          <div className="relative z-20">
            {/* Badge Row */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-black/10">
                1
              </div>
              <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 shadow-sm">
                Introducing Axion
              </div>
            </div>
            
            <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 max-w-4xl relative">
              Strategy-led workspaces, delivering <br className="hidden sm:block" />
              results for professionals and beyond.
            </h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-5 sm:px-8 lg:px-12">
          {/* MOBILE / TABLET LAYOUT */}
          <div className="lg:hidden flex flex-col gap-8">
            <div className="flex flex-col items-start gap-6">
              <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900">
                Through ergonomic design, thoughtful architecture, and iteration we help growing teams realize their full potential in physical spaces.
              </p>
              <button className="group flex items-center gap-4 bg-[#F26522] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2">
                <div className="h-[20px] overflow-hidden flex flex-col">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[20px]">About our spaces</span>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[20px]">About our spaces</span>
                </div>
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight size={14} className="text-[#F26522] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
                </div>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <img 
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1280&q=85" 
                alt="Workspace Details" 
                className="w-full sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1280&q=85" 
                alt="Workspace Environment" 
                className="w-full sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8">
            <img 
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1280&q=85" 
              alt="Workspace Details" 
              className="w-full aspect-[438/346] rounded-2xl object-cover self-end grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="flex flex-col items-start gap-6 self-start justify-end h-full pt-4">
              <p className="text-[16px] xl:text-[18px] leading-[1.65] font-medium text-gray-900">
                Through ergonomic design, thoughtful<br/>architecture, and iteration we help growing<br/>teams realize their full potential.
              </p>
              <button className="group flex items-center gap-4 bg-[#F26522] text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2">
                <div className="h-[20px] overflow-hidden flex flex-col">
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[20px]">About our spaces</span>
                  <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[20px]">About our spaces</span>
                </div>
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight size={14} className="text-[#F26522] transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
                </div>
              </button>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1280&q=85" 
              alt="Workspace Environment" 
              className="w-full aspect-[3/2] rounded-2xl object-cover self-end grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
