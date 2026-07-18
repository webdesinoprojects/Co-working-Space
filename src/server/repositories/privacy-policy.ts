import "server-only";
import { PRIVACY_POLICY_DEFAULT } from "@/lib/privacy-policy-defaults";
import { createSupabaseServerClient } from "@/server/db/client";
import type { PrivacyPolicyPageVM } from "@/features/privacy-policy/types";

export async function getPrivacyPolicyPage(): Promise<PrivacyPolicyPageVM> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("privacy_policy_pages")
    .select("headline, effective_date_label, intro_text, body_content")
    .eq("page_key", "default")
    .single();

  if (error || !data) return PRIVACY_POLICY_DEFAULT;
  return data as PrivacyPolicyPageVM;
}
