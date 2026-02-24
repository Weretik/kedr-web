import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-delivery-and-payment',
  imports: [PageHeader],
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
