import { Injectable, inject, signal } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { CheckoutDto, OrdersApi } from '@storefront/data-access';
import { pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  private readonly api = inject(OrdersApi);

  readonly loading = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);

  readonly placeOrder = rxMethod<CheckoutDto>(
    pipe(
      tap(() => {
        this.loading.set(true);
        this.success.set(false);
        this.error.set(null);
      }),
      switchMap((dto) =>
        this.api.createOrder(dto).pipe(
          tapResponse({
            next: () => this.success.set(true),
            error: () => this.error.set('Order failed'),
            finalize: () => this.loading.set(false),
          }),
        ),
      ),
    ),
  );
}
