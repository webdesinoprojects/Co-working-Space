"use client";

import { Wifi, Coffee, Lock, Monitor } from "lucide-react";

import { motion } from "framer-motion";

export function AmenitiesSection() {
  return (
    <section className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 lg:pb-24 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* HEADER ROW WITH ANIMATED WAVES ON RIGHT */}
        <div className="relative flex items-center justify-between w-full mb-12 sm:mb-16 z-10">
          
          {/* Left: Text & Badge */}
          <div className="relative z-20">
            {/* Badge Row */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-black/10">
                3
              </div>
              <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 shadow-sm">
                Premium Amenities
              </div>
            </div>
            
            <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 relative">
              Everything you need <br className="hidden sm:block" />
              to do your best work.
            </h2>
          </div>

          {/* Background: Animated SVG Waves reaching full width */}
          <motion.div 
            className="hidden lg:block absolute right-[-5vw] top-[-80px] w-[110vw] h-[350px] pointer-events-none z-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 1600 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
                {/* 5 sweeping bezier curves spanning full width */}
                <motion.path 
                  d="M1600 50 C1100 50 600 300 -100 250" 
                  stroke="#F26522" 
                  strokeWidth="2" 
                  strokeOpacity="0.25" 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }} 
                />
                <motion.path 
                  d="M1600 100 C1200 100 800 330 -100 280" 
                  stroke="#F26522" 
                  strokeWidth="6" 
                  strokeOpacity="0.1" 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }} 
                />
                <motion.path 
                  d="M1600 150 C1300 150 700 200 -100 150" 
                  stroke="#111827" 
                  strokeWidth="1.5" 
                  strokeOpacity="0.15" 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 2, delay: 0.6, ease: "easeInOut" }} 
                />
                <motion.path 
                  d="M1600 200 C1400 200 800 100 -100 100" 
                  stroke="#111827" 
                  strokeWidth="2" 
                  strokeDasharray="8 8" 
                  strokeOpacity="0.2" 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }} 
                />
                <motion.path 
                  d="M1600 250 C1200 250 500 50 -100 50" 
                  stroke="#F26522" 
                  strokeWidth="1" 
                  strokeOpacity="0.3" 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 2, delay: 1.0, ease: "easeInOut" }} 
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Amenity 1 */}
          <div className="bg-[#EFEFEF] rounded-2xl p-6 sm:p-8 hover:bg-gray-900 hover:text-white transition-colors duration-500 group">
            <Wifi size={28} className="text-gray-900 group-hover:text-[#F26522] mb-6 transition-colors duration-500" />
            <h3 className="text-[16px] font-semibold mb-2">Enterprise Wi-Fi</h3>
            <p className="text-[14px] text-gray-600 group-hover:text-gray-400 leading-relaxed">Symmetrical 1Gbps fiber connections with dedicated failover and isolated VLANs.</p>
          </div>
          {/* Amenity 2 */}
          <div className="bg-[#EFEFEF] rounded-2xl p-6 sm:p-8 hover:bg-gray-900 hover:text-white transition-colors duration-500 group">
            <Coffee size={28} className="text-gray-900 group-hover:text-[#F26522] mb-6 transition-colors duration-500" />
            <h3 className="text-[16px] font-semibold mb-2">Specialty Coffee</h3>
            <p className="text-[14px] text-gray-600 group-hover:text-gray-400 leading-relaxed">Unlimited access to artisan roasted coffee, kombucha on tap, and fresh fruit daily.</p>
          </div>
          {/* Amenity 3 */}
          <div className="bg-[#EFEFEF] rounded-2xl p-6 sm:p-8 hover:bg-gray-900 hover:text-white transition-colors duration-500 group">
            <Lock size={28} className="text-gray-900 group-hover:text-[#F26522] mb-6 transition-colors duration-500" />
            <h3 className="text-[16px] font-semibold mb-2">24/7 Secure Access</h3>
            <p className="text-[14px] text-gray-600 group-hover:text-gray-400 leading-relaxed">Keyless smartphone entry, around-the-clock security, and secure bike storage.</p>
          </div>
          {/* Amenity 4 */}
          <div className="bg-[#EFEFEF] rounded-2xl p-6 sm:p-8 hover:bg-gray-900 hover:text-white transition-colors duration-500 group">
            <Monitor size={28} className="text-gray-900 group-hover:text-[#F26522] mb-6 transition-colors duration-500" />
            <h3 className="text-[16px] font-semibold mb-2">Meeting Rooms</h3>
            <p className="text-[14px] text-gray-600 group-hover:text-gray-400 leading-relaxed">Zoom-ready conference rooms with 4K displays and acoustic treatments.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
