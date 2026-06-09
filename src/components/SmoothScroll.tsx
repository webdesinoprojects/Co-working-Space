"use client";

import { useEffect, createContext, useContext, ReactNode, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

const SmoothScrollerContext = createContext<Lenis | null>(null);

export const useSmoothScroller = () => {
  return useContext(SmoothScrollerContext);
};

export const SmoothScrollerProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return (
    <SmoothScrollerContext.Provider value={lenisRef.current}>
      {children}
    </SmoothScrollerContext.Provider>
  );
};
