import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  signal,
  computed,
  input,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { PanelMenu } from 'primeng/panelmenu';
import { Popover } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { ToggleButton } from 'primeng/togglebutton';

import {
  buildFiltersMenu,
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
    PanelMenu,
    ProductList,
    ToggleButton,
    Popover,
  ],
  templateUrl: './product-list-filters-bar.html',
  styleUrl: './product-list-filters-bar.css',
})
export class ProductListFiltersBar {
  readonly facade = inject(ProductListFacade);
  readonly pageState = inject(ProductListPageState);
  readonly router = inject(Router);

  readonly categorySlug = input<string | null>(null);

  readonly isSticky = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky.set(window.scrollY > 200);
  }

  readonly categoryPath = computed(
    () => findCategoryPath(this.categorySlug()) ?? [],
  );
  readonly panelMenuPt = {
    itemContent: (options: PanelMenuItemLabelPtOptions) => ({
      class: this.isActiveCategory(options.context?.item)
        ? 'bg-primary/10 rounded-md'
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

  readonly sortOptions = buildSortMenu({
    setSort: (sort) => this.pageState.setSort(sort),
  });

  readonly filtersMenu = computed(() =>
    buildFiltersMenu(
      {
        goToCategory: (slug) => this.pageState.goToCategory(slug),
      },
      this.categorySlug(),
    ),
  );

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
    void this.router.navigate(['/']);
  }

  public goToCategoryBySlug(slug: string) {
    this.pageState.goToCategory(slug);
  }

  public onPanelMenuLabelClick(event: Event, item?: MenuItem) {
    event.preventDefault();
    event.stopPropagation();

    const slug = this.getItemSlug(item);
    if (!slug) return;

    this.pageState.goToCategory(slug);
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
  protected readonly String = String;
}
