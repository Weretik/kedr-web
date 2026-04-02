import { Component } from '@angular/core';
import { PageHeaderConfig, PartnersBrands } from '@storefront/ui';

import { CompanyFeatures } from '../../sections/company-features/company-features';
import { CompanyOverview } from '../../sections/company-overview/company-overview';
import { CompanyStats } from '../../sections/company-stats/company-stats';
import { Faq } from '../../sections/faq/faq';
import { MainHero } from '../../sections/main-hero/main-hero';

declare const $localize: (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

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
  headerConfig: PageHeaderConfig = {
    title: $localize`:@@about.page.title:Про компанію`,
    breadcrumbs: [
      { label: $localize`:@@about.page.breadcrumb.about:Про нас` },
      { label: $localize`:@@about.page.breadcrumb.company:Про компанію` },
    ],
    showSearch: false,
  };
}
