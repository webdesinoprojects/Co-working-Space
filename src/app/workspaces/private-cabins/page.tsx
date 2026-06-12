import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";

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
      <AmenitiesSection />
      <ServicesSection />
    </WorkspaceLayout>
  );
}
