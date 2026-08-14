"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { chapters } from "@/data/homepage";
import { Container } from "@/components/layout/Container";
import { ChapterDiagram } from "@/components/graphics/ChapterDiagram";
import { Reveal } from "@/components/motion/Reveal";
import { easing } from "@/lib/motion";

const stageFromProgress = (value: number): 0 | 1 | 2 => {
  if (value < 0.34) return 0;
  if (value < 0.67) return 1;
  return 2;
};

const ChapterContent = ({
  stage,
  tone,
}: {
  stage: 0 | 1 | 2;
  tone: "dark" | "light";
}) => {
  const chapter = chapters[stage];
  const textClass = tone === "dark" ? "text-ivory" : "text-carbon";
  const mutedClass = tone === "dark" ? "text-ivory/65" : "text-steel";

  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <p className="technical-label text-accent">
          0{stage + 1} / 03
        </p>
        <motion.h2
          key={chapter.id}
          className={`text-display-xl mt-6 font-medium ${textClass}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easing.outExpo }}
        >
          {chapter.title}
        </motion.h2>
        <motion.p
          key={`${chapter.id}-body`}
          className={`mt-8 max-w-[28ch] text-body-lg ${mutedClass}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: easing.outExpo }}
        >
          {chapter.body}
        </motion.p>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <ChapterDiagram stage={stage} />
      </div>
    </div>
  );
};

const ChaptersStatic = () => (
  <div className="space-y-24">
    {chapters.map((chapter, index) => (
      <Reveal key={chapter.id} inView>
        <p className="technical-label text-accent">0{index + 1} / 03</p>
        <h2 className="text-display-l mt-5 font-medium text-ivory">
          {chapter.title}
        </h2>
        <p className="mt-6 max-w-[28ch] text-body-lg text-ivory/70">
          {chapter.body}
        </p>
        <div className="mt-10">
          <ChapterDiagram stage={index as 0 | 1 | 2} />
        </div>
      </Reveal>
    ))}
  </div>
);

export const Chapters = () => {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = stageFromProgress(value);
    setStage((current) => (current === next ? current : next));
  });

  return (
    <section id="chapters" data-tone="graphite" className="bg-graphite text-ivory">
      <div className="lg:hidden">
        <div className="section-y">
          <Container>
            <ChaptersStatic />
          </Container>
        </div>
      </div>

      {prefersReducedMotion ? (
        <div className="hidden lg:block">
          <div className="section-y">
            <Container>
              <ChaptersStatic />
            </Container>
          </div>
        </div>
      ) : (
        <div ref={trackRef} className="hidden h-[300vh] lg:block">
          <div className="sticky top-0 flex h-svh items-center">
            <Container className="w-full">
              <ChapterContent stage={stage} tone="dark" />
            </Container>
          </div>
        </div>
      )}
    </section>
  );
};
