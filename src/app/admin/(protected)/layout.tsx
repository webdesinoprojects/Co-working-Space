import { requireAdmin } from "@/server/auth/guards";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { getAdminWorkspaceList } from "@/server/repositories/admin-workspaces";

// Security boundary: requireAdmin() redirects to /admin/login if unauthenticated.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const workspaces = await getAdminWorkspaceList().catch(() => []);
  const workspaceItems = workspaces.map(({ slug, nav_label }) => ({
    slug,
    nav_label,
  }));

  return (
    <AdminLayoutShell workspaceItems={workspaceItems}>
      {children}
    </AdminLayoutShell>
  );
}
