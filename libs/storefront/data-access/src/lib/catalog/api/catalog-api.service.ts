import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PagedResult } from '@shared/data-access';
import {
  GetProductListQuery,
  ProductBySlugDto,
  ProductListRowDto,
} from '@storefront/contracts';
import { Observable } from 'rxjs';

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
