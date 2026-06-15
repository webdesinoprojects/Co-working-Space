import {
  getAboutHeroSection,
  getAboutPillarCards,
  getAboutStorySection,
  getAboutClientStories,
} from "@/server/repositories/about";
import { AboutPageClient } from "./AboutPageClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [hero, pillars, story, clientStories] = await Promise.all([
    getAboutHeroSection(),
    getAboutPillarCards(),
    getAboutStorySection(),
    getAboutClientStories(),
  ]);

  return (
    <AboutPageClient
      hero={hero}
      pillars={pillars}
      story={story}
      clientStories={clientStories}
    />
  );
}
