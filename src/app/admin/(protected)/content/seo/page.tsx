import { getAdminPageSeoItems } from "@/server/repositories/admin-page-seo";
import SeoAdminClient from "./SeoAdminClient";

export default async function SeoAdminPage() {
  const items = await getAdminPageSeoItems();
  return <SeoAdminClient items={items} />;
}
