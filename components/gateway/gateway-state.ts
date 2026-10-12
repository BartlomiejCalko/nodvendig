export type Division = "construction" | "telecom";

/**
 * Mutable animation state shared between the GSAP timeline (writer) and the
 * WebGL scene / HTML overlay (readers). Kept outside React on purpose so the
 * 60fps animation never triggers re-renders.
 */
export const gatewayState = {
  /** 0..1 — grid fade in. */
  grid: 0,
  /** 0..1 — CAD line drawing progress. */
  draw: 0,
  /** 0..1 — plan labels. */
  labels: 0,
  /** 0..4 — camera keyframe position (plan → 3D → assembly → hero). */
  camera: 0,
  /** 0..1 — walls rise from the plan. */
  extrude: 0,
  /** 0..1 — racks drop in. */
  racks: 0,
  /** 0..1 — cable trays assemble. */
  trays: 0,
  /** 0..1 — fibre is routed. */
  cables: 0,
  /** 0..1 — light pulses through the fibre. */
  pulses: 0,
  /** 0..1 — CAD drawing fades once the solid model is in place. */
  planFade: 0,
  /** 0..1 — final hero state, the division choice is visible. */
  outro: 0,
  /** Division the pointer is over (drives scene emphasis). */
  hover: null as Division | null,
  /** 0..1 — exit transition into the chosen division. */
  exit: 0,
  exitTo: null as Division | null,
};

export type GatewayState = typeof gatewayState;
