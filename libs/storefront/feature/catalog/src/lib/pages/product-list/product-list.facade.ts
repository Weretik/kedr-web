import { Injectable, computed, inject, signal, effect } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  type GetProductListQuery,
  ProductListRepository,
  type ProductListRowDto,
} from '@storefront/data-access';
import {
  mapProductListQueryToApi,
  type ProductListQuery,
  ProductListSortUi,
} from '@storefront/util';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

import type { PagedResult } from '@shared/data-access';

@Injectable({ providedIn: 'root' })
export class ProductListFacade {
  private readonly repo = inject(ProductListRepository);
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

  readonly priceFrom = linkedQueryParam('priceFrom');
  readonly priceTo = linkedQueryParam('priceTo');

  readonly query = computed<ProductListQuery>(() => ({
    search: this.search() ?? undefined,

    inStock: (this.inStock() as 'true' | 'false' | null) ?? undefined,
    isSale: (this.isSale() as 'true' | 'false' | null) ?? undefined,
    isNew: (this.isNew() as 'true' | 'false' | null) ?? undefined,

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
    stream: ({ params }) => this.repo.getList(params, this.categorySlug()),
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
    this.draftSearch.set(value ?? '');
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

  public setInStock(checked: boolean) {
    this.inStock.set(checked ? 'true' : null);
    this.setDefaultPage();
  }
  public setIsSale(checked: boolean) {
    this.isSale.set(checked ? 'true' : null);
    this.setDefaultPage();
  }

  public setIsNew(checked: boolean) {
    this.isNew.set(checked ? 'true' : null);
    this.setDefaultPage();
  }

  public setPriceFrom(value: number | null) {
    this.priceFrom.set(value == null ? null : String(value));
    this.setDefaultPage();
  }

  public setPriceTo(value: number | null) {
    this.priceTo.set(value == null ? null : String(value));
    this.setDefaultPage();
  }

  public setPriceRange(from: number | null, to: number | null) {
    this.priceFrom.set(from == null ? null : String(from));
    this.priceTo.set(to == null ? null : String(to));
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

  readonly draftSearch = signal<string>('');

  private readonly debouncedSearch = toSignal(
    toObservable(this.draftSearch).pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  private readonly syncDraftFromUrl = effect(() => {
    this.draftSearch.set(this.search() ?? '');
  });

  private readonly commitDebouncedToUrl = effect(() => {
    this.commitSearch(this.debouncedSearch());
  });

  private commitSearch(value: string) {
    const nextValue = value?.trim();
    this.search.set(nextValue);
    this.setDefaultPage();
  }
}
