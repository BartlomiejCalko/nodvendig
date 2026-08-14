import facilityImage from "@/assets/images/facility.png";
import { projects } from "@/data/projects";
import { tydalCopy } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ProjectMetadata } from "@/components/ui/ProjectMetadata";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GraphicFrame } from "@/components/graphics/GraphicFrame";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

export const Tydal = () => {
  const project = projects[0];

  return (
    <Section id="tydal" tone="ivory">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-6">
            <Reveal inView>
              <SectionLabel>{tydalCopy.label}</SectionLabel>
            </Reveal>
            <h2 className="text-display-l mt-10 font-medium">
              <SplitTextReveal inView>{tydalCopy.line1}</SplitTextReveal>
              <SplitTextReveal inView delay={0.1}>
                {tydalCopy.line2}
              </SplitTextReveal>
            </h2>
            <Reveal inView delay={0.16} className="mt-8 space-y-6">
              <ProjectMetadata
                items={[
                  project.location.toUpperCase(),
                  project.yearLabel,
                  project.type.toUpperCase(),
                ]}
              />
              <p className="max-w-[38ch] text-base leading-relaxed text-steel md:text-[1.05rem]">
                {project.description}
              </p>
              <ArrowLink href={`/projects/${project.slug}`}>
                {tydalCopy.cta}
              </ArrowLink>
            </Reveal>
          </div>
          <Reveal inView delay={0.12} className="lg:col-span-5 lg:col-start-8">
            <GraphicFrame
              label={`${project.name.toUpperCase()} / ${project.yearLabel}`}
              ratio="4 / 3"
              image={facilityImage}
              alt="Data center facility conversion in Tydal, Norway"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
};
