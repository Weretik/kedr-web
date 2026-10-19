import { mapAdminProductsListResponse } from './admin-products-list.mapper';
import { publicCategoryNamesUk } from './public-category-names.uk';

import type { ProductDetails, ProductsListPage } from '@admin/products/model';
import type { operations } from '@shared/api-contracts';

type MissingResponse = operations['getAdminProductsWithUnavailablePhotos']['responses'][200]['content']['application/json'];
type AdminDetailResponse = operations['getAdminProductBySlug']['responses'][200]['content']['application/json'];

export function mapMissingPhotoProductsResponse(response: unknown): ProductsListPage {
  if (!isRecord(response) || !Array.isArray(response['value'])) {
    throw new Error('Invalid missing-photo products response.');
  }

  const value: MissingResponse['value'] = response['value'].map((item: unknown) => {
    if (
      !isRecord(item) || item['photoAvailable'] !== false ||
      !['Missing', 'InvalidContentType', 'CheckFailed'].includes(String(item['photoStatus'])) ||
      typeof item['photoCheckedAtUtc'] !== 'string' ||
      !Number.isFinite(Date.parse(item['photoCheckedAtUtc'])) ||
      (item['photoHttpStatusCode'] !== null &&
        !(typeof item['photoHttpStatusCode'] === 'number' && Number.isInteger(item['photoHttpStatusCode']))) ||
      typeof item['exportToSite'] !== 'boolean'
    ) {
      throw new Error('Invalid missing-photo product.');
    }

    return item as MissingResponse['value'][number];
  });

  return mapAdminProductsListResponse({ pagedInfo: response['pagedInfo'], value });
}

export function mapAdminProductDetailsResponse(response: unknown): ProductDetails {
  if (
    !isRecord(response) || !positiveInteger(response['id']) ||
    !string(response['nameUk']) || !string(response['nameRu']) || !string(response['productSlug']) ||
    !string(response['photo']) || !string(response['scheme']) ||
    !finiteNumber(response['stock']) || !string(response['categoryName']) ||
    !positiveInteger(response['categoryId']) ||
    !nonNegativeInteger(response['quantityInPack']) ||
    !(response['price'] === null || finiteNumber(response['price'])) ||
    typeof response['inStock'] !== 'boolean' || typeof response['isSale'] !== 'boolean' ||
    typeof response['isNew'] !== 'boolean' || typeof response['exportToSite'] !== 'boolean'
  ) {
    throw new Error('Invalid admin product details response.');
  }

  const detail = {
    id: response['id'],
    nameUk: response['nameUk'],
    nameRu: response['nameRu'],
    productSlug: response['productSlug'],
    photo: response['photo'],
    scheme: response['scheme'],
    stock: response['stock'],
    categoryId: response['categoryId'],
    categoryName: publicCategoryNamesUk[response['categoryId']] ?? response['categoryName'],
    quantityInPack: response['quantityInPack'],
    price: response['price'],
    inStock: response['inStock'],
    isSale: response['isSale'],
    isNew: response['isNew'],
    exportToSite: response['exportToSite'],
  } satisfies AdminDetailResponse;
  return detail;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function string(value: unknown): value is string { return typeof value === 'string'; }
function finiteNumber(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
function positiveInteger(value: unknown): value is number { return finiteNumber(value) && Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value: unknown): value is number { return finiteNumber(value) && Number.isInteger(value) && value >= 0; }
