import { getAdminAboutClientStories } from "@/server/repositories/admin-about";
import { ClientStoriesForm } from "./ClientStoriesForm";

export default async function ClientStoriesPage() {
  const stories = await getAdminAboutClientStories();
  return <ClientStoriesForm stories={stories} />;
}
