"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function SiteBackground() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 h-full w-full pointer-events-none overflow-hidden transition-colors duration-500">
      {theme === "light" ? (
        // Light Mode Background: Mesh grid with radial fade
        <div className="relative h-full w-full bg-[#faf9f6] transition-colors duration-500">
          <div 
            className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#e5e2d9_1px,transparent_1px),linear-gradient(to_bottom,#e5e2d9_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]"
          ></div>
        </div>
      ) : (
        // Dark Mode Background: Sleek matte black grid with deep glow
        <div className="relative h-full w-full bg-[#050505] transition-colors duration-500">
          <div 
            className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px]"
          ></div>
          <div 
            className="absolute left-0 right-0 top-[-20%] h-[1000px] w-full rounded-full bg-[radial-gradient(circle_500px_at_50%_300px,#ffd70008,#00000000)]"
          ></div>
        </div>
      )}
    </div>
  );
}
