export const easing = {
  outExpo: [0.22, 1, 0.36, 1] as const,
  outQuart: [0.16, 1, 0.3, 1] as const,
};

export const duration = {
  fast: 0.22,
  ui: 0.35,
  editorial: 0.85,
  large: 1.1,
};

export const heroSequence = {
  wordmark: 0,
  navigation: 0.16,
  frame: 0.08,
  line1: 0.38,
  line2: 0.58,
  copy: 0.88,
  cta: 1.08,
  marker: 1.22,
} as const;
