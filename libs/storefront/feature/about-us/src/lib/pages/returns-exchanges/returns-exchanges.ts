import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-returns-exchanges',
  imports: [PageHeader, TranslocoPipe],
  templateUrl: './returns-exchanges.html',
  styleUrl: './returns-exchanges.css',
})
export class ReturnsExchanges {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('returns.page.title'),
      breadcrumbs: [
        { label: this.transloco.translate('returns.page.breadcrumb.about') },
        { label: this.transloco.translate('returns.page.breadcrumb.current') },
      ],
      showSearch: false,
    };
  });
}
