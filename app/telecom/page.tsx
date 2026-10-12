import type { Metadata } from "next";
import { TelecomExperience } from "@/components/telecom/TelecomExperience";

export const metadata: Metadata = {
  title: {
    absolute: "Nødvendig Telecom | Fiber & Network Infrastructure for Data Centers",
  },
  description:
    "Nødvendig Telecom designs, installs and certifies the physical network layer of data centers in Norway: fiber backbones, structured cabling, cable containment and racks.",
};

export default function TelecomPage() {
  return (
    <main id="main">
      <TelecomExperience />
    </main>
  );
}
