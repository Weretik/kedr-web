import { Component, computed, inject } from '@angular/core';
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
  imports: [
    MainHero,
    CompanyFeatures,
    CompanyStats,
    PartnersBrands,
    Faq,
    CompanyOverview,
  ],
  templateUrl: './about-company.html',
  styleUrl: './about-company.css',
})
export class AboutCompany {
  private readonly translocoService = inject(TranslocoService);
  private readonly activeLanguage = toSignal(
    this.translocoService.langChanges$,
    {
      initialValue: this.translocoService.getActiveLang(),
    },
  );

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    this.activeLanguage();
    return {
      title: this.translocoService.translate('about.page.title'),
      breadcrumbs: [
        {
          label: this.translocoService.translate('about.page.breadcrumb.about'),
        },
        {
          label: this.translocoService.translate(
            'about.page.breadcrumb.company',
          ),
        },
      ],
      showSearch: false,
    };
  });
}
