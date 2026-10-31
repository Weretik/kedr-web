import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PartnersBrands } from '@storefront/ui';

import { CompanyFeaturesWholesale } from '../sections/company-features-wholesale/company-features-wholesale';
import { WholesaleHero } from '../sections/wholesale-hero/wholesale-hero';

@Component({
  selector: 'lib-wholesale-page',
  imports: [WholesaleHero, CompanyFeaturesWholesale, PartnersBrands],
  templateUrl: './wholesale-page.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './wholesale-page.css',
})
export class WholesalePage {}
