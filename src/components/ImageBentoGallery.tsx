"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function ImageBentoGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // If we have less than 5 images, fallback to a simple grid
  if (images.length < 5) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-16 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-64 object-cover rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <section className="bg-white pt-16 sm:pt-24 pb-16 sm:pb-24">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="mb-12">
            <h2 className="font-spaceGrotesk text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-gray-900">
              Space Gallery
            </h2>
          </div>

          {/* 5-Image Bento Grid (1 Large Left, 4 Small Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-3 sm:gap-4 h-[800px] md:h-[600px]">
            
            {/* Image 1: Large (spans 6 cols, 2 rows) */}
            <motion.div 
              whileHover={{ scale: 0.98 }}
              onClick={() => setSelectedImage(images[0])}
              className="md:col-span-6 md:row-span-2 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer h-full relative group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img src={images[0]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>

            {/* Image 2: Small Top Left */}
            <motion.div 
              whileHover={{ scale: 0.96 }}
              onClick={() => setSelectedImage(images[1])}
              className="md:col-span-3 md:row-span-1 rounded-2xl overflow-hidden cursor-pointer h-full relative group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img src={images[1]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>

            {/* Image 3: Small Top Right */}
            <motion.div 
              whileHover={{ scale: 0.96 }}
              onClick={() => setSelectedImage(images[2])}
              className="md:col-span-3 md:row-span-1 rounded-2xl overflow-hidden cursor-pointer h-full relative group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img src={images[2]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>

            {/* Image 4: Small Bottom Left */}
            <motion.div 
              whileHover={{ scale: 0.96 }}
              onClick={() => setSelectedImage(images[3])}
              className="md:col-span-3 md:row-span-1 rounded-2xl overflow-hidden cursor-pointer h-full relative group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img src={images[3]} alt="Gallery 4" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
            
            {/* Image 5: Small Bottom Right */}
            <motion.div 
              whileHover={{ scale: 0.96 }}
              onClick={() => setSelectedImage(images[4])}
              className="md:col-span-3 md:row-span-1 rounded-2xl overflow-hidden cursor-pointer h-full relative group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img src={images[4]} alt="Gallery 5" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>

          </div>

        </div>
      </section>

      {/* FULL SCREEN MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-[#F26522] transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur cursor-pointer z-[101]"
            >
              <X size={28} />
            </button>

            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage} 
              alt="Expanded Gallery Image" 
              className="max-w-full max-h-full rounded-lg shadow-2xl object-contain relative z-[100]"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
