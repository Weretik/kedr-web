import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClipboardService } from '@shared/ui';

type FooterLink = {
  label: string;
  routerLink: string[];
};

@Component({
  selector: 'lib-footer',
  imports: [NgClass, NgOptimizedImage, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly clipboard = inject(ClipboardService);

  readonly companyLinks: FooterLink[] = [
    { label: 'Про компанію', routerLink: ['/about-company'] },
    { label: 'Доставка та оплата', routerLink: ['/delivery-and-payment'] },
    { label: 'Повернення та обмін', routerLink: ['/returns-exchanges'] },
    { label: 'Контакти', routerLink: ['/contacts'] },
  ];

  readonly accountLinks: FooterLink[] = [
    { label: 'Галерея та відео', routerLink: ['/galleria'] },
    { label: 'Статті', routerLink: ['/articles'] },
    { label: 'Співпраця', routerLink: ['/wholesale'] },
  ];

  readonly legalLinks: FooterLink[] = [
    { label: 'Публічна оферта', routerLink: ['/public-offer'] },
    { label: 'Політика конфіденційності', routerLink: ['/privacy-policy'] },
  ];
  copyToClipboard(value: string): void {
    void this.clipboard.copy(value);
  }
}
