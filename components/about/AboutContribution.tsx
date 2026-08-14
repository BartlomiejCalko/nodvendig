import { aboutContribution } from "@/data/about";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TechnicalGrid } from "@/components/graphics/TechnicalGrid";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const AboutContribution = () => (
  <Section
    id="about-contribution"
    tone="carbon"
    className="relative overflow-hidden"
  >
    <TechnicalGrid tone="dark" />
    <Container className="relative">
      <Reveal inView>
        <SectionLabel tone="dark">{aboutContribution.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-8">
        <h2 className="text-display-l max-w-[12ch] font-medium text-ivory lg:col-span-5">
          <SplitTextReveal inView>{aboutContribution.line1}</SplitTextReveal>
          <SplitTextReveal inView delay={0.1}>
            {aboutContribution.line2}
          </SplitTextReveal>
        </h2>
        <Reveal inView delay={0.16} className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-[42ch] text-base leading-relaxed text-ivory/65 md:text-[1.05rem]">
            {aboutContribution.intro}
          </p>
          <ol className="mt-10 grid grid-cols-1 border-t border-line-dark sm:grid-cols-2">
            {aboutContribution.items.map((item, index) => (
              <li
                key={item}
                className="flex items-baseline justify-between gap-6 border-b border-line-dark py-4 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
              >
                <span className="text-[1.05rem] text-ivory">{item}</span>
                <span className="technical-label shrink-0 text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Container>
  </Section>
);
