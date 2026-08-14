"use client";

import { useState } from "react";
import {
  transformationCopy,
  transformationStages,
} from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TransformationDiagram } from "@/components/graphics/TransformationDiagram";
import { cn } from "@/lib/cn";

export const Transformation = () => {
  const [stage, setStage] = useState(0);
  const activeStage = transformationStages[stage];

  return (
    <Section id="transformation" tone="carbon" className="relative overflow-hidden">
      <Container>
        <SectionLabel tone="dark">{transformationCopy.label}</SectionLabel>
        <h2 className="text-heading-3 mt-4 max-w-[22ch] font-medium text-ivory">
          {transformationCopy.line1} {transformationCopy.line2}
        </h2>

        <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="max-w-[42ch] text-base leading-relaxed text-ivory/65 md:text-[1.05rem]">
              {transformationCopy.body}
            </p>
            <ol className="mt-10" aria-label="Facility conversion stages">
              {transformationStages.map((item, index) => {
                const isActive = index === stage;

                return (
                  <li key={item.index} className="border-t border-line-dark last:border-b">
                    <button
                      type="button"
                      onClick={() => setStage(index)}
                      onMouseEnter={() => setStage(index)}
                      onFocus={() => setStage(index)}
                      className={cn(
                        "flex w-full items-start justify-between gap-6 py-5 text-left transition-colors duration-300 ease-out-expo",
                        isActive ? "text-ivory" : "text-ivory/45 hover:text-ivory",
                      )}
                      aria-pressed={isActive}
                      aria-describedby={`transformation-stage-${item.index}`}
                    >
                      <span className="min-w-0">
                        <span className="block text-[1.15rem] tracking-[-0.02em] md:text-[1.35rem]">
                          {item.title}
                        </span>
                        <span
                          id={`transformation-stage-${item.index}`}
                          className={cn(
                            "mt-2 block max-w-[36ch] text-sm leading-relaxed transition-colors duration-300 ease-out-expo",
                            isActive ? "text-ivory/65" : "text-ivory/30",
                          )}
                        >
                          {item.description}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "technical-label mt-1 shrink-0",
                          isActive ? "text-accent" : "text-ivory/30",
                        )}
                      >
                        {item.index}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="technical-label mb-4 text-ivory/40">
              {transformationCopy.diagramLabel}
            </p>
            <TransformationDiagram stage={stage} tone="dark" />
            {activeStage ? (
              <p className="technical-label mt-5 text-ivory/45">
                <span className="text-accent">{activeStage.index}</span>
                <span className="mx-3 text-ivory/20">/</span>
                {activeStage.title}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
};
