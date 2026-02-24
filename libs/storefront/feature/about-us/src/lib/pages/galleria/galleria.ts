import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-galleria',
  imports: [PageHeader],
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
