import {
  CATALOG_DOOR_ORDER,
  CATALOG_DOOR_SECTION_TRANSLATION_KEYS,
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_ORDER,
  CATALOG_HARDWARE_SECTION_TRANSLATION_KEYS,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG,
  CATALOG_ROOT_CATEGORIES,
  CATALOG_ROOT_TRANSLATION_KEYS,
} from '@storefront/data-access';

import type { MenuItem } from 'primeng/api';

export type FilterMenuItem = MenuItem & {
  categorySlug?: string;
  expanded?: boolean;
};

export type TranslateFn = (key: string) => string;

const SHOW_DOORS_CATEGORY = false;

const translateWithFallback = (
  translate: TranslateFn,
  key: string,
  fallback?: string,
): string => {
  const translated = translate(key);
  return translated === key ? (fallback ?? key) : translated;
};

export const buildCatalogFiltersMenuStructure = (
  translate: TranslateFn,
): FilterMenuItem[] => {
  const hardwareItems: FilterMenuItem[] = CATALOG_HARDWARE_ORDER.map(
    (sectionKey) => {
      const section = CATALOG_HARDWARE_SECTIONS[sectionKey];
      return {
        label: translateWithFallback(
          translate,
          CATALOG_HARDWARE_SECTION_TRANSLATION_KEYS[sectionKey],
          section.label,
        ),
        categorySlug: section.slug,
        items: section.items.map((item) => ({
          label: CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG[item.slug]
            ? translateWithFallback(
                translate,
                CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG[item.slug],
                item.label,
              )
            : item.label,
          categorySlug: item.slug,
        })),
      };
    },
  );

  const doorItems: FilterMenuItem[] = CATALOG_DOOR_ORDER.map((sectionKey) => {
    const section = CATALOG_DOOR_SECTIONS[sectionKey];
    return {
      label: translateWithFallback(
        translate,
        CATALOG_DOOR_SECTION_TRANSLATION_KEYS[sectionKey],
        section.label,
      ),
      categorySlug: section.slug,
      items: section.items.map((item) => ({
        label: CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG[item.slug]
          ? translateWithFallback(
              translate,
              CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG[item.slug],
              item.label,
            )
          : item.label,
        categorySlug: item.slug,
      })),
    };
  });

  return [
    {
      label: translateWithFallback(
        translate,
        CATALOG_ROOT_TRANSLATION_KEYS.hardware,
        CATALOG_ROOT_CATEGORIES.hardware.label,
      ),
      categorySlug: CATALOG_ROOT_CATEGORIES.hardware.slug,
      items: hardwareItems,
    },
    ...(SHOW_DOORS_CATEGORY
      ? [
          {
            label: translateWithFallback(
              translate,
              CATALOG_ROOT_TRANSLATION_KEYS.doors,
              CATALOG_ROOT_CATEGORIES.doors.label,
            ),
            categorySlug: CATALOG_ROOT_CATEGORIES.doors.slug,
            items: doorItems,
          } satisfies FilterMenuItem,
        ]
      : []),
  ];
};
