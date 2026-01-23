import { Injectable, inject } from '@angular/core';

import { CatalogApiService } from '../catalog-api.service';
import { RETAIL_PRICE_TYPE_ID } from '../constances/catalog.constants';
import {
  GetProductListQuery,
  ProductSort,
} from '../models/get-product-list.query';
import { ProductListRowDto } from '../models/product-list-row.dto';

import type { PagedResult } from '@shared/data-access';
import type { Observable } from 'rxjs';

export type ProductListScenarioOptions = {
  priceTypeId?: number;
  categorySlug?: string | null;
};

@Injectable({ providedIn: 'root' })
export class ProductListRepository {
  private readonly api = inject(CatalogApiService);

  getList(
    query: GetProductListQuery = {},
    categorySlug?: string | null,
  ): Observable<PagedResult<ProductListRowDto>> {
    return this.api.getProductList(query, categorySlug);
  }

  getBestSellers(options: ProductListScenarioOptions = {}) {
    const priceTypeId = options.priceTypeId ?? RETAIL_PRICE_TYPE_ID;

    const query: GetProductListQuery = {
      PriceTypeId: priceTypeId,
      Page: 1,
      PageSize: 10,
      InStock: true,
      IsSale: true,
      Sort: ProductSort.PriceDesc,
    };

    return this.api.getProductList(query, options.categorySlug ?? null);
  }

  getInStock(options: ProductListScenarioOptions = {}) {
    const priceTypeId = options.priceTypeId ?? RETAIL_PRICE_TYPE_ID;

    const query: GetProductListQuery = {
      PriceTypeId: priceTypeId,
      Page: 1,
      PageSize: 10,
      InStock: true,
      Sort: ProductSort.NameAsc,
    };
    return this.api.getProductList(query, options.categorySlug ?? null);
  }

  getNew(options: ProductListScenarioOptions = {}) {
    const priceTypeId = options.priceTypeId ?? RETAIL_PRICE_TYPE_ID;

    const query: GetProductListQuery = {
      PriceTypeId: priceTypeId,
      Page: 1,
      PageSize: 10,
      IsNew: true,
      Sort: ProductSort.PriceAsc,
    };

    return this.api.getProductList(query, options.categorySlug ?? null);
  }
}
