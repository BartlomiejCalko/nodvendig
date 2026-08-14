import { aboutFacts, aboutHero } from "@/data/about";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const AboutHero = () => (
  <section
    id="about-hero"
    aria-labelledby="about-heading"
    className="flex flex-col bg-ivory pt-[90px]"
  >
    <Container className="section-y">
      <Reveal inView>
        <SectionLabel>{aboutHero.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1
          id="about-heading"
          className="text-display-l max-w-[12ch] font-medium lg:col-span-7"
        >
          <SplitTextReveal inView>{aboutHero.line1}</SplitTextReveal>
          <SplitTextReveal inView delay={0.1}>
            {aboutHero.line2}
          </SplitTextReveal>
        </h1>
        <Reveal inView delay={0.16} className="lg:col-span-4 lg:col-start-9">
          <p className="max-w-[36ch] text-body-lg text-steel">
            {aboutHero.lead}
          </p>
        </Reveal>
      </div>
    </Container>
    <div data-tone="carbon" className="bg-carbon">
      <Container>
        <ul className="grid grid-cols-2 border-t border-line-dark lg:grid-cols-4">
          {aboutFacts.map((fact, index) => (
            <li
              key={fact.label}
              className={
                index > 0
                  ? "border-l border-line-dark px-6 py-8 lg:px-8"
                  : "py-8 pr-6 lg:pr-8"
              }
            >
              <p className="technical-label text-ivory/40">{fact.label}</p>
              <p className="mt-3 text-[1.35rem] tracking-[-0.03em] text-ivory">
                {fact.value}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  </section>
);
