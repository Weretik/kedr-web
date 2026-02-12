import { Component, inject, computed } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

import { InStockFacade } from './in-stock.facade';

@Component({
  selector: 'lib-in-stock-products',
  imports: [ButtonModule, CarouselModule, TagModule],
  templateUrl: './in-stock-products.html',
  styleUrl: './in-stock-products.css',
})
export class InStockProducts {
  readonly cart = inject(CartFacade);
  readonly InStockFacade = inject(InStockFacade);
  readonly productsResource = this.InStockFacade.productsResource;

  readonly products = computed(
    () => this.productsResource.value()?.value ?? [],
  );

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
