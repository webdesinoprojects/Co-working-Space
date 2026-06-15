"use client";

import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { ImageBentoGallery } from "@/components/ImageBentoGallery";
import { ShieldCheck, DoorOpen, Users, Briefcase, Building, Zap } from "lucide-react";

// Mock Database for Gallery
const galleryImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80"
];

export default function PrivateCabinsPage() {
  return (
    <WorkspaceLayout
      title={<>Private suites for <br /> focused teams.</>}
      description="Fully furnished, secure offices designed for teams of 2 to 50. Skip the hassle of traditional leasing and move into a managed space with soundproof walls, enterprise-grade IT, and custom branding options."
      stats={[
        { value: "160+", label: "Private Cabins" },
        { value: "0", label: "Setup costs" },
        { value: "100%", label: "Secure & private" },
        { value: "Custom", label: "Layout options" },
      ]}
      images={[
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
      ]}
    >
      <InfiniteMarquee 
        items={["Soundproof Walls", "Biometric Access", "24/7 Security", "Custom Branding", "Dedicated IT", "Private Pantry"]} 
        theme="light" 
      />
      
      <ImageBentoGallery images={galleryImages} />

      <AmenitiesSection 
        amenitiesList={[
          { icon: DoorOpen, text: "Soundproof Walls" },
          { icon: Building, text: "Custom Branding" },
          { icon: Zap, text: "Dedicated LAN" },
          { icon: ShieldCheck, text: "Biometric Access" },
          { icon: ShieldCheck, text: "24/7 Security" },
          { icon: Users, text: "Community Manager" },
        ]}
      />

      <InfiniteMarquee 
        items={["Built for Teams", "Enterprise Grade", "Scalable Growth", "Fully Managed", "Zero Setup Cost"]} 
        theme="dark" 
        reverse={true} 
      />

      <ServicesSection 
        title="Private Cabin Plans"
        offeringsList={[
          {
            title: "4-6 Seater Cabin",
            icon: Briefcase,
            price: "Rs 25,000 / month",
            features: [
              { name: "Fully Furnished", included: true },
              { name: "Dedicated IT Support", included: true },
              { name: "Meeting Room Credits", included: true },
              { name: "Custom Branding", included: false }
            ]
          },
          {
            title: "10-20 Seater Suite",
            icon: Users,
            price: "Custom Pricing",
            features: [
              { name: "Fully Furnished", included: true },
              { name: "Dedicated IT Support", included: true },
              { name: "Meeting Room Credits", included: true },
              { name: "Custom Branding", included: true }
            ]
          },
          {
            title: "Custom Floor Plan",
            icon: Building,
            price: "Quote on Request",
            features: [
              { name: "Build to Suit", included: true },
              { name: "Private Network", included: true },
              { name: "Dedicated Manager", included: true },
              { name: "Private Pantry", included: true }
            ]
          }
        ]}
      />
    </WorkspaceLayout>
  );
}
