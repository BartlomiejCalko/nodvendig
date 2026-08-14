import { ambitionCopy } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const Ambition = () => (
  <Section id="ambition" tone="ivory">
    <Container>
      <Reveal inView>
        <SectionLabel>{ambitionCopy.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 className="text-display-l font-medium lg:col-span-7">
          <SplitTextReveal inView>{ambitionCopy.line1}</SplitTextReveal>
          <SplitTextReveal inView delay={0.1}>
            {ambitionCopy.line2}
          </SplitTextReveal>
        </h2>
        <Reveal inView delay={0.16} className="lg:col-span-4 lg:col-start-9">
          <p className="max-w-[34ch] text-base leading-relaxed text-steel md:text-[1.05rem]">
            {ambitionCopy.body}
          </p>
        </Reveal>
      </div>
    </Container>
  </Section>
);
