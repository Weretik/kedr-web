import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { PartnersBrands } from '@storefront/ui';
import { map } from 'rxjs';

import { CompanyFeatures } from '../sections/company-features/company-features';
import { Hero } from '../sections/hero/hero';

@Component({
  selector: 'lib-regions',
  imports: [Hero, PartnersBrands, CompanyFeatures],
  templateUrl: './regions.html',
  styleUrl: './regions.css',
})
export class Regions {
  private readonly route = inject(ActivatedRoute);
  private readonly transloco = inject(TranslocoService);

  private readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city') ?? '')),
    { initialValue: '' },
  );
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly locationText = computed(() => {
    this.activeLang();
    const key = this.city().toLowerCase().trim();
    const locationKey = key
      ? `regions.location.${key}`
      : 'regions.location.default';
    const translated = this.transloco.translate(locationKey);

    if (translated !== locationKey) {
      return translated;
    }

    return this.transloco.translate('regions.location.default');
  });
}
