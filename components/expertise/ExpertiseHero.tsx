import { expertiseEntries, expertiseHero } from "@/data/expertise";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const ExpertiseHero = () => (
  <section
    id="expertise-hero"
    aria-labelledby="expertise-heading"
    className="flex flex-col bg-ivory pt-[90px]"
  >
    <Container className="section-y">
      <Reveal inView>
        <SectionLabel>{expertiseHero.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1
          id="expertise-heading"
          className="text-display-l max-w-[12ch] font-medium lg:col-span-7"
        >
          <SplitTextReveal inView>{expertiseHero.line1}</SplitTextReveal>
          <SplitTextReveal inView delay={0.1}>
            {expertiseHero.line2}
          </SplitTextReveal>
        </h1>
        <Reveal inView delay={0.16} className="lg:col-span-4 lg:col-start-9">
          <p className="max-w-[36ch] text-body-lg text-steel">
            {expertiseHero.lead}
          </p>
        </Reveal>
      </div>
    </Container>
    <nav aria-label="Expertise index" data-tone="carbon" className="bg-carbon">
      <Container>
        <ul className="grid grid-cols-1 border-t border-line-dark sm:grid-cols-2 lg:grid-cols-4">
          {expertiseEntries.map((entry, index) => (
            <li
              key={entry.id}
              className={
                index > 0
                  ? "border-t border-line-dark sm:border-t-0 sm:border-l sm:border-line-dark"
                  : undefined
              }
            >
              <a
                href={`#${entry.id}`}
                className="group flex h-full flex-col justify-between gap-6 px-0 py-8 sm:px-6 lg:px-8"
              >
                <span className="technical-label text-accent">{entry.index}</span>
                <span className="text-[1.15rem] tracking-[-0.03em] text-ivory transition-opacity duration-300 ease-out-expo group-hover:opacity-55">
                  {entry.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  </section>
);
