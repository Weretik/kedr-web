import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogApiService } from '@storefront/data-access';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { map } from 'rxjs';

@Component({
  selector: 'lib-product-list-page',
  imports: [AsyncPipe, PageHeader],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
  headerConfig: PageHeaderConfig = {
    title: 'Каталог',
    breadcrumbs: [{ label: 'Каталог' }, { label: 'Товари' }],
    showSearch: true,
  };

  readonly search = linkedQueryParam('search');
  readonly page = linkedQueryParam('page', { defaultValue: '1' });
  readonly sort = linkedQueryParam('sort', { defaultValue: 'name-asc' });

  private catalogApi = inject(CatalogApiService);

  products$ = this.catalogApi
    .getProducts({ Page: 1, PageSize: 20 })
    .pipe(map((r) => r.value ?? []));
}
