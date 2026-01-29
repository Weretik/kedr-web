import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { Image } from 'primeng/image';
import { InputNumber } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';

import { ProductFacade } from '../../state/product/product.facade';

@Component({
  selector: 'lib-product-page',
  imports: [
    PageHeader,
    ButtonDirective,
    ButtonIcon,
    ButtonLabel,
    Message,
    Skeleton,
    GalleriaModule,
    FormsModule,
    InputNumber,
    Image,
  ],
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
      title: product?.name ?? '...',
      breadcrumbs: [
        {
          label: 'Каталог',
          routerLink: ['/catalog', product?.categorySlug, 'products'],
        },
        { label: product?.name ?? '...' },
      ],
      showSearch: false,
      hideTitle: true,
    };
  });

  readonly images = computed<string[]>(() => {
    const product = this.productResource.value();

    if (!product) return [];

    return [product.photo, product.scheme];
  });
  selectedImageIndex: number = 0;
  quantity: number = 1;

  public broken = new Set<number>();
  public markBroken(i: number) {
    this.broken.add(i);
  }

  public onRetry(): void {
    this.facade.refresh();
  }
}
