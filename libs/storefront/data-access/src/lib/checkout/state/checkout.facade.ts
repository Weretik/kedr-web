import { Injectable, inject, signal } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ApiError } from '@shared/util';
import { CheckoutCommand, OrderCreated } from '@storefront/contracts';
import { pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { OrdersApi } from '../api/orders.api';

@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  private readonly api = inject(OrdersApi);

  readonly loading = signal(false);
  readonly success = signal(false);

  readonly error = signal<string | null>(null);
  readonly validationError = signal<ApiError | null>(null);

  readonly orderId = signal<string | null>(null);

  reset() {
    this.success.set(false);
    this.error.set(null);
    this.validationError.set(null);
    this.loading.set(false);
    this.orderId.set(null);
  }

  readonly placeOrder = rxMethod<CheckoutCommand>(
    pipe(
      tap(() => {
        this.loading.set(true);
        this.success.set(false);
        this.error.set(null);
        this.validationError.set(null);
      }),
      switchMap((command) =>
        this.api.createOrder(command).pipe(
          tapResponse({
            next: (result: OrderCreated) => {
              this.orderId.set(result.orderId);
              this.success.set(true);
            },
            error: (err: ApiError) => {
              if (err.code === 'Validation') {
                this.validationError.set(err);
              } else {
                const trace = err.traceId ? ` (traceId: ${err.traceId})` : '';
                this.error.set(`${err.message}${trace}`);
              }
            },
            finalize: () => this.loading.set(false),
          }),
        ),
      ),
    ),
  );
}
