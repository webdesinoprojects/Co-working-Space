import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";

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
      <AmenitiesSection />
      <ServicesSection />
    </WorkspaceLayout>
  );
}
