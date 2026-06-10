"use client";

import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { LocationsSection } from "@/components/LocationsSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { MembershipsSection } from "@/components/MembershipsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen font-sans bg-white relative">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <LocationsSection />
      <WhyChooseUsSection />
      <AmenitiesSection />
      <MembershipsSection />
      <TestimonialsSection />
    </main>
  );
}
