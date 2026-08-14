"use client";

import { useState } from "react";
import {
  transformationCopy,
  transformationStages,
} from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { TransformationDiagram } from "@/components/graphics/TransformationDiagram";
import { Reveal } from "@/components/motion/Reveal";
import { SplitTextReveal } from "@/components/motion/SplitTextReveal";
import { cn } from "@/lib/cn";

export const Transformation = () => {
  const [stage, setStage] = useState(0);

  return (
    <Section id="transformation" tone="carbon" className="relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-display-l max-w-[12ch] font-medium text-ivory">
              <SplitTextReveal inView>
                {transformationCopy.line1}
              </SplitTextReveal>
              <SplitTextReveal inView delay={0.1}>
                {transformationCopy.line2}
              </SplitTextReveal>
            </h2>
            <Reveal inView delay={0.16} className="mt-12">
              <ol>
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
                          "flex w-full items-baseline justify-between gap-6 py-5 text-left transition-colors duration-300 ease-out-expo",
                          isActive ? "text-ivory" : "text-ivory/45 hover:text-ivory",
                        )}
                        aria-pressed={isActive}
                      >
                        <span className="text-[1.15rem] tracking-[-0.02em] md:text-[1.35rem]">
                          {item.title}
                        </span>
                        <span
                          className={cn(
                            "technical-label",
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
            </Reveal>
          </div>
          <Reveal inView className="flex items-center lg:col-span-6 lg:col-start-7">
            <TransformationDiagram stage={stage} tone="dark" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
};
