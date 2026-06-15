// Admin view model types - include asset IDs needed by image pickers and editor forms.
// Only import in server components, server actions, and admin-only client components.

export type AdminImagePreview = {
  asset_id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

// -- Media Library -------------------------------------------------------------
export type MediaAssetVM = {
  id: string;
  provider_file_id: string | null;
  file_key: string;
  file_url: string;
  file_name: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  folder: string | null;
  is_published: boolean;
  created_at: string;
};

export type MediaAssetListVM = {
  items: MediaAssetVM[];
  total: number;
};

// -- Admin Hero ----------------------------------------------------------------
export type AdminHeroSectionVM = {
  id: string;
  badge_text: string;
  headline: string;
  cta_label: string;
  cta_href: string;
  promo_title: string;
  promo_badge_text: string;
  left_image_asset_id: string | null;
  top_right_image_asset_id: string | null;
  bottom_right_image_asset_id: string | null;
  left_image: AdminImagePreview | null;
  top_right_image: AdminImagePreview | null;
  bottom_right_image: AdminImagePreview | null;
};

// -- Admin Intro ---------------------------------------------------------------
export type AdminIntroSectionVM = {
  id: string;
  badge_text: string;
  title: string;
  body_text: string;
  cta_label: string;
  cta_href: string;
  left_image_asset_id: string | null;
  right_image_asset_id: string | null;
  left_image: AdminImagePreview | null;
  right_image: AdminImagePreview | null;
};

// -- Admin Locations -----------------------------------------------------------
export type AdminLocationCardVM = {
  id: string;
  section_id: string;
  layout_slot: number;
  location_name: string;
  subtitle: string | null;
  image_asset_id: string | null;
  image: AdminImagePreview | null;
  hover_visit_label: string;
  hover_visit_href: string;
  hover_meeting_label: string;
  hover_meeting_href: string;
  hover_space_label: string;
  hover_space_href: string;
  sort_order: number;
  is_active: boolean;
};

export type AdminLocationsSectionVM = {
  id: string;
  badge_text: string;
  title: string;
  view_all_label: string;
  view_all_href: string;
  cards: AdminLocationCardVM[];
};

// -- Admin Memberships ---------------------------------------------------------
export type AdminMembershipPlanFeatureVM = {
  id: string;
  plan_id: string;
  feature_text: string;
  sort_order: number;
};

export type AdminMembershipPlanVM = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  price_text: string;
  cta_label: string;
  highlight_badge_text: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  features: AdminMembershipPlanFeatureVM[];
};

export type AdminMembershipSectionVM = {
  id: string;
  badge_text: string;
  title: string;
  plans: AdminMembershipPlanVM[];
};

// -- Admin Offerings -----------------------------------------------------------
export type AdminOfferingFeatureVM = {
  id: string;
  offering_id: string;
  feature_text: string;
  is_included: boolean;
  sort_order: number;
};

export type AdminOfferingVM = {
  id: string;
  section_id: string;
  title: string;
  icon_key: string;
  price_text: string | null;
  sort_order: number;
  is_active: boolean;
  features: AdminOfferingFeatureVM[];
};

export type AdminOfferingsSectionVM = {
  id: string;
  badge_text: string;
  title: string;
  offerings: AdminOfferingVM[];
};

// -- Admin Why Choose Us -------------------------------------------------------
export type AdminWhyChooseUsCardVM = {
  id: string;
  section_id: string;
  title: string;
  description: string;
  animation_key: string;
  theme: "light" | "dark";
  sort_order: number;
  is_active: boolean;
};

export type AdminWhyChooseUsSectionVM = {
  id: string;
  badge_text: string;
  title: string;
  body_text: string;
  cards: AdminWhyChooseUsCardVM[];
};

// -- Admin Amenities -----------------------------------------------------------
export type AdminAmenityVM = {
  id: string;
  section_id: string;
  icon_key: string;
  label: string;
  sort_order: number;
  is_active: boolean;
};

export type AdminAmenitiesSectionVM = {
  id: string;
  badge_text: string;
  title: string;
  amenities: AdminAmenityVM[];
};

// -- Admin Testimonials --------------------------------------------------------
export type AdminTestimonialVM = {
  id: string;
  section_id: string;
  quote: string;
  person_name: string;
  person_role: string | null;
  company_name: string | null;
  avatar_asset_id: string | null;
  avatar: AdminImagePreview | null;
  sort_order: number;
  is_active: boolean;
};

export type AdminTestimonialsSectionVM = {
  id: string;
  badge_text: string;
  title: string;
  layout_mode: string;
  testimonials: AdminTestimonialVM[];
};

// -- Admin Contact -------------------------------------------------------------
export type AdminContactInterestOptionVM = {
  label: string;
  value: string;
};

export type AdminContactSectionVM = {
  id: string;
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
  interest_options: AdminContactInterestOptionVM[];
};

// -- Admin Footer Links --------------------------------------------------------
export type AdminFooterLinkVM = {
  id: string;
  group_key: string;
  label: string;
  href: string;
  sort_order: number;
  is_active: boolean;
};

// -- Admin Footer Socials ------------------------------------------------------
export type AdminFooterSocialLinkVM = {
  id: string;
  platform: string;
  label: string;
  href: string;
  icon_key: string;
  sort_order: number;
  is_active: boolean;
};

// -- Admin Messages ------------------------------------------------------------
export type MessageStatus =
  | "new"
  | "viewed"
  | "in_progress"
  | "resolved"
  | "spam";

export type ContactMessageSummaryVM = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  interest: string | null;
  status: MessageStatus;
  created_at: string;
};

export type ContactMessageDetailVM = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  interest: string | null;
  message: string;
  source_path: string;
  status: MessageStatus;
  admin_notes: string | null;
  viewed_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MessagesListVM = {
  items: ContactMessageSummaryVM[];
  total: number;
};

// -- Admin About Hero ----------------------------------------------------------
export type AdminAboutHeroImageVM = {
  id: string | null;
  section_id: string;
  slot: number;
  image_asset_id: string | null;
  image: AdminImagePreview | null;
};

export type AdminAboutHeroSectionVM = {
  id: string;
  headline: string;
  subtext: string;
  images: AdminAboutHeroImageVM[];
};

// -- Admin About Pillars (Values) ----------------------------------------------
export type AdminAboutPillarCardVM = {
  id: string;
  section_id: string;
  sort_order: number;
  icon_key: string;
  label: string;
  stat: string;
  description: string;
  is_active: boolean;
};

export type AdminAboutPillarsSectionVM = {
  id: string;
  cards: AdminAboutPillarCardVM[];
};

// -- Admin About Story ---------------------------------------------------------
export type AdminAboutStoryImageVM = {
  id: string | null;
  section_id: string;
  slot: number;
  image_asset_id: string | null;
  image: AdminImagePreview | null;
};

export type AdminAboutStorySectionVM = {
  id: string;
  subheading: string;
  heading: string;
  body_1: string;
  body_2: string;
  body_3: string;
  belief_1_title: string;
  belief_1_text: string;
  belief_2_title: string;
  belief_2_text: string;
  images: AdminAboutStoryImageVM[];
};

// -- Admin About Client Stories -----------------------------------------------
export type AdminAboutClientStoryVM = {
  id: string;
  sort_order: number;
  tag: string;
  author: string;
  title: string;
  description: string;
  icon_key: string;
  is_active: boolean;
};

// -- ImageKit Auth -------------------------------------------------------------
export type IkAuthParamsVM = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
};

// -- Shared Action Result ------------------------------------------------------
export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
