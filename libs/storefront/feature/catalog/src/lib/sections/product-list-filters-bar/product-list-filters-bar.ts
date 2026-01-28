import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';

import { buildFiltersMenu } from './product-list-filters.menu';
import { buildSortMenu } from './product-list-sort.sort-options';
import { ProductListFacade } from '../../state/product-list/product-list.facade';
import { ProductList } from '../product-list/product-list';

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
  ],
  templateUrl: './product-list-filters-bar.html',
  styleUrl: './product-list-filters-bar.css',
})
export class ProductListFiltersBar {
  readonly facade = inject(ProductListFacade);

  readonly minPrice = 0;
  readonly maxPrice = 50_000;

  readonly draftInStock = signal(false);
  readonly draftIsSale = signal(false);
  readonly draftIsNew = signal(false);
  readonly draftPrice = signal<[number | null, number | null]>([null, null]);

  readonly sortOptions = buildSortMenu({
    setSort: (sort) => this.facade.queryState.setSort(sort),
  });
  readonly filtersMenu = buildFiltersMenu({
    goToCategory: (slug) => this.facade.queryState.goToCategory(slug),
  });

  private readonly draftSets = effect(() => {
    this.draftInStock.set(this.facade.queryState.inStock() === 'true');
    this.draftIsSale.set(this.facade.queryState.isSale() === 'true');
    this.draftIsNew.set(this.facade.queryState.isNew() === 'true');

    const fromPrice = this.toNum(this.facade.queryState.priceFrom()) ?? null;
    const toPrice = this.toNum(this.facade.queryState.priceTo()) ?? null;
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
    this.facade.queryState.setInStock(this.draftInStock());
    this.facade.queryState.setIsSale(this.draftIsSale());
    this.facade.queryState.setIsNew(this.draftIsNew());

    const [fromPrice, toPrice] = this.draftPrice();
    this.facade.queryState.setPriceRange(fromPrice, toPrice);
  }

  private toNum(value: string | null): number | null {
    if (!value) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  protected readonly String = String;
}
