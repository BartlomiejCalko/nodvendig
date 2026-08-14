"use client";

import { motion, useReducedMotion } from "motion/react";

const COLS = 5;
const ROWS = 4;
const CYCLE = 12;
const FADE_START = 8.6;
const FADE_END = 10.2;

const VB = { w: 820, h: 400 };
const FRAME = { x: 24, y: 28, w: 772, h: 344 };
const WALL = 5;

const colX = (index: number) =>
  FRAME.x + (index / (COLS - 1)) * FRAME.w;
const rowY = (index: number) =>
  FRAME.y + (index / (ROWS - 1)) * FRAME.h;

const rectPath = (x: number, y: number, w: number, h: number) =>
  `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;

const linePath = (x1: number, y1: number, x2: number, y2: number) =>
  `M ${x1} ${y1} L ${x2} ${y2}`;

const loop = {
  duration: CYCLE,
  repeat: Infinity,
  ease: "linear" as const,
};

const drawTransition = (start: number, draw: number) => ({
  ...loop,
  times: [
    0,
    start / CYCLE,
    (start + draw) / CYCLE,
    FADE_START / CYCLE,
    FADE_END / CYCLE,
    1,
  ],
});

const DrawPath = ({
  d,
  start,
  draw,
  opacity = 0.32,
  reduced,
}: {
  d: string;
  start: number;
  draw: number;
  opacity?: number;
  reduced: boolean;
}) => (
  <motion.path
    d={d}
    fill="none"
    stroke={`rgba(242,239,231,${opacity})`}
    strokeWidth="1.25"
    strokeLinecap="square"
    strokeLinejoin="miter"
    initial={reduced ? false : { pathLength: 0, opacity: 0 }}
    animate={
      reduced
        ? { pathLength: 1, opacity: 1 }
        : {
            pathLength: [0, 0, 1, 1, 1, 0],
            opacity: [0, 0, 1, 1, 0, 0],
          }
    }
    transition={reduced ? undefined : drawTransition(start, draw)}
  />
);

const Node = ({
  x,
  y,
  accent = false,
}: {
  x: number;
  y: number;
  accent?: boolean;
}) => {
  const stroke = accent ? "#FF6747" : "rgba(242,239,231,0.5)";
  const outer = 12;
  const inner = 7;

  return (
    <g>
      <rect
        x={x - outer / 2}
        y={y - outer / 2}
        width={outer}
        height={outer}
        fill="#1C1C1A"
        stroke={stroke}
        strokeWidth="1.25"
      />
      <rect
        x={x - inner / 2}
        y={y - inner / 2}
        width={inner}
        height={inner}
        fill="none"
        stroke={stroke}
        strokeWidth="1.25"
      />
    </g>
  );
};

export const FacilityPlan = () => {
  const reduced = useReducedMotion() === true;
  const bayH = FRAME.h * 0.15;
  const bayGap = 14;
  const bayW = FRAME.w / (COLS - 1) - bayGap * 2;
  const shaftW = FRAME.w * 0.068;
  const shaftH = FRAME.h * 0.22;
  const shaftY = rowY(1) + (rowY(2) - rowY(1) - shaftH) / 2;

  const interiorNodes = Array.from({ length: ROWS }).flatMap((_, row) =>
    Array.from({ length: COLS }).flatMap((__, col) => {
      const accent =
        (row === 0 || row === ROWS - 1) &&
        (col === 0 || col === COLS - 1);
      if (accent) return [];
      return [{ row, col, x: colX(col), y: rowY(row) }];
    }),
  );

  return (
    <div aria-hidden="true" className="relative w-full py-1">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="h-auto w-full overflow-visible"
        fill="none"
      >
        <DrawPath
          d={rectPath(FRAME.x - WALL, FRAME.y - WALL, FRAME.w + WALL * 2, FRAME.h + WALL * 2)}
          start={0.05}
          draw={1.5}
          opacity={0.28}
          reduced={reduced}
        />
        <DrawPath
          d={rectPath(FRAME.x, FRAME.y, FRAME.w, FRAME.h)}
          start={0.35}
          draw={1.5}
          opacity={0.38}
          reduced={reduced}
        />

        {Array.from({ length: COLS }).flatMap((_, col) =>
          col === 0 || col === COLS - 1
            ? []
            : Array.from({ length: ROWS - 1 }).map((__, row) => (
                <DrawPath
                  key={`v-${col}-${row}`}
                  d={linePath(colX(col), rowY(row), colX(col), rowY(row + 1))}
                  start={1.6 + col * 0.12 + row * 0.06}
                  draw={0.75}
                  opacity={0.3}
                  reduced={reduced}
                />
              )),
        )}

        {Array.from({ length: ROWS }).flatMap((_, row) =>
          row === 0 || row === ROWS - 1
            ? []
            : Array.from({ length: COLS - 1 }).map((__, col) => (
                <DrawPath
                  key={`h-${row}-${col}`}
                  d={linePath(colX(col), rowY(row), colX(col + 1), rowY(row))}
                  start={1.9 + row * 0.1 + col * 0.06}
                  draw={0.75}
                  opacity={0.3}
                  reduced={reduced}
                />
              )),
        )}

        {Array.from({ length: COLS - 1 }).map((_, index) => (
          <DrawPath
            key={`bay-top-${index}`}
            d={rectPath(colX(index) + bayGap, FRAME.y + 8, bayW, bayH)}
            start={3.4 + index * 0.12}
            draw={0.85}
            opacity={0.26}
            reduced={reduced}
          />
        ))}
        {Array.from({ length: COLS - 1 }).map((_, index) => (
          <DrawPath
            key={`bay-bottom-${index}`}
            d={rectPath(
              colX(index) + bayGap,
              FRAME.y + FRAME.h - 8 - bayH,
              bayW,
              bayH,
            )}
            start={3.6 + index * 0.12}
            draw={0.85}
            opacity={0.26}
            reduced={reduced}
          />
        ))}

        <DrawPath
          d={rectPath(FRAME.x + 10, shaftY, shaftW, shaftH)}
          start={4.3}
          draw={0.8}
          opacity={0.28}
          reduced={reduced}
        />
        <DrawPath
          d={linePath(FRAME.x + 10, shaftY, FRAME.x + 10 + shaftW, shaftY + shaftH)}
          start={4.55}
          draw={0.55}
          opacity={0.32}
          reduced={reduced}
        />
        <DrawPath
          d={linePath(FRAME.x + 10 + shaftW, shaftY, FRAME.x + 10, shaftY + shaftH)}
          start={4.7}
          draw={0.55}
          opacity={0.32}
          reduced={reduced}
        />

        <DrawPath
          d={rectPath(FRAME.x + FRAME.w - 10 - shaftW, shaftY, shaftW, shaftH)}
          start={4.4}
          draw={0.8}
          opacity={0.28}
          reduced={reduced}
        />
        <DrawPath
          d={linePath(
            FRAME.x + FRAME.w - 10 - shaftW,
            shaftY,
            FRAME.x + FRAME.w - 10,
            shaftY + shaftH,
          )}
          start={4.65}
          draw={0.55}
          opacity={0.32}
          reduced={reduced}
        />
        <DrawPath
          d={linePath(
            FRAME.x + FRAME.w - 10,
            shaftY,
            FRAME.x + FRAME.w - 10 - shaftW,
            shaftY + shaftH,
          )}
          start={4.8}
          draw={0.55}
          opacity={0.32}
          reduced={reduced}
        />

        {interiorNodes.map((node, index) => (
          <motion.g
            key={`node-${node.row}-${node.col}`}
            initial={reduced ? false : { opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: [0, 0, 1, 1, 0, 0] }
            }
            transition={
              reduced
                ? undefined
                : drawTransition(5.3 + index * 0.05, 0.25)
            }
          >
            <Node x={node.x} y={node.y} />
          </motion.g>
        ))}

        <Node x={colX(0)} y={rowY(0)} accent />
        <Node x={colX(COLS - 1)} y={rowY(0)} accent />
        <Node x={colX(0)} y={rowY(ROWS - 1)} accent />
        <Node x={colX(COLS - 1)} y={rowY(ROWS - 1)} accent />
      </svg>
    </div>
  );
};
