"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, User, Phone, MessageSquare, Building } from "lucide-react";

const Panda = ({ state }: { state: "idle" | "peek" | "close" }) => {
  return (
    <div className="absolute -top-[85px] left-1/2 -translate-x-1/2 w-[120px] h-[90px] z-30 pointer-events-none" style={{ perspective: "500px" }}>
      
      {/* Head & Ears Wrapper for stretching animation */}
      <motion.div 
        className="absolute inset-0 origin-bottom"
        initial={false}
        animate={{
          y: state === "peek" ? 15 : 0,
          scale: state === "peek" ? 1.15 : 1,
          rotateX: state === "peek" ? -10 : 0 // Tilted slightly forward
        }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
      >
        {/* Ears */}
        <div className="absolute top-0 left-2 w-9 h-9 bg-[#2A2A2A] rounded-full" />
        <div className="absolute top-0 right-2 w-9 h-9 bg-[#2A2A2A] rounded-full" />
        
        {/* Head */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-[85px] bg-white rounded-[50px] flex flex-col items-center pt-[30px] shadow-sm border-b-2 border-gray-100">
          
          {/* Blush */}
          <div className="absolute top-[48px] left-[10px] w-5 h-3 bg-pink-300 rounded-full opacity-60" />
          <div className="absolute top-[48px] right-[10px] w-5 h-3 bg-pink-300 rounded-full opacity-60" />
          
          {/* Eye Patches */}
          <div className="flex gap-4 relative z-10 w-full justify-center">
             {/* Left Eye */}
             <div className="w-[30px] h-[36px] bg-[#2A2A2A] rounded-[15px] flex justify-center items-center -rotate-12 translate-x-1">
               <motion.div 
                 className="w-3 h-3 bg-white rounded-full"
                 animate={{
                   x: state === "peek" ? 2 : 4,
                   y: state === "peek" ? 4 : -4
                 }}
               />
             </div>
             {/* Right Eye */}
             <div className="w-[30px] h-[36px] bg-[#2A2A2A] rounded-[15px] flex justify-center items-center rotate-12 -translate-x-1">
               <motion.div 
                 className="w-3 h-3 bg-white rounded-full"
                 animate={{
                   x: state === "peek" ? -2 : -4,
                   y: state === "peek" ? 4 : -4
                 }}
               />
             </div>
          </div>
          
          {/* Nose */}
          <div className="w-5 h-3 bg-[#2A2A2A] rounded-[50%] mt-1 relative z-10" />
          {/* Mouth */}
          <div className="flex justify-center relative z-10 h-4 -mt-[1px]">
            {state === "peek" && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="translate-y-[1px]">
                  <path d="M12 0v6c0 6 7 6 9 0M12 6c0 6-7 6-9 0" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
            {state === "close" && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-4 h-[3px] bg-[#2A2A2A] rounded-full mt-1" 
              />
            )}
            {state === "idle" && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <svg width="20" height="10" viewBox="0 0 24 12" fill="none" className="translate-y-[1px]">
                  <path d="M12 0v5c0 5 6 5 8 0M12 5c0 5-6 5-8 0" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Paws */}
      <motion.div
        className="absolute w-[34px] h-[46px] bg-[#2A2A2A] rounded-[20px] z-40 border-[3px] border-white shadow-sm"
        initial={false}
        animate={{
          x: state === "close" ? -24 : -48,
          y: state === "close" ? 38 : 65,
          rotate: state === "close" ? 135 : 15
        }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        style={{ left: "50%", originX: 0.5, originY: 0.5, marginLeft: "-17px" }}
      />
      <motion.div
        className="absolute w-[34px] h-[46px] bg-[#2A2A2A] rounded-[20px] z-40 border-[3px] border-white shadow-sm"
        initial={false}
        animate={{
          x: state === "close" ? 24 : 48,
          y: state === "close" ? 38 : 65,
          rotate: state === "close" ? -135 : -15
        }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        style={{ left: "50%", originX: 0.5, originY: 0.5, marginLeft: "-17px" }}
      />
    </div>
  )
}

export function ContactSection() {
  const [pandaState, setPandaState] = useState<"idle" | "peek" | "close">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <section className="bg-white pt-20 sm:pt-32 pb-16 sm:pb-24 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* LEFT: TEXT & INFO */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F26522] text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-[#F26522]/30">
              C
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-[#F26522]/20 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[#F26522] shadow-sm">
              Get in Touch
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-gray-900 mb-6"
          >
            Let&apos;s discuss your <br className="hidden sm:block" /> workspace needs.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed max-w-lg mb-10 sm:mb-16"
          >
            Whether you need a dedicated desk for your startup or a custom headquarters for your enterprise, we have the perfect solution.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm transition-transform hover:scale-110 duration-300">
                <Phone size={20} className="text-[#F26522]" />
              </div>
              <div>
                <div className="text-[13px] text-gray-500 font-medium">Call Us</div>
                <div className="text-[16px] font-semibold text-gray-900">+91 98765 43210</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm transition-transform hover:scale-110 duration-300">
                <Mail size={20} className="text-[#F26522]" />
              </div>
              <div>
                <div className="text-[13px] text-gray-500 font-medium">Email Us</div>
                <div className="text-[16px] font-semibold text-gray-900">hello@axionspaces.com</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 w-full max-w-2xl relative mt-20 lg:mt-0"
        >
          {/* Panda Avatar Component */}
          <Panda state={pandaState} />
          
          <div className="bg-[#FAFAFA] border border-gray-100 rounded-[2.5rem] p-8 sm:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative z-20">
            {/* Subtle decorative background gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A1BA] opacity-[0.02] rounded-full blur-[80px]"></div>
            
            <form className="relative z-10 flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    onFocus={() => { setPandaState("peek"); }}
                    onBlur={() => { setPandaState("idle"); }}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-200 py-2 text-[16px] text-gray-900 focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-500 rounded-none focus:ring-0" 
                  />
                </div>
                
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="E-mail" 
                    required 
                    onFocus={() => { setPandaState("close"); }}
                    onBlur={() => { setPandaState("idle"); }}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-200 py-2 text-[16px] text-gray-900 focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-500 rounded-none focus:ring-0" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12">
                <div className="relative group">
                  <input 
                    type="tel" 
                    placeholder="Contact Number" 
                    required 
                    onFocus={() => { setPandaState("close"); }}
                    onBlur={() => { setPandaState("idle"); }}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-200 py-2 text-[16px] text-gray-900 focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-500 rounded-none focus:ring-0" 
                  />
                </div>
                
                <div className="relative group">
                  <select 
                    required 
                    defaultValue=""
                    onFocus={() => { setPandaState("peek"); }}
                    onBlur={() => { setPandaState("idle"); }}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-200 py-2 text-[16px] text-gray-500 focus:text-gray-900 focus:outline-none focus:border-gray-900 transition-colors appearance-none cursor-pointer rounded-none focus:ring-0" 
                  >
                    <option value="" disabled>Interested In</option>
                    <option value="private-office">Private Office</option>
                    <option value="dedicated-desk">Dedicated Desk</option>
                    <option value="hot-desk">Hot Desk</option>
                    <option value="meeting-room">Meeting Room</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <textarea 
                  rows={2} 
                  placeholder="Message" 
                  onFocus={() => { setPandaState("peek"); }}
                  onBlur={() => { setPandaState("idle"); }}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-200 py-2 text-[16px] text-gray-900 focus:outline-none focus:border-gray-900 transition-colors placeholder-gray-500 resize-none rounded-none focus:ring-0"
                ></textarea>
              </div>

              <div className="mt-4">
                <button type="submit" className="group flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white text-[15px] font-medium rounded-full py-4 px-10 transition-all duration-300 w-full sm:w-auto min-w-[200px]">
                  Contact Us
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
