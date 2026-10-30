import type { MissingPhotoQuery, ProductsListQuery } from '@admin/products/model';
import type { GridFilterModel } from '@mui/x-data-grid';

export function toProductsGridFilterModel(
  query: ProductsListQuery | MissingPhotoQuery,
  missing: boolean,
): GridFilterModel {
  const items: GridFilterModel['items'] = [];
  if (!missing) {
    const all = query as ProductsListQuery;
    if (all.priceFrom !== undefined && all.priceFrom === all.priceTo) {
      items.push({ id: 'priceEqual', field: 'price', operator: '=', value: String(all.priceFrom) });
    } else if (all.priceFrom !== undefined) {
      items.push({ id: 'priceFrom', field: 'price', operator: '>=', value: String(all.priceFrom) });
    } else if (all.priceTo !== undefined) {
      items.push({ id: 'priceTo', field: 'price', operator: '<=', value: String(all.priceTo) });
    }
  }
  return { items, quickFilterValues: query.searchTerm ? [query.searchTerm] : [] };
}

export function fromProductsGridFilterModel(
  model: GridFilterModel,
  missing: boolean,
): Pick<ProductsListQuery, 'searchTerm' | 'priceFrom' | 'priceTo'> {
  const result: Pick<ProductsListQuery, 'searchTerm' | 'priceFrom' | 'priceTo'> = {
    searchTerm: model.quickFilterValues?.map(String).join(' ').trim().slice(0, 100) || undefined,
    priceFrom: undefined,
    priceTo: undefined,
  };
  for (const item of model.items) {
    if (!missing && item.field === 'price' && item.value !== undefined && item.value !== '') {
      const value = Number(item.value);
      if (!Number.isFinite(value) || value < 0) continue;
      if (item.operator === '>=') result.priceFrom = value;
      if (item.operator === '<=') result.priceTo = value;
      if (item.operator === '=') {
        result.priceFrom = value;
        result.priceTo = value;
      }
    }
  }
  return result;
}
