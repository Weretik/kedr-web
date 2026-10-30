import {
  useGetAdminProductCategoriesQuery,
  useGetMissingPhotoProductsQuery,
  useGetProductsListQuery,
} from '@admin/products/data-access';
import { useRef } from 'react';

import type { ProductsListMode, ProductsUrlState } from '../url/products-url-state';

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
  const missingQuery = useGetMissingPhotoProductsQuery(urlState.missingQuery, {
    skip: mode !== 'missing',
  });
  const categoriesQuery = useGetAdminProductCategoriesQuery();
  const totals = useRef<Partial<Record<ProductsListMode, number>>>({});

  const activeQuery = mode === 'missing' ? missingQuery : mode === 'site' ? siteQuery : allQuery;
  const total = activeQuery.data?.totalRecords;
  if (total !== undefined) totals.current[mode] = total;

  return { activeQuery, categoriesQuery, rowCount: totals.current[mode] ?? 0 };
}
