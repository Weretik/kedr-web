import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-returns-exchanges',
  imports: [PageHeader],
  templateUrl: './returns-exchanges.html',
  styleUrl: './returns-exchanges.css',
})
export class ReturnsExchanges {
  headerConfig: PageHeaderConfig = {
    title: 'Повернення та обмін',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Повернення та обмін' }],
    showSearch: false,
  };
}
