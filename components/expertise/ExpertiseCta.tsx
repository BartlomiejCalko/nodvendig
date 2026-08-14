import { expertiseCta } from "@/data/expertise";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactButton } from "@/components/contact/ContactTrigger";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const ExpertiseCta = () => (
  <Section id="expertise-cta" tone="carbon">
    <Container>
      <Reveal inView>
        <SectionLabel tone="dark">{expertiseCta.label}</SectionLabel>
      </Reveal>
      <h2 className="text-display-l mt-10 max-w-[12ch] font-medium text-ivory">
        <SplitTextReveal inView>{expertiseCta.line1}</SplitTextReveal>
      </h2>
      <Reveal
        inView
        delay={0.16}
        className="mt-10 flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <p className="max-w-[36ch] text-body-lg text-ivory/75">
          {expertiseCta.body}
        </p>
        <ContactButton variant="onDark">{expertiseCta.cta}</ContactButton>
      </Reveal>
    </Container>
  </Section>
);
