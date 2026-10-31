import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeaderConfig, PartnersBrands } from '@storefront/ui';

import { CompanyFeatures } from '../../sections/company-features/company-features';
import { CompanyOverview } from '../../sections/company-overview/company-overview';
import { CompanyStats } from '../../sections/company-stats/company-stats';
import { Faq } from '../../sections/faq/faq';
import { MainHero } from '../../sections/main-hero/main-hero';

@Component({
  selector: 'lib-about-company',
  imports: [MainHero, CompanyFeatures, CompanyStats, PartnersBrands, Faq, CompanyOverview],
  templateUrl: './about-company.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './about-company.css',
})
export class AboutCompany {
  private readonly translocoService = inject(TranslocoService);
  private readonly activeLanguage = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang(),
  });

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    this.activeLanguage();
    return {
      title: this.translocoService.translate('about.page.title'),
      breadcrumbs: [
        {
          label: this.translocoService.translate('about.page.breadcrumb.about'),
        },
        {
          label: this.translocoService.translate('about.page.breadcrumb.company'),
        },
      ],
      showSearch: false,
    };
  });
}
