import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClipboardService } from '@shared/ui';

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

  readonly companyLinks: FooterLink[] = [
    { label: footerText.companyAbout, routerLink: ['/about-company'] },
    {
      label: footerText.companyDelivery,
      routerLink: ['/delivery-and-payment'],
    },
    { label: footerText.companyReturns, routerLink: ['/returns-exchanges'] },
    { label: footerText.companyContacts, routerLink: ['/contacts'] },
  ];

  readonly accountLinks: FooterLink[] = [
    { label: footerText.infoGallery, routerLink: ['/galleria'] },
    { label: footerText.infoArticles, routerLink: ['/articles'] },
    { label: footerText.infoWholesale, routerLink: ['/wholesale'] },
  ];

  readonly legalLinks: FooterLink[] = [
    { label: footerText.legalOffer, routerLink: ['/public-offer'] },
    { label: footerText.legalPrivacy, routerLink: ['/privacy-policy'] },
  ];

  copyToClipboard(value: string): void {
    void this.clipboard.copy(value);
  }
}
