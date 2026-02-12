import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@shared/ui';
import { CartFacade, CartUiFacade } from '@storefront/data-access';
import { Cart } from '@storefront/feature/cart';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Ripple } from 'primeng/ripple';

import { buildMenu } from './header.menu';

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
    Cart,
    BadgeModule,
    OverlayBadgeModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',

  encapsulation: ViewEncapsulation.None,
})
export class Header {
  public readonly themeService = inject(ThemeService);
  readonly cartUi = inject(CartUiFacade);
  readonly cart = inject(CartFacade);

  readonly items = buildMenu();

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
}
