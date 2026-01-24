import { Component, computed, inject } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { ProductListFacade } from './product-list.facade';
import { ProductListFiltersBar } from '../../sections/product-list-filters-bar/product-list-filters-bar';

@Component({
  selector: 'lib-product-list-page',
  imports: [PageHeader, ProductListFiltersBar],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
})
export class ProductListPage {
  headerConfig: PageHeaderConfig = {
    title: 'Каталог',
    breadcrumbs: [{ label: 'Каталог' }, { label: 'Товари' }],
    showSearch: true,
  };

  readonly productListFacade = inject(ProductListFacade);
  readonly productsResource = this.productListFacade.productsResource;

  readonly products = computed(
    () => this.productsResource.value()?.value ?? [],
  );

  readonly pagedInfo = computed(() => this.productsResource.value()?.pagedInfo);

  get searchValue(): string {
    return this.productListFacade.search() ?? '';
  }

  setSearchValue(value: string) {
    this.productListFacade.setSearch(value);
  }
}
