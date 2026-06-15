"use client";

import Navbar from "@/components/Navbar";

export default function WorkspacesPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] font-sans">
      <Navbar />
      
      {/* HEADER SECTION */}
      <section className="pt-32 pb-16 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform border border-gray-200">
              <img src="/axion_logo.png" alt="Axion Logo" className="w-[70%] h-[70%] object-contain" />
            </div>
            <div className="text-[13px] sm:text-[14px] font-medium bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-1.5 text-gray-900 shadow-sm">
              Spaces
            </div>
          </div>
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
            Workspaces tailored for ambitious teams.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-gray-600 leading-relaxed max-w-2xl">
            From private suites to dedicated desks, discover environments engineered for focus, collaboration, and growth.
          </p>
        </div>
      </section>

      {/* CONTENT PLACEHOLDER */}
      <section className="pb-32 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 h-[400px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="w-full h-[60%] bg-gray-100 rounded-2xl mb-6"></div>
              <div className="w-1/2 h-6 bg-gray-200 rounded-full mb-3"></div>
              <div className="w-3/4 h-4 bg-gray-100 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
