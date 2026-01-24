import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { PanelMenu } from 'primeng/panelmenu';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';

import { ProductListFacade } from '../../pages/product-list/product-list.facade';

import type { ProductListSortUi } from '@storefront/util';

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
  ],
  templateUrl: './product-list-filters-bar.html',
  styleUrl: './product-list-filters-bar.css',
})
export class ProductListFiltersBar {
  @ViewChild('sortMenu') sortMenu!: Menu;
  readonly facade = inject(ProductListFacade);

  readonly minPrice = 0;
  readonly maxPrice = 100_000;

  readonly draftSearch = signal('');
  readonly draftSort = signal<ProductListSortUi>('name-asc');

  readonly draftInStock = signal(false);
  readonly draftIsSale = signal(false);
  readonly draftIsNew = signal(false);

  readonly draftPrice = signal<[number, number]>([
    this.minPrice,
    this.maxPrice,
  ]);

  sortOptions = [
    {
      label: 'Назва (а → я)',
      icon: 'pi pi-sort-amount-up',
      command: () => {
        this.facade.sort.set('name-asc');
        this.sortMenu.hide();
      },
    },
    {
      label: 'Назва (я → а)',
      icon: 'pi pi-sort-amount-down',
      command: () => {
        this.facade.sort.set('name-desc');
        this.sortMenu.hide();
      },
    },
    {
      label: 'Ціна (min → max)',
      icon: 'pi pi-sort-amount-up',
      command: () => {
        this.facade.sort.set('price-asc');
        this.sortMenu.hide();
      },
    },
    {
      label: 'Ціна (max → min)',
      icon: 'pi pi-sort-amount-down',
      command: () => {
        this.facade.sort.set('price-desc');
        this.sortMenu.hide();
      },
    },
  ];

  constructor() {
    effect(() => {
      this.draftSearch.set(this.facade.search() ?? '');
      this.draftSort.set(
        (this.facade.sort() ?? 'name-asc') as ProductListSortUi,
      );

      this.draftInStock.set(this.facade.inStock() === 'true');
      this.draftIsSale.set(this.facade.isSale() === 'true');
      this.draftIsNew.set(this.facade.isNew() === 'true');

      const fromPrice = this.toNum(this.facade.priceFrom()) ?? this.minPrice;
      const toPrice = this.toNum(this.facade.priceTo()) ?? this.maxPrice;
      this.draftPrice.set([fromPrice, toPrice]);
    });
  }

  onPriceRangeChange(value: [number, number]) {
    this.draftPrice.set(value);
  }

  onPriceFromChange(value: number | null) {
    const [, toPrice] = this.draftPrice();
    this.draftPrice.set([value ?? this.minPrice, toPrice]);
  }

  onPriceToChange(value: number | null) {
    const [fromPrice] = this.draftPrice();
    this.draftPrice.set([fromPrice, value ?? this.maxPrice]);
  }

  applyFilters() {
    this.facade.setSearch(this.draftSearch());
    this.facade.setSort(this.draftSort());

    this.facade.setInStock(this.draftInStock());
    this.facade.setIsSale(this.draftIsSale());
    this.facade.setIsNew(this.draftIsNew());

    const [fromPrice, toPrice] = this.draftPrice();
    this.facade.setPriceRange(fromPrice, toPrice);
  }

  private toNum(value: string | null): number | null {
    if (!value) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }
  protected readonly String = String;

  filtersMenu: MenuItem[] = [
    {
      label: 'Files',
      icon: 'pi pi-file',
      items: [
        {
          label: 'Images',
          icon: 'pi pi-image',
        },
      ],
    },
    {
      label: 'Cloud',
      icon: 'pi pi-cloud',
      items: [
        {
          label: 'Upload',
          icon: 'pi pi-cloud-upload',
        },
        {
          label: 'Download',
          icon: 'pi pi-cloud-download',
        },
        {
          label: 'Sync',
          icon: 'pi pi-refresh',
        },
      ],
    },
    {
      label: 'Devices',
      icon: 'pi pi-desktop',
      items: [
        {
          label: 'Phone',
          icon: 'pi pi-mobile',
        },
        {
          label: 'Desktop',
          icon: 'pi pi-desktop',
        },
        {
          label: 'Tablet',
          icon: 'pi pi-tablet',
        },
      ],
    },
  ];
}
