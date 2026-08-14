import { differenceCopy } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const Difference = () => (
  <Section id="difference" tone="graphite">
    <Container>
      <Reveal inView>
        <SectionLabel tone="dark">{differenceCopy.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 className="text-display-l max-w-[12ch] font-medium text-ivory lg:col-span-7">
          <SplitTextReveal inView>{differenceCopy.line1}</SplitTextReveal>
          <SplitTextReveal inView delay={0.1}>
            {differenceCopy.line2}
          </SplitTextReveal>
        </h2>
        <Reveal inView delay={0.16} className="lg:col-span-4 lg:col-start-9">
          <p className="text-body-lg text-ivory">{differenceCopy.secondary}</p>
          <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-ivory/65">
            {differenceCopy.body}
          </p>
          <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-ivory">
            {differenceCopy.close}
          </p>
        </Reveal>
      </div>
    </Container>
  </Section>
);
