import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@shared/ui';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'lib-header',
  imports: [
    MegaMenu,
    ButtonModule,
    CommonModule,
    AvatarModule,
    NgOptimizedImage,
    RouterLink,
    Ripple,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',

  encapsulation: ViewEncapsulation.None,
})
export class Header {
  public readonly themeService = inject(ThemeService);
  public items: MegaMenuItem[] | undefined;

  public readonly megaMenuPt = {
    root: {
      style: {
        '--p-megamenu-submenu-label-color': 'var(--p-primary-500)',
      },
    },
    rootList: {
      style: {
        flexGrow: '1',
        justifyContent: 'center',
      },
    },
    button: {
      style: {
        flexGrow: '1',
        justifyContent: 'center',
      },
    },
    submenuLabel: {
      style: {
        flexGrow: '1',
        justifyContent: 'center',
      },
    },
    buttonIcon: {
      style: {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
  };

  ngOnInit() {
    this.themeService.init();

    this.items = [
      {
        label: 'Каталог',
        icon: 'pi pi-bookmark-fill',
        root: true,
        items: [
          [
            {
              label: 'Завіси',
              items: [
                { label: 'Накладні(метелик)' },
                { label: 'Ввертні та приварні' },
                { label: 'Врізні' },
              ],
            },
            {
              label: 'Замки',
              items: [
                { label: 'Навестні та велозамки' },
                { label: 'Комплекти з ручками' },
                { label: 'Накладні' },
                { label: 'Сувальдні та з хрестообр. ключем' },
                { label: 'Врiзні під циліндр' },
              ],
            },
          ],
          [
            {
              label: 'Ручки',
              items: [
                { label: 'На розетцi (Kevlar)' },
                { label: 'На розетцi (HRoz)' },
                { label: 'На розетцi (Genrich)' },
                { label: 'На розетцi (R-08, R-10)' },
                { label: 'На розетцi (Ultara)' },
                { label: 'З нержавiйки' },
                { label: 'Ручки-кноби' },
              ],
            },
            {
              label: 'Циліндри',
              items: [
                { label: 'серії BRASS KEY Латунь' },
                { label: 'серії SMART' },
                { label: 'серії GWK' },
                { label: 'серії ZINK під шток' },
                { label: 'серії ZINK PLK' },
                { label: 'серії ZINK' },
                { label: 'серії ALU' },
              ],
            },
          ],
          [
            {
              label: 'Міжкімнатні механізми',
              items: [
                { label: ' з магнітною защіпкою' },
                { label: 'заскочки / засувки' },
                { label: 'з металевою защіпкою' },
                { label: 'з кевларовою защіпкою' },
                { label: 'TV Stand', routerLink: ['/faq'] },
              ],
            },
            {
              label: 'Інше',
              items: [
                { label: 'Броненакладки на циліндр' },
                { label: 'Ущільнювач' },
                { label: 'Відбійники' },
                { label: 'Комплектуючі' },
                { label: 'Засувки і шпінгалети' },
                { label: 'Розсувнi системи' },
                { label: 'Дотягувачі' },
                { label: 'Вiчка двернi' },
              ],
            },
          ],
          [
            {
              label: 'Вхідні двері',
              items: [
                { label: 'Steelguard' },
                { label: 'Lacosta' },
                { label: 'Sova' },
                { label: 'MSM' },
                { label: 'Maximum' },
              ],
            },
            {
              label: 'Міжкімнатні двері',
              items: [
                { label: 'Korfad' },
                { label: 'Leador' },
                { label: 'Darumi' },
                { label: 'Syndicate' },
              ],
            },
          ],
        ],
      },
      {
        label: 'Про нас',
        icon: 'pi pi-exclamation-circle',
        root: true,
        items: [
          [
            {
              label: 'Корисне',
              items: [
                { label: 'Про компанію' },
                { label: 'Доставка та оплата' },
                { label: 'Повернення та обмім' },
                { label: 'Галерея та відео' },
                { label: 'Статті' },
                { label: 'Контакти' },
              ],
            },
          ],
          [
            {
              label: 'Регіони',
              items: [
                { label: 'Харків' },
                { label: 'Київ' },
                { label: 'Дніпро' },
                { label: 'Запоріжжя' },
                { label: 'Миколаїв' },
                { label: 'Одеса' },
                { label: 'Полтава' },
                { label: 'Кривий ріг' },
                { label: 'Миколаїв' },
                { label: 'Вінниця' },
                { label: 'Житомир' },
                { label: 'Біла церква' },
                { label: 'Суми' },
                { label: 'Чернігів' },
              ],
            },
          ],
          [
            {
              label: 'Юридична інформація',
              items: [
                { label: 'Угода користувача' },
                { label: 'Політика конфіденційності' },
                { label: 'Юридична інформація' },
                { label: 'Договір публічної оферти' },
              ],
            },
          ],
          [
            {
              items: [
                {
                  image:
                    'https://primefaces.org/cdn/primeng/images/uikit/uikit-system.png',
                  label: 'Замовити оптом',
                  routerLink: '/wholesale',
                  subtext: 'Умови співпраці для оптових партнерів',
                },
              ],
            },
          ],
        ],
      },
      {
        label: 'Замовити оптом',
        icon: 'pi pi-cart-plus',
        root: true,
        routerLink: '/wholesale',
      },
    ];
  }
}
