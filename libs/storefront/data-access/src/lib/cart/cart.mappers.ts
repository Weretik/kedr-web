import { CartLine } from './cart.types';
import { ProductBySlugDto, ProductListRowDto } from '../catalog';

const currency = 'UAH' as const;

function requirePrice(price: number | null): number {
  return price ?? 0;
}

export function cartLineFromListRow(dto: ProductListRowDto, qty = 1): CartLine {
  return {
    variantId: String(dto.id),
    qty: Math.max(1, Math.floor(qty)),
    snapshot: {
      title: dto.name,
      imageUrl: dto.photo,
      unitPrice: requirePrice(dto.price),
      currency,
    },
  };
}

export function cartLineFromBySlug(
  dto: ProductBySlugDto,
  qty: number,
): CartLine {
  return {
    variantId: String(dto.id),
    qty: Math.max(1, Math.floor(qty)),
    snapshot: {
      title: dto.name,
      imageUrl: dto.photo,
      unitPrice: requirePrice(dto.price),
      currency,
    },
  };
}
