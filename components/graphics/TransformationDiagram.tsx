"use client";

import { motion } from "motion/react";
import { transformationStages } from "@/data/homepage";
import { easing } from "@/lib/motion";

type TransformationDiagramProps = {
  stage: number;
  tone?: "light" | "dark";
};

export const TransformationDiagram = ({
  stage,
  tone = "light",
}: TransformationDiagramProps) => {
  const wallsRemoved = stage >= 1;
  const rebuilt = stage >= 2;
  const infrastructure = stage >= 3;
  const ready = stage >= 4;
  const line = tone === "dark" ? "rgba(242,239,231,0.24)" : "rgba(28,28,26,0.16)";
  const strong = tone === "dark" ? "rgba(242,239,231,0.7)" : "rgba(28,28,26,0.55)";
  const muted = tone === "dark" ? "rgba(242,239,231,0.45)" : "#706F69";

  return (
    <svg
      viewBox="0 0 640 400"
      className="h-auto w-full"
      aria-hidden="true"
    >
      <rect x="56" y="48" width="528" height="304" fill="none" stroke={line} />

      <motion.rect
        x="96"
        y="88"
        width="320"
        height="224"
        fill="none"
        stroke={strong}
        strokeDasharray={wallsRemoved && !rebuilt ? "8 7" : undefined}
        animate={{ opacity: wallsRemoved && !rebuilt ? 0.35 : 1 }}
        transition={{ duration: 0.7, ease: easing.outExpo }}
      />

      <motion.line
        x1="176"
        y1="88"
        x2="176"
        y2="312"
        stroke={line}
        animate={{ opacity: wallsRemoved ? 0 : 1 }}
        transition={{ duration: 0.6, ease: easing.outExpo }}
      />
      <motion.line
        x1="256"
        y1="88"
        x2="256"
        y2="312"
        stroke={line}
        animate={{ opacity: wallsRemoved ? 0 : 1 }}
        transition={{ duration: 0.6, ease: easing.outExpo }}
      />

      <motion.rect
        x="112"
        y="108"
        width="288"
        height="184"
        fill="none"
        stroke={tone === "dark" ? "#F2EFE7" : "#1C1C1A"}
        animate={{ opacity: rebuilt ? 1 : 0 }}
        transition={{ duration: 0.7, ease: easing.outExpo }}
      />

      <motion.g
        animate={{ opacity: infrastructure ? 1 : 0 }}
        transition={{ duration: 0.7, ease: easing.outExpo }}
      >
        <rect
          x="432"
          y="88"
          width="112"
          height="224"
          fill="none"
          stroke={strong}
        />
        {[0, 1, 2, 3].map((index) => (
          <line
            key={index}
            x1="448"
            y1={120 + index * 44}
            x2="528"
            y2={120 + index * 44}
            stroke={line}
          />
        ))}
        <text x="444" y="80" fill={muted} fontSize="10" letterSpacing="0.08em">
          TECHNICAL
        </text>
      </motion.g>

      <motion.g
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.7, ease: easing.outExpo }}
      >
        <circle cx="160" cy="200" r="4" fill="#FF6747" />
        <circle cx="256" cy="200" r="4" fill="#FF6747" />
        <circle cx="352" cy="200" r="4" fill="#FF6747" />
        <line x1="160" y1="200" x2="352" y2="200" stroke="#FF6747" />
      </motion.g>

      <text x="96" y="76" fill={muted} fontSize="10" letterSpacing="0.08em">
        {transformationStages[stage]?.title}
      </text>
    </svg>
  );
};
