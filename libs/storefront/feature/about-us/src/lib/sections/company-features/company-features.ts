import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

type CompanyFeatureItem = {
  title: string;
  text: string;
};

type CompanyFeaturesSectionData = {
  heading: string;
  subheading: string;
  items: CompanyFeatureItem[];
};

@Component({
  selector: 'lib-company-features',
  imports: [],
  templateUrl: './company-features.html',
  styleUrl: './company-features.css',
})
export class CompanyFeatures {
  private readonly translocoService = inject(TranslocoService);
  private readonly activeLanguage = toSignal(
    this.translocoService.langChanges$,
    {
      initialValue: this.translocoService.getActiveLang(),
    },
  );

  readonly companyFeaturesSectionData = computed<CompanyFeaturesSectionData>(
    () => {
      this.activeLanguage();
      return {
        heading: this.translocoService.translate('about.features.heading'),
        subheading: this.translocoService.translate(
          'about.features.subheading',
        ),
        items: [
          {
            title: this.translocoService.translate(
              'about.features.item1.title',
            ),
            text: this.translocoService.translate('about.features.item1.text'),
          },
          {
            title: this.translocoService.translate(
              'about.features.item2.title',
            ),
            text: this.translocoService.translate('about.features.item2.text'),
          },
          {
            title: this.translocoService.translate(
              'about.features.item3.title',
            ),
            text: this.translocoService.translate('about.features.item3.text'),
          },
          {
            title: this.translocoService.translate(
              'about.features.item4.title',
            ),
            text: this.translocoService.translate('about.features.item4.text'),
          },
          {
            title: this.translocoService.translate(
              'about.features.item5.title',
            ),
            text: this.translocoService.translate('about.features.item5.text'),
          },
          {
            title: this.translocoService.translate(
              'about.features.item6.title',
            ),
            text: this.translocoService.translate('about.features.item6.text'),
          },
        ],
      };
    },
  );
}
