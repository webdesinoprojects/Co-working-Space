"use client";

import { motion, useScroll } from "framer-motion";
import { Play } from "lucide-react";
import Navbar from "@/components/Navbar";

interface WorkspaceLayoutProps {
  title: React.ReactNode;
  description: string;
  stats: { value: string; label: string }[];
  images: [string, string, string];
  children?: React.ReactNode;
}

const ScrollSVG = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <div className="absolute top-40 left-4 md:left-8 lg:left-12 bottom-0 w-[40px] hidden lg:block pointer-events-none z-0">
      <svg width="40" height="100%" preserveAspectRatio="xMidYMin slice" fill="none" stroke="#EAE7D6" strokeWidth="1" strokeOpacity="0.5">
        <path d="M20,0 C20,100 40,200 20,300 C0,400 20,500 20,600 C20,700 40,800 20,900 C0,1000 20,1100 20,1200 C20,1300 40,1400 20,1500 C0,1600 20,1700 20,1800 C20,1900 40,2000 20,2100 C0,2200 20,2300 20,2400 C20,2500 40,2600 20,2700 C0,2800 20,2900 20,3000 C20,3100 40,3200 20,3300 C0,3400 20,3500 20,3600 C20,3700 40,3800 20,3900 C0,4000 20,4100 20,4200" />
      </svg>
      <svg className="absolute top-0 left-0" width="40" height="100%" preserveAspectRatio="xMidYMin slice" fill="none" stroke="#F26522" strokeWidth="2.5">
        <motion.path 
          d="M20,0 C20,100 40,200 20,300 C0,400 20,500 20,600 C20,700 40,800 20,900 C0,1000 20,1100 20,1200 C20,1300 40,1400 20,1500 C0,1600 20,1700 20,1800 C20,1900 40,2000 20,2100 C0,2200 20,2300 20,2400 C20,2500 40,2600 20,2700 C0,2800 20,2900 20,3000 C20,3100 40,3200 20,3300 C0,3400 20,3500 20,3600 C20,3700 40,3800 20,3900 C0,4000 20,4100 20,4200" 
          style={{ pathLength: scrollYProgress }} 
        />
      </svg>
    </div>
  );
};

export default function WorkspaceLayout({ title, description, stats, images, children }: WorkspaceLayoutProps) {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-gray-900 font-sans overflow-hidden relative">
      <Navbar />
      <ScrollSVG />

      <section className="pt-32 sm:pt-40 pb-20 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative z-10 lg:pl-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-gray-900 mb-6 font-spaceGrotesk"
            >
              {title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed mb-10"
            >
              {description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 mb-16"
            >
              <button className="bg-[#9db89a] text-white px-8 py-3.5 rounded-full font-semibold text-[15px] hover:bg-[#8ca889] transition-colors shadow-sm">
                Get started
              </button>
              <button className="flex items-center gap-2 text-gray-900 font-semibold text-[15px] hover:text-[#F26522] transition-colors group">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#F26522] transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                Watch video
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-x-8 gap-y-12"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="text-[2.5rem] sm:text-[3rem] font-bold leading-none text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-[14px] text-gray-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN (IMAGE COLLAGE) */}
          <div className="relative h-[600px] lg:h-[750px] w-full mt-12 lg:mt-0">
            {/* SVG Decoration: Spiral Arrow */}
            <motion.svg 
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1, pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute top-[5%] right-[-5%] w-[120px] h-[200px] z-20 hidden md:block stroke-gray-900"
              viewBox="0 0 100 200" fill="none" strokeWidth="2"
            >
              <circle cx="50" cy="30" r="20" fill="#b1a1c9" stroke="none" />
              <path d="M50 30 C 80 30, 80 60, 50 60 C 20 60, 20 90, 50 90 C 80 90, 80 120, 50 120 C 20 120, 20 150, 50 150 C 80 150, 80 180, 50 180" />
              <path d="M45 25 L50 30 L55 25" />
            </motion.svg>

            {/* SVG Decoration: Pill Toggle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-[20%] left-[-10%] w-[160px] h-[70px] bg-white rounded-full border-2 border-gray-900 z-20 hidden md:flex items-center p-2 shadow-sm"
            >
              <div className="w-14 h-14 rounded-full bg-[#b1a1c9] ml-auto"></div>
            </motion.div>

            {/* Top Right Image */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 right-10 w-[55%] h-[45%] overflow-hidden rounded-lg shadow-xl border border-gray-100 z-10"
            >
              <img src={images[0]} alt="Workspace 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            {/* Bottom Left Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute bottom-10 left-0 w-[45%] h-[40%] overflow-hidden rounded-lg shadow-xl border border-gray-100 z-10"
            >
              <img src={images[1]} alt="Workspace 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            {/* Bottom Right Image */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-0 right-0 w-[50%] h-[50%] overflow-hidden rounded-lg shadow-2xl border border-gray-100 z-10"
            >
              <img src={images[2]} alt="Workspace 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* ADDITIONAL SECTIONS (Passed as children) */}
      {children}
    </main>
  );
}
