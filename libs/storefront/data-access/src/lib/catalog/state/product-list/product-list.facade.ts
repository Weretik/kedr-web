import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { GetProductListQuery, ProductListRowDto } from '@storefront/contracts';

import { ProductListQueryState } from './product-list.query-state';
import { mapProductListQueryToApi } from '../../mappers/product-list-query.mapper';
import { ProductListRepository } from '../../repositories/product-list.repository';

import type { PagedResult } from '@shared/data-access';

@Injectable({ providedIn: 'root' })
export class ProductListFacade {
  private readonly repo = inject(ProductListRepository);

  readonly queryState = inject(ProductListQueryState);

  private readonly refreshToken = signal(0);
  private readonly _categorySlug = signal<string | null>(null);

  readonly categorySlug = this._categorySlug.asReadonly();

  readonly apiQuery = computed<GetProductListQuery>(() =>
    mapProductListQueryToApi(this.queryState.query()),
  );

  readonly productsResource = rxResource<
    PagedResult<ProductListRowDto>,
    GetProductListQuery & { refresh: number; categorySlug: string | null }
  >({
    params: () => ({
      ...this.apiQuery(),
      refresh: this.refreshToken(),
      categorySlug: this.categorySlug(),
    }),
    stream: ({ params }) => this.repo.getList(params, params.categorySlug),
  });

  // --- commands (thin proxies or domain commands) ---
  public setCategorySlug(slug: string | null): void {
    this._categorySlug.set(slug);
  }

  public refresh(): void {
    this.refreshToken.update((v) => v + 1);
  }
}
