import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";

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
      <AmenitiesSection />
      <ServicesSection />
    </WorkspaceLayout>
  );
}
