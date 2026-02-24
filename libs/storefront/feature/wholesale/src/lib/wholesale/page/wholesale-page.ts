import { Component } from '@angular/core';
import { PartnersBrands } from '@storefront/ui';

import { CompanyFeaturesWholesale } from '../sections/company-features-wholesale/company-features-wholesale';
import { WholesaleHero } from '../sections/wholesale-hero/wholesale-hero';

@Component({
  selector: 'lib-wholesale-page',
  imports: [WholesaleHero, CompanyFeaturesWholesale, PartnersBrands],
  templateUrl: './wholesale-page.html',
  styleUrl: './wholesale-page.css',
})
export class WholesalePage {}
