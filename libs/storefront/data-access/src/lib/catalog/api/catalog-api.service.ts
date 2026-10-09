import { PlatformLocation } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PagedResult } from '@shared/data-access';
import { GetProductListQuery, ProductDetails, ProductListItem } from '@storefront/contracts';
import { Observable, map } from 'rxjs';

import { parseProductDetails, parseProductPage } from '../contracts/catalog-response.schema';

import type { operations } from '@shared/api-contracts';

type PublicProductsQuery = NonNullable<operations['getPublicProducts']['parameters']['query']>;
type PublicProductPage =
  operations['getPublicProducts']['responses'][200]['content']['application/json'];

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private http = inject(HttpClient);
  private readonly platformLocation = inject(PlatformLocation);

  getProductList(
    query: GetProductListQuery = {},
    categorySlug?: string | null,
  ): Observable<PagedResult<ProductListItem>> {
    const lang = this.getCurrentLang();
    const contractQuery: PublicProductsQuery = query;
    let params = new HttpParams();

    for (const [key, value] of Object.entries(contractQuery)) {
      if (value === undefined || value === null) continue;
      params = params.set(key, String(value));
    }
    const url = categorySlug?.trim()
      ? `/api/catalog/${lang}/${encodeURIComponent(categorySlug)}/products`
      : `/api/catalog/${lang}/products`;

    return this.http.get<unknown>(url, { params }).pipe(map(mapPublicProductPage));
  }

  getProductBySlug(priceTypeId: number, productSlug: string): Observable<ProductDetails> {
    const lang = this.getCurrentLang();
    const params = new HttpParams().set('priceTypeId', String(priceTypeId));
    const url = `/api/catalog/${lang}/product/${encodeURIComponent(productSlug)}`;

    return this.http
      .get<unknown>(url, { params })
      .pipe(map((response) => parseProductDetails(response)));
  }

  private getCurrentLang(): 'uk' | 'ru' {
    const pathname = this.platformLocation.pathname ?? '/';
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    return firstSegment === 'ru' ? 'ru' : 'uk';
  }
}

function mapPublicProductPage(response: unknown): PagedResult<ProductListItem> {
  const productPage: PublicProductPage = parseProductPage(response);
  return {
    isSuccess: true,
    pagedInfo: productPage.pagedInfo,
    value: productPage.value.map((product) => ({
      ...product,
      categoryId: product.categoryId ?? null,
      price: product.price ?? null,
    })),
  };
}
