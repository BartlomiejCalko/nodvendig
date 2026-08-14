"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { duration, easing } from "@/lib/motion";

type SplitTextRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
};

export const SplitTextReveal = ({
  children,
  className,
  delay = 0,
  inView = false,
}: SplitTextRevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const hidden = prefersReducedMotion ? false : { y: "110%" };
  const visible = { y: "0%" };
  const transition = {
    duration: duration.large,
    delay,
    ease: easing.outExpo,
  };

  const inner = inView ? (
    <motion.span
      data-reveal
      className="block"
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, amount: 0.4 }}
      transition={transition}
    >
      {children}
    </motion.span>
  ) : (
    <motion.span
      data-reveal
      className="block"
      initial={hidden}
      animate={visible}
      transition={transition}
    >
      {children}
    </motion.span>
  );

  return (
    <span className={cn("block overflow-hidden", className)}>{inner}</span>
  );
};
