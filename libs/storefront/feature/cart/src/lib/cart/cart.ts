import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartFacade, CartUiFacade } from '@storefront/data-access';
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
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly cart = inject(CartFacade);
  readonly cartUi = inject(CartUiFacade);
  readonly router = inject(Router);

  public goToCheckout() {
    this.cartUi.close();
    this.router.navigate(['/checkout']);
  }
}
