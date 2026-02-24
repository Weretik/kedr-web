import {
  ProductListRowDto,
  ProductBySlugDto,
  CartLine,
} from '@storefront/contracts';

const currency = 'UAH' as const;

function requirePrice(price: number | null): number {
  return price ?? 0;
}

export function cartLineFromListRow(dto: ProductListRowDto, qty = 1): CartLine {
  return {
    variantId: String(dto.id),
    quantity: Math.max(1, Math.floor(qty)),
    snapshot: {
      title: dto.name,
      imageUrl: dto.photo,
      unitPrice: requirePrice(dto.price),
      currency,
      slug: dto.productSlug,
    },
  };
}

export function cartLineFromBySlug(
  dto: ProductBySlugDto,
  qty: number,
): CartLine {
  return {
    variantId: String(dto.id),
    quantity: Math.max(1, Math.floor(qty)),
    snapshot: {
      title: dto.name,
      imageUrl: dto.photo,
      unitPrice: requirePrice(dto.price),
      currency,
      slug: '',
    },
  };
}
