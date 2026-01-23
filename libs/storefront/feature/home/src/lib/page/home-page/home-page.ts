import { Component } from '@angular/core';
import { InStockProducts } from '@storefront/feature/widgets';
import { PartnersBrands } from '@storefront/ui';

import { CompanyFeatures } from '../../sections/company-features/company-features';
import { CompanyStats } from '../../sections/company-stats/company-stats';
import { Faq } from '../../sections/faq/faq';
import { MainHero } from '../../sections/main-hero/main-hero';

@Component({
  selector: 'lib-home-page',
  imports: [
    MainHero,
    CompanyStats,
    Faq,
    CompanyFeatures,
    PartnersBrands,
    InStockProducts,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
