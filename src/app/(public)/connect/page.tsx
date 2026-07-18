import type { Metadata } from "next";
import { Suspense } from "react";
import { getContactSection } from "@/server/repositories/homepage";
import { getActiveWorkspaceList } from "@/server/repositories/workspaces";
import { getPublicPageMetadata } from "@/server/seo";
import { ConnectPageContent } from "./ConnectPageContent";

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata("/connect");
}

export default async function ConnectPage() {
  const [data, workspaces] = await Promise.all([
    getContactSection().catch(() => null),
    getActiveWorkspaceList().catch(() => []),
  ]);

  // Merge active workspace nav_labels as interest options so new workspaces
  // automatically appear in the dropdown without touching the CMS.
  let mergedData = data ?? undefined;
  if (mergedData && workspaces.length > 0) {
    const normalize = (s: string) => s.toLowerCase().replace(/-/g, "").replace(/s$/, "");
    const existingNormalized = new Set(mergedData.interest_options.map((o) => normalize(o.value)));
    const workspaceOptions = workspaces
      .filter((w) => !existingNormalized.has(normalize(w.slug)))
      .map((w) => ({ label: w.nav_label, value: w.slug }));
    mergedData = {
      ...mergedData,
      interest_options: [...mergedData.interest_options, ...workspaceOptions],
    };
  }

  return (
    <Suspense fallback={null}>
      <ConnectPageContent data={mergedData} />
    </Suspense>
  );
}
