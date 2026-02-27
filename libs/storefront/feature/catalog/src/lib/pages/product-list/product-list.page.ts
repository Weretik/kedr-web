import { Component, computed, inject, input } from '@angular/core';
import { ProductListFacade } from '@storefront/data-access';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { ProductListFiltersBar } from '../../sections/product-list-filters-bar/product-list-filters-bar';

@Component({
  selector: 'lib-product-list-page',
  imports: [PageHeader, ProductListFiltersBar],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
})
export class ProductListPage {
  readonly categorySlug = input<string | null>(null);

  headerConfig: PageHeaderConfig = {
    title: 'Каталог',
    breadcrumbs: [
      { label: 'Каталог', routerLink: '/catalog/products' },
      { label: 'Товари' },
    ],
  };

  readonly facade = inject(ProductListFacade);
  readonly productsResource = this.facade.productsResource;

  readonly products = computed(
    () => this.productsResource.value()?.value ?? [],
  );
}
