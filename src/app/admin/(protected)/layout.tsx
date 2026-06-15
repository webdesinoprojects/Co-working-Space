import { requireAdmin } from "@/server/auth/guards";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";

// Security boundary — requireAdmin() redirects to /admin/login if unauthenticated.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
