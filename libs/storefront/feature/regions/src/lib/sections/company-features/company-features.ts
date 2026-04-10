import { Component, Input, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

type FeatureItem = {
  titleKey: string;
  textKey: string;
};

type FeaturesSectionData = {
  subheadingKey: string;
  items: FeatureItem[];
};

@Component({
  selector: 'lib-company-features',
  imports: [TranslocoPipe],
  templateUrl: './company-features.html',
  styleUrl: './company-features.css',
})
export class CompanyFeatures {
  @Input() locationText = '';
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly wholesaleFeaturesSectionData: FeaturesSectionData = {
    subheadingKey: 'regions.company.subheading',
    items: [
      {
        titleKey: 'regions.company.items.requestVolume.title',
        textKey: 'regions.company.items.requestVolume.text',
      },
      {
        titleKey: 'regions.company.items.expertRenovation.title',
        textKey: 'regions.company.items.expertRenovation.text',
      },
      {
        titleKey: 'regions.company.items.flexPricing.title',
        textKey: 'regions.company.items.flexPricing.text',
      },
      {
        titleKey: 'regions.company.items.officialSupport.title',
        textKey: 'regions.company.items.officialSupport.text',
      },
      {
        titleKey: 'regions.company.items.directCoordination.title',
        textKey: 'regions.company.items.directCoordination.text',
      },
      {
        titleKey: 'regions.company.items.stockReserve.title',
        textKey: 'regions.company.items.stockReserve.text',
      },
    ],
  };

  readonly heading = computed(() => {
    this.activeLang();
    return this.transloco.translate('regions.company.heading', {
      location: this.locationText,
    });
  });
}
