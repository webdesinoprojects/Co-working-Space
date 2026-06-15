import { getAdminAboutPillarsSection } from "@/server/repositories/admin-about";
import { SectionError } from "@/components/admin/SectionError";
import { ValuesForm } from "./ValuesForm";

export default async function ValuesPage() {
  const data = await getAdminAboutPillarsSection();
  if (!data) return <SectionError label="About - Values" />;
  return <ValuesForm data={data} />;
}
