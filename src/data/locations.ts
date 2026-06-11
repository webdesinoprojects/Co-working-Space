export type LocationData = {
  slug: string;
  title: string;
  subtitle: string;
  address: string;
  email: string;
  phone: string;
  hours: string;
  images: string[];
  featuresTitle: string;
  featuresDesc: string;
  servicesTitle: string;
  servicesDesc: string;
  mapAddress: string;
  gettingHere: string[];
  nearbyAmenities: string[];
};

export const locationsData: LocationData[] = [
  {
    slug: "noida-sector-2",
    title: "Coworking space in the heart of Noida Sector 2.",
    subtitle: "Axion Sector 2, where modern design blends with functional workspaces to inspire productivity.",
    address: "A-12, Sector 2, Noida, UP 201301",
    email: "sector2@axionspaces.com",
    phone: "+91 98765 00002",
    hours: "Open every day 8:00 am to 10:00 pm",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497215898141-926f34ce0519?auto=format&fit=crop&w=800&q=80"
    ],
    featuresTitle: "A full-service workspace tailored to you",
    featuresDesc: "Curated by local design visionaries, Axion Sector 2 showcases a unique blend of artistry and functionality. The space is filled with custom furniture and decor that spark creativity, making it an ideal environment for startups and professionals.",
    servicesTitle: "Transparent services with no hidden fees",
    servicesDesc: "At Axion, we prioritize your convenience with a range of premium services included in your membership. From mail handling to fully equipped meeting rooms, our dedicated team ensures you have everything you need to focus.",
    mapAddress: "Sector 2, Noida",
    gettingHere: [
      "Metro: 5 mins walk from Sector 15 Metro Station.",
      "Parking: Ample dedicated parking available for members.",
    ],
    nearbyAmenities: [
      "Food & Dining: Surrounded by cafes, food courts, and premium restaurants.",
      "Shopping: Close to local markets for quick errands.",
    ],
  },
  {
    slug: "noida-sector-3",
    title: "Premium coworking in the bustling Noida Sector 3.",
    subtitle: "Axion Sector 3, designed for scaling teams and independent creators seeking a focused environment.",
    address: "B-45, Sector 3, Noida, UP 201301",
    email: "sector3@axionspaces.com",
    phone: "+91 98765 00003",
    hours: "Open every day 8:00 am to 10:00 pm",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519389953810-c5eaa815344a?auto=format&fit=crop&w=800&q=80"
    ],
    featuresTitle: "Designed for high-growth teams",
    featuresDesc: "Experience a workspace built for momentum. With abundant natural light, ergonomic seating, and acoustically treated zones, Sector 3 offers the perfect balance of collaborative energy and private focus.",
    servicesTitle: "Enterprise-grade amenities included",
    servicesDesc: "Enjoy ultra-fast redundant internet, unlimited specialty coffee, and dedicated community managers. We handle the office operations so you can focus entirely on scaling your business.",
    mapAddress: "Sector 3, Noida",
    gettingHere: [
      "Metro: 10 mins walk from Sector 16 Metro Station.",
      "Parking: On-site basement parking available.",
    ],
    nearbyAmenities: [
      "Lifestyle: Proximity to gyms and wellness centers.",
      "Banks: Major bank branches and ATMs within walking distance.",
    ],
  },
  {
    slug: "virtual-office",
    title: "Professional virtual office in a prime business district.",
    subtitle: "Establish a premium corporate presence without the overhead of a physical space.",
    address: "Premium Hub, Sector 62, Noida, UP 201309",
    email: "virtual@axionspaces.com",
    phone: "+91 98765 00004",
    hours: "Support available Mon-Fri 9:00 am to 6:00 pm",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1554200876-56c2f25224fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"
    ],
    featuresTitle: "A prestigious address for your business",
    featuresDesc: "Enhance your corporate image with a recognized commercial address. Use it for GST registration, company incorporation, and official business communications, instantly building trust with your clients.",
    servicesTitle: "Comprehensive mail and call handling",
    servicesDesc: "Our professional front-desk team receives, sorts, and forwards your mail securely. We also provide dedicated local phone numbers with professional call answering services tailored to your brand.",
    mapAddress: "Sector 62, Noida",
    gettingHere: [
      "Access: Conveniently located near the highway for easy access.",
      "Meetings: Book physical meeting rooms on-demand when clients visit.",
    ],
    nearbyAmenities: [
      "Business: Situated in the heart of Noida's IT and corporate hub.",
      "Hotels: Premium hotels nearby for visiting clients or executives.",
    ],
  },
  {
    slug: "meeting-rooms",
    title: "State-of-the-art meeting rooms for high-impact presentations.",
    subtitle: "Book professional, tech-enabled rooms designed to impress clients and facilitate deep collaboration.",
    address: "Axion Towers, Sector 16, Noida, UP 201301",
    email: "meetings@axionspaces.com",
    phone: "+91 98765 00005",
    hours: "Available for booking 24/7",
    images: [
      "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80"
    ],
    featuresTitle: "Equipped for seamless collaboration",
    featuresDesc: "Every room is equipped with 4K displays, high-definition video conferencing cameras, wireless casting, and premium whiteboards. Perfect for pitches, interviews, and team offsites.",
    servicesTitle: "Concierge service and catering",
    servicesDesc: "Impress your guests with our dedicated hospitality team. We provide complimentary gourmet coffee and water, with optional premium catering packages available for longer sessions.",
    mapAddress: "Sector 16, Noida",
    gettingHere: [
      "Metro: Steps away from Sector 16 Metro Station.",
      "Drop-off: Dedicated VIP drop-off zone at the entrance.",
    ],
    nearbyAmenities: [
      "Dining: Fine dining options within the building complex.",
      "Convenience: Easy access to major expressways.",
    ],
  },
];
