import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ProductListQuery, ProductListSortUi } from '@storefront/data-access';
import { LocaleNavigationService } from '@storefront/util';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductListPageState {
  private readonly router = inject(Router);
  private readonly localeNavigation = inject(LocaleNavigationService);

  readonly search = linkedQueryParam('search');
  readonly page = linkedQueryParam('page', { defaultValue: '1' });
  readonly pageSize = linkedQueryParam('pageSize', { defaultValue: '50' });
  readonly sort = linkedQueryParam('sort', { defaultValue: 'id-asc' });

  readonly inStock = linkedQueryParam('inStock', { defaultValue: 'true' });
  readonly isSale = linkedQueryParam('isSale');
  readonly isNew = linkedQueryParam('isNew');

  readonly priceFrom = linkedQueryParam('priceFrom');
  readonly priceTo = linkedQueryParam('priceTo');

  readonly query = computed<ProductListQuery>(() => ({
    search: this.search() ?? undefined,

    inStock: this.boolParam(this.inStock()),
    isSale: this.boolParam(this.isSale()),
    isNew: this.boolParam(this.isNew()),

    priceFrom: this.priceFrom() ?? undefined,
    priceTo: this.priceTo() ?? undefined,

    sort: (this.sort() ?? 'id-asc') as ProductListSortUi,

    page: this.page() ?? '1',
    pageSize: this.pageSize() ?? '50',
  }));

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

  setPage(page: number): void {
    this.page.set(String(page));
  }

  setPageSize(size: number): void {
    this.pageSize.set(String(size));
    this.setDefaultPage();
  }

  setSort(sort: ProductListSortUi): void {
    this.sort.set(sort);
    this.setDefaultPage();
  }

  setInStock(checked: boolean): void {
    this.inStock.set(checked ? 'true' : 'false');
    this.setDefaultPage();
  }

  setIsSale(checked: boolean): void {
    this.isSale.set(checked ? 'true' : null);
    this.setDefaultPage();
  }

  setIsNew(checked: boolean): void {
    this.isNew.set(checked ? 'true' : null);
    this.setDefaultPage();
  }

  setPriceRange(priceFrom: number | null, priceTo: number | null): void {
    this.priceFrom.set(priceFrom == null ? null : String(priceFrom));
    this.priceTo.set(priceTo == null ? null : String(priceTo));
    this.setDefaultPage();
  }

  setSearchDraft(value: string): void {
    this.draftSearch.set(value ?? '');
  }

  commitSearch(value: string): void {
    const next = value?.trim() ?? '';
    const current = (this.search() ?? '').trim();

    if (next === current) return;

    this.search.set(next.length > 0 ? next : null);
    this.setDefaultPage();

    void this.router.navigate(
      this.localeNavigation.localizedSegments('catalog', 'products'),
      {
        queryParams: {
          search: next.length > 0 ? next : null,
          page: 1,
        },
        queryParamsHandling: 'merge',
      },
    );
  }

  goToCategory(slug: string): void {
    this.draftSearch.set('');
    const currentScrollY =
      typeof window !== 'undefined' ? window.scrollY : undefined;

    void this.router
      .navigate(
        this.localeNavigation.localizedSegments('catalog', slug, 'products'),
        {
          queryParams: {
            page: 1,
            search: '',
          },
          queryParamsHandling: 'merge',
        },
      )
      .then((navigated) => {
        if (
          !navigated ||
          currentScrollY == null ||
          typeof window === 'undefined'
        ) {
          return;
        }

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({ top: currentScrollY, behavior: 'auto' });
          });
        });
      });
  }

  clear(): void {
    this.search.set(null);

    this.inStock.set('true');
    this.isSale.set(null);
    this.isNew.set(null);

    this.priceFrom.set(null);
    this.priceTo.set(null);

    this.sort.set('id-asc');
    this.page.set('1');
    this.pageSize.set('20');

    void this.router.navigate(
      this.localeNavigation.localizedSegments('catalog', 'products'),
    );
  }

  goToLocaleHome(): void {
    void this.router.navigate(this.localeNavigation.localizedSegments());
  }

  private setDefaultPage(): void {
    this.page.set('1');
  }

  private boolParam(value: string | null): 'true' | 'false' | undefined {
    if (value === 'true' || value === 'false') return value;
    return undefined;
  }
}
