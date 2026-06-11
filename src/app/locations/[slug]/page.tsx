"use client";

import { useEffect, useState, use } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { notFound } from "next/navigation";
import { locationsData } from "@/data/locations";
import Navbar from "@/components/Navbar";
import { MapPin, Mail, Phone, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.div
      style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.2em" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const ScrollSVG = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <div className="absolute top-40 left-4 md:left-12 lg:left-20 bottom-0 w-[40px] hidden lg:block pointer-events-none z-0">
      <svg width="40" height="100%" preserveAspectRatio="xMidYMin slice" fill="none" stroke="#1A362D" strokeWidth="1" strokeOpacity="0.1">
        <path d="M20,0 C20,100 40,200 20,300 C0,400 20,500 20,600 C20,700 40,800 20,900 C0,1000 20,1100 20,1200 C20,1300 40,1400 20,1500 C0,1600 20,1700 20,1800 C20,1900 40,2000 20,2100 C0,2200 20,2300 20,2400 C20,2500 40,2600 20,2700 C0,2800 20,2900 20,3000 C20,3100 40,3200 20,3300 C0,3400 20,3500 20,3600 C20,3700 40,3800 20,3900 C0,4000 20,4100 20,4200" />
      </svg>
      <svg className="absolute top-0 left-0" width="40" height="100%" preserveAspectRatio="xMidYMin slice" fill="none" stroke="#1A362D" strokeWidth="2.5">
        <motion.path 
          d="M20,0 C20,100 40,200 20,300 C0,400 20,500 20,600 C20,700 40,800 20,900 C0,1000 20,1100 20,1200 C20,1300 40,1400 20,1500 C0,1600 20,1700 20,1800 C20,1900 40,2000 20,2100 C0,2200 20,2300 20,2400 C20,2500 40,2600 20,2700 C0,2800 20,2900 20,3000 C20,3100 40,3200 20,3300 C0,3400 20,3500 20,3600 C20,3700 40,3800 20,3900 C0,4000 20,4100 20,4200" 
          style={{ pathLength: scrollYProgress }} 
        />
      </svg>
    </div>
  );
};

