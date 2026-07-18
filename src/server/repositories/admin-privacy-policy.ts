import "server-only";
import { PRIVACY_POLICY_DEFAULT } from "@/lib/privacy-policy-defaults";
import { createSupabaseServerClient } from "@/server/db/client";
import type { AdminPrivacyPolicyPageVM } from "@/features/admin/types";

export async function getAdminPrivacyPolicyPage(): Promise<AdminPrivacyPolicyPageVM> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("privacy_policy_pages")
    .select("page_key, headline, effective_date_label, intro_text, body_content")
    .eq("page_key", "default")
    .single();

  if (error || !data) {
    return {
      page_key: "default",
      ...PRIVACY_POLICY_DEFAULT,
    };
  }

  return data as AdminPrivacyPolicyPageVM;
}
