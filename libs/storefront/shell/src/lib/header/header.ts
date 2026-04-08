import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ClipboardService, ThemeService } from '@shared/ui';
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
import { MegaMenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { Popover } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';

import { HeaderActionsComponent } from './components/header-actions/header-actions';
import { HeaderContactsComponent } from './components/header-contacts/header-contacts';
import { HeaderSearchComponent } from './components/header-search/header-search';
import { HEADER_MEGA_MENU_PT } from './header.mega-menu.pt';
import { buildMenu, type HeaderLocale } from './header.menu';

@Component({
  selector: 'lib-header',
  imports: [
    MegaMenu,
    ButtonModule,
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    TranslocoPipe,
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
  private readonly router = inject(Router);
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly transloco = inject(TranslocoService);
  private readonly clipboard = inject(ClipboardService);
  public readonly themeService = inject(ThemeService);
  readonly cartUi = inject(CartUiFacade);
  readonly cart = inject(CartFacade);
  readonly facade = inject(ProductListFacade);
  readonly pageState = inject(ProductListPageState);
  readonly history = inject(SearchHistoryService);

  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly isSticky = signal(false);
  readonly hasHistory = this.history.items;
  readonly currentLocale = signal<HeaderLocale>(
    this.localeNavigation.getCurrentLocale(),
  );

  constructor() {
    this.localeNavigation.saveLocale(this.currentLocale());
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 120);
  }

  readonly items = computed<MegaMenuItem[]>(() => {
    this.activeLang();
    return this.buildMenuItems();
  });

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
    if (locale === this.currentLocale()) return;

    this.currentLocale.set(locale);
    this.transloco.setActiveLang(locale);
    this.localeNavigation.saveLocale(locale);
    const localizedUrl = this.localeNavigation.localizedUrlForLocale(
      this.router.url,
      locale,
    );
    void this.router.navigateByUrl(localizedUrl);
  }

  private buildMenuItems(): MegaMenuItem[] {
    return buildMenu(
      (translationKey) => this.transloco.translate(translationKey),
      this.currentLocale(),
    );
  }

  public readonly megaMenuPt = HEADER_MEGA_MENU_PT;
}
