import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductListRowDto } from '@storefront/contracts';
import {
  CartFacade,
  cartLineFromListRow,
  ProductListFacade,
} from '@storefront/data-access';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Message } from 'primeng/message';
import { Paginator } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';

import { ProductListPageState } from '../../pages/product-list/product-list.page-state';

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
  layout: 'list' | 'grid' = 'grid';
  options: string[] = ['list', 'grid'];

  readonly skeletonCount = 6;
  readonly skeletonArray = Array.from({ length: this.skeletonCount });

  readonly cart = inject(CartFacade);
  readonly facade = inject(ProductListFacade);
  readonly pageState = inject(ProductListPageState);

  readonly products = computed(() => {
    if (this.facade.error()) return [];
    return this.facade.products()?.value ?? [];
  });
  readonly pagedInfo = computed(() => {
    if (this.facade.error()) return undefined;
    return this.facade.products()?.pagedInfo;
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
      this.pageState.setPageSize(nextPageSize);
      return;
    }
    this.pageState.setPage(page1);
  }

  onRetry(): void {
    this.facade.refresh();
  }
  onResetFilters(): void {
    this.pageState.clear();
  }

  public addToCart(product: ProductListRowDto) {
    this.cart.addToCart(cartLineFromListRow(product, 1));
  }
}
