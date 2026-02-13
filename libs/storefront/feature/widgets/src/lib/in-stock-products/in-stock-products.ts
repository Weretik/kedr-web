import { Component, inject, computed } from '@angular/core';
import {
  CartFacade,
  cartLineFromListRow,
  ProductListRowDto,
} from '@storefront/data-access';
import { ButtonModule } from 'primeng/button';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { Skeleton } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { InStockFacade } from './in-stock.facade';

@Component({
  selector: 'lib-in-stock-products',
  imports: [ButtonModule, CarouselModule, TagModule, Skeleton],
  templateUrl: './in-stock-products.html',
  styleUrl: './in-stock-products.css',
})
export class InStockProducts {
  readonly cart = inject(CartFacade);
  readonly InStockFacade = inject(InStockFacade);
  readonly productsResource = this.InStockFacade.productsResource;

  readonly products = computed(() => {
    if (this.productsResource.error()) return [];
    return this.productsResource.value()?.value ?? [];
  });
  readonly isLoading = computed(() => this.productsResource.isLoading());
  readonly error = computed(() => this.productsResource.error());

  readonly responsiveOptions: CarouselResponsiveOptions[] = [
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '960px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 },
  ];

  public addToCart(product: ProductListRowDto) {
    this.cart.addToCart(cartLineFromListRow(product, 1));
  }
}
