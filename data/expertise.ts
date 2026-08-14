export const expertiseHero = {
  label: "Expertise",
  line1: "FOUR DISCIPLINES.",
  line2: "ONE SITE PARTNER.",
  lead: "Construction, conversion, structural modification and site execution for data center projects in Norway.",
} as const;

export type ExpertiseEntry = {
  id: "construction" | "conversion" | "structural" | "execution";
  index: string;
  title: string;
  description: string;
  body: string;
  scope: readonly string[];
  href?: string;
  cta?: string;
};

export const expertiseEntries: ExpertiseEntry[] = [
  {
    id: "construction",
    index: "01",
    title: "Data Center Construction",
    description: "Physical construction and building works.",
    body: "Physical construction and building works for data center facilities across Norway.",
    scope: ["Construction execution", "Building modifications"],
  },
  {
    id: "conversion",
    index: "02",
    title: "Facility Conversion",
    description:
      "Transformation of existing industrial or data center facilities.",
    body: "Transformation of existing industrial or data center facilities. Current work includes converting a cryptocurrency mining facility in Tydal into infrastructure prepared for AI and high-performance computing.",
    scope: ["Demolition", "Reconstruction", "Building modifications"],
    href: "/projects/tydal",
    cta: "See Tydal conversion",
  },
  {
    id: "structural",
    index: "03",
    title: "Structural & Building Modifications",
    description:
      "Demolition, walls, structural alterations and technical-space modifications.",
    body: "Demolition, walls, structural alterations and technical-space modifications for data center projects.",
    scope: [
      "Structural works",
      "Demolition",
      "Technical-space preparation",
    ],
  },
  {
    id: "execution",
    index: "04",
    title: "Site Execution",
    description:
      "Workforce, supervision, coordination and project execution.",
    body: "Workforce, supervision, coordination and project execution on data center sites.",
    scope: [
      "Site organisation",
      "Workforce",
      "Coordination",
      "On-site management",
    ],
  },
];

export const expertiseBoundary = {
  label: "Working together",
  line1: "We build the physical environment.",
  line2: "Specialists deliver the rest.",
  body: "Nødvendig works alongside companies responsible for critical infrastructure. Electrical, cooling and other specialist systems sit with those partners. Our work is construction, conversion, structural modification and site execution.",
} as const;

export const expertiseCta = {
  label: "Next step",
  line1: "DISCUSS THE BUILD.",
  body: "Planning a new data center, converting an existing facility or executing structural works on site?",
  cta: "Discuss a project",
} as const;
