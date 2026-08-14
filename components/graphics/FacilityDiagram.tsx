"use client";

import { motion, useReducedMotion } from "motion/react";
import { capabilities, type Capability } from "@/data/homepage";
import { cn } from "@/lib/cn";
import { duration, easing } from "@/lib/motion";

type FacilityDiagramProps = {
  activeId: Capability["id"];
  onChange: (id: Capability["id"]) => void;
};

const zones: Array<{
  id: Capability["id"];
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}> = [
  { id: "construction", label: "STRUCTURE", x: 72, y: 64, width: 368, height: 248 },
  { id: "conversion", label: "HALL", x: 92, y: 88, width: 220, height: 200 },
  { id: "structural", label: "GRID", x: 328, y: 88, width: 92, height: 200 },
  { id: "execution", label: "SITE", x: 456, y: 64, width: 88, height: 248 },
];

export const FacilityDiagram = ({
  activeId,
  onChange,
}: FacilityDiagramProps) => {
  const prefersReducedMotion = useReducedMotion();
  const activeCapability = capabilities.find((item) => item.id === activeId);

  return (
    <div className="relative">
      <svg
        viewBox="0 0 640 400"
        className="h-auto w-full"
        role="img"
        aria-label="Technical plan of a data center facility with construction zones"
      >
        <motion.rect
          x="40"
          y="36"
          width="560"
          height="328"
          fill="none"
          stroke="rgba(242,239,231,0.12)"
          strokeWidth="1"
          strokeDasharray="6 6"
          initial={prefersReducedMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: duration.large, ease: easing.outExpo }}
        />

        {zones.map((zone) => {
          const isActive = zone.id === activeId;
          const isGrid = zone.id === "structural";

          return (
            <g key={zone.id}>
              <motion.rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill={isActive ? "rgba(255,103,71,0.08)" : "transparent"}
                stroke={
                  isActive ? "#FF6747" : "rgba(242,239,231,0.24)"
                }
                strokeWidth="1"
                pointerEvents={zone.id === "construction" ? "stroke" : "auto"}
                className="cursor-pointer"
                onClick={() => onChange(zone.id)}
                initial={prefersReducedMotion ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.1,
                  delay: 0.12,
                  ease: easing.outExpo,
                }}
              />
              {isGrid
                ? [0, 1].map((column) => (
                    <line
                      key={column}
                      x1={348 + column * 28}
                      y1="88"
                      x2={348 + column * 28}
                      y2="288"
                      stroke={
                        isActive
                          ? "rgba(255,103,71,0.45)"
                          : "rgba(242,239,231,0.12)"
                      }
                      strokeWidth="1"
                    />
                  ))
                : null}
            </g>
          );
        })}

        <circle
          cx="72"
          cy="64"
          r="3"
          fill={activeId === "construction" ? "#FF6747" : "rgba(242,239,231,0.4)"}
        />
        <circle
          cx="544"
          cy="312"
          r="3"
          fill={activeId === "execution" ? "#FF6747" : "rgba(242,239,231,0.4)"}
        />

        <text
          x="80"
          y="56"
          className="technical-label"
          fill="rgba(242,239,231,0.55)"
          fontSize="10"
          letterSpacing="0.08em"
        >
          {activeCapability?.zone ?? "STRUCTURE"}
        </text>
        <text
          x="456"
          y="56"
          className="technical-label"
          fill="rgba(242,239,231,0.55)"
          fontSize="10"
          letterSpacing="0.08em"
        >
          ACCESS
        </text>
      </svg>
    </div>
  );
};

type CapabilityListProps = {
  activeId: Capability["id"];
  onChange: (id: Capability["id"]) => void;
  className?: string;
};

export const CapabilityList = ({
  activeId,
  onChange,
  className,
}: CapabilityListProps) => (
  <ul className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className)}>
    {capabilities.map((item) => {
      const isActive = item.id === activeId;

      return (
        <li key={item.id} className="border-t border-line-dark">
          <button
            type="button"
            onClick={() => onChange(item.id)}
            onMouseEnter={() => onChange(item.id)}
            onFocus={() => onChange(item.id)}
            className={cn(
              "flex w-full flex-col items-start gap-3 py-5 text-left transition-colors duration-300 ease-out-expo",
              isActive ? "text-ivory" : "text-ivory/55 hover:text-ivory",
            )}
            aria-pressed={isActive}
          >
            <span
              className={cn(
                "technical-label",
                isActive ? "text-accent" : "text-ivory/35",
              )}
            >
              {item.index}
            </span>
            <span className="text-[1.05rem] tracking-[-0.02em]">
              {item.title}
            </span>
            <span
              className={cn(
                "max-w-[28ch] text-[0.8125rem] leading-relaxed",
                isActive ? "text-ivory/70" : "text-ivory/40",
              )}
            >
              {item.description}
            </span>
          </button>
        </li>
      );
    })}
  </ul>
);
