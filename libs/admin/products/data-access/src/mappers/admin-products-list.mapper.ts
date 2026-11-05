import { publicCategoryNamesUk } from './public-category-names.uk';

import type {
  AdminProductsListResponse,
  AdminProductsPagedInfo,
} from '../contracts/admin-products-list.contract';
import type { AdminProductListItem, ProductsListPage } from '@admin/products/model';

export function mapAdminProductsListResponse(response: unknown): ProductsListPage {
  if (!isRecord(response) || !Array.isArray(response['value'])) {
    throw new Error('Invalid products list response.');
  }

  const validResponse: AdminProductsListResponse = {
    pagedInfo: mapPagedInfo(response['pagedInfo']),
    value: response['value'],
  };

  return {
    items: validResponse.value.map(mapAdminProductListItem),
    pageNumber: validResponse.pagedInfo.pageNumber,
    pageSize: validResponse.pagedInfo.pageSize,
    totalPages: validResponse.pagedInfo.totalPages,
    totalRecords: validResponse.pagedInfo.totalRecords,
  };
}

export function mapAllAdminProductsResponse(response: unknown): AdminProductListItem[] {
  if (!Array.isArray(response)) throw new Error('Invalid products list response.');
  return response.map(mapAdminProductListItem);
}

function mapPagedInfo(value: unknown): AdminProductsPagedInfo {
  if (!isRecord(value)) {
    throw new Error('Invalid products list response.');
  }

  const pageNumber = value['pageNumber'];
  const pageSize = value['pageSize'];
  const totalPages = value['totalPages'];
  const totalRecords = value['totalRecords'];

  if (
    !isPositiveInteger(pageNumber) ||
    !isPositiveInteger(pageSize) ||
    !isNonNegativeInteger(totalPages) ||
    !isNonNegativeInteger(totalRecords)
  ) {
    throw new Error('Invalid products list response.');
  }

  return { pageNumber, pageSize, totalPages, totalRecords };
}

function mapAdminProductListItem(value: unknown): AdminProductListItem {
  if (
    !isRecord(value) ||
    !isPositiveInteger(value['id']) ||
    !isString(value['nameUk']) ||
    !isString(value['nameRu']) ||
    !isString(value['productSlug']) ||
    !isString(value['photo']) ||
    !isOptionalNullableNumber(value['categoryId']) ||
    !isString(value['categoryName']) ||
    typeof value['inStock'] !== 'boolean' ||
    typeof value['isSale'] !== 'boolean' ||
    typeof value['isNew'] !== 'boolean' ||
    typeof value['exportToSite'] !== 'boolean' ||
    !isOptionalNullableNumber(value['price']) ||
    !isFiniteNumber(value['stock']) ||
    !isNonNegativeInteger(value['quantityInPack'])
  ) {
    throw new Error('Invalid product list item.');
  }

  return {
    id: value['id'],
    nameUk: value['nameUk'],
    nameRu: value['nameRu'],
    productSlug: value['productSlug'],
    photo: value['photo'],
    categoryId: value['categoryId'] ?? null,
    categoryName:
      value['categoryId'] == null
        ? value['categoryName']
        : (publicCategoryNamesUk[value['categoryId']] ?? value['categoryName']),
    inStock: value['inStock'],
    isSale: value['isSale'],
    isNew: value['isNew'],
    exportToSite: value['exportToSite'],
    price: value['price'] ?? null,
    stock: value['stock'],
    quantityInPack: value['quantityInPack'],
    deletedAt: isString(value['deletedAt']) ? value['deletedAt'] : null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isOptionalNullableNumber(value: unknown): value is number | null | undefined {
  return value === undefined || value === null || isFiniteNumber(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}
