import type { AdminProductsQueryDto } from '../contracts/admin-products.dto';
import type { ApiRequest } from '@mobile/shared/api-client';

export const MISSING_PHOTO_PRODUCTS_PAGE_SIZE = 20;

export interface MissingPhotoProductsQuery {
  page: number;
}

/** Products without a linked photo: the admin product list filtered by `withoutPhoto`. */
export function buildMissingPhotoProductsRequest(query: MissingPhotoProductsQuery): ApiRequest {
  const params = {
    page: query.page,
    pageSize: MISSING_PHOTO_PRODUCTS_PAGE_SIZE,
    withoutPhoto: true,
  } satisfies AdminProductsQueryDto;

  return { method: 'GET', params, url: '/api/admin/products' };
}
