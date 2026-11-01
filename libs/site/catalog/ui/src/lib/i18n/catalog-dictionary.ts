import { ru } from './locales/ru';
import { uk } from './locales/uk';

import type { ListingSort } from '@site/catalog/model';
import type { Locale, PluralForms } from '@site/core/i18n';

/** Interface texts of the catalog: product cards and table, listing controls, tree, mega menu, and pages. */
export type CatalogDictionary = {
  /** Link to a whole category when only part of its subcategories is shown. */
  allInCategory: (count: number) => string;
  products: PluralForms;
  priceOnRequest: string;
  retailPrice: string;
  isNew: string;
  isSale: string;
  currency: string;
  sku: string;
  inStock: string;
  outOfStock: string;
  table: { photo: string; name: string; sku: string; stock: string; price: string };

  filters: string;
  onlyInStock: string;
  onlySale: string;
  onlyNew: string;
  price: string;
  priceFrom: string;
  priceTo: string;
  apply: string;
  resetFilters: string;
  sort: string;
  sorts: Record<ListingSort, string>;
  view: string;
  viewGrid: string;
  viewTable: string;

  summary: (from: number, to: number, total: string) => string;
  perPage: string;
  perPageOption: (size: number) => string;
  pagination: string;
  previousPage: string;
  nextPage: string;
  pageNumber: (page: number) => string;
  emptyTitle: string;
  emptyFiltered: string;
  emptyPage: string;
  toFirstPage: string;
  unavailable: string;

  treeTitle: string;
  hideTree: string;
  showTree: string;
  expand: (name: string) => string;
  collapse: (name: string) => string;

  catalog: string;
  catalogMenu: string;
  searchCategories: string;
  noCategories: string;
  allInSection: string;
  allCatalog: string;
  wholesale: string;
  wholesaleNote: string;

  breadcrumbs: string;
  home: string;
  subcategories: string;
  faqTitle: string;
  hubTitle: string;
  hubIntro: string;
  searchTitle: (term: string) => string;
  searchResults: (term: string) => string;
  searchHeading: string;
  searchPrompt: string;
  searchLabel: string;
  searchSubmit: string;
};

const DICTIONARIES: Record<Locale, CatalogDictionary> = { uk, ru };

export function getCatalogDictionary(locale: Locale): CatalogDictionary {
  return DICTIONARIES[locale];
}
