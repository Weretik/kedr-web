import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ClipboardService } from '@shared/ui';
import { LocaleNavigationService } from '@storefront/util';

type FooterLink = {
  labelKey: string;
  routerLink: string[];
};

@Component({
  selector: 'lib-footer',
  imports: [NgClass, NgOptimizedImage, RouterLink, TranslocoPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly clipboard = inject(ClipboardService);
  private readonly localeNavigation = inject(LocaleNavigationService);

  readonly companyLinks: FooterLink[] = [
    {
      labelKey: 'footer.link.aboutCompany',
      routerLink: this.localeNavigation.localizedPath('/about-company'),
    },
    {
      labelKey: 'footer.link.deliveryAndPayment',
      routerLink: this.localeNavigation.localizedPath('/delivery-and-payment'),
    },
    {
      labelKey: 'footer.link.returnsExchanges',
      routerLink: this.localeNavigation.localizedPath('/returns-exchanges'),
    },
    {
      labelKey: 'footer.link.contacts',
      routerLink: this.localeNavigation.localizedPath('/contacts'),
    },
  ];

  readonly accountLinks: FooterLink[] = [
    {
      labelKey: 'footer.link.gallery',
      routerLink: this.localeNavigation.localizedPath('/galleria'),
    },
    {
      labelKey: 'footer.link.articles',
      routerLink: this.localeNavigation.localizedPath('/articles'),
    },
    {
      labelKey: 'footer.link.wholesale',
      routerLink: this.localeNavigation.localizedPath('/wholesale'),
    },
  ];

  readonly legalLinks: FooterLink[] = [
    {
      labelKey: 'footer.link.publicOffer',
      routerLink: this.localeNavigation.localizedPath('/public-offer'),
    },
    {
      labelKey: 'footer.link.privacyPolicy',
      routerLink: this.localeNavigation.localizedPath('/privacy-policy'),
    },
  ];

  copyToClipboard(value: string): void {
    void this.clipboard.copy(value);
  }
}
