import { Component, effect, inject, input } from '@angular/core';
import { ProductListFacade } from '@storefront/data-access';

import { ProductListPageState } from './product-list.page-state';
import { CategoryNavigation } from '../../sections/category-navigation/category-navigation';
import { ProductList } from '../../sections/product-list/product-list';
import { ProductListFiltersBar } from '../../sections/product-list-filters-bar/product-list-filters-bar';

@Component({
  selector: 'lib-product-list-page',
  imports: [CategoryNavigation, ProductListFiltersBar, ProductList],
  templateUrl: './product-list.page.html',
  styleUrl: './product-list.page.css',
})
export class ProductListPage {
  readonly categorySlug = input<string | null>(null);

  readonly facade = inject(ProductListFacade);
  readonly pageState = inject(ProductListPageState);

  private readonly syncFacadeQuery = effect(() => {
    this.facade.setQuery(this.pageState.query());
  });
}
