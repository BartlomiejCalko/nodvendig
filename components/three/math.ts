export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const lerp = (from: number, to: number, t: number) =>
  from + (to - from) * t;

/** Maps value from [start, end] to [0, 1], clamped. */
export const range = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start));

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const easeInCubic = (t: number) => t * t * t;

/** Frame-rate independent damping factor. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** Deterministic pseudo random generator (mulberry32). */
export const createRandom = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
