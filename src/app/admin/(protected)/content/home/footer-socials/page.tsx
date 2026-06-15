import { getAdminFooterLinks, getAdminFooterSocialLinks } from "@/server/repositories/admin-homepage";
import { FooterSocialsForm } from "./FooterSocialsForm";

export default async function FooterSocialsPage() {
  const [footerLinks, socialLinks] = await Promise.all([
    getAdminFooterLinks(),
    getAdminFooterSocialLinks(),
  ]);

  return <FooterSocialsForm footerLinks={footerLinks} socialLinks={socialLinks} />;
}
