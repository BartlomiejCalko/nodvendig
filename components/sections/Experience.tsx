import { experienceCopy, experienceEntries } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { cn } from "@/lib/cn";

export const Experience = () => (
  <Section id="experience" tone="ivory">
    <Container>
      <Reveal inView>
        <SectionLabel>{experienceCopy.label}</SectionLabel>
      </Reveal>
      <h2 className="text-display-l mt-10 max-w-[14ch] font-medium">
        <SplitTextReveal inView>{experienceCopy.line1}</SplitTextReveal>
        <SplitTextReveal inView delay={0.1}>
          {experienceCopy.line2}
        </SplitTextReveal>
      </h2>
      <ul className="mt-16 border-t border-line">
        {experienceEntries.map((entry, index) => {
          const isOngoing = entry.status === "ongoing";

          return (
            <li key={entry.title} className="border-b border-line">
              <Reveal inView delay={index * 0.08}>
                <div className="grid grid-cols-1 gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                  <p
                    className={cn(
                      "technical-label md:col-span-1",
                      isOngoing ? "text-accent" : "text-steel",
                    )}
                  >
                    0{index + 1}
                  </p>
                  <div className="md:col-span-6">
                    <p
                      className={cn(
                        "text-heading-3 font-medium",
                        isOngoing && "text-accent",
                      )}
                    >
                      {entry.title}
                    </p>
                    {isOngoing ? (
                      <p className="technical-label mt-2 text-accent">
                        Ongoing
                      </p>
                    ) : null}
                  </div>
                  <p className="text-steel md:col-span-3">{entry.location}</p>
                  <p className="technical-label text-steel md:col-span-2 md:text-right">
                    {entry.type}
                  </p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Container>
  </Section>
);
