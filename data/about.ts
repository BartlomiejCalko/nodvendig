export const aboutHero = {
  label: "About",
  line1: "A CONSTRUCTION COMPANY",
  line2: "FOR DATA CENTERS.",
  lead: "Nødvendig Holding AS builds and transforms the physical environments required by modern data centers and critical infrastructure.",
} as const;

export const aboutFacts = [
  { label: "Founded", value: "2023" },
  { label: "Market", value: "Norway" },
  { label: "Base", value: "Høvik" },
  { label: "Focus", value: "Data Centers" },
] as const;

export const aboutProfile = {
  label: "The company",
  line1: "Physical work",
  line2: "around critical infrastructure.",
  body: [
    "Nødvendig physically builds and converts data center facilities across Norway. We work alongside companies responsible for critical infrastructure — contributing construction execution, site organisation and structural works.",
    "The company is currently involved in the transformation of an existing cryptocurrency mining facility in Tydal into infrastructure prepared for AI and high-performance computing.",
  ],
  tydalCta: "Explore Tydal",
  tydalHref: "/projects/tydal",
} as const;

export const aboutContribution = {
  label: "What we contribute",
  line1: "Construction execution",
  line2: "in mission-critical environments.",
  intro:
    "Nødvendig works alongside companies responsible for critical infrastructure and contributes:",
  items: [
    "Construction execution",
    "Site organisation",
    "Workforce",
    "Structural works",
    "Demolition",
    "Reconstruction",
    "Building modifications",
    "Technical-space preparation",
    "Coordination",
    "Problem solving",
    "On-site management",
  ],
} as const;
