import { finalCtaCopy } from "@/data/homepage";
import { ContactButton } from "@/components/contact/ContactTrigger";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const FinalCta = () => (
  <Section id="contact-cta" tone="carbon" className="relative overflow-hidden">
    <Container>
      <h2 className="text-display-l font-medium text-ivory">
        <SplitTextReveal inView>{finalCtaCopy.line1}</SplitTextReveal>
        <SplitTextReveal inView delay={0.1}>
          {finalCtaCopy.line2}
        </SplitTextReveal>
      </h2>
      <Reveal
        inView
        delay={0.16}
        className="mt-10 flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <p className="max-w-[36ch] text-body-lg text-ivory/75">
          {finalCtaCopy.body}
        </p>
        <ContactButton variant="onDark">
          {finalCtaCopy.cta}
        </ContactButton>
      </Reveal>
    </Container>
  </Section>
);
