import { Component } from '@angular/core';
import { PageHeaderConfig, PartnersBrands } from '@storefront/ui';

import { CompanyFeatures } from '../../sections/company-features/company-features';
import { CompanyStats } from '../../sections/company-stats/company-stats';
import { Faq } from '../../sections/faq/faq';
import { MainHero } from '../../sections/main-hero/main-hero';

@Component({
  selector: 'lib-about-company',
  imports: [MainHero, CompanyFeatures, CompanyStats, PartnersBrands, Faq],
  templateUrl: './about-company.html',
  styleUrl: './about-company.css',
})
export class AboutCompany {
  headerConfig: PageHeaderConfig = {
    title: 'Про компанію',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Про компанію' }],
    showSearch: false,
  };
}
