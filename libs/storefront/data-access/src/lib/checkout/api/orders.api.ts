import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CheckoutCommand, OrderCreated } from '@storefront/contracts';
import { Observable, map } from 'rxjs';

import { parseOrderCreated } from '../contracts/order-response.schema';

import type { operations } from '@shared/api-contracts';

type CreateQuickOrderRequest =
  operations['createQuickOrder']['requestBody']['content']['application/json'];

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly http = inject(HttpClient);

  public createOrder(command: CheckoutCommand): Observable<OrderCreated> {
    const request: CreateQuickOrderRequest = command;
    return this.http
      .post<unknown>('/api/orders', request)
      .pipe(map((response) => parseOrderCreated(response)));
  }
}
