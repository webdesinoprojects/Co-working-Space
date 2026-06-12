"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const locations = [
  {
    name: "Delhi, Rithala",
    span: "col-span-2 md:col-span-2 md:row-span-2",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    subtitle: "Flagship Hub",
  },
  {
    name: "Delhi, Rithala",
    span: "col-span-1 md:col-span-1 md:row-span-1",
    img: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
    subtitle: "Tech Park",
  },
  {
    name: "Delhi, Rithala",
    span: "col-span-1 md:col-span-1 md:row-span-1",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    subtitle: "City Center",
  },
  {
    name: "Delhi, Rithala",
    span: "col-span-1 md:col-span-1 md:row-span-1",
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    subtitle: "Innovation Lab",
  },
  {
    name: "Delhi, Rithala",
    span: "col-span-1 md:col-span-1 md:row-span-1",
    img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
    subtitle: "Cyber City",
  },
  {
    name: "Delhi, Rithala",
    span: "col-span-1 md:col-span-2 md:row-span-1",
    img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    subtitle: "Coastal Hub",
  },
  {
    name: "Delhi, Rithala",
    span: "col-span-1 md:col-span-2 md:row-span-1",
    img: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
    subtitle: "Corporate Park",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  },
};

export function LocationsSection() {
  return (
    <section id="locations" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 overflow-hidden relative">
      
      {/* SCATTERED BACKGROUND SVG ANIMATION */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        {/* Floating Ring - Top Left */}
        <motion.div 
          className="absolute top-[10%] left-[5%] text-[#F26522]/20"
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 45, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10"/>
          </svg>
        </motion.div>

        {/* Rotating Cross - Top Right */}
        <motion.div 
          className="absolute top-[20%] right-[10%] text-gray-400/30"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 0L30 60M0 30L60 30" stroke="currentColor" strokeWidth="6"/>
          </svg>
        </motion.div>

        {/* Floating Abstract Shape - Middle Left */}
        <motion.div 
          className="absolute top-[50%] left-[2%] text-[#00A1BA]/20"
          animate={{ y: [0, 40, 0], rotate: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="40" height="40" stroke="currentColor" strokeWidth="4" transform="rotate(45 40 40)"/>
            <circle cx="40" cy="40" r="10" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Drifting Dots - Bottom Right */}
        <motion.div 
          className="absolute bottom-[10%] right-[5%] text-gray-400/40"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="3" fill="currentColor"/>
            <circle cx="50" cy="10" r="3" fill="currentColor"/>
            <circle cx="90" cy="10" r="3" fill="currentColor"/>
            <circle cx="10" cy="50" r="3" fill="currentColor"/>
            <circle cx="50" cy="50" r="3" fill="currentColor"/>
            <circle cx="90" cy="50" r="3" fill="currentColor"/>
            <circle cx="10" cy="90" r="3" fill="currentColor"/>
            <circle cx="50" cy="90" r="3" fill="currentColor"/>
            <circle cx="90" cy="90" r="3" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Huge Sweeping Arch - Bottom Left behind grid */}
        <motion.div 
          className="absolute bottom-[-10%] left-[-10%] text-[#F26522]/10"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        >
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 500 C 200 500 400 300 500 0" stroke="currentColor" strokeWidth="4" strokeDasharray="20 20"/>
            <path d="M 100 500 C 300 500 500 300 600 0" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </motion.div>
      </motion.div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* Badge Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
            2
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Our Growing Network
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
            Premium Spaces <br className="hidden sm:block" /> in Delhi, Rithala
          </h2>
          <button className="group flex items-center gap-3 text-[14px] font-medium text-gray-900 hover:text-[#F26522] transition-colors pb-2">
            View all locations
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* BENTO GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="px-5 sm:px-8 lg:px-12 grid grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-2 sm:gap-4 md:h-[600px] lg:h-[800px]"
        >
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`${loc.span} min-h-[140px] md:min-h-[200px] relative rounded-2xl overflow-hidden group shadow-lg shadow-black/5 bg-gray-200 cursor-pointer`}
            >
              <img 
                src={loc.img} 
                alt={`${loc.name} Workspace`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Gradient Overlay & Hover Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0"></div>
              <div className="absolute inset-0 bg-[#00A1BA]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-3 sm:p-6 gap-2 sm:gap-3">
                
                {/* City Name moves up slightly on hover */}
                <h3 className="text-[18px] sm:text-[26px] font-semibold text-white mb-0 sm:mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {loc.name}
                </h3>
                
                {/* 3 Action Buttons mimicking the user's reference */}
                <div className="w-full max-w-[200px] hidden sm:flex flex-col gap-2 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  <button className="w-full py-2 px-4 border border-white/80 text-white text-[11px] font-bold tracking-wider uppercase hover:bg-white hover:text-[#00A1BA] transition-colors rounded-sm">
                    Request a Visit
                  </button>
                  <button className="w-full py-2 px-4 bg-white text-[#00A1BA] text-[11px] font-bold tracking-wider uppercase hover:bg-white/90 transition-colors rounded-sm">
                    Book Meeting Room
                  </button>
                  <button className="w-full py-2 px-4 border border-white/80 text-white text-[11px] font-bold tracking-wider uppercase hover:bg-white hover:text-[#00A1BA] transition-colors rounded-sm">
                    Book Your Space
                  </button>
                </div>

                {/* Mobile simplified hover CTA */}
                <span className="sm:hidden text-white text-[10px] font-medium tracking-wide uppercase border-b border-white/40 pb-0.5 mt-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                  View Space
                </span>
              </div>
              
              {/* Default non-hover Text Content */}
              <div className="absolute inset-0 p-3 sm:p-6 flex flex-col justify-end group-hover:opacity-0 transition-opacity duration-300">
                <h3 className="text-[16px] sm:text-[24px] font-semibold text-white mb-1">
                  {loc.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
