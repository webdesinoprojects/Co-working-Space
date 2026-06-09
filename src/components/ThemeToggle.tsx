"use client";

import { useTheme } from "@/lib/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card-bg text-foreground transition-all duration-300 hover:border-brand hover:shadow-md cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center"
          >
            <Moon className="h-[18px] w-[18px]" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center"
          >
            <Sun className="h-[18px] w-[18px]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
