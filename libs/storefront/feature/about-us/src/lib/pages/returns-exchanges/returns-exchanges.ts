import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-returns-exchanges',
  imports: [PageHeader, TranslocoPipe, RouterLink],
  templateUrl: './returns-exchanges.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
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
