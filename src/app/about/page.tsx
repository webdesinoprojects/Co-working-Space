"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import MagicBento from "@/components/MagicBento";
import { Building2, Zap, ShieldCheck, CheckCircle2, Orbit, Fingerprint, Gem, Radar, Aperture, Satellite } from "lucide-react";

export default function AboutPage() {
  return (
    <AuroraBackground className="!bg-[#F8F8F8] !text-gray-900 font-sans overflow-hidden items-start justify-start flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-20 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="flex-1 flex flex-col gap-6 max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="text-[13px] sm:text-[14px] font-semibold bg-white border border-gray-200 text-gray-900 rounded-full px-4 py-1.5 shadow-sm uppercase tracking-wider">
                About Axion Spaces
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900 pr-4"
            >
              Premium workspace built for professionals who want clarity, speed, and a better workday.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed max-w-2xl"
            >
              Axion Spaces was built to make office decisions easier for founders, freelancers, and growing teams. We combine well-managed spaces, practical amenities, and responsive support so visitors can move from inquiry to visit to booking without friction.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex-1 w-full h-[400px] sm:h-[500px] lg:h-[600px] relative"
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 h-full w-full p-2">
              <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                 <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Workspace" />
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md border border-gray-100">
                 <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Office desk" />
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md border border-gray-100">
                 <img src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Meeting room" />
              </div>
              <div className="col-span-2 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                 <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Team collaboration" />
              </div>
              <div className="rounded-[20px] overflow-hidden shadow-md border border-gray-100">
                 <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Modern office" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="pb-24 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-lg"
          >
            <Building2 size={32} className="text-[#F26522] mb-6" />
            <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">Location</h3>
            <h2 className="text-[28px] font-bold text-gray-900 mb-4">Noida & Delhi</h2>
            <p className="text-gray-600 leading-relaxed">Business-ready workspaces in strong commercial zones.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-lg"
          >
            <Zap size={32} className="text-[#F26522] mb-6" />
            <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">Move-in Speed</h3>
            <h2 className="text-[28px] font-bold text-gray-900 mb-4">24 Hours</h2>
            <p className="text-gray-600 leading-relaxed">A faster path from first conversation to operational office space.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
          >
            <ShieldCheck size={32} className="text-[#F26522] mb-6" />
            <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-2">Experience</h3>
            <h2 className="text-[28px] font-bold text-gray-900 mb-4">Premium</h2>
            <p className="text-gray-600 leading-relaxed">Professional interiors, managed operations, and strong daily usability.</p>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-24 relative z-10 bg-white border-y border-gray-200">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h3 className="text-[14px] font-bold text-[#F26522] uppercase tracking-widest mb-4">Our Story</h3>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] text-gray-900 mb-8">
              Built to make modern office decisions simpler
            </h2>
            <div className="space-y-6 text-[16px] sm:text-[18px] text-gray-600 leading-relaxed">
              <p>
                Axion Spaces started with a practical goal: create workspace experiences that feel professional, flexible, and easy to act on. Instead of overwhelming people with vague options, we focus on clarity, usability, and genuine support.
              </p>
              <p>
                We know that for many businesses, choosing an office is not just about square footage. It is about trust, speed, presentation, and whether the environment helps the team work better every day.
              </p>
              <p>
                That is why our approach blends clean infrastructure, managed amenities, quick response times, and a direct path from first inquiry to office visit and booking.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-[#F8F8F8] p-6 rounded-2xl shadow-sm border border-gray-200">
                <h4 className="text-[18px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#F26522]" /> What We Believe
                </h4>
                <p className="text-[14px] text-gray-600 leading-relaxed">A workspace should remove friction, not add to it. Faster replies and cleaner operations help visitors make confident decisions.</p>
              </div>
              <div className="bg-[#F8F8F8] p-6 rounded-2xl shadow-sm border border-gray-200">
                <h4 className="text-[18px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-[#F26522]" /> What We Deliver
                </h4>
                <p className="text-[14px] text-gray-600 leading-relaxed">Spaces that feel premium on day one. Every setup is designed to feel polished, practical, and business-ready.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <MagicBento 
              textAutoHide={true}
              enableStars={false}
              enableSpotlight={true}
              enableBorderGlow={false}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={false}
              spotlightRadius={400}
              particleCount={0}
              glowColor="242, 101, 34"
              disableAnimations={true}
            />
          </motion.div>
        </div>
      </section>

      {/* CLIENT STORIES */}
      <section className="py-24 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h3 className="text-[14px] font-bold text-[#F26522] uppercase tracking-widest mb-4">Client Stories</h3>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] text-gray-900 mb-6">
            Real walkthroughs from teams already working here
          </h2>
          <p className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed">
            Trusted by 100+ companies and growing teams. Hear the experience in their own words, and see why teams move from first visit to booking with more confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { tag: "Team Growth", author: "Startup Operations Team", title: "Startup Team Finds Room to Grow", desc: "See how a fast-moving team gained flexibility, privacy, and a better client-facing setup.", icon: Orbit, color: "text-[#F26522]" },
            { tag: "Deep Work", author: "Independent Consultant", title: "Freelancers Finally Found Their Focus", desc: "A calmer workspace, reliable amenities, and a stronger routine made daily work smoother.", icon: Fingerprint, color: "text-[#F26522]" },
            { tag: "Meeting Ready", author: "Business Services Team", title: "Client Meetings Feel More Premium", desc: "Professional meeting rooms and a polished environment helped elevate every first impression.", icon: Gem, color: "text-[#F26522]" },
            { tag: "Daily Productivity", author: "Sales & Support Team", title: "The Daily Commute Became Worth It", desc: "Reliable internet, seamless access, and fewer distractions turned workdays into focused sessions.", icon: Radar, color: "text-[#F26522]" },
            { tag: "Collaboration", author: "Creative Studio", title: "Creative Teams Work Better Together", desc: "Open collaboration zones and flexible seating gave the team energy without losing structure.", icon: Aperture, color: "text-[#F26522]" },
            { tag: "Scaling Up", author: "Growing Remote Team", title: "From Home Office Chaos to Growth", desc: "Watch how Axion helped bring consistency, professionalism, and momentum back to work.", icon: Satellite, color: "text-[#F26522]" }
          ].map((story, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg hover:border-gray-300 transition-all shadow-sm"
            >
              <div className="text-[12px] font-bold text-[#F26522] uppercase tracking-widest mb-2">{story.tag}</div>
              <h3 className="text-[20px] font-bold text-gray-900 mb-4">{story.title}</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed mb-6">{story.desc}</p>
              <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#F8F8F8] border border-gray-200 flex items-center justify-center">
                  <story.icon className={`w-5 h-5 ${story.color}`} />
                </div>
                <div className="text-[14px] font-semibold text-gray-900">{story.author}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </AuroraBackground>
  );
}
