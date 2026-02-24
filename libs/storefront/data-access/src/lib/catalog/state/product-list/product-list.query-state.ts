import { Injectable, computed, effect, signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ProductListQuery, ProductListSortUi } from '@storefront/contracts';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductListQueryState {
  private readonly router = inject(Router);

  // --- query params (source of truth) ---
  readonly search = linkedQueryParam('search');
  readonly page = linkedQueryParam('page', { defaultValue: '1' });
  readonly pageSize = linkedQueryParam('pageSize', { defaultValue: '20' });
  readonly sort = linkedQueryParam('sort', { defaultValue: 'name-asc' });

  readonly inStock = linkedQueryParam('inStock');
  readonly isSale = linkedQueryParam('isSale');
  readonly isNew = linkedQueryParam('isNew');

  readonly priceFrom = linkedQueryParam('priceFrom');
  readonly priceTo = linkedQueryParam('priceTo');

  // --- public derived query (for mapping to API) ---
  readonly query = computed<ProductListQuery>(() => ({
    search: this.search() ?? undefined,

    inStock: this.boolParam(this.inStock()),
    isSale: this.boolParam(this.isSale()),
    isNew: this.boolParam(this.isNew()),

    priceFrom: this.priceFrom() ?? undefined,
    priceTo: this.priceTo() ?? undefined,

    sort: (this.sort() ?? 'name-asc') as ProductListSortUi,

    page: this.page() ?? '1',
    pageSize: this.pageSize() ?? '20',
  }));

  // --- commands (domain-ish;) ---
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
    this.inStock.set(checked ? 'true' : null);
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

  goToCategory(slug: string): void {
    this.router.navigate(['/catalog', slug, 'products'], {
      queryParamsHandling: 'merge',
      queryParams: { page: 1 },
    });
  }

  clear(): void {
    this.search.set(null);

    this.inStock.set(null);
    this.isSale.set(null);
    this.isNew.set(null);

    this.priceFrom.set(null);
    this.priceTo.set(null);

    this.sort.set('name-asc');
    this.page.set('1');
    this.pageSize.set('20');

    this.router.navigate(['/catalog', 'products']);
  }

  // --- debounced search UX (draft -> debounce -> commit to URL) ---
  readonly draftSearch = signal<string>('');

  private readonly debouncedSearch = toSignal(
    toObservable(this.draftSearch).pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  private readonly syncDraftFromUrl = effect(() => {
    // URL -> draft
    this.draftSearch.set(this.search() ?? '');
  });

  private readonly commitDebouncedToUrl = effect(() => {
    // draft (debounced) -> URL
    this.commitSearch(this.debouncedSearch());
  });

  public setSearchDraft(value: string): void {
    this.draftSearch.set(value ?? '');
  }

  // --- internals ---
  private setDefaultPage(): void {
    this.page.set('1');
  }

  private commitSearch(value: string): void {
    const next = value?.trim() ?? '';
    const current = (this.search() ?? '').trim();

    if (next === current) return;

    this.search.set(next.length > 0 ? next : null);
    this.setDefaultPage();
  }

  private boolParam(value: string | null): 'true' | 'false' | undefined {
    if (value === 'true' || value === 'false') return value;
    return undefined;
  }
}
