import { inject, Injectable } from '@angular/core';

import { CatalogApiService } from '../catalog-api.service';
import { RETAIL_PRICE_TYPE_ID } from '../constances/catalog.constants';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  private readonly api = inject(CatalogApiService);

  getProductWithRetailPrice(productSlug: string) {
    return this.api.getProductBySlug(RETAIL_PRICE_TYPE_ID, productSlug);
  }
}
