import type { ProductsListSort } from '@admin/products/model';
import type { GridSortModel } from '@mui/x-data-grid';

export function toGridSortModel(sort: ProductsListSort): GridSortModel {
  const [field, direction] = sort.split('-') as ['id' | 'name' | 'price', 'asc' | 'desc'];

  return [{ field, sort: direction }];
}

export function toProductsListSort(sortModel: GridSortModel): ProductsListSort {
  const sortItem = sortModel[0];

  if (!sortItem?.sort || !['id', 'name', 'price'].includes(sortItem.field)) {
    return 'id-asc';
  }

  return `${sortItem.field}-${sortItem.sort}` as ProductsListSort;
}
