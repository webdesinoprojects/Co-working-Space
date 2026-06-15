import { getAdminAboutStorySection } from "@/server/repositories/admin-about";
import { SectionError } from "@/components/admin/SectionError";
import { StoryForm } from "./StoryForm";

export default async function StoryPage() {
  const data = await getAdminAboutStorySection();
  if (!data) return <SectionError label="About - Story" />;
  return <StoryForm data={data} />;
}
