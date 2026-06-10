"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, User, Phone, MessageSquare, Building } from "lucide-react";

export function ContactSection() {
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
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#F26522] text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center shadow-lg shadow-black/10">
              C
            </div>
            <div className="text-[12px] sm:text-[13px] font-medium border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[#F26522] shadow-sm">
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
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Phone size={20} className="text-gray-900" />
              </div>
              <div>
                <div className="text-[13px] text-gray-500 font-medium">Call Us</div>
                <div className="text-[16px] font-semibold text-gray-900">+91 98765 43210</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Mail size={20} className="text-gray-900" />
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
          className="flex-1 w-full max-w-2xl bg-[#FAFAFA] border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          {/* Subtle decorative background gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A1BA] opacity-[0.03] rounded-full blur-[80px]"></div>
          
          <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-[12px] font-semibold text-gray-600 mb-2 block uppercase tracking-wider">Your Name*</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="John Doe" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-[15px] text-gray-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all" required />
                </div>
              </div>
              
              <div className="relative">
                <label className="text-[12px] font-semibold text-gray-600 mb-2 block uppercase tracking-wider">Email ID*</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" placeholder="john@company.com" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-[15px] text-gray-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-[12px] font-semibold text-gray-600 mb-2 block uppercase tracking-wider">Contact Number*</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" placeholder="+91 00000 00000" className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-[15px] text-gray-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all" required />
                </div>
              </div>
              
              <div className="relative">
                <label className="text-[12px] font-semibold text-gray-600 mb-2 block uppercase tracking-wider">Interested In*</label>
                <div className="relative">
                  <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-[15px] text-gray-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all appearance-none cursor-pointer" required defaultValue="">
                    <option value="" disabled>Select Workspace Type</option>
                    <option value="private-office">Private Office</option>
                    <option value="dedicated-desk">Dedicated Desk</option>
                    <option value="hot-desk">Hot Desk</option>
                    <option value="meeting-room">Meeting Room</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="text-[12px] font-semibold text-gray-600 mb-2 block uppercase tracking-wider">Comments</label>
              <div className="relative">
                <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400" />
                <textarea rows={4} placeholder="Tell us more about your requirements..." className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-[15px] text-gray-900 focus:outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522] transition-all resize-none"></textarea>
              </div>
            </div>

            <button type="submit" className="group flex items-center justify-center w-full gap-3 bg-[#F26522] hover:bg-[#e05615] text-white text-[15px] font-semibold rounded-xl py-4 transition-colors duration-300 mt-2">
              Enquire Now
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>

        </motion.div>
      </div>
    </section>
  );
}
