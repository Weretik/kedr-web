export const kedrRadius = { lg: 22, md: 16, pill: 999, sm: 12, xl: 30 } as const;

export const kedrSpace = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

export const kedrLayout = {
  /** Gap between product tiles and list rows. */
  itemGap: 10,
  /** Height of the floating pill navigation without the safe-area inset. */
  navHeight: 58,
  /** Distance of the pill navigation from the screen edges. */
  navInset: 16,
  screenPadding: 16,
  touchTarget: 44,
} as const;
