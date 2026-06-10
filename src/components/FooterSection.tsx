"use client";

import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-8 rounded-t-[40px] mt-[-40px] relative z-10 border-t border-gray-800">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Column 1: Addresses */}
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Address I</h4>
              <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
                148, Best Business Park,<br /> Netaji Subash Place,<br /> Pitampura, New Delhi – 110034
              </p>
            </div>
            <div>
              <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Address II</h4>
              <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
                11th Floor, Best Sky Tower,<br /> Netaji Subash Place,<br /> Pitampura, New Delhi – 110034
              </p>
            </div>
            <div>
              <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Address III</h4>
              <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
                Lower Ground, Best Business Square<br /> Plot No. 26, Sector-20, Dwarka,<br /> New Delhi – 110075
              </p>
              <p className="text-[13px] text-[#F26522] font-semibold mt-3">
                Timings: 9:00 AM to 7:30 PM
              </p>
            </div>
          </div>

          {/* Column 2: Contact Info */}
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Call Us</h4>
              <a href="tel:+919639636131" className="text-[16px] text-white hover:text-[#F26522] transition-colors font-medium flex items-center gap-3">
                <Phone size={18} className="text-[#F26522]" />
                +91 963 963 6131
              </a>
            </div>
            <div>
              <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Email</h4>
              <a href="mailto:admin@axionspaces.in" className="text-[16px] text-white hover:text-[#F26522] transition-colors font-medium flex items-center gap-3">
                <Mail size={18} className="text-[#F26522]" />
                admin@axionspaces.in
              </a>
            </div>
            <div>
              <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Call Us (Alternative)</h4>
              <a href="tel:+919639635080" className="text-[16px] text-white hover:text-[#F26522] transition-colors font-medium flex items-center gap-3">
                <Phone size={18} className="text-[#F26522]" />
                +91 963 963 5080
              </a>
            </div>
          </div>

          {/* Column 3: Sitemap */}
          <div className="flex flex-col gap-2">
            <h4 className="text-[12px] font-bold tracking-widest text-gray-500 uppercase mb-4">Sitemap</h4>
            {[
              { name: "About", href: "/about" },
              { name: "Offerings", href: "/workspaces" },
              { name: "Amenities", href: "/#amenities" },
              { name: "Contact Us", href: "/connect" },
              { name: "Privacy Policy", href: "#" },
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-[14px] text-gray-300 hover:text-white hover:translate-x-1 transition-all py-2 font-medium uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Column 4: Maps placeholders */}
          <div className="flex flex-col gap-6">
            <div className="relative w-full h-[150px] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group cursor-pointer">
              {/* Fake Map UI for aesthetics */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #374151 10%, transparent 11%), radial-gradient(circle at 50% 50%, #374151 10%, transparent 11%)', backgroundSize: '20px 20px' }}></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                <MapPin size={32} className="text-[#F26522] drop-shadow-[0_0_15px_rgba(242,101,34,0.5)]" />
                <span className="text-[12px] font-bold bg-white text-gray-900 px-3 py-1 rounded shadow-lg">Pitampura Center</span>
              </div>
              <div className="absolute top-3 left-3 bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded">Open in Maps ↗</div>
            </div>

            <div className="relative w-full h-[150px] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group cursor-pointer">
              {/* Fake Map UI for aesthetics */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #374151 10%, transparent 11%), radial-gradient(circle at 50% 50%, #374151 10%, transparent 11%)', backgroundSize: '20px 20px', backgroundPosition: '10px 10px' }}></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                <MapPin size={32} className="text-[#00A1BA] drop-shadow-[0_0_15px_rgba(0,161,186,0.5)]" />
                <span className="text-[12px] font-bold bg-white text-gray-900 px-3 py-1 rounded shadow-lg">Dwarka Center</span>
              </div>
              <div className="absolute top-3 left-3 bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded">Open in Maps ↗</div>
            </div>
          </div>

        </div>

        {/* Disclaimer Note */}
        <div className="text-center pb-8 border-b border-gray-800">
          <p className="text-[12px] text-gray-500 font-medium">
            Note: Amenities may vary center to center and all the pictures used in the website may differ from the actual.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8">
          <div className="text-[13px] text-gray-500 font-medium">
            &copy; Copyright 2022 - {new Date().getFullYear()} | Axion Spaces | All Rights Reserved
          </div>
          
          <div className="flex items-center gap-5">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              {/* Pinterest Icon (lucide doesn't have it natively, using a circle as placeholder or text) */}
              <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">P</div>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-[#25D366] transition-colors"><MessageCircle size={20} /></a>
          </div>
        </div>

      </div>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/919639636131" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-110">
        <MessageCircle size={28} />
      </a>
    </footer>
  );
}
