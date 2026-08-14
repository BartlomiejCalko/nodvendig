import type { Metadata } from "next";
import { expertiseHero } from "@/data/expertise";
import { ExpertiseHero } from "@/components/expertise/ExpertiseHero";
import { ExpertiseServices } from "@/components/expertise/ExpertiseServices";
import { ExpertiseBoundary } from "@/components/expertise/ExpertiseBoundary";
import { ExpertiseCta } from "@/components/expertise/ExpertiseCta";

export const metadata: Metadata = {
  title: "Expertise",
  description: expertiseHero.lead,
};

export default function ExpertisePage() {
  return (
    <main id="main">
      <ExpertiseHero />
      <ExpertiseServices />
      <ExpertiseBoundary />
      <ExpertiseCta />
    </main>
  );
}
