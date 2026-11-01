import { CATALOG_ROOTS } from '@site/catalog/model';

/**
 * Photos of the main sections, by stable category ID (the 1C import keeps these manual group IDs).
 * A section without a photo gets a neutral panel with an icon.
 */
export const CATEGORY_IMAGES: Readonly<Record<number, string>> = {
  900001: '/assets/categories/hinges.jpg',
  900002: '/assets/categories/locks.jpg',
  900003: '/assets/categories/handles.jpg',
  900004: '/assets/categories/cylinders.jpg',
  900005: '/assets/categories/interior-mechanisms.jpg',
  900006: '/assets/categories/other.jpg',
  910001: '/assets/categories/entrance-doors.png',
  910002: '/assets/categories/interior-doors.png',
  [CATALOG_ROOTS.doorsId]: '/assets/categories/entrance-doors.png',
};
