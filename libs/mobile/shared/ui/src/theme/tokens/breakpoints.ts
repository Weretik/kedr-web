/** `phone` < 600 dp, `tablet` 600–1023 dp, `wide` ≥ 1024 dp. */
export const breakpoints = { phone: 0, tablet: 600, wide: 1024 } as const;

export type Breakpoint = keyof typeof breakpoints;

export const breakpointFor = (width: number): Breakpoint =>
  width >= breakpoints.wide ? 'wide' : width >= breakpoints.tablet ? 'tablet' : 'phone';
