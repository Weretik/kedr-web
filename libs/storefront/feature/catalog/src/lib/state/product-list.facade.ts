import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  type GetProductListQuery,
  ProductListRepository,
  type ProductListRowDto,
} from '@storefront/data-access';
import { mapProductListQueryToApi } from '@storefront/util';
import { map } from 'rxjs';

import { ProductListQueryState } from './product-list.query-state';

import type { PagedResult } from '@shared/data-access';

@Injectable({ providedIn: 'root' })
export class ProductListFacade {
  private readonly repo = inject(ProductListRepository);
  private route = inject(ActivatedRoute);

  readonly queryState = inject(ProductListQueryState);

  private readonly refreshToken = signal(0);

  readonly categorySlug = toSignal(
    this.route.paramMap.pipe(map((pm) => pm.get('categorySlug'))),
    { initialValue: null },
  );

  readonly apiQuery = computed<GetProductListQuery>(() =>
    mapProductListQueryToApi(this.queryState.query()),
  );

  readonly productsResource = rxResource<
    PagedResult<ProductListRowDto>,
    GetProductListQuery & { refresh: number }
  >({
    params: () => ({
      ...this.apiQuery(),
      refresh: this.refreshToken(),
    }),
    stream: ({ params }) => this.repo.getList(params, this.categorySlug()),
  });

  // --- commands (thin proxies or domain commands) ---
  public refresh(): void {
    this.refreshToken.update((v) => v + 1);
  }
}
