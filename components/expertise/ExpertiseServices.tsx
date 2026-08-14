import { expertiseEntries } from "@/data/expertise";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { cn } from "@/lib/cn";

export const ExpertiseServices = () => (
  <>
    {expertiseEntries.map((entry, index) => {
      const isDark = index % 2 === 1;

      return (
        <Section
          key={entry.id}
          id={entry.id}
          tone={isDark ? "carbon" : "ivory"}
        >
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <Reveal inView>
                  <p
                    className={cn(
                      "technical-label",
                      isDark ? "text-accent" : "text-steel",
                    )}
                  >
                    {entry.index} / 04
                  </p>
                </Reveal>
                <h2
                  className={cn(
                    "text-display-l mt-6 max-w-[14ch] font-medium",
                    isDark && "text-ivory",
                  )}
                >
                  <SplitTextReveal inView>{entry.title}</SplitTextReveal>
                </h2>
                <Reveal inView delay={0.12}>
                  <p
                    className={cn(
                      "mt-8 max-w-[46ch] text-base leading-relaxed md:text-[1.05rem]",
                      isDark ? "text-ivory/70" : "text-steel",
                    )}
                  >
                    {entry.body}
                  </p>
                  {entry.href && entry.cta ? (
                    <ArrowLink
                      href={entry.href}
                      className={isDark ? "mt-8 text-ivory" : "mt-8"}
                    >
                      {entry.cta}
                    </ArrowLink>
                  ) : null}
                </Reveal>
              </div>
              <Reveal
                inView
                delay={0.16}
                className="lg:col-span-4 lg:col-start-9"
              >
                <p
                  className={cn(
                    "technical-label",
                    isDark ? "text-ivory/40" : "text-steel",
                  )}
                >
                  Scope
                </p>
                <ul
                  className={cn(
                    "mt-6 border-t",
                    isDark ? "border-line-dark" : "border-line",
                  )}
                >
                  {entry.scope.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "border-b py-4 text-[1.05rem]",
                        isDark
                          ? "border-line-dark text-ivory"
                          : "border-line text-carbon",
                      )}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </Section>
      );
    })}
  </>
);
