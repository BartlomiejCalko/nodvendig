export const overviewCopy = {
  line1: "DATA CENTER",
  line2: "CONSTRUCTION",
  supporting:
    "From structural modifications to complete facility transformations.",
  diagramLabel: "DC / PLAN",
} as const;

export type Capability = {
  id: "construction" | "conversion" | "structural" | "execution";
  index: string;
  title: string;
  description: string;
  zone: string;
};

export const capabilities: Capability[] = [
  {
    id: "construction",
    index: "01",
    title: "Construction",
    description: "Physical construction and building works.",
    zone: "STRUCTURE",
  },
  {
    id: "conversion",
    index: "02",
    title: "Conversion",
    description:
      "Transformation of existing industrial or data center facilities.",
    zone: "HALL",
  },
  {
    id: "structural",
    index: "03",
    title: "Structural Works",
    description:
      "Demolition, walls, structural alterations and technical-space modifications.",
    zone: "GRID",
  },
  {
    id: "execution",
    index: "04",
    title: "Site Execution",
    description:
      "Workforce, supervision, coordination and project execution.",
    zone: "SITE",
  },
];

export const positioningCopy = {
  label: "What we do",
  line1: "We build the environment",
  line2: "around critical infrastructure.",
  body: "Nødvendig delivers construction, structural modification and site execution for data center projects — working alongside critical infrastructure specialists to turn complex technical requirements into physical reality.",
  image: {
    alt: "Data center facility in Tydal, Norway",
    caption: "TYDAL / NORWAY",
  },
} as const;

export type Chapter = {
  id: "build" | "transform" | "deliver";
  title: string;
  body: string;
};

export const chapters: Chapter[] = [
  {
    id: "build",
    title: "BUILD.",
    body: "Construction and structural works for data center facilities.",
  },
  {
    id: "transform",
    title: "TRANSFORM.",
    body: "Converting existing facilities for the next generation of computing infrastructure.",
  },
  {
    id: "deliver",
    title: "DELIVER.",
    body: "Experienced site teams. Strong coordination. Fast execution.",
  },
];

export const tydalCopy = {
  label: "Current project / Norway",
  line1: "FROM BITCOIN",
  line2: "TO AI.",
  cta: "Explore project",
} as const;

export type TransformationStage = {
  index: string;
  title: string;
  description: string;
};

export const transformationCopy = {
  label: "Facility conversion",
  line1: "Turning existing infrastructure",
  line2: "into what comes next.",
  body: "A conversion starts with a building that already exists. We remove what cannot serve the new purpose, rebuild the structure, install the technical environment, and deliver a facility prepared for high-density computing.",
  diagramLabel: "Conversion sequence",
} as const;

export const transformationStages: TransformationStage[] = [
  {
    index: "01",
    title: "EXISTING",
    description:
      "The facility as found — previous use, structure and layout still in place.",
  },
  {
    index: "02",
    title: "STRIP OUT",
    description:
      "Redundant construction, partitions and equipment are taken out.",
  },
  {
    index: "03",
    title: "REBUILD",
    description:
      "Structural modification and new construction to the required specification.",
  },
  {
    index: "04",
    title: "INFRASTRUCTURE",
    description:
      "Technical spaces, routing and site works that make the building operable as a data center.",
  },
  {
    index: "05",
    title: "AI READY",
    description:
      "A facility prepared for high-performance and AI computing loads.",
  },
];

export type ExperienceEntry = {
  title: string;
  location: string;
  type: string;
  status?: "ongoing";
};

export const experienceCopy = {
  label: "Experience",
  line1: "EXPERIENCE IN",
  line2: "MISSION-CRITICAL ENVIRONMENTS.",
} as const;

export const experienceEntries: ExperienceEntry[] = [
  {
    title: "AI DATA CENTER CONVERSION",
    location: "Tydal, Norway",
    type: "Facility transformation",
    status: "ongoing",
  },
  {
    title: "HYPERSCALE DATA CENTER",
    location: "Greater Oslo Region",
    type: "Repair & construction works",
  },
  {
    title: "COLOCATION DATA CENTER",
    location: "Oslo Region",
    type: "Data center construction works",
  },
];

export const differenceCopy = {
  label: "The Nødvendig difference",
  line1: "Construction is only",
  line2: "part of the job.",
  secondary: "People. Coordination. Execution.",
  body: "Complex data center projects require teams that can adapt quickly, coordinate across disciplines and keep construction moving as technical requirements evolve.",
  close: "That is where we are strongest.",
} as const;

export const peopleCopy = {
  line1: "BUILT BY PEOPLE",
  line2: "WHO GET THINGS DONE.",
  supporting: "Experienced leadership. Skilled teams. Clear responsibility.",
  frameLabel: "SITE / PEOPLE",
} as const;

export type Metric = {
  value: string;
  label: string;
};

export const metrics: Metric[] = [
  { value: "2023", label: "Founded" },
  { value: "XX+", label: "People" },
  { value: "3+", label: "Data center environments" },
  { value: "1", label: "Focus" },
];

export const metricsFocus = "Data Centers." as const;

export const ambitionCopy = {
  label: "What comes next",
  line1: "NORWAY IS JUST",
  line2: "THE BEGINNING.",
  body: "Our ambition is to become a trusted construction partner for data center development across the Nordic region.",
} as const;

export const finalCtaCopy = {
  line1: "LET'S BUILD",
  line2: "THE NEXT ONE.",
  body: "Planning a new data center, expanding an existing facility or transforming infrastructure for a new purpose?",
  cta: "Discuss your project",
} as const;
