"use client";

import { LondonClock } from "@/components/LondonClock";

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#EFEFEF] font-sans">
      <nav className="relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3 pt-4">
        <div className="bg-white/90 backdrop-blur-md rounded-full p-[5px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-6 pl-1">
            <a href="/" className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform border border-gray-200">
              <img src="/axion_logo.png" alt="Axion Logo" className="w-[70%] h-[70%] object-contain" />
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/workspaces" className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors">Workspaces</a>
              <a href="/locations" className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors">Locations</a>
              <a href="/journal" className="text-[14px] text-[#F26522] font-medium transition-colors">Journal</a>
              <a href="/connect" className="text-[14px] text-gray-900 hover:text-[#F26522] transition-colors">Connect</a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 pr-1">
            <LondonClock />
            <a href="/" className="bg-gray-900 hover:bg-black text-white text-[13px] font-medium rounded-full px-5 py-2 transition-colors">Back to Home</a>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-32 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center mb-8">
          <span className="font-bold">J</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-gray-900 mb-8">Journal</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Insights, stories, and news from our community of professionals and innovators.
        </p>
        <div className="mt-16 w-full max-w-4xl h-[400px] border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400">
          Content Coming Soon
        </div>
      </section>
    </main>
  );
}
