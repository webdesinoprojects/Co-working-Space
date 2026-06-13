"use client";

import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { ImageBentoGallery } from "@/components/ImageBentoGallery";
import { Wifi, Coffee, Printer, Armchair, Zap, User, Laptop, Monitor } from "lucide-react";

// Mock Database for Gallery
const galleryImages = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
];

export default function DedicatedDesksPage() {
  return (
    <WorkspaceLayout
      title={<>Your personal desk <br /> in a shared space.</>}
      description="Enjoy the perfect balance of community and focus. A dedicated desk gives you a reserved workspace with lockable storage, ergonomic seating, and access to all premium amenities. Ideal for freelancers and remote workers."
      stats={[
        { value: "24/7", label: "Access" },
        { value: "500+", label: "Desks available" },
        { value: "1GB", label: "Fiber Internet" },
        { value: "Free", label: "Meeting Credits" },
      ]}
      images={[
        "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
      ]}
    >
      <InfiniteMarquee 
        items={["High Speed WiFi", "Ergonomic Chairs", "24/7 Access", "Premium Coffee", "Printing Services", "Community Events"]} 
        theme="light" 
      />
      
      <ImageBentoGallery images={galleryImages} />

      <AmenitiesSection 
        amenitiesList={[
          { icon: Wifi, text: "High Speed Internet" },
          { icon: Armchair, text: "Lockable Storage" },
          { icon: Armchair, text: "Ergonomic Chair" },
          { icon: Coffee, text: "Free Coffee & Tea" },
          { icon: Printer, text: "Printer/Scanner" },
          { icon: Zap, text: "Power Backup" },
        ]}
      />

      <InfiniteMarquee 
        items={["Trusted by Startups", "Ideal for Freelancers", "Remote Workers", "Digital Nomads", "Creative Agencies"]} 
        theme="dark" 
        reverse={true} 
      />

      <ServicesSection 
        title="Open Seating Plans"
        offeringsList={[
          {
            title: "Day Pass",
            icon: User,
            price: "Rs 500 / day",
            features: [
              { name: "High Speed Internet", included: true },
              { name: "Open Seating", included: true },
              { name: "Free Coffee", included: true },
              { name: "Meeting Room Credits", included: false }
            ]
          },
          {
            title: "Hot Desk",
            icon: Laptop,
            price: "Rs 5,000 / month",
            features: [
              { name: "High Speed Internet", included: true },
              { name: "Flexible Seating", included: true },
              { name: "Printer Access", included: true },
              { name: "Meeting Room Credits", included: false }
            ]
          },
          {
            title: "Dedicated Desk",
            icon: Monitor,
            price: "Rs 6,500 / month",
            features: [
              { name: "High Speed Internet", included: true },
              { name: "Reserved Desk & Locker", included: true },
              { name: "Printer Access", included: true },
              { name: "Meeting Room Credits", included: true }
            ]
          }
        ]}
      />
    </WorkspaceLayout>
  );
}
