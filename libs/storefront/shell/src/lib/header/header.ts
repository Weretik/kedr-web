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
import { BrowserSessionStorageService } from '@shared/util';
import {
  CartFacade,
  CartUiFacade,
  ProductListFacade,
} from '@storefront/data-access';
import { Cart } from '@storefront/feature/cart';
import { ProductListPageState } from '@storefront/feature/catalog';
import {
  LocaleNavigationService,
  SearchHistoryService,
} from '@storefront/util';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { Popover } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';

import { HeaderActionsComponent } from './components/header-actions/header-actions';
import { HeaderContactsComponent } from './components/header-contacts/header-contacts';
import { HeaderSearchComponent } from './components/header-search/header-search';
import { buildMenu, type HeaderLocale } from './header.menu';

@Component({
  selector: 'lib-header',
  imports: [
    MegaMenu,
    ButtonModule,
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    Ripple,
    Cart,
    HeaderContactsComponent,
    HeaderSearchComponent,
    HeaderActionsComponent,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',

  encapsulation: ViewEncapsulation.None,
})
export class Header {
  private readonly localeScrollYKey = 'storefront.locale.scrollY';
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly sessionStorage = inject(BrowserSessionStorageService);
  private readonly clipboard = inject(ClipboardService);
  public readonly themeService = inject(ThemeService);
  readonly cartUi = inject(CartUiFacade);
  readonly cart = inject(CartFacade);
  readonly facade = inject(ProductListFacade);
  readonly pageState = inject(ProductListPageState);
  readonly history = inject(SearchHistoryService);

  readonly isSticky = signal(false);
  readonly hasHistory = this.history.items;
  readonly currentLocale = signal<HeaderLocale>(
    this.localeNavigation.getCurrentLocale(),
  );

  constructor() {
    this.localeNavigation.saveLocale(this.currentLocale());
    this.restoreScrollAfterLocaleSwitch();
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

    this.router.navigate(
      this.localeNavigation.localizedSegments('catalog', 'products'),
      {
        queryParams: {
          search: search || null,
          page: 1,
        },
      },
    );
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
    this.localeNavigation.saveLocale(locale);
    if (locale === this.currentLocale()) return;

    const location = this.document.location;
    if (!location) return;

    const path = location.pathname || '/';
    const normalizedPath = this.localeNavigation.stripLocalePrefix(path);
    const query = location.search || '';
    const hash = location.hash || '';

    this.sessionStorage.setItem(this.localeScrollYKey, String(window.scrollY));
    location.assign(`/${locale}${normalizedPath}${query}${hash}`);
  }

  private restoreScrollAfterLocaleSwitch(): void {
    const rawScrollY = this.sessionStorage.getItem(this.localeScrollYKey);
    if (!rawScrollY) return;

    this.sessionStorage.removeItem(this.localeScrollYKey);
    const scrollY = Number(rawScrollY);
    if (!Number.isFinite(scrollY) || scrollY < 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'auto' });
      });
    });
  }

  public readonly megaMenuPt = HEADER_MEGA_MENU_PT;
}
