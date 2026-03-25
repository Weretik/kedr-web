import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductBySlugDto } from '@storefront/contracts';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { ProductRepository } from '../../repositories/product.repository';

type ProductState = {
  data: ProductBySlugDto | undefined;
  loading: boolean;
  error: unknown | null;
};

const initialState: ProductState = {
  data: undefined,
  loading: false,
  error: null,
};

@Injectable()
export class ProductFacade {
  private readonly productRepository = inject(ProductRepository);
  private readonly route = inject(ActivatedRoute);
  private readonly refreshToken = signal(0);

  readonly productSlug = toSignal(
    this.route.paramMap.pipe(map((pm) => pm.get('productSlug') ?? undefined)),
    { initialValue: undefined },
  );

  private readonly requestParams = computed(() => ({
    slug: this.productSlug(),
    refresh: this.refreshToken(),
  }));

  private readonly productState = toSignal(
    toObservable(this.requestParams).pipe(
      switchMap(({ slug }) => {
        if (!slug) return of(initialState);

        return this.productRepository.getProductWithRetailPrice(slug).pipe(
          map(
            (data): ProductState => ({
              data,
              loading: false,
              error: null,
            }),
          ),
          startWith({
            data: undefined,
            loading: true,
            error: null,
          } satisfies ProductState),
          catchError((error) =>
            of({
              data: undefined,
              loading: false,
              error,
            } satisfies ProductState),
          ),
        );
      }),
    ),
    { initialValue: initialState },
  );

  readonly productResource = {
    value: computed(() => this.productState().data),
    isLoading: computed(() => this.productState().loading),
    error: computed(() => this.productState().error),
  } as const;

  public refresh(): void {
    this.refreshToken.update((value) => value + 1);
  }
}
