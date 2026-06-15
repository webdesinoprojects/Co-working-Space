import { getAdminHeroSection } from "@/server/repositories/admin-homepage";
import { HeroForm } from "./HeroForm";
import { SectionError } from "@/components/admin/SectionError";

export default async function HeroPage() {
  const data = await getAdminHeroSection();
  if (!data) return <SectionError label="Hero" />;
  return <HeroForm data={data} />;
}
