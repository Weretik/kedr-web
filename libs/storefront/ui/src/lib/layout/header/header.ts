import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';

import { ThemeService } from '../../../../../../shared/ui/src/lib/services/theme.service';

@Component({
  selector: 'lib-header',
  imports: [
    MegaMenu,
    ButtonModule,
    CommonModule,
    AvatarModule,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',

  encapsulation: ViewEncapsulation.None,
})
export class Header {
  public readonly themeService = inject(ThemeService);
  public items: MegaMenuItem[] | undefined;

  public readonly megaMenuPt = {
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
        label: 'Фурнітура',
        icon: 'pi pi-box',
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
          ],
          [
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
          ],
          [
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
          ],
          [
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
        ],
      },
      {
        label: 'Двері',
        icon: 'pi pi-mobile',
        items: [
          [
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
          ],
        ],
      },
      {
        label: 'Sports',
        icon: 'pi pi-clock',
        items: [
          [
            {
              label: 'Football',
              items: [
                { label: 'Kits' },
                { label: 'Shoes' },
                { label: 'Shorts' },
                { label: 'Training' },
              ],
            },
          ],
          [
            {
              label: 'Running',
              items: [
                { label: 'Accessories' },
                { label: 'Shoes' },
                { label: 'T-Shirts' },
                { label: 'Shorts' },
              ],
            },
          ],
          [
            {
              label: 'Swimming',
              items: [
                { label: 'Kickboard' },
                { label: 'Nose Clip' },
                { label: 'Swimsuits' },
                { label: 'Paddles' },
              ],
            },
          ],
          [
            {
              label: 'Tennis',
              items: [
                { label: 'Balls' },
                { label: 'Rackets' },
                { label: 'Shoes' },
                { label: 'Training' },
              ],
            },
          ],
        ],
      },
    ];
  }
}
