"use client";

import { motion, useReducedMotion } from "motion/react";
import { company } from "@/data/company";
import { heroCopy } from "@/data/hero";
import { primaryCta } from "@/data/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { DimensionLine } from "@/components/graphics/DimensionLine";
import { DrawingMarks } from "@/components/graphics/DrawingMarks";
import { TechnicalGrid } from "@/components/graphics/TechnicalGrid";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { duration, easing, heroSequence } from "@/lib/motion";

export const Hero = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      data-hero
      aria-labelledby="hero-heading"
      className="relative isolate min-h-svh overflow-hidden bg-ivory"
    >
      <TechnicalGrid className="hero-grid" />
      <DrawingMarks />

      <motion.p
        aria-hidden="true"
        className="technical-label pointer-events-none absolute top-1/2 right-3 hidden origin-center -translate-y-1/2 rotate-90 text-steel md:right-5 lg:block"
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: duration.editorial,
          delay: heroSequence.marker,
          ease: easing.outExpo,
        }}
      >
        {heroCopy.sheetLabel}
      </motion.p>

      <Container className="relative flex min-h-svh flex-col pt-[90px]">
        <div className="grid flex-1 grid-cols-1 items-end gap-12 py-10 md:gap-16 lg:grid-cols-12 lg:gap-8 lg:py-12">
          <div className="relative lg:col-span-8">
            <DimensionLine
              label={heroCopy.dimensionLabel}
              delay={heroSequence.line2}
              className="absolute top-3 bottom-2 -left-8 hidden lg:flex xl:-left-10"
            />
            <h1
              id="hero-heading"
              className="text-display-xxl max-w-[11ch] font-medium text-carbon"
            >
              <SplitTextReveal delay={heroSequence.line1}>
                {heroCopy.line1}
              </SplitTextReveal>
              <SplitTextReveal delay={heroSequence.line2}>
                {heroCopy.line2}
                <span className="text-accent">.</span>
              </SplitTextReveal>
            </h1>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:pb-2">
            <Reveal delay={heroSequence.copy}>
              <p className="text-body-lg max-w-[22ch] font-medium text-carbon">
                {heroCopy.supporting}
              </p>
              <p className="mt-6 max-w-[28ch] text-[0.95rem] leading-relaxed text-steel md:text-base">
                {heroCopy.secondary}
              </p>
            </Reveal>
            <Reveal delay={heroSequence.cta} className="mt-8 md:mt-10">
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
            </Reveal>
          </div>
        </div>

        <Reveal
          delay={heroSequence.marker}
          className="flex items-end justify-between gap-6 border-t border-line py-5 md:py-6"
        >
          <p className="technical-label flex items-center gap-2 text-steel">
            <span aria-hidden="true" className="size-1.5 bg-accent" />
            {company.technicalLabel}
          </p>
          <p className="technical-label hidden items-center gap-3 text-steel sm:flex">
            {heroCopy.scrollLabel}
            <span aria-hidden="true" className="inline-block h-6 w-px bg-carbon/35" />
          </p>
        </Reveal>
      </Container>
    </section>
  );
};
