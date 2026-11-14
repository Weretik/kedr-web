/** Tiles of product photos and the scheme, as wide as the card allows. */
export const productMediaGrid = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
} as const;
