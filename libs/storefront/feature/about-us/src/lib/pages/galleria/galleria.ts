import { Component } from '@angular/core';
import { InStockProducts, PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-galleria',
  imports: [InStockProducts, PageHeader],
  templateUrl: './galleria.html',
  styleUrl: './galleria.css',
})
export class Galleria {
  headerConfig: PageHeaderConfig = {
    title: 'Галерея',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Галерея' }],
    showSearch: false,
  };
}
