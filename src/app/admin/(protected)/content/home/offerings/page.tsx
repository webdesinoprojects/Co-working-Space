import { getAdminOfferingsSection } from "@/server/repositories/admin-homepage";
import { OfferingsForm } from "./OfferingsForm";
import { SectionError } from "@/components/admin/SectionError";

export default async function OfferingsPage() {
  const data = await getAdminOfferingsSection();
  if (!data) return <SectionError label="Offerings" />;
  return <OfferingsForm data={data} />;
}
