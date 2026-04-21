import { Injectable, inject } from '@angular/core';
import { GetProductListQuery, ProductSort } from '@storefront/contracts';
import { catchError, firstValueFrom, of, take } from 'rxjs';

import { RETAIL_PRICE_TYPE_ID } from '../../config/catalog.constants';
import { ProductListRepository } from '../../repositories/product-list.repository';

@Injectable({ providedIn: 'root' })
export class ProductListWarmupService {
  private readonly repo = inject(ProductListRepository);
  private isWarmedUp = false;

  warmUpCatalogList(): void {
    if (this.isWarmedUp) return;
    this.isWarmedUp = true;

    const query: GetProductListQuery = {
      PriceTypeId: RETAIL_PRICE_TYPE_ID,
      Page: 1,
      PageSize: 4,
      InStock: true,
      Sort: ProductSort.IdAsc,
    };

    void firstValueFrom(
      this.repo.getList(query).pipe(
        take(1),
        catchError(() => of(null)),
      ),
    );
  }
}
