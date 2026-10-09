import { Injectable, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductListRepository, type ProductListItem } from '@storefront/data-access';

import type { PagedResult } from '@shared/data-access';

@Injectable({ providedIn: 'root' })
export class InStockFacade {
  private readonly repo = inject(ProductListRepository);

  readonly productsResource = rxResource<PagedResult<ProductListItem>, null>({
    params: () => null,
    stream: () => this.repo.getInStock(),
  });
}
