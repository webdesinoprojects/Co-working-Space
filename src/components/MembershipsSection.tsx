"use client";

export function MembershipsSection() {
  return (
    <section className="bg-[#EFEFEF] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Badge Row */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
            4
          </div>
          <div className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Memberships
          </div>
        </div>
        
        <h2 className="text-center text-[clamp(1.75rem,5vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-16">
          Plans for every stage of growth
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-[#F26522] transition-colors duration-300 flex flex-col">
            <h3 className="text-[18px] font-semibold text-gray-900 mb-2">Hot Desk</h3>
            <p className="text-[14px] text-gray-600 mb-6">Flexible access to any open desk.</p>
            <div className="text-4xl font-bold text-gray-900 mb-8">£250<span className="text-[14px] font-medium text-gray-500">/mo</span></div>
            <ul className="flex-1 space-y-3 mb-8">
              <li className="flex items-center gap-3 text-[14px] text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Access during business hours</li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Ultra-fast WiFi</li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Specialty coffee & tea</li>
            </ul>
            <button className="w-full py-3 rounded-full border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300">Select Plan</button>
          </div>
          {/* Plan 2 */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-900 shadow-xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F26522] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">Most Popular</div>
            <h3 className="text-[18px] font-semibold text-white mb-2">Dedicated Desk</h3>
            <p className="text-[14px] text-gray-400 mb-6">Your own permanent desk setup.</p>
            <div className="text-4xl font-bold text-white mb-8">£400<span className="text-[14px] font-medium text-gray-500">/mo</span></div>
            <ul className="flex-1 space-y-3 mb-8">
              <li className="flex items-center gap-3 text-[14px] text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> 24/7 building access</li>
              <li className="flex items-center gap-3 text-[14px] text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Ergonomic chair & locking cabinet</li>
              <li className="flex items-center gap-3 text-[14px] text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Mail & package handling</li>
              <li className="flex items-center gap-3 text-[14px] text-gray-300"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> 5 meeting room credits/mo</li>
            </ul>
            <button className="w-full py-3 rounded-full bg-[#F26522] text-white font-medium hover:bg-[#e05a1a] transition-colors duration-300">Select Plan</button>
          </div>
          {/* Plan 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-[#F26522] transition-colors duration-300 flex flex-col">
            <h3 className="text-[18px] font-semibold text-gray-900 mb-2">Private Office</h3>
            <p className="text-[14px] text-gray-600 mb-6">Secure space for teams of 2-50.</p>
            <div className="text-4xl font-bold text-gray-900 mb-8">From £900<span className="text-[14px] font-medium text-gray-500">/mo</span></div>
            <ul className="flex-1 space-y-3 mb-8">
              <li className="flex items-center gap-3 text-[14px] text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Everything in Dedicated</li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Fully furnished & branded</li>
              <li className="flex items-center gap-3 text-[14px] text-gray-700"><div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div> Priority IT support</li>
            </ul>
            <button className="w-full py-3 rounded-full border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors duration-300">Contact Us</button>
          </div>
        </div>
      </div>
    </section>
  );
}
