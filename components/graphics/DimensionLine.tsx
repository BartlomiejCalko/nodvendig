"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easing } from "@/lib/motion";

type DimensionLineProps = {
  className?: string;
  label?: string;
  delay?: number;
};

export const DimensionLine = ({
  className,
  label,
  delay = 0,
}: DimensionLineProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn("relative flex h-full w-6 justify-center", className)}
    >
      {label ? (
        <span className="technical-label absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-steel">
          {label}
        </span>
      ) : null}
      <motion.span
        className="absolute top-0 h-px w-3 origin-center bg-carbon/45"
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay, ease: easing.outExpo }}
      />
      <motion.span
        className="h-full w-px origin-top bg-carbon/35"
        initial={prefersReducedMotion ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{
          duration: 1,
          delay: delay + 0.08,
          ease: easing.outExpo,
        }}
      />
      <motion.span
        className="absolute bottom-0 h-px w-3 origin-center bg-carbon/45"
        initial={prefersReducedMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 0.4,
          delay: delay + 0.92,
          ease: easing.outExpo,
        }}
      />
    </div>
  );
};
