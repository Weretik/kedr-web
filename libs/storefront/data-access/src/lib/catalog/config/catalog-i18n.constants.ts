import {
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ROOT_CATEGORIES,
} from './catalog-category-slugs.constants';

type LocalizeFn = (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

const $localize: LocalizeFn =
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as { $localize?: unknown }).$localize === 'function'
    ? ((globalThis as unknown as { $localize: LocalizeFn })
        .$localize as LocalizeFn)
    : (
        messageParts: TemplateStringsArray,
        ...expressions: readonly unknown[]
      ) => String.raw({ raw: messageParts }, ...expressions);

const ROOT_LABELS: Record<keyof typeof CATALOG_ROOT_CATEGORIES, string> = {
  hardware: $localize`:@@catalog.root.hardware:Фурнітура`,
  doors: $localize`:@@catalog.root.doors:Двері`,
};

const HARDWARE_SECTION_LABELS: Record<
  keyof typeof CATALOG_HARDWARE_SECTIONS,
  string
> = {
  hinges: $localize`:@@catalog.section.hinges:Завіси`,
  locks: $localize`:@@catalog.section.locks:Замки`,
  handles: $localize`:@@catalog.section.handles:Ручки`,
  cylinders: $localize`:@@catalog.section.cylinders:Циліндри`,
  interiorMechanisms: $localize`:@@catalog.section.interiorMechanisms:Міжкімнатні механізми`,
  other: $localize`:@@catalog.section.other:Інше`,
};

const DOOR_SECTION_LABELS: Record<keyof typeof CATALOG_DOOR_SECTIONS, string> =
  {
    entranceDoors: $localize`:@@catalog.section.entranceDoors:Вхідні двері`,
    interiorDoors: $localize`:@@catalog.section.interiorDoors:Міжкімнатні двері`,
  };

export function getCatalogRootLabel(
  key: keyof typeof CATALOG_ROOT_CATEGORIES,
): string {
  return ROOT_LABELS[key];
}

export function getCatalogHardwareSectionLabel(
  key: keyof typeof CATALOG_HARDWARE_SECTIONS,
): string {
  return HARDWARE_SECTION_LABELS[key];
}

export function getCatalogDoorSectionLabel(
  key: keyof typeof CATALOG_DOOR_SECTIONS,
): string {
  return DOOR_SECTION_LABELS[key];
}
