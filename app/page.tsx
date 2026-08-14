import { Hero } from "@/components/sections/Hero";
import { Overview } from "@/components/sections/Overview";
import { Positioning } from "@/components/sections/Positioning";
import { Chapters } from "@/components/sections/Chapters";
import { Tydal } from "@/components/sections/Tydal";
import { Transformation } from "@/components/sections/Transformation";
import { Experience } from "@/components/sections/Experience";
import { Difference } from "@/components/sections/Difference";
import { People } from "@/components/sections/People";
import { Metrics } from "@/components/sections/Metrics";
import { Ambition } from "@/components/sections/Ambition";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Overview />
      <Positioning />
      <Chapters />
      <Tydal />
      <Transformation />
      <Experience />
      <Difference />
      <People />
      <Metrics />
      <Ambition />
      <FinalCta />
    </main>
  );
}
