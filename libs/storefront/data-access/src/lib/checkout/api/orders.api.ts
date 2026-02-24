import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CheckoutDto, OrderCreatedDto } from '@storefront/contracts';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly http = inject(HttpClient);

  public createOrder(dto: CheckoutDto): Observable<OrderCreatedDto> {
    return this.http.post<OrderCreatedDto>('/api/orders', dto);
  }
}
