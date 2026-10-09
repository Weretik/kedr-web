import type { MissingPhotoProductsQueryDto } from '../contracts/missing-photo-products.dto';
import type { ApiRequest } from '@mobile/shared/api-client';

export const MISSING_PHOTO_PRODUCTS_PAGE_SIZE = 20;

export interface MissingPhotoProductsQuery {
  page: number;
}

export function buildMissingPhotoProductsRequest(query: MissingPhotoProductsQuery): ApiRequest {
  const params = {
    page: query.page,
    pageSize: MISSING_PHOTO_PRODUCTS_PAGE_SIZE,
  } satisfies MissingPhotoProductsQueryDto;

  return { method: 'GET', params, url: '/api/admin/products/missing-photos' };
}
