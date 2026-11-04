'use client';

import { Button } from '@site/shared/ui';
import { CheckIcon, ShoppingCartIcon } from 'lucide-react';

import { CartQuantity } from '../cart/cart-quantity';
import { getCartCopy } from '../i18n/cart-copy';
import { cartMessage } from '../i18n/cart-messages';

import type { CartPurchaseControlProps } from '../types/cart-ui-props';

export function CartPurchaseControl({
  locale,
  quantity,
  onQuantityChange,
  onAdd,
  disabled,
  added,
  message,
}: CartPurchaseControlProps) {
  const copy = getCartCopy(locale);
  return (
    <div className="min-w-0">
      <div className="grid min-w-0 grid-cols-[8.5rem_minmax(0,1fr)] items-start gap-2.5">
        <CartQuantity
          locale={locale}
          quantity={quantity}
          onChange={onQuantityChange}
          disabled={disabled}
        />
        <Button
          type="button"
          disabled={disabled}
          onClick={onAdd}
          className="h-auto min-h-12 min-w-0 px-3 py-3 whitespace-normal"
        >
          {added ? (
            <CheckIcon aria-hidden strokeWidth={1.75} />
          ) : (
            <ShoppingCartIcon aria-hidden strokeWidth={1.75} />
          )}
          {added ? copy.added : copy.add}
        </Button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className="mt-2 text-sm text-muted-foreground empty:hidden [overflow-wrap:anywhere]"
      >
        {message ? cartMessage(locale, message) : added ? copy.added : ''}
      </p>
    </div>
  );
}
