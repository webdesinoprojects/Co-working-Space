"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/server/db/client";

export type LoginState = {
  error: string | null;
};

export async function loginAdminAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id, is_active")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile?.is_active) {
    await supabase.auth.signOut();
    return { error: "This account is not enabled for admin access." };
  }

  // Server-side redirect keeps the Set-Cookie headers from signInWithPassword
  // in the same response. This avoids the race condition caused by
  // router.push() + router.refresh() firing two concurrent requests.
  redirect("/admin");
}
