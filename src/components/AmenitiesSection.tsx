"use client";

import { 
  Wifi, 
  ShieldCheck, 
  Car, 
  Armchair, 
  Zap, 
  ThermometerSnowflake, 
  DoorOpen, 
  Wind, 
  Phone, 
  Cctv, 
  Coffee, 
  Bus, 
  Users, 
  Sparkles, 
  Printer, 
  Droplets 
} from "lucide-react";

import { motion, Variants } from "framer-motion";

const amenities = [
  { icon: Wifi, text: "High Speed Internet" },
  { icon: ShieldCheck, text: "24 x 7 Security" },
  { icon: Car, text: "2 Level Parking Space" },
  { icon: Armchair, text: "Breakout Zone" },
  { icon: Zap, text: "100% Power Backup" },
  { icon: ThermometerSnowflake, text: "Air Conditioning" },
  { icon: DoorOpen, text: "Dedicated Entrance" },
  { icon: Wind, text: "Smoking Area" },
  { icon: Phone, text: "Calling Booth" },
  { icon: Cctv, text: "CCTV Surveillance" },
  { icon: Coffee, text: "Coffee & Tea" },
  { icon: Bus, text: "Public Transport" },
  { icon: Users, text: "Community Manager" },
  { icon: Sparkles, text: "Housekeeping" },
  { icon: Printer, text: "Printer/ Copier" },
  { icon: Droplets, text: "Hygienic Washrooms" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export function AmenitiesSection() {
  return (
    <section className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-12 sm:pb-16 lg:pb-24 overflow-hidden relative">
      
      {/* ABSOLUTE BACKGROUND WAVES */}
      <motion.div 
        className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -25, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {/* viewBox scaled to typical section dimensions like 1440x800 */}
          <svg viewBox="0 0 1600 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <motion.path 
              d="M1800 -100 C1200 200 600 600 -200 1100" 
              stroke="#F26522" 
              strokeWidth="6" 
              strokeOpacity="0.4" 
              initial={{ pathLength: 0, opacity: 0 }} 
              whileInView={{ pathLength: 1, opacity: 1 }} 
              transition={{ duration: 2.5, ease: "circOut" }} 
            />
            <motion.path 
              d="M1900 0 C1300 300 700 700 -100 1200" 
              stroke="#F26522" 
              strokeWidth="18" 
              strokeOpacity="0.15" 
              initial={{ pathLength: 0, opacity: 0 }} 
              whileInView={{ pathLength: 1, opacity: 1 }} 
              transition={{ duration: 2.8, delay: 0.3, ease: "circOut" }} 
            />
            <motion.path 
              d="M1850 150 C1400 450 800 800 -100 1300" 
              stroke="#111827" 
              strokeWidth="8" 
              strokeOpacity="0.2" 
              initial={{ pathLength: 0, opacity: 0 }} 
              whileInView={{ pathLength: 1, opacity: 1 }} 
              transition={{ duration: 3.2, delay: 0.6, ease: "circOut" }} 
            />
          </svg>
        </motion.div>
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* HEADER ROW */}
        <div className="relative flex items-center justify-between w-full mb-12 sm:mb-16 z-10">
          <div className="relative z-20">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-black/10">
                3
              </div>
              <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 shadow-sm">
                Premium Amenities
              </div>
            </div>
            
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Our Amenities
            </h2>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-[#FAFAFA] border border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-6 sm:p-8 hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-300 group shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-gray-800 flex items-center justify-center mb-4 transition-colors duration-300 shadow-sm group-hover:shadow-none">
                  <Icon size={24} className="text-gray-800 group-hover:text-[#F26522] transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-[13px] sm:text-[15px] font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">
                  {item.text}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
