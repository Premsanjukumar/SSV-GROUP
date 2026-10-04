/**
 * SSV Group Dandiya Divas 2026 — Official Sponsor Data
 *
 * Data structure separating sponsor configuration from UI presentation.
 * Displays actual provided sponsor logos with aspect-ratio preservation,
 * accessible alt tags, and responsive mobile-first grid rendering.
 */

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  alt: string;
  category: string;
  description: string;
}

export const SPONSORS: Sponsor[] = [
  {
    id: "foreign-fits",
    name: "Foreign Fits",
    logo: "/images/sponsors/foreign-fits.jpeg",
    alt: "Foreign Fits - Official Fashion and Shopping Partner",
    category: "Shopping & Fashion Partner",
    description: "Imported Fashion Collection, Bidar",
  },
  {
    id: "ssv-photography",
    name: "SSV Photography & Films",
    logo: "/images/sponsors/ssv-photography.jpeg",
    alt: "SSV Photography & Films - Official Visual & Media Partner",
    category: "Visual & Media Partner",
    description: "Capture • Create • Forever",
  },
  {
    id: "vinayak-films",
    name: "Vinayak Film's",
    logo: "/images/sponsors/vinayak-films.jpeg",
    alt: "Vinayak Film's - Official Cinematography Partner",
    category: "Cinematography Partner",
    description: "Grand Event Cinema & Visual Storytelling",
  },
  {
    id: "bengaluru-photography",
    name: "Bengaluru Photography & Films",
    logo: "/images/sponsors/bengaluru-photography.jpeg",
    alt: "Bengaluru Photography & Films - Official Photography Partner",
    category: "Photography Partner",
    description: "Celebrity & Festival Event Photography",
  },
  {
    id: "sk-films",
    name: "SK Films",
    logo: "/images/sponsors/sk-films.jpeg",
    alt: "SK Films - Official Film & Production Partner",
    category: "Film & Production Partner",
    description: "Creative Videography & Film Production",
  },
  {
    id: "taproot",
    name: "Taproot Group Of Colleges",
    logo: "/images/sponsors/taproot.jpeg",
    alt: "Taproot Group Of Colleges - Shree Maate Manikeshwari PU College of Science",
    category: "Education Partner",
    description: "Shree Maate Manikeshwari P.U. College, Bidar",
  },
  {
    id: "sai-spoorti",
    name: "Sai Spoorti PU College",
    logo: "/images/sponsors/sai-spoorti.jpeg",
    alt: "Sai Spoorti PU College - Science and Commerce",
    category: "Education Partner",
    description: "Science & Commerce • Sai Deep Education Trust",
  },
  {
    id: "ssv-finance",
    name: "SSV Finance & Auto Leasing",
    logo: "/images/sponsors/ssv-finance.jpeg",
    alt: "SSV Finance & Auto Leasing - Official Finance Partner",
    category: "Finance Partner",
    description: "Vehicle Financing & Auto Solutions",
  },
  {
    id: "ssv-hostel",
    name: "SSV PG & Boys Hostel",
    logo: "/images/sponsors/ssv-hostel.jpeg",
    alt: "SSV PG & Boys Hostel - Official Hospitality Partner",
    category: "Hospitality Partner",
    description: "Safe & Premium Accommodation, Bidar",
  },
  {
    id: "ssv-marketing",
    name: "SSV Adds & Marketing",
    logo: "/images/sponsors/ssv-marketing.jpeg",
    alt: "SSV Adds & Marketing - Official Publicity Partner",
    category: "Branding Partner",
    description: "Digital Branding, Promotion & Publicity",
  },
];
