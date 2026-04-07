import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClipboardService } from '@shared/ui';
import { LocaleNavigationService } from '@storefront/util';

declare const $localize: (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

type FooterLink = {
  label: string;
  routerLink: string[];
};

const footerText = {
  companyAbout: $localize`:@@footer.link.aboutCompany:Про компанію`,
  companyDelivery: $localize`:@@footer.link.deliveryAndPayment:Доставка та оплата`,
  companyReturns: $localize`:@@footer.link.returnsExchanges:Повернення та обмін`,
  companyContacts: $localize`:@@footer.link.contacts:Контакти`,
  infoGallery: $localize`:@@footer.link.gallery:Галерея та відео`,
  infoArticles: $localize`:@@footer.link.articles:Статті`,
  infoWholesale: $localize`:@@footer.link.wholesale:Співпраця`,
  legalOffer: $localize`:@@footer.link.publicOffer:Публічна оферта`,
  legalPrivacy: $localize`:@@footer.link.privacyPolicy:Політика конфіденційності`,
} as const;

@Component({
  selector: 'lib-footer',
  imports: [NgClass, NgOptimizedImage, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly clipboard = inject(ClipboardService);
  private readonly localeNavigation = inject(LocaleNavigationService);

  readonly companyLinks: FooterLink[] = [
    {
      label: footerText.companyAbout,
      routerLink: this.localeNavigation.localizedPath('/about-company'),
    },
    {
      label: footerText.companyDelivery,
      routerLink: this.localeNavigation.localizedPath('/delivery-and-payment'),
    },
    {
      label: footerText.companyReturns,
      routerLink: this.localeNavigation.localizedPath('/returns-exchanges'),
    },
    {
      label: footerText.companyContacts,
      routerLink: this.localeNavigation.localizedPath('/contacts'),
    },
  ];

  readonly accountLinks: FooterLink[] = [
    {
      label: footerText.infoGallery,
      routerLink: this.localeNavigation.localizedPath('/galleria'),
    },
    {
      label: footerText.infoArticles,
      routerLink: this.localeNavigation.localizedPath('/articles'),
    },
    {
      label: footerText.infoWholesale,
      routerLink: this.localeNavigation.localizedPath('/wholesale'),
    },
  ];

  readonly legalLinks: FooterLink[] = [
    {
      label: footerText.legalOffer,
      routerLink: this.localeNavigation.localizedPath('/public-offer'),
    },
    {
      label: footerText.legalPrivacy,
      routerLink: this.localeNavigation.localizedPath('/privacy-policy'),
    },
  ];

  copyToClipboard(value: string): void {
    void this.clipboard.copy(value);
  }
}
