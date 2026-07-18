import { getAdminPrivacyPolicyPage } from "@/server/repositories/admin-privacy-policy";
import PrivacyPolicyAdminClient from "./PrivacyPolicyAdminClient";

export default async function PrivacyPolicyAdminPage() {
  const page = await getAdminPrivacyPolicyPage();
  return <PrivacyPolicyAdminClient page={page} />;
}
