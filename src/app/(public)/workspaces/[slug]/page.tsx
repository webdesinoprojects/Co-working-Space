import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkspaceBySlug } from "@/server/repositories/workspaces";
import { buildPublicMetadata } from "@/server/seo";
import WorkspaceDetailClient from "./WorkspaceDetailClient";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function WorkspaceSlugPage({ params }: Props) {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace) notFound();
  return <WorkspaceDetailClient workspace={workspace} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const workspace = await getWorkspaceBySlug(slug);
  if (!workspace) return {};

  return buildPublicMetadata({
    routePath: `/workspaces/${workspace.slug}`,
    title: workspace.meta_title ?? workspace.hero_title,
    description: workspace.meta_description ?? workspace.hero_description,
  });
}
