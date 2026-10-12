import type { Division } from "@/components/gateway/gateway-state";

export type DivisionEntry = {
  id: Division;
  name: string;
  label: string;
  tag: string;
  href: string;
  description: string;
};

export const divisions: DivisionEntry[] = [
  {
    id: "construction",
    name: "Constructions",
    label: "Construction",
    tag: "Build · Transform",
    href: "/construction",
    description:
      "Construction, transformation and site execution for data center facilities across Norway.",
  },
  {
    id: "telecom",
    name: "Telecom",
    label: "Telecom",
    tag: "Fiber · Network",
    href: "/telecom",
    description:
      "Fiber, structured cabling, cable routes and rack infrastructure — the physical network inside the data center.",
  },
];
