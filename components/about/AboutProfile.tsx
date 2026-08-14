import { aboutProfile } from "@/data/about";
import { company, contact } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";

const profileFacts = [
  { label: "Legal name", value: company.legalName },
  { label: "Address", value: `${contact.address.line1}, ${contact.address.line2}` },
  { label: "Org.nr", value: contact.orgNr },
] as const;

export const AboutProfile = () => (
  <Section id="about-profile" tone="paper">
    <Container>
      <Reveal inView>
        <SectionLabel>{aboutProfile.label}</SectionLabel>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-display-l max-w-[12ch] font-medium">
            <SplitTextReveal inView>{aboutProfile.line1}</SplitTextReveal>
            <SplitTextReveal inView delay={0.1}>
              {aboutProfile.line2}
            </SplitTextReveal>
          </h2>
          <Reveal inView delay={0.16} className="mt-8 space-y-6">
            {aboutProfile.body.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-[46ch] text-base leading-relaxed text-steel md:text-[1.05rem]"
              >
                {paragraph}
              </p>
            ))}
            <ArrowLink href={aboutProfile.tydalHref}>
              {aboutProfile.tydalCta}
            </ArrowLink>
          </Reveal>
        </div>
        <Reveal
          inView
          delay={0.2}
          className="flex flex-col justify-end lg:col-span-4 lg:col-start-9"
        >
          <dl className="border-t border-line">
            {profileFacts.map((fact) => (
              <div
                key={fact.label}
                className="border-b border-line py-5"
              >
                <dt className="technical-label text-steel">{fact.label}</dt>
                <dd className="mt-2 text-[1.05rem] text-carbon">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Container>
  </Section>
);
