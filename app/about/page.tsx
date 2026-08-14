import type { Metadata } from "next";
import { aboutHero } from "@/data/about";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutProfile } from "@/components/about/AboutProfile";
import { AboutContribution } from "@/components/about/AboutContribution";
import { Difference } from "@/components/sections/Difference";
import { People } from "@/components/sections/People";
import { Metrics } from "@/components/sections/Metrics";
import { Ambition } from "@/components/sections/Ambition";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "About",
  description: aboutHero.lead,
};

export default function AboutPage() {
  return (
    <main id="main">
      <AboutHero />
      <AboutProfile />
      <AboutContribution />
      <Difference />
      <People />
      <Metrics />
      <Ambition />
      <FinalCta />
    </main>
  );
}
