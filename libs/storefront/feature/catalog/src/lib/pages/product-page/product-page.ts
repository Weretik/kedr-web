import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductBySlugDto } from '@storefront/contracts';
import {
  CartFacade,
  cartLineFromBySlug,
  ProductFacade,
} from '@storefront/data-access';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { Image } from 'primeng/image';
import { InputNumber } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';

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
  private readonly location = inject(Location);
  private readonly cart = inject(CartFacade);
  public readonly facade = inject(ProductFacade);
  private readonly productResource = this.facade.productResource;
  private readonly router = inject(Router);

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    const product = this.productResource.value();
    const categoryBreadcrumbs =
      product?.breadcrumbs?.map((breadcrumb) => ({
        label: breadcrumb.name,
        routerLink: ['/catalog', breadcrumb.slug, 'products'],
      })) ?? [];

    return {
      title: product?.name ?? '...',
      breadcrumbs: [
        {
          label: 'Каталог',
          linkClass: 'cursor-pointer',
          command: () => {
            if (window.history.length > 1) {
              this.location.back();
            } else {
              void this.router.navigate(['/']);
            }
          },
        },
        ...categoryBreadcrumbs,
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
  public selectedImageIndex: number = 0;
  public quantity = signal<number>(1);

  public broken = new Set<number>();
  public markBroken(i: number) {
    this.broken.add(i);
  }

  public onRetry(): void {
    this.facade.refresh();
  }

  addToCart(product: ProductBySlugDto, qty: number = this.quantity()) {
    this.cart.addToCart(cartLineFromBySlug(product, qty));
  }
}
