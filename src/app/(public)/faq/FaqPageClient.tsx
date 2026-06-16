"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { Caveat } from "next/font/google";
import type { FaqSectionVM, FaqItemVM } from "@/features/faq/types";

const caveat = Caveat({ subsets: ["latin"] });

const FALLBACK_SECTION: FaqSectionVM = {
  badge_text: "Got Questions?",
  title: "Frequently Asked Questions",
  highlighted_word: "Questions",
  body_text:
    "Everything you need to know about Alley Workspace, memberships, amenities, and how we can help your business thrive.",
};

const FALLBACK_ITEMS: FaqItemVM[] = [
  {
    id: "1",
    category_id: null,
    question: "What are your operating hours?",
    answer:
      "Our workspaces are accessible 24/7 for dedicated desk and private cabin members. Our front desk and support staff are available Monday through Friday, from 9:00 AM to 6:00 PM.",
    sort_order: 0,
  },
];

export default function FaqPageClient({
  section,
  items,
}: {
  section: FaqSectionVM | null;
  items: FaqItemVM[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const s = section ?? FALLBACK_SECTION;
  const faqList = items.length > 0 ? items : FALLBACK_ITEMS;

  const titleParts = s.title.split(s.highlighted_word);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen font-sans bg-[#faf8f5] relative overflow-hidden selection:bg-[#F26522]/30">
      <Navbar />



      <section className="pt-40 pb-24 px-5 sm:px-8 lg:px-12 max-w-[1000px] mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6"
          >
            <MessageCircleQuestion className="w-5 h-5 text-[#F26522]" />
            <span className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
              {s.badge_text}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.1] text-gray-900 tracking-tight"
          >
            {titleParts[0]}
            <span className="text-[#F26522]">{s.highlighted_word}</span>
            {titleParts[1]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {s.body_text}
          </motion.p>
        </div>

        {/* ACCORDION LIST */}
        <div className="flex flex-col gap-4">
          {faqList.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.04 }}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? "bg-white border-[#F26522]/30 shadow-md"
                  : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left cursor-pointer group outline-none"
              >
                <span
                  className={`text-[24px] sm:text-[30px] font-bold transition-colors duration-300 ${caveat.className} ${
                    openIndex === index
                      ? "text-gray-900"
                      : "text-gray-800 group-hover:text-gray-900"
                  }`}
                >
                  {faq.question}
                </span>

                <div
                  className={`flex-shrink-0 ml-4 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    openIndex === index
                      ? "bg-[#F26522] border-[#F26522] text-white rotate-90 shadow-lg shadow-[#F26522]/30"
                      : "bg-gray-50 border-gray-200 text-gray-500 group-hover:border-gray-300 group-hover:text-gray-900"
                  }`}
                >
                  <ArrowUpRight className="w-6 h-6 transition-transform duration-300" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden rounded-b-2xl border-t border-gray-100"
                  >
                    <div className="text-gray-600 text-base sm:text-lg pb-6 px-6 sm:px-8">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
