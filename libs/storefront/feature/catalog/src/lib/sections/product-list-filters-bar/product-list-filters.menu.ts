import {
  CATALOG_DOOR_ORDER,
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_ORDER,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ROOT_CATEGORIES,
} from '@storefront/data-access';

import type { MenuItem } from 'primeng/api';

type FilterMenuItem = MenuItem & { categorySlug?: string; expanded?: boolean };
export type CategoryPathItem = { label: string; slug: string };

const SHOW_DOORS_CATEGORY = false;

const hardwareItems: FilterMenuItem[] = CATALOG_HARDWARE_ORDER.map(
  (sectionKey) => {
    const section = CATALOG_HARDWARE_SECTIONS[sectionKey];
    return {
      label: section.label,
      categorySlug: section.slug,
      items: section.items.map((item) => ({
        label: item.label,
        categorySlug: item.slug,
      })),
    };
  },
);

const doorItems: FilterMenuItem[] = CATALOG_DOOR_ORDER.map((sectionKey) => {
  const section = CATALOG_DOOR_SECTIONS[sectionKey];
  return {
    label: section.label,
    categorySlug: section.slug,
    items: section.items.map((item) => ({
      label: item.label,
      categorySlug: item.slug,
    })),
  };
});

const FILTERS_MENU_STRUCTURE: FilterMenuItem[] = [
  {
    label: CATALOG_ROOT_CATEGORIES.hardware.label,
    categorySlug: CATALOG_ROOT_CATEGORIES.hardware.slug,
    items: hardwareItems,
  },
  ...(SHOW_DOORS_CATEGORY
    ? [
        {
          label: CATALOG_ROOT_CATEGORIES.doors.label,
          categorySlug: CATALOG_ROOT_CATEGORIES.doors.slug,
          items: doorItems,
        } satisfies FilterMenuItem,
      ]
    : []),
];

const withStyleClass = (
  item: FilterMenuItem,
  className: string,
): FilterMenuItem => ({
  ...item,
  styleClass: item.styleClass ? `${item.styleClass} ${className}` : className,
});

const applyCommand = (
  items: FilterMenuItem[],
  actions: { goToCategory: (slug: string) => void },
  depth = 0,
): FilterMenuItem[] => {
  return items.map((item) => {
    const newItem = { ...item };
    const hasChildren =
      Array.isArray(newItem.items) && newItem.items.length > 0;

    if (newItem.categorySlug && !newItem.command && !hasChildren) {
      const slug = newItem.categorySlug;
      newItem.command = () => actions.goToCategory(slug);
    }

    if (hasChildren) {
      const childItems = applyCommand(
        newItem.items as FilterMenuItem[],
        actions,
        depth + 1,
      );
      newItem.items = childItems;
      newItem.expanded = true;
      if (depth === 0) {
        return withStyleClass(
          newItem,
          'uppercase text-base font-bold tracking-wide text-green-600',
        );
      }

      return withStyleClass(
        newItem,
        'uppercase text-sm font-semibold tracking-wide text-surface-900 dark:text-surface-0',
      );
    }

    return withStyleClass(
      newItem,
      'normal-case text-xs font-normal tracking-normal text-surface-700 dark:text-surface-300',
    );
  });
};

export function buildFiltersMenu(
  actions: {
    goToCategory: (slug: string) => void;
  },
  activeCategorySlug: string | null = null,
): FilterMenuItem[] {
  void activeCategorySlug;
  return applyCommand(FILTERS_MENU_STRUCTURE, actions);
}

export function findCategoryPath(
  slug: string | null,
  items: FilterMenuItem[] = FILTERS_MENU_STRUCTURE,
  parents: CategoryPathItem[] = [],
): CategoryPathItem[] | null {
  if (!slug) return null;

  for (const item of items) {
    const currentPath =
      item.label && item.categorySlug
        ? [...parents, { label: item.label, slug: item.categorySlug }]
        : parents;

    if (item.categorySlug === slug) {
      return currentPath;
    }

    if (item.items) {
      const found = findCategoryPath(
        slug,
        item.items as FilterMenuItem[],
        currentPath,
      );
      if (found) return found;
    }
  }

  return null;
}

export function findCategoryLabel(
  slug: string | null,
  items: FilterMenuItem[] = FILTERS_MENU_STRUCTURE,
): string | null {
  const path = findCategoryPath(slug, items);
  if (!path) return null;
  return path.map((item) => item.label).join(' ➜ ');
}