export default function LocationPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Use React.use to unwrap the Promise in Next 15, or fallback to direct access
  const unwrappedParams = params instanceof Promise ? use(params) : params;
  const location = locationsData.find((l) => l.slug === unwrappedParams.slug);

  if (!location) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F4F1E1] text-[#1A362D] font-inter relative selection:bg-[#1A362D] selection:text-[#F4F1E1]">
      <Navbar />
      <ScrollSVG />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 lg:pl-32 pt-32 sm:pt-40 pb-24 relative z-10">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20">
          <div className="flex-1">
            <h1 className="font-spaceGrotesk text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[1.05] tracking-tight">
              <AnimatedText text={location.title} />
            </h1>
          </div>
          
          <div className="lg:w-[350px] flex flex-col gap-6 pt-2">
            <p className="text-[16px] font-medium opacity-80 leading-relaxed border-b border-[#1A362D]/20 pb-6">
              {location.subtitle}
            </p>
            <ul className="flex flex-col gap-4 text-[14px] font-medium opacity-70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{location.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>{location.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>{location.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{location.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BENTO GRID IMAGES */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:gap-6 mb-24 h-[500px] md:h-[700px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 md:row-span-2 rounded-3xl overflow-hidden relative"
          >
            <img src={location.images[0]} alt="Workspace Main" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 md:row-span-1 rounded-3xl overflow-hidden relative hidden md:block"
          >
            <img src={location.images[1]} alt="Workspace Detail 1" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 md:row-span-1 rounded-3xl overflow-hidden relative hidden md:block"
          >
            <img src={location.images[2]} alt="Workspace Detail 2" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* FEATURES SECTION */}
        <div className="py-16 border-t border-[#1A362D]/20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#1A362D]/30 text-[12px] font-bold uppercase tracking-widest mb-12">
            Discover {location.mapAddress}
          </div>
          
          <div className="flex flex-col gap-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start pb-12 border-b border-[#1A362D]/20">
              <h2 className="font-spaceGrotesk text-[clamp(2rem,3vw,3rem)] font-medium leading-[1.1] flex-1">
                {location.featuresTitle}
              </h2>
              <p className="flex-1 text-[16px] md:text-[18px] opacity-80 leading-relaxed font-medium">
                {location.featuresDesc}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <h2 className="font-spaceGrotesk text-[clamp(2rem,3vw,3rem)] font-medium leading-[1.1] flex-1">
                {location.servicesTitle}
              </h2>
              <p className="flex-1 text-[16px] md:text-[18px] opacity-80 leading-relaxed font-medium">
                {location.servicesDesc}
              </p>
            </div>
          </div>
        </div>

        {/* PRICING SECTION (NEWLY ADDED) */}
        <div className="py-16 border-t border-[#1A362D]/20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#1A362D]/30 text-[12px] font-bold uppercase tracking-widest mb-12">
            Pricing & Plans
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Open seats",
                desc: "Flexible coworking seats for solo professionals and compact teams.",
                price: "From Rs. 5,000/month"
              },
              {
                title: "Private cabins",
                desc: "Lockable, furnished team cabins with shared amenities included.",
                price: "From Rs. 5,500/seat"
              },
              {
                title: "Meeting rooms",
                desc: "Professional rooms for client meetings, interviews, and workshops.",
                price: "Hourly and daily slots"
              }
            ].map((plan, i) => (
              <div key={i} className="bg-[#1A362D]/5 rounded-3xl p-8 border border-[#1A362D]/10 hover:bg-[#1A362D]/10 transition-colors">
                <h3 className="font-spaceGrotesk text-2xl font-medium mb-4">{plan.title}</h3>
                <p className="text-[15px] opacity-80 mb-8 min-h-[60px] font-medium">{plan.desc}</p>
                <div className="font-bold text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#F26522]" />
                  {plan.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOCATION & ACCESS SECTION */}
        <div className="py-16 border-t border-[#1A362D]/20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#1A362D]/30 text-[12px] font-bold uppercase tracking-widest mb-12">
            Location & Access
          </div>
          
          <h2 className="font-spaceGrotesk text-[clamp(2.5rem,4vw,4rem)] font-medium leading-[1.1] max-w-3xl mb-16">
            Conveniently located in the heart of {location.mapAddress}
          </h2>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* STYLIZED MOCK MAP */}
            <div className="flex-1 bg-[#EAE7D6] rounded-[40px] p-8 min-h-[400px] border border-[#1A362D]/10 relative overflow-hidden flex items-center justify-center">
              {/* Abstract map lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,30 Q20,35 40,20 T70,40 T100,10" fill="none" stroke="#1A362D" strokeWidth="0.5" />
                <path d="M30,0 Q35,40 20,70 T10,100" fill="none" stroke="#1A362D" strokeWidth="0.5" />
                <path d="M60,0 Q50,50 80,80 T90,100" fill="none" stroke="#1A362D" strokeWidth="0.5" />
                <path d="M0,60 Q40,60 60,50 T100,70" fill="none" stroke="#1A362D" strokeWidth="0.5" />
              </svg>
              
              {/* Center Map Pin */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-[#1A362D] text-[#F4F1E1] flex items-center justify-center shadow-2xl">
                <MapPin className="w-8 h-8" />
                {/* Ping animation */}
                <div className="absolute inset-0 rounded-full bg-[#1A362D] animate-ping opacity-50"></div>
              </div>

              {/* Smaller surrounding pins */}
              <div className="absolute top-1/4 left-1/4 w-10 h-10 rounded-full bg-[#1A362D]/80 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="absolute bottom-1/3 right-1/4 w-10 h-10 rounded-full bg-[#1A362D]/80 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-10 lg:pt-8">
              <p className="text-[16px] opacity-80 leading-relaxed font-medium">
                Situated in a prime area, providing easy access to transportation, local attractions, and essential amenities. Our central location makes it simple to connect with the vibrant business community.
              </p>

              <div>
                <h3 className="font-spaceGrotesk text-2xl font-medium mb-4">Getting Here</h3>
                <ul className="flex flex-col gap-3">
                  {location.gettingHere.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 opacity-80 text-[15px] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1A362D] mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-spaceGrotesk text-2xl font-medium mb-4">Nearby Amenities</h3>
                <ul className="flex flex-col gap-3">
                  {location.nearbyAmenities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 opacity-80 text-[15px] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1A362D] mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
