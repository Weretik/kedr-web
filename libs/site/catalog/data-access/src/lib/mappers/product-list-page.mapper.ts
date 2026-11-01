import { mapProductSummary } from './product-summary.mapper';

import type { components } from '@shared/api-contracts';
import type { ProductListPage } from '@site/catalog/model';

type ProductPage = components['schemas']['ProductPage'];

export function mapProductListPage(page: ProductPage): ProductListPage {
  return {
    items: page.value.map(mapProductSummary),
    page: page.pagedInfo.pageNumber,
    pageSize: page.pagedInfo.pageSize,
    totalPages: page.pagedInfo.totalPages,
    totalRecords: page.pagedInfo.totalRecords,
  };
}
