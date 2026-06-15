// Public About page VM types.
// Only what the public /about page renders; no admin-only fields or internal IDs beyond rendering needs.

export type AboutHeroImageVM = {
  slot: number;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export type AboutHeroSectionVM = {
  headline: string;
  subtext: string;
  images: AboutHeroImageVM[];
};

export type AboutPillarCardVM = {
  id: string;
  icon_key: string;
  label: string;
  stat: string;
  description: string;
  sort_order: number;
};

export type AboutStoryImageVM = {
  slot: number;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export type AboutStorySectionVM = {
  subheading: string;
  heading: string;
  body_1: string;
  body_2: string;
  body_3: string;
  belief_1_title: string;
  belief_1_text: string;
  belief_2_title: string;
  belief_2_text: string;
  images: AboutStoryImageVM[];
};

export type AboutClientStoryVM = {
  id: string;
  tag: string;
  author: string;
  title: string;
  description: string;
  icon_key: string;
  sort_order: number;
};
