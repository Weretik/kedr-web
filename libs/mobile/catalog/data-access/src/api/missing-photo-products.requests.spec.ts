import {
  buildMissingPhotoProductsRequest,
  MISSING_PHOTO_PRODUCTS_PAGE_SIZE,
} from './missing-photo-products.requests';

describe('missing-photo products API request', () => {
  it('builds the exact first-page request from the generated query contract', () => {
    expect(buildMissingPhotoProductsRequest({ page: 1 })).toEqual({
      method: 'GET',
      params: { page: 1, pageSize: MISSING_PHOTO_PRODUCTS_PAGE_SIZE, withoutPhoto: true },
      url: '/api/admin/products',
    });
  });

  it('keeps the requested next page and fixed supported page size', () => {
    expect(buildMissingPhotoProductsRequest({ page: 3 }).params).toEqual({
      page: 3,
      pageSize: 20,
      withoutPhoto: true,
    });
  });
});
