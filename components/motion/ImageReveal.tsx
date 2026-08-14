"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easing } from "@/lib/motion";

type ImageRevealProps = {
  src: string | StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
};

export const ImageReveal = ({
  src,
  alt,
  sizes,
  className,
  ratio = "4 / 3",
  priority = false,
}: ImageRevealProps) => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReveal = prefersReducedMotion || isInView;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: ratio }}
    >
      <motion.div
        className="absolute inset-0 origin-center"
        initial={prefersReducedMotion ? false : { y: "100%" }}
        animate={shouldReveal ? { y: "0%" } : { y: "100%" }}
        transition={{ duration: 1, ease: easing.outExpo }}
      >
        <motion.div
          className="absolute inset-0"
          initial={prefersReducedMotion ? false : { scale: 1.06 }}
          animate={shouldReveal ? { scale: 1 } : { scale: 1.06 }}
          transition={{ duration: 1.2, ease: easing.outExpo }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover saturate-[0.92]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
