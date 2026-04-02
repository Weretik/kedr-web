import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClipboardService, ThemeService } from '@shared/ui';
import { BrowserStorageService } from '@shared/util';
import {
  CartFacade,
  CartUiFacade,
  ProductListFacade,
} from '@storefront/data-access';
import { Cart } from '@storefront/feature/cart';
import { ProductListPageState } from '@storefront/feature/catalog';
import { SearchHistoryService } from '@storefront/util';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Popover } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';

import { buildMenu, type HeaderLocale } from './header.menu';

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
    Popover,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',

  encapsulation: ViewEncapsulation.None,
})
export class Header {
  private readonly localeStorageKey = 'storefront.locale';
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(BrowserStorageService);
  private readonly clipboard = inject(ClipboardService);
  public readonly themeService = inject(ThemeService);
  readonly cartUi = inject(CartUiFacade);
  readonly cart = inject(CartFacade);
  readonly facade = inject(ProductListFacade);
  readonly pageState = inject(ProductListPageState);
  readonly history = inject(SearchHistoryService);

  readonly isSticky = signal(false);
  readonly hasHistory = this.history.items;
  readonly currentLocale = signal<HeaderLocale>(this.detectLocale());

  constructor() {
    this.storage.setItem(this.localeStorageKey, this.currentLocale());
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 120);
  }

  readonly items = buildMenu();

  onSearch(value: string, popover?: Popover) {
    const search = value?.trim();
    if (search) {
      this.history.add(search);
    }

    popover?.hide();
    this.pageState.commitSearch(search);

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

  onSearchDraftChange(value: string, popover: Popover, event: Event): void {
    this.pageState.setSearchDraft(value);
    this.showSearchHistory(popover, event);
  }

  showSearchHistory(popover: Popover, event: Event): void {
    if (!this.hasHistory().length) {
      popover.hide();
      return;
    }

    popover.show(event);
  }

  useHistoryItem(value: string, popover: Popover): void {
    this.pageState.setSearchDraft(value);
    this.onSearch(value, popover);
  }

  removeHistoryItem(value: string, popover: Popover): void {
    this.history.removeOne(value);

    if (!this.hasHistory().length) {
      popover.hide();
    }
  }

  clearHistory(popover: Popover): void {
    this.history.clear();
    popover.hide();
  }

  copyToClipboard(value: string): void {
    void this.clipboard.copy(value);
  }

  switchLocale(locale: HeaderLocale): void {
    this.storage.setItem(this.localeStorageKey, locale);
    if (locale === this.currentLocale()) return;

    const location = this.document.location;
    if (!location) return;

    const path = location.pathname || '/';
    const withoutLocale = path.replace(/^\/(uk|ru)(?=\/|$)/, '') || '/';
    const normalizedPath = withoutLocale.startsWith('/')
      ? withoutLocale
      : `/${withoutLocale}`;
    const query = location.search || '';
    const hash = location.hash || '';

    location.assign(`/${locale}${normalizedPath}${query}${hash}`);
  }

  private detectLocale(): HeaderLocale {
    const path = this.document.location?.pathname || '';
    const match = path.match(/^\/(uk|ru)(?=\/|$)/);
    if (match?.[1] === 'uk' || match?.[1] === 'ru') {
      return match[1];
    }

    const savedLocale = this.storage.getItem(this.localeStorageKey);
    if (savedLocale === 'uk' || savedLocale === 'ru') {
      return savedLocale;
    }

    return 'uk';
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
