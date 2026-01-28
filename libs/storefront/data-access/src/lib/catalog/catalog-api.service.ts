import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PagedResult } from '@shared/data-access';
import { Observable } from 'rxjs';

import type { GetProductListQuery } from './models/get-product-list.query';
import type { ProductBySlugDto } from './models/product-by-slug.dto';
import type { ProductListRowDto } from './models/product-list-row.dto';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private http = inject(HttpClient);

  getProductList(
    query: GetProductListQuery = {},
    categorySlug?: string | null,
  ): Observable<PagedResult<ProductListRowDto>> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      params = params.set(key, String(value));
    }
    const url = categorySlug?.trim()
      ? `/api/catalog/${encodeURIComponent(categorySlug)}/products`
      : `/api/catalog/products`;

    return this.http.get<PagedResult<ProductListRowDto>>(url, { params });
  }

  getProductBySlug(
    priceTypeId: number,
    productSlug: string,
  ): Observable<ProductBySlugDto> {
    const params = new HttpParams().set('priceTypeId', String(priceTypeId));
    const url = `/api/catalog/product/${productSlug}`;

    return this.http.get<ProductBySlugDto>(url, { params });
  }
}
