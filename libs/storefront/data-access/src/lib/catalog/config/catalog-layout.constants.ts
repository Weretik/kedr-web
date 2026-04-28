import {
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_SECTIONS,
} from './catalog-category-slugs.constants';

export const CATALOG_HARDWARE_ORDER = [
  'hinges',
  'locks',
  'handles',
  'cylinders',
  'interiorMechanisms',
  'other',
] as const satisfies readonly (keyof typeof CATALOG_HARDWARE_SECTIONS)[];

export const CATALOG_HEADER_LAYOUT = [
  ['hinges', 'locks'],
  ['handles', 'cylinders'],
  ['interiorMechanisms', 'other'],
] as const satisfies readonly (readonly (keyof typeof CATALOG_HARDWARE_SECTIONS)[])[];

export const CATALOG_DOOR_ORDER = [
  'entranceDoors',
  'interiorDoors',
] as const satisfies readonly (keyof typeof CATALOG_DOOR_SECTIONS)[];
