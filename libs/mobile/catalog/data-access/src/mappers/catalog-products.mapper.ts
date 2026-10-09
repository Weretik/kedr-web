import { parseAdminProductPage } from '../contracts/admin-products.schema';

import type { AdminProductPageDto } from '../contracts/admin-products.dto';
import type { CatalogPage, CatalogProduct } from '@mobile/catalog/model';

export function mapAdminProductPage(response: unknown): CatalogPage {
  const dto = parseAdminProductPage(response);
  return {
    items: dto.value.map(mapAdminProduct),
    pageNumber: dto.pagedInfo.pageNumber,
    pageSize: dto.pagedInfo.pageSize,
    totalPages: dto.pagedInfo.totalPages,
    totalRecords: dto.pagedInfo.totalRecords,
  };
}

function mapAdminProduct(dto: AdminProductPageDto['value'][number]): CatalogProduct {
  return {
    availability: dto.inStock === undefined ? 'unknown' : dto.inStock ? 'in_stock' : 'out_of_stock',
    id: String(dto.id),
    imageUrl: dto.photo || null,
    name: dto.nameUk || dto.nameRu,
    price: dto.price ?? null,
    productSlug: dto.productSlug,
  };
}
