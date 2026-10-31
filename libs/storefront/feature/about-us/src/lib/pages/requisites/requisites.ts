import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';

@Component({
  selector: 'lib-requisites',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './requisites.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './requisites.css',
})
export class Requisites {
  private readonly localeNavigation = inject(LocaleNavigationService);

  protected privacyPolicyLink(): string[] {
    return this.localeNavigation.localizedSegments('privacy-policy');
  }

  protected publicOfferLink(): string[] {
    return this.localeNavigation.localizedSegments('public-offer');
  }
}
