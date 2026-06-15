import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/server/db/client";

export type AdminRole = "owner" | "admin" | "editor";

export type AdminProfile = {
  id: string;
  email: string;
  display_name: string | null;
  role: AdminRole;
  is_active: boolean;
};

// Cached per-request so multiple server components don't each hit the DB
export const getAuthUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});

export const getAdminProfile = cache(async (): Promise<AdminProfile | null> => {
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("id, email, display_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (error || !data || !data.is_active) return null;
  return data as AdminProfile;
});
