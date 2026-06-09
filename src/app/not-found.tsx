"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background Graphic - Orbital Scattered */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 150, ease: "linear" }} className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw]">
            <circle cx="500" cy="500" r="200" stroke="#F26522" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="500" cy="500" r="300" stroke="#00A1BA" strokeWidth="1" />
            <ellipse cx="500" cy="500" rx="450" ry="300" stroke="#F26522" strokeWidth="1" transform="rotate(45 500 500)" />
            <ellipse cx="500" cy="500" rx="600" ry="400" stroke="#111827" strokeWidth="4" transform="rotate(-30 500 500)" />
            <circle cx="500" cy="500" r="800" stroke="#00A1BA" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03]">
        <div className="text-[clamp(15rem,40vw,30rem)] font-extrabold leading-none tracking-tighter text-white">404</div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-2xl mt-12">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-[#00A1BA]/20 border border-[#00A1BA]/40 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
            <span className="text-2xl font-bold text-[#00A1BA]">?</span>
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-white mb-6">
            Space not found.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-gray-400 mb-12 max-w-lg">
            The workspace or route you are looking for has drifted out of orbit. Verify the URL or return to base.
          </p>
          
          <Link 
            href="/" 
            className="group flex items-center gap-3 bg-[#F26522] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[12px] hover:bg-[#d95519] hover:shadow-[0_0_30px_rgba(242,101,34,0.4)] transition-all duration-300"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Return to Homepage
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
