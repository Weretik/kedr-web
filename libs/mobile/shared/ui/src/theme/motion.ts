export const kedrMotion = {
  duration: { base: 250, fast: 150, slow: 350 },
  /** Cubic bezier control points for the default "out" easing. */
  easingOut: [0.2, 0.8, 0.2, 1] as const,
  pressScale: 0.97,
  spring: {
    bouncy: { damping: 12, stiffness: 300 },
    snappy: { damping: 18, stiffness: 260 },
  },
} as const;
