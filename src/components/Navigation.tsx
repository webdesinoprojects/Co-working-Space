"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LondonClock } from "@/components/LondonClock";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-500 md:hidden ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none delay-500"
        }`}
      >
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl mx-3 mb-3 p-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col gap-6 ${
            mobileMenuOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <LondonClock />
            <button 
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { name: "About Us", path: "about" },
              { name: "Workspaces", path: "workspaces" },
              { name: "Locations", path: "locations" },
              { name: "Journal", path: "journal" },
              { name: "Connect", path: "connect" }
            ].map((link) => (
              <a key={link.name} href={`/${link.path}`} className="text-[28px] sm:text-[32px] font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </a>
            ))}
          </div>
          <button className="group flex items-center justify-center w-full gap-4 bg-gray-900 text-white text-[16px] font-medium rounded-full py-4 mt-4">
            Find a space
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ABSOLUTE NAVIGATION - FIXED TO FLOAT OVER BACKGROUND */}
      <nav className="absolute top-0 left-0 right-0 z-50 w-full max-w-[1440px] mx-auto p-2 sm:p-3 pt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-full p-[5px] flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-white/40">
          {/* LEFT */}
          <div className="flex items-center gap-6 pl-1">
            <Link href="/" className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform border border-gray-200">
              <img src="/axion_logo.png" alt="Axion Logo" className="w-[70%] h-[70%] object-contain" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {[
                { name: "About Us", path: "about" },
                { name: "Workspaces", path: "workspaces" },
                { name: "Locations", path: "locations" },
                { name: "Journal", path: "journal" },
                { name: "Connect", path: "connect" }
              ].map((link) => (
                <a key={link.name} href={`/${link.path}`} className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors duration-300">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-6 pr-1">
            <span className="text-[13px] text-gray-600 hidden lg:block">Available for immediate move-in</span>
            <LondonClock />
            
            <button className="group flex items-center gap-4 bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 transition-colors duration-500">
              <div className="h-[20px] overflow-hidden flex flex-col">
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[20px]">Book a workspace</span>
                <span className="transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-[20px]">Book a workspace</span>
              </div>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <ArrowRight size={14} className="text-gray-900 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45" />
              </div>
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white mr-1"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={16} />
          </button>
        </div>
      </nav>
    </>
  );
}
