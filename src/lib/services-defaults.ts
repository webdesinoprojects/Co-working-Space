import type { ServicesPageVM } from "@/features/services/types";

export const SERVICES_PAGE_DEFAULT: ServicesPageVM = {
  badge_text: "Services",
  headline: "Workspace services built around how your team works.",
  intro_text:
    "Choose from flexible desks, private cabins, meeting rooms, virtual office support, and managed office solutions at Alley Workspace in Delhi, Rithala.",
  primary_cta_label: "Book a Tour",
  primary_cta_href: "/connect",
  secondary_cta_label: "View Workspaces",
  secondary_cta_href: "/workspaces",
  hero_image: null,
  highlights: [
    "Flexible terms for individuals and teams",
    "Business-ready address and meeting support",
    "Professional workspace infrastructure in Delhi",
  ],
  services_badge_text: "What we provide",
  services_title: "Services for daily work, meetings, and business setup",
  services_intro_text:
    "Each service can be managed from the admin panel, including copy, image, feature bullets, icon, CTA, order, and visibility.",
  items: [
    {
      id: "coworking-desks",
      title: "Coworking Desks",
      description:
        "Flexible hot desk and dedicated desk access for focused daily work without long leases.",
      icon_key: "laptop",
      image: null,
      features: [
        "Hot desk and dedicated desk options",
        "High-speed internet and shared amenities",
        "Useful for freelancers, founders, and small teams",
      ],
      cta_label: "Enquire About Desks",
      cta_href: "/connect?interest=coworking-desks",
      sort_order: 0,
    },
    {
      id: "private-cabins",
      title: "Private Cabins",
      description:
        "Lockable private offices for teams that need privacy, stability, and a professional workspace.",
      icon_key: "key",
      image: null,
      features: [
        "Cabins for small and growing teams",
        "Privacy for calls and focused work",
        "Managed workspace support included",
      ],
      cta_label: "Enquire About Cabins",
      cta_href: "/connect?interest=private-cabins",
      sort_order: 10,
    },
    {
      id: "meeting-rooms",
      title: "Meeting Rooms",
      description:
        "Book professional rooms for client meetings, interviews, reviews, workshops, and team sessions.",
      icon_key: "presentation",
      image: null,
      features: [
        "Suitable for meetings and interviews",
        "Professional setting for client discussions",
        "Flexible booking support",
      ],
      cta_label: "Book a Meeting Room",
      cta_href: "/connect?interest=meeting-rooms",
      sort_order: 20,
    },
    {
      id: "virtual-office",
      title: "Virtual Office",
      description:
        "Use a business address and registration support without committing to a full-time physical office.",
      icon_key: "map-pin",
      image: null,
      features: [
        "Business address support",
        "Helpful for remote and hybrid teams",
        "Registration-focused workspace service",
      ],
      cta_label: "Enquire About Virtual Office",
      cta_href: "/connect?interest=virtual-office",
      sort_order: 30,
    },
    {
      id: "managed-office",
      title: "Managed Office",
      description:
        "Custom workspace setup for teams that want a serviced office experience with operational support.",
      icon_key: "building",
      image: null,
      features: [
        "Custom workspace planning",
        "Serviced office operations",
        "Designed for teams ready to scale",
      ],
      cta_label: "Discuss Managed Office",
      cta_href: "/connect?interest=managed-office",
      sort_order: 40,
    },
  ],
};
