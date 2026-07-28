import type { AdminProductsListResponse, AdminProductsPagedInfo } from '../contracts/admin-products-list.contract';
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
    !isNullableNumber(value['categoryId']) ||
    typeof value['inStock'] !== 'boolean' ||
    typeof value['isSale'] !== 'boolean' ||
    typeof value['isNew'] !== 'boolean' ||
    !isNullableNumber(value['price']) ||
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
    categoryId: value['categoryId'],
    inStock: value['inStock'],
    isSale: value['isSale'],
    isNew: value['isNew'],
    price: value['price'],
    stock: value['stock'],
    quantityInPack: value['quantityInPack'],
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

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}
