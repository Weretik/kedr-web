import { Component } from '@angular/core';
import { InStockProducts } from '@storefront/feature/widgets';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'lib-returns-exchanges',
  imports: [InStockProducts, PageHeader, Tag],
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
