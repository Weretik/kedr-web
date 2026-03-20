import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { PartnersBrands } from '@storefront/ui';
import { map } from 'rxjs';

import { CITY_TO_LOCATION_TEXT } from './city-to-location-text';
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

  private readonly city = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('city') ?? '')),
    { initialValue: '' },
  );

  readonly locationText = computed(() => {
    const key = this.city().toLowerCase().trim();
    return CITY_TO_LOCATION_TEXT[key] ?? 'в Україні';
  });
}
