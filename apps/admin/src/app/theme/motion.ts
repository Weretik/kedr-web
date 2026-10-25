/**
 * Motion tokens. Animate only opacity, transform, and colors; keep durations short.
 * `prefers-reduced-motion` is honored globally in `components.ts` (MuiCssBaseline).
 */
export const adminMotion = {
  duration: { fast: 150, base: 250, slow: 350 },
  easing: {
    /** Default for entering and expanding elements. */
    out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    /** Elements leaving the screen. */
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;
