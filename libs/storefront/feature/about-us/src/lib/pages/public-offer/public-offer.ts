import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';

@Component({
  selector: 'lib-public-offer',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './public-offer.html',
  styleUrl: './public-offer.css',
})
export class PublicOffer {
  private readonly localeNavigation = inject(LocaleNavigationService);

  protected publicOfferLink(): string[] {
    return this.localeNavigation.localizedSegments('public-offer');
  }

  protected privacyPolicyLink(): string[] {
    return this.localeNavigation.localizedSegments('privacy-policy');
  }
}
