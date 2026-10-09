import { parseMissingPhotoProductPage } from '../contracts/missing-photo-products.schema';

import type { MissingPhotoProductPageDto } from '../contracts/missing-photo-products.dto';
import type { CatalogPage, CatalogProduct } from '@mobile/catalog/model';

export function mapMissingPhotoProductPage(response: unknown): CatalogPage {
  const dto: MissingPhotoProductPageDto = parseMissingPhotoProductPage(response);

  return {
    items: dto.value.map(mapMissingPhotoProduct),
    pageNumber: dto.pagedInfo.pageNumber,
    pageSize: dto.pagedInfo.pageSize,
    totalPages: dto.pagedInfo.totalPages,
    totalRecords: dto.pagedInfo.totalRecords,
  };
}

function mapMissingPhotoProduct(dto: MissingPhotoProductPageDto['value'][number]): CatalogProduct {
  return {
    availability: dto.inStock ? 'in_stock' : 'out_of_stock',
    id: String(dto.id),
    imageUrl: null,
    name: dto.nameUk || dto.nameRu,
    price: dto.price ?? null,
    productSlug: dto.productSlug,
  };
}
