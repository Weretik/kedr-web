import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-delivery-and-payment',
  imports: [PageHeader, RouterLink, TranslocoPipe],
  templateUrl: './delivery-and-payment.html',
  styleUrl: './delivery-and-payment.css',
})
export class DeliveryAndPayment {
  private readonly transloco = inject(TranslocoService);
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('delivery.page.title'),
      breadcrumbs: [
        { label: this.transloco.translate('delivery.page.breadcrumb.about') },
        { label: this.transloco.translate('delivery.page.breadcrumb.current') },
      ],
      showSearch: false,
    };
  });

  protected publicOfferLink(): string[] {
    return this.localeNavigation.localizedSegments('public-offer');
  }
}
