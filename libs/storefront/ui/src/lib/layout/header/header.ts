import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '@shared/ui';
import {
  CartFacade,
  CartUiFacade,
  ProductListFacade,
} from '@storefront/data-access';
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
  private readonly router = inject(Router);
  public readonly themeService = inject(ThemeService);
  readonly cartUi = inject(CartUiFacade);
  readonly cart = inject(CartFacade);
  readonly facade = inject(ProductListFacade);

  readonly isSticky = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 120);
  }

  readonly items = buildMenu();

  onSearch(value: string) {
    const search = value?.trim();
    this.facade.queryState.commitSearch(search);

    if (this.router.url.includes('/products')) {
      return;
    }

    this.router.navigate(['/catalog', 'products'], {
      queryParams: {
        search: search || null,
        page: 1,
      },
    });
  }

  public readonly megaMenuPt = {
    root: {
      style: {
        '--p-megamenu-submenu-label-color': 'var(--p-primary-500)',
        padding: '0.25rem 1.25rem',
        'z-index': '1000',
      },
    },
    submenu: {
      style: {
        'z-index': '1000',
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
