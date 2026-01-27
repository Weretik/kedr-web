import { NgClass } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';

import { ProductListFacade } from '../../pages/product-list/product-list.facade';

@Component({
  selector: 'lib-product-list',
  imports: [DataView, SelectButton, NgClass, Tag, ButtonDirective, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  layout: 'list' | 'grid' = 'list';
  options: string[] = ['list', 'grid'];
  readonly productListFacade = inject(ProductListFacade);
  readonly productsResource = this.productListFacade.productsResource;

  readonly products = computed(
    () => this.productsResource.value()?.value ?? [],
  );

  readonly pagedInfo = computed(() => this.productsResource.value()?.pagedInfo);
}
