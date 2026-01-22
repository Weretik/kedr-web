import { Component, computed, inject } from '@angular/core';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

import { InStockFacade } from './in-stock.facade';

interface Products {
  name: string;
  description: string;
  price: number;
  image: string;
  buttons: ProductButton[];
}
interface ProductButton {
  label: string;
  routeLink?: string;
}

@Component({
  selector: 'lib-in-stock-products',
  imports: [ButtonDirective, ButtonLabel],
  templateUrl: './in-stock-products.html',
  styleUrl: './in-stock-products.css',
})
export class InStockProducts {
  public productList: Products[] = [
    {
      name: 'Golden Nectar Elixir',
      description: 'Premium Green Nectar, 750ml',
      price: 250.5,
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/gridlist/grid-centered.jpg',
      buttons: [{ label: 'Add to Cart' }, { label: 'Buy Now' }],
    },
    {
      name: 'Ferrari Replica',
      description: 'Collectible Model Car',
      price: 350.5,
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/gridlist/grid-centered-1.jpg',
      buttons: [{ label: 'Add to Cart' }, { label: 'Buy Now' }],
    },
    {
      name: 'Game Boy Color',
      description: 'Classic Handheld Console',
      price: 450.5,
      image:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/gridlist/grid-centered-2.jpg',
      buttons: [{ label: 'Add to Cart' }, { label: 'Buy Now' }],
    },
  ];
  readonly productsBlockFacade = inject(InStockFacade);
  readonly productsResource = this.productsBlockFacade.productsResource;

  readonly products = computed(
    () => this.productsResource.value()?.value ?? [],
  );
}
