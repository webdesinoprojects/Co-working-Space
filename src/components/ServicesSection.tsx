"use client";

import { motion } from "framer-motion";
import { User, Users, Laptop, Monitor, Briefcase, Building, Presentation, Video, CheckCircle2, XCircle } from "lucide-react";

const AnimatedCheck = () => (
  <motion.svg
    width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="#F26522" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="flex-shrink-0"
  >
    <motion.circle
      cx="12" cy="12" r="10"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
    />
    <motion.path
      d="m9 12 2 2 4-4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.2 }}
    />
  </motion.svg>
);

const AnimatedCross = () => (
  <motion.svg
    width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="flex-shrink-0 text-gray-400"
  >
    <motion.circle
      cx="12" cy="12" r="10"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
    />
    <motion.path
      d="m15 9-6 6"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.3 }}
    />
    <motion.path
      d="m9 9 6 6"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, delay: 0.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.1 }}
    />
  </motion.svg>
);

const offerings = [
  {
    title: "Day Pass",
    icon: User,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee/ Water", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: false },
      { name: "Conference Room Access*", included: false },
      { name: "Meeting Room Access*", included: false },
      { name: "Lockable Cabin", included: false },
      { name: "Reception Services", included: false },
      { name: "Office Address", included: false },
    ],
  },
  {
    title: "Hot Desk",
    icon: Laptop,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee/ Water", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: true },
      { name: "Conference Room Access*", included: false },
      { name: "Meeting Room Access*", included: false },
      { name: "Lockable Cabin", included: false },
      { name: "Reception Services", included: true },
      { name: "Office Address", included: true },
    ],
  },
  {
    title: "Dedicated Desk",
    icon: Monitor,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee/ Water", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: true },
      { name: "Conference Room Access*", included: true },
      { name: "Meeting Room Access*", included: true },
      { name: "Lockable Cabin", included: false },
      { name: "Reception Services", included: true },
      { name: "Office Address", included: true },
    ],
  },
  {
    title: "4-6 Seaters with Boss Cabin",
    icon: Briefcase,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee/ Water", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: true },
      { name: "Conference Room Access*", included: true },
      { name: "Meeting Room Access*", included: true },
      { name: "Lockable Cabin", included: true },
      { name: "Reception Services", included: true },
      { name: "Office Address", included: true },
    ],
  },
  {
    title: "2-20 Seaters Cabin",
    icon: Users,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee/ Water", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: true },
      { name: "Conference Room Access*", included: true },
      { name: "Meeting Room Access*", included: true },
      { name: "Lockable Cabin", included: true },
      { name: "Reception Services", included: true },
      { name: "Office Address", included: true },
    ],
  },
  {
    title: "Quote on Request Custom Office Space",
    icon: Building,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee Machine", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: true },
      { name: "Conference Room", included: true },
      { name: "Meeting Room", included: true },
      { name: "Lockable Office", included: true },
      { name: "Reception Services", included: true },
      { name: "Office Address", included: true },
    ],
  },
  {
    title: "Meeting Room",
    icon: Presentation,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee/ Water", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: false },
      { name: "Reception Services", included: true },
    ],
  },
  {
    title: "Conference Room",
    icon: Video,
    features: [
      { name: "High Speed Internet", included: true },
      { name: "Air Conditioned Area", included: true },
      { name: "Tea/ Coffee/ Water", included: true },
      { name: "Printer/ Photocopier/ Scanner*", included: false },
      { name: "Reception Services", included: true },
    ],
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-300 text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-6">
            Offerings
          </div>
          <h2 className="font-spaceGrotesk text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-gray-900">
            Price on Request
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-7xl mx-auto">
          {offerings.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -8, boxShadow: "0px 20px 40px -10px rgba(0,0,0,0.1)" }}
              className="bg-[#F8F8F8] rounded-3xl p-8 md:p-10 flex flex-col w-full md:w-[calc(33.333%-22px)] max-w-[400px] border border-gray-100 transition-all duration-300"
            >
              <div className="flex flex-col items-center mb-8">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center mb-4 shadow-lg"
                >
                  <plan.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="font-spaceGrotesk text-[20px] font-semibold text-gray-900 text-center">
                  {plan.title}
                </h3>
              </div>

              <ul className="flex-1 space-y-4 mb-10">
                {plan.features.map((feat, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    {feat.included ? <AnimatedCheck /> : <AnimatedCross />}
                    <span className={`text-[14px] font-medium ${feat.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feat.name}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex justify-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#F26522] text-white font-semibold text-[15px] py-3.5 px-8 rounded-full shadow-lg shadow-[#F26522]/30 hover:bg-[#e05a1a] transition-colors"
                >
                  Enquire Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
