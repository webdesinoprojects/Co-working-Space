"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  ArrowRight
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  {
    name: "Workspaces",
    dropdown: [
      { name: "Dedicated Desks", href: "/workspaces/dedicated-desks" },
      { name: "Private Cabins", href: "/workspaces/private-cabins" },
      { name: "Meeting Rooms", href: "/workspaces/meeting-rooms" },
      { name: "Virtual Office", href: "/workspaces/virtual-office" },
    ],
  },
  { name: "FAQs", href: "/faq" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileDropdown(null);
  };

  const handleNavClick = (href: string) => {
    closeMobileMenu();
    if (href.startsWith("#")) {
      if (pathname !== "/") {
        router.push("/" + href);
      } else {
        const element = document.getElementById(href.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full px-3 py-3 select-none">
      <div className={`mx-auto flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl rounded-[1.25rem] border transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]' : 'bg-transparent border-transparent shadow-none'}`}>
        <Link 
          href="/" 
          className="flex items-center gap-2 rounded-full transition-all hover:scale-105 active:scale-95 h-10 w-28 sm:h-12 sm:w-36 relative"
        >
          <img src="/axion_logo.png" alt="Axion Logo" className="absolute inset-0 w-full h-full object-contain object-left" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.dropdown ? (
              <li key={item.name} className="group relative">
                <button className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-colors ${scrolled ? 'text-white/90 hover:bg-white/10 hover:text-white' : 'text-gray-900 hover:bg-gray-100 hover:text-black'}`}>
                  {item.name}
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>

                <div className="invisible absolute left-0 top-full w-64 translate-y-3 rounded-2xl border border-white/10 bg-[#121212] p-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                  {item.dropdown.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleNavClick(sub.href)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white cursor-pointer text-left"
                    >
                      {sub.name}
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold cursor-pointer transition-colors ${scrolled ? 'text-white/90 hover:bg-white/10 hover:text-white' : 'text-gray-900 hover:bg-gray-100 hover:text-black'}`}
                >
                  {item.name}
                </button>
              </li>
            )
          )}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <button 
            onClick={() => handleNavClick("calculator")}
            className="btn-primary min-h-[2.5rem] px-5 text-sm py-2 cursor-pointer shadow-md flex items-center gap-2"
          >
            <span>Book a Tour</span>
            <PhoneCall className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black text-white shadow-sm cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            />
            
            {/* Sliding Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[85vw] max-w-sm bg-[#0D0D0D] border-l border-white/10 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <img src="/axion_logo.png" alt="Axion Logo" className="h-8 object-contain" />
                <button
                  onClick={closeMobileMenu}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div key={item.name} className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileDropdown(
                            mobileDropdown === item.name ? null : item.name
                          )
                        }
                        className={`flex w-full items-center justify-between rounded-xl px-5 py-4 text-left text-lg font-bold text-white transition-all duration-300 ${
                          mobileDropdown === item.name 
                            ? "border border-[#F26522]/40 bg-[#F26522]/5 shadow-[0_0_15px_rgba(242,101,34,0.1)]" 
                            : "border border-transparent hover:bg-white/5"
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-400 ease-in-out ${
                            mobileDropdown === item.name ? "rotate-180 text-[#F26522]" : "text-gray-400"
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileDropdown === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 pt-2 pb-4 px-3">
                              {item.dropdown.map((sub) => (
                                <button
                                  key={sub.name}
                                  onClick={() => handleNavClick(sub.href)}
                                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-[15px] font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-left group"
                                >
                                  {sub.name}
                                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[#F26522]" />
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.href)}
                      className="w-full text-left rounded-xl px-5 py-4 text-lg font-bold text-white transition-colors hover:bg-white/5 border border-transparent"
                    >
                      {item.name}
                    </button>
                  )
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-[#0A0A0A]">
                <button 
                  onClick={() => handleNavClick("calculator")}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#1A1A1A] hover:bg-[#F26522] py-4 text-[16px] font-bold text-white transition-all duration-300 shadow-md"
                >
                  <span>Book a Tour</span>
                  <PhoneCall className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
