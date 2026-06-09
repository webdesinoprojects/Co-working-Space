"use client";

import { ArrowRight } from "lucide-react";

export function FooterSection() {
  return (
    <section className="bg-gray-900 pt-20 sm:pt-32 pb-10 sm:pb-12 rounded-t-[40px] mt-[-40px] relative z-10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        <h2 className="text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-[1] tracking-[-0.03em] text-white mb-8 max-w-5xl">
          Ready to upgrade your workspace?
        </h2>
        <p className="text-[16px] sm:text-[18px] text-gray-400 max-w-2xl mb-12">
          Join thousands of professionals who have already elevated their work environment. Book a tour today and experience the Axion difference.
        </p>
        
        <button className="group flex items-center gap-4 bg-white text-gray-900 text-[14px] sm:text-[16px] font-medium rounded-full pl-6 pr-3 py-3 transition-transform duration-500 hover:scale-105 mb-24">
          <div className="h-[24px] overflow-hidden flex flex-col">
            <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[24px]">Schedule a tour</span>
            <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[24px]">Schedule a tour</span>
          </div>
          <div className="w-8 h-8 bg-[#F26522] rounded-full flex items-center justify-center">
            <ArrowRight size={16} className="text-white transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
          </div>
        </button>

        {/* Footer Links */}
        <div className="w-full border-t border-gray-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-900 text-[10px] font-bold tracking-tight">AX</span>
            </div>
            <span className="text-white font-semibold tracking-wide">Axion Workspace</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-[14px] text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Locations</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="text-[13px] text-gray-500">
            &copy; {new Date().getFullYear()} Axion Workspace. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
}
