import { Suspense } from "react";
import { getContactSection } from "@/server/repositories/homepage";
import { getActiveWorkspaceList } from "@/server/repositories/workspaces";
import { ConnectPageContent } from "./ConnectPageContent";

export default async function ConnectPage() {
  const [data, workspaces] = await Promise.all([
    getContactSection().catch(() => null),
    getActiveWorkspaceList().catch(() => []),
  ]);

  // Merge active workspace nav_labels as interest options so new workspaces
  // automatically appear in the dropdown without touching the CMS.
  let mergedData = data ?? undefined;
  if (mergedData && workspaces.length > 0) {
    const existingValues = new Set(mergedData.interest_options.map((o) => o.value));
    const workspaceOptions = workspaces
      .filter((w) => !existingValues.has(w.slug))
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
