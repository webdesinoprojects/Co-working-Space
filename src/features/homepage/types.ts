// Public view model types - safe to import in both server and client code.
// These contain ONLY what the public homepage renders. No internal IDs,
// no admin notes, no unpublished state, no DB metadata.

export type PublicImageVM = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

// -- Hero ----------------------------------------------------------------------
export type HeroSectionVM = {
  badge_text: string;
  headline: string;
  cta_label: string;
  cta_href: string;
  promo_title: string;
  promo_badge_text: string;
  left_image: PublicImageVM | null;
  top_right_image: PublicImageVM | null;
  bottom_right_image: PublicImageVM | null;
};

// -- Introducing Alley ---------------------------------------------------------
export type IntroSectionVM = {
  badge_text: string;
  title: string;
  body_text: string;
  cta_label: string;
  cta_href: string;
  left_image: PublicImageVM | null;
  right_image: PublicImageVM | null;
};

// -- Growing Network -----------------------------------------------------------
export type LocationCardVM = {
  id: string;
  location_name: string;
  subtitle: string | null;
  image: PublicImageVM | null;
  hover_visit_label: string;
  hover_visit_href: string;
  hover_meeting_label: string;
  hover_meeting_href: string;
  hover_space_label: string;
  hover_space_href: string;
  sort_order: number;
};

export type LocationsSectionVM = {
  badge_text: string;
  title: string;
  view_all_label: string;
  view_all_href: string;
  cards: LocationCardVM[];
};

// -- Memberships ---------------------------------------------------------------
export type MembershipPlanFeatureVM = {
  id: string;
  feature_text: string;
  sort_order: number;
};

export type MembershipPlanVM = {
  id: string;
  title: string;
  description: string | null;
  price_text: string;
  cta_label: string;
  highlight_badge_text: string | null;
  is_featured: boolean;
  sort_order: number;
  features: MembershipPlanFeatureVM[];
};

export type MembershipSectionVM = {
  badge_text: string;
  title: string;
  is_enabled: boolean;
  plans: MembershipPlanVM[];
};

// -- Offerings -----------------------------------------------------------------
export type OfferingFeatureVM = {
  id: string;
  feature_text: string;
  is_included: boolean;
  sort_order: number;
};

export type OfferingVM = {
  id: string;
  title: string;
  icon_key: string;
  price_text: string | null;
  sort_order: number;
  features: OfferingFeatureVM[];
};

export type OfferingsSectionVM = {
  badge_text: string;
  title: string;
  offerings: OfferingVM[];
};

// -- Why Choose Us -------------------------------------------------------------
export type WhyChooseUsCardVM = {
  id: string;
  title: string;
  description: string;
  animation_key: string;
  theme: "light" | "dark";
  sort_order: number;
};

export type WhyChooseUsSectionVM = {
  badge_text: string;
  title: string;
  body_text: string;
  cards: WhyChooseUsCardVM[];
};

// -- Amenities -----------------------------------------------------------------
export type AmenityVM = {
  id: string;
  icon_key: string;
  label: string;
  sort_order: number;
};

export type AmenitiesSectionVM = {
  badge_text: string;
  title: string;
  amenities: AmenityVM[];
};

// -- Testimonials --------------------------------------------------------------
export type TestimonialVM = {
  id: string;
  quote: string;
  person_name: string;
  person_role: string | null;
  company_name: string | null;
  avatar: PublicImageVM | null;
  sort_order: number;
};

export type TestimonialsSectionVM = {
  badge_text: string;
  title: string;
  layout_mode: string;
  testimonials: TestimonialVM[];
};

// -- Contact -------------------------------------------------------------------
export type ContactInterestOptionVM = {
  label: string;
  value: string;
};

export type ContactSectionVM = {
  badge_text: string;
  title: string;
  body_text: string;
  phone_label: string;
  phone_value: string;
  email_label: string;
  email_value: string;
  full_name_placeholder: string;
  email_placeholder: string;
  phone_placeholder: string;
  interest_placeholder: string;
  message_placeholder: string;
  submit_label: string;
  sending_label: string;
  success_title: string;
  success_body: string;
  send_another_label: string;
  source_path: string;
  interest_options: ContactInterestOptionVM[];
};

// -- Footer Links --------------------------------------------------------------
export type FooterLinkVM = {
  id: string;
  group_key: string;
  label: string;
  href: string;
  sort_order: number;
};

// -- Footer Socials ------------------------------------------------------------
export type FooterSocialLinkVM = {
  id: string;
  platform: string;
  label: string;
  href: string;
  icon_key: string;
  sort_order: number;
};
