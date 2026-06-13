"use client";

import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { ImageBentoGallery } from "@/components/ImageBentoGallery";
import { Building, Briefcase, Phone, Monitor, ShieldCheck, Mail } from "lucide-react";

// Mock Database for Gallery
const galleryImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
];

export default function VirtualOfficePage() {
  return (
    <WorkspaceLayout
      title={<>A premium address <br /> for your business.</>}
      description="Establish a professional presence instantly. Get a prime commercial business address, dedicated mail handling, and professional call answering services without the overhead of a physical space."
      stats={[
        { value: "50+", label: "Prime Addresses" },
        { value: "Daily", label: "Mail handling" },
        { value: "GST", label: "Registration ready" },
        { value: "100%", label: "Professional image" },
      ]}
      images={[
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"
      ]}
    >
      <InfiniteMarquee 
        items={["Premium Address", "Mail Handling", "Dedicated Phone No.", "Call Forwarding", "Meeting Room Credits", "GST Registration"]} 
        theme="light" 
      />
      
      <ImageBentoGallery images={galleryImages} />

      <AmenitiesSection 
        amenitiesList={[
          { icon: Building, text: "Premium Address" },
          { icon: Briefcase, text: "Mail Handling" },
          { icon: Phone, text: "Dedicated Phone No." },
          { icon: Phone, text: "Call Forwarding" },
          { icon: Monitor, text: "Meeting Room Credits" },
          { icon: ShieldCheck, text: "GST Registration" },
        ]}
      />

      <InfiniteMarquee 
        items={["Zero Overhead", "Professional Image", "Instant Setup", "Prime Locations", "Business Support"]} 
        theme="dark" 
        reverse={true} 
      />

      <ServicesSection 
        title="Virtual Office Plans"
        offeringsList={[
          {
            title: "Business Address",
            icon: Building,
            price: "Rs 15,000 / year",
            features: [
              { name: "Premium Office Address", included: true },
              { name: "Mail & Package Handling", included: true },
              { name: "GST Registration Support", included: false },
              { name: "Meeting Room Access", included: false }
            ]
          },
          {
            title: "GST Registration",
            icon: ShieldCheck,
            price: "Rs 25,000 / year",
            features: [
              { name: "Premium Office Address", included: true },
              { name: "Mail & Package Handling", included: true },
              { name: "GST Registration Support", included: true },
              { name: "Meeting Room Credits", included: false }
            ]
          },
          {
            title: "Premium Virtual Office",
            icon: Briefcase,
            price: "Rs 45,000 / year",
            features: [
              { name: "Premium Office Address", included: true },
              { name: "Mail & Package Handling", included: true },
              { name: "GST Registration Support", included: true },
              { name: "Monthly Meeting Credits", included: true }
            ]
          }
        ]}
      />
    </WorkspaceLayout>
  );
}
