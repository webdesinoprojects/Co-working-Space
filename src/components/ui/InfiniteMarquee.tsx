"use client";

import { motion } from "framer-motion";
import { Asterisk } from "lucide-react";

export function InfiniteMarquee({ 
  items, 
  reverse = false, 
  theme = "dark" 
}: { 
  items: string[]; 
  reverse?: boolean;
  theme?: "dark" | "light";
}) {
  // Brutalist / Funky Colors
  const bgColor = theme === "dark" ? "bg-[#F26522]" : "bg-[#CCFF00]"; // Vibrant Orange vs Lime Green
  const textColor = "text-gray-900";
  const borderColor = "border-gray-900 border-y-4"; 
  
  // Alternate the tilt to create a crossed tape effect if multiple are on page
  const rotation = theme === "dark" ? "-rotate-2" : "rotate-2";

  // Duplicate items many times so it never runs out of screen width before looping
  const repeatedItems = Array(20).fill(items).flat();

  return (
    // Outer wrapper to prevent horizontal scroll from the tilted scale-110 inner div
    <div className="relative w-full overflow-hidden flex items-center justify-center my-8 sm:my-16 py-8">
      
      {/* The actual rotated marquee tape */}
      <div className={`relative flex w-[110vw] max-w-none py-4 sm:py-6 ${bgColor} ${borderColor} ${textColor} ${rotation} scale-105 sm:scale-110 z-20 shadow-[0_15px_0_0_rgba(17,24,39,1)]`}>
        <motion.div
          className="flex whitespace-nowrap gap-8 sm:gap-16 items-center pl-8 sm:pl-16"
          animate={{
            x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 80, // slightly faster for more energy
          }}
        >
          {repeatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-8 sm:gap-16">
              <span className="text-[2rem] sm:text-[3.5rem] md:text-[4.5rem] font-black tracking-tighter uppercase font-spaceGrotesk whitespace-nowrap">
                {item}
              </span>
              
              {/* Spinning Starburst Icon Separator */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="flex-shrink-0"
              >
                <Asterisk size={48} strokeWidth={3} className="text-gray-900 hidden sm:block" />
                <Asterisk size={32} strokeWidth={3} className="text-gray-900 block sm:hidden" />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
