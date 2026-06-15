import { getAdminTestimonialsSection } from "@/server/repositories/admin-homepage";
import { TestimonialsForm } from "./TestimonialsForm";
import { SectionError } from "@/components/admin/SectionError";

export default async function TestimonialsPage() {
  const data = await getAdminTestimonialsSection();
  if (!data) return <SectionError label="Testimonials" />;
  return <TestimonialsForm data={data} />;
}
