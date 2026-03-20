import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
    { label: 'Реквізити', routerLink: ['/requisites'] },
  ];
}
