import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CartFacade,
  cartLineFromListRow,
  ProductListRowDto,
} from '@storefront/data-access';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Message } from 'primeng/message';
import { Paginator } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ProductListFacade } from '../../state/product-list/product-list.facade';

@Component({
  selector: 'lib-product-list',
  imports: [
    DataView,
    SelectButton,
    NgClass,
    Tag,
    ButtonDirective,
    FormsModule,
    Message,
    Paginator,
    Skeleton,
    ButtonIcon,
    ButtonLabel,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  layout: 'list' | 'grid' = 'list';
  options: string[] = ['list', 'grid'];

  readonly skeletonCount = 6;
  readonly skeletonArray = Array.from({ length: this.skeletonCount });

  readonly cart = inject(CartFacade);
  readonly facade = inject(ProductListFacade);
  readonly productsResource = this.facade.productsResource;

  readonly products = computed(() => {
    if (this.productsResource.error()) return [];
    return this.productsResource.value()?.value ?? [];
  });
  readonly pagedInfo = computed(() => {
    if (this.productsResource.error()) return undefined;
    return this.productsResource.value()?.pagedInfo;
  });

  readonly first = computed(() => {
    const p = this.pagedInfo();
    return p ? (p.pageNumber - 1) * p.pageSize : 0;
  });
  readonly rows = computed(() => this.pagedInfo()?.pageSize ?? 20);
  readonly totalRecords = computed(() => this.pagedInfo()?.totalRecords ?? 0);

  setPageFromPaginator(event: { page?: number; rows?: number }) {
    const current = this.pagedInfo();
    if (!current) return;

    const nextPageSize = event.rows ?? current.pageSize;
    const page0 = event.page ?? 0;
    const page1 = page0 + 1;

    if (nextPageSize !== current.pageSize) {
      this.facade.queryState.setPageSize(nextPageSize);
      return;
    }
    this.facade.queryState.setPage(page1);
  }

  onRetry(): void {
    this.facade.refresh();
  }
  onResetFilters(): void {
    this.facade.queryState.clear();
  }

  public addToCart(product: ProductListRowDto) {
    this.cart.addToCart(cartLineFromListRow(product, 1));
  }
}
