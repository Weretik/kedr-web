'use client';

import { Button } from '@site/shared/ui';
import { ShoppingCartIcon } from 'lucide-react';

import { getCartCopy } from '../i18n/cart-copy';

import type { CartQuickAddButtonProps } from '../cart/cart-ui-props';

/** One-tap «У кошик» for listing cards and rows; the cart drawer opens with the result. */
export function CartQuickAddButton({ locale, title, onAdd, disabled }: CartQuickAddButtonProps) {
  const copy = getCartCopy(locale);
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={disabled}
      onClick={(event) => onAdd(event.currentTarget)}
      aria-label={`${copy.add}: ${title}`}
      className="relative z-10 h-9"
    >
      <ShoppingCartIcon aria-hidden strokeWidth={1.75} />
      {copy.add}
    </Button>
  );
}
