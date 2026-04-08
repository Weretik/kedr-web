import {
  buildCatalogFiltersMenuStructure,
  type FilterMenuItem,
  type TranslateFn,
} from './product-list-filters-catalog.builder';

import type { MenuItem } from 'primeng/api';

export type CategoryPathItem = { label: string; slug: string };
export type ExpandedState = Record<string, boolean>;

const ROOT_STYLE_CLASS =
  'uppercase text-base font-bold tracking-wide text-green-600';
const GROUP_STYLE_CLASS =
  'uppercase text-sm font-semibold tracking-wide text-surface-900 dark:text-surface-0';
const LEAF_STYLE_CLASS =
  'normal-case text-xs font-normal tracking-normal text-surface-700 dark:text-surface-300';

const withStyleClass = (
  item: FilterMenuItem,
  className: string,
): FilterMenuItem => ({
  ...item,
  styleClass: item.styleClass ? `${item.styleClass} ${className}` : className,
});

const hasChildren = (item: FilterMenuItem): boolean =>
  Array.isArray(item.items) && item.items.length > 0;

const decorateMenuTree = (
  items: FilterMenuItem[],
  actions: { goToCategory: (slug: string) => void },
  expandedState: ExpandedState,
  depth = 0,
): FilterMenuItem[] => {
  return items.map((item) => {
    const newItem = { ...item };
    const isGroup = hasChildren(newItem);

    if (!isGroup && newItem.categorySlug && !newItem.command) {
      const slug = newItem.categorySlug;
      newItem.command = () => actions.goToCategory(slug);
    }

    if (isGroup) {
      const childItems = decorateMenuTree(
        newItem.items as FilterMenuItem[],
        actions,
        expandedState,
        depth + 1,
      );
      newItem.items = childItems;
      const slug = newItem.categorySlug;
      newItem.expanded = slug ? (expandedState[slug] ?? true) : true;
      return withStyleClass(
        newItem,
        depth === 0 ? ROOT_STYLE_CLASS : GROUP_STYLE_CLASS,
      );
    }

    return withStyleClass(newItem, LEAF_STYLE_CLASS);
  });
};

export function buildFiltersMenu(
  actions: {
    goToCategory: (slug: string) => void;
  },
  translate: TranslateFn,
  expandedState: ExpandedState = {},
): FilterMenuItem[] {
  return decorateMenuTree(
    buildCatalogFiltersMenuStructure(translate),
    actions,
    expandedState,
  );
}

export function collectExpandedState(
  items: MenuItem[],
  state: ExpandedState = {},
): ExpandedState {
  for (const item of items) {
    const typedItem = item as FilterMenuItem;
    const children = typedItem.items ?? [];
    if (children.length > 0 && typedItem.categorySlug) {
      state[typedItem.categorySlug] = typedItem.expanded !== false;
    }
    if (children.length > 0) {
      collectExpandedState(children, state);
    }
  }

  return state;
}

export function findCategoryPath(
  slug: string | null,
  items: FilterMenuItem[] = [],
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
