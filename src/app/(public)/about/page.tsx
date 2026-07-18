import type { Metadata } from "next";
import {
  getAboutHeroSection,
  getAboutPillarCards,
  getAboutStorySection,
  getAboutClientStories,
} from "@/server/repositories/about";
import { getPublicPageMetadata } from "@/server/seo";
import { AboutPageClient } from "./AboutPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPublicPageMetadata("/about");
}

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
