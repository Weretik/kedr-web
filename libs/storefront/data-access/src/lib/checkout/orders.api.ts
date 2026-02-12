import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutDto, OrderCreatedDto } from './models/checkout-dto';

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly http = inject(HttpClient);

  public createOrder(dto: CheckoutDto): Observable<OrderCreatedDto> {
    return this.http.post<OrderCreatedDto>('/api/orders', dto);
  }
}
