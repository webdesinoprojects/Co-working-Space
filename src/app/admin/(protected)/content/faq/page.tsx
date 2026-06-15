import { getAdminFaqSection, getAdminFaqCategories, getAdminFaqItems } from "@/server/repositories/admin-faq";
import FaqAdminClient from "./FaqAdminClient";

export default async function FaqAdminPage() {
  const [section, categories, items] = await Promise.all([
    getAdminFaqSection(),
    getAdminFaqCategories(),
    getAdminFaqItems(),
  ]);

  if (!section) {
    return (
      <div className="p-8">
        <p className="text-neutral-500 text-sm">
          FAQ section not found. Ensure migration 011_faq_cms.sql has been applied.
        </p>
      </div>
    );
  }

  return <FaqAdminClient section={section} categories={categories} items={items} />;
}
