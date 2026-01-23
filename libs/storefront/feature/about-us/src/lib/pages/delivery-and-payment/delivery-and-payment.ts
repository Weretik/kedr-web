import { Component } from '@angular/core';
import { InStockProducts } from '@storefront/feature/widgets';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-delivery-and-payment',
  imports: [PageHeader, InStockProducts],
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
