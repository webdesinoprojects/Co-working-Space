import { getAdminServicesPage } from "@/server/repositories/admin-services";
import ServicesAdminClient from "./ServicesAdminClient";

export default async function ServicesAdminPage() {
  const page = await getAdminServicesPage();
  return <ServicesAdminClient page={page} />;
}
