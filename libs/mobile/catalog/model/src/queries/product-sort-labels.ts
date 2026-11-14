import type { ProductSort } from './product-search';

/** How each sort reads in the list summary and on the sort button. */
export const productSortLabels: Record<ProductSort, string> = {
  name: 'за назвою',
  'price-asc': 'спочатку дешевші',
  'price-desc': 'спочатку дорожчі',
};

/** The sort button cycles name → cheaper first → dearer first → name. */
export const nextProductSort = (sort: ProductSort): ProductSort =>
  sort === 'name' ? 'price-asc' : sort === 'price-asc' ? 'price-desc' : 'name';

/** One summary line under the filters, for example «12 шт. · за назвою · лише в наявності». */
export const productListSummary = (count: number, sort: ProductSort, inStockOnly: boolean) =>
  [`${count} шт.`, productSortLabels[sort], inStockOnly ? 'лише в наявності' : null]
    .filter(Boolean)
    .join(' · ');
