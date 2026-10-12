/**
 * Shared, mutable scroll state for the Telecom experience. GSAP ScrollTrigger
 * writes `progress`; the WebGL scene and the HTML overlays read it every frame.
 */
export const telecomScroll = {
  /** Smoothed master timeline progress, 0..1. */
  progress: 0,
  /** Normalised scroll velocity, used for motion streaks. */
  velocity: 0,
  /** Reduced-motion preference mirrored from the DOM. */
  reducedMotion: false,
};

/** Key moments of the master timeline (scroll progress). */
export const MOMENTS = {
  /** Camera enters the fibre core — room world hands over to space. */
  handover: 0.166,
  whiteoutIn: [0.148, 0.166] as const,
  whiteoutOut: [0.166, 0.19] as const,
  tunnelEnd: 0.285,
  ideaPart: [0.325, 0.36] as const,
  buildPart: [0.54, 0.565] as const,
  deliverPart: [0.772, 0.797] as const,
  converge: [0.88, 0.965] as const,
};

/** World anchors along the space track (z axis, camera travels towards -z). */
export const WORLD = {
  tunnelLength: 262,
  idea: -360,
  build: -600,
  deliver: -860,
  core: -1090,
} as const;
