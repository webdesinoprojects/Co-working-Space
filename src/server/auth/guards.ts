import "server-only";
import { redirect } from "next/navigation";
import { getAdminProfile, AdminProfile } from "@/server/auth/session";

// Use in protected layouts and Server Actions to enforce admin access.
// Redirects to login instead of returning null so callers never handle unauthenticated state.
export async function requireAdmin(): Promise<AdminProfile> {
  const profile = await getAdminProfile();
  if (!profile) {
    redirect("/admin/login");
  }
  return profile;
}

// Use for operations only owners should perform (profile management, etc.)
export async function requireOwner(): Promise<AdminProfile> {
  const profile = await requireAdmin();
  if (profile.role !== "owner") {
    redirect("/admin");
  }
  return profile;
}
