"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  experienceCopy,
  experienceEntries,
  type ExperienceEntry,
} from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { cn } from "@/lib/cn";

const hasHoverPointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const Experience = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleListLeave = () => {
    if (hasHoverPointer()) {
      setActiveIndex(null);
    }
  };

  const handleRowClick = (index: number) => {
    if (hasHoverPointer()) {
      return;
    }

    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
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
        <ul
          className="mt-16 border-t border-line"
          onMouseLeave={handleListLeave}
        >
          {experienceEntries.map((entry, index) => (
            <ExperienceRow
              key={entry.title}
              entry={entry}
              index={index}
              isActive={activeIndex === index}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
              onEnter={() => handleEnter(index)}
              onClick={() => handleRowClick(index)}
            />
          ))}
        </ul>
      </Container>
    </Section>
  );
};

type ExperienceRowProps = {
  entry: ExperienceEntry;
  index: number;
  isActive: boolean;
  prefersReducedMotion: boolean;
  onEnter: () => void;
  onClick: () => void;
};

const ExperienceRow = ({
  entry,
  index,
  isActive,
  prefersReducedMotion,
  onEnter,
  onClick,
}: ExperienceRowProps) => {
  const isOngoing = entry.status === "ongoing";
  const detailsId = `experience-detail-${index}`;

  return (
    <li
      className={cn(
        "border-b transition-colors duration-500 ease-out-expo",
        isActive ? "border-line-dark bg-carbon" : "border-line",
      )}
      onMouseEnter={onEnter}
    >
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        aria-expanded={isActive}
        aria-controls={detailsId}
        onClick={onClick}
        onFocus={onEnter}
      >
        <div className="grid grid-cols-1 gap-3 px-6 py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:px-8">
          <p
            className={cn(
              "technical-label md:col-span-1",
              isOngoing ? "text-accent" : isActive ? "text-ivory/40" : "text-steel",
            )}
          >
            0{index + 1}
          </p>
          <div className="md:col-span-6">
            <p
              className={cn(
                "text-heading-3 font-medium",
                isOngoing
                  ? "text-accent"
                  : isActive
                    ? "text-ivory"
                    : "text-carbon",
              )}
            >
              {entry.title}
            </p>
            {isOngoing ? (
              <p className="technical-label mt-2 text-accent">Ongoing</p>
            ) : null}
          </div>
          <p
            className={cn(
              "md:col-span-3",
              isActive ? "text-ivory/70" : "text-steel",
            )}
          >
            {entry.location}
          </p>
          <p
            className={cn(
              "technical-label md:col-span-2 md:text-right",
              isActive ? "text-ivory/45" : "text-steel",
            )}
          >
            {entry.type}
          </p>
        </div>
      </button>
      <div
        id={detailsId}
        className={cn(
          "grid",
          prefersReducedMotion
            ? isActive
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
            : cn(
                "transition-[grid-template-rows] duration-500 ease-out-expo",
                isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ),
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-6 pb-8 md:px-8">
            <div className="grid grid-cols-1 gap-8 border-t border-line-dark pt-6 md:grid-cols-12 md:gap-8">
              <p className="max-w-[46ch] text-base leading-relaxed text-ivory/75 md:col-span-6 md:col-start-2 md:text-[1.05rem]">
                {entry.summary}
              </p>
              <dl className="grid grid-cols-2 gap-6 md:col-span-4 md:col-start-9">
                <div>
                  <dt className="technical-label text-ivory/40">Location</dt>
                  <dd className="mt-2 text-sm text-ivory">{entry.location}</dd>
                </div>
                <div>
                  <dt className="technical-label text-ivory/40">Work</dt>
                  <dd className="mt-2 text-sm text-ivory">{entry.type}</dd>
                </div>
                {entry.yearLabel ? (
                  <div>
                    <dt className="technical-label text-ivory/40">Status</dt>
                    <dd className="mt-2 text-sm text-accent">{entry.yearLabel}</dd>
                  </div>
                ) : null}
              </dl>
              {entry.href ? (
                <div className="md:col-span-6 md:col-start-2">
                  <ArrowLink href={entry.href} className="text-ivory">
                    Explore project
                  </ArrowLink>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
