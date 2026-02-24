import { Component, computed, inject } from '@angular/core';
import { ProductListFacade } from '@storefront/data-access';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { ProductListFiltersBar } from '../../sections/product-list-filters-bar/product-list-filters-bar';

@Component({
  selector: 'lib-product-list-page',
  imports: [PageHeader, ProductListFiltersBar],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
  providers: [ProductListFacade],
})
export class ProductListPage {
  headerConfig: PageHeaderConfig = {
    title: 'Каталог',
    breadcrumbs: [
      { label: 'Каталог', routerLink: '/catalog/products' },
      { label: 'Товари' },
    ],
    showSearch: true,
  };

  readonly facade = inject(ProductListFacade);
  readonly productsResource = this.facade.productsResource;

  readonly products = computed(
    () => this.productsResource.value()?.value ?? [],
  );

  public get searchValue(): string {
    return this.facade.queryState.draftSearch();
  }

  public setSearchValue(value: string) {
    this.facade.queryState.setSearchDraft(value);
  }
}
