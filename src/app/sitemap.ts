import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getWorkspaceSlugsForSitemap } from "@/server/repositories/workspaces";

export const revalidate = 3600;

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: new Date() },
  { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8, lastModified: new Date() },
  { url: `${SITE_URL}/workspaces`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
  { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
  { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
  { url: `${SITE_URL}/connect`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
  { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3, lastModified: new Date() },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getWorkspaceSlugsForSitemap();

  const workspaceRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/workspaces/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: new Date(),
  }));

  return [...STATIC_ROUTES, ...workspaceRoutes];
}
