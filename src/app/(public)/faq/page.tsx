import type { Metadata } from "next";
import { getFaqSection, getFaqItems } from "@/server/repositories/faq";
import { getPublicPageMetadata } from "@/server/seo";
import FaqPageClient from "./FaqPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata("/faq");
}

export default async function FAQPage() {
  const [section, items] = await Promise.all([getFaqSection(), getFaqItems()]);
  return <FaqPageClient section={section} items={items} />;
}
