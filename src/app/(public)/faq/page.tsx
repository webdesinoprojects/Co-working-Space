import { getFaqSection, getFaqItems } from "@/server/repositories/faq";
import FaqPageClient from "./FaqPageClient";

export default async function FAQPage() {
  const [section, items] = await Promise.all([getFaqSection(), getFaqItems()]);
  return <FaqPageClient section={section} items={items} />;
}
