import { CATEGORY_LINKS } from './site-navigation';

import type { ShellDictionary } from '../i18n/shell-dictionary';
import type { ReactNode } from 'react';

/** A labeled locale-free link the shell renders as is. */
export type ShellLink = { key: string; path: string; label: string };

/**
 * Catalog navigation filled by the app layout from the catalog domain, which the shell cannot import:
 * the «Каталог» button content (mega menu) and the top-level sections for the category row and mobile menu.
 */
export type CatalogNavigation = {
  menu: ReactNode;
  links: readonly ShellLink[];
};

/** Sections from the catalog tree, or the fixed sections when the tree is unavailable. */
export function resolveCategoryLinks(
  dictionary: ShellDictionary,
  navigation?: CatalogNavigation,
): readonly ShellLink[] {
  if (navigation?.links.length) return navigation.links;
  return CATEGORY_LINKS.map((link) => ({ ...link, label: dictionary.categories[link.key] }));
}
