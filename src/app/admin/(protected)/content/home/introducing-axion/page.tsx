import { getAdminIntroSection } from "@/server/repositories/admin-homepage";
import { IntroForm } from "./IntroForm";
import { SectionError } from "@/components/admin/SectionError";

export default async function IntroPage() {
  const data = await getAdminIntroSection();
  if (!data) return <SectionError label="Introducing Axion" />;
  return <IntroForm data={data} />;
}
