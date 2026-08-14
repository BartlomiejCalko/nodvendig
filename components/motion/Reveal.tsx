"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, easing } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
};

export const Reveal = ({
  children,
  className,
  delay = 0,
  inView = false,
}: RevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const hidden = prefersReducedMotion ? false : { opacity: 0, y: 16 };
  const visible = { opacity: 1, y: 0 };
  const transition = {
    duration: duration.editorial,
    delay,
    ease: easing.outExpo,
  };

  if (inView) {
    return (
      <motion.div
        data-reveal
        className={className}
        initial={hidden}
        whileInView={visible}
        viewport={{ once: true, amount: 0.24, margin: "-8% 0px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      data-reveal
      className={className}
      initial={hidden}
      animate={visible}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};
