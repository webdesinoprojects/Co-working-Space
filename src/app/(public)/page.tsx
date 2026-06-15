import Navbar from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { LocationsSection } from "@/components/LocationsSection";
import { MembershipsSection } from "@/components/MembershipsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { AmenitiesSection } from "@/components/AmenitiesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import {
  getHeroSection,
  getIntroSection,
  getLocationsSection,
  getMembershipSection,
  getOfferingsSection,
  getWhyChooseUsSection,
  getAmenitiesSection,
  getTestimonialsSection,
} from "@/server/repositories/homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    heroData,
    introData,
    locationsData,
    membershipData,
    offeringsData,
    whyChooseUsData,
    amenitiesData,
    testimonialsData,
  ] = await Promise.all([
    getHeroSection().catch(() => null),
    getIntroSection().catch(() => null),
    getLocationsSection().catch(() => null),
    getMembershipSection().catch(() => null),
    getOfferingsSection().catch(() => null),
    getWhyChooseUsSection().catch(() => null),
    getAmenitiesSection().catch(() => null),
    getTestimonialsSection().catch(() => null),
  ]);

  return (
    <main className="min-h-screen font-sans bg-white relative">
      <Navbar />
      <HeroSection data={heroData ?? undefined} />
      <AboutSection data={introData ?? undefined} />
      <LocationsSection data={locationsData ?? undefined} />
      <MembershipsSection data={membershipData ?? undefined} />
      <ServicesSection
        title={offeringsData?.title}
        dynamicOfferings={offeringsData?.offerings}
        enquireBaseHref="#contact"
      />
      <WhyChooseUsSection data={whyChooseUsData ?? undefined} />
      <AmenitiesSection
        dynamicAmenities={amenitiesData?.amenities}
        dynamicBadge={amenitiesData?.badge_text}
        dynamicTitle={amenitiesData?.title}
      />
      <TestimonialsSection data={testimonialsData ?? undefined} />
    </main>
  );
}
