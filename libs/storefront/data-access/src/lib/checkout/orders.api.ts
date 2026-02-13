import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutDto } from './models/orders.requests';
import { OrderCreatedDto } from './models/orders.responses';

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly http = inject(HttpClient);

  public createOrder(dto: CheckoutDto): Observable<OrderCreatedDto> {
    return this.http.post<OrderCreatedDto>('/api/orders', dto);
  }
}
