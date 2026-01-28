import { Component, computed, inject } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { ProductFacade } from '../../state/product/product.facade';

@Component({
  selector: 'lib-product-page',
  imports: [PageHeader],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
  providers: [ProductFacade],
})
export class ProductPage {
  readonly facade = inject(ProductFacade);
  readonly productResource = this.facade.productResource;

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    const product = this.productResource.value();
    return {
      title: 'Каталог',
      breadcrumbs: [
        { label: 'Каталог' },
        { label: 'Товари' },
        { label: product?.name ?? '...' },
      ],
      showSearch: false,
    };
  });
}
