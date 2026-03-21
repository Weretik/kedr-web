import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-delivery-and-payment',
  imports: [PageHeader, RouterLink],
  templateUrl: './delivery-and-payment.html',
  styleUrl: './delivery-and-payment.css',
})
export class DeliveryAndPayment {
  headerConfig: PageHeaderConfig = {
    title: 'Доставка та оплата',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Доставка та оплата' }],
    showSearch: false,
  };
}
