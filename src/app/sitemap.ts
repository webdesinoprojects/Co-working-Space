import type { MetadataRoute } from "next";
import { getWorkspaceSlugsForSitemap } from "@/server/repositories/workspaces";

export const revalidate = 3600;

const BASE_URL = (
  process.env.SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified: new Date() },
  { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.8, lastModified: new Date() },
  { url: `${BASE_URL}/workspaces`, changeFrequency: "weekly", priority: 0.9, lastModified: new Date() },
  { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
  { url: `${BASE_URL}/connect`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getWorkspaceSlugsForSitemap();

  const workspaceRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/workspaces/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: new Date(),
  }));

  return [...STATIC_ROUTES, ...workspaceRoutes];
}
