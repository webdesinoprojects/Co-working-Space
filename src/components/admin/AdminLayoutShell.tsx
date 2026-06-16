"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";
import type { WorkspaceNavItem } from "@/components/WorkspaceNavContext";

const LiquidChrome = dynamic(() => import("./LiquidChrome").then(mod => mod.LiquidChrome), { ssr: false });

export function AdminLayoutShell({
  children,
  workspaceItems = [],
}: {
  children: React.ReactNode;
  workspaceItems?: WorkspaceNavItem[];
}) {
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
      {/* Mobile Warning Overlay */}
      <div className="fixed inset-0 z-[100] flex md:hidden flex-col items-center justify-center bg-gray-900/95 backdrop-blur-xl text-center px-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white mb-6 animate-bounce">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
          <path d="M12 18h.01"/>
        </svg>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight font-spaceGrotesk">Desktop Recommended</h2>
        <p className="text-gray-300 text-[15px] leading-relaxed max-w-[300px]">
          This admin dashboard is designed for larger screens due to complex data tables. Please rotate your device or use a laptop/desktop for the best experience.
        </p>
      </div>

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
          <AdminSidebar
            isOpen={open}
            onToggle={() => setOpen((v) => !v)}
            workspaceItems={workspaceItems}
          />
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
