import { getAdminMembershipSection } from "@/server/repositories/admin-homepage";
import { MembershipsForm } from "./MembershipsForm";
import { SectionError } from "@/components/admin/SectionError";

export default async function MembershipsPage() {
  const data = await getAdminMembershipSection();
  if (!data) return <SectionError label="Memberships" />;
  return <MembershipsForm data={data} />;
}
