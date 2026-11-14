'use client';

import { MAX_CART_QUANTITY } from '@site/cart/model';
import { Button, cn } from '@site/shared/ui';
import { ShoppingCartIcon } from 'lucide-react';
import Link from 'next/link';

import { getCartCopy } from '../i18n/cart-copy';
import { cartMessage } from '../i18n/cart-messages';

import type { CartBulkAddTableProps } from '../cart/cart-ui-props';

/** All variants of a model with a quantity each and one «add selected» (spec site/product/002 D-05). */
export function CartBulkAddTable({
  locale,
  rows,
  quantities,
  onQuantityChange,
  onAdd,
  disabled,
  message,
}: CartBulkAddTableProps) {
  const copy = getCartCopy(locale);
  return (
    <div className="min-w-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th scope="col" className="py-2 pr-3 font-medium">
                {copy.variant}
              </th>
              <th scope="col" className="py-2 pr-3 text-right font-medium">
                {copy.price}
              </th>
              <th scope="col" className="w-28 py-2 text-right font-medium">
                {copy.quantity}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={cn('border-b border-border last:border-0', row.current && 'bg-muted/50')}
              >
                <td className="py-2.5 pr-3">
                  <Link
                    href={row.href}
                    scroll={false}
                    aria-current={row.current ? 'true' : undefined}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {row.details || row.title}
                  </Link>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {copy.sku} {row.id}
                    {!row.purchasable && ` · ${copy.notInStock}`}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-right whitespace-nowrap tabular-nums">
                  {row.price ?? '—'}
                </td>
                <td className="py-2.5 text-right">
                  {row.purchasable ? (
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={MAX_CART_QUANTITY}
                      step={1}
                      aria-label={`${copy.quantity}: ${row.title}`}
                      disabled={disabled}
                      value={quantities[row.id] ?? 0}
                      onChange={(event) => {
                        const value = Number(event.currentTarget.value);
                        if (Number.isInteger(value) && value >= 0 && value <= MAX_CART_QUANTITY)
                          onQuantityChange(row.id, value);
                      }}
                      className="h-10 w-20 rounded-md border border-input bg-background px-2 text-right tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" disabled={disabled} onClick={(event) => onAdd(event.currentTarget)}>
          <ShoppingCartIcon aria-hidden strokeWidth={1.75} />
          {copy.bulkAdd}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground empty:hidden">
          {message ? cartMessage(locale, message) : ''}
        </p>
      </div>
    </div>
  );
}
