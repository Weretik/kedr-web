import {
  CATALOG_DOOR_ORDER,
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_ORDER,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ROOT_CATEGORIES,
} from '@storefront/data-access';

const collectSectionSlugs = <
  TSections extends Record<
    string,
    { slug: string; items: readonly { slug: string }[] }
  >,
  TOrder extends readonly (keyof TSections)[],
>(
  sections: TSections,
  order: TOrder,
): string[] => {
  return order.flatMap((sectionKey) => {
    const section = sections[sectionKey];
    return [section.slug, ...section.items.map((item) => item.slug)];
  });
};

const rootSlugs = Object.values(CATALOG_ROOT_CATEGORIES).map(
  (category) => category.slug,
);

const hardwareSlugs = collectSectionSlugs(
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_HARDWARE_ORDER,
);

const doorSlugs = collectSectionSlugs(
  CATALOG_DOOR_SECTIONS,
  CATALOG_DOOR_ORDER,
);

export const CATALOG_CATEGORY_SLUGS = [
  ...new Set([...rootSlugs, ...hardwareSlugs, ...doorSlugs]),
] as const;
