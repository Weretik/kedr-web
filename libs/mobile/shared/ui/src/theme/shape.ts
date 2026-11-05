export const radius = { sm: 8, md: 12, lg: 14, xl: 18, pill: 999 } as const;

/** 4-point grid. Side padding is `lg`, the gap between rows is `sm`. */
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 28 } as const;

export const sizes = {
  border: 1,
  button: 48,
  calculationPanel: 360,
  field: 48,
  iconButton: 44,
  rail: 76,
  stepper: 36,
  /** Minimum size of every pressable. */
  touch: 44,
} as const;
