import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { LocaleNavigationService } from '@storefront/util';

@Component({
  selector: 'lib-delivery-and-payment',
  imports: [PageHeader, RouterLink, TranslocoPipe],
  templateUrl: './delivery-and-payment.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
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
