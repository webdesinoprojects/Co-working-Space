import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/server/repositories/workspaces";
import WorkspaceDetailClient from "./WorkspaceDetailClient";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function WorkspaceSlugPage({ params }: Props) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace) notFound();
  return <WorkspaceDetailClient workspace={workspace} />;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace) return {};
  return {
    title: workspace.meta_title ?? workspace.hero_title,
    description: workspace.meta_description ?? workspace.hero_description,
  };
}
