import { ru } from './ru';
import { uk } from './uk';

import type { ListingSort } from '@site/catalog/model';
import type { Locale, PluralForms } from '@site/core/i18n';

/** Interface texts of the catalog: product cards and table, listing controls, tree, mega menu, and pages. */
export type CatalogDictionary = {
  /** Link to a whole category when only part of its subcategories is shown. */
  allInCategory: (count: number) => string;
  products: PluralForms;
  /** «варіант» forms for the number of products of a model card. */
  variants: PluralForms;
  /** Before the lowest price of a model of several products. */
  fromPrice: string;
  colors: string;
  /** «модель» forms for the count of a value page. */
  models: PluralForms;
  /** Links to the value pages of a final category, and the link back to all values. */
  /** Opening line of a value page («Завіси хром: 12 моделей. …»). */
  landingIntro: (heading: string, count: string) => string;
  priceOnRequest: string;
  retailPrice: string;
  isNew: string;
  isSale: string;
  sku: string;
  inStock: string;
  outOfStock: string;
  table: { photo: string; name: string; sku: string; stock: string; price: string; action: string };

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
  aboutCategory: string;
  readMore: string;
  readLess: string;
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
