import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

type WholesaleFeatureItem = {
  titleKey: string;
  textKey: string;
};

type WholesaleFeaturesSectionData = {
  headingKey: string;
  subheadingKey: string;
  items: WholesaleFeatureItem[];
};

@Component({
  selector: 'lib-company-features-wholesale',
  imports: [TranslocoPipe],
  templateUrl: './company-features-wholesale.html',
  styleUrl: './company-features-wholesale.css',
})
export class CompanyFeaturesWholesale {
  readonly wholesaleFeaturesSectionData: WholesaleFeaturesSectionData = {
    headingKey: 'wholesale.company.heading',
    subheadingKey: 'wholesale.company.subheading',
    items: [
      {
        titleKey: 'wholesale.company.items.requestVolume.title',
        textKey: 'wholesale.company.items.requestVolume.text',
      },
      {
        titleKey: 'wholesale.company.items.expertRenovation.title',
        textKey: 'wholesale.company.items.expertRenovation.text',
      },
      {
        titleKey: 'wholesale.company.items.flexPricing.title',
        textKey: 'wholesale.company.items.flexPricing.text',
      },
      {
        titleKey: 'wholesale.company.items.officialSupport.title',
        textKey: 'wholesale.company.items.officialSupport.text',
      },
      {
        titleKey: 'wholesale.company.items.directCoordination.title',
        textKey: 'wholesale.company.items.directCoordination.text',
      },
      {
        titleKey: 'wholesale.company.items.stockReserve.title',
        textKey: 'wholesale.company.items.stockReserve.text',
      },
    ],
  };
}
