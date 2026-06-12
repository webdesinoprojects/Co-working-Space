import WorkspaceLayout from "@/components/WorkspaceLayout";
import { ServicesSection } from "@/components/ServicesSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";

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
      <AmenitiesSection />
      <ServicesSection />
    </WorkspaceLayout>
  );
}
