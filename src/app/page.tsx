"use client";

import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { LocationsSection } from "@/components/LocationsSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { MembershipsSection } from "@/components/MembershipsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FooterSection } from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="min-h-screen font-sans bg-white relative">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <LocationsSection />
      <AmenitiesSection />
      <MembershipsSection />
      <TestimonialsSection />
      <FooterSection />
    </main>
  );
}
