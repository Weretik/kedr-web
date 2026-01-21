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

  getProducts(
    query: GetProductListQuery = {},
  ): Observable<PagedResult<ProductListRowDto>> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      params = params.set(key, String(value));
    }

    return this.http.get<PagedResult<ProductListRowDto>>(
      '/api/catalog/products',
      { params },
    );
  }

  getProductBySlug(
    productSlug: string,
    priceTypeId = 10,
  ): Observable<ProductBySlugDto> {
    const params = new HttpParams();

    params.set('priceTypeId', String(priceTypeId));

    return this.http.get<ProductBySlugDto>(
      `/api/catalog/products/${productSlug}`,
      { params },
    );
  }
}
