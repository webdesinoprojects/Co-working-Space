"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  const pathname = usePathname();
  const router = useRouter();

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
      <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl rounded-[1.25rem] border border-border bg-black shadow-[0_18px_70px_var(--card-shadow)] transition-all duration-300">
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
                <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white cursor-pointer">
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
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white cursor-pointer"
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
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black text-white shadow-sm cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto p-3 shadow-2xl backdrop-blur-xl lg:hidden mt-2 max-w-7xl rounded-[1.25rem] border border-white/10 bg-black/95"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div key={item.name}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileDropdown(
                          mobileDropdown === item.name ? null : item.name
                        )
                      }
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-bold text-white/90 hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobileDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileDropdown === item.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3"
                        >
                          {item.dropdown.map((sub) => (
                            <button
                              key={sub.name}
                              onClick={() => handleNavClick(sub.href)}
                              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer text-left"
                            >
                              {sub.name}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="w-full text-left rounded-lg px-4 py-3 text-sm font-bold text-white/90 hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    {item.name}
                  </button>
                )
              )}

              <div className="mt-2 border-t border-border pt-3">
                <button 
                  onClick={() => handleNavClick("calculator")}
                  className="btn-primary w-full shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book a Tour</span>
                  <PhoneCall className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
