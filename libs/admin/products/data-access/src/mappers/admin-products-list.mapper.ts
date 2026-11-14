import { z } from 'zod';

import { publicCategoryNamesUk } from './public-category-names.uk';
import {
  adminProductListItemSchema,
  adminProductsPageSchema,
} from '../validators/admin-product.schemas';

import type { AdminProductListItem, ProductsListPage } from '@admin/products/model';

export function mapAdminProductsListResponse(response: unknown): ProductsListPage {
  const { pagedInfo, value } = adminProductsPageSchema.parse(response);
  return {
    items: value.map(mapAdminProductListItem),
    pageNumber: pagedInfo.pageNumber,
    pageSize: pagedInfo.pageSize,
    totalPages: pagedInfo.totalPages,
    totalRecords: pagedInfo.totalRecords,
  };
}

export function mapAllAdminProductsResponse(response: unknown): AdminProductListItem[] {
  return z.array(z.unknown()).parse(response).map(mapAdminProductListItem);
}

function mapAdminProductListItem(data: unknown): AdminProductListItem {
  const value = adminProductListItemSchema.parse(data);
  return {
    id: value.id,
    nameUk: value.nameUk,
    nameRu: value.nameRu,
    productSlug: value.productSlug,
    photo: value.photo,
    categoryId: value.categoryId ?? null,
    categoryName:
      value.categoryId == null
        ? value.categoryName
        : (publicCategoryNamesUk[value.categoryId] ?? value.categoryName),
    inStock: value.inStock,
    isSale: value.isSale,
    isNew: value.isNew,
    exportToSite: value.exportToSite,
    price: value.price ?? null,
    stock: value.stock,
    quantityInPack: value.quantityInPack,
    deletedAt: typeof value.deletedAt === 'string' ? value.deletedAt : null,
  };
}
