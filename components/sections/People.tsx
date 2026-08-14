import { peopleCopy } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { GraphicFrame } from "@/components/graphics/GraphicFrame";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const People = () => (
  <Section id="people" tone="ivory">
    <Container>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-display-l max-w-[12ch] font-medium">
            <SplitTextReveal inView>{peopleCopy.line1}</SplitTextReveal>
            <SplitTextReveal inView delay={0.1}>
              {peopleCopy.line2}
            </SplitTextReveal>
          </h2>
          <Reveal inView delay={0.16}>
            <p className="mt-8 max-w-[24ch] text-body-lg text-steel">
              {peopleCopy.supporting}
            </p>
          </Reveal>
        </div>
        <Reveal
          inView
          delay={0.12}
          className="grid grid-cols-2 gap-4 lg:col-span-4 lg:col-start-9"
        >
          <GraphicFrame label={peopleCopy.frameLabel} ratio="3 / 4" />
          <GraphicFrame
            label={peopleCopy.frameLabel}
            ratio="3 / 4"
            className="mt-10"
          />
        </Reveal>
      </div>
    </Container>
  </Section>
);
