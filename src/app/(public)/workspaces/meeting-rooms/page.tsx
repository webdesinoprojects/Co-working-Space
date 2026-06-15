"use client";

import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";
import { ImageBentoGallery } from "@/components/ImageBentoGallery";
import { Monitor, Video, Wifi, Coffee, Presentation, Users } from "lucide-react";

// Mock Database for Gallery
const galleryImages = [
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
];

export default function MeetingRoomsPage() {
  return (
    <WorkspaceLayout
      title={<>Pitch, present, and <br /> collaborate clearly.</>}
      description="Book professional meeting spaces by the hour. Equipped with massive 4K displays, crystal-clear video conferencing setups, and endless coffee to keep your team and clients energized."
      stats={[
        { value: "600+", label: "Meeting rooms" },
        { value: "4K", label: "Presentations" },
        { value: "Zero", label: "Buffering" },
        { value: "24h", label: "Support team" },
      ]}
      images={[
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
      ]}
    >
      <InfiniteMarquee 
        items={["4K Smart TVs", "Video Conferencing", "High-Speed WiFi", "Catering on Demand", "Whiteboards", "Reception Service"]} 
        theme="light" 
      />
      
      <ImageBentoGallery images={galleryImages} />

      <AmenitiesSection 
        amenitiesList={[
          { icon: Monitor, text: "4K Smart TV" },
          { icon: Video, text: "Video Conferencing" },
          { icon: Wifi, text: "High-Speed WiFi" },
          { icon: Coffee, text: "Catering on Demand" },
          { icon: Presentation, text: "Whiteboard" },
          { icon: Users, text: "Reception Service" },
        ]}
      />

      <InfiniteMarquee 
        items={["Pitch Perfectly", "Seamless Video Calls", "Hourly Booking", "Impress Clients", "Endless Coffee"]} 
        theme="dark" 
        reverse={true} 
      />

      <ServicesSection 
        title="Meeting Space Plans"
        offeringsList={[
          {
            title: "4-Seater Room",
            icon: Users,
            price: "Rs 500 / hour",
            features: [
              { name: "4K Display", included: true },
              { name: "High Speed Internet", included: true },
              { name: "Whiteboard", included: true },
              { name: "Video Conferencing", included: false }
            ]
          },
          {
            title: "10-Seater Boardroom",
            icon: Presentation,
            price: "Rs 1,200 / hour",
            features: [
              { name: "85\" 4K Display", included: true },
              { name: "High Speed Internet", included: true },
              { name: "Video Conferencing", included: true },
              { name: "Premium Coffee", included: true }
            ]
          },
          {
            title: "Full-Day Workshop",
            icon: Monitor,
            price: "Quote on Request",
            features: [
              { name: "Exclusive Room Access", included: true },
              { name: "Custom Layouts", included: true },
              { name: "Dedicated Tech Support", included: true },
              { name: "Full Catering Service", included: true }
            ]
          }
        ]}
      />
    </WorkspaceLayout>
  );
}
