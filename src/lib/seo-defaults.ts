export const PUBLIC_PAGE_ROUTES = [
  "/",
  "/about",
  "/workspaces",
  "/services",
  "/faq",
  "/connect",
  "/privacy-policy",
] as const;

export type PublicPageRoute = (typeof PUBLIC_PAGE_ROUTES)[number];

export type PageSeoDefault = {
  label: string;
  title: string;
  description: string;
};

export const PAGE_SEO_DEFAULTS: Record<PublicPageRoute, PageSeoDefault> = {
  "/": {
    label: "Home",
    title: "Alley Workspace | Premium Coworking & Office Spaces in Delhi",
    description:
      "Alley Workspace offers premium coworking spaces, private cabins, dedicated desks, meeting rooms, and virtual office solutions in Delhi.",
  },
  "/about": {
    label: "About",
    title: "About Alley Workspace | Premium Coworking Spaces in Delhi",
    description:
      "Learn about Alley Workspace, our mission, values, and approach to premium coworking spaces in Delhi.",
  },
  "/workspaces": {
    label: "Workspaces",
    title: "Workspaces | Alley Workspace",
    description:
      "Explore Alley Workspace coworking options, including dedicated desks, private cabins, meeting rooms, and virtual office solutions.",
  },
  "/services": {
    label: "Services",
    title: "Services | Alley Workspace",
    description:
      "Explore Alley Workspace services, including coworking desks, private cabins, meeting rooms, virtual office support, and managed workspace solutions in Delhi.",
  },
  "/faq": {
    label: "FAQ",
    title: "FAQs | Alley Workspace",
    description:
      "Find answers to common questions about Alley Workspace memberships, offices, meeting rooms, amenities, and bookings.",
  },
  "/connect": {
    label: "Connect",
    title: "Contact Alley Workspace",
    description:
      "Contact Alley Workspace to book a tour, ask about coworking plans, or discuss office space requirements.",
  },
  "/privacy-policy": {
    label: "Privacy Policy",
    title: "Privacy Policy | Alley Workspace",
    description:
      "Read the Alley Workspace privacy policy, including how enquiry information is collected, used, protected, and managed.",
  },
};
