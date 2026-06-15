import { getAdminLocationsSection } from "@/server/repositories/admin-homepage";
import { LocationsForm } from "./LocationsForm";
import { SectionError } from "@/components/admin/SectionError";

export default async function LocationsPage() {
  const data = await getAdminLocationsSection();
  if (!data) return <SectionError label="Growing Network" />;
  return <LocationsForm data={data} />;
}
