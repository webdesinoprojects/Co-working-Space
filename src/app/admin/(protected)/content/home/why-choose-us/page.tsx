import { getAdminWhyChooseUsSection } from "@/server/repositories/admin-homepage";
import { WhyChooseUsForm } from "./WhyChooseUsForm";

export default async function WhyChooseUsPage() {
  const data = await getAdminWhyChooseUsSection();

  if (!data) {
    return (
      <div className="p-8 text-sm text-neutral-500">
        Why Choose Us section is not available. Run the latest migration.
      </div>
    );
  }

  return <WhyChooseUsForm data={data} />;
}
