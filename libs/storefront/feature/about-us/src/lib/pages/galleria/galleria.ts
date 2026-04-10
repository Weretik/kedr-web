import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-galleria',
  imports: [PageHeader],
  templateUrl: './galleria.html',
  styleUrl: './galleria.css',
})
export class Galleria {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('galleria.page.title'),
      breadcrumbs: [
        { label: this.transloco.translate('galleria.page.breadcrumb.about') },
        { label: this.transloco.translate('galleria.page.breadcrumb.current') },
      ],
      showSearch: false,
    };
  });
}
