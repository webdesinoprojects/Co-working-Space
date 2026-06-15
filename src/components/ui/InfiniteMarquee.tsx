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
    <div className="relative w-full overflow-hidden flex items-center justify-center my-6 sm:my-10 py-4">

      {/* The actual rotated marquee tape */}
      <div className={`relative flex w-full max-w-none py-3 sm:py-4 ${bgColor} ${borderColor} ${textColor} ${rotation} scale-100 sm:scale-[1.03] z-20 shadow-[0_10px_0_0_rgba(17,24,39,1)]`}>
        <motion.div
          className="flex whitespace-nowrap gap-6 sm:gap-10 items-center pl-6 sm:pl-10"
          animate={{
            x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 140,
          }}
        >
          {repeatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-6 sm:gap-10">
              <span className="text-[1.25rem] sm:text-[2rem] md:text-[2.75rem] font-black tracking-tighter uppercase font-spaceGrotesk whitespace-nowrap">
                {item}
              </span>
              
              {/* Spinning Starburst Icon Separator */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="flex-shrink-0"
              >
                <Asterisk size={32} strokeWidth={3} className="text-gray-900 hidden sm:block" />
                <Asterisk size={22} strokeWidth={3} className="text-gray-900 block sm:hidden" />
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
