import { Component } from '@angular/core';
import { InStockProducts, PageHeader, PageHeaderConfig } from '@storefront/ui';

import { ContactUs } from '../sections/contact-us/contact-us';
import { OurTeam } from '../sections/our-team/our-team';

@Component({
  selector: 'lib-contacts-page',
  imports: [PageHeader, ContactUs, OurTeam, InStockProducts],
  templateUrl: './contacts-page.html',
  styleUrl: './contacts-page.css',
})
export class ContactsPage {
  headerConfig: PageHeaderConfig = {
    title: 'Контакти',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Контакти' }],
    showSearch: false,
  };
}
