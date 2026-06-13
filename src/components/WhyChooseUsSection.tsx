"use client";

import { motion, Variants } from "framer-motion";

const RollingTrackAnimation = () => (
  <div className="w-full h-32 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
    <svg viewBox="0 0 200 100" fill="none" className="w-full h-full overflow-visible">
      {/* Background Track */}
      <motion.path 
        d="M 40 50 C 40 20, 80 20, 100 50 C 120 80, 160 80, 160 50 C 160 20, 120 20, 100 50 C 80 80, 40 80, 40 50 Z" 
        stroke="#f3f4f6" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" 
      />
      {/* Animated Colored Track */}
      <motion.path 
        d="M 40 50 C 40 20, 80 20, 100 50 C 120 80, 160 80, 160 50 C 160 20, 120 20, 100 50 C 80 80, 40 80, 40 50 Z" 
        stroke="#F26522" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" 
        strokeDasharray="400"
        animate={{ strokeDashoffset: [400, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      />
      {/* Rolling Ball using offset-path */}
      <motion.circle 
        r="6" fill="#111827"
        className="drop-shadow-md"
        animate={{ offsetDistance: ["0%", "100%"] }}
        style={{ offsetPath: `path('M 40 50 C 40 20, 80 20, 100 50 C 120 80, 160 80, 160 50 C 160 20, 120 20, 100 50 C 80 80, 40 80, 40 50 Z')` }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  </div>
);

const IsometricCubeAnimation = () => (
  <div className="w-full h-32 relative flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
    <motion.svg viewBox="0 0 100 100" className="w-20 h-20 overflow-visible drop-shadow-[0_0_15px_rgba(242,101,34,0.3)]"
      animate={{ y: [-8, 8, -8] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Top Face */}
      <polygon points="50,15 85,35 50,55 15,35" fill="#F26522" opacity="1" />
      {/* Left Face */}
      <polygon points="15,35 50,55 50,90 15,70" fill="#cc551c" opacity="0.9" />
      {/* Right Face */}
      <polygon points="50,55 85,35 85,70 50,90" fill="#a64315" opacity="0.8" />
    </motion.svg>
    <motion.div 
      className="absolute bottom-4 w-12 h-2 bg-black/40 blur-sm rounded-full"
      animate={{ scale: [1, 0.7, 1], opacity: [0.4, 0.1, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const RisingGraphAnimation = () => (
  <div className="w-full h-32 relative flex items-end justify-center pb-6 group-hover:scale-110 transition-transform duration-500 gap-3">
    {[1, 2, 3, 4].map((i) => (
      <motion.div 
        key={i}
        className="w-8 bg-[#00A1BA] rounded-t-lg shadow-sm"
        initial={{ height: 10 }}
        animate={{ height: [10, i * 20 + 10, i * 20 + 10] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
      />
    ))}
    {/* Floating Arrow over the graph */}
    <motion.svg 
      className="absolute top-4 right-1/4 w-10 h-10 text-[#00A1BA] drop-shadow-md"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      animate={{ x: [-10, 10, -10], y: [10, -10, 10] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </motion.svg>
  </div>
);

const RippleAnimation = () => (
  <div className="w-full h-32 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
    {/* Expanding glowing ripples */}
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border-2 border-[#b1a1c9]"
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 120, height: 120, opacity: 0 }}
        transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
      />
    ))}
    {/* Solid center dot */}
    <div className="relative w-10 h-10 bg-[#b1a1c9] rounded-full shadow-[0_0_20px_rgba(177,161,201,0.6)]" />
  </div>
);

const reasons = [
  {
    title: "Pro level Digital Marketing",
    desc: "Dive into the depth of the Digital Marketing world and learn skills that would never make you loose. Be a magician of the digital world as it would be wise to not be a spectator but be the creator.",
    Animation: RollingTrackAnimation,
    theme: "light",
  },
  {
    title: "Entrepreneurship",
    desc: "Time has gone, for the jobseekers as the market is changing everyday and every moment thus we here at Axion trains our members not just to fit in any kind of jobs but to survive anywhere on their own.",
    Animation: IsometricCubeAnimation,
    theme: "dark",
  },
  {
    title: "Sales Training",
    desc: "It's not enough for you to just learn a handful of digital marketing skills and run out of your comfort zone to achieve your goals. Thus we have included this Sales training just to make sure you are able to sell what you are best in.",
    Animation: RisingGraphAnimation,
    theme: "light",
  },
  {
    title: "Personality Development",
    desc: "Once you are stuffed with every kind of skills, had gone through every technique of entrepreneurship and even become the data scientist.. don't you feel you need to polish your personality? We promise to polish that for you.",
    Animation: RippleAnimation,
    theme: "dark",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export function WhyChooseUsSection() {
  return (
    <section className="bg-[#FAFAFA] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F26522] text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-[#F26522]/30">
              4
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-[#F26522]/20 bg-white rounded-full px-4 py-1.5 text-gray-900 shadow-sm">
              Our Core Value
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.02em] text-gray-900 mb-6 uppercase"
          >
            Why Should You Choose Axion?
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[14px] sm:text-[16px] text-gray-600 leading-relaxed"
          >
            Because Axion, Is A Place your Ideas deserve..!! a simple question with a simple answer well if your are reading let us tell you more about these big lines we say.. An incubator, A lab of innovations, start-up friendly community, Axion, has many faces to get described. Axion is a archetypical ecosystem, providing essential resources and hard support to the birthing start-ups. Axion is truly a birthing suite for start-ups, turning expectations into reality.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {reasons.map((item, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className={`p-8 sm:p-10 flex flex-col items-center text-center group transition-all duration-500 rounded-[2.5rem]
                ${item.theme === 'dark' 
                  ? 'bg-[#0b0f19] text-white border border-gray-800 shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(242,101,34,0.2)] hover:-translate-y-3' 
                  : 'bg-white text-gray-900 border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-3'}`}
            >
              <div className="w-full mb-8">
                <item.Animation />
              </div>
              
              <h3 className="text-[20px] sm:text-[22px] font-bold mb-4 leading-tight">{item.title}</h3>
              <p className={`text-[14px] sm:text-[15px] leading-relaxed ${item.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
