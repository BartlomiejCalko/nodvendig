export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    id: "construction",
    index: "01",
    title: "Data Center Construction",
    description: "Physical construction and building works.",
  },
  {
    id: "conversion",
    index: "02",
    title: "Facility Conversion",
    description:
      "Transformation of existing industrial or data center facilities.",
  },
  {
    id: "structural",
    index: "03",
    title: "Structural & Building Modifications",
    description:
      "Demolition, walls, structural alterations and technical-space modifications.",
  },
  {
    id: "execution",
    index: "04",
    title: "Site Execution",
    description:
      "Workforce, supervision, coordination and project execution.",
  },
];
