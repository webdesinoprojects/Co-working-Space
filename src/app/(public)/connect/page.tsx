"use client";

import Link from "next/link";
import { LondonClock } from "@/components/LondonClock";

export default function ConnectPage() {
  return (
    <main className="min-h-screen bg-[#EFEFEF] font-sans">
      <nav className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3 pt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-full p-[5px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6 pl-1">
            <Link href="/" className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform border border-gray-200">
              <img src="/axion_logo.png" alt="Axion Logo" className="w-[70%] h-[70%] object-contain" />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/workspaces" className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors">Workspaces</Link>
              <Link href="/locations" className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors">Locations</Link>
              <Link href="/journal" className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors">Journal</Link>
              <Link href="/connect" className="text-[14px] text-[#F26522] font-medium transition-colors">Connect</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 pr-1">
            <LondonClock />
            <Link href="/" className="bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-full px-5 py-2 transition-colors">Back to Home</Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center mb-8">
          <span className="font-bold">C</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-gray-900 mb-8">Connect</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Get in touch with our team to find the perfect workspace for your business.
        </p>
        <div className="mt-16 w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="h-12 bg-gray-100 rounded-lg w-full animate-pulse"></div>
          <div className="h-12 bg-gray-100 rounded-lg w-full animate-pulse"></div>
          <div className="h-32 bg-gray-100 rounded-lg w-full animate-pulse"></div>
          <div className="h-12 bg-gray-900 rounded-lg w-32 mt-4 animate-pulse"></div>
        </div>
      </section>
    </main>
  );
}
