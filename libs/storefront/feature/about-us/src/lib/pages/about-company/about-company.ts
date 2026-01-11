import { Component } from '@angular/core';
import { InStockProducts, PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-about-company',
  imports: [InStockProducts, PageHeader],
  templateUrl: './about-company.html',
  styleUrl: './about-company.css',
})
export class AboutCompany {
  headerConfig: PageHeaderConfig = {
    title: 'Про компанію',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Про компанію' }],
    showSearch: false,
  };
}
