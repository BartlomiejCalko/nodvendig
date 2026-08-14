import tydalImage from "@/assets/images/tydal.jpg";
import { positioningCopy } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const Positioning = () => (
  <Section id="positioning" tone="ivory">
    <Container>
      <Reveal inView>
        <SectionLabel>{positioningCopy.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <ImageReveal
            src={tydalImage}
            alt={positioningCopy.image.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            ratio="16 / 9"
          />
          <p className="technical-label mt-4 text-steel">
            {positioningCopy.image.caption}
          </p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-2">
          <h2 className="text-display-l max-w-[12ch] font-medium">
            <SplitTextReveal inView>{positioningCopy.line1}</SplitTextReveal>
            <SplitTextReveal inView delay={0.1}>
              {positioningCopy.line2}
            </SplitTextReveal>
          </h2>
          <Reveal inView delay={0.16}>
            <p className="mt-8 max-w-[38ch] text-base leading-relaxed text-steel md:text-[1.05rem]">
              {positioningCopy.body}
            </p>
          </Reveal>
        </div>
      </div>
    </Container>
  </Section>
);
