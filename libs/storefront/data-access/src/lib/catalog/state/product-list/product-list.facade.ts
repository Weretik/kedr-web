import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { GetProductListQuery, ProductListRowDto } from '@storefront/contracts';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { mapProductListQueryToApi } from '../../mappers/product-list-query.mapper';
import { ProductListQuery } from '../../models/product-list-query.model';
import { ProductListRepository } from '../../repositories/product-list.repository';

import type { PagedResult } from '@shared/data-access';

type ProductListState = {
  data: PagedResult<ProductListRowDto> | null;
  loading: boolean;
  error: unknown | null;
};

const initialState: ProductListState = {
  data: null,
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class ProductListFacade {
  private readonly repo = inject(ProductListRepository);

  private readonly refreshToken = signal(0);
  private readonly _categorySlug = signal<string | null>(null);
  private readonly _query = signal<ProductListQuery>({
    search: undefined,
    inStock: 'true',
    isSale: undefined,
    isNew: undefined,
    priceFrom: undefined,
    priceTo: undefined,
    sort: 'id-asc',
    page: '1',
    pageSize: '50',
  });

  readonly categorySlug = this._categorySlug.asReadonly();

  readonly apiQuery = computed<GetProductListQuery>(() =>
    mapProductListQueryToApi(this._query()),
  );

  private readonly requestParams = computed(() => ({
    query: this.apiQuery(),
    categorySlug: this.categorySlug(),
    refresh: this.refreshToken(),
  }));

  readonly productsState = toSignal(
    toObservable(this.requestParams).pipe(
      switchMap(({ query, categorySlug }) =>
        this.repo.getList(query, categorySlug).pipe(
          map(
            (data): ProductListState => ({
              data,
              loading: false,
              error: null,
            }),
          ),
          startWith({
            data: null,
            loading: true,
            error: null,
          } satisfies ProductListState),
          catchError((error) =>
            of({
              data: null,
              loading: false,
              error,
            } satisfies ProductListState),
          ),
        ),
      ),
    ),
    { initialValue: initialState },
  );

  readonly products = computed(() => this.productsState().data);
  readonly isLoading = computed(() => this.productsState().loading);
  readonly error = computed(() => this.productsState().error);

  public setCategorySlug(slug: string | null): void {
    this._categorySlug.set(slug);
  }

  public setQuery(query: ProductListQuery): void {
    this._query.set(query);
  }

  public refresh(): void {
    this.refreshToken.update((value) => value + 1);
  }
}
