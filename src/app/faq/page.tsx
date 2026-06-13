"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"] });

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to a -1 to 1 scale
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen font-sans bg-[#faf8f5] relative overflow-hidden selection:bg-[#F26522]/30">
      <Navbar />

      {/* INTERACTIVE 3D RINGS BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none flex justify-center items-center overflow-hidden z-0 opacity-50">
        <style dangerouslySetInnerHTML={{__html: `
          .tunnel-item {
            position: absolute;
            background-color: transparent;
            width: calc(var(--i) * 6vmin);
            aspect-ratio: 1;
            border-radius: 50%;
            border: 4px solid rgba(135, 206, 235, 0.7);
            transform-style: preserve-3d;
            transform: rotateX(70deg) translateZ(50px);
            animation: tunnel-move 10s ease-in-out calc(var(--i) * 0.25s) infinite;
            box-shadow: 0px 0px 15px rgba(255, 182, 193, 0.6), inset 0px 0px 15px rgba(255, 182, 193, 0.6);
          }
          @keyframes tunnel-move {
            0%, 100% {
              transform: rotateX(70deg) translateZ(50px) translateY(0px);
              filter: hue-rotate(0deg);
            }
            50% {
              /* Dip much deeper to hit the bottom of the screen */
              transform: rotateX(70deg) translateZ(50px) translateY(-120vmin);
              filter: hue-rotate(90deg);
            }
          }
        `}} />
        <motion.div
          animate={{
            rotateX: mousePos.y * -30, // Mouse tilt depth
            rotateY: mousePos.x * 30,  // Mouse tilt horizontal
          }}
          transition={{ type: "spring", stiffness: 50, damping: 25 }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          className="relative flex justify-center items-center w-full h-full"
        >
          {/* Expanded to 40 items and 6vmin width to be massively huge */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="tunnel-item mix-blend-multiply"
              style={{ "--i": i } as React.CSSProperties}
            ></div>
          ))}
        </motion.div>
      </div>

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
            <span className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Got Questions?</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.1] text-gray-900 tracking-tight"
          >
            Frequently Asked <span className="text-[#F26522]">Questions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
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
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === index 
                  ? "bg-white border-[#F26522]/30 shadow-md" 
                  : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left cursor-pointer group outline-none"
              >
                <span className={`text-[24px] sm:text-[30px] font-bold transition-colors duration-300 ${caveat.className} ${openIndex === index ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900"}`}>
                  {faq.question}
                </span>
                
                <div className={`flex-shrink-0 ml-4 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  openIndex === index 
                    ? "bg-[#F26522] border-[#F26522] text-white rotate-90 shadow-lg shadow-[#F26522]/30" 
                    : "bg-gray-50 border-gray-200 text-gray-500 group-hover:border-gray-300 group-hover:text-gray-900"
                }`}>
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
                    {/* NOTEBOOK STYLE ANSWER */}
                    <div 
                      className={`text-blue-700 font-medium ${caveat.className} text-[22px] sm:text-[28px]`}
                      style={{
                        background: `linear-gradient(transparent 92%, #a6d8fa 92%), linear-gradient(to right, transparent 50px, #f47b7b 50px, #f47b7b 52px, transparent 52px)`,
                        backgroundSize: `100% 36px, 100% 100%`,
                        lineHeight: `36px`,
                        backgroundColor: `#fffdf8`,
                        paddingBottom: `36px`,
                        paddingTop: `2px`
                      }}
                    >
                      <div className="pl-[70px] pr-8 sm:pr-12">
                        {faq.answer}
                      </div>
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
