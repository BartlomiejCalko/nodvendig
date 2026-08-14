export type ProjectStatus = "ongoing" | "complete";

export type Project = {
  slug: string;
  name: string;
  location: string;
  yearLabel: string;
  status: ProjectStatus;
  type: string;
  description: string;
  statistics: Record<string, string | null>;
};

export const projects: Project[] = [
  {
    slug: "tydal",
    name: "Tydal",
    location: "Tydal, Norway",
    yearLabel: "2026 — ONGOING",
    status: "ongoing",
    type: "Data Center Conversion",
    description:
      "Transformation of an existing cryptocurrency mining facility into infrastructure prepared for AI and high-performance computing.",
    statistics: {
      area: null,
      value: null,
      duration: null,
    },
  },
];
