import { PlatformLocation } from '@angular/common';
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
  private readonly platformLocation = inject(PlatformLocation);

  getProductList(
    query: GetProductListQuery = {},
    categorySlug?: string | null,
  ): Observable<PagedResult<ProductListRowDto>> {
    const lang = this.getCurrentLang();
    let params = new HttpParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      params = params.set(key, String(value));
    }
    const url = categorySlug?.trim()
      ? `/api/catalog/${lang}/${encodeURIComponent(categorySlug)}/products`
      : `/api/catalog/${lang}/products`;

    return this.http.get<PagedResult<ProductListRowDto>>(url, { params });
  }

  getProductBySlug(
    priceTypeId: number,
    productSlug: string,
  ): Observable<ProductBySlugDto> {
    const lang = this.getCurrentLang();
    const params = new HttpParams().set('priceTypeId', String(priceTypeId));
    const url = `/api/catalog/${lang}/product/${encodeURIComponent(productSlug)}`;

    return this.http.get<ProductBySlugDto>(url, { params });
  }

  private getCurrentLang(): 'uk' | 'ru' {
    const pathname = this.platformLocation.pathname ?? '/';
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    return firstSegment === 'ru' ? 'ru' : 'uk';
  }
}
