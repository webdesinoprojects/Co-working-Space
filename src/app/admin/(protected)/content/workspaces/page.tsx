import { getAdminWorkspaceList } from "@/server/repositories/admin-workspaces";
import { getAdminWorkspaceOverview } from "@/server/repositories/admin-workspaces";
import { requireAdmin } from "@/server/auth/guards";
import WorkspacesListPage from "./WorkspacesListPage";

export default async function AdminWorkspacesPage() {
  await requireAdmin();
  const [workspaces, overview] = await Promise.all([
    getAdminWorkspaceList(),
    getAdminWorkspaceOverview(),
  ]);
  return <WorkspacesListPage workspaces={workspaces} overview={overview} />;
}