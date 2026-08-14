"use client";

import { company } from "@/data/company";
import { heroCopy } from "@/data/hero";
import { primaryCta } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { FacilityPlan } from "@/components/graphics/FacilityPlan";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { heroSequence } from "@/lib/motion";

export const Hero = () => (
  <section
    data-hero
    aria-labelledby="hero-heading"
    className="flex min-h-svh flex-col bg-ivory"
  >
    <div className="flex min-h-[42svh] flex-1 flex-col pt-[90px]">
      <Container className="flex flex-1 items-end py-10 md:py-12 lg:py-14">
        <div className="grid w-full grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
          <h1
            id="hero-heading"
            className="text-display-xl max-w-[11ch] font-medium text-carbon lg:col-span-7"
          >
            <SplitTextReveal delay={heroSequence.line1}>
              {heroCopy.line1}
            </SplitTextReveal>
            <SplitTextReveal delay={heroSequence.line2}>
              {heroCopy.line2}
              <span className="text-accent">.</span>
            </SplitTextReveal>
          </h1>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={heroSequence.copy}>
              <p className="max-w-[36ch] text-[1.05rem] leading-snug text-carbon md:text-[1.15rem]">
                {heroCopy.supporting}
              </p>
              <p className="mt-4 max-w-[36ch] text-[0.95rem] leading-relaxed text-steel">
                {heroCopy.secondary}
              </p>
            </Reveal>
            <Reveal delay={heroSequence.cta} className="mt-8">
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </div>

    <div className="flex min-h-[46svh] flex-[1.2] bg-carbon">
      <Container className="grid w-full grid-cols-1 gap-8 py-8 lg:grid-cols-12 lg:items-stretch lg:gap-8 lg:py-10">
        <Reveal
          delay={heroSequence.marker}
          className="flex flex-col justify-between lg:col-span-3 lg:py-2"
        >
          <p className="technical-label flex items-center gap-2 text-ivory/55">
            <span aria-hidden="true" className="size-1.5 bg-accent" />
            {company.technicalLabel}
          </p>
          <p className="technical-label hidden items-center gap-3 text-ivory/45 lg:flex">
            {heroCopy.scrollLabel}
            <span
              aria-hidden="true"
              className="inline-block h-6 w-px bg-ivory/30"
            />
          </p>
        </Reveal>

        <Reveal
          delay={heroSequence.cta}
          className="flex items-center lg:col-span-9"
        >
          <FacilityPlan />
        </Reveal>
      </Container>
    </div>
  </section>
);
