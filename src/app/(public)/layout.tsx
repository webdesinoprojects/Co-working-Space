import type { ReactNode } from "react";
import { ContactSection } from "@/components/ContactSection";
import { FooterSection } from "@/components/FooterSection";
import {
  getContactSection,
  getFooterLinks,
  getFooterSocialLinks,
} from "@/server/repositories/homepage";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [contactData, footerLinks, footerSocials] = await Promise.all([
    getContactSection().catch(() => null),
    getFooterLinks().catch(() => []),
    getFooterSocialLinks().catch(() => []),
  ]);

  return (
    <>
      {children}
      <ContactSection data={contactData ?? undefined} />
      <FooterSection links={footerLinks} socialLinks={footerSocials} />
    </>
  );
}
