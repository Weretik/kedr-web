import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  signal,
  computed,
  input,
  HostListener,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ProductListFacade } from '@storefront/data-access';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Popover } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ToggleButton } from 'primeng/togglebutton';

import {
  buildFiltersMenu,
  collectExpandedState,
  findCategoryPath,
} from './product-list-filters.menu';
import { buildSortMenu } from './product-list-sort.sort-options';
import { ProductListPageState } from '../../pages/product-list/product-list.page-state';
import { ProductList } from '../product-list/product-list';

import type { MenuItem } from 'primeng/api';

type PanelMenuItemLabelPtOptions = {
  context?: {
    item?: MenuItem;
  };
};

@Component({
  selector: 'lib-product-list-filters-bar',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    SliderModule,
    AccordionModule,
    BadgeModule,
    ButtonDirective,
    ButtonLabel,
    MenuModule,
    ButtonIcon,
    PanelMenuModule,
    ProductList,
    ToggleButton,
    Popover,
    TranslocoPipe,
  ],
  templateUrl: './product-list-filters-bar.html',
  styleUrl: './product-list-filters-bar.css',
})
export class ProductListFiltersBar {
  readonly facade = inject(ProductListFacade);
  readonly pageState = inject(ProductListPageState);
  readonly transloco = inject(TranslocoService);

  readonly categorySlug = input<string | null>(null);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly isSticky = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 200);
  }

  readonly categoryPath = computed(() => {
    return findCategoryPath(this.categorySlug(), this.filtersMenu()) ?? [];
  });
  readonly panelMenuPt = {
    itemContent: (options: PanelMenuItemLabelPtOptions) => ({
      class: this.isActiveCategory(options.context?.item)
        ? 'ring-1 ring-primary rounded-md'
        : undefined,
    }),
    itemLabel: (options: PanelMenuItemLabelPtOptions) => ({
      class: this.isActiveCategory(options.context?.item)
        ? 'text-primary font-semibold'
        : undefined,
      onClick: (event: Event) =>
        this.onPanelMenuLabelClick(
          event,
          options.context?.item as MenuItem | undefined,
        ),
    }),
  };

  readonly draftInStock = signal(true);
  readonly draftIsSale = signal(false);
  readonly draftIsNew = signal(false);
  readonly draftPrice = signal<[number | null, number | null]>([null, null]);

  readonly sortOptions = computed(() => {
    this.activeLang();
    return buildSortMenu({
      setSort: (sort) => this.pageState.setSort(sort),
      translate: (key) => this.transloco.translate(key),
    });
  });

  readonly filtersMenu = signal<MenuItem[]>(
    buildFiltersMenu(
      {
        goToCategory: (slug) => this.pageState.goToCategory(slug),
      },
      (key) => this.transloco.translate(key),
      {},
    ),
  );

  private readonly syncFiltersMenu = effect(() => {
    this.activeLang();
    this.categorySlug();
    const expandedState = collectExpandedState(
      untracked(() => this.filtersMenu()),
    );
    this.filtersMenu.set(
      buildFiltersMenu(
        {
          goToCategory: (nextSlug) => this.pageState.goToCategory(nextSlug),
        },
        (key) => this.transloco.translate(key),
        expandedState,
      ),
    );
  });

  private readonly syncCategorySlug = effect(() => {
    this.facade.setCategorySlug(this.categorySlug());
  });

  private readonly draftSets = effect(() => {
    this.draftInStock.set(this.pageState.inStock() === 'true');
    this.draftIsSale.set(this.pageState.isSale() === 'true');
    this.draftIsNew.set(this.pageState.isNew() === 'true');

    const fromPrice = this.toNum(this.pageState.priceFrom()) ?? null;
    const toPrice = this.toNum(this.pageState.priceTo()) ?? null;
    this.draftPrice.set([fromPrice, toPrice]);
  });

  public onPriceRangeChange(value: [number, number]) {
    this.draftPrice.set(value);
  }

  public onPriceFromChange(value: number | null) {
    const [, toPrice] = this.draftPrice();
    this.draftPrice.set([value ?? null, toPrice]);
  }

  public onPriceToChange(value: number | null) {
    const [fromPrice] = this.draftPrice();
    this.draftPrice.set([fromPrice, value ?? null]);
  }

  public applyFilters() {
    this.pageState.setInStock(this.draftInStock());
    this.pageState.setIsSale(this.draftIsSale());
    this.pageState.setIsNew(this.draftIsNew());

    const [fromPrice, toPrice] = this.draftPrice();
    this.pageState.setPriceRange(fromPrice, toPrice);
  }

  public setSaleFilter(value: boolean) {
    this.draftIsSale.set(value);
    this.pageState.setIsSale(value);
  }

  public setNewFilter(value: boolean) {
    this.draftIsNew.set(value);
    this.pageState.setIsNew(value);
  }

  public setInStockFilter(value: boolean) {
    this.draftInStock.set(value);
    this.pageState.setInStock(value);
  }
  public clearFilters() {
    this.pageState.clear();
  }

  public goToAllProducts() {
    this.pageState.goToLocaleHome();
  }

  public goToCategoryBySlug(slug: string) {
    this.pageState.goToCategory(slug);
  }

  public onPanelMenuLabelClick(event: Event, item?: MenuItem) {
    const slug = this.getItemSlug(item);
    if (slug) {
      event.preventDefault();
      event.stopPropagation();
      this.pageState.goToCategory(slug);
      return;
    }

    const command = item?.command as
      | ((args: { originalEvent: Event; item: MenuItem | undefined }) => void)
      | undefined;
    if (!command) return;

    event.preventDefault();
    event.stopPropagation();
    command({ originalEvent: event, item });
  }

  private getItemSlug(item?: MenuItem): string | null {
    return (
      (item as { categorySlug?: string } | undefined)?.categorySlug ?? null
    );
  }

  private isActiveCategory(item?: MenuItem): boolean {
    const itemSlug = this.getItemSlug(item);
    return !!itemSlug && itemSlug === this.categorySlug();
  }

  private toNum(value: string | null): number | null {
    if (!value) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
}
