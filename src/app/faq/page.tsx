"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    question: "What are your operating hours?",
    answer: "Our workspaces are accessible 24/7 for dedicated desk and private cabin members. Our front desk and support staff are available Monday through Friday, from 9:00 AM to 6:00 PM."
  },
  {
    question: "Do you offer day passes or trial days?",
    answer: "Yes! We offer a one-day free trial so you can experience our premium environment, high-speed internet, and amenities before making a commitment. You can also purchase individual day passes if you just need a temporary space."
  },
  {
    question: "How fast and reliable is the internet connection?",
    answer: "We provide enterprise-grade, ultra-fast fiber optic internet with dual-line redundancy. You can expect speeds up to 1 Gbps, ensuring seamless video calls and heavy file transfers without interruption."
  },
  {
    question: "What's included in a dedicated desk membership?",
    answer: "A dedicated desk membership includes 24/7 access, your own permanent desk setup, ergonomic seating, a lockable filing cabinet, printing credits, unlimited premium coffee, and access to all lounge areas."
  },
  {
    question: "Can I bring guests to the workspace?",
    answer: "Absolutely. Members are welcome to bring guests for meetings in our lounges or booked meeting rooms. Guests just need to sign in at the front desk upon arrival."
  },
  {
    question: "Are meeting rooms included in my membership?",
    answer: "Yes, dedicated desk and private cabin members receive a monthly allocation of meeting room credits. These credits can be used to book our state-of-the-art conference rooms via our member app."
  },
  {
    question: "Is printing and scanning available?",
    answer: "Yes, we have enterprise-grade multi-function printers and scanners on every floor. Members receive a monthly printing allowance, and scanning is entirely free."
  },
  {
    question: "Do you have private phone booths?",
    answer: "Yes, we offer soundproof private phone booths scattered throughout the workspace. They are free to use on a first-come, first-served basis and are perfect for private calls or deep focus work."
  },
  {
    question: "Is there a minimum commitment period for private cabins?",
    answer: "Our private cabins offer highly flexible terms. While our standard agreements run month-to-month, we offer significant discounts for 6-month and 12-month commitments."
  },
  {
    question: "What kind of coffee and snacks are provided?",
    answer: "We take our amenities seriously. Enjoy unlimited artisan roasted coffee, specialty teas, infused water, and a curated selection of healthy snacks in our fully stocked pantries."
  },
  {
    question: "Do you host networking events for members?",
    answer: "Yes! We foster a strong community by hosting regular networking events, workshops, founder mixers, and happy hours to help you connect and grow alongside other professionals."
  },
  {
    question: "Is parking available on-site?",
    answer: "Yes, we have secure, on-site basement parking available for members. Dedicated parking spots can be added to your membership package subject to availability."
  },
  {
    question: "Can I register my company at your address?",
    answer: "Yes, we offer professional business address registration and mail handling services. This is included in our Virtual Office packages and Private Cabin memberships."
  },
  {
    question: "How do I book a meeting room?",
    answer: "Meeting rooms can be booked instantly through our exclusive member app. You can view real-time availability, book rooms, and manage your credits all from your phone."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen font-sans bg-[#0a0a0a] relative overflow-hidden selection:bg-[#ff008a]/30">
      <Navbar />

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#8400ff]/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#ff008a]/20 blur-[120px] pointer-events-none"></div>
      
      <section className="pt-40 pb-24 px-5 sm:px-8 lg:px-12 max-w-[1000px] mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <MessageCircleQuestion className="w-5 h-5 text-[#60aed5]" />
            <span className="text-sm font-semibold text-white tracking-wide uppercase">Got Questions?</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.1] text-white tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff008a] to-[#8400ff]">Questions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to know about Axion Spaces, memberships, amenities, and how we can help your business thrive.
          </motion.p>
        </div>

        {/* ACCORDION LIST */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                openIndex === index 
                  ? "bg-white/10 border-white/30 shadow-[0_0_30px_rgba(132,0,255,0.15)]" 
                  : "bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left cursor-pointer group outline-none"
              >
                <span className={`text-lg sm:text-xl font-medium transition-colors duration-300 ${openIndex === index ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                  {faq.question}
                </span>
                
                <div className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  openIndex === index 
                    ? "bg-[#ff008a] border-[#ff008a] text-white rotate-90 shadow-[0_0_15px_rgba(255,0,138,0.5)]" 
                    : "bg-transparent border-white/20 text-gray-400 group-hover:border-white/50 group-hover:text-white"
                }`}>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300" />
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 text-gray-400 leading-relaxed text-[15px] sm:text-[16px]">
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
