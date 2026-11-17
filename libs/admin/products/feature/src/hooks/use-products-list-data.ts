import {
  useGetAdminProductCategoriesQuery,
  useGetMissingPhotoProductsQuery,
  useGetProductsListQuery,
} from '@admin/products/data-access';
import { useRef } from 'react';

import type { ProductsListMode, ProductsUrlState } from '../model/products-url-state';

/**
 * Loads only the active tab. Each tab remembers its last total, so the pager keeps its size while the next page
 * loads.
 */
export function useProductsListData(mode: ProductsListMode, urlState: ProductsUrlState) {
  const allQuery = useGetProductsListQuery(urlState.allQuery, { skip: mode !== 'all' });
  const siteQuery = useGetProductsListQuery(
    { ...urlState.siteQuery, exportToSite: true },
    { skip: mode !== 'site' },
  );
  // «Без фото» and «На сайті без фото» share one endpoint and differ only by `exportToSite`.
  const missingMode = mode === 'missing' || mode === 'siteMissing';
  const missingQuery = useGetMissingPhotoProductsQuery(
    mode === 'siteMissing'
      ? { ...urlState.siteMissingQuery, exportToSite: true }
      : urlState.missingQuery,
    { skip: !missingMode },
  );
  const categoriesQuery = useGetAdminProductCategoriesQuery();
  const totals = useRef<Partial<Record<ProductsListMode, number>>>({});

  const activeQuery = {
    all: allQuery,
    missing: missingQuery,
    site: siteQuery,
    siteMissing: missingQuery,
    deleted: allQuery,
  }[mode];
  const total = activeQuery.data?.totalRecords;
  if (total !== undefined) totals.current[mode] = total;

  return { activeQuery, categoriesQuery, rowCount: totals.current[mode] ?? 0 };
}
