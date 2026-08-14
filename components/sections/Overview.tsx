"use client";

import { useState } from "react";
import { capabilities, overviewCopy, type Capability } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import {
  CapabilityList,
  FacilityDiagram,
} from "@/components/graphics/FacilityDiagram";
import { TechnicalGrid } from "@/components/graphics/TechnicalGrid";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const Overview = () => {
  const [activeId, setActiveId] = useState<Capability["id"]>(
    capabilities[0].id,
  );

  return (
    <Section
      id="overview"
      tone="carbon"
      className="relative overflow-hidden"
    >
      <TechnicalGrid tone="dark" />
      <Container className="relative">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-display-l font-medium text-ivory">
              <SplitTextReveal inView>{overviewCopy.line1}</SplitTextReveal>
              <SplitTextReveal inView delay={0.12}>
                {overviewCopy.line2}
              </SplitTextReveal>
            </h2>
            <Reveal inView delay={0.2} className="mt-8">
              <p className="text-body-lg max-w-[22ch] text-ivory/80">
                {overviewCopy.supporting}
              </p>
            </Reveal>
          </div>
          <Reveal inView delay={0.16} className="lg:col-span-6 lg:col-start-7">
            <p className="technical-label mb-4 text-ivory/40">
              {overviewCopy.diagramLabel}
            </p>
            <FacilityDiagram activeId={activeId} onChange={setActiveId} />
          </Reveal>
        </div>
        <Reveal inView delay={0.1} className="mt-16 md:mt-24">
          <CapabilityList activeId={activeId} onChange={setActiveId} />
        </Reveal>
      </Container>
    </Section>
  );
};
