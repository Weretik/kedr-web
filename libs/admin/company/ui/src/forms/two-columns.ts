/** Two equal columns from the md breakpoint, one column on phones. */
export const twoColumns = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
} as const;
