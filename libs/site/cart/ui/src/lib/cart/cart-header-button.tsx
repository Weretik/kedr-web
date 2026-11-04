'use client';

import { Button, cn } from '@site/shared/ui';
import { ShoppingCartIcon } from 'lucide-react';

import { getCartCopy } from '../i18n/cart-copy';
import { formatCartCount, formatCartMoney } from '../shared/cart-format';

import type { CartHeaderButtonProps } from '../types/cart-ui-props';

export function CartHeaderButton({
  locale,
  compact = false,
  unitCount,
  goodsSubtotal,
  restoring,
  open,
  onOpen,
}: CartHeaderButtonProps) {
  const copy = getCartCopy(locale);
  const label = restoring
    ? copy.headerLoading
    : `${copy.cart}: ${formatCartCount(locale, unitCount)} ${copy.units}, ${formatCartMoney(locale, goodsSubtotal)}`;
  return (
    <Button
      type="button"
      variant={compact ? 'ghost' : 'outline'}
      data-cart-trigger={compact ? 'compact' : 'main'}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-busy={restoring}
      onClick={(event) => onOpen(event.currentTarget)}
      className={cn('h-11 min-w-11 gap-2 px-2.5', compact && 'px-2')}
    >
      <ShoppingCartIcon aria-hidden strokeWidth={1.75} />
      {!compact && <span className="hidden sm:inline">{copy.cart}</span>}
      {restoring ? (
        <span aria-hidden className="size-5 rounded-full bg-muted motion-safe:animate-pulse" />
      ) : (
        unitCount > 0 && (
          <span
            aria-hidden
            className="min-w-5 rounded-full bg-brand px-1 text-xs leading-5 font-semibold text-brand-foreground tabular-nums"
          >
            {formatCartCount(locale, unitCount)}
          </span>
        )
      )}
      {!compact && !restoring && (
        <span aria-hidden className="hidden font-semibold tabular-nums xl:inline">
          {formatCartMoney(locale, goodsSubtotal)}
        </span>
      )}
    </Button>
  );
}
