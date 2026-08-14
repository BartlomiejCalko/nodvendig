"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

type SmoothScrollProps = {
  children: React.ReactNode;
};

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return children;
  }

  return (
    <ReactLenis root options={{ lerp: 0.12, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
};
