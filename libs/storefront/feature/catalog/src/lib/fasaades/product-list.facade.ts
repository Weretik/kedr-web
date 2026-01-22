import { Injectable, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  CatalogApiService,
  type GetProductListQuery,
  type ProductListRowDto,
} from '@storefront/data-access';
import {
  mapProductListQueryToApi,
  type ProductListQuery,
  ProductListSortUi,
} from '@storefront/util';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { map } from 'rxjs';

import type { PagedResult } from '@shared/data-access';

@Injectable({ providedIn: 'root' })
export class ProductListFacade {
  private catalogApi = inject(CatalogApiService);
  private route = inject(ActivatedRoute);

  readonly categorySlug = toSignal(
    this.route.paramMap.pipe(map((pm) => pm.get('categorySlug'))),
    { initialValue: null },
  );

  readonly search = linkedQueryParam('search');
  readonly page = linkedQueryParam('page', { defaultValue: '1' });
  readonly pageSize = linkedQueryParam('pageSize', { defaultValue: '20' });
  readonly sort = linkedQueryParam('sort', { defaultValue: 'name-asc' });

  readonly inStock = linkedQueryParam('inStock');
  readonly isSale = linkedQueryParam('isSale');
  readonly isNew = linkedQueryParam('isNew');

  readonly priceTypeIdRetail = '10';
  readonly priceFrom = linkedQueryParam('priceFrom');
  readonly priceTo = linkedQueryParam('priceTo');

  readonly query = computed<ProductListQuery>(() => ({
    search: this.search() ?? undefined,

    inStock: (this.inStock() as 'true' | 'false' | null) ?? undefined,
    isSale: (this.isSale() as 'true' | 'false' | null) ?? undefined,
    isNew: (this.isNew() as 'true' | 'false' | null) ?? undefined,

    priceTypeId: this.priceTypeIdRetail,
    priceFrom: this.priceFrom() ?? undefined,
    priceTo: this.priceTo() ?? undefined,

    sort: (this.sort() ?? 'name-asc') as ProductListSortUi,

    page: this.page() ?? '1',
    pageSize: this.pageSize() ?? '20',
  }));

  readonly apiQuery = computed<GetProductListQuery>(() =>
    mapProductListQueryToApi(this.query()),
  );

  readonly productsResource = rxResource<
    PagedResult<ProductListRowDto>,
    GetProductListQuery
  >({
    params: () => this.apiQuery(),
    stream: ({ params }) =>
      this.catalogApi.getProductList(params, this.categorySlug()),
  });

  // =================
  // UI actions (methods)
  // =================
  public setPage(page: number) {
    this.page.set(String(page));
  }
  private setDefaultPage() {
    this.page.set('1');
  }

  public setSearch(value: string) {
    const currentValue = this.search();
    const nextValue = value?.trim();

    if (currentValue === nextValue) return;

    this.search.set(nextValue ? nextValue : null);
    this.setDefaultPage();
  }

  setSort(sort: ProductListSortUi) {
    this.sort.set(sort);
    this.setDefaultPage();
  }

  toggleInStock() {
    const currentStock = this.inStock();
    const nextStock = currentStock === 'true' ? 'false' : 'true';
    this.inStock.set(nextStock);
    this.setDefaultPage();
  }

  clearFilters() {
    this.search.set(null);

    this.inStock.set(null);
    this.isSale.set(null);
    this.isNew.set(null);

    this.priceFrom.set(null);
    this.priceTo.set(null);

    this.sort.set('name-asc');
    this.page.set('1');
    this.pageSize.set('20');
  }
}
