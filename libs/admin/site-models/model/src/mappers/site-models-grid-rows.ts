import type { SiteModelListItem } from '../entities/models/site-model-list';

/** The row under an opened model in «Моделі» that lists its products (spec 001 R-002a). */
export interface SiteModelProductsRow {
  id: string;
  productsOf: number;
}

export type SiteModelsGridRow = SiteModelListItem | SiteModelProductsRow;

export const isProductsRow = (row: SiteModelsGridRow): row is SiteModelProductsRow =>
  'productsOf' in row;

/** The grid rows: each model, and under every opened one the row with its products. */
export function siteModelsGridRows(
  models: readonly SiteModelListItem[],
  openIds: ReadonlySet<number>,
): SiteModelsGridRow[] {
  return models.flatMap((model) =>
    openIds.has(model.id) ? [model, { id: `products-${model.id}`, productsOf: model.id }] : [model],
  );
}
