import { Injectable, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ProductListRepository,
  type ProductListRowDto,
} from '@storefront/data-access';

import type { PagedResult } from '@shared/data-access';

@Injectable({ providedIn: 'root' })
export class InStockFacade {
  private readonly repo = inject(ProductListRepository);

  readonly productsResource = rxResource<PagedResult<ProductListRowDto>, null>({
    params: () => null,
    stream: () => this.repo.getInStock(),
  });
}
