import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';

@Component({
  selector: 'lib-privacy-policy',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy {
  constructor(private readonly localeNavigation: LocaleNavigationService) {}

  protected publicOfferLink(): string[] {
    return this.localeNavigation.localizedSegments('public-offer');
  }
}
