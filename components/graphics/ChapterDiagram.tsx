"use client";

import { motion, useReducedMotion } from "motion/react";
import { easing } from "@/lib/motion";

type ChapterDiagramProps = {
  stage: 0 | 1 | 2;
};

export const ChapterDiagram = ({ stage }: ChapterDiagramProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 640 420"
      className="h-auto w-full"
      aria-hidden="true"
    >
      <rect
        x="48"
        y="40"
        width="544"
        height="340"
        fill="none"
        stroke="rgba(242,239,231,0.12)"
        strokeDasharray="5 5"
      />

      <motion.rect
        x="88"
        y="72"
        width="360"
        height="260"
        fill="none"
        stroke="rgba(242,239,231,0.28)"
        strokeWidth="1.25"
        initial={false}
        animate={{
          pathLength: prefersReducedMotion || stage >= 0 ? 1 : 0,
        }}
        transition={{ duration: 0.9, ease: easing.outExpo }}
      />

      {[0, 1, 2, 3].map((column) => (
        <motion.line
          key={`col-${column}`}
          x1={124 + column * 80}
          y1="72"
          x2={124 + column * 80}
          y2="332"
          stroke="rgba(242,239,231,0.14)"
          initial={false}
          animate={{ opacity: stage >= 0 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.05 * column, ease: easing.outExpo }}
        />
      ))}

      <motion.rect
        x="108"
        y="96"
        width="200"
        height="212"
        fill={stage >= 1 ? "rgba(255,103,71,0.06)" : "transparent"}
        stroke={stage >= 1 ? "#FF6747" : "rgba(242,239,231,0.2)"}
        strokeDasharray={stage === 1 ? "7 6" : undefined}
        initial={false}
        animate={{ opacity: stage >= 1 ? 1 : 0.35 }}
        transition={{ duration: 0.7, ease: easing.outExpo }}
      />

      <motion.rect
        x="324"
        y="96"
        width="100"
        height="212"
        fill="none"
        stroke="rgba(242,239,231,0.22)"
        initial={false}
        animate={{
          opacity: stage >= 1 ? 1 : 0,
          x: stage >= 1 ? 0 : 12,
        }}
        transition={{ duration: 0.7, ease: easing.outExpo }}
      />

      <motion.g
        initial={false}
        animate={{ opacity: stage === 2 ? 1 : 0 }}
        transition={{ duration: 0.7, ease: easing.outExpo }}
      >
        {[0, 1, 2].map((index) => (
          <circle
            key={index}
            cx={140 + index * 70}
            cy="202"
            r="4"
            fill="#FF6747"
          />
        ))}
        <line
          x1="140"
          y1="202"
          x2="280"
          y2="202"
          stroke="#FF6747"
          strokeWidth="1"
        />
        <rect
          x="468"
          y="72"
          width="88"
          height="260"
          fill="none"
          stroke="rgba(242,239,231,0.28)"
        />
        <text
          x="480"
          y="96"
          fill="rgba(242,239,231,0.5)"
          fontSize="10"
          letterSpacing="0.08em"
        >
          SITE
        </text>
      </motion.g>
    </svg>
  );
};
