import { getAdminAboutHeroSection } from "@/server/repositories/admin-about";
import { SectionError } from "@/components/admin/SectionError";
import { HeroForm } from "./HeroForm";

export default async function HeroPage() {
  const data = await getAdminAboutHeroSection();
  if (!data) return <SectionError label="About - Hero" />;
  return <HeroForm data={data} />;
}
