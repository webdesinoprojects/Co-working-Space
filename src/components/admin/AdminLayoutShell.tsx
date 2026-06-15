"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";

const LiquidChrome = dynamic(() => import("./LiquidChrome").then(mod => mod.LiquidChrome), { ssr: false });

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <div
      className="relative flex h-screen w-full font-sans overflow-hidden bg-[#e6e6e6]"
      data-lenis-prevent
      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
    >
      {/* Liquid Chrome interactive background as the ONLY background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <LiquidChrome
          baseColor={[0.85, 0.85, 0.85]}
          speed={0.2}
          amplitude={0.5}
          interactive
        />
      </div>

      {/* Main Container - Apple Vision Pro style ultra-glass */}
      <div className="relative z-10 flex h-full w-full p-4 sm:p-6 lg:p-8 pointer-events-none">
        <div className="flex w-full h-full bg-white/5 backdrop-blur-sm border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden pointer-events-auto">
          <AdminSidebar isOpen={open} onToggle={() => setOpen((v) => !v)} />
          <ToastProvider>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-transparent">
              {children}
            </div>
          </ToastProvider>
        </div>
      </div>
    </div>
  );
}
