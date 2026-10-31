import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';

@Component({
  selector: 'lib-privacy-policy',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './privacy-policy.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy {
  private readonly localeNavigation = inject(LocaleNavigationService);

  protected publicOfferLink(): string[] {
    return this.localeNavigation.localizedSegments('public-offer');
  }
}
