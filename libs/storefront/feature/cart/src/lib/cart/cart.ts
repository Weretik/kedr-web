import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { CartFacade, CartUiFacade } from '@storefront/data-access';
import { LocaleNavigationService } from '@storefront/util';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'lib-cart',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    StyleClassModule,
    InputNumberModule,
    RouterLink,
    TranslocoPipe,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly cart = inject(CartFacade);
  readonly cartUi = inject(CartUiFacade);
  readonly router = inject(Router);
  private readonly localeNavigation = inject(LocaleNavigationService);

  public goToCheckout() {
    this.cartUi.close();
    this.router.navigate(this.localeNavigation.localizedSegments('checkout'));
  }

  protected productLink(slug: string): string[] {
    return this.localeNavigation.localizedSegments('catalog', 'product', slug);
  }
}
