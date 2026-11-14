'use client';

import { getCartTotals } from '@site/cart/model';
import { localizedPath } from '@site/core/i18n';
import { Button, Sheet, SheetContent, SheetDescription, SheetTitle } from '@site/shared/ui';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { CartEmpty } from './cart-empty';
import { CartLine } from './cart-line';
import { CheckoutLoading } from '../../checkout/form/checkout-loading';
import { getCartCopy } from '../../i18n/cart-copy';
import { formatCartCount, formatCartMoney } from '../../i18n/cart-format';
import { CartNotices } from '../status/cart-notices';

import type { CartDrawerProps } from './cart-ui-props';

export function CartDrawer(props: CartDrawerProps) {
  const {
    locale,
    lines,
    open,
    onOpenChange,
    onReturnFocus,
    onCheckout,
    restoring,
    pending,
    recovery,
    onChangeQuantity,
    onRemove,
  } = props;
  const copy = getCartCopy(locale);
  const { unitCount, goodsSubtotal } = getCartTotals(lines);
  const blocked = pending || restoring || recovery !== null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        closeLabel={copy.closeCart}
        className="h-dvh max-h-dvh w-full max-w-[30rem] min-h-0 gap-0 overflow-hidden p-0 [&>button]:top-3 [&>button]:right-3 [&>button]:size-11 [&>button]:p-2.5"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onReturnFocus();
        }}
      >
        <div className="shrink-0 border-b border-border p-5 pr-16">
          <SheetTitle className="text-2xl font-bold tracking-tight">{copy.cart}</SheetTitle>
          <SheetDescription className="mt-2 block text-sm text-muted-foreground not-sr-only">
            {restoring
              ? copy.cartLoading
              : `${copy.positions}: ${lines.length} · ${formatCartCount(locale, unitCount)} ${copy.units}`}
          </SheetDescription>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
          {restoring ? (
            <CheckoutLoading locale={locale} />
          ) : (
            <div className="grid gap-5">
              <CartNotices {...props} />
              {lines.length ? (
                <div>
                  {lines.map((line) => (
                    <CartLine
                      key={line.variantId}
                      locale={locale}
                      line={line}
                      disabled={blocked}
                      onChangeQuantity={onChangeQuantity}
                      onRemove={onRemove}
                    />
                  ))}
                </div>
              ) : (
                !recovery && <CartEmpty locale={locale} onContinue={() => onOpenChange(false)} />
              )}
            </div>
          )}
        </div>
        {!restoring && lines.length > 0 && (
          <div className="shrink-0 border-t border-border bg-background p-5">
            <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium">{copy.goodsTotal}</span>
              <strong className="min-w-0 text-2xl font-bold tracking-tight tabular-nums [overflow-wrap:anywhere]">
                {formatCartMoney(locale, goodsSubtotal)}
              </strong>
            </div>
            <p className="mt-2 mb-4 text-xs leading-relaxed text-muted-foreground">
              {copy.totalNote}
            </p>
            {blocked ? (
              <Button
                type="button"
                disabled
                className="h-auto min-h-12 w-full py-3 whitespace-normal"
              >
                {copy.checkoutAction}
                <ArrowRightIcon aria-hidden strokeWidth={1.75} />
              </Button>
            ) : (
              <Button asChild className="h-auto min-h-12 w-full py-3 whitespace-normal">
                <Link
                  href={localizedPath(locale, '/checkout')}
                  rel="nofollow"
                  onClick={() => {
                    onOpenChange(false);
                    onCheckout();
                  }}
                >
                  {copy.checkoutAction}
                  <ArrowRightIcon aria-hidden strokeWidth={1.75} />
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="mt-2 h-auto min-h-11 w-full py-2.5 whitespace-normal"
              onClick={() => onOpenChange(false)}
            >
              {copy.continueShopping}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
