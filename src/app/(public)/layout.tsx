import type { ReactNode } from "react";
import { ContactSection } from "@/components/ContactSection";
import { FooterSection } from "@/components/FooterSection";
import { WorkspaceNavProvider } from "@/components/WorkspaceNavContext";
import {
  getContactSection,
  getFooterLinks,
  getFooterSocialLinks,
} from "@/server/repositories/homepage";
import { getActiveWorkspaceList } from "@/server/repositories/workspaces";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [contactData, footerLinks, footerSocials, workspaces] = await Promise.all([
    getContactSection().catch(() => null),
    getFooterLinks().catch(() => []),
    getFooterSocialLinks().catch(() => []),
    getActiveWorkspaceList().catch(() => []),
  ]);
  const workspaceNavItems = workspaces.map(({ slug, nav_label }) => ({
    slug,
    nav_label,
  }));
  const mergedContactData = contactData
    ? (() => {
        // Normalize slug for dedup: lowercase, strip trailing 's', collapse hyphens
        const normalize = (s: string) => s.toLowerCase().replace(/-/g, "").replace(/s$/, "");
        const existingNormalized = new Set(
          contactData.interest_options.map((o) => normalize(o.value))
        );
        const newOptions = workspaces
          .filter((workspace) => !existingNormalized.has(normalize(workspace.slug)))
          .map((workspace) => ({
            label: workspace.nav_label,
            value: workspace.slug,
          }));
        return {
          ...contactData,
          interest_options: [...contactData.interest_options, ...newOptions],
        };
      })()
    : undefined;

  return (
    <WorkspaceNavProvider items={workspaceNavItems}>
      {children}
      <div id="contact">
        <ContactSection data={mergedContactData} />
      </div>
      <FooterSection links={footerLinks} socialLinks={footerSocials} />
    </WorkspaceNavProvider>
  );
}
