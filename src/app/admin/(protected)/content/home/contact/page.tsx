import { getAdminContactSection } from "@/server/repositories/admin-homepage";
import { ContactForm } from "./ContactForm";

export default async function ContactPage() {
  const data = await getAdminContactSection();

  if (!data) {
    return (
      <div className="p-8 text-sm text-neutral-500">
        Contact section is not available. Run the latest migration.
      </div>
    );
  }

  return <ContactForm data={data} />;
}
