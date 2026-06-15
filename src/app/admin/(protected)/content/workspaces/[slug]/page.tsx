import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth/guards";
import { getAdminWorkspaceBySlug } from "@/server/repositories/admin-workspaces";
import { WorkspaceForm } from "./WorkspaceForm";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminWorkspaceSlugPage({ params }: Props) {
  await requireAdmin();
  const { slug } = await params;
  const workspace = await getAdminWorkspaceBySlug(slug);
  if (!workspace) redirect("/admin/content/workspaces");
  return <WorkspaceForm data={workspace} />;
}