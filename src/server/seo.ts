import "server-only";
import type { Metadata } from "next";
import { PAGE_SEO_DEFAULTS, type PublicPageRoute } from "@/lib/seo-defaults";
import { SITE_NAME } from "@/lib/site";
import { getPageSeo } from "@/server/repositories/page-seo";

type BuildMetadataInput = {
  routePath: string;
  title: string;
  description: string;
};

export function buildPublicMetadata({
  routePath,
  title,
  description,
}: BuildMetadataInput): Metadata {
  const metadataTitle: Metadata["title"] = title.includes(SITE_NAME)
    ? { absolute: title }
    : title;

  return {
    title: metadataTitle,
    description,
    alternates: {
      canonical: routePath,
      languages: {
        "en-IN": routePath,
        "x-default": routePath,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title,
      description,
      url: routePath,
      images: [
        {
          url: "/alley_logo.png",
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/alley_logo.png"],
    },
  };
}

export async function getPublicPageMetadata(routePath: PublicPageRoute): Promise<Metadata> {
  const fallback = PAGE_SEO_DEFAULTS[routePath];
  const seo = await getPageSeo(routePath).catch(() => null);
  const title = seo?.meta_title?.trim() || fallback.title;
  const description = seo?.meta_description?.trim() || fallback.description;

  return buildPublicMetadata({ routePath, title, description });
}
