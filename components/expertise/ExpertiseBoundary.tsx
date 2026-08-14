import { expertiseBoundary } from "@/data/expertise";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const ExpertiseBoundary = () => (
  <Section id="expertise-boundary" tone="graphite">
    <Container>
      <Reveal inView>
        <SectionLabel tone="dark">{expertiseBoundary.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 className="text-display-l max-w-[14ch] font-medium text-ivory lg:col-span-7">
          <SplitTextReveal inView>{expertiseBoundary.line1}</SplitTextReveal>
          <SplitTextReveal inView delay={0.1}>
            {expertiseBoundary.line2}
          </SplitTextReveal>
        </h2>
        <Reveal inView delay={0.16} className="lg:col-span-4 lg:col-start-9">
          <p className="max-w-[38ch] text-base leading-relaxed text-ivory/70 md:text-[1.05rem]">
            {expertiseBoundary.body}
          </p>
        </Reveal>
      </div>
    </Container>
  </Section>
);
