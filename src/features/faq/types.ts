export type FaqSectionVM = {
  badge_text: string;
  title: string;
  highlighted_word: string;
  body_text: string;
};

export type FaqCategoryVM = {
  id: string;
  label: string;
  slug: string;
};

export type FaqItemVM = {
  id: string;
  category_id: string | null;
  question: string;
  answer: string;
  sort_order: number;
};
