import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-about-company',
  imports: [PageHeader],
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
