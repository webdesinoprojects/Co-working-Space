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

  return (
    <WorkspaceNavProvider items={workspaceNavItems}>
      {children}
      <ContactSection data={contactData ?? undefined} />
      <FooterSection links={footerLinks} socialLinks={footerSocials} />
    </WorkspaceNavProvider>
  );
}
