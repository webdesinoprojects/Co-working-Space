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
    ? {
        ...contactData,
        interest_options: [
          ...contactData.interest_options,
          ...workspaces
            .filter((workspace) =>
              contactData.interest_options.every((option) => option.value !== workspace.slug)
            )
            .map((workspace) => ({
              label: workspace.nav_label,
              value: workspace.slug,
            })),
        ],
      }
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
