import { getAdminAmenitiesSection } from "@/server/repositories/admin-homepage";
import { AmenitiesForm } from "./AmenitiesForm";
import { SectionError } from "@/components/admin/SectionError";

export default async function AmenitiesPage() {
  const data = await getAdminAmenitiesSection();
  if (!data) return <SectionError label="Amenities" />;
  return <AmenitiesForm data={data} />;
}
