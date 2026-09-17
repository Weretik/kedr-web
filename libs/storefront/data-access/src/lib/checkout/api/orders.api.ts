import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CheckoutDto, OrderCreatedDto } from '@storefront/contracts';
import { Observable } from 'rxjs';

import type { operations } from '@shared/api-contracts';

type CreateQuickOrderRequest =
  operations['createQuickOrder']['requestBody']['content']['application/json'];
type CreateQuickOrderResponse =
  operations['createQuickOrder']['responses'][200]['content']['application/json'];

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly http = inject(HttpClient);

  public createOrder(dto: CheckoutDto): Observable<OrderCreatedDto> {
    const request: CreateQuickOrderRequest = dto;
    return this.http.post<CreateQuickOrderResponse>('/api/orders', request);
  }
}
