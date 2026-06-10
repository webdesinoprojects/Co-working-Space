"use client";

import { motion, Variants } from "framer-motion";
import { MonitorPlay, Briefcase, TrendingUp, UserCheck } from "lucide-react";

const reasons = [
  {
    title: "Pro level Digital Marketing",
    desc: "Dive into the depth of the Digital Marketing world and learn skills that would never make you loose. Be a magician of the digital world as it would be wise to not be a spectator but be the creator.",
    icon: MonitorPlay,
    color: "#F26522",
    theme: "light",
  },
  {
    title: "Entrepreneurship",
    desc: "Time has gone, for the jobseekers as the market is changing everyday and every moment thus we here at Axion trains our members not just to fit in any kind of jobs but to survive anywhere on their own.",
    icon: Briefcase,
    color: "#ffffff",
    theme: "dark",
  },
  {
    title: "Sales Training",
    desc: "It's not enough for you to just learn a handful of digital marketing skills and run out of your comfort zone to achieve your goals. Thus we have included this Sales training just to make sure you are able to sell what you are best in.",
    icon: TrendingUp,
    color: "#00A1BA",
    theme: "light",
  },
  {
    title: "Personality Development",
    desc: "Once you are stuffed with every kind of skills, had gone through every technique of entrepreneurship and even become the data scientist.. don't you feel you need to polish your personality? We promise to polish that for you.",
    icon: UserCheck,
    color: "#111827",
    theme: "dark",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
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
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-black/10">
              4
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900 shadow-sm">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {reasons.map((item, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className={`p-8 sm:p-10 flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-2
                ${item.theme === 'dark' ? 'bg-gray-900 text-white shadow-2xl z-10 scale-105 rounded-2xl my-[-10px] sm:my-0 sm:mx-[-10px] lg:my-[-20px] lg:mx-[-10px]' : 'bg-white text-gray-900 border border-gray-100'}`}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 hover:scale-110"
                style={{ backgroundColor: item.theme === 'dark' ? '#1f2937' : item.color }}
              >
                <item.icon size={32} className={item.theme === 'dark' ? 'text-white' : 'text-white'} strokeWidth={1.5} />
              </div>
              <h3 className="text-[18px] sm:text-[20px] font-bold mb-4">{item.title}</h3>
              <p className={`text-[13px] sm:text-[14px] leading-relaxed ${item.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
