import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';

@Component({
  selector: 'lib-public-offer',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './public-offer.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
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
