import { Component, computed, inject } from '@angular/core';

import { ProductListFacade } from '../../pages/product-list/product-list.facade';

@Component({
  selector: 'lib-product-list',
  imports: [],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  readonly productListFacade = inject(ProductListFacade);
  readonly productsResource = this.productListFacade.productsResource;

  readonly products = computed(
    () => this.productsResource.value()?.value ?? [],
  );

  readonly pagedInfo = computed(() => this.productsResource.value()?.pagedInfo);
}
